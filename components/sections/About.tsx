"use client";

import { Reveal } from "@/components/ui/Reveal";
import { Counter } from "@/components/ui/Counter";
import type { PublicAbout } from "@/lib/portfolio-service";

function parseStat(value: string): { num: number; suffix: string } | null {
  const m = value.match(/^(\d+(?:\.\d+)?)(.*)$/);
  return m ? { num: parseFloat(m[1]), suffix: m[2] } : null;
}

// Service icons from the design, cycled by card index.
const SERVICE_ICONS = [
  "M8 4 L3 12 L8 20 M16 4 L21 12 L16 20",
  "M12 3 L20 6 V11 C20 16.5 16.6 20 12 21.5 C7.4 20 4 16.5 4 11 V6 Z M9 12 L11 14 L15 9.5",
  "M5 16.5 A8 8 0 1 1 19 16.5 M12 14.5 L16.5 10",
  "M12 11 A3.5 3.5 0 1 0 12 4 A3.5 3.5 0 0 0 12 11 M16 19.5 C16 17.3 14.2 15.5 12 15.5 C9.8 15.5 8 17.3 8 19.5 M19.5 19.5 C19.5 17.6 18.4 16.2 16.9 15.7 M4.5 19.5 C4.5 17.6 5.6 16.2 7.1 15.7",
];

export function About({ about, index = "01" }: { about: PublicAbout; index?: string }) {
  const paragraphs = [about.bio, ...(about.story ?? [])].filter(Boolean);

  return (
    <section id="about" className="section-block">
      <div className="container-x">
        <div className="section-label">{index} — About</div>

        <Reveal>
          <div className="about-grid" style={{ display: "grid", gridTemplateColumns: "1.5fr 1fr", gap: "clamp(32px, 5vw, 72px)", alignItems: "start" }}>
            <div>
              <h2 className="h2-display" style={{ marginBottom: 24, maxWidth: 640, textWrap: "pretty" }}>
                {about.headline}
              </h2>
              <div style={{ display: "flex", flexDirection: "column", gap: 18, maxWidth: 640, fontSize: "clamp(15px, 1.8vw, 16.5px)", lineHeight: 1.75, color: "var(--ink-soft)" }}>
                {paragraphs.map((p, i) => (
                  <p key={i} style={{ margin: 0, textWrap: "pretty" }}>{p}</p>
                ))}
              </div>
              <div style={{ display: "flex", flexWrap: "wrap", gap: 8, marginTop: 28 }}>
                {about.chips.map((t) => <span key={t} className="pill-tag">{t}</span>)}
              </div>
            </div>

            <div className="stat-grid">
              {about.stats.map((s, i) => {
                const parsed = parseStat(s.value);
                return (
                  <div key={i} className="card-surface" style={{ borderRadius: 18, padding: "24px 26px", display: "flex", flexDirection: "column", gap: 4 }}>
                    <span style={{ fontWeight: 800, fontSize: "clamp(30px, 3.5vw, 40px)", letterSpacing: "-0.03em", color: "var(--accent-text)" }}>
                      {parsed ? <Counter to={parsed.num} suffix={parsed.suffix} /> : s.value}
                    </span>
                    <span style={{ fontSize: 15, fontWeight: 600, color: "var(--text)" }}>{s.label}</span>
                    <span style={{ fontSize: 13, color: "var(--ink-faint)" }}>{s.sub}</span>
                  </div>
                );
              })}
            </div>
          </div>
        </Reveal>

        {(about.focus ?? []).length > 0 && (
          <div style={{ marginTop: "clamp(56px, 8vw, 88px)" }}>
            <div style={{ fontSize: 13, fontWeight: 600, letterSpacing: "0.1em", textTransform: "uppercase", color: "var(--ink-faint)", marginBottom: 22 }}>
              What I do
            </div>
            <Reveal>
              <div className="services-grid">
                {(about.focus ?? []).map((f, i) => (
                  <div key={i} className="card-surface card-hover" style={{ borderRadius: 18, padding: 26, display: "flex", flexDirection: "column", gap: 14 }}>
                    <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 10 }}>
                      <span className="icon-chip">
                        <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round">
                          <path d={SERVICE_ICONS[i % SERVICE_ICONS.length]} />
                        </svg>
                      </span>
                      <span className="font-mono-custom" style={{ fontSize: 12.5, color: "var(--ink-faint)" }}>
                        {String(i + 1).padStart(2, "0")}
                      </span>
                    </div>
                    <span style={{ fontSize: 17, fontWeight: 700, letterSpacing: "-0.01em" }}>{f.title}</span>
                    <span style={{ fontSize: 14, lineHeight: 1.65, color: "var(--ink-soft)", textWrap: "pretty" }}>{f.desc}</span>
                  </div>
                ))}
              </div>
            </Reveal>
          </div>
        )}

        {(about.highlights ?? []).length > 0 && (
          <Reveal>
            <div className="card-surface" style={{ marginTop: 18, padding: "clamp(24px, 3.5vw, 32px)" }}>
              <div style={{ fontSize: 13, fontWeight: 600, letterSpacing: "0.1em", textTransform: "uppercase", color: "var(--ink-faint)", marginBottom: 18 }}>
                Highlights
              </div>
              <ul className="highlights-grid">
                {(about.highlights ?? []).map((h, i) => (
                  <li key={i} style={{ display: "flex", gap: 12, fontSize: 14.5, lineHeight: 1.65, color: "var(--ink-soft)" }}>
                    <span style={{ color: "var(--accent-text)", flexShrink: 0 }}>▸</span>
                    <span style={{ textWrap: "pretty" }}>{h}</span>
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
