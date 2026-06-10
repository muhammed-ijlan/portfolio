"use client";

import Link from "next/link";
import { AdminIcons } from "../icons";
import { PageHead } from "../PageHead";
import { StatCard } from "../StatCard";
import { TrafficChart } from "../charts/TrafficChart";
import { ProjectViewsChart } from "../charts/ProjectViewsChart";
import { TrafficSourcesChart } from "../charts/TrafficSourcesChart";
import { useStore, initials, avatarColor, relTime, trafficSeries } from "@/lib/cms-store";

export function DashboardPage() {
  const [projects] = useStore("projects");
  const [messages] = useStore("messages");
  const { days, views, visitors } = trafficSeries();

  const newMsgs = messages.filter((m) => m.status === "new").length;
  const published = projects.filter((p) => p.status === "published").length;
  const totalViews = projects.reduce((a, p) => a + (p.views || 0), 0);
  const topProjects = [...projects].sort((a, b) => (b.views || 0) - (a.views || 0)).slice(0, 4);

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
        <StatCard title="Page Views (30d)" value={totalViews.toLocaleString()} delta="↑ 12.4% vs last month" type="up" icon={<span style={{ color: "#22D3EE" }}><AdminIcons.eye style={{ width: 18, height: 18 }} /></span>} accent="rgba(34,211,238,0.12)" />
        <StatCard title="New Messages" value={newMsgs} delta={`${messages.length} total`} type="neu" icon={<span style={{ color: "#7C3AED" }}><AdminIcons.mail style={{ width: 18, height: 18 }} /></span>} accent="rgba(124,58,237,0.12)" />
        <StatCard title="Published Projects" value={published} delta={`${projects.length - published} draft`} type="neu" icon={<span style={{ color: "#34d399" }}><AdminIcons.briefcase style={{ width: 18, height: 18 }} /></span>} accent="rgba(52,211,153,0.12)" />
        <StatCard title="Avg. Engagement" value="3m 42s" delta="↑ 0.8% this week" type="up" icon={<span style={{ color: "#fbbf24" }}><AdminIcons.trending style={{ width: 18, height: 18 }} /></span>} accent="rgba(251,191,36,0.12)" />
      </div>

      <div className="adm-card" style={{ marginBottom: 16 }}>
        <div className="adm-card-title">Traffic — last 30 days</div>
        <div style={{ height: 220 }}>
          <TrafficChart days={days} views={views} visitors={visitors} />
        </div>
      </div>

      <div className="adm-grid-2" style={{ marginBottom: 16 }}>
        <div className="adm-card">
          <div className="adm-card-title">Project Views</div>
          <div style={{ height: 200 }}>
            <ProjectViewsChart labels={projects.map((p) => p.title.split(" ")[0])} values={projects.map((p) => p.views || 0)} />
          </div>
        </div>
        <div className="adm-card">
          <div className="adm-card-title">Traffic Sources</div>
          <div style={{ height: 200 }}>
            <TrafficSourcesChart />
          </div>
        </div>
      </div>

      <div className="adm-grid-2">
        <div className="adm-card">
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 6 }}>
            <div className="adm-card-title" style={{ marginBottom: 0 }}>Recent Messages</div>
            <Link href="/admin/messages" className="adm-btn" style={{ fontSize: 12, padding: "4px 10px" }}>View all</Link>
          </div>
          <div className="adm-feed">
            {messages.slice(0, 5).map((m) => (
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
        </div>
        <div className="adm-card">
          <div className="adm-card-title" style={{ marginBottom: 8 }}>Top Projects</div>
          {topProjects.map((p, i) => (
            <div key={p.id} style={{ display: "flex", alignItems: "center", gap: 12, padding: "10px 0", borderBottom: i < topProjects.length - 1 ? "1px solid var(--border)" : "none" }}>
              <span style={{ fontFamily: "var(--font-space-grotesk)", fontWeight: 700, color: "var(--text-faint)", fontSize: 14, width: 18 }}>{i + 1}</span>
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ fontWeight: 600, fontSize: 13.5, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{p.title}</div>
                <div className="adm-feed-time">{p.kind}</div>
              </div>
              <span style={{ fontFamily: "var(--font-jetbrains-mono)", fontSize: 12.5, fontWeight: 600, color: "var(--cyan)" }}>{(p.views || 0).toLocaleString()}</span>
            </div>
          ))}
        </div>
      </div>
    </>
  );
}
