import type { SchemaOptions } from "mongoose";

// Shared schema options: expose `id` (string) instead of `_id`, drop `__v`,
// so API payloads match the frontend `cms-store` types directly.
export const baseSchemaOptions: SchemaOptions = {
  timestamps: true,
  versionKey: false,
  toJSON: {
    virtuals: true,
    transform(_doc, ret: Record<string, unknown>) {
      ret.id = String(ret._id);
      delete ret._id;
      return ret;
    },
  },
  toObject: {
    virtuals: true,
    transform(_doc, ret: Record<string, unknown>) {
      ret.id = String(ret._id);
      delete ret._id;
      return ret;
    },
  },
};
