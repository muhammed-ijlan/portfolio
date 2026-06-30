import { connectDB } from "@/lib/db";
import { fail, handleError, ok } from "@/lib/api-helpers";
import { Message } from "@/lib/models/Message";
import { Settings } from "@/lib/models/Settings";
import { About } from "@/lib/models/About";
import { sendContactNotification } from "@/lib/email";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

/** Recipient for contact notifications: admin setting → env → public contact email. */
async function resolveRecipient(): Promise<string> {
  const [settings, about] = await Promise.all([
    Settings.findOne({ key: "singleton" }).lean<{ notifyEmail?: string }>(),
    About.findOne({ key: "singleton" }).lean<{ email?: string }>(),
  ]);
  return (
    settings?.notifyEmail?.trim() ||
    process.env.CONTACT_NOTIFY_EMAIL?.trim() ||
    about?.email?.trim() ||
    ""
  );
}

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const MAX = { name: 120, email: 200, subject: 160, message: 4000 };

export async function POST(req: Request) {
  try {
    const body = await req.json().catch(() => ({}));
    const name = String(body?.name ?? "").trim();
    const email = String(body?.email ?? "").trim();
    const subject = String(body?.subject ?? "").trim();
    const message = String(body?.message ?? "").trim();
    const honeypot = String(body?.website ?? "").trim();

    if (honeypot) return ok({ delivered: true });

    const errors: Record<string, string> = {};
    if (!name) errors.name = "Please enter your name";
    if (!email) errors.email = "Please enter your email";
    else if (!EMAIL_RE.test(email)) errors.email = "Enter a valid email address";
    if (!subject) errors.subject = "Add a subject";
    if (!message) errors.message = "Write a short message";
    else if (message.length < 10) errors.message = "A little more detail, please";

    for (const [k, v] of Object.entries({ name, email, subject, message })) {
      if (v.length > MAX[k as keyof typeof MAX]) errors[k] = "Too long";
    }

    if (Object.keys(errors).length) {
      return fail("Validation failed", 422, errors);
    }

    await connectDB();
    const doc = await Message.create({
      name,
      email,
      subject,
      message,
      status: "new",
      starred: false,
      date: new Date().toISOString(),
    });

    // Email the owner. Failures are logged but never fail the submission —
    // the message is already saved and visible in the admin inbox.
    const recipient = await resolveRecipient();
    const mail = await sendContactNotification(recipient, { name, email, subject, message });

    return ok({ delivered: true, id: doc.id, emailed: mail.sent }, { status: 201 });
  } catch (e) {
    return handleError(e);
  }
}
