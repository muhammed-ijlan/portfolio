import { fail, handleError, ok } from "@/lib/api-helpers";
import { requireAuth } from "@/lib/auth";
import { getCloudinary } from "@/lib/cloudinary";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const MAX_BYTES = 8 * 1024 * 1024; // 8 MB
const ALLOWED = [
  "image/png",
  "image/jpeg",
  "image/jpg",
  "image/webp",
  "image/gif",
  "image/svg+xml",
  "image/avif",
];

// POST /api/upload  (multipart/form-data, field `file`)
// Authenticated admins only. Streams the image to Cloudinary and returns the
// hosted URL, which the CMS then stores on the Media / Project document.
export async function POST(req: Request) {
  try {
    await requireAuth();

    const form = await req.formData();
    const file = form.get("file");
    if (!(file instanceof File)) return fail("No file provided", 400);
    if (file.size === 0) return fail("Empty file", 400);
    if (file.size > MAX_BYTES) return fail("File too large (max 8 MB)", 413);
    if (file.type && !ALLOWED.includes(file.type)) return fail("Unsupported file type", 415);

    const buffer = Buffer.from(await file.arrayBuffer());
    const dataUri = `data:${file.type || "image/png"};base64,${buffer.toString("base64")}`;

    const cloudinary = getCloudinary();
    const res = await cloudinary.uploader.upload(dataUri, {
      folder: "portfolio",
      resource_type: "image",
    });

    return ok({
      url: res.secure_url,
      publicId: res.public_id,
      width: res.width,
      height: res.height,
      format: res.format,
      bytes: res.bytes,
    });
  } catch (e) {
    return handleError(e);
  }
}
