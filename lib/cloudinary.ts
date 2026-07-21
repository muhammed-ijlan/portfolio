import { v2 as cloudinary } from "cloudinary";

let configured = false;

export function getCloudinary() {
  if (!process.env.CLOUDINARY_URL) {
    throw new Error("CLOUDINARY_URL is not set. Add it to .env.local to enable uploads.");
  }
  if (!configured) {
    cloudinary.config({ secure: true });
    configured = true;
  }
  return cloudinary;
}

function parseCloudinaryUrl(
  url: string
): { publicId: string; resourceType: "image" | "raw" | "video" } | null {
  const m = url.match(/\/(image|raw|video)\/upload\/(?:v\d+\/)?(.+)$/);
  if (!m) return null;
  const resourceType = m[1] as "image" | "raw" | "video";
  let path = m[2].split("?")[0];
  if (resourceType !== "raw") path = path.replace(/\.[^/.]+$/, "");
  return { publicId: decodeURIComponent(path), resourceType };
}

/**
 * Cloudinary accounts block PDF/ZIP delivery over the CDN by default, so a plain
 * (or even signed) `res.cloudinary.com/raw/upload/...` link answers 401
 * "deny or ACL failure". The Admin download endpoint is signed with the API
 * secret and is not subject to that restriction, so build a short-lived URL
 * through it instead. Non-Cloudinary URLs are passed through untouched.
 */
export function downloadUrlFor(url?: string | null): string | null {
  const src = url?.trim();
  if (!src) return null;
  if (!src.includes("res.cloudinary.com") || !process.env.CLOUDINARY_URL) return src;

  const parsed = parseCloudinaryUrl(src);
  if (!parsed) return src;

  try {
    // Raw public IDs keep their extension; image ones had it stripped when parsed.
    const format = /\.[a-z0-9]+$/i.test(parsed.publicId) ? "" : "pdf";
    return getCloudinary().utils.private_download_url(parsed.publicId, format, {
      resource_type: parsed.resourceType,
      type: "upload",
      attachment: true,
    });
  } catch (err) {
    console.error("[cloudinary] download url failed:", err instanceof Error ? err.message : err);
    return src;
  }
}

export async function destroyByUrl(url?: string | null): Promise<void> {
  if (!url || !url.includes("res.cloudinary.com") || !process.env.CLOUDINARY_URL) return;
  const parsed = parseCloudinaryUrl(url);
  if (!parsed) return;
  try {
    await getCloudinary().uploader.destroy(parsed.publicId, {
      resource_type: parsed.resourceType,
      invalidate: true,
    });
  } catch (err) {
    console.error("[cloudinary] destroy failed:", err instanceof Error ? err.message : err);
  }
}
