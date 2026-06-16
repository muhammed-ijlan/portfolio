import { useId } from "react";

const STOPS = (
  <>
    <stop offset="0" stopColor="#fc167e" />
    <stop offset="0.5" stopColor="#f95e51" />
    <stop offset="1" stopColor="#fbb336" />
  </>
);

/**
 * ijlan.dev wordmark (design v8). The "ij" is a gradient monoline ligature —
 * two stems + two dots — and "lan.dev" continues in matching Space Grotesk so
 * the whole thing reads as one word. Text colours use theme variables, so a
 * single SVG works on both dark and light backgrounds.
 */
export function Logo({ height = 30, className }: { height?: number; className?: string }) {
  const gid = `wm-${useId().replace(/:/g, "")}`;
  return (
    <svg
      viewBox="10 22 291 104"
      height={height}
      width={height * (291 / 104)}
      fill="none"
      role="img"
      aria-label="ijlan.dev"
      className={className}
      style={{ display: "block" }}
    >
      <defs>
        <linearGradient id={gid} x1="18" y1="34" x2="70" y2="118" gradientUnits="userSpaceOnUse">
          {STOPS}
        </linearGradient>
      </defs>
      <g stroke={`url(#${gid})`} strokeWidth="16" strokeLinecap="round" strokeLinejoin="round">
        <path d="M 26 58 V 92" />
        <path d="M 58 58 V 100 Q 58 116 42 116 L 30 116" />
      </g>
      <g fill={`url(#${gid})`}>
        <circle cx="26" cy="40" r="9" />
        <circle cx="58" cy="40" r="9" />
      </g>
      <text
        x="74"
        y="92"
        fontSize="66"
        letterSpacing="-1.5"
        style={{ fontFamily: "var(--font-space-grotesk), sans-serif" }}
      >
        <tspan fontWeight={600} style={{ fill: "var(--text)" }}>
          lan
        </tspan>
        <tspan fontWeight={500} style={{ fill: "var(--text-dim)" }}>
          .dev
        </tspan>
      </text>
    </svg>
  );
}

/** Icon-only "ij" ligature mark — for favicons, footer, and tight spaces. */
export function LogoMark({ size = 28, className }: { size?: number; className?: string }) {
  const gid = `mk-${useId().replace(/:/g, "")}`;
  return (
    <svg
      viewBox="0 0 128 128"
      width={size}
      height={size}
      fill="none"
      role="img"
      aria-label="ijlan.dev"
      className={className}
      style={{ display: "block" }}
    >
      <defs>
        <linearGradient id={gid} x1="40" y1="22" x2="92" y2="110" gradientUnits="userSpaceOnUse">
          {STOPS}
        </linearGradient>
      </defs>
      <g stroke={`url(#${gid})`} strokeWidth="15" strokeLinecap="round" strokeLinejoin="round">
        <path d="M 47 50 V 82" />
        <path d="M 81 50 V 88 Q 81 104 65 104 L 51 104" />
      </g>
      <g fill={`url(#${gid})`}>
        <circle cx="47" cy="29" r="8.5" />
        <circle cx="81" cy="29" r="8.5" />
      </g>
    </svg>
  );
}
