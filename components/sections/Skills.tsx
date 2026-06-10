"use client";

import { Reveal } from "@/components/ui/Reveal";
import { Tilt } from "@/components/ui/Tilt";
import { Icons } from "@/components/ui/Icons";
import type { PublicSkill } from "@/lib/portfolio-service";

export function Skills({ groups }: { groups: PublicSkill[] }) {
  return (
    <section id="skills" className="section container-x" style={{ paddingTop: "7rem", paddingBottom: "3rem" }}>
      <Reveal><span className="eyebrow">03 — Skills</span></Reveal>
      <Reveal>
        <h2 className="display-xl" style={{ fontSize: "clamp(1.8rem,4vw,2.8rem)", margin: "1rem 0 2.2rem" }}>
          The stack I build with
        </h2>
      </Reveal>

      <div className="bento">
        {groups.map((g) => (
          <Reveal key={g.id} style={{ gridColumn: g.items.length > 4 ? "span 2" : "span 1" }} className="bento-cell">
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
