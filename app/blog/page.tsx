import type { Metadata } from "next";
import { getPublicPosts } from "@/lib/blog-service";
import { BlogIndex } from "@/components/blog/BlogIndex";
import { SITE_URL } from "@/lib/seo";

export const revalidate = 120;

const DESC = "Notes on Web3, performance and shipping production software — by Muhammed Ijlan.";

export const metadata: Metadata = {
  title: "Writing",
  description: DESC,
  alternates: { canonical: "/blog" },
  openGraph: {
    title: "Writing | Muhammed Ijlan",
    description: DESC,
    url: `${SITE_URL}/blog`,
    type: "website",
  },
  twitter: { card: "summary_large_image", title: "Writing | Muhammed Ijlan", description: DESC },
};

export default async function BlogIndexPage() {
  const posts = await getPublicPosts();
  return <BlogIndex posts={posts} />;
}
