import type { PublicSettings } from "@/lib/portfolio-service";

export function Maintenance({ settings }: { settings: PublicSettings }) {
  return (
    <main style={{ minHeight: "100vh", display: "grid", placeItems: "center", background: "var(--bg)", padding: "2rem" }}>
      <div className="bg-atmosphere" />
      <div style={{ textAlign: "center", maxWidth: 540, position: "relative", zIndex: 2 }}>
        <div className="font-mono-custom" style={{ color: "var(--cyan)", letterSpacing: "0.22em", fontSize: "0.78rem" }}>
          MAINTENANCE
        </div>
        <h1 className="display-xl grad-text" style={{ fontSize: "clamp(2rem,6vw,3.2rem)", margin: "0.8rem 0 1rem" }}>
          {settings.siteTitle}
        </h1>
        <p className="text-dim" style={{ lineHeight: 1.7, fontSize: "1.05rem" }}>
          The site is briefly down for maintenance. Please check back soon.
        </p>
      </div>
    </main>
  );
}
