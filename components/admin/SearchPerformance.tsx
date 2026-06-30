"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { AdminIcons } from "./icons";
import { TrafficChart } from "./charts/TrafficChart";
import { Spinner } from "./cms/Loading";
import { api } from "@/lib/api";
import type { SearchConsoleResult } from "@/lib/search-console";

const NOT_CONFIGURED_HINT: Record<string, string> = {
  no_site: "Add your Search Console property (e.g. sc-domain:ijlan.dev) in Site Settings.",
  no_credentials: "Add a Google service-account key (GOOGLE_SERVICE_ACCOUNT_KEY) to your environment.",
  no_access: "Grant the service-account email Full access in Search Console → Settings → Users.",
  error: "Couldn't reach the Search Console API. Check the service-account key and try again.",
};

function fmtInt(n: number) {
  return Math.round(n).toLocaleString();
}
function fmtPct(n: number) {
  return `${(n * 100).toFixed(1)}%`;
}
function fmtDate(iso: string) {
  const d = new Date(iso + "T00:00:00");
  return Number.isNaN(d.getTime()) ? iso : d.toLocaleDateString("en", { month: "short", day: "numeric" });
}

function Stat({ label, value, color }: { label: string; value: string; color: string }) {
  return (
    <div style={{ flex: 1, minWidth: 96 }}>
      <div className="adm-feed-time" style={{ marginBottom: 2 }}>{label}</div>
      <div style={{ fontFamily: "var(--font-space-grotesk)", fontWeight: 700, fontSize: 22, color }}>{value}</div>
    </div>
  );
}

export function SearchPerformance() {
  const [data, setData] = useState<SearchConsoleResult | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let active = true;
    api
      .searchConsole()
      .then((d) => active && (setData(d), setError(null)))
      .catch((e) => active && setError(e instanceof Error ? e.message : "Failed to load"))
      .finally(() => active && setLoading(false));
    return () => {
      active = false;
    };
  }, []);

  if (loading) {
    return (
      <div className="adm-card" style={{ marginBottom: 16, display: "flex", alignItems: "center", gap: 10, color: "var(--text-dim)" }}>
        <Spinner /> Loading search performance…
      </div>
    );
  }

  if (error || !data || !data.configured) {
    const reason = !error && data && !data.configured ? data.reason : "error";
    return (
      <div className="adm-card" style={{ marginBottom: 16 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 6 }}>
          <span style={{ color: "#22D3EE" }}><AdminIcons.trending style={{ width: 18, height: 18 }} /></span>
          <div className="adm-card-title" style={{ marginBottom: 0 }}>Search Performance</div>
        </div>
        <div style={{ fontSize: 13, color: "var(--text-dim)", lineHeight: 1.6 }}>
          {error || NOT_CONFIGURED_HINT[reason] || NOT_CONFIGURED_HINT.error}
        </div>
        <Link href="/admin/settings" className="adm-btn" style={{ marginTop: 12, display: "inline-flex" }}>
          <AdminIcons.settings style={{ width: 14, height: 14 }} /> Configure
        </Link>
      </div>
    );
  }

  const { totals, series, topQueries, range } = data;
  const labels = series.map((p) => fmtDate(p.date));

  return (
    <>
      <div className="adm-card" style={{ marginBottom: 16 }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", marginBottom: 12, flexWrap: "wrap", gap: 6 }}>
          <div className="adm-card-title" style={{ marginBottom: 0 }}>Search Performance — Google Search Console</div>
          <span className="adm-feed-time">{fmtDate(range.start)} – {fmtDate(range.end)}</span>
        </div>
        <div style={{ display: "flex", gap: 16, flexWrap: "wrap", marginBottom: 16 }}>
          <Stat label="Clicks" value={fmtInt(totals.clicks)} color="#22D3EE" />
          <Stat label="Impressions" value={fmtInt(totals.impressions)} color="#7C3AED" />
          <Stat label="Avg. CTR" value={fmtPct(totals.ctr)} color="#34d399" />
          <Stat label="Avg. Position" value={totals.position.toFixed(1)} color="#fbbf24" />
        </div>
        <div style={{ height: 200 }}>
          {series.length ? (
            <TrafficChart
              labels={labels}
              series={[
                { label: "Clicks", data: series.map((p) => p.clicks), color: "#22D3EE", fillColor: "rgba(34,211,238,0.10)" },
                { label: "Impressions", data: series.map((p) => p.impressions), color: "#7C3AED" },
              ]}
            />
          ) : (
            <div style={{ height: "100%", display: "grid", placeItems: "center", color: "var(--text-faint)", fontSize: 13 }}>No search data for this range yet.</div>
          )}
        </div>
      </div>

      {topQueries.length > 0 && (
        <div className="adm-card" style={{ marginBottom: 16 }}>
          <div className="adm-card-title" style={{ marginBottom: 8 }}>Top Search Queries</div>
          <div className="adm-table-wrap">
            <table className="adm-table">
              <thead>
                <tr><th>Query</th><th style={{ textAlign: "right" }}>Clicks</th><th style={{ textAlign: "right" }}>Impressions</th><th style={{ textAlign: "right" }}>CTR</th><th style={{ textAlign: "right" }}>Position</th></tr>
              </thead>
              <tbody>
                {topQueries.map((q) => (
                  <tr key={q.key}>
                    <td className="txt-main">{q.key}</td>
                    <td style={{ textAlign: "right", fontFamily: "var(--font-jetbrains-mono), monospace" }}>{fmtInt(q.clicks)}</td>
                    <td style={{ textAlign: "right", fontFamily: "var(--font-jetbrains-mono), monospace" }}>{fmtInt(q.impressions)}</td>
                    <td style={{ textAlign: "right", fontFamily: "var(--font-jetbrains-mono), monospace" }}>{fmtPct(q.ctr)}</td>
                    <td style={{ textAlign: "right", fontFamily: "var(--font-jetbrains-mono), monospace" }}>{q.position.toFixed(1)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </>
  );
}
