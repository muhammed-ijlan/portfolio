"use client";

import { useEffect, useState } from "react";

export function Intro() {
  const [gone, setGone] = useState(false);

  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) { setGone(true); return; }
    const t = setTimeout(() => setGone(true), 1500);
    return () => clearTimeout(t);
  }, []);

  return (
    <div className={`intro-overlay${gone ? " gone" : ""}`} aria-hidden="true">
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
