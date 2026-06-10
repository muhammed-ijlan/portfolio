import { fail, handleError, ok } from "@/lib/api-helpers";
import { requireAuth } from "@/lib/auth";
import { getCloudinary } from "@/lib/cloudinary";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const MAX_BYTES = 10 * 1024 * 1024;
const ALLOWED = [
  "image/png",
  "image/jpeg",
  "image/jpg",
  "image/webp",
  "image/gif",
  "image/svg+xml",
  "image/avif",
  "application/pdf",
];

export async function POST(req: Request) {
  try {
    await requireAuth();

    const form = await req.formData();
    const file = form.get("file");
    if (!(file instanceof File)) return fail("No file provided", 400);
    if (file.size === 0) return fail("Empty file", 400);
    if (file.size > MAX_BYTES) return fail("File too large (max 10 MB)", 413);
    if (file.type && !ALLOWED.includes(file.type)) return fail("Unsupported file type", 415);

    const buffer = Buffer.from(await file.arrayBuffer());
    const dataUri = `data:${file.type || "image/png"};base64,${buffer.toString("base64")}`;

    const cloudinary = getCloudinary();
    const isPdf = file.type === "application/pdf";

    // PDFs upload as "raw", not "image": Cloudinary blocks delivery of image-type
    // PDFs by default, but raw assets serve directly. The ".pdf" public_id keeps
    // the URL extension so it opens inline in the browser.
    const safeName =
      (file.name || "file").replace(/\.[^.]+$/, "").replace(/[^a-zA-Z0-9_-]/g, "_").slice(0, 60) || "file";

    const res = await cloudinary.uploader.upload(dataUri, {
      folder: "portfolio",
      ...(isPdf
        ? { resource_type: "raw" as const, public_id: `${safeName}-${Date.now()}.pdf` }
        : { resource_type: "image" as const }),
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
