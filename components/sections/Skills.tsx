"use client";

import { Reveal } from "@/components/ui/Reveal";
import { Tilt } from "@/components/ui/Tilt";
import { Icons } from "@/components/ui/Icons";

const GROUPS = [
  { title: "Languages", span: "span 1", items: ["JavaScript (ES6+)", "TypeScript", "SQL"] },
  { title: "Frontend", span: "span 2", items: ["React", "Next.js (SSR/SSG)", "Redux", "React Query", "Tailwind", "Material UI", "Vite"] },
  { title: "Web3", span: "span 1", accent: true, items: ["Ethereum", "WebAssembly", "WebAuthn", "MV3 Extensions"] },
  { title: "Backend", span: "span 2", items: ["Node.js", "Express", "REST", "GraphQL", "JWT & 2FA", "Clean Architecture"] },
  { title: "Databases", span: "span 1", items: ["MongoDB", "MySQL", "PostgreSQL", "Firebase"] },
  { title: "Cloud / DevOps", span: "span 2", items: ["AWS (EC2, S3)", "Docker", "CI/CD", "Nginx", "Turbo / pnpm"] },
];

export function Skills() {
  return (
    <section id="skills" className="section container-x" style={{ paddingTop: "7rem", paddingBottom: "3rem" }}>
      <Reveal><span className="eyebrow">03 — Skills</span></Reveal>
      <Reveal>
        <h2 className="display-xl" style={{ fontSize: "clamp(1.8rem,4vw,2.8rem)", margin: "1rem 0 2.2rem" }}>
          The stack I build with
        </h2>
      </Reveal>

      <div className="bento">
        {GROUPS.map((g) => (
          <Reveal key={g.title} style={{ gridColumn: g.span }} className="bento-cell">
            <Tilt
              max={6}
              className="grad-border"
              style={{
                padding: "1.4rem 1.5rem", height: "100%", position: "relative", overflow: "hidden",
                background: g.accent ? "linear-gradient(160deg, rgba(34,211,238,0.10), rgba(124,58,237,0.10))" : "var(--bg-elev)",
              }}
            >
              <div style={{ display: "flex", alignItems: "center", gap: "0.5rem", marginBottom: "1rem" }}>
                {g.accent && <span className="grad-text">{Icons.spark()}</span>}
                <h3
                  className="font-mono-custom"
                  style={{ fontSize: "0.82rem", letterSpacing: "0.12em", textTransform: "uppercase", color: g.accent ? "var(--text)" : "var(--text-dim)" }}
                >
                  {g.title}
                </h3>
              </div>
              <div style={{ display: "flex", gap: "0.5rem", flexWrap: "wrap" }}>
                {g.items.map((s) => <span key={s} className="chip">{s}</span>)}
              </div>
            </Tilt>
          </Reveal>
        ))}
      </div>
    </section>
  );
}
