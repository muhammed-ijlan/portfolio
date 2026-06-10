"use client";

import { AdminIcons } from "../icons";

export function Spinner({ size = 14 }: { size?: number }) {
  return (
    <span
      aria-hidden="true"
      style={{
        width: size,
        height: size,
        border: "2px solid currentColor",
        borderTopColor: "transparent",
        borderRadius: "50%",
        display: "inline-block",
        verticalAlign: "-2px",
        animation: "loSpin .7s linear infinite",
      }}
    />
  );
}

export function PageLoading() {
  return (
    <div style={{ display: "grid", placeItems: "center", padding: "90px 0" }}>
      <span
        aria-label="Loading"
        style={{
          width: 24,
          height: 24,
          border: "2.5px solid var(--border-strong)",
          borderTopColor: "var(--cyan)",
          borderRadius: "50%",
          display: "inline-block",
          animation: "loSpin .7s linear infinite",
        }}
      />
    </div>
  );
}

export function PageError({ error, onRetry }: { error: string; onRetry?: () => void }) {
  return (
    <div className="adm-card" style={{ textAlign: "center", padding: "48px 24px", display: "grid", gap: 12, placeItems: "center" }}>
      <span style={{ color: "#f87171" }}>
        <AdminIcons.alert style={{ width: 26, height: 26 }} />
      </span>
      <div style={{ fontWeight: 700 }}>Couldn&apos;t load this content</div>
      <div className="adm-setting-sub" style={{ maxWidth: 380 }}>{error}</div>
      {onRetry && (
        <button className="adm-btn" onClick={onRetry} style={{ marginTop: 4 }}>
          Try again
        </button>
      )}
    </div>
  );
}
