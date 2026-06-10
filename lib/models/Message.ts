import mongoose, { Schema, model, models } from "mongoose";
import { baseSchemaOptions } from "./_shared";

const MessageSchema = new Schema(
  {
    name: { type: String, required: true, trim: true },
    email: { type: String, required: true, trim: true },
    subject: { type: String, default: "" },
    message: { type: String, default: "" },
    status: { type: String, enum: ["new", "read", "replied"], default: "new" },
    date: { type: String, default: () => new Date().toISOString() },
    starred: { type: Boolean, default: false },
  },
  baseSchemaOptions
);

export type MessageDoc = mongoose.InferSchemaType<typeof MessageSchema>;

export const Message = models.Message || model("Message", MessageSchema);
