"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { ThemeProvider } from "@/components/ui/ThemeProvider";
import { authApi } from "@/lib/api";
import { Sidebar } from "./Sidebar";
import { TopBar } from "./TopBar";
import { ToastHost } from "./cms/Toast";

export function AdminShell({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const [ready, setReady] = useState(false);
  const [collapsed, setCollapsed] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    let active = true;
    authApi
      .me()
      .then(() => {
        if (!active) return;
        setCollapsed(localStorage.getItem("adm-collapsed") === "1");
        setReady(true);
      })
      .catch(() => active && router.replace("/admin/login"));
    return () => {
      active = false;
    };
  }, [router]);

  useEffect(() => {
    if (!ready) return;
    localStorage.setItem("adm-collapsed", collapsed ? "1" : "0");
  }, [collapsed, ready]);

  if (!ready)
    return (
      <div
        style={{
          minHeight: "100vh",
          display: "grid",
          placeItems: "center",
          background: "var(--bg)",
        }}
      >
        <span
          aria-label="Loading"
          style={{
            width: 30,
            height: 30,
            border: "3px solid var(--border-strong)",
            borderTopColor: "var(--cyan)",
            borderRadius: "50%",
            display: "inline-block",
            animation: "loSpin .7s linear infinite",
          }}
        />
      </div>
    );

  return (
    <ThemeProvider>
      <div className="adm-root">
        <div className="adm-shell">
          <Sidebar
            collapsed={collapsed}
            setCollapsed={setCollapsed}
            mobileOpen={mobileOpen}
            setMobileOpen={setMobileOpen}
          />
          <div className="adm-main">
            <TopBar setMobileOpen={setMobileOpen} />
            <div className="adm-content">
              {children}
              <div style={{ height: 32 }} />
            </div>
          </div>
        </div>
        <ToastHost />
      </div>
    </ThemeProvider>
  );
}
