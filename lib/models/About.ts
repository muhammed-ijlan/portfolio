import mongoose, { Schema, model, models } from "mongoose";

const StatSchema = new Schema(
  { value: String, label: String, sub: String },
  { _id: false }
);

const HeroSchema = new Schema(
  {
    roles: { type: [String], default: [] },
    availability: { type: String, default: "" },
    focus: { type: [String], default: [] },
    stack: { type: [String], default: [] },
    experience: { type: String, default: "" },
    openToWork: { type: Boolean, default: true },
  },
  { _id: false }
);

const FocusCardSchema = new Schema(
  { title: String, desc: String },
  { _id: false }
);

const AboutSchema = new Schema(
  {
    key: { type: String, default: "singleton", unique: true },
    name: { type: String, default: "" },
    headline: { type: String, default: "" },
    role: { type: String, default: "" },
    location: { type: String, default: "" },
    email: { type: String, default: "" },
    phone: { type: String, default: "" },
    bio: { type: String, default: "" },
    story: { type: [String], default: [] },
    focus: { type: [FocusCardSchema], default: [] },
    highlights: { type: [String], default: [] },
    chips: { type: [String], default: [] },
    stats: { type: [StatSchema], default: [] },
    hero: { type: HeroSchema, default: () => ({}) },
    socials: {
      github: { type: String, default: "" },
      linkedin: { type: String, default: "" },
      email: { type: String, default: "" },
    },
  },
  {
    timestamps: true,
    versionKey: false,
    toJSON: {
      transform(_doc, ret: Record<string, unknown>) {
        delete ret._id;
        delete ret.key;
        delete ret.createdAt;
        delete ret.updatedAt;
        return ret;
      },
    },
  }
);

export type AboutDoc = mongoose.InferSchemaType<typeof AboutSchema>;

export const About = models.About || model("About", AboutSchema);
