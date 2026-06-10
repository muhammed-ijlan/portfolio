import { connectDB } from "@/lib/db";
import { fail, handleError, ok } from "@/lib/api-helpers";
import { AdminUser } from "@/lib/models/AdminUser";
import { getSession, hashPassword } from "@/lib/auth";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

// POST /api/auth/register  { email, password, name?, role? }
// Creates a new admin account. Authorised either by an existing signed-in admin
// OR by the SEED_SECRET header (for first-time bootstrap from a script).
export async function POST(req: Request) {
  try {
    const session = await getSession();
    const secret = process.env.SEED_SECRET;
    const provided = req.headers.get("x-seed-secret");
    const authorised = !!session || (!!secret && provided === secret);
    if (!authorised) return fail("Unauthorized", 401);

    const body = await req.json().catch(() => ({}));
    const email = String(body?.email ?? "").trim().toLowerCase();
    const password = String(body?.password ?? "");
    const name = String(body?.name ?? "Admin").trim() || "Admin";
    const role = String(body?.role ?? "editor").trim() || "editor";

    if (!EMAIL_RE.test(email)) return fail("Enter a valid email address", 422);
    if (password.length < 8) return fail("Password must be at least 8 characters", 422);

    await connectDB();
    if (await AdminUser.exists({ email })) {
      return fail("An admin with that email already exists", 409);
    }

    const user = await AdminUser.create({
      email,
      name,
      role,
      passwordHash: await hashPassword(password),
    });

    return ok({ user: user.toJSON() }, { status: 201 });
  } catch (e) {
    return handleError(e);
  }
}
