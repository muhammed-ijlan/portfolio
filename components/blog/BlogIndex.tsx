"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import type { PublicPost } from "@/lib/blog-service";

const fmtDate = (iso: string) =>
  iso ? new Date(iso).toLocaleDateString("en", { year: "numeric", month: "short", day: "numeric" }) : "";

function CardVisual({ post }: { post: PublicPost }) {
  if (post.coverImage) {
    return <div className="blog-card-cover" style={{ backgroundImage: `url(${post.coverImage})` }} />;
  }
  return (
    <div className="blog-card-cover blog-card-cover-art" aria-hidden="true">
      <span className="blog-card-glyph">{"</>"}</span>
    </div>
  );
}

export function BlogIndex({ posts }: { posts: PublicPost[] }) {
  const [tag, setTag] = useState("All");

  const featured = useMemo(() => posts.find((p) => p.featured) ?? posts[0], [posts]);
  const tags = useMemo(() => ["All", ...Array.from(new Set(posts.flatMap((p) => p.tags)))], [posts]);
  const visible = useMemo(
    () => (tag === "All" ? posts.filter((p) => p !== featured) : posts.filter((p) => p.tags.includes(tag))),
    [posts, tag, featured]
  );

  return (
    <section className="section container-x blog-wrap">
      <header className="blog-head">
        <span className="eyebrow">Writing</span>
        <h1 className="display-xl blog-title">Notes from the <span className="grad-text">build</span>.</h1>
        <p className="text-dim blog-sub">
          Field notes on Web3, performance and shipping production software — pulled straight from the work.
        </p>
      </header>

      {featured && tag === "All" && (
        <Link href={`/blog/${featured.slug}`} className="blog-featured grad-border">
          <CardVisual post={featured} />
          <div className="blog-featured-body">
            <div className="blog-meta">
              <span className="blog-badge">Featured</span>
              <span>{fmtDate(featured.date)}</span>
              <span>·</span>
              <span>{featured.readTime}</span>
            </div>
            <h2 className="blog-featured-title">{featured.title}</h2>
            <p className="text-dim blog-featured-excerpt">{featured.excerpt}</p>
            <div className="blog-tags">
              {featured.tags.map((t) => <span key={t} className="blog-tag-chip">{t}</span>)}
            </div>
            <span className="blog-readmore">Read the post →</span>
          </div>
        </Link>
      )}

      <div className="blog-filters" role="tablist" aria-label="Filter posts by tag">
        {tags.map((t) => (
          <button
            key={t}
            role="tab"
            aria-selected={tag === t}
            className={`blog-filter${tag === t ? " active" : ""}`}
            onClick={() => setTag(t)}
          >
            {t}
          </button>
        ))}
      </div>

      {visible.length === 0 ? (
        <p className="text-dim" style={{ padding: "2rem 0" }}>No posts under “{tag}” yet.</p>
      ) : (
        <div className="blog-grid">
          {visible.map((p) => (
            <Link key={p.id} href={`/blog/${p.slug}`} className="blog-card">
              <CardVisual post={p} />
              <div className="blog-card-body">
                <div className="blog-meta">
                  <span>{fmtDate(p.date)}</span>
                  <span>·</span>
                  <span>{p.readTime}</span>
                </div>
                <h3 className="blog-card-title">{p.title}</h3>
                <p className="text-dim blog-card-excerpt">{p.excerpt}</p>
                <div className="blog-tags">
                  {p.tags.slice(0, 3).map((t) => <span key={t} className="blog-tag-chip">{t}</span>)}
                </div>
              </div>
            </Link>
          ))}
        </div>
      )}
    </section>
  );
}
