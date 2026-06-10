import mongoose, { Schema, model, models } from "mongoose";

// Singleton document: there is only ever one About record, addressed by a
// fixed `key`. We don't use the shared id transform here — the frontend reads
// About as a plain object, not an entity with an id.
const StatSchema = new Schema(
  { value: String, label: String, sub: String },
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
    chips: { type: [String], default: [] },
    stats: { type: [StatSchema], default: [] },
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
