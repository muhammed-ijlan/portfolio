"use client";

import { Magnetic } from "@/components/ui/Magnetic";
import { Typewriter } from "@/components/ui/Typewriter";
import type { PublicAbout } from "@/lib/portfolio-service";
import type { Hero as HeroData } from "@/lib/seed-data";

const HERO_DEFAULTS: HeroData = {
  roles: [
    "Senior Full Stack & Web3 Developer",
    "React · Next.js · TypeScript · Node",
    "Non-custodial wallets · MV3 · WebAuthn",
  ],
  availability: "Available for senior roles",
  focus: ["Full Stack", "Web3"],
  stack: ["React", "Next.js", "Node"],
  experience: "4+ years",
  openToWork: true,
};

function resolveHero(hero?: Partial<HeroData>): HeroData {
  const h = hero ?? {};
  return {
    roles: h.roles?.length ? h.roles : HERO_DEFAULTS.roles,
    availability: h.availability || HERO_DEFAULTS.availability,
    focus: h.focus?.length ? h.focus : HERO_DEFAULTS.focus,
    stack: h.stack?.length ? h.stack : HERO_DEFAULTS.stack,
    experience: h.experience || HERO_DEFAULTS.experience,
    openToWork: h.openToWork ?? HERO_DEFAULTS.openToWork,
  };
}

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

const ArrayVal = ({ items }: { items: string[] }) => (
  <>
    <Pu c="[" />
    {items.map((it, i) => (
      <span key={it + i}>
        <S c={`"${it}"`} />
        {i < items.length - 1 && <Pu c=", " />}
      </span>
    ))}
    <Pu c="]," />
  </>
);

function CodeCard({ about, hero }: { about: PublicAbout; hero: HeroData }) {
  return (
    <div className="code-card code-card-float" style={{ willChange: "transform" }}>
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
        <L n={2}>{"  "}<Prop c="name" /><Pu c=": " /><S c={`"${about.name}"`} /><Pu c="," /></L>
        <L n={3}>{"  "}<Prop c="role" /><Pu c=": " /><S c={`"${about.role}"`} /><Pu c="," /></L>
        <L n={4}>{"  "}<Prop c="focus" /><Pu c=": " /><ArrayVal items={hero.focus} /></L>
        <L n={5}>{"  "}<Prop c="stack" /><Pu c=": " /><ArrayVal items={hero.stack} /></L>
        <L n={6}>{"  "}<Prop c="location" /><Pu c=": " /><S c={`"${about.location}"`} /><Pu c="," /></L>
        <L n={7}>{"  "}<Prop c="experience" /><Pu c=": " /><S c={`"${hero.experience}"`} /><Pu c="," /></L>
        <L n={8}>{"  "}<Prop c="openToWork" /><Pu c=": " /><B c={hero.openToWork ? "true" : "false"} /><Pu c="," /></L>
        <L n={9} last><Pu c="};" /></L>
      </div>
    </div>
  );
}

const stripScheme = (url: string) => url.replace(/^https?:\/\/(www\.)?/, "");

