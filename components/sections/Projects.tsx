"use client";

import Image from "next/image";
import { Reveal } from "@/components/ui/Reveal";
import { Tilt } from "@/components/ui/Tilt";
import { Icons } from "@/components/ui/Icons";
import type { PublicProject } from "@/lib/portfolio-service";

export function Projects({ items }: { items: PublicProject[] }) {
  return (
    <section id="projects" className="section container-x" style={{ paddingTop: "7rem", paddingBottom: "3rem" }}>
      <Reveal><span className="eyebrow">04 — Projects</span></Reveal>
      <Reveal>
        <h2 className="display-xl" style={{ fontSize: "clamp(1.8rem,4vw,2.8rem)", margin: "1rem 0 2.2rem" }}>
          Selected work
        </h2>
      </Reveal>

      <div className="projects-grid">
        {items.map((p, i) => (
          <Reveal key={p.id} style={{ gridColumn: p.featured ? "1 / -1" : "auto" }}>
            <Tilt
              max={p.featured ? 4 : 8}
              className="grad-border"
              style={{
                overflow: "hidden", height: "100%", position: "relative",
                display: p.featured ? "grid" : "block",
                gridTemplateColumns: p.featured ? "minmax(0,1fr) minmax(0,1fr)" : undefined,
              }}
            >
              <div
                className="img-slot project-shot featured-inner"
                style={{
                  position: "relative", minHeight: p.featured ? 280 : 180, borderRadius: 0,
                  borderTop: "none", borderLeft: "none",
                  borderRight: p.featured ? "1px solid var(--border)" : "none",
                  borderBottom: p.featured ? "none" : "1px dashed var(--border-strong)",
                }}
              >
                {p.image ? (
                  <Image
                    src={p.image}
                    alt={p.title}
                    fill
                    priority={i === 0}
                    sizes={p.featured ? "(max-width: 900px) 100vw, 50vw" : "(max-width: 900px) 100vw, 33vw"}
                    style={{ objectFit: "cover" }}
                  />
                ) : (
                  <span>↳ {p.title}</span>
                )}
              </div>
              <div style={{ padding: "1.5rem 1.6rem", position: "relative", zIndex: 2 }}>
                <div className="font-mono-custom" style={{ fontSize: "0.74rem", letterSpacing: "0.1em", textTransform: "uppercase", color: "var(--cyan)" }}>
                  {p.kind}
                </div>
                <h3 className="font-display" style={{ fontSize: p.featured ? "1.8rem" : "1.3rem", fontWeight: 600, margin: "0.5rem 0 0.6rem" }}>
                  {p.title}
                </h3>
                <p className="text-dim" style={{ fontSize: "0.96rem", lineHeight: 1.6 }}>{p.desc}</p>
                <div style={{ display: "flex", gap: "0.45rem", flexWrap: "wrap", margin: "1.1rem 0" }}>
                  {p.tags.map((t) => <span key={t} className="chip" style={{ fontSize: "0.72rem" }}>{t}</span>)}
                </div>
                <div style={{ display: "flex", gap: "1rem" }}>
                  {p.live && (
                    <a href={p.live} target="_blank" rel="noreferrer" className="grad-text" style={{ display: "inline-flex", alignItems: "center", gap: "0.4rem", fontWeight: 600, fontSize: "0.9rem", textDecoration: "none" }}>
                      Live {Icons.external()}
                    </a>
                  )}
                  {p.repo && (
                    <a href={p.repo} target="_blank" rel="noreferrer" className="text-dim" style={{ display: "inline-flex", alignItems: "center", gap: "0.4rem", fontWeight: 600, fontSize: "0.9rem", textDecoration: "none" }}>
                      Code {Icons.github({ width: 16, height: 16 })}
                    </a>
                  )}
                </div>
              </div>
            </Tilt>
          </Reveal>
        ))}
      </div>
    </section>
  );
}
