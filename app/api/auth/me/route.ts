import { connectDB } from "@/lib/db";
import { fail, handleError, ok } from "@/lib/api-helpers";
import { AdminUser } from "@/lib/models/AdminUser";
import { getSession } from "@/lib/auth";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

// GET /api/auth/me — returns the current admin, or 401 if not signed in.
export async function GET() {
  try {
    const session = await getSession();
    if (!session) return fail("Not authenticated", 401);

    await connectDB();
    const user = await AdminUser.findById(session.sub);
    if (!user) return fail("Not authenticated", 401);

    return ok({ user: user.toJSON() });
  } catch (e) {
    return handleError(e);
  }
}
