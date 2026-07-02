import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import { getPublicPostBySlug, getPublicPostSlugs } from "@/lib/blog-service";
import { getPortfolioCached } from "@/lib/portfolio-service";
import { renderMarkdown } from "@/lib/markdown";
import { ReadingProgress } from "@/components/blog/ReadingProgress";
import { SITE_URL } from "@/lib/seo";

export const revalidate = 120;

type Params = { params: Promise<{ slug: string }> };

const fmtDate = (iso: string) =>
  iso ? new Date(iso).toLocaleDateString("en", { year: "numeric", month: "long", day: "numeric" }) : "";

const initials = (name: string) =>
  name.split(" ").map((w) => w[0]).slice(0, 2).join("").toUpperCase();

export async function generateStaticParams() {
  const slugs = await getPublicPostSlugs();
  return slugs.map((slug) => ({ slug }));
}

export async function generateMetadata({ params }: Params): Promise<Metadata> {
  const { slug } = await params;
  const post = await getPublicPostBySlug(slug);
  if (!post) return { title: "Post not found" };
  return {
    title: post.title,
    description: post.excerpt,
    alternates: { canonical: `/blog/${post.slug}` },
    openGraph: {
      title: post.title,
      description: post.excerpt,
      url: `${SITE_URL}/blog/${post.slug}`,
      type: "article",
      publishedTime: post.date,
      tags: post.tags,
      ...(post.coverImage ? { images: [post.coverImage] } : {}),
    },
    twitter: { card: "summary_large_image", title: post.title, description: post.excerpt },
  };
}

export default async function PostPage({ params }: Params) {
  const { slug } = await params;
  const [post, portfolio] = await Promise.all([getPublicPostBySlug(slug), getPortfolioCached()]);
  if (!post) notFound();
  const { about } = portfolio;
  const html = renderMarkdown(post.content);

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    headline: post.title,
    description: post.excerpt,
    datePublished: post.date,
    keywords: post.tags.join(", "),
    author: { "@type": "Person", name: about.name, url: SITE_URL },
    mainEntityOfPage: `${SITE_URL}/blog/${post.slug}`,
    ...(post.coverImage ? { image: post.coverImage } : {}),
  };

  return (
    <>
      <ReadingProgress />
      <article className="section article-wrap">
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />

        <Link href="/blog" className="article-back">← All writing</Link>

        <div className="blog-meta article-meta">
          <span>{fmtDate(post.date)}</span>
          <span>·</span>
          <span>{post.readTime}</span>
        </div>
        <h1 className="article-title">{post.title}</h1>
        <p className="text-dim article-lede">{post.excerpt}</p>
        <div className="blog-tags article-tags">
          {post.tags.map((t) => <span key={t} className="blog-tag-chip">{t}</span>)}
        </div>

        {post.coverImage && (
          <div className="article-cover" style={{ backgroundImage: `url(${post.coverImage})` }} />
        )}

        <div className="article-body" dangerouslySetInnerHTML={{ __html: html }} />

        <div className="author-card grad-border">
          <div className="author-avatar" aria-hidden="true">{initials(about.name)}</div>
          <div className="author-meta">
            <div className="author-name">{about.name}</div>
            <div className="text-dim author-role">{about.role}</div>
            <div className="author-links">
              {about.socials.github && <a href={about.socials.github} target="_blank" rel="noreferrer">GitHub</a>}
              {about.socials.linkedin && <a href={about.socials.linkedin} target="_blank" rel="noreferrer">LinkedIn</a>}
              <Link href="/#contact">Get in touch</Link>
            </div>
          </div>
        </div>
      </article>
    </>
  );
}
