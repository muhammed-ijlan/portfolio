import mongoose, { Schema, model, models } from "mongoose";

// Admin account for the CMS. `passwordHash` is a scrypt hash (see lib/auth.ts)
// and is never serialised to JSON.
const AdminUserSchema = new Schema(
  {
    email: { type: String, required: true, unique: true, lowercase: true, trim: true },
    name: { type: String, default: "Admin" },
    role: { type: String, default: "owner" },
    passwordHash: { type: String, required: true },
  },
  {
    timestamps: true,
    versionKey: false,
    toJSON: {
      transform(_doc, ret: Record<string, unknown>) {
        ret.id = String(ret._id);
        delete ret._id;
        delete ret.passwordHash;
        return ret;
      },
    },
  }
);

export type AdminUserDoc = mongoose.InferSchemaType<typeof AdminUserSchema>;

export const AdminUser =
  models.AdminUser || model("AdminUser", AdminUserSchema);