export function Hero({ about, resumeUrl }: { about: PublicAbout; resumeUrl?: string }) {
  const [firstName, ...restName] = about.name.split(" ");
  const lastName = restName.join(" ");
  const hero = resolveHero(about.hero);
  // Floating stat badges: first stat top-right, the last one bottom-left.
  const badgeA = about.stats[0];
  const badgeB = about.stats.length > 1 ? about.stats[about.stats.length - 1] : undefined;

  return (
    <header
      id="home"
      className="section hero-v3"
      style={{ position: "relative", minHeight: "100vh", display: "flex", alignItems: "center", overflow: "hidden" }}
    >
      {}
      <div className="hero-dots" aria-hidden="true" />
      <div className="hero-glow-a" aria-hidden="true" />
      <div className="hero-glow-b" aria-hidden="true" />

      <div
        className="container-x hero-grid"
        style={{ position: "relative", zIndex: 2, width: "100%", paddingTop: "7rem", paddingBottom: "3rem" }}
      >
        {}
        <div className="hero-left">
          <div className="fade-up" style={{ animationDelay: "0.08s" }}>
            <span className="hero-availability">
              <span className="pulse" />
              <span style={{ fontSize: "clamp(12px, 1.6vw, 13px)", fontWeight: 500, color: "var(--hero-ink-mid)" }}>
                {hero.availability} · {about.location}
              </span>
            </span>
          </div>

          <h1
            className="fade-up"
            style={{
              fontSize: "clamp(42px, 8.5vw, 88px)",
              lineHeight: 1.02,
              letterSpacing: "-0.035em",
              fontWeight: 800,
              margin: "clamp(20px, 3vw, 28px) 0 18px",
              animationDelay: "0.15s",
            }}
          >
            {firstName}
            <br />
            {lastName || firstName}
            <span style={{ color: "var(--cyan)" }}>.</span>
          </h1>

          <p
            className="font-mono-custom hero-typed fade-up"
            style={{
              fontSize: "clamp(13.5px, 2vw, 16px)",
              fontWeight: 500,
              minHeight: 24,
              margin: "0 0 20px",
              animationDelay: "0.22s",
            }}
          >
            <Typewriter words={hero.roles} />
          </p>

          <p
            className="fade-up"
            style={{
              margin: "0 0 32px",
              maxWidth: 540,
              fontSize: "clamp(15px, 2vw, 16.5px)",
              lineHeight: 1.7,
              color: "var(--hero-ink-soft)",
              textWrap: "pretty",
              animationDelay: "0.28s",
            }}
          >
            {about.bio}
          </p>

          <div
            className="fade-up"
            style={{ display: "flex", alignItems: "center", gap: 12, flexWrap: "wrap", marginBottom: 32, animationDelay: "0.34s" }}
          >
            <Magnetic>
              <a href="#projects" className="hero-cta-primary">View work →</a>
            </Magnetic>
            <Magnetic>
              <a href="#contact" className="hero-cta-ghost">Get in touch</a>
            </Magnetic>
            {resumeUrl && (
              <a href={resumeUrl} target="_blank" rel="noreferrer" className="hero-cta-text">Résumé ↓</a>
            )}
          </div>

          <div
            className="font-mono-custom fade-up"
            style={{ display: "flex", alignItems: "center", gap: 18, flexWrap: "wrap", fontSize: 13, animationDelay: "0.4s" }}
          >
            {about.socials.github && (
              <a href={about.socials.github} target="_blank" rel="noreferrer" className="hero-social-link">
                {stripScheme(about.socials.github).replace(/\/.*$/, "")} ↗
              </a>
            )}
            {about.socials.linkedin && (
              <a href={about.socials.linkedin} target="_blank" rel="noreferrer" className="hero-social-link">
                linkedin ↗
              </a>
            )}
            {about.email && (
              <a href={`mailto:${about.email}`} className="hero-social-link">
                {about.email}
              </a>
            )}
          </div>
        </div>

        {}
        <div className="hero-right fade-up" style={{ position: "relative", animationDelay: "0.3s", maxWidth: 560, width: "100%", justifySelf: "center" }}>
          <CodeCard about={about} hero={hero} />

          {badgeA && (
            <div className="hero-stat-badge" style={{ top: -18, right: -10 }}>
              <span className="val">{badgeA.value} {badgeA.label.toLowerCase().includes("year") ? "yrs" : badgeA.label}</span>
              <span className="sub">{badgeA.sub}</span>
            </div>
          )}
          {badgeB && (
            <div className="hero-stat-badge" style={{ bottom: -20, left: -14 }}>
              <span className="val accent">{badgeB.value} {badgeB.label.toLowerCase().includes("faster") ? "faster" : badgeB.label}</span>
              <span className="sub">{badgeB.sub}</span>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
