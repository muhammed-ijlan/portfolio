import { connectDB } from "@/lib/db";
import { fail, handleError, ok } from "@/lib/api-helpers";
import { AdminUser } from "@/lib/models/AdminUser";
import { hashPassword, requireAuth, startSession, verifyPassword } from "@/lib/auth";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

// POST /api/auth/change-password  { currentPassword, newPassword }  (auth required)
export async function POST(req: Request) {
  try {
    const session = await requireAuth();
    const body = await req.json().catch(() => ({}));
    const currentPassword = String(body?.currentPassword ?? "");
    const newPassword = String(body?.newPassword ?? "");

    if (newPassword.length < 8) {
      return fail("New password must be at least 8 characters", 422);
    }

    await connectDB();
    const user = await AdminUser.findById(session.sub);
    if (!user) return fail("Account not found", 404);

    if (!(await verifyPassword(currentPassword, user.passwordHash))) {
      return fail("Current password is incorrect", 403);
    }

    user.passwordHash = await hashPassword(newPassword);
    await user.save();

    // Re-issue the session so the cookie stays valid after the change.
    await startSession({ id: user.id, email: user.email, name: user.name, role: user.role });
    return ok({ changed: true });
  } catch (e) {
    return handleError(e);
  }
}
