import mongoose, { Schema, model, models } from "mongoose";
import { baseSchemaOptions } from "./_shared";

const MediaSchema = new Schema(
  {
    name: { type: String, required: true, trim: true },
    kind: { type: String, default: "" },
    color: { type: String, default: "" },
    src: { type: String, default: "" },
  },
  baseSchemaOptions
);

export type MediaDoc = mongoose.InferSchemaType<typeof MediaSchema>;

export const Media = models.Media || model("Media", MediaSchema);
