"use client";

import { Reveal } from "@/components/ui/Reveal";
import { Tilt } from "@/components/ui/Tilt";
import { Counter } from "@/components/ui/Counter";
import type { PublicAbout } from "@/lib/portfolio-service";

function parseStat(value: string): { num: number; suffix: string } | null {
  const m = value.match(/^(\d+(?:\.\d+)?)(.*)$/);
  return m ? { num: parseFloat(m[1]), suffix: m[2] } : null;
}

export function About({ about }: { about: PublicAbout }) {
  return (
    <section id="about" className="section container-x" style={{ paddingTop: "7rem", paddingBottom: "3rem" }}>
      {}
      <div
        aria-hidden="true"
        style={{
          position: "absolute", top: -160, left: "50%", transform: "translateX(-50%)",
          width: "min(1000px, 92vw)", height: 360, pointerEvents: "none", zIndex: 0,
          background: "radial-gradient(ellipse at center, rgba(34,211,238,0.12), rgba(124,58,237,0.08) 42%, transparent 70%)",
          filter: "blur(28px)",
        }}
      />
      <div style={{ position: "relative", zIndex: 1 }}>
        <Reveal><span className="eyebrow">01 — About</span></Reveal>

        <div
          className="about-grid"
          style={{ display: "grid", gridTemplateColumns: "minmax(0,1.4fr) minmax(0,1fr)", gap: "3rem", marginTop: "1.6rem", alignItems: "start" }}
        >
          <Reveal>
            <h2 className="display-xl grad-text" style={{ fontSize: "clamp(1.8rem,4vw,2.8rem)", marginBottom: "1.3rem" }}>
              {about.headline}
            </h2>
            <p className="text-dim" style={{ fontSize: "1.08rem", lineHeight: 1.75 }}>
              {about.bio}
            </p>
            <div style={{ display: "flex", gap: "0.5rem", flexWrap: "wrap", marginTop: "1.6rem" }}>
              {about.chips.map((t) => <span key={t} className="chip">{t}</span>)}
            </div>
          </Reveal>

          <Reveal>
            <div style={{ display: "grid", gap: "1rem" }}>
              {about.stats.map((s, i) => {
                const parsed = parseStat(s.value);
                const accent = i === about.stats.length - 1;
                return (
                  <Tilt
                    key={i}
                    max={5}
                    className="grad-border"
                    style={{
                      padding: "1.4rem 1.5rem", position: "relative", overflow: "hidden",
                      background: accent
                        ? "linear-gradient(150deg, rgba(34,211,238,0.12), rgba(124,58,237,0.12))"
                        : "var(--bg-elev)",
                    }}
                  >
                    <div className="display-xl grad-text" style={{ fontSize: "2.6rem", lineHeight: 1 }}>
                      {parsed ? <Counter to={parsed.num} suffix={parsed.suffix} /> : s.value}
                    </div>
                    <div style={{ fontWeight: 600, marginTop: "0.5rem" }}>{s.label}</div>
                    <div className="text-faint font-mono-custom" style={{ fontSize: "0.78rem", marginTop: "0.25rem" }}>{s.sub}</div>
                  </Tilt>
                );
              })}
            </div>
          </Reveal>
        </div>
      </div>
    </section>
  );
}
