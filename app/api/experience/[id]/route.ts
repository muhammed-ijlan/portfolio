import { crud, handleError, SITE_PATHS } from "@/lib/api-helpers";
import { Experience } from "@/lib/models/Experience";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const c = crud(() => Experience, { revalidate: SITE_PATHS });
type Ctx = { params: Promise<{ id: string }> };

export async function GET(_req: Request, { params }: Ctx) {
  try {
    const { id } = await params;
    return await c.getOne(id);
  } catch (e) {
    return handleError(e);
  }
}

export async function PUT(req: Request, { params }: Ctx) {
  try {
    const { id } = await params;
    return await c.update(id, req);
  } catch (e) {
    return handleError(e);
  }
}

export async function DELETE(_req: Request, { params }: Ctx) {
  try {
    const { id } = await params;
    return await c.remove(id);
  } catch (e) {
    return handleError(e);
  }
}
