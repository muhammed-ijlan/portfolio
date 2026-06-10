"use client";

import { useState } from "react";
import { AdminIcons } from "../icons";
import { PageHead } from "../PageHead";
import { Field, TextInput, TextArea, SelectInput, Toggle } from "../cms/Fields";
import { toast } from "../cms/Toast";
import { PageLoading, PageError, Spinner } from "../cms/Loading";
import { type Settings } from "@/lib/cms-store";
import { api } from "@/lib/api";
import { useSingleton } from "@/lib/use-cms";

export function SettingsPage() {
  const { data: settings, loading, error, save: persist } = useSingleton(api.settings);
  const [draft, setDraft] = useState<Settings | null>(null);
  const [saving, setSaving] = useState(false);

  // Mirror the persisted document into a local draft for editing, re-syncing
  // whenever the source changes (initial load + after a successful save). Synced
  // during render — React's recommended alternative to a sync effect.
  const [synced, setSynced] = useState<Settings | null>(null);
  if (settings && settings !== synced) {
    setSynced(settings);
    setDraft(settings);
  }

  const set = <K extends keyof Settings>(k: K, v: Settings[K]) => setDraft((d) => (d ? { ...d, [k]: v } : d));
  const setTog = (k: keyof Settings["toggles"]) =>
    setDraft((d) => (d ? { ...d, toggles: { ...d.toggles, [k]: !d.toggles[k] } } : d));
  const dirty = !!settings && !!draft && JSON.stringify(draft) !== JSON.stringify(settings);
  const accents = ["#22D3EE", "#7C3AED", "#34d399", "#f59e0b", "#ec4899"];

  const onSave = async () => {
    if (!draft) return;
    setSaving(true);
    try {
      await persist(draft);
      toast("Settings saved");
    } catch (e) {
      toast(e instanceof Error ? e.message : "Failed to save", "error");
    } finally {
      setSaving(false);
    }
  };

  if (loading || !draft) return <PageLoading />;
  if (error) return <PageError error={error} />;

  const cardTitle = { textTransform: "none" as const, letterSpacing: 0, fontSize: 13, fontWeight: 700, color: "var(--text)" };
  const rows: { k: keyof Settings["toggles"]; l: string; s: string }[] = [
    { k: "animations", l: "Scroll animations", s: "Enable reveal & parallax motion" },
    { k: "customCursor", l: "Custom cursor", s: "Show the glowing cursor on desktop" },
    { k: "showResume", l: "Resume download", s: "Show the “Download CV” button" },
    { k: "maintenance", l: "Maintenance mode", s: "Show a maintenance page to visitors" },
  ];

  return (
    <>
      <PageHead title="Site Settings" sub="Global configuration for your portfolio">
        <button className="adm-btn adm-btn-primary" onClick={onSave} disabled={!dirty || saving} style={{ opacity: dirty && !saving ? 1 : 0.6 }}>
          {saving ? <Spinner /> : <AdminIcons.save style={{ width: 14, height: 14 }} />} {saving ? "Saving…" : "Save Changes"}
        </button>
      </PageHead>
      <div className="adm-grid-2">
        <div className="adm-card">
          <div className="adm-card-title" style={{ ...cardTitle, marginBottom: 14 }}>General &amp; SEO</div>
          <div style={{ display: "grid", gap: 14 }}>
            <Field label="Site title"><TextInput value={draft.siteTitle} onChange={(v) => set("siteTitle", v)} /></Field>
            <Field label="Tagline"><TextInput value={draft.tagline} onChange={(v) => set("tagline", v)} /></Field>
            <Field label="SEO description" hint="Shown in search results & social shares"><TextArea value={draft.seoDescription} onChange={(v) => set("seoDescription", v)} /></Field>
            <Field label="Default theme"><SelectInput value={draft.defaultTheme} onChange={(v) => set("defaultTheme", v as Settings["defaultTheme"])} options={[{ value: "dark", label: "Dark" }, { value: "light", label: "Light" }]} /></Field>
            <Field label="Accent color">
              <div style={{ display: "flex", gap: 8 }}>
                {accents.map((c) => (
                  <button key={c} onClick={() => set("accent", c)} aria-label={c} style={{ width: 34, height: 34, borderRadius: 9, background: c, border: draft.accent === c ? "2px solid var(--text)" : "2px solid transparent", cursor: "pointer", boxShadow: draft.accent === c ? `0 0 0 2px ${c}55` : "none" }} />
                ))}
              </div>
            </Field>
          </div>
        </div>
        <div className="adm-card">
          <div className="adm-card-title" style={{ ...cardTitle, marginBottom: 6 }}>Features</div>
          {rows.map((row) => (
            <div key={row.k} className="adm-setting-row">
              <div>
                <div className="adm-setting-label">{row.l}</div>
                <div className="adm-setting-sub">{row.s}</div>
              </div>
              <Toggle on={draft.toggles[row.k]} onChange={() => setTog(row.k)} />
            </div>
          ))}
          <div style={{ marginTop: 16, paddingTop: 16, borderTop: "1px solid var(--border)" }}>
            <div className="adm-setting-label" style={{ marginBottom: 4 }}>Discard changes</div>
            <div className="adm-setting-sub" style={{ marginBottom: 10 }}>Revert unsaved edits back to the saved settings.</div>
            <button className="adm-btn" style={{ color: "#f87171", borderColor: "rgba(248,113,113,0.3)" }} disabled={!dirty} onClick={() => { setDraft(settings); toast("Reverted unsaved changes", "info"); }}>
              Discard changes
            </button>
          </div>
        </div>
      </div>
    </>
  );
}
