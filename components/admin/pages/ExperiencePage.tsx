"use client";

import { useState } from "react";
import { AdminIcons } from "../icons";
import { PageHead } from "../PageHead";
import { Modal, useConfirm } from "../cms/Modal";
import { Field, TextInput, TextArea, TagInput } from "../cms/Fields";
import { toast } from "../cms/Toast";
import { PageLoading, PageError, Spinner } from "../cms/Loading";
import { type Experience } from "@/lib/cms-store";
import { api } from "@/lib/api";
import { useCollection } from "@/lib/use-cms";

type Draft = Experience & { pointsText?: string };

const emptyExp = (): Draft => ({ id: "", role: "", company: "", place: "", period: "", tags: [], points: [] });

function ExperienceModal({ open, initial, onClose, onSave, saving }: { open: boolean; initial: Experience | null; onClose: () => void; onSave: (e: Experience) => void; saving: boolean }) {
  const [draft, setDraft] = useState<Draft>(initial || emptyExp());
  const [synced, setSynced] = useState<{ initial: Experience | null; open: boolean }>({ initial, open });
  if (synced.initial !== initial || synced.open !== open) {
    setSynced({ initial, open });
    setDraft(initial || emptyExp());
  }
  const set = <K extends keyof Draft>(k: K, v: Draft[K]) => setDraft((d) => ({ ...d, [k]: v }));
  const isNew = !draft.id;
  const pointsText = draft.pointsText !== undefined ? draft.pointsText : draft.points.join("\n");
  const save = () => {
    if (!draft.role.trim() || !draft.company.trim()) {
      toast("Role and company are required", "error");
      return;
    }
    const points = (draft.pointsText !== undefined ? draft.pointsText.split("\n") : draft.points).map((s) => s.trim()).filter(Boolean);
    const { pointsText: _omit, ...rest } = draft;
    void _omit;
    onSave({ ...rest, points });
  };
  return (
    <Modal
      open={open}
      onClose={onClose}
      wide
      title={isNew ? "New Experience" : "Edit Experience"}
      sub={isNew ? "Add a role to your timeline" : `${draft.role} · ${draft.company}`}
      footer={
        <>
          <button className="adm-btn" onClick={onClose} disabled={saving}>Cancel</button>
          <button className="adm-btn adm-btn-primary" onClick={save} disabled={saving}>
            {saving ? <Spinner /> : <AdminIcons.save style={{ width: 14, height: 14 }} />} {saving ? "Saving…" : isNew ? "Create" : "Save"}
          </button>
        </>
      }
    >
      <div className="cms-form-grid">
        <Field label="Role / title"><TextInput value={draft.role} onChange={(v) => set("role", v)} placeholder="Senior Web Developer" /></Field>
        <Field label="Company"><TextInput value={draft.company} onChange={(v) => set("company", v)} placeholder="Token 13 Software LLC" /></Field>
        <Field label="Location"><TextInput value={draft.place} onChange={(v) => set("place", v)} placeholder="Dubai, UAE" /></Field>
        <Field label="Period"><TextInput value={draft.period} onChange={(v) => set("period", v)} placeholder="2025 — 2026" /></Field>
        <Field label="Tech tags" full hint="Press Enter to add"><TagInput value={draft.tags} onChange={(v) => set("tags", v)} /></Field>
        <Field label="Highlights" full hint="One bullet point per line">
          <TextArea rows={6} value={pointsText} onChange={(v) => set("pointsText", v)} placeholder={"Built X that did Y...\nImproved Z by N%..."} />
        </Field>
      </div>
    </Modal>
  );
}

export function ExperiencePage() {
  const { items: experience, loading, error, create, update, remove } = useCollection(api.experience);
  const [modal, setModal] = useState<{ open: boolean; item: Experience | null }>({ open: false, item: null });
  const [saving, setSaving] = useState(false);
  const [busyId, setBusyId] = useState<string | null>(null);
  const [confirm, confirmNode] = useConfirm();

  const onSave = async (item: Experience) => {
    setSaving(true);
    try {
      if (item.id) {
        await update(item.id, item);
        toast("Experience updated");
      } else {
        const { id: _id, ...body } = item;
        void _id;
        await create(body);
        toast("Experience added");
      }
      setModal({ open: false, item: null });
    } catch (e) {
      toast(e instanceof Error ? e.message : "Failed to save experience", "error");
    } finally {
      setSaving(false);
    }
  };
  const onDelete = async (e: Experience) => {
    if (await confirm({ title: "Delete experience?", message: `"${e.role} at ${e.company}" will be removed.` })) {
      setBusyId(e.id);
      try {
        await remove(e.id);
        toast("Experience deleted", "info");
      } catch (err) {
        toast(err instanceof Error ? err.message : "Failed to delete experience", "error");
      } finally {
        setBusyId(null);
      }
    }
  };

  if (loading) return <PageLoading />;
  if (error) return <PageError error={error} />;

  return (
    <>
      <PageHead title="Experience" sub={`${experience.length} roles on your timeline`}>
        <button className="adm-btn adm-btn-primary" onClick={() => setModal({ open: true, item: null })}>
          <AdminIcons.plus style={{ width: 14, height: 14 }} /> Add Experience
        </button>
      </PageHead>
      <div style={{ display: "grid", gap: 14 }}>
        {experience.map((e) => (
          <div key={e.id} className="adm-card">
            <div style={{ display: "flex", justifyContent: "space-between", gap: 16, alignItems: "flex-start" }}>
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ display: "flex", alignItems: "baseline", gap: 10, flexWrap: "wrap" }}>
                  <span style={{ fontFamily: "var(--font-space-grotesk)", fontWeight: 700, fontSize: 16 }}>{e.role}</span>
                  <span className="grad-text" style={{ fontWeight: 600, fontSize: 14 }}>{e.company}</span>
                </div>
                <div style={{ fontSize: 12.5, color: "var(--text-dim)", marginTop: 2, fontFamily: "var(--font-jetbrains-mono)" }}>{e.period} · {e.place}</div>
                <ul style={{ margin: "12px 0 0", padding: 0, listStyle: "none", display: "grid", gap: 6 }}>
                  {e.points.map((pt, i) => (
                    <li key={i} style={{ display: "flex", gap: 8, fontSize: 13, color: "var(--text-dim)", lineHeight: 1.5 }}>
                      <span style={{ color: "var(--cyan)", flexShrink: 0 }}>›</span>
                      <span>{pt}</span>
                    </li>
                  ))}
                </ul>
                <div style={{ display: "flex", gap: 6, flexWrap: "wrap", marginTop: 12 }}>
                  {e.tags.map((t) => <span key={t} className="adm-badge badge-gray" style={{ fontSize: 10.5 }}>{t}</span>)}
                </div>
              </div>
              <div style={{ display: "flex", gap: 6, flexShrink: 0 }}>
                <button className="cms-card-action" onClick={() => setModal({ open: true, item: e })} disabled={busyId === e.id}><AdminIcons.edit style={{ width: 13, height: 13 }} /></button>
                <button className="cms-card-action danger" onClick={() => onDelete(e)} disabled={busyId === e.id}>{busyId === e.id ? <Spinner size={13} /> : <AdminIcons.trash style={{ width: 13, height: 13 }} />}</button>
              </div>
            </div>
          </div>
        ))}
      </div>
      <ExperienceModal open={modal.open} initial={modal.item} onClose={() => setModal({ open: false, item: null })} onSave={onSave} saving={saving} />
      {confirmNode}
    </>
  );
}
