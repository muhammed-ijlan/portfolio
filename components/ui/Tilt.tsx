"use client";

import { useCallback, useRef } from "react";

interface TiltProps {
  children: React.ReactNode;
  max?: number;
  glow?: boolean;
  className?: string;
  style?: React.CSSProperties;
  [key: string]: unknown;
}

export function Tilt({ children, max = 9, glow = true, className = "", style = {}, ...rest }: TiltProps) {
  const ref = useRef<HTMLDivElement>(null);

  const onMove = useCallback((e: React.MouseEvent<HTMLDivElement>) => {
    if (typeof window !== "undefined" && window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const el = ref.current;
    if (!el) return;
    const r = el.getBoundingClientRect();
    const px = (e.clientX - r.left) / r.width;
    const py = (e.clientY - r.top) / r.height;
    const rx = (0.5 - py) * max;
    const ry = (px - 0.5) * max;
    el.style.transform = `perspective(900px) rotateX(${rx}deg) rotateY(${ry}deg) translateZ(0)`;
    el.style.setProperty("--mx", `${px * 100}%`);
    el.style.setProperty("--my", `${py * 100}%`);
  }, [max]);

  const reset = useCallback(() => {
    if (ref.current) ref.current.style.transform = "perspective(900px) rotateX(0) rotateY(0)";
  }, []);

  return (
    <div
      ref={ref}
      onMouseMove={onMove}
      onMouseLeave={reset}
      className={className}
      style={{ transition: "transform 0.3s cubic-bezier(0.16,1,0.3,1)", transformStyle: "preserve-3d", ...style }}
      {...rest}
    >
      {glow && (
        <div
          style={{
            position: "absolute", inset: 0, borderRadius: "inherit", pointerEvents: "none",
            background: "radial-gradient(380px circle at var(--mx,50%) var(--my,50%), rgba(34,211,238,0.14), transparent 45%)",
            opacity: 0, transition: "opacity 0.3s ease",
          }}
          className="tilt-glow"
        />
      )}
      {children}
    </div>
  );
}
