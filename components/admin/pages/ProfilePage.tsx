"use client";

import { PageHead } from "../PageHead";
import { PageLoading, PageError } from "../cms/Loading";
import { api } from "@/lib/api";
import { useSingleton } from "@/lib/use-cms";

export function ProfilePage() {
  const { data: about, loading, error } = useSingleton(api.about);

  if (loading || !about) return <PageLoading />;
  if (error) return <PageError error={error} />;

  const cardTitle = { textTransform: "none" as const, letterSpacing: 0, fontSize: 13, fontWeight: 700, color: "var(--text)", marginBottom: 12 };
  const kv: [string, string][] = [
    ["Email", about.email],
    ["Phone", about.phone],
    ["Role", "Owner / Super Admin"],
    ["Location", about.location],
  ];
  const security = [
    { l: "Change password", s: "Last changed 30 days ago", btn: "Update" },
    { l: "Two-Factor Auth", s: "TOTP enabled", btn: "Manage" },
    { l: "Active sessions", s: "2 devices", btn: "Review" },
  ];

  return (
    <>
      <PageHead title="Admin Profile" sub="Your account & security" />
      <div className="adm-grid-2">
        <div className="adm-card">
          <div style={{ display: "flex", alignItems: "center", gap: 14, marginBottom: 18, paddingBottom: 16, borderBottom: "1px solid var(--border)" }}>
            <div style={{ width: 60, height: 60, borderRadius: "50%", background: "var(--accent-grad)", display: "grid", placeItems: "center", fontFamily: "var(--font-space-grotesk)", fontWeight: 700, fontSize: 20, color: "#04060a" }}>MI</div>
            <div>
              <div style={{ fontFamily: "var(--font-space-grotesk)", fontWeight: 700, fontSize: 16 }}>{about.name}</div>
              <div style={{ color: "var(--text-dim)", fontSize: 13 }}>Owner · {about.location}</div>
              <span className="adm-badge badge-green" style={{ marginTop: 4 }}><span className="badge-dot" />active</span>
            </div>
          </div>
          <div className="cms-kv">
            {kv.map(([k, v]) => (
              <div key={k} className="cms-kv-row">
                <span className="cms-kv-k">{k}</span>
                <span className="cms-kv-v" style={{ fontFamily: k === "Email" || k === "Phone" ? "var(--font-jetbrains-mono)" : "inherit" }}>{v}</span>
              </div>
            ))}
          </div>
        </div>
        <div className="adm-card">
          <div className="adm-card-title" style={cardTitle}>Security</div>
          {security.map((row) => (
            <div key={row.l} className="adm-setting-row">
              <div>
                <div className="adm-setting-label">{row.l}</div>
                <div className="adm-setting-sub">{row.s}</div>
              </div>
              <button className="adm-btn" style={{ fontSize: 12, padding: "5px 12px" }}>{row.btn}</button>
            </div>
          ))}
        </div>
      </div>
    </>
  );
}
