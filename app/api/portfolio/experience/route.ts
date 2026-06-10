import { handleError, okCached } from "@/lib/api-helpers";
import { getPublicExperience } from "@/lib/portfolio-service";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function GET() {
  try {
    return okCached(await getPublicExperience());
  } catch (e) {
    return handleError(e);
  }
}
