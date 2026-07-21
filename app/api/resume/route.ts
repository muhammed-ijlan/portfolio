import { fail, handleError } from "@/lib/api-helpers";
import { requireAuth } from "@/lib/auth";
import { downloadUrlFor } from "@/lib/cloudinary";
import { getPublicSettings } from "@/lib/portfolio-service";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

/**
 * Stable public link for the résumé. Resolves whatever PDF is currently set in
 * the admin and hands back a freshly signed download URL, so the link in the
 * hero keeps working after the file is replaced and never exposes a Cloudinary
 * URL that the account's PDF delivery rules would reject.
 */
export async function GET(req: Request) {
  try {
    // `?src=` lets the admin preview a PDF it has just uploaded but not yet
    // saved. Admin-only, and restricted to Cloudinary assets so the redirect
    // can never be pointed at an arbitrary host.
    const src = new URL(req.url).searchParams.get("src");
    if (src) {
      await requireAuth();
      if (!src.startsWith("https://res.cloudinary.com/")) {
        return fail("Only Cloudinary assets can be previewed", 400);
      }
      const preview = downloadUrlFor(src);
      if (!preview) return fail("That file is unavailable", 404);
      return Response.redirect(preview, 302);
    }

    const { resumeUrl } = await getPublicSettings();
    const target = downloadUrlFor(resumeUrl);
    if (!target) return fail("No résumé has been uploaded yet", 404);
    return Response.redirect(target, 302);
  } catch (e) {
    return handleError(e);
  }
}
