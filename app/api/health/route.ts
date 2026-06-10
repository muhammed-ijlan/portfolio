import mongoose from "mongoose";
import { connectDB } from "@/lib/db";
import { fail, ok } from "@/lib/api-helpers";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function GET() {
  try {
    await connectDB();
    const states = ["disconnected", "connected", "connecting", "disconnecting"];
    return ok({
      db: states[mongoose.connection.readyState] ?? "unknown",
      name: mongoose.connection.name,
    });
  } catch (e) {
    const message = e instanceof Error ? e.message : "DB connection failed";
    return fail(message, 503);
  }
}
