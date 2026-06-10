import { handleError, okCached } from "@/lib/api-helpers";
import { getPublicSkills } from "@/lib/portfolio-service";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function GET() {
  try {
    return okCached(await getPublicSkills());
  } catch (e) {
    return handleError(e);
  }
}
