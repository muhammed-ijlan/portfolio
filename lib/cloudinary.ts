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
