"use client";

import Link from "next/link";
import { AdminIcons } from "../icons";
import { PageHead } from "../PageHead";
import { StatCard } from "../StatCard";
import { TrafficChart } from "../charts/TrafficChart";
import { ProjectViewsChart } from "../charts/ProjectViewsChart";
import { TrafficSourcesChart } from "../charts/TrafficSourcesChart";
import { PageLoading, PageError } from "../cms/Loading";
import { EmptyState } from "../cms/Fields";
import { initials, avatarColor, relTime, messageSeries } from "@/lib/cms-store";
import { api } from "@/lib/api";
import { useCollection } from "@/lib/use-cms";

export function DashboardPage() {
  const { items: projects, loading: lp, error: ep } = useCollection(api.projects);
  const { items: messages, loading: lm, error: em } = useCollection(api.messages);

  if (lp || lm) return <PageLoading />;
  if (ep || em) return <PageError error={ep || em || "Failed to load dashboard"} />;

  // Real 30-day series built from actual message timestamps.
  const { labels, received, avg } = messageSeries(messages.map((m) => m.date));

  const newMsgs = messages.filter((m) => m.status === "new").length;
  const replied = messages.filter((m) => m.status === "replied").length;
  const responseRate = messages.length ? Math.round((replied / messages.length) * 100) : 0;
  const published = projects.filter((p) => p.status === "published").length;
  const featured = projects.filter((p) => p.featured).length;
  const draft = projects.length - published;

  // Message status breakdown (real).
  const statusCounts = {
    new: newMsgs,
    read: messages.filter((m) => m.status === "read").length,
    replied,
  };

  // Most-used technologies across all projects (real, derived from tags).
  const tagCounts = new Map<string, number>();
  for (const p of projects) for (const t of p.tags) tagCounts.set(t, (tagCounts.get(t) || 0) + 1);
  const topTags = [...tagCounts.entries()].sort((a, b) => b[1] - a[1]).slice(0, 6);

  // Featured first, then published, then the rest — no fabricated view counts.
  const rank = (s: string) => (s === "published" ? 0 : 1);
  const topProjects = [...projects]
    .sort((a, b) => Number(b.featured) - Number(a.featured) || rank(a.status) - rank(b.status))
    .slice(0, 4);

  return (
    <>
      <PageHead title="Dashboard" sub="Welcome back, Muhammed. Here's how your portfolio is performing.">
        <Link href="/admin/messages" className="adm-btn">
          <AdminIcons.mail style={{ width: 14, height: 14 }} /> View Messages
        </Link>
        <Link href="/admin/projects" className="adm-btn adm-btn-primary">
          <AdminIcons.plus style={{ width: 14, height: 14 }} /> New Project
        </Link>
      </PageHead>

      <div className="adm-stat-grid">
        <StatCard title="New Messages" value={newMsgs} delta={`${messages.length} total received`} type="neu" icon={<span style={{ color: "#7C3AED" }}><AdminIcons.mail style={{ width: 18, height: 18 }} /></span>} accent="rgba(124,58,237,0.12)" />
        <StatCard title="Published Projects" value={published} delta={draft ? `${draft} in draft` : "all live"} type="neu" icon={<span style={{ color: "#34d399" }}><AdminIcons.briefcase style={{ width: 18, height: 18 }} /></span>} accent="rgba(52,211,153,0.12)" />
        <StatCard title="Featured" value={featured} delta="shown on homepage" type="neu" icon={<span style={{ color: "#22D3EE" }}><AdminIcons.star style={{ width: 18, height: 18 }} /></span>} accent="rgba(34,211,238,0.12)" />
        <StatCard title="Response Rate" value={`${responseRate}%`} delta={`${replied} replied`} type={responseRate >= 50 ? "up" : "neu"} icon={<span style={{ color: "#fbbf24" }}><AdminIcons.reply style={{ width: 18, height: 18 }} /></span>} accent="rgba(251,191,36,0.12)" />
      </div>

      <div className="adm-card" style={{ marginBottom: 16 }}>
        <div className="adm-card-title">Messages — last 30 days</div>
        <div style={{ height: 220 }}>
          <TrafficChart
            labels={labels}
            series={[
              { label: "Received", data: received, color: "#22D3EE", fillColor: "rgba(34,211,238,0.09)" },
              { label: "7-day avg", data: avg, color: "#7C3AED" },
            ]}
          />
        </div>
      </div>

      <div className="adm-grid-2" style={{ marginBottom: 16 }}>
        <div className="adm-card">
          <div className="adm-card-title">Top Technologies</div>
          <div style={{ height: 200 }}>
            {topTags.length ? (
              <ProjectViewsChart label="Projects" labels={topTags.map(([t]) => t)} values={topTags.map(([, n]) => n)} />
            ) : (
              <div style={{ height: "100%", display: "grid", placeItems: "center", color: "var(--text-faint)", fontSize: 13 }}>Add projects to see your stack</div>
            )}
          </div>
        </div>
        <div className="adm-card">
          <div className="adm-card-title">Messages by Status</div>
          <div style={{ height: 200 }}>
            {messages.length ? (
              <TrafficSourcesChart
                labels={["New", "Read", "Replied"]}
                values={[statusCounts.new, statusCounts.read, statusCounts.replied]}
                colors={["#7C3AED", "#22D3EE", "#34d399"]}
              />
            ) : (
              <div style={{ height: "100%", display: "grid", placeItems: "center", color: "var(--text-faint)", fontSize: 13 }}>No messages yet</div>
            )}
          </div>
        </div>
      </div>

      <div className="adm-grid-2">
        <div className="adm-card">
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 6 }}>
            <div className="adm-card-title" style={{ marginBottom: 0 }}>Recent Messages</div>
            <Link href="/admin/messages" className="adm-btn" style={{ fontSize: 12, padding: "4px 10px" }}>View all</Link>
          </div>
          {messages.length ? (
            <div className="adm-feed">
              {[...messages]
                .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
                .slice(0, 5)
                .map((m) => (
                  <Link key={m.id} href="/admin/messages" className="adm-feed-item" style={{ cursor: "pointer", textDecoration: "none", color: "inherit" }}>
                    <div className="cms-msg-avatar" style={{ width: 32, height: 32, fontSize: 12, background: avatarColor(m.name) }}>{initials(m.name)}</div>
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <div className="adm-feed-text"><strong>{m.name}</strong> — {m.subject}</div>
                      <div className="adm-feed-time">{relTime(m.date)}</div>
                    </div>
                    {m.status === "new" && <span className="cms-msg-unreaddot" />}
                  </Link>
                ))}
            </div>
          ) : (
            <EmptyState icon={<AdminIcons.mail style={{ width: 22, height: 22 }} />} title="No messages yet" sub="Contact form submissions will appear here." />
          )}
        </div>
        <div className="adm-card">
          <div className="adm-card-title" style={{ marginBottom: 8 }}>Top Projects</div>
          {topProjects.length ? (
            topProjects.map((p, i) => (
              <div key={p.id} style={{ display: "flex", alignItems: "center", gap: 12, padding: "10px 0", borderBottom: i < topProjects.length - 1 ? "1px solid var(--border)" : "none" }}>
                <span style={{ fontFamily: "var(--font-space-grotesk)", fontWeight: 700, color: "var(--text-faint)", fontSize: 14, width: 18 }}>{i + 1}</span>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ fontWeight: 600, fontSize: 13.5, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{p.title}</div>
                  <div className="adm-feed-time">{p.kind}</div>
                </div>
                <span className={`adm-badge ${p.status === "published" ? "badge-green" : "badge-gray"}`}>
                  <span className="badge-dot" />{p.featured ? "featured" : p.status}
                </span>
              </div>
            ))
          ) : (
            <EmptyState icon={<AdminIcons.briefcase style={{ width: 22, height: 22 }} />} title="No projects yet" sub="Create your first project to get started." />
          )}
        </div>
      </div>
    </>
  );
}
