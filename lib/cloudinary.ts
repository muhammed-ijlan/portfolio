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

// Extract { publicId, resourceType } from a Cloudinary delivery URL so it can be
// deleted. Returns null for non-Cloudinary URLs.
function parseCloudinaryUrl(
  url: string
): { publicId: string; resourceType: "image" | "raw" | "video" } | null {
  const m = url.match(/\/(image|raw|video)\/upload\/(?:v\d+\/)?(.+)$/);
  if (!m) return null;
  const resourceType = m[1] as "image" | "raw" | "video";
  let path = m[2].split("?")[0];
  // For image/video the extension is NOT part of the public_id; for raw it is.
  if (resourceType !== "raw") path = path.replace(/\.[^/.]+$/, "");
  return { publicId: decodeURIComponent(path), resourceType };
}

// Best-effort delete of a Cloudinary asset by its delivery URL. No-ops on empty
// or non-Cloudinary URLs, and never throws — orphan cleanup must not fail the
// request that triggered it.
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
