import Link from "next/link";

export const metadata = {
  title: "Admin — Muhammed Ijlan Portfolio",
};

export default function AdminPage() {
  return (
    <div
      style={{
        minHeight: "100vh",
        background: "var(--bg)",
        color: "var(--text)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        fontFamily: "var(--font-inter)",
      }}
    >
      <div style={{ textAlign: "center", maxWidth: 480, padding: "2rem" }}>
        <div
          style={{
            fontFamily: "var(--font-space-grotesk)",
            fontWeight: 700,
            fontSize: "clamp(1.8rem,4vw,2.8rem)",
            lineHeight: 0.95,
            letterSpacing: "-0.03em",
            marginBottom: "1rem",
          }}
        >
          <span
            style={{
              background: "linear-gradient(120deg, #22D3EE 0%, #7C3AED 100%)",
              WebkitBackgroundClip: "text",
              backgroundClip: "text",
              WebkitTextFillColor: "transparent",
            }}
          >
            Admin Panel
          </span>
        </div>

        <p style={{ color: "var(--text-dim)", fontSize: "1rem", lineHeight: 1.7, marginBottom: "2rem" }}>
          Admin dashboard coming soon. This route is reserved for portfolio management, contact form submissions, and analytics.
        </p>

        <div
          style={{
            display: "inline-flex",
            alignItems: "center",
            gap: "0.45rem",
            padding: "0.35rem 0.7rem",
            fontSize: "0.78rem",
            fontWeight: 500,
            borderRadius: 999,
            border: "1px solid rgba(34,211,238,0.35)",
            background: "rgba(255,255,255,0.025)",
            color: "var(--text-dim)",
            marginBottom: "2rem",
            fontFamily: "var(--font-jetbrains-mono)",
          }}
        >
          <span
            style={{
              width: 7,
              height: 7,
              borderRadius: "50%",
              background: "#f0a868",
              boxShadow: "0 0 8px #f0a868",
            }}
          />
          In development
        </div>

        <div style={{ display: "flex", gap: "0.8rem", justifyContent: "center" }}>
          <Link
            href="/"
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: "0.55rem",
              padding: "0.85rem 1.5rem",
              borderRadius: 12,
              fontWeight: 600,
              fontSize: "0.95rem",
              textDecoration: "none",
              color: "#04060a",
              background: "linear-gradient(120deg, #22D3EE 0%, #7C3AED 100%)",
              boxShadow: "0 10px 40px -12px rgba(34,211,238,0.6)",
            }}
          >
            ← Back to Portfolio
          </Link>
        </div>
      </div>
    </div>
  );
}
