"use client";

import { Reveal } from "@/components/ui/Reveal";
import { useTheme } from "@/components/ui/ThemeProvider";
import type { PublicSkill } from "@/lib/portfolio-service";

// Map a free-text skill label to a Simple Icons slug + brand color.
// "mono" resolves to the theme's ink color so wordmark-style logos stay legible.
const ICON_RULES: [RegExp, string, string][] = [
  [/javascript/i, "javascript", "F7DF1E"],
  [/typescript/i, "typescript", "3178C6"],
  [/react ?query/i, "reactquery", "FF4154"],
  [/next/i, "nextdotjs", "mono"],
  [/redux/i, "redux", "764ABC"],
  [/tailwind/i, "tailwindcss", "06B6D4"],
  [/material ?ui|\bmui\b/i, "mui", "007FFF"],
  [/\breact\b/i, "react", "61DAFB"],
  [/vite/i, "vite", "646CFF"],
  [/node/i, "nodedotjs", "5FA04E"],
  [/express/i, "express", "mono"],
  [/graphql/i, "graphql", "E10098"],
  [/jwt|json ?web ?token|2fa/i, "jsonwebtokens", "mono"],
  [/ethereum/i, "ethereum", "mono"],
  [/webassembly|wasm/i, "webassembly", "654FF0"],
  [/mv3|chrome|extension/i, "googlechrome", "4285F4"],
  [/mongo/i, "mongodb", "47A248"],
  [/mysql/i, "mysql", "4479A1"],
  [/postgre/i, "postgresql", "4169E1"],
  [/firebase/i, "firebase", "DD2C00"],
  [/docker/i, "docker", "2496ED"],
  [/ci\/cd|github ?actions/i, "githubactions", "2088FF"],
  [/nginx/i, "nginx", "009639"],
  [/turbo|pnpm/i, "turborepo", "EF4444"],
];

function resolveIcon(label: string, mono: string): { slug: string; color: string } | null {
  for (const [re, slug, color] of ICON_RULES) {
    if (re.test(label)) return { slug, color: color === "mono" ? mono : color };
  }
  return null;
}

export function Skills({ groups, index = "04" }: { groups: PublicSkill[]; index?: string }) {
  const { theme } = useTheme();
  const mono = theme === "dark" ? "EDEFF7" : "0F1222";

  return (
    <section id="skills" className="section-block">
      <div className="container-x">
        <div className="section-label">{index} — Skills</div>
        <h2 className="h2-display" style={{ marginBottom: "clamp(32px, 5vw, 48px)" }}>
          The stack I build with
        </h2>

        <Reveal>
          <div className="skills-grid">
            {groups.map((g) => (
              <div key={g.id} className="card-surface" style={{ borderRadius: 18, padding: 24 }}>
                <div className="font-mono-custom" style={{ fontSize: 12.5, letterSpacing: "0.08em", textTransform: "uppercase", color: "var(--accent-text)", marginBottom: 16 }}>
                  {g.title}
                </div>
                <div style={{ display: "flex", flexWrap: "wrap", gap: 9 }}>
                  {g.items.map((label) => {
                    const icon = resolveIcon(label, mono);
                    return (
                      <span
                        key={label}
                        style={{
                          display: "inline-flex", alignItems: "center", gap: 9, fontSize: 13.5, fontWeight: 600,
                          color: "var(--ink-mid)", background: "var(--chip-bg)", border: "1px solid var(--border)",
                          borderRadius: 12, padding: "9px 14px", whiteSpace: "nowrap",
                        }}
                      >
                        {icon ? (
                          // eslint-disable-next-line @next/next/no-img-element
                          <img src={`https://cdn.simpleicons.org/${icon.slug}/${icon.color}`} alt="" width={17} height={17} style={{ display: "block" }} />
                        ) : (
                          <span style={{ width: 7, height: 7, borderRadius: "50%", background: "var(--accent-text)", display: "inline-block" }} />
                        )}
                        {label}
                      </span>
                    );
                  })}
                </div>
              </div>
            ))}
          </div>
        </Reveal>
      </div>
    </section>
  );
}
