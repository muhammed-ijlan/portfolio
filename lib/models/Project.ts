import mongoose, { Schema, model, models } from "mongoose";
import { baseSchemaOptions } from "./_shared";

const ProjectSchema = new Schema(
  {
    title: { type: String, required: true, trim: true },
    kind: { type: String, default: "" },
    desc: { type: String, default: "" },
    tags: { type: [String], default: [] },
    featured: { type: Boolean, default: false },
    live: { type: String, default: "" },
    repo: { type: String, default: "" },
    image: { type: String, default: "" },
    status: { type: String, enum: ["published", "draft"], default: "draft" },
    views: { type: Number, default: 0 },
  },
  baseSchemaOptions
);

export type ProjectDoc = mongoose.InferSchemaType<typeof ProjectSchema>;

export const Project = models.Project || model("Project", ProjectSchema);
