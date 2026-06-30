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
    // Where contact-form submissions are emailed. Editable from the admin.
    notifyEmail: { type: String, default: "" },
    // Google Search Console property, e.g. "sc-domain:ijlan.dev". Editable from the admin.
    searchConsoleSite: { type: String, default: "" },
    toggles: {
      animations: { type: Boolean, default: true },
      customCursor: { type: Boolean, default: true },
      maintenance: { type: Boolean, default: false },
      showResume: { type: Boolean, default: true },
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
