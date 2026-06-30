"use client";

import { useCallback, useEffect, useState } from "react";
import { SEED, type CmsData } from "./seed-data";

export { SEED };
export type {
  Project,
  Experience,
  Skill,
  Message,
  Stat,
  About,
  Media,
  Settings,
  CmsData,
} from "./seed-data";

const CMS_LS = "mi-cms-v1";

function cmsLoad(): CmsData {
  if (typeof window === "undefined") return structuredClone(SEED);
  try {
    const saved = JSON.parse(localStorage.getItem(CMS_LS) || "{}");
    return { ...structuredClone(SEED), ...saved };
  } catch {
    return structuredClone(SEED);
  }
}

let _cms: CmsData = cmsLoad();
const _subs = new Set<() => void>();

export const CMS = {
  get<K extends keyof CmsData>(key: K): CmsData[K] {
    return _cms[key];
  },
  set<K extends keyof CmsData>(key: K, val: CmsData[K] | ((prev: CmsData[K]) => CmsData[K])) {
    const next = typeof val === "function" ? (val as (p: CmsData[K]) => CmsData[K])(_cms[key]) : val;
    _cms = { ..._cms, [key]: next };
    if (typeof window !== "undefined") {
      try {
        localStorage.setItem(CMS_LS, JSON.stringify(_cms));
      } catch {}
    }
    _subs.forEach((fn) => fn());
  },
  reset() {
    if (typeof window !== "undefined") {
      try {
        localStorage.removeItem(CMS_LS);
      } catch {}
    }
    _cms = structuredClone(SEED);
    _subs.forEach((fn) => fn());
  },
  subscribe(fn: () => void) {
    _subs.add(fn);
    return () => {
      _subs.delete(fn);
    };
  },
};

export function useStore<K extends keyof CmsData>(
  key: K
): [CmsData[K], (val: CmsData[K] | ((prev: CmsData[K]) => CmsData[K])) => void] {
  const [state, setState] = useState<CmsData[K]>(() => SEED[key]);

  useEffect(() => {
    setState(CMS.get(key));
    return CMS.subscribe(() => setState(CMS.get(key)));
  }, [key]);

  const set = useCallback(
    (val: CmsData[K] | ((prev: CmsData[K]) => CmsData[K])) => CMS.set(key, val),
    [key]
  );

  return [state, set];
}

export const uid = () => Date.now().toString(36) + Math.random().toString(36).slice(2, 6);

const AVATAR_GRADIENTS = [
  "linear-gradient(135deg,#22D3EE,#7C3AED)",
  "linear-gradient(135deg,#3b82f6,#22D3EE)",
  "linear-gradient(135deg,#7C3AED,#ec4899)",
  "linear-gradient(135deg,#34d399,#22D3EE)",
  "linear-gradient(135deg,#f59e0b,#ef4444)",
  "linear-gradient(135deg,#6366f1,#7C3AED)",
];

export function initials(name: string) {
  return name
    .split(" ")
    .map((w) => w[0])
    .slice(0, 2)
    .join("")
    .toUpperCase();
}

export function avatarColor(seed: string) {
  let h = 0;
  for (const c of seed) h = (h * 31 + c.charCodeAt(0)) % AVATAR_GRADIENTS.length;
  return AVATAR_GRADIENTS[h];
}

const MINUTE = 60;
const HOUR = 3600;
const DAY = 86400;
const WEEK = 604800;
const MONTH = 2592000; // 30 days
const YEAR = 31536000;

/** Human-friendly relative time, measured from the real "now" on each render. */
export function relTime(iso: string | number | Date) {
  const then = new Date(iso).getTime();
  if (!Number.isFinite(then)) return "";
  const diff = (Date.now() - then) / 1000;
  if (diff < 0) return "just now"; // clock skew / future timestamps
  if (diff < 45) return "just now";
  if (diff < 90) return "1m ago";
  if (diff < HOUR) return Math.round(diff / MINUTE) + "m ago";
  if (diff < 2 * HOUR) return "1h ago";
  if (diff < DAY) return Math.round(diff / HOUR) + "h ago";
  if (diff < 2 * DAY) return "yesterday";
  if (diff < WEEK) return Math.round(diff / DAY) + "d ago";
  if (diff < MONTH) return Math.round(diff / WEEK) + "w ago";
  if (diff < YEAR) return Math.round(diff / MONTH) + "mo ago";
  return Math.round(diff / YEAR) + "y ago";
}

/**
 * Real daily message volume over the last `days` window, plus a trailing
 * 7-day average. Computed from actual message timestamps — no synthetic data.
 */
export function messageSeries(dates: (string | number | Date)[], days = 30) {
  const start = new Date();
  start.setHours(0, 0, 0, 0);
  start.setDate(start.getDate() - (days - 1));
  const startMs = start.getTime();

  const buckets = new Array(days).fill(0);
  for (const raw of dates) {
    const t = new Date(raw).getTime();
    if (!Number.isFinite(t)) continue;
    const idx = Math.floor((t - startMs) / (DAY * 1000));
    if (idx >= 0 && idx < days) buckets[idx] += 1;
  }

  const labels = buckets.map((_, i) => {
    const d = new Date(startMs + i * DAY * 1000);
    return d.toLocaleDateString("en", { month: "short", day: "numeric" });
  });
  const avg = buckets.map((_, i) => {
    const window = buckets.slice(Math.max(0, i - 6), i + 1);
    return Math.round((window.reduce((a, b) => a + b, 0) / window.length) * 10) / 10;
  });

  return { labels, received: buckets as number[], avg };
}
