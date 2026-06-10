import { handleError, okCached } from "@/lib/api-helpers";
import { getPortfolio } from "@/lib/portfolio-service";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

// Aggregate: everything the public site needs in one request.
export async function GET() {
  try {
    return okCached(await getPortfolio(), 120);
  } catch (e) {
    return handleError(e);
  }
}
