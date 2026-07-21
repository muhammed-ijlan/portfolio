"use client";

import { useEffect, useState } from "react";
import { AdminIcons } from "./icons";
import { TrafficChart } from "./charts/TrafficChart";
import { Spinner } from "./cms/Loading";
import { api } from "@/lib/api";
import type { VercelAnalyticsResult, VercelRow } from "@/lib/vercel-analytics";

const NOT_CONFIGURED_HINT: Record<string, string> = {
  no_token: "Add a Vercel access token (VERCEL_ANALYTICS_TOKEN) to your environment.",
  no_project: "Add your Vercel project id (VERCEL_PROJECT_ID) to your environment.",
  no_access:
    "That token can't read this project. Check the token's scope, and set VERCEL_TEAM_ID if the project belongs to a team.",
  bad_project: "That Vercel project id doesn't look right — check Project Settings → General.",
  error: "Couldn't reach the Vercel Web Analytics API. Check the token and project id.",
};

const fmtInt = (n: number) => Math.round(n).toLocaleString();
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

function RowList({ title, rows, empty }: { title: string; rows: VercelRow[]; empty: string }) {
  const max = Math.max(1, ...rows.map((r) => r.pageviews));
  return (
    <div>
      <div className="adm-feed-time" style={{ marginBottom: 8 }}>{title}</div>
      {rows.length === 0 ? (
        <div style={{ color: "var(--text-faint)", fontSize: 13 }}>{empty}</div>
      ) : (
        <div style={{ display: "grid", gap: 6 }}>
          {rows.map((r) => (
            <div key={r.label} style={{ display: "grid", gridTemplateColumns: "1fr auto", gap: 10, alignItems: "center" }}>
              <div style={{ position: "relative", minWidth: 0 }}>
                <div
                  aria-hidden="true"
                  style={{
                    position: "absolute", inset: 0, width: `${(r.pageviews / max) * 100}%`,
                    background: "rgba(37,99,235,0.16)", borderRadius: 5,
                  }}
                />
                <div
                  style={{
                    position: "relative", padding: "4px 8px", fontSize: 12.5,
                    whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis",
                  }}
                  title={r.label}
                >
                  {r.label}
                </div>
              </div>
              <span style={{ fontSize: 12.5, color: "var(--text-dim)", fontVariantNumeric: "tabular-nums" }}>
                {fmtInt(r.pageviews)}
              </span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export function VercelTraffic() {
  const [data, setData] = useState<VercelAnalyticsResult | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let active = true;
    api
      .vercelAnalytics()
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
        <Spinner /> Loading Vercel analytics…
      </div>
    );
  }

  if (error || !data || !data.configured) {
    const reason = !error && data && !data.configured ? data.reason : "error";
    return (
      <div className="adm-card" style={{ marginBottom: 16 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 6 }}>
          <span style={{ color: "#2563EB" }}><AdminIcons.trending style={{ width: 18, height: 18 }} /></span>
          <div className="adm-card-title" style={{ marginBottom: 0 }}>Site Traffic — Vercel Web Analytics</div>
        </div>
        <div style={{ fontSize: 13, color: "var(--text-dim)", lineHeight: 1.6 }}>
          {error || NOT_CONFIGURED_HINT[reason] || NOT_CONFIGURED_HINT.error}
        </div>
      </div>
    );
  }

  const { totals, series, topRoutes, referrers, range } = data;
  const labels = series.map((p) => fmtDate(p.date));

  return (
    <div className="adm-card" style={{ marginBottom: 16 }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", marginBottom: 12, flexWrap: "wrap", gap: 6 }}>
        <div className="adm-card-title" style={{ marginBottom: 0 }}>Site Traffic — Vercel Web Analytics</div>
        {range.start && <span className="adm-feed-time">{fmtDate(range.start)} – {fmtDate(range.end)}</span>}
      </div>

      <div style={{ display: "flex", gap: 16, flexWrap: "wrap", marginBottom: 16 }}>
        <Stat label="Page Views" value={fmtInt(totals.pageviews)} color="#2563EB" />
        <Stat label="Visitors" value={fmtInt(totals.visitors)} color="#22D3EE" />
      </div>

      <div style={{ height: 210, marginBottom: 16 }}>
        {series.length ? (
          <TrafficChart
            labels={labels}
            series={[
              { label: "Page views", data: series.map((p) => p.pageviews), color: "#2563EB", fillColor: "rgba(37,99,235,0.10)" },
              { label: "Visitors", data: series.map((p) => p.visitors), color: "#22D3EE" },
            ]}
          />
        ) : (
          <div style={{ height: "100%", display: "grid", placeItems: "center", color: "var(--text-faint)", fontSize: 13 }}>
            No traffic in this range yet.
          </div>
        )}
      </div>

      <div className="adm-grid-2" style={{ gap: 16 }}>
        <RowList title="TOP ROUTES" rows={topRoutes} empty="No route data yet." />
        <RowList title="REFERRERS" rows={referrers} empty="No referrer data yet." />
      </div>
    </div>
  );
}
