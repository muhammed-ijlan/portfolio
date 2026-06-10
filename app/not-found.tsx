import Link from "next/link";

export default function NotFound() {
  return (
    <main
      style={{
        minHeight: "100vh",
        display: "grid",
        placeItems: "center",
        background: "var(--bg)",
        padding: "2rem",
      }}
    >
      <div style={{ textAlign: "center", maxWidth: 520 }}>
        <div className="display-xl grad-text" style={{ fontSize: "clamp(3.5rem,12vw,7rem)", lineHeight: 1 }}>
          404
        </div>
        <h1 className="font-display" style={{ fontSize: "clamp(1.3rem,3vw,1.8rem)", margin: "0.6rem 0 1rem", fontWeight: 600 }}>
          Page not found
        </h1>
        <p className="text-dim" style={{ lineHeight: 1.7, marginBottom: "1.8rem" }}>
          The page you&apos;re looking for doesn&apos;t exist or has moved.
        </p>
        <Link className="btn btn-primary" href="/">Back to portfolio</Link>
      </div>
    </main>
  );
}
