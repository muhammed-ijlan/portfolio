import { crud, handleError, SITE_PATHS } from "@/lib/api-helpers";
import { Project } from "@/lib/models/Project";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const c = crud(() => Project, { revalidate: SITE_PATHS });

export async function GET() {
  try {
    return await c.list();
  } catch (e) {
    return handleError(e);
  }
}

export async function POST(req: Request) {
  try {
    return await c.create(req);
  } catch (e) {
    return handleError(e);
  }
}
