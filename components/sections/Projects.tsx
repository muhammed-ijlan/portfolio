"use client";

import Image from "next/image";
import { Reveal } from "@/components/ui/Reveal";
import { Icons } from "@/components/ui/Icons";
import type { PublicProject } from "@/lib/portfolio-service";

export function Projects({ items }: { items: PublicProject[] }) {
  return (
    <section id="projects" className="section-block">
      <div className="container-x">
        <div className="section-label">03 — Projects</div>
        <h2 className="h2-display" style={{ marginBottom: "clamp(32px, 5vw, 48px)" }}>
          Featured projects
        </h2>

        <Reveal>
          <div className="proj-grid">
            {items.map((p, i) => (
              <div
                key={p.id}
                className="card-surface card-hover"
                style={{ overflow: "hidden", display: "flex", flexDirection: "column", gap: 14, height: "100%", boxSizing: "border-box" }}
              >
                {p.image && (
                  <div style={{ position: "relative", margin: "-1px -1px 0", aspectRatio: "16 / 9", borderBottom: "1px solid var(--border)" }}>
                    <Image
                      src={p.image}
                      alt={p.title}
                      fill
                      priority={i === 0}
                      sizes="(max-width: 560px) 100vw, (max-width: 1199px) 50vw, 33vw"
                      style={{ objectFit: "cover" }}
                    />
                  </div>
                )}

                <div style={{ display: "flex", flexDirection: "column", gap: 14, padding: p.image ? "6px clamp(24px, 3.5vw, 32px) clamp(24px, 3.5vw, 32px)" : "clamp(24px, 3.5vw, 32px)", flex: 1 }}>
                  <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 10 }}>
                    {p.kind && <span className="badge-accent">{p.kind}</span>}
                    {p.featured && (
                      <span className="font-mono-custom" style={{ fontSize: 12, color: "var(--ink-faint)", whiteSpace: "nowrap" }}>★ Featured</span>
                    )}
                  </div>

                  <h3 style={{ margin: 0, fontSize: "clamp(18px, 2.2vw, 22px)", fontWeight: 800, letterSpacing: "-0.02em", textWrap: "pretty", color: "var(--text)" }}>
                    {p.title}
                  </h3>
                  <p style={{ margin: 0, fontSize: 14, lineHeight: 1.7, color: "var(--ink-soft)", textWrap: "pretty" }}>{p.desc}</p>

                  <div style={{ display: "flex", flexWrap: "wrap", gap: 8, marginTop: "auto" }}>
                    {p.tags.map((t) => <span key={t} className="chip-tag">{t}</span>)}
                  </div>

                  {(p.live || p.repo) && (
                    <div style={{ display: "flex", gap: 18 }}>
                      {p.live && (
                        <a href={p.live} target="_blank" rel="noreferrer" style={{ display: "inline-flex", alignItems: "center", gap: 6, fontWeight: 600, fontSize: 13.5, color: "var(--accent-text)", textDecoration: "none" }}>
                          Live {Icons.external({ width: 14, height: 14 })}
                        </a>
                      )}
                      {p.repo && (
                        <a href={p.repo} target="_blank" rel="noreferrer" style={{ display: "inline-flex", alignItems: "center", gap: 6, fontWeight: 600, fontSize: 13.5, color: "var(--ink-mid)", textDecoration: "none" }}>
                          Code {Icons.github({ width: 14, height: 14 })}
                        </a>
                      )}
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </Reveal>
      </div>
    </section>
  );
}
