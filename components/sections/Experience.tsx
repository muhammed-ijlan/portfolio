"use client";

import { Reveal } from "@/components/ui/Reveal";
import { Tilt } from "@/components/ui/Tilt";
import { Icons } from "@/components/ui/Icons";

const JOBS = [
  {
    role: "Senior Web Developer",
    company: "Token 13 Software LLC",
    place: "Dubai, UAE",
    period: "2025 — 2026",
    tags: ["React", "TypeScript", "Vite", "WebAssembly", "WebAuthn", "MV3"],
    points: [
      "Built a non-custodial multi-chain crypto wallet (Ethereum & Tron) as a Manifest V3 Chrome extension within a Turbo/pnpm monorepo.",
      "Integrated a WebAssembly cryptography SDK — BIP39, HD key derivation, AES-GCM encryption and on-device transaction signing.",
      "Implemented WebAuthn biometric auth with a service-worker security model, session auto-lock and a Protection Encryption Key.",
      "Built an admin platform: wallet/transaction dashboards, 2FA, Tron gas-fee controls and asset-distribution analytics.",
    ],
  },
  {
    role: "Senior Software Developer",
    company: "Stackroots Technology Solutions",
    place: "Calicut, India",
    period: "2022 — 2025",
    tags: ["React", "Next.js", "Node.js", "SSR", "SEO", "Mentoring"],
    points: [
      "Architected scalable full-stack apps serving thousands of users with high reliability.",
      "Cut API response times by up to 30% and raised maintainability ~25% with reusable component systems.",
      "Built SEO-optimized, high-performance SSR apps, delivering production features ahead of deadlines.",
      "Mentored junior developers through code reviews, best practices and performance-optimization techniques.",
    ],
  },
];

export function Experience() {
  return (
    <section id="experience" className="section container-x" style={{ paddingTop: "7rem", paddingBottom: "3rem" }}>
      <Reveal><span className="eyebrow">02 — Experience</span></Reveal>
      <Reveal>
        <h2 className="display-xl" style={{ fontSize: "clamp(1.8rem,4vw,2.8rem)", margin: "1rem 0 2.5rem" }}>
          Where I&apos;ve shipped
        </h2>
      </Reveal>

      <div style={{ position: "relative", paddingLeft: "2rem" }}>
        <div style={{ position: "absolute", left: 7, top: 6, bottom: 0, width: 2 }} className="timeline-line" />
        {JOBS.map((j, i) => (
          <Reveal key={i}>
            <div style={{ position: "relative", paddingBottom: i === JOBS.length - 1 ? 0 : "2.6rem" }}>
              <span
                className="timeline-dot"
                style={{ position: "absolute", left: "-2rem", top: 6, width: 16, height: 16, borderRadius: "50%", transform: "translateX(-1px)" }}
              />
              <Tilt max={4} glow={false} className="grad-border" style={{ padding: "1.6rem 1.7rem" }}>
                <div style={{ display: "flex", justifyContent: "space-between", flexWrap: "wrap", gap: "0.4rem", alignItems: "baseline" }}>
                  <h3 className="font-display" style={{ fontSize: "1.35rem", fontWeight: 600 }}>{j.role}</h3>
                  <span className="font-mono-custom text-faint" style={{ fontSize: "0.82rem" }}>{j.period}</span>
                </div>
                <div className="grad-text" style={{ fontWeight: 600, marginTop: "0.2rem" }}>
                  {j.company}
                  <span className="text-faint" style={{ fontWeight: 400 }}> · {j.place}</span>
                </div>
                <ul style={{ margin: "1.1rem 0 0", padding: 0, listStyle: "none", display: "grid", gap: "0.7rem" }}>
                  {j.points.map((p, k) => (
                    <li key={k} className="text-dim" style={{ display: "flex", gap: "0.7rem", fontSize: "0.96rem", lineHeight: 1.55 }}>
                      <span style={{ color: "var(--cyan)", marginTop: "0.15rem", flexShrink: 0 }}>{Icons.arrow({ width: 15, height: 15 })}</span>
                      <span>{p}</span>
                    </li>
                  ))}
                </ul>
                <div style={{ display: "flex", gap: "0.45rem", flexWrap: "wrap", marginTop: "1.2rem" }}>
                  {j.tags.map((t) => <span key={t} className="chip" style={{ fontSize: "0.72rem" }}>{t}</span>)}
                </div>
              </Tilt>
            </div>
          </Reveal>
        ))}
      </div>
    </section>
  );
}
