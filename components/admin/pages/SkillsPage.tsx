"use client";

import { useState } from "react";
import { AdminIcons } from "../icons";
import { PageHead } from "../PageHead";
import { Modal, useConfirm } from "../cms/Modal";
import { Field, TextInput, TagInput, Toggle } from "../cms/Fields";
import { toast } from "../cms/Toast";
import { PageLoading, PageError, Spinner } from "../cms/Loading";
import { type Skill } from "@/lib/cms-store";
import { api } from "@/lib/api";
import { useCollection } from "@/lib/use-cms";

const emptySkill = (): Skill => ({ id: "", title: "", items: [], accent: false });

function SkillModal({ open, initial, onClose, onSave, saving }: { open: boolean; initial: Skill | null; onClose: () => void; onSave: (s: Skill) => void; saving: boolean }) {
  const [draft, setDraft] = useState<Skill>(initial || emptySkill());
  const [synced, setSynced] = useState<{ initial: Skill | null; open: boolean }>({ initial, open });
  if (synced.initial !== initial || synced.open !== open) {
    setSynced({ initial, open });
    setDraft(initial || emptySkill());
  }
  const set = <K extends keyof Skill>(k: K, v: Skill[K]) => setDraft((d) => ({ ...d, [k]: v }));
  const isNew = !draft.id;
  const save = () => {
    if (!draft.title.trim()) {
      toast("Group name is required", "error");
      return;
    }
    onSave(draft);
  };
  return (
    <Modal
      open={open}
      onClose={onClose}
      title={isNew ? "New Skill Group" : "Edit Skill Group"}
      sub={isNew ? "Group related skills together" : draft.title}
      footer={
        <>
          <button className="adm-btn" onClick={onClose} disabled={saving}>Cancel</button>
          <button className="adm-btn adm-btn-primary" onClick={save} disabled={saving}>
            {saving ? <Spinner /> : <AdminIcons.save style={{ width: 14, height: 14 }} />} {saving ? "Saving…" : isNew ? "Create" : "Save"}
          </button>
        </>
      }
    >
      <div style={{ display: "grid", gap: 16 }}>
        <Field label="Group name"><TextInput value={draft.title} onChange={(v) => set("title", v)} placeholder="Frontend" /></Field>
        <Field label="Skills" hint="Press Enter to add each skill"><TagInput value={draft.items} onChange={(v) => set("items", v)} placeholder="React, Next.js…" /></Field>
        <Field>
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", background: "var(--bg-elev)", border: "1px solid var(--border)", borderRadius: 9, padding: "10px 14px" }}>
            <div>
              <div className="cms-label" style={{ marginBottom: 1 }}>Accent group</div>
              <div className="cms-hint">Highlight with gradient (e.g. Web3)</div>
            </div>
            <Toggle on={draft.accent} onChange={(v) => set("accent", v)} />
          </div>
        </Field>
      </div>
    </Modal>
  );
}

export function SkillsPage() {
  const { items: skills, loading, error, create, update, remove } = useCollection(api.skills);
  const [modal, setModal] = useState<{ open: boolean; item: Skill | null }>({ open: false, item: null });
  const [saving, setSaving] = useState(false);
  const [busyId, setBusyId] = useState<string | null>(null);
  const [confirm, confirmNode] = useConfirm();
  const total = skills.reduce((a, s) => a + s.items.length, 0);

  const onSave = async (item: Skill) => {
    setSaving(true);
    try {
      if (item.id) {
        await update(item.id, item);
        toast("Skill group updated");
      } else {
        const { id: _id, ...body } = item;
        void _id;
        await create(body);
        toast("Skill group added");
      }
      setModal({ open: false, item: null });
    } catch (e) {
      toast(e instanceof Error ? e.message : "Failed to save skill group", "error");
    } finally {
      setSaving(false);
    }
  };
  const onDelete = async (s: Skill) => {
    if (await confirm({ title: "Delete skill group?", message: `"${s.title}" and its ${s.items.length} skills will be removed.` })) {
      setBusyId(s.id);
      try {
        await remove(s.id);
        toast("Skill group deleted", "info");
      } catch (e) {
        toast(e instanceof Error ? e.message : "Failed to delete skill group", "error");
      } finally {
        setBusyId(null);
      }
    }
  };

  if (loading) return <PageLoading />;
  if (error) return <PageError error={error} />;

  return (
    <>
      <PageHead title="Skills" sub={`${skills.length} groups · ${total} skills`}>
        <button className="adm-btn adm-btn-primary" onClick={() => setModal({ open: true, item: null })}>
          <AdminIcons.plus style={{ width: 14, height: 14 }} /> Add Group
        </button>
      </PageHead>
      <div className="adm-grid-3">
        {skills.map((s) => (
          <div key={s.id} className={`cms-skill-card${s.accent ? " accent" : ""}`}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 12 }}>
              <span style={{ fontFamily: "var(--font-space-grotesk)", fontWeight: 700, fontSize: 14.5 }}>{s.title}</span>
              <div style={{ display: "flex", gap: 5 }}>
                <button className="cms-card-action" style={{ width: 28, height: 28 }} onClick={() => setModal({ open: true, item: s })} disabled={busyId === s.id}><AdminIcons.edit style={{ width: 13, height: 13 }} /></button>
                <button className="cms-card-action danger" style={{ width: 28, height: 28 }} onClick={() => onDelete(s)} disabled={busyId === s.id}>{busyId === s.id ? <Spinner size={13} /> : <AdminIcons.trash style={{ width: 13, height: 13 }} />}</button>
              </div>
            </div>
            <div style={{ display: "flex", gap: 6, flexWrap: "wrap" }}>
              {s.items.map((it) => (
                <span key={it} className="adm-badge badge-cyan" style={{ fontSize: 11.5, background: s.accent ? "rgba(124,58,237,0.18)" : "rgba(34,211,238,0.12)", color: s.accent ? "#a78bfa" : "var(--cyan)" }}>{it}</span>
              ))}
            </div>
          </div>
        ))}
      </div>
      <SkillModal open={modal.open} initial={modal.item} onClose={() => setModal({ open: false, item: null })} onSave={onSave} saving={saving} />
      {confirmNode}
    </>
  );
}
