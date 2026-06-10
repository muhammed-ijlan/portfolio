import { handleError, ok } from "@/lib/api-helpers";
import { clearSession } from "@/lib/auth";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

// POST /api/auth/logout — clears the session cookie.
export async function POST() {
  try {
    await clearSession();
    return ok({ loggedOut: true });
  } catch (e) {
    return handleError(e);
  }
}
