import { connectDB } from "@/lib/db";
import { handleError, ok } from "@/lib/api-helpers";
import { requireAuth } from "@/lib/auth";
import { Settings } from "@/lib/models/Settings";
import { getGA4Data } from "@/lib/ga4";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function GET() {
  try {
    await requireAuth();
    await connectDB();

    const settings = await Settings.findOne({ key: "singleton" }).lean<{
      ga4PropertyId?: string;
    }>();
    const propertyId =
      settings?.ga4PropertyId?.trim() ||
      process.env.GA4_PROPERTY_ID?.trim() ||
      "";

    const data = await getGA4Data(propertyId);
    return ok(data);
  } catch (e) {
    return handleError(e);
  }
}
