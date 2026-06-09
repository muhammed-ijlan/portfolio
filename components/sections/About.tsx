"use client";

import { Reveal } from "@/components/ui/Reveal";
import { Tilt } from "@/components/ui/Tilt";
import { Counter } from "@/components/ui/Counter";

const STATS = [
  { to: 4, suffix: "+", label: "Years building production apps", sub: "React · Next.js · Node · Web3" },
  { to: 30, suffix: "%", label: "Faster API response times", sub: "delivered at Stackroots" },
  { custom: "Shipped", label: "Multi-chain wallet shipped", sub: "Ethereum & Tron · Chrome MV3", accent: true },
] as const;

const TAGS = ["Scalable architecture", "Secure APIs", "Blockchain / Web3", "Cloud-ready", "Performance"];

export function About() {
  return (
    <section id="about" className="section container-x" style={{ paddingTop: "7rem", paddingBottom: "3rem" }}>
      {/* Connecting glow */}
      <div
        aria-hidden="true"
        style={{
          position: "absolute", top: -160, left: "50%", transform: "translateX(-50%)",
          width: "min(1000px, 92vw)", height: 360, pointerEvents: "none", zIndex: 0,
          background: "radial-gradient(ellipse at center, rgba(34,211,238,0.12), rgba(124,58,237,0.08) 42%, transparent 70%)",
          filter: "blur(28px)",
        }}
      />
      <div style={{ position: "relative", zIndex: 1 }}>
        <Reveal><span className="eyebrow">01 — About</span></Reveal>

        <div
          className="about-grid"
          style={{ display: "grid", gridTemplateColumns: "minmax(0,1.4fr) minmax(0,1fr)", gap: "3rem", marginTop: "1.6rem", alignItems: "start" }}
        >
          <Reveal>
            <h2 className="display-xl" style={{ fontSize: "clamp(1.8rem,4vw,2.8rem)", marginBottom: "1.3rem" }}>
              I build <span className="grad-text">scalable, secure</span> web &amp; Web3 products.
            </h2>
            <p className="text-dim" style={{ fontSize: "1.08rem", lineHeight: 1.75 }}>
              Senior Full Stack &amp; Web3 Developer with 4+ years building scalable, secure web apps in React,
              Next.js, TypeScript, Node.js, Express and SQL/NoSQL. Recently shipped a non-custodial multi-chain
              crypto wallet (Ethereum &amp; Tron) as a Chrome MV3 extension — with biometric authentication and
              on-device transaction signing.
            </p>
            <div style={{ display: "flex", gap: "0.5rem", flexWrap: "wrap", marginTop: "1.6rem" }}>
              {TAGS.map((t) => <span key={t} className="chip">{t}</span>)}
            </div>
          </Reveal>

          <Reveal>
            <div style={{ display: "grid", gap: "1rem" }}>
              {STATS.map((s, i) => (
                <Tilt
                  key={i}
                  max={5}
                  className="grad-border"
                  style={{
                    padding: "1.4rem 1.5rem", position: "relative", overflow: "hidden",
                    background: "accent" in s && s.accent
                      ? "linear-gradient(150deg, rgba(34,211,238,0.12), rgba(124,58,237,0.12))"
                      : "var(--bg-elev)",
                  }}
                >
                  <div className="display-xl grad-text" style={{ fontSize: "2.6rem", lineHeight: 1 }}>
                    {"custom" in s ? s.custom : <Counter to={s.to} suffix={s.suffix} />}
                  </div>
                  <div style={{ fontWeight: 600, marginTop: "0.5rem" }}>{s.label}</div>
                  <div className="text-faint font-mono-custom" style={{ fontSize: "0.78rem", marginTop: "0.25rem" }}>{s.sub}</div>
                </Tilt>
              ))}
            </div>
          </Reveal>
        </div>
      </div>
    </section>
  );
}
