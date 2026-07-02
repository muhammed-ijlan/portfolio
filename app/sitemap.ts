import type { MetadataRoute } from "next";
import { SITE_URL } from "@/lib/seo";
import { getPublicPostSlugs } from "@/lib/blog-service";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const slugs = await getPublicPostSlugs();
  return [
    {
      url: SITE_URL,
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 1,
    },
    {
      url: `${SITE_URL}/blog`,
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: 0.8,
    },
    ...slugs.map((slug) => ({
      url: `${SITE_URL}/blog/${slug}`,
      lastModified: new Date(),
      changeFrequency: "monthly" as const,
      priority: 0.6,
    })),
  ];
}
