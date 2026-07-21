import { handleError, ok } from "@/lib/api-helpers";
import { requireAuth } from "@/lib/auth";
import { getVercelAnalytics } from "@/lib/vercel-analytics";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function GET() {
  try {
    await requireAuth();
    // Credentials are deploy-time config, read from env inside the helper.
    return ok(await getVercelAnalytics());
  } catch (e) {
    return handleError(e);
  }
}
