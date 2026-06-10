import { crud, handleError } from "@/lib/api-helpers";
import { Media } from "@/lib/models/Media";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const c = crud(() => Media);

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
