"use client";

import { useState } from "react";
import { AdminIcons } from "../icons";
import { PageHead } from "../PageHead";
import { Field, TextInput, TextArea, TagInput, Toggle } from "../cms/Fields";
import { toast } from "../cms/Toast";
import { PageLoading, PageError, Spinner } from "../cms/Loading";
import { type About, type Hero } from "@/lib/cms-store";
import type { FocusCard } from "@/lib/seed-data";
import { api } from "@/lib/api";
import { useSingleton } from "@/lib/use-cms";

const HERO_DEFAULTS: Hero = {
  roles: ["Web Developer", "Web3 Engineer", "Full Stack Developer"],
  availability: "Available for senior roles",
  focus: ["Full Stack", "Web3"],
  stack: ["React", "Next.js", "Node"],
  experience: "4+ years",
  openToWork: true,
};

export function AboutPage() {
  const { data: about, loading, error, save: persist } = useSingleton(api.about);
  const [draft, setDraft] = useState<About | null>(null);
  const [saving, setSaving] = useState(false);

  const [synced, setSynced] = useState<About | null>(null);
  if (about && about !== synced) {
    setSynced(about);
    setDraft(about);
  }

  const set = <K extends keyof About>(k: K, v: About[K]) => setDraft((d) => (d ? { ...d, [k]: v } : d));
  const setStat = (i: number, k: "value" | "label" | "sub", v: string) =>
    setDraft((d) => (d ? { ...d, stats: d.stats.map((s, j) => (j === i ? { ...s, [k]: v } : s)) } : d));
  const setSocial = (k: keyof About["socials"], v: string) =>
    setDraft((d) => (d ? { ...d, socials: { ...d.socials, [k]: v } } : d));
  const setHero = <K extends keyof Hero>(k: K, v: Hero[K]) =>
    setDraft((d) => (d ? { ...d, hero: { ...HERO_DEFAULTS, ...d.hero, [k]: v } } : d));
  // story/focus/highlights may be missing on docs saved before these fields existed
  const focus = draft?.focus ?? [];
  const highlights = draft?.highlights ?? [];
  const setFocus = (i: number, k: keyof FocusCard, v: string) =>
    setDraft((d) => (d ? { ...d, focus: (d.focus ?? []).map((f, j) => (j === i ? { ...f, [k]: v } : f)) } : d));
  const addFocus = () => setDraft((d) => (d ? { ...d, focus: [...(d.focus ?? []), { title: "", desc: "" }] } : d));
  const removeFocus = (i: number) =>
    setDraft((d) => (d ? { ...d, focus: (d.focus ?? []).filter((_, j) => j !== i) } : d));
  const setHighlight = (i: number, v: string) =>
    setDraft((d) => (d ? { ...d, highlights: (d.highlights ?? []).map((h, j) => (j === i ? v : h)) } : d));
  const addHighlight = () => setDraft((d) => (d ? { ...d, highlights: [...(d.highlights ?? []), ""] } : d));
  const removeHighlight = (i: number) =>
    setDraft((d) => (d ? { ...d, highlights: (d.highlights ?? []).filter((_, j) => j !== i) } : d));
  const dirty = !!about && !!draft && JSON.stringify(draft) !== JSON.stringify(about);
  const save = async () => {
    if (!draft) return;
    setSaving(true);
    try {
      await persist(draft);
      toast("About section saved");
    } catch (e) {
      toast(e instanceof Error ? e.message : "Failed to save", "error");
    } finally {
      setSaving(false);
    }
  };

  if (loading || !draft) return <PageLoading />;
  if (error) return <PageError error={error} />;

  const cardTitle = { textTransform: "none" as const, letterSpacing: 0, fontSize: 13, fontWeight: 700, color: "var(--text)", marginBottom: 14 };
  const hero: Hero = { ...HERO_DEFAULTS, ...draft.hero };

  return (
    <>
      <PageHead title="About / Bio" sub="Edit your homepage intro, bio and stats">
        <button className="adm-btn" onClick={() => setDraft(about)} disabled={!dirty || saving} style={{ opacity: dirty ? 1 : 0.5 }}>Reset</button>
        <button className="adm-btn adm-btn-primary" onClick={save} disabled={!dirty || saving} style={{ opacity: dirty && !saving ? 1 : 0.6 }}>
          {saving ? <Spinner /> : <AdminIcons.save style={{ width: 14, height: 14 }} />} {saving ? "Saving…" : "Save Changes"}
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
          <div className="adm-card">
            <div className="adm-card-title" style={cardTitle}>Story &amp; content</div>
            <div style={{ display: "grid", gap: 14 }}>
              <Field label="My story" hint="Extra paragraphs shown under the bio — separate paragraphs with a blank line">
                <TextArea
                  rows={8}
                  value={(draft.story ?? []).join("\n\n")}
                  onChange={(v) => set("story", v.split(/\n\s*\n/).map((p) => p.trim()).filter(Boolean))}
                  placeholder={"First paragraph…\n\nSecond paragraph…"}
                />
              </Field>
              <div>
                <div className="cms-label" style={{ marginBottom: 8 }}>“What I do” cards</div>
                <div style={{ display: "grid", gap: 10 }}>
                  {focus.map((f, i) => (
                    <div key={i} style={{ display: "grid", gap: 6, border: "1px solid var(--border)", borderRadius: 9, padding: "10px 12px", background: "var(--bg-elev)" }}>
                      <div style={{ display: "flex", gap: 8 }}>
                        <input className="cms-input" value={f.title} onChange={(e) => setFocus(i, "title", e.target.value)} placeholder="Card title" />
                        <button type="button" className="cms-card-action danger" onClick={() => removeFocus(i)} title="Remove card" style={{ flexShrink: 0 }}>
                          <AdminIcons.trash style={{ width: 13, height: 13 }} />
                        </button>
                      </div>
                      <textarea className="cms-input cms-textarea" rows={2} value={f.desc} onChange={(e) => setFocus(i, "desc", e.target.value)} placeholder="Short description" />
                    </div>
                  ))}
                  <button type="button" className="adm-btn" onClick={addFocus} style={{ justifySelf: "start" }}>
                    <AdminIcons.plus style={{ width: 13, height: 13 }} /> Add card
                  </button>
                </div>
              </div>
              <div>
                <div className="cms-label" style={{ marginBottom: 8 }}>Highlights</div>
                <div style={{ display: "grid", gap: 8 }}>
                  {highlights.map((h, i) => (
                    <div key={i} style={{ display: "flex", gap: 8 }}>
                      <input className="cms-input" value={h} onChange={(e) => setHighlight(i, e.target.value)} placeholder="Shipped a…" />
                      <button type="button" className="cms-card-action danger" onClick={() => removeHighlight(i)} title="Remove highlight" style={{ flexShrink: 0 }}>
                        <AdminIcons.trash style={{ width: 13, height: 13 }} />
                      </button>
                    </div>
                  ))}
                  <button type="button" className="adm-btn" onClick={addHighlight} style={{ justifySelf: "start" }}>
                    <AdminIcons.plus style={{ width: 13, height: 13 }} /> Add highlight
                  </button>
                </div>
              </div>
            </div>
          </div>
          <div className="adm-card">
            <div className="adm-card-title" style={cardTitle}>Hero / Intro</div>
            <div className="cms-form-grid">
              <Field label="Rotating roles" full hint="The typewriter line under your name — press Enter to add"><TagInput value={hero.roles} onChange={(v) => setHero("roles", v)} placeholder="Web Developer…" /></Field>
              <Field label="Availability badge" full hint="The pill shown above your name"><TextInput value={hero.availability} onChange={(v) => setHero("availability", v)} placeholder="Available for senior roles" /></Field>
              <Field label="Code-card focus" hint="The focus array in the hero card"><TagInput value={hero.focus} onChange={(v) => setHero("focus", v)} placeholder="Full Stack…" /></Field>
              <Field label="Code-card stack" hint="The stack array in the hero card"><TagInput value={hero.stack} onChange={(v) => setHero("stack", v)} placeholder="React…" /></Field>
              <Field label="Experience"><TextInput value={hero.experience} onChange={(v) => setHero("experience", v)} placeholder="4+ years" /></Field>
              <Field>
                <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", background: "var(--bg-elev)", border: "1px solid var(--border)", borderRadius: 9, padding: "10px 14px" }}>
                  <div>
                    <div className="cms-label" style={{ marginBottom: 1 }}>Open to work</div>
                    <div className="cms-hint">Sets openToWork in the hero card</div>
                  </div>
                  <Toggle on={hero.openToWork} onChange={(v) => setHero("openToWork", v)} />
                </div>
              </Field>
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
