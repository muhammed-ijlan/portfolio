import { useId } from "react";

const SLICES = ["#fc167e", "#f95e51", "#fbb336", "#fc167e", "#f95e51", "#fbb336"];

export function Logo({ height = 30 }: { height?: number }) {
  const maskId = useId();
  const textStyle = {
    fontFamily: "var(--font-poppins), sans-serif",
    fontWeight: 500,
    fontSize: 110,
  } as const;

  return (
    <svg
      viewBox="50 30 470 135"
      height={height}
      style={{ display: "block" }}
      aria-hidden="true"
      focusable="false"
    >
      <defs>
        <mask id={maskId}>
          <text x="60" y="130" style={textStyle} letterSpacing="-0.04em" fill="white">
            ijlan
          </text>
        </mask>
      </defs>

      {/* Spinning gradient pie, visible only through the "ijlan" text mask */}
      <g mask={`url(#${maskId})`}>
        <g>
          <animateTransform
            attributeName="transform"
            type="rotate"
            from="0 180 100"
            to="360 180 100"
            dur="5s"
            repeatCount="indefinite"
          />
          {SLICES.map((color, i) => (
            <circle
              key={i}
              cx="180"
              cy="100"
              r="200"
              fill="none"
              stroke={color}
              strokeWidth="400"
              strokeDasharray="211 1256.64"
              transform={`rotate(${i * 60} 180 100)`}
            />
          ))}
        </g>
      </g>

      {/* "ijlan" is an invisible spacer so ".dev" lands in the right spot */}
      <text x="60" y="130" style={textStyle}>
        <tspan letterSpacing="-0.04em" fill="none">
          ijlan
        </tspan>
        <tspan letterSpacing="-0.05em" dx="-5.5" fill="currentColor" opacity="0.8">
          .dev
        </tspan>
      </text>
    </svg>
  );
}
