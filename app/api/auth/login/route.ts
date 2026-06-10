import { connectDB } from "@/lib/db";
import { fail, handleError, ok } from "@/lib/api-helpers";
import { AdminUser } from "@/lib/models/AdminUser";
import { ensureDefaultAdmin, startSession, verifyPassword } from "@/lib/auth";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

// POST /api/auth/login  { email, password }
// Sets an httpOnly session cookie on success and returns the admin profile.
export async function POST(req: Request) {
  try {
    const body = await req.json().catch(() => ({}));
    const email = String(body?.email ?? "").trim().toLowerCase();
    const password = String(body?.password ?? "");

    if (!email || !password) return fail("Email and password are required", 400);

    await connectDB();
    // First-run convenience: create the default admin if none exists yet.
    await ensureDefaultAdmin();

    const user = await AdminUser.findOne({ email });
    if (!user || !(await verifyPassword(password, user.passwordHash))) {
      return fail("Invalid credentials", 401);
    }

    await startSession({ id: user.id, email: user.email, name: user.name, role: user.role });
    return ok({ user: user.toJSON() });
  } catch (e) {
    return handleError(e);
  }
}
