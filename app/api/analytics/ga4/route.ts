import { handleError, ok } from "@/lib/api-helpers";
import { requireAuth } from "@/lib/auth";
import { getGA4Data } from "@/lib/ga4";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function GET() {
  try {
    await requireAuth();
    // Deploy-time config, so it lives alongside the service-account key in env
    // rather than in the CMS. Degrades gracefully when unset.
    const data = await getGA4Data(process.env.GA4_PROPERTY_ID?.trim() || "");
    return ok(data);
  } catch (e) {
    return handleError(e);
  }
}
