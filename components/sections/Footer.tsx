"use client";

import type { PublicAbout } from "@/lib/portfolio-service";

export function Footer({ about }: { about: PublicAbout }) {
  const links = [
    { label: "github", href: about.socials.github },
    { label: "linkedin", href: about.socials.linkedin },
    { label: "email", href: about.email ? `mailto:${about.email}` : "" },
  ].filter((s) => s.href);

  return (
    <footer style={{ position: "relative", zIndex: 2, borderTop: "1px solid var(--border)" }}>
      <div
        className="container-x"
        style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 16, flexWrap: "wrap", paddingTop: 28, paddingBottom: 28 }}
      >
        <span className="font-mono-custom" style={{ fontSize: 13.5, color: "var(--text)" }}>
          ijlan<span style={{ color: "var(--cyan)" }}>.dev</span>
        </span>
        <span style={{ fontSize: 13, color: "var(--ink-faint)" }}>
          Built in Dubai · © {new Date().getFullYear()}
        </span>
        <div style={{ display: "flex", gap: 16, fontFamily: "var(--font-jetbrains-mono), monospace", fontSize: 12.5 }}>
          {links.map((s) => (
            <a
              key={s.label}
              href={s.href}
              target={s.href.startsWith("http") ? "_blank" : undefined}
              rel="noreferrer"
              className="mono-link"
              style={{ color: "var(--ink-faint)" }}
            >
              {s.label}
            </a>
          ))}
        </div>
      </div>
    </footer>
  );
}
