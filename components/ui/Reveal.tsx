"use client";

import { useEffect, useRef } from "react";
import { motionDisabled } from "./motion";

const easeOutCubic = (p: number) => 1 - Math.pow(1 - p, 3);
const clamp01 = (v: number) => Math.max(0, Math.min(1, v));

type ScrollItem = { cb: (vh: number) => void };
const scrollReg = new Set<ScrollItem>();
let ticking = false;

function runScroll() {
  const vh = window.innerHeight;
  scrollReg.forEach((item) => { try { item.cb(vh); } catch { } });
  ticking = false;
}

if (typeof window !== "undefined") {
  const onScroll = () => { if (!ticking) { ticking = true; requestAnimationFrame(runScroll); } };
  window.addEventListener("scroll", onScroll, { passive: true });
  window.addEventListener("resize", onScroll, { passive: true });
}

export function registerScroll(cb: (vh: number) => void) {
  const item: ScrollItem = { cb };
  scrollReg.add(item);
  cb(window.innerHeight);
  return () => { scrollReg.delete(item); };
}

interface RevealProps {
  children: React.ReactNode;
  as?: keyof React.JSX.IntrinsicElements;
  className?: string;
  style?: React.CSSProperties;
  distance?: number;
  blur?: number;
  delay?: number;
  [key: string]: unknown;
}

export function Reveal({
  children,
  as: Tag = "div",
  className = "",
  style = {},
  distance = 36,
  blur = 10,
  delay,
  ...rest
}: RevealProps) {
  const ref = useRef<HTMLElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    if (motionDisabled()) {
      el.style.opacity = "1";
      el.style.transform = "none";
      el.style.filter = "none";
      return undefined;
    }
    return registerScroll((vh) => {
      const r = el.getBoundingClientRect();
      const p = clamp01((vh - r.top) / (vh * 0.62));
      const e = easeOutCubic(p);
      el.style.opacity = String(e);
      el.style.transform = `translate3d(0, ${(1 - e) * distance}px, 0)`;
      el.style.filter = e > 0.985 ? "none" : `blur(${(1 - e) * blur}px)`;
    });
  }, []);

  const T = Tag as React.ElementType;
  return (
    <T
      ref={ref}
      className={className}
      style={{ opacity: 0, willChange: "opacity, transform, filter", ...style }}
      {...rest}
    >
      {children}
    </T>
  );
}
