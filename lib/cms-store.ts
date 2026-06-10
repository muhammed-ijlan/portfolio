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

const NOW = new Date("2026-06-10T12:00:00");

export function relTime(iso: string) {
  const diff = (NOW.getTime() - new Date(iso).getTime()) / 1000;
  if (diff < 3600) return Math.max(1, Math.round(diff / 60)) + "m ago";
  if (diff < 86400) return Math.round(diff / 3600) + "h ago";
  return Math.round(diff / 86400) + "d ago";
}

export function trafficSeries() {
  const days = Array.from({ length: 30 }, (_, i) => {
    const d = new Date("2026-06-10");
    d.setDate(d.getDate() - 29 + i);
    return d.toLocaleDateString("en", { month: "short", day: "numeric" });
  });
  const views = days.map((_, i) => Math.round(240 + Math.sin(i * 0.5) * 90 + i * 11 + Math.cos(i * 1.7) * 35 + 35));
  const visitors = views.map((v) => Math.round(v * 0.62));
  return { days, views, visitors };
}
