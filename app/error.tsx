"use client";

import { useEffect } from "react";

export default function Error({ error, reset }: { error: Error & { digest?: string }; reset: () => void }) {
  useEffect(() => {
    console.error("[app] unhandled error:", error);
  }, [error]);

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
        <div className="font-mono-custom" style={{ color: "var(--cyan)", letterSpacing: "0.2em", fontSize: "0.8rem" }}>
          ERROR
        </div>
        <h1 className="display-xl grad-text" style={{ fontSize: "clamp(2rem,6vw,3.4rem)", margin: "0.8rem 0 1rem" }}>
          Something went wrong
        </h1>
        <p className="text-dim" style={{ lineHeight: 1.7, marginBottom: "1.8rem" }}>
          An unexpected error occurred while loading this page. You can try again, or head back home.
        </p>
        <div style={{ display: "flex", gap: "0.8rem", justifyContent: "center", flexWrap: "wrap" }}>
          <button className="btn btn-primary" onClick={reset}>Try again</button>
          <a className="btn btn-ghost" href="/">Back home</a>
        </div>
      </div>
    </main>
  );
}
