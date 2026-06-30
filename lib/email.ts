import { Resend } from "resend";

const API_KEY = process.env.RESEND_API_KEY;
// Resend requires the `from` domain to be verified. Until you verify ijlan.dev,
// "onboarding@resend.dev" works but can only deliver to the Resend account owner.
const FROM = process.env.RESEND_FROM || "Portfolio <onboarding@resend.dev>";

export type ContactPayload = {
  name: string;
  email: string;
  subject: string;
  message: string;
};

export type EmailResult =
  | { sent: true; id?: string }
  | { sent: false; reason: "not_configured" | "no_recipient" | "send_failed" };

const esc = (s: string) =>
  s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");

/**
 * Notify the site owner of a new contact-form submission.
 * Never throws — a mail failure must not break the visitor's form submit.
 * `replyTo` is the sender, so hitting Reply answers them directly.
 */
export async function sendContactNotification(
  to: string,
  payload: ContactPayload
): Promise<EmailResult> {
  if (!API_KEY) {
    console.warn("[email] RESEND_API_KEY not set — skipping contact notification");
    return { sent: false, reason: "not_configured" };
  }
  if (!to) {
    console.warn("[email] No notification recipient configured — skipping");
    return { sent: false, reason: "no_recipient" };
  }

  const { name, email, subject, message } = payload;

  try {
    const resend = new Resend(API_KEY);
    const { data, error } = await resend.emails.send({
      from: FROM,
      to,
      replyTo: email,
      subject: `Portfolio enquiry: ${subject}`,
      text: `New message from your portfolio contact form

From:    ${name} <${email}>
Subject: ${subject}

${message}

— Reply to this email to respond directly to ${name}.`,
      html: `<div style="font-family:ui-sans-serif,system-ui,-apple-system,Segoe UI,Roboto,sans-serif;max-width:560px;margin:0 auto;color:#0f172a">
  <div style="background:linear-gradient(135deg,#22D3EE,#7C3AED);padding:20px 24px;border-radius:12px 12px 0 0">
    <div style="color:#04060a;font-weight:700;font-size:15px">New portfolio enquiry</div>
  </div>
  <div style="border:1px solid #e2e8f0;border-top:0;border-radius:0 0 12px 12px;padding:24px">
    <table style="width:100%;font-size:14px;border-collapse:collapse">
      <tr><td style="color:#64748b;padding:4px 0;width:80px">From</td><td style="padding:4px 0;font-weight:600">${esc(name)} &lt;<a href="mailto:${esc(email)}" style="color:#0891b2">${esc(email)}</a>&gt;</td></tr>
      <tr><td style="color:#64748b;padding:4px 0">Subject</td><td style="padding:4px 0;font-weight:600">${esc(subject)}</td></tr>
    </table>
    <div style="margin-top:16px;padding:16px;background:#f8fafc;border:1px solid #e2e8f0;border-radius:10px;white-space:pre-wrap;line-height:1.6;font-size:14px">${esc(message)}</div>
    <p style="margin-top:16px;color:#94a3b8;font-size:12px">Reply to this email to respond directly to ${esc(name)}.</p>
  </div>
</div>`,
    });

    if (error) {
      console.error("[email] Resend error:", error);
      return { sent: false, reason: "send_failed" };
    }
    return { sent: true, id: data?.id };
  } catch (err) {
    console.error("[email] Failed to send contact notification:", err);
    return { sent: false, reason: "send_failed" };
  }
}
