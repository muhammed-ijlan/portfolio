import { crud, handleError } from "@/lib/api-helpers";
import { BlogPost } from "@/lib/models/BlogPost";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const c = crud(() => BlogPost, { cloudinaryFields: ["coverImage"] });
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
