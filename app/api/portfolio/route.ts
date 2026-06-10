import { handleError, okCached } from "@/lib/api-helpers";
import { getPortfolio } from "@/lib/portfolio-service";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function GET() {
  try {
    return okCached(await getPortfolio(), 120);
  } catch (e) {
    return handleError(e);
  }
}
