import { singleton, handleError, BLOG_PATHS } from "@/lib/api-helpers";
import { About } from "@/lib/models/About";
import { SEED } from "@/lib/seed-data";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const s = singleton(() => About, SEED.about, { revalidate: BLOG_PATHS });

export async function GET() {
  try {
    return await s.get();
  } catch (e) {
    return handleError(e);
  }
}

export async function PUT(req: Request) {
  try {
    return await s.put(req);
  } catch (e) {
    return handleError(e);
  }
}
