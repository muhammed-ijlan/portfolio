"use client";

import { Analytics } from "@vercel/analytics/next";
import { usePathname } from "next/navigation";

/**
 * Vercel Web Analytics for the public site only.
 *
 * The CMS lives under /admin and is visited almost exclusively by the site
 * owner, so tracking it would inflate visitor counts with your own sessions.
 * Skipping the component there keeps the script off those routes entirely.
 */
export function WebAnalytics() {
  const pathname = usePathname();
  if (pathname?.startsWith("/admin")) return null;
  return <Analytics />;
}
