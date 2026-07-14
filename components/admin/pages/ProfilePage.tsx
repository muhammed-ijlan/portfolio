"use client";

import { useEffect, useState } from "react";
import { AdminIcons } from "../icons";
import { PageHead } from "../PageHead";
import { Modal } from "../cms/Modal";
import { Field, TextInput } from "../cms/Fields";
import { toast } from "../cms/Toast";
import { PageLoading, PageError, Spinner } from "../cms/Loading";
import { api, authApi, type AdminUserPublic } from "@/lib/api";
import { useSingleton } from "@/lib/use-cms";

function ChangePasswordModal({ open, onClose }: { open: boolean; onClose: () => void }) {
  const [current, setCurrent] = useState("");
  const [next, setNext] = useState("");
  const [confirm, setConfirm] = useState("");
  const [saving, setSaving] = useState(false);

  const reset = () => {
    setCurrent("");
    setNext("");
    setConfirm("");
  };
  const close = () => {
    reset();
    onClose();
  };

  const submit = async () => {
    if (!current || !next) return toast("Fill in both password fields", "error");
    if (next.length < 8) return toast("New password must be at least 8 characters", "error");
    if (next !== confirm) return toast("New passwords don't match", "error");
    setSaving(true);
    try {
      await authApi.changePassword(current, next);
      toast("Password updated");
      close();
    } catch (e) {
      toast(e instanceof Error ? e.message : "Failed to update password", "error");
    } finally {
      setSaving(false);
    }
  };

  return (
    <Modal
      open={open}
      onClose={close}
      title="Change password"
      sub="Use at least 8 characters."
      footer={
        <>
          <button className="adm-btn" onClick={close} disabled={saving}>Cancel</button>
          <button className="adm-btn adm-btn-primary" onClick={submit} disabled={saving}>
            {saving ? <Spinner /> : <AdminIcons.save style={{ width: 14, height: 14 }} />} {saving ? "Updating…" : "Update password"}
          </button>
        </>
      }
    >
      <div style={{ display: "grid", gap: 14 }}>
        <Field label="Current password"><TextInput type="password" value={current} onChange={setCurrent} placeholder="••••••••" /></Field>
        <Field label="New password"><TextInput type="password" value={next} onChange={setNext} placeholder="••••••••" /></Field>
        <Field label="Confirm new password"><TextInput type="password" value={confirm} onChange={setConfirm} placeholder="••••••••" /></Field>
      </div>
    </Modal>
  );
}

export function ProfilePage() {
  const { data: about, loading, error } = useSingleton(api.about);
  const [account, setAccount] = useState<AdminUserPublic | null>(null);
  const [pwOpen, setPwOpen] = useState(false);

  useEffect(() => {
    authApi.me().then(({ user }) => setAccount(user)).catch(() => {});
  }, []);

  if (loading || !about) return <PageLoading />;
  if (error) return <PageError error={error} />;

  const cardTitle = { textTransform: "none" as const, letterSpacing: 0, fontSize: 13, fontWeight: 700, color: "var(--text)", marginBottom: 12 };
  const kv: [string, string][] = [
    ["Login email", account?.email ?? about.email],
    ["Role", account?.role ?? "admin"],
    ["Contact email", about.email],
    ["Location", about.location],
  ];

  return (
    <>
      <PageHead title="Admin Profile" sub="Your account & security" />
      <div className="adm-grid-2">
        <div className="adm-card">
          <div style={{ display: "flex", alignItems: "center", gap: 14, marginBottom: 18, paddingBottom: 16, borderBottom: "1px solid var(--border)" }}>
            <div style={{ width: 60, height: 60, borderRadius: "50%", background: "var(--accent-grad)", display: "grid", placeItems: "center", fontFamily: "var(--font-space-grotesk)", fontWeight: 700, fontSize: 20, color: "#ffffff" }}>MI</div>
            <div>
              <div style={{ fontFamily: "var(--font-space-grotesk)", fontWeight: 700, fontSize: 16 }}>{account?.name ?? about.name}</div>
              <div style={{ color: "var(--text-dim)", fontSize: 13 }}>Owner · {about.location}</div>
              <span className="adm-badge badge-green" style={{ marginTop: 4 }}><span className="badge-dot" />active</span>
            </div>
          </div>
          <div className="cms-kv">
            {kv.map(([k, v]) => (
              <div key={k} className="cms-kv-row">
                <span className="cms-kv-k">{k}</span>
                <span className="cms-kv-v" style={{ fontFamily: k.includes("email") ? "var(--font-jetbrains-mono)" : "inherit" }}>{v}</span>
              </div>
            ))}
          </div>
        </div>
        <div className="adm-card">
          <div className="adm-card-title" style={cardTitle}>Security</div>
          <div className="adm-setting-row">
            <div>
              <div className="adm-setting-label">Password</div>
              <div className="adm-setting-sub">Update the password you use to sign in.</div>
            </div>
            <button className="adm-btn" style={{ fontSize: 12, padding: "5px 12px" }} onClick={() => setPwOpen(true)}>Change</button>
          </div>
          <div className="adm-setting-row">
            <div>
              <div className="adm-setting-label">Sign out</div>
              <div className="adm-setting-sub">End your session on this device.</div>
            </div>
            <button
              className="adm-btn"
              style={{ fontSize: 12, padding: "5px 12px", color: "#f87171" }}
              onClick={async () => {
                try {
                  await authApi.logout();
                  window.location.href = "/admin/login";
                } catch (e) {
                  toast(e instanceof Error ? e.message : "Failed to sign out", "error");
                }
              }}
            >
              Sign out
            </button>
          </div>
        </div>
      </div>
      <ChangePasswordModal open={pwOpen} onClose={() => setPwOpen(false)} />
    </>
  );
}
