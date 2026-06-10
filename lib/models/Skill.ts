import mongoose, { Schema, model, models } from "mongoose";
import { baseSchemaOptions } from "./_shared";

const SkillSchema = new Schema(
  {
    title: { type: String, required: true, trim: true },
    items: { type: [String], default: [] },
    accent: { type: Boolean, default: false },
  },
  baseSchemaOptions
);

export type SkillDoc = mongoose.InferSchemaType<typeof SkillSchema>;

export const Skill = models.Skill || model("Skill", SkillSchema);
