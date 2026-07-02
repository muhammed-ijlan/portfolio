import type { MetadataRoute } from "next";
import { SITE_URL } from "@/lib/seo";
import { getPublicPosts } from "@/lib/blog-service";
import { getPortfolioCached } from "@/lib/portfolio-service";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const home: MetadataRoute.Sitemap = [
    {
      url: SITE_URL,
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 1,
    },
  ];

  const { settings } = await getPortfolioCached();
  if (!settings.sections.blog) return home;

  const posts = await getPublicPosts();
  const newest = posts[0]?.date ? new Date(posts[0].date) : new Date();
  return [
    ...home,
    {
      url: `${SITE_URL}/blog`,
      lastModified: newest,
      changeFrequency: "weekly",
      priority: 0.8,
    },
    ...posts.map((p) => ({
      url: `${SITE_URL}/blog/${p.slug}`,
      lastModified: p.date ? new Date(p.date) : new Date(),
      changeFrequency: "monthly" as const,
      priority: p.featured ? 0.7 : 0.6,
    })),
  ];
}
