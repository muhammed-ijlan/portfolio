"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { ThemeProvider } from "@/components/ui/ThemeProvider";
import { isAuthed } from "@/lib/admin-auth";
import { Sidebar } from "./Sidebar";
import { TopBar } from "./TopBar";
import { ToastHost } from "./cms/Toast";

export function AdminShell({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const [ready, setReady] = useState(false);
  const [collapsed, setCollapsed] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    if (!isAuthed()) {
      router.replace("/admin/login");
      return;
    }
    setCollapsed(localStorage.getItem("adm-collapsed") === "1");
    setReady(true);
  }, [router]);

  useEffect(() => {
    if (!ready) return;
    localStorage.setItem("adm-collapsed", collapsed ? "1" : "0");
  }, [collapsed, ready]);

  if (!ready) return null;

  return (
    <ThemeProvider>
      <div className="adm-root">
        <div className="adm-shell">
          <Sidebar collapsed={collapsed} setCollapsed={setCollapsed} mobileOpen={mobileOpen} setMobileOpen={setMobileOpen} />
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
