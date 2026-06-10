"use client";

import { Magnetic } from "@/components/ui/Magnetic";
import { Icons } from "@/components/ui/Icons";
import type { PublicAbout } from "@/lib/portfolio-service";

export function Footer({ about }: { about: PublicAbout }) {
  const socials = [
    { icon: Icons.github, href: about.socials.github, label: "GitHub" },
    { icon: Icons.linkedin, href: about.socials.linkedin, label: "LinkedIn" },
    { icon: Icons.mail, href: `mailto:${about.email}`, label: "Email" },
  ].filter((s) => s.href);

  const toTop = () =>
    window.scrollTo({ top: 0, behavior: window.matchMedia("(prefers-reduced-motion: reduce)").matches ? "auto" : "smooth" });

  return (
    <footer className="section container-x" style={{ paddingTop: "4rem", paddingBottom: "2.5rem" }}>
      <div className="divider" style={{ marginBottom: "2rem" }} />
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: "1.2rem" }}>
        <div>
          <div className="font-display grad-text" style={{ fontWeight: 700, fontSize: "1.2rem" }}>{about.name}</div>
          <div className="text-faint font-mono-custom" style={{ fontSize: "0.78rem", marginTop: "0.3rem" }}>
            Built in Dubai · © {new Date().getFullYear()}
          </div>
        </div>
        <div style={{ display: "flex", gap: "0.6rem", alignItems: "center" }}>
          {socials.map((s) => (
            <a
              key={s.label}
              href={s.href}
              target={s.href.startsWith("http") ? "_blank" : undefined}
              rel="noreferrer"
              aria-label={s.label}
              className="glass"
              style={{ width: 42, height: 42, display: "grid", placeItems: "center", color: "var(--text-dim)", borderRadius: 11 }}
            >
              {s.icon()}
            </a>
          ))}
          <Magnetic strength={0.4}>
            <button onClick={toTop} aria-label="Back to top" className="btn btn-ghost" style={{ padding: "0.7rem" }}>
              {Icons.up()}
            </button>
          </Magnetic>
        </div>
      </div>
    </footer>
  );
}
