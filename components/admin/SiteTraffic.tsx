"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { AdminIcons } from "./icons";
import { TrafficChart } from "./charts/TrafficChart";
import { TrafficSourcesChart } from "./charts/TrafficSourcesChart";
import { Spinner } from "./cms/Loading";
import { api } from "@/lib/api";
import type { GA4Result } from "@/lib/ga4";

const NOT_CONFIGURED_HINT: Record<string, string> = {
  no_property: "Add your GA4 numeric property id in Site Settings.",
  no_credentials: "Add a Google service-account key (GOOGLE_SERVICE_ACCOUNT_KEY) to your environment.",
  no_access: "Add the service-account email as a Viewer on the GA4 property (Admin → Property Access Management).",
  bad_property: "That GA4 property id doesn't look right — check Admin → Property Settings.",
  error: "Couldn't reach the GA4 Data API. Check the property id and service-account key.",
};

const CHANNEL_COLORS = ["#22D3EE", "#7C3AED", "#3b82f6", "#34d399", "#f59e0b", "#ec4899"];

const fmtInt = (n: number) => Math.round(n).toLocaleString();
const fmtPct = (n: number) => `${(n * 100).toFixed(1)}%`;
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

export function SiteTraffic() {
  const [data, setData] = useState<GA4Result | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let active = true;
    api
      .ga4()
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
        <Spinner /> Loading site traffic…
      </div>
    );
  }

  if (error || !data || !data.configured) {
    const reason = !error && data && !data.configured ? data.reason : "error";
    return (
      <div className="adm-card" style={{ marginBottom: 16 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 6 }}>
          <span style={{ color: "#7C3AED" }}><AdminIcons.trending style={{ width: 18, height: 18 }} /></span>
          <div className="adm-card-title" style={{ marginBottom: 0 }}>Site Traffic — Google Analytics</div>
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

  const { totals, series, channels, range } = data;
  const labels = series.map((p) => fmtDate(p.date));

  return (
    <div className="adm-card" style={{ marginBottom: 16 }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", marginBottom: 12, flexWrap: "wrap", gap: 6 }}>
        <div className="adm-card-title" style={{ marginBottom: 0 }}>Site Traffic — Google Analytics</div>
        {range.start && <span className="adm-feed-time">{fmtDate(range.start)} – {fmtDate(range.end)}</span>}
      </div>
      <div style={{ display: "flex", gap: 16, flexWrap: "wrap", marginBottom: 16 }}>
        <Stat label="Active Users" value={fmtInt(totals.activeUsers)} color="#22D3EE" />
        <Stat label="Sessions" value={fmtInt(totals.sessions)} color="#7C3AED" />
        <Stat label="Page Views" value={fmtInt(totals.pageViews)} color="#34d399" />
        <Stat label="Engagement" value={fmtPct(totals.engagementRate)} color="#fbbf24" />
      </div>
      <div className="adm-grid-2">
        <div style={{ height: 210 }}>
          {series.length ? (
            <TrafficChart
              labels={labels}
              series={[
                { label: "Active users", data: series.map((p) => p.activeUsers), color: "#22D3EE", fillColor: "rgba(34,211,238,0.10)" },
                { label: "Sessions", data: series.map((p) => p.sessions), color: "#7C3AED" },
              ]}
            />
          ) : (
            <div style={{ height: "100%", display: "grid", placeItems: "center", color: "var(--text-faint)", fontSize: 13 }}>No traffic in this range yet.</div>
          )}
        </div>
        <div style={{ height: 210 }}>
          {channels.length ? (
            <TrafficSourcesChart
              labels={channels.map((c) => c.channel)}
              values={channels.map((c) => c.sessions)}
              colors={CHANNEL_COLORS}
            />
          ) : (
            <div style={{ height: "100%", display: "grid", placeItems: "center", color: "var(--text-faint)", fontSize: 13 }}>No channel data yet.</div>
          )}
        </div>
      </div>
    </div>
  );
}
