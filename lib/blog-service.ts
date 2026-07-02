import { cache } from "react";
import { connectDB } from "./db";
import { BlogPost } from "./models/BlogPost";
import { SEED, type BlogPost as BlogPostType } from "./seed-data";

export type PublicPost = Omit<BlogPostType, "status">;

function toPublic(d: Record<string, unknown>): PublicPost {
  const { _id, __v, createdAt, updatedAt, status, ...rest } = d;
  void __v;
  void createdAt;
  void updatedAt;
  void status;
  return { id: String(_id ?? rest.id), ...rest } as unknown as PublicPost;
}

const seedPublished = (): PublicPost[] =>
  SEED.posts
    .filter((p) => p.status === "published")
    .map(({ status, ...rest }) => {
      void status;
      return rest as PublicPost;
    });

export const getPublicPosts = cache(async (): Promise<PublicPost[]> => {
  try {
    await connectDB();
    const docs = await BlogPost.find({ status: "published" })
      .sort({ featured: -1, date: -1 })
      .lean();
    if (docs.length === 0) return seedPublished();
    return docs.map((d) => toPublic(d as Record<string, unknown>));
  } catch (err) {
    console.error("[blog] DB unavailable — serving seed posts:", err instanceof Error ? err.message : err);
    return seedPublished();
  }
});

export const getPublicPostBySlug = cache(async (slug: string): Promise<PublicPost | null> => {
  try {
    await connectDB();
    const doc = await BlogPost.findOne({ slug, status: "published" }).lean<Record<string, unknown>>();
    if (doc) return toPublic(doc);
  } catch (err) {
    console.error("[blog] DB unavailable — checking seed posts:", err instanceof Error ? err.message : err);
  }
  return seedPublished().find((p) => p.slug === slug) ?? null;
});

export async function getPublicPostSlugs(): Promise<string[]> {
  const posts = await getPublicPosts();
  return posts.map((p) => p.slug);
}
