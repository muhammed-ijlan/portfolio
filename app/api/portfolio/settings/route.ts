import { handleError, okCached } from "@/lib/api-helpers";
import { getPublicSettings } from "@/lib/portfolio-service";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function GET() {
  try {
    return okCached(await getPublicSettings());
  } catch (e) {
    return handleError(e);
  }
}
