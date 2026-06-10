import { singleton, handleError } from "@/lib/api-helpers";
import { Settings } from "@/lib/models/Settings";
import { SEED } from "@/lib/seed-data";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const s = singleton(() => Settings, SEED.settings);

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
