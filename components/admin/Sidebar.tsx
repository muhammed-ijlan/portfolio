"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { AdminIcons } from "./icons";
import { NAV, hrefForId } from "./nav";

export function Sidebar({
  collapsed,
  setCollapsed,
  mobileOpen,
  setMobileOpen,
}: {
  collapsed: boolean;
  setCollapsed: (v: boolean | ((c: boolean) => boolean)) => void;
  mobileOpen: boolean;
  setMobileOpen: (v: boolean) => void;
}) {
  const pathname = usePathname();
  const activeId = pathname === "/admin" ? "dashboard" : pathname.split("/")[2];

  return (
    <>
      <div
        className={`adm-sidebar-overlay${mobileOpen ? " show" : ""}`}
        onClick={() => setMobileOpen(false)}
      />
      <aside className={`adm-sidebar${collapsed ? " collapsed" : ""}${mobileOpen ? " open" : ""}`}>
        <div className="adm-brand">
          <div className="adm-brand-icon">MI</div>
          <span className="adm-brand-name">
            Portfolio<span className="grad-text"> CMS</span>
          </span>
        </div>

        <nav className="adm-nav" aria-label="Sidebar navigation">
          {NAV.map((sec) => (
            <div key={sec.section}>
              <div className="adm-nav-section">
                <span className="adm-nav-section-label">{sec.section}</span>
              </div>
              {sec.items.map((item) => {
                const Icon = AdminIcons[item.icon];
                const active = activeId === item.id;
                return (
                  <Link
                    key={item.id}
                    href={hrefForId(item.id)}
                    className={`adm-nav-item${active ? " active" : ""}`}
                    onClick={() => setMobileOpen(false)}
                    aria-current={active ? "page" : undefined}
                  >
                    <Icon className="adm-nav-icon" />
                    <span className="adm-nav-label">{item.label}</span>
                    {item.badge && <span className="adm-nav-badge">{item.badge}</span>}
                  </Link>
                );
              })}
            </div>
          ))}
        </nav>

        <div className="adm-sidebar-foot">
          <button className="adm-collapse-btn" onClick={() => setCollapsed((c) => !c)} aria-label="Toggle sidebar">
            {collapsed ? (
              <AdminIcons.chevR style={{ width: 16, height: 16, flexShrink: 0 }} />
            ) : (
              <AdminIcons.chevL style={{ width: 16, height: 16, flexShrink: 0 }} />
            )}
            <span>Collapse</span>
          </button>
        </div>
      </aside>
    </>
  );
}
