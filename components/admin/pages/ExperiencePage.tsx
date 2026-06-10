"use client";

import { useEffect, useState } from "react";
import { AdminIcons } from "../icons";
import { PageHead } from "../PageHead";
import { Modal, useConfirm } from "../cms/Modal";
import { Field, TextInput, TextArea, TagInput } from "../cms/Fields";
import { toast } from "../cms/Toast";
import { useStore, uid, type Experience } from "@/lib/cms-store";

type Draft = Experience & { pointsText?: string };

const emptyExp = (): Draft => ({ id: "", role: "", company: "", place: "", period: "", tags: [], points: [] });

function ExperienceModal({ open, initial, onClose, onSave }: { open: boolean; initial: Experience | null; onClose: () => void; onSave: (e: Experience) => void }) {
  const [draft, setDraft] = useState<Draft>(initial || emptyExp());
  useEffect(() => {
    setDraft(initial || emptyExp());
  }, [initial, open]);
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
    onSave({ ...rest, id: draft.id || uid(), points });
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
          <button className="adm-btn" onClick={onClose}>Cancel</button>
          <button className="adm-btn adm-btn-primary" onClick={save}>
            <AdminIcons.save style={{ width: 14, height: 14 }} /> {isNew ? "Create" : "Save"}
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
  const [experience, setExperience] = useStore("experience");
  const [modal, setModal] = useState<{ open: boolean; item: Experience | null }>({ open: false, item: null });
  const [confirm, confirmNode] = useConfirm();

  const onSave = (item: Experience) => {
    const exists = experience.some((e) => e.id === item.id);
    setExperience(exists ? experience.map((e) => (e.id === item.id ? item : e)) : [...experience, item]);
    setModal({ open: false, item: null });
    toast(exists ? "Experience updated" : "Experience added");
  };
  const onDelete = async (e: Experience) => {
    if (await confirm({ title: "Delete experience?", message: `"${e.role} at ${e.company}" will be removed.` })) {
      setExperience(experience.filter((x) => x.id !== e.id));
      toast("Experience deleted", "info");
    }
  };

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
                <button className="cms-card-action" onClick={() => setModal({ open: true, item: e })}><AdminIcons.edit style={{ width: 13, height: 13 }} /></button>
                <button className="cms-card-action danger" onClick={() => onDelete(e)}><AdminIcons.trash style={{ width: 13, height: 13 }} /></button>
              </div>
            </div>
          </div>
        ))}
      </div>
      <ExperienceModal open={modal.open} initial={modal.item} onClose={() => setModal({ open: false, item: null })} onSave={onSave} />
      {confirmNode}
    </>
  );
}
