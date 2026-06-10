import { v2 as cloudinary } from "cloudinary";

// Cloudinary is configured from the CLOUDINARY_URL env var
// (cloudinary://<api_key>:<api_secret>@<cloud_name>). We configure lazily and
// fail fast with a clear message when it's missing, so route handlers can map
// the error to a 503 instead of a generic 500.
let configured = false;

export function getCloudinary() {
  if (!process.env.CLOUDINARY_URL) {
    throw new Error("CLOUDINARY_URL is not set. Add it to .env.local to enable uploads.");
  }
  if (!configured) {
    cloudinary.config({ secure: true }); // picks up CLOUDINARY_URL from the environment
    configured = true;
  }
  return cloudinary;
}
