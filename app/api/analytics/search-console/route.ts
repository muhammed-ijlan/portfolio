import { connectDB } from "@/lib/db";
import { handleError, ok } from "@/lib/api-helpers";
import { requireAuth } from "@/lib/auth";
import { Settings } from "@/lib/models/Settings";
import { getSearchConsoleData } from "@/lib/search-console";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function GET() {
  try {
    await requireAuth();
    await connectDB();

    const settings = await Settings.findOne({ key: "singleton" }).lean<{
      searchConsoleSite?: string;
    }>();
    const site =
      settings?.searchConsoleSite?.trim() ||
      process.env.GOOGLE_SEARCH_CONSOLE_SITE?.trim() ||
      "";

    const data = await getSearchConsoleData(site);
    return ok(data);
  } catch (e) {
    return handleError(e);
  }
}
