"use client";

import { Reveal } from "@/components/ui/Reveal";
import { Magnetic } from "@/components/ui/Magnetic";
import { Typewriter } from "@/components/ui/Typewriter";
import { Icons } from "@/components/ui/Icons";

function CodeCard() {
  const L = ({ n, children, last }: { n: number; children: React.ReactNode; last?: boolean }) => (
    <div className="cl">
      <span className="ln">{n}</span>
      <span className="cl-code">
        {children}
        {last && <span className="cc-cursor" />}
      </span>
    </div>
  );
  const K = ({ c }: { c: string }) => <span className="t-key">{c}</span>;
  const V = ({ c }: { c: string }) => <span className="t-var">{c}</span>;
  const Prop = ({ c }: { c: string }) => <span className="t-prop">{c}</span>;
  const S = ({ c }: { c: string }) => <span className="t-str">{c}</span>;
  const B = ({ c }: { c: string }) => <span className="t-bool">{c}</span>;
  const Pu = ({ c }: { c: string }) => <span className="t-pun">{c}</span>;

  return (
    <div className="code-card" style={{ willChange: "transform" }}>
      <div className="code-card-bar font-mono-custom">
        <span className="dot" style={{ background: "#ff5f57" }} />
        <span className="dot" style={{ background: "#febc2e" }} />
        <span className="dot" style={{ background: "#28c840" }} />
        <span className="code-card-file">ijlan.ts</span>
        <span className="code-card-live">
          <span className="live-dot" />online
        </span>
      </div>
      <div className="code-card-body font-mono-custom">
        <L n={1}><K c="const" /> <V c="engineer" /> <Pu c="= {" /></L>
        <L n={2}>{"  "}<Prop c="name" /><Pu c=": " /><S c={'"Muhammed Ijlan"'} /><Pu c="," /></L>
        <L n={3}>{"  "}<Prop c="role" /><Pu c=": " /><S c={'"Senior Web Developer"'} /><Pu c="," /></L>
        <L n={4}>{"  "}<Prop c="focus" /><Pu c=": [" /><S c={'"Full Stack"'} /><Pu c=", " /><S c={'"Web3"'} /><Pu c="]," /></L>
        <L n={5}>{"  "}<Prop c="stack" /><Pu c=": [" /><S c={'"React"'} /><Pu c=", " /><S c={'"Next.js"'} /><Pu c=", " /><S c={'"Node"'} /><Pu c="]," /></L>
        <L n={6}>{"  "}<Prop c="location" /><Pu c=": " /><S c={'"Dubai, UAE"'} /><Pu c="," /></L>
        <L n={7}>{"  "}<Prop c="experience" /><Pu c=": " /><S c={'"4+ years"'} /><Pu c="," /></L>
        <L n={8}>{"  "}<Prop c="openToWork" /><Pu c=": " /><B c="true" /><Pu c="," /></L>
        <L n={9} last><Pu c="};" /></L>
      </div>
    </div>
  );
}

const SOCIALS = [
  { icon: Icons.github, label: "GitHub", href: "https://github.com/muhammed-ijlan" },
  { icon: Icons.linkedin, label: "LinkedIn", href: "https://linkedin.com/in/ijlan" },
  { icon: Icons.mail, label: "Email", href: "mailto:ijlan.dev@gmail.com" },
];

export function Hero() {
  return (
    <header
      id="home"
      className="section"
      style={{ position: "relative", minHeight: "100vh", display: "flex", alignItems: "center", overflow: "hidden" }}
    >
      {/* Aurora */}
      <div className="aurora" aria-hidden="true">
        <span className="aurora-blob a1" />
        <span className="aurora-blob a2" />
        <span className="aurora-blob a3" />
      </div>

      <div
        className="container-x hero-grid"
        style={{ position: "relative", zIndex: 2, width: "100%", paddingTop: "7rem", paddingBottom: "3rem" }}
      >
        {/* LEFT */}
        <div className="hero-left">
          <Reveal>
            <span className="chip" style={{ borderColor: "rgba(34,211,238,0.35)" }}>
              <span style={{ width: 7, height: 7, borderRadius: "50%", background: "#34d399", boxShadow: "0 0 10px #34d399" }} />
              Available for senior roles · Dubai, UAE
            </span>
          </Reveal>

          <Reveal>
            <h1 className="display-xl" style={{ fontSize: "clamp(2.6rem,6vw,5rem)", margin: "1.3rem 0 0.5rem" }}>
              Muhammed<br /><span className="grad-text">Ijlan</span>
            </h1>
          </Reveal>

          <Reveal>
            <p className="font-mono-custom" style={{ fontSize: "clamp(0.95rem,2vw,1.25rem)", color: "var(--text)", letterSpacing: "0.01em", minHeight: "1.6em", margin: 0 }}>
              <span className="text-faint">&gt; </span>
              <Typewriter words={["Web Developer", "Web3 Engineer", "Full Stack Developer"]} />
            </p>
          </Reveal>

          <Reveal>
            <p className="text-dim" style={{ maxWidth: 480, marginTop: "1.3rem", fontSize: "clamp(1rem,1.4vw,1.12rem)", lineHeight: 1.65 }}>
              4+ years building production-grade, high-performance web &amp; Web3 applications — React, Next.js, TypeScript, Node.js.
            </p>
          </Reveal>

          <Reveal>
            <div style={{ display: "flex", gap: "0.8rem", flexWrap: "wrap", marginTop: "1.9rem" }}>
              <Magnetic>
                <a href="#projects" className="btn btn-primary">View Work {Icons.arrow()}</a>
              </Magnetic>
              <Magnetic>
                <a href="#contact" className="btn btn-ghost">Get in Touch</a>
              </Magnetic>
            </div>
          </Reveal>

          <Reveal>
            <div style={{ display: "flex", gap: "0.6rem", alignItems: "center", marginTop: "1.9rem" }}>
              {SOCIALS.map((s) => (
                <Magnetic key={s.label} strength={0.5}>
                  <a
                    href={s.href}
                    target="_blank"
                    rel="noreferrer"
                    aria-label={s.label}
                    className="glass"
                    style={{ width: 44, height: 44, display: "grid", placeItems: "center", color: "var(--text-dim)", borderRadius: 11 }}
                  >
                    {s.icon()}
                  </a>
                </Magnetic>
              ))}
              <span className="text-faint font-mono-custom" style={{ fontSize: "0.78rem", marginLeft: "0.4rem" }}>
                ijlan.dev@gmail.com
              </span>
            </div>
          </Reveal>
        </div>

        {/* RIGHT — code card */}
        <Reveal className="hero-right">
          <CodeCard />
        </Reveal>
      </div>

      {/* Scroll cue */}
      <div
        style={{ position: "absolute", bottom: 24, left: "50%", transform: "translateX(-50%)", zIndex: 2 }}
        className="hidden-touch"
      >
        <div style={{ width: 24, height: 38, border: "1px solid var(--border-strong)", borderRadius: 14, display: "flex", justifyContent: "center", paddingTop: 7 }}>
          <span style={{ width: 3, height: 8, borderRadius: 3, background: "var(--cyan)", animation: "float-slow 1.6s ease-in-out infinite" }} />
        </div>
      </div>
    </header>
  );
}
