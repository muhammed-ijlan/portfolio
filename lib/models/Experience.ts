import mongoose, { Schema, model, models } from "mongoose";
import { baseSchemaOptions } from "./_shared";

const ExperienceSchema = new Schema(
  {
    role: { type: String, required: true, trim: true },
    company: { type: String, default: "" },
    place: { type: String, default: "" },
    period: { type: String, default: "" },
    tags: { type: [String], default: [] },
    points: { type: [String], default: [] },
  },
  baseSchemaOptions
);

export type ExperienceDoc = mongoose.InferSchemaType<typeof ExperienceSchema>;

export const Experience =
  models.Experience || model("Experience", ExperienceSchema);
