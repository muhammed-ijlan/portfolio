import { singleton, handleError, ok } from "@/lib/api-helpers";
import { requireAuth } from "@/lib/auth";
import { connectDB } from "@/lib/db";
import { destroyByUrl } from "@/lib/cloudinary";
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

// Custom PUT so a replaced/removed résumé PDF is also deleted from Cloudinary.
export async function PUT(req: Request) {
  try {
    await requireAuth();
    await connectDB();
    const body = (await req.json().catch(() => ({}))) as Record<string, unknown>;
    delete body.id;

    const before = await Settings.findOne({ key: "singleton" }).lean<Record<string, unknown>>();
    const doc = await Settings.findOneAndUpdate(
      { key: "singleton" },
      { $set: body },
      { new: true, upsert: true, runValidators: true }
    );

    const oldResume = before?.resumeUrl;
    const newResume = (doc!.toJSON() as Record<string, unknown>).resumeUrl;
    if (typeof oldResume === "string" && oldResume && oldResume !== newResume) {
      await destroyByUrl(oldResume);
    }

    return ok(doc!.toJSON());
  } catch (e) {
    return handleError(e);
  }
}
