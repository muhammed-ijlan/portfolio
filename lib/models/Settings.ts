import mongoose, { Schema, model, models } from "mongoose";

const SettingsSchema = new Schema(
  {
    key: { type: String, default: "singleton", unique: true },
    siteTitle: { type: String, default: "" },
    tagline: { type: String, default: "" },
    accent: { type: String, default: "#22D3EE" },
    defaultTheme: { type: String, enum: ["dark", "light"], default: "dark" },
    seoDescription: { type: String, default: "" },
    resumeUrl: { type: String, default: "" },
    notifyEmail: { type: String, default: "" },
    searchConsoleSite: { type: String, default: "" },
    ga4PropertyId: { type: String, default: "" },
    ga4MeasurementId: { type: String, default: "" },
    toggles: {
      animations: { type: Boolean, default: true },
      customCursor: { type: Boolean, default: true },
      maintenance: { type: Boolean, default: false },
      showResume: { type: Boolean, default: true },
    },
    sections: {
      about: { type: Boolean, default: true },
      experience: { type: Boolean, default: true },
      skills: { type: Boolean, default: true },
      projects: { type: Boolean, default: true },
      contact: { type: Boolean, default: true },
      blog: { type: Boolean, default: true },
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

export type SettingsDoc = mongoose.InferSchemaType<typeof SettingsSchema>;

export const Settings = models.Settings || model("Settings", SettingsSchema);
