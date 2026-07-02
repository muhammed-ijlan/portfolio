import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getPublicPosts } from "@/lib/blog-service";
import { getPortfolioCached } from "@/lib/portfolio-service";
import { BlogIndex } from "@/components/blog/BlogIndex";
import { SITE_URL } from "@/lib/seo";

export const revalidate = 120;

const DESC = "Notes on Web3, performance and shipping production software — by Muhammed Ijlan.";

export const metadata: Metadata = {
  title: "Writing",
  description: DESC,
  keywords: ["Muhammed Ijlan blog", "Ijlan writing", "Web3 blog", "Next.js blog", "web development articles", "Dubai developer blog"],
  alternates: {
    canonical: "/blog",
    types: { "application/rss+xml": `${SITE_URL}/feed.xml` },
  },
  openGraph: {
    title: "Writing | Muhammed Ijlan",
    description: DESC,
    url: `${SITE_URL}/blog`,
    siteName: "Muhammed Ijlan",
    type: "website",
    images: [{ url: `${SITE_URL}/opengraph-image`, width: 1200, height: 630, alt: "Muhammed Ijlan — Writing" }],
  },
  twitter: { card: "summary_large_image", title: "Writing | Muhammed Ijlan", description: DESC },
};

export default async function BlogIndexPage() {
  const { settings } = await getPortfolioCached();
  if (!settings.sections.blog) notFound();
  const posts = await getPublicPosts();

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Blog",
    "@id": `${SITE_URL}/blog#blog`,
    url: `${SITE_URL}/blog`,
    name: "Notes from the build — Muhammed Ijlan",
    description: DESC,
    inLanguage: "en",
    author: { "@type": "Person", "@id": `${SITE_URL}/#person`, name: "Muhammed Ijlan", url: SITE_URL },
    blogPost: posts.map((p) => ({
      "@type": "BlogPosting",
      "@id": `${SITE_URL}/blog/${p.slug}#article`,
      headline: p.title,
      description: p.excerpt,
      datePublished: p.date,
      url: `${SITE_URL}/blog/${p.slug}`,
      keywords: p.tags.join(", "),
    })),
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd).replace(/</g, "\\u003c") }}
      />
      <BlogIndex posts={posts} />
    </>
  );
}
