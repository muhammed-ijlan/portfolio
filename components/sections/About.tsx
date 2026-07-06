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
            {(about.story ?? []).map((p, i) => (
              <p key={i} className="text-dim" style={{ fontSize: "0.98rem", lineHeight: 1.75, marginTop: "1rem" }}>
                {p}
              </p>
            ))}
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

        {(about.focus ?? []).length > 0 && (
          <Reveal>
            <div style={{ marginTop: "4rem" }}>
              <span className="eyebrow">What I do</span>
              <div
                style={{
                  display: "grid",
                  gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))",
                  gap: "1.1rem",
                  marginTop: "1.3rem",
                }}
              >
                {(about.focus ?? []).map((f, i) => (
                  <Tilt key={i} max={4} className="grad-border" style={{ padding: "1.4rem 1.5rem" }}>
                    <div className="font-mono-custom grad-text" style={{ fontSize: "0.78rem", fontWeight: 700, letterSpacing: "0.1em" }}>
                      {String(i + 1).padStart(2, "0")}
                    </div>
                    <div className="font-display" style={{ fontWeight: 700, fontSize: "1.05rem", marginTop: "0.6rem", letterSpacing: "-0.01em" }}>
                      {f.title}
                    </div>
                    <p className="text-dim" style={{ fontSize: "0.9rem", lineHeight: 1.65, marginTop: "0.5rem" }}>
                      {f.desc}
                    </p>
                  </Tilt>
                ))}
              </div>
            </div>
          </Reveal>
        )}

        {(about.highlights ?? []).length > 0 && (
          <Reveal>
            <div className="grad-border" style={{ marginTop: "2.2rem", padding: "1.6rem 1.8rem" }}>
              <span className="eyebrow">Highlights</span>
              <ul
                className="about-highlights"
                style={{
                  display: "grid",
                  gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))",
                  gap: "0.75rem 2rem",
                  marginTop: "1.1rem",
                  listStyle: "none",
                  padding: 0,
                }}
              >
                {(about.highlights ?? []).map((h, i) => (
                  <li key={i} style={{ display: "flex", gap: "0.7rem", alignItems: "baseline" }}>
                    <span className="grad-text font-mono-custom" style={{ fontSize: "0.85rem", flexShrink: 0 }}>▸</span>
                    <span className="text-dim" style={{ fontSize: "0.93rem", lineHeight: 1.6 }}>{h}</span>
                  </li>
                ))}
              </ul>
            </div>
          </Reveal>
        )}
      </div>
    </section>
  );
}
