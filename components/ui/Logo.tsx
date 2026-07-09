/**
 * ijlan.dev logos (Logos.dc.html design import).
 * Logo    — direction 1a: terminal wordmark in JetBrains Mono with an accent
 *           ".dev" and a blinking cursor block.
 * LogoMark — direction 1b: monogram tile — rounded dark square, two accent
 *           dots over an "ij" ligature.
 */

export function Logo({
  height = 30,
  cursor = false,
  className,
}: {
  height?: number;
  cursor?: boolean;
  className?: string;
}) {
  const fontSize = Math.round(height * 0.55);
  return (
    <span
      role="img"
      aria-label="ijlan.dev"
      className={className}
      style={{
        display: "inline-flex",
        alignItems: "center",
        height,
        fontFamily: "var(--font-jetbrains-mono), monospace",
        fontSize,
        fontWeight: 500,
        color: "var(--text)",
        whiteSpace: "nowrap",
        lineHeight: 1,
      }}
    >
      ijlan<span style={{ color: "var(--cyan)" }}>.dev</span>
      {cursor && (
        <span
          aria-hidden="true"
          className="blink"
          style={{
            display: "inline-block",
            width: Math.max(5, Math.round(fontSize * 0.45)),
            height: Math.round(fontSize * 0.95),
            background: "var(--cyan)",
            marginLeft: Math.max(3, Math.round(fontSize * 0.18)),
          }}
        />
      )}
    </span>
  );
}

/** Icon-only monogram tile — for the footer, favicons and tight spaces. */
export function LogoMark({ size = 28, className }: { size?: number; className?: string }) {
  return (
    <svg
      viewBox="0 0 120 120"
      width={size}
      height={size}
      role="img"
      aria-label="ijlan.dev"
      className={className}
      style={{ display: "block" }}
    >
      <rect width="120" height="120" rx="28" fill="#0D0F1A" />
      <circle cx="47" cy="36" r="7.5" fill="var(--cyan, #22D3EE)" />
      <circle cx="73" cy="36" r="7.5" fill="var(--cyan, #22D3EE)" />
      <rect x="40.5" y="52" width="13" height="38" rx="6.5" fill="#EDEFF7" />
      <path d="M66.5 52 L79.5 52 L79.5 86 C79.5 97 71 103 60 101 L60 89.5 C64.5 90.5 66.5 88.5 66.5 84.5 Z" fill="#EDEFF7" />
    </svg>
  );
}
