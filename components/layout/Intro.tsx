"use client";

import { useEffect, useState } from "react";

const SEEN_KEY = "mi-intro-seen";

// Skip when the splash already played this session or the user prefers
// reduced motion. Runs client-side only.
const shouldSkip = () => {
  if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return true;
  try {
    return sessionStorage.getItem(SEEN_KEY) === "1";
  } catch {
    return false;
  }
};

// Cached per SPA session. Decided once on the first mount so React StrictMode's
// double-invoked effects (dev) can't see their own sessionStorage write and
// cancel the splash; flipped to "skip" once the splash has fully played.
let decision: "play" | "skip" | null = null;

export function Intro() {
  // "boot" covers SSR + first paint of a genuine first visit (overlay visible,
  // no flash of unstyled page). On repeat visits an inline script in page.tsx
  // sets html[data-intro="seen"] before paint, which hides the overlay via CSS
  // until this effect unmounts it entirely.
  const [phase, setPhase] = useState<"boot" | "play" | "hide" | "off">("boot");

  useEffect(() => {
    if (decision === null) decision = shouldSkip() ? "skip" : "play";
    if (decision === "skip") {
      setPhase("off");
      return;
    }
    // Mark seen at play start so a reload mid-splash doesn't replay it.
    try {
      sessionStorage.setItem(SEEN_KEY, "1");
    } catch {}
    setPhase("play");
    const t = setTimeout(() => {
      setPhase("hide");
      decision = "skip";
      document.documentElement.dataset.intro = "seen";
    }, 1500);
    return () => clearTimeout(t);
  }, []);

  if (phase === "off") return null;

  return (
    <div className={`intro-overlay${phase === "hide" ? " gone" : ""}`} aria-hidden="true">
      <div style={{ textAlign: "center" }}>
        <div className="intro-wordmark" style={{ fontSize: "clamp(2rem,7vw,4rem)" }}>
          <span style={{ display: "inline-block", animation: "introUp 0.8s cubic-bezier(0.16,1,0.3,1) both" }}>
            Muhammed{" "}
          </span>
          <span className="grad-text" style={{ display: "inline-block", animation: "introUp 0.8s cubic-bezier(0.16,1,0.3,1) 0.12s both" }}>
            Ijlan
          </span>
        </div>
        <div
          className="font-mono-custom text-faint"
          style={{ marginTop: "1rem", fontSize: "0.8rem", letterSpacing: "0.3em", animation: "fadeIn 0.6s ease 0.5s both" }}
        >
          LOADING PORTFOLIO
        </div>
      </div>
    </div>
  );
}
