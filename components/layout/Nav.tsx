"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useTheme } from "@/components/ui/ThemeProvider";
import type { SectionToggles } from "@/lib/seed-data";

const ALL_LINKS = [
  ["About", "/#about", "about"],
  ["Experience", "/#experience", "experience"],
  ["Projects", "/#projects", "projects"],
  ["Skills", "/#skills", "skills"],
  ["Writing", "/blog", "blog"],
  ["Contact", "/#contact", "contact"],
] as const;

function Wordmark() {
  return (
    <span className="font-mono-custom" style={{ fontSize: 16, fontWeight: 500, whiteSpace: "nowrap" }}>
      ijlan<span style={{ color: "var(--cyan)" }}>.dev</span>
    </span>
  );
}

export function Nav({ sections }: { sections?: SectionToggles }) {
  const { theme, toggleTheme } = useTheme();
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const [active, setActive] = useState("home");

  const NAV_LINKS = ALL_LINKS.filter(([, , key]) => sections?.[key] !== false);

  const isActive = (href: string) =>
    href === "/blog" ? pathname.startsWith("/blog") : pathname === "/" && active === href.split("#")[1];

  useEffect(() => {
    const ids = ["home", "about", "experience", "projects", "skills", "contact"];
    const io = new IntersectionObserver(
      (entries) => entries.forEach((e) => { if (e.isIntersecting) setActive(e.target.id); }),
      { rootMargin: "-45% 0px -50% 0px" }
    );
    ids.forEach((id) => { const el = document.getElementById(id); if (el) io.observe(el); });
    return () => io.disconnect();
  }, []);

  const squareBtn: React.CSSProperties = {
    display: "inline-flex", alignItems: "center", justifyContent: "center",
    width: 40, height: 40, background: "var(--surface)", border: "1px solid var(--border)",
    borderRadius: 12, cursor: "pointer", fontSize: 16, color: "var(--text)", lineHeight: 1,
  };

  return (
    <>
      <nav
        style={{
          position: "fixed", top: 0, left: 0, right: 0, zIndex: 50,
          display: "flex", alignItems: "center", justifyContent: "space-between", gap: 16,
          padding: "14px clamp(20px, 5vw, 72px)",
          background: "var(--nav-bg)",
          backdropFilter: "blur(20px) saturate(1.4)",
          WebkitBackdropFilter: "blur(20px) saturate(1.4)",
          borderBottom: "1px solid var(--border)",
        }}
      >
        <Link href="/" aria-label="ijlan.dev — home" style={{ textDecoration: "none", color: "var(--text)" }}>
          <Wordmark />
        </Link>

        <div className="nav-links" style={{ display: "flex", alignItems: "center", gap: 26 }}>
          {NAV_LINKS.map(([label, href]) => (
            <Link
              key={href}
              href={href}
              style={{
                fontSize: 14, fontWeight: 500, textDecoration: "none",
                color: isActive(href) ? "var(--text)" : "var(--ink-soft)",
                transition: "color 0.2s ease",
              }}
            >
              {label}
            </Link>
          ))}
        </div>

        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          <button onClick={toggleTheme} aria-label="Toggle dark / light mode" title="Toggle theme" style={squareBtn}>
            {theme === "dark" ? "☀" : "☾"}
          </button>
          {sections?.contact !== false && (
            <Link
              href="/#contact"
              className="nav-cta nav-hire"
              style={{
                fontSize: 14, fontWeight: 600, color: "var(--bg)", background: "var(--text)",
                padding: "11px 24px", borderRadius: 100, textDecoration: "none", whiteSpace: "nowrap",
                transition: "background-color 0.25s ease, color 0.25s ease",
              }}
            >
              Hire me
            </Link>
          )}
          <button
            className="nav-burger"
            aria-label="Menu"
            aria-expanded={open}
            onClick={() => setOpen((o) => !o)}
            style={{
              display: "none", flexDirection: "column", justifyContent: "center", gap: 5,
              width: 40, height: 40, padding: 10, background: "var(--surface)",
              border: "1px solid var(--border)", borderRadius: 12, cursor: "pointer",
            }}
          >
            <span style={{ display: "block", height: 2, borderRadius: 2, background: "var(--text)" }} />
            <span style={{ display: "block", height: 2, borderRadius: 2, background: "var(--text)" }} />
            <span style={{ display: "block", height: 2, borderRadius: 2, background: "var(--text)" }} />
          </button>
        </div>
      </nav>

      {open && (
        <div
          style={{
            position: "fixed", top: 80, left: 16, right: 16, zIndex: 60,
            background: "var(--surface)", border: "1px solid var(--border)", borderRadius: 18,
            padding: 12, boxShadow: "0 24px 64px rgba(0,0,0,0.35)",
            display: "flex", flexDirection: "column", gap: 2,
            animation: "fadeUp 0.3s cubic-bezier(0.22,1,0.36,1) both",
          }}
        >
          {NAV_LINKS.map(([label, href]) => (
            <Link
              key={href}
              href={href}
              onClick={() => setOpen(false)}
              className="nav-menu-item"
              style={{
                color: "var(--text)", fontSize: 16, fontWeight: 600, textDecoration: "none",
                padding: "14px 16px", borderRadius: 12,
              }}
            >
              {label}
            </Link>
          ))}
          {sections?.contact !== false && (
            <Link
              href="/#contact"
              onClick={() => setOpen(false)}
              style={{
                marginTop: 8, textAlign: "center", fontSize: 15, fontWeight: 600, color: "#ffffff",
                background: "var(--cyan)", padding: "14px 16px", borderRadius: 12, textDecoration: "none",
              }}
            >
              Hire me
            </Link>
          )}
        </div>
      )}
    </>
  );
}
