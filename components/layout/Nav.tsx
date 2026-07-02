"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useTheme } from "@/components/ui/ThemeProvider";
import { Icons } from "@/components/ui/Icons";
import { Logo } from "@/components/ui/Logo";

const NAV_LINKS = [
  ["About", "/#about"],
  ["Experience", "/#experience"],
  ["Skills", "/#skills"],
  ["Projects", "/#projects"],
  ["Writing", "/blog"],
  ["Contact", "/#contact"],
] as const;

export function Nav() {
  const { theme, toggleTheme } = useTheme();
  const pathname = usePathname();
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  const [active, setActive] = useState("home");

  const isActive = (href: string) =>
    href === "/blog" ? pathname.startsWith("/blog") : pathname === "/" && active === href.split("#")[1];

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    const ids = ["home", "about", "experience", "skills", "projects", "contact"];
    const io = new IntersectionObserver(
      (entries) => entries.forEach((e) => { if (e.isIntersecting) setActive(e.target.id); }),
      { rootMargin: "-45% 0px -50% 0px" }
    );
    ids.forEach((id) => { const el = document.getElementById(id); if (el) io.observe(el); });
    return () => io.disconnect();
  }, []);

  return (
    <nav
      style={{
        position: "fixed", top: 0, left: 0, right: 0, zIndex: 50,
        transition: "all 0.4s ease",
        background: scrolled ? "color-mix(in oklab, var(--bg) 72%, transparent)" : "transparent",
        backdropFilter: scrolled ? "blur(16px) saturate(140%)" : "none",
        WebkitBackdropFilter: scrolled ? "blur(16px) saturate(140%)" : "none",
        borderBottom: scrolled ? "1px solid var(--border)" : "1px solid transparent",
      }}
    >
      <div className="container-x" style={{ display: "flex", alignItems: "center", justifyContent: "space-between", height: 68 }}>
        <Link href="/" aria-label="ijlan.dev — home" style={{ display: "flex", alignItems: "center", textDecoration: "none", color: "var(--text)" }}>
          <Logo height={30} />
        </Link>

        <div className="nav-links" style={{ display: "flex", gap: "0.3rem", alignItems: "center" }}>
          {NAV_LINKS.map(([label, href]) => {
            const activeLink = isActive(href);
            return (
              <Link key={href} href={href} style={{
                padding: "0.5rem 0.85rem", fontSize: "0.9rem", textDecoration: "none", borderRadius: 8,
                color: activeLink ? "var(--text)" : "var(--text-dim)", fontWeight: 500,
                transition: "color 0.25s ease", position: "relative",
              }}>
                {label}
                {activeLink && (
                  <span style={{ position: "absolute", left: "0.85rem", right: "0.85rem", bottom: 2, height: 2, borderRadius: 2, background: "var(--accent-grad)" }} />
                )}
              </Link>
            );
          })}
        </div>

        <div style={{ display: "flex", gap: "0.5rem", alignItems: "center" }}>
          <button
            onClick={toggleTheme}
            aria-label="Toggle theme"
            className="glass"
            style={{ width: 40, height: 40, display: "grid", placeItems: "center", color: "var(--text)", borderRadius: 10, cursor: "pointer", background: "var(--glass)" }}
          >
            {theme === "dark" ? Icons.sun() : Icons.moon()}
          </button>
          <Link href="/#contact" className="btn btn-primary nav-cta" style={{ padding: "0.6rem 1.1rem", fontSize: "0.88rem" }}>
            Hire me
          </Link>
          <button
            className="nav-burger"
            aria-label="Menu"
            onClick={() => setOpen((o) => !o)}
            style={{ display: "none", background: "none", border: "none", color: "var(--text)", cursor: "pointer" }}
          >
            {open ? Icons.close() : Icons.menu()}
          </button>
        </div>
      </div>

      {}
      <div
        style={{
          display: open ? "block" : "none",
          borderTop: "1px solid var(--border)",
          background: "color-mix(in oklab, var(--bg) 92%, transparent)",
          backdropFilter: "blur(16px)",
        }}
      >
        <div className="container-x" style={{ display: "flex", flexDirection: "column", padding: "1rem 24px 1.4rem" }}>
          {NAV_LINKS.map(([label, href]) => (
            <Link
              key={href}
              href={href}
              onClick={() => setOpen(false)}
              style={{ padding: "0.85rem 0", fontSize: "1.05rem", textDecoration: "none", color: "var(--text)", borderBottom: "1px solid var(--border)" }}
            >
              {label}
            </Link>
          ))}
        </div>
      </div>
    </nav>
  );
}
