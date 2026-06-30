"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useTheme } from "@/components/ui/ThemeProvider";
import { AdminIcons } from "./icons";
import { labelForPath } from "./nav";
import { api, authApi, type AdminUserPublic } from "@/lib/api";
import { toast } from "./cms/Toast";

export function TopBar({ setMobileOpen }: { setMobileOpen: (v: boolean | ((o: boolean) => boolean)) => void }) {
  const pathname = usePathname();
  const router = useRouter();
  const { theme, toggleTheme } = useTheme();
  const [menu, setMenu] = useState(false);
  const [account, setAccount] = useState<AdminUserPublic | null>(null);
  const [newCount, setNewCount] = useState(0);
  const label = labelForPath(pathname);

  useEffect(() => {
    if (!menu) return;
    const close = () => setMenu(false);
    window.addEventListener("click", close);
    return () => window.removeEventListener("click", close);
  }, [menu]);

  // Real account + unread-message count, refreshed when the route changes.
  useEffect(() => {
    let active = true;
    authApi.me().then(({ user }) => active && setAccount(user)).catch(() => {});
    api.messages.list()
      .then((msgs) => active && setNewCount(msgs.filter((m) => m.status === "new").length))
      .catch(() => {});
    return () => {
      active = false;
    };
  }, [pathname]);

  const accountName = account?.name || "Muhammed Ijlan";
  const accountEmail = account?.email || "ijlan.dev@gmail.com";

  const onLogout = async () => {
    try {
      await authApi.logout();
    } catch {
      toast("Couldn't reach the server, signing out anyway", "info");
    }
    router.replace("/admin/login");
  };

  return (
    <header className="adm-header">
      <button
        className="adm-icon-btn adm-mob-menu-btn"
        onClick={() => setMobileOpen((o) => !o)}
        aria-label="Open menu"
      >
        <AdminIcons.menu style={{ width: 18, height: 18 }} />
      </button>
      <div>
        <div className="adm-header-title">{label}</div>
        <div className="adm-header-breadcrumb">Portfolio CMS / {label}</div>
      </div>
      <div style={{ marginLeft: "auto", display: "flex", gap: 8, alignItems: "center" }}>
        <Link href="/" target="_blank" rel="noreferrer" className="adm-btn" style={{ height: 36 }}>
          <AdminIcons.external style={{ width: 13, height: 13 }} /> View Site
        </Link>
        <Link
          href="/admin/messages"
          className="adm-icon-btn"
          aria-label={newCount > 0 ? `${newCount} new messages` : "Messages"}
          title={newCount > 0 ? `${newCount} new message${newCount > 1 ? "s" : ""}` : "No new messages"}
        >
          <AdminIcons.bell style={{ width: 17, height: 17 }} />
          {newCount > 0 && <span className="adm-badge-dot" />}
        </Link>
        <button className="adm-icon-btn" onClick={toggleTheme} aria-label="Toggle theme">
          {theme === "dark" ? <AdminIcons.sun style={{ width: 17, height: 17 }} /> : <AdminIcons.moon style={{ width: 17, height: 17 }} />}
        </button>
        <div style={{ position: "relative" }}>
          <button
            className="adm-avatar"
            title="Account"
            onClick={(e) => {
              e.stopPropagation();
              setMenu((m) => !m);
            }}
            style={{ border: "none", padding: 0 }}
          >
            MI
          </button>
          {menu && (
            <div className="adm-menu" onClick={(e) => e.stopPropagation()}>
              <div className="adm-menu-head">
                <div className="adm-avatar" style={{ width: 38, height: 38, fontSize: 13 }}>
                  MI
                </div>
                <div style={{ minWidth: 0 }}>
                  <div style={{ fontWeight: 700, fontSize: 13.5, whiteSpace: "nowrap" }}>{accountName}</div>
                  <div
                    style={{
                      fontSize: 11.5,
                      color: "var(--text-faint)",
                      fontFamily: "var(--font-jetbrains-mono)",
                      whiteSpace: "nowrap",
                      overflow: "hidden",
                      textOverflow: "ellipsis",
                    }}
                  >
                    {accountEmail}
                  </div>
                </div>
              </div>
              <Link href="/admin/profile" className="adm-menu-item" onClick={() => setMenu(false)}>
                <AdminIcons.user style={{ width: 16, height: 16 }} />
                <span>Admin Profile</span>
              </Link>
              <Link href="/admin/settings" className="adm-menu-item" onClick={() => setMenu(false)}>
                <AdminIcons.settings style={{ width: 16, height: 16 }} />
                <span>Site Settings</span>
              </Link>
              <div className="adm-menu-sep" />
              <button className="adm-menu-item danger" onClick={onLogout}>
                <AdminIcons.logOut style={{ width: 16, height: 16 }} />
                <span>Sign out</span>
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
