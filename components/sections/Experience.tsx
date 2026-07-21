"use client";

import { Reveal } from "@/components/ui/Reveal";
import type { PublicExperience } from "@/lib/portfolio-service";

export function Experience({ items }: { items: PublicExperience[] }) {
  return (
    <section id="experience" className="section-block">
      <div className="container-x">
        <div className="section-label">02 — Experience</div>
        <h2 className="h2-display" style={{ marginBottom: "clamp(32px, 5vw, 48px)" }}>
          Where I&apos;ve shipped
        </h2>

        <Reveal>
          <div className="exp-grid">
            {items.map((j) => (
              <div
                key={j.id}
                className="card-surface"
                style={{ padding: "clamp(24px, 4vw, 36px)", display: "flex", flexDirection: "column", gap: 16, height: "100%", boxSizing: "border-box" }}
              >
                <div style={{ display: "flex", alignItems: "baseline", justifyContent: "space-between", gap: 16, flexWrap: "wrap" }}>
                  <div style={{ display: "flex", flexDirection: "column", gap: 4 }}>
                    <span style={{ fontSize: "clamp(19px, 2.4vw, 23px)", fontWeight: 800, letterSpacing: "-0.02em" }}>{j.role}</span>
                    <span style={{ fontSize: 14.5, color: "var(--ink-soft)" }}>
                      {j.company}{j.place ? ` · ${j.place}` : ""}
                    </span>
                  </div>
                  <span className="font-mono-custom" style={{ fontSize: 13, color: "var(--accent-text)", whiteSpace: "nowrap" }}>{j.period}</span>
                </div>

                <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
                  {j.points.map((p, k) => (
                    <div key={k} style={{ display: "flex", gap: 12, fontSize: 14.5, lineHeight: 1.65, color: "var(--ink-soft)" }}>
                      <span style={{ color: "var(--accent-text)", flexShrink: 0 }}>▸</span>
                      <span style={{ textWrap: "pretty" }}>{p}</span>
                    </div>
                  ))}
                </div>

                <div style={{ display: "flex", flexWrap: "wrap", gap: 8, marginTop: "auto" }}>
                  {j.tags.map((t) => <span key={t} className="chip-tag">{t}</span>)}
                </div>
              </div>
            ))}
          </div>
        </Reveal>
      </div>
    </section>
  );
}
