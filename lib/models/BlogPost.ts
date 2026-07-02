import mongoose, { Schema, model, models } from "mongoose";
import { baseSchemaOptions } from "./_shared";

const BlogPostSchema = new Schema(
  {
    title: { type: String, required: true, trim: true },
    slug: { type: String, required: true, unique: true, trim: true, lowercase: true },
    excerpt: { type: String, default: "" },
    content: { type: String, default: "" },
    tags: { type: [String], default: [] },
    coverImage: { type: String, default: "" },
    readTime: { type: String, default: "" },
    status: { type: String, enum: ["published", "draft"], default: "draft" },
    featured: { type: Boolean, default: false },
    date: { type: String, default: () => new Date().toISOString() },
  },
  baseSchemaOptions
);

export type BlogPostDoc = mongoose.InferSchemaType<typeof BlogPostSchema>;

export const BlogPost = models.BlogPost || model("BlogPost", BlogPostSchema);
