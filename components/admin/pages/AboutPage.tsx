"use client";

import { useEffect, useState } from "react";
import { AdminIcons } from "../icons";
import { PageHead } from "../PageHead";
import { Field, TextInput, TextArea, TagInput } from "../cms/Fields";
import { toast } from "../cms/Toast";
import { useStore, type About } from "@/lib/cms-store";

export function AboutPage() {
  const [about, setAbout] = useStore("about");
  const [draft, setDraft] = useState<About>(about);

  // Re-sync when the persisted value changes (e.g. localStorage hydration / after save).
  useEffect(() => {
    setDraft(about);
  }, [about]);

  const set = <K extends keyof About>(k: K, v: About[K]) => setDraft((d) => ({ ...d, [k]: v }));
  const setStat = (i: number, k: "value" | "label" | "sub", v: string) =>
    setDraft((d) => ({ ...d, stats: d.stats.map((s, j) => (j === i ? { ...s, [k]: v } : s)) }));
  const setSocial = (k: keyof About["socials"], v: string) => setDraft((d) => ({ ...d, socials: { ...d.socials, [k]: v } }));
  const dirty = JSON.stringify(draft) !== JSON.stringify(about);
  const save = () => {
    setAbout(draft);
    toast("About section saved");
  };

  const cardTitle = { textTransform: "none" as const, letterSpacing: 0, fontSize: 13, fontWeight: 700, color: "var(--text)", marginBottom: 14 };

  return (
    <>
      <PageHead title="About / Bio" sub="Edit your homepage intro, bio and stats">
        <button className="adm-btn" onClick={() => setDraft(about)} disabled={!dirty} style={{ opacity: dirty ? 1 : 0.5 }}>Reset</button>
        <button className="adm-btn adm-btn-primary" onClick={save} disabled={!dirty} style={{ opacity: dirty ? 1 : 0.6 }}>
          <AdminIcons.save style={{ width: 14, height: 14 }} /> Save Changes
        </button>
      </PageHead>
      <div className="adm-grid-2">
        <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
          <div className="adm-card">
            <div className="adm-card-title" style={cardTitle}>Identity</div>
            <div className="cms-form-grid">
              <Field label="Name"><TextInput value={draft.name} onChange={(v) => set("name", v)} /></Field>
              <Field label="Role label"><TextInput value={draft.role} onChange={(v) => set("role", v)} /></Field>
              <Field label="Location"><TextInput value={draft.location} onChange={(v) => set("location", v)} /></Field>
              <Field label="Email"><TextInput value={draft.email} onChange={(v) => set("email", v)} /></Field>
              <Field label="Phone" full><TextInput value={draft.phone} onChange={(v) => set("phone", v)} /></Field>
              <Field label="Headline" full hint="Big statement on the About section"><TextInput value={draft.headline} onChange={(v) => set("headline", v)} /></Field>
              <Field label="Bio" full><TextArea rows={6} value={draft.bio} onChange={(v) => set("bio", v)} /></Field>
              <Field label="Highlight chips" full hint="Press Enter to add"><TagInput value={draft.chips} onChange={(v) => set("chips", v)} /></Field>
            </div>
          </div>
        </div>
        <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
          <div className="adm-card">
            <div className="adm-card-title" style={cardTitle}>Stats</div>
            <div style={{ display: "grid", gap: 12 }}>
              {draft.stats.map((s, i) => (
                <div key={i} style={{ display: "grid", gridTemplateColumns: "80px 1fr", gap: 10, alignItems: "center" }}>
                  <input className="cms-input" style={{ textAlign: "center", fontFamily: "var(--font-space-grotesk)", fontWeight: 700, fontSize: 18 }} value={s.value} onChange={(e) => setStat(i, "value", e.target.value)} />
                  <div style={{ display: "grid", gap: 6 }}>
                    <input className="cms-input" value={s.label} onChange={(e) => setStat(i, "label", e.target.value)} placeholder="Label" />
                    <input className="cms-input" style={{ fontSize: 12 }} value={s.sub} onChange={(e) => setStat(i, "sub", e.target.value)} placeholder="Sublabel" />
                  </div>
                </div>
              ))}
            </div>
          </div>
          <div className="adm-card">
            <div className="adm-card-title" style={cardTitle}>Social Links</div>
            <div style={{ display: "grid", gap: 12 }}>
              <Field label="GitHub"><TextInput value={draft.socials.github} onChange={(v) => setSocial("github", v)} /></Field>
              <Field label="LinkedIn"><TextInput value={draft.socials.linkedin} onChange={(v) => setSocial("linkedin", v)} /></Field>
              <Field label="Email"><TextInput value={draft.socials.email} onChange={(v) => setSocial("email", v)} /></Field>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
