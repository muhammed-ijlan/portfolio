export default function Loading() {
  return (
    <div style={{ minHeight: "100vh", display: "grid", placeItems: "center", background: "var(--bg)" }}>
      <span
        aria-label="Loading"
        style={{
          width: 36,
          height: 36,
          border: "3px solid var(--border-strong)",
          borderTopColor: "var(--cyan)",
          borderRadius: "50%",
          display: "inline-block",
          animation: "spin 0.7s linear infinite",
        }}
      />
    </div>
  );
}
