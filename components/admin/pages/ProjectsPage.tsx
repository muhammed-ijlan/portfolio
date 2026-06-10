"use client";

import { useEffect, useState } from "react";
import { AdminIcons } from "../icons";
import { PageHead } from "../PageHead";
import { Modal, useConfirm } from "../cms/Modal";
import { Field, TextInput, TextArea, SelectInput, TagInput, Toggle, ImageField, EmptyState, Segmented } from "../cms/Fields";
import { toast } from "../cms/Toast";
import { useStore, uid, type Project } from "@/lib/cms-store";

const emptyProject = (): Project => ({ id: "", title: "", kind: "", desc: "", tags: [], featured: false, live: "", repo: "", image: "", status: "draft", views: 0 });

function ProjectModal({ open, initial, onClose, onSave }: { open: boolean; initial: Project | null; onClose: () => void; onSave: (p: Project) => void }) {
  const [draft, setDraft] = useState<Project>(initial || emptyProject());
  useEffect(() => {
    setDraft(initial || emptyProject());
  }, [initial, open]);
  const set = <K extends keyof Project>(k: K, v: Project[K]) => setDraft((d) => ({ ...d, [k]: v }));
  const isNew = !draft.id;
  const save = () => {
    if (!draft.title.trim()) {
      toast("Title is required", "error");
      return;
    }
    onSave({ ...draft, id: draft.id || uid() });
  };
  return (
    <Modal
      open={open}
      onClose={onClose}
      wide
      title={isNew ? "New Project" : "Edit Project"}
      sub={isNew ? "Add a project to your portfolio" : draft.title}
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
        <Field label="Project title" full><TextInput value={draft.title} onChange={(v) => set("title", v)} placeholder="Multi-Chain Crypto Wallet" /></Field>
        <Field label="Category / kind"><TextInput value={draft.kind} onChange={(v) => set("kind", v)} placeholder="Web3 · Chrome MV3" /></Field>
        <Field label="Status"><SelectInput value={draft.status} onChange={(v) => set("status", v as Project["status"])} options={[{ value: "published", label: "Published" }, { value: "draft", label: "Draft" }]} /></Field>
        <Field label="Description" full><TextArea value={draft.desc} onChange={(v) => set("desc", v)} placeholder="What does this project do?" /></Field>
        <Field label="Tech stack" full hint="Type a technology and press Enter"><TagInput value={draft.tags} onChange={(v) => set("tags", v)} placeholder="React, TypeScript…" /></Field>
        <Field label="Live URL"><TextInput value={draft.live} onChange={(v) => set("live", v)} placeholder="https://…" /></Field>
        <Field label="Repository URL"><TextInput value={draft.repo} onChange={(v) => set("repo", v)} placeholder="https://github.com/…" /></Field>
        <Field label="Cover image" full><ImageField value={draft.image} onChange={(v) => set("image", v)} /></Field>
        <Field full>
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", background: "var(--bg-elev)", border: "1px solid var(--border)", borderRadius: 9, padding: "10px 14px" }}>
            <div>
              <div className="cms-label" style={{ marginBottom: 1 }}>Featured project</div>
              <div className="cms-hint">Highlight this on the homepage</div>
            </div>
            <Toggle on={draft.featured} onChange={(v) => set("featured", v)} />
          </div>
        </Field>
      </div>
    </Modal>
  );
}

export function ProjectsPage() {
  const [projects, setProjects] = useStore("projects");
  const [view, setView] = useState<"cards" | "table">("cards");
  const [q, setQ] = useState("");
  const [modal, setModal] = useState<{ open: boolean; item: Project | null }>({ open: false, item: null });
  const [confirm, confirmNode] = useConfirm();

  const rows = projects.filter((p) => p.title.toLowerCase().includes(q.toLowerCase()) || p.kind.toLowerCase().includes(q.toLowerCase()));

  const onSave = (item: Project) => {
    const exists = projects.some((p) => p.id === item.id);
    setProjects(exists ? projects.map((p) => (p.id === item.id ? item : p)) : [item, ...projects]);
    setModal({ open: false, item: null });
    toast(exists ? "Project updated" : "Project created");
  };
  const onDelete = async (p: Project) => {
    if (await confirm({ title: "Delete project?", message: `"${p.title}" will be permanently removed.` })) {
      setProjects(projects.filter((x) => x.id !== p.id));
      toast("Project deleted", "info");
    }
  };
  const toggleFeatured = (p: Project) => setProjects(projects.map((x) => (x.id === p.id ? { ...x, featured: !x.featured } : x)));

  return (
    <>
      <PageHead title="Projects" sub={`${projects.length} projects · ${projects.filter((p) => p.featured).length} featured`}>
        <Segmented value={view} onChange={setView} options={[{ value: "cards", icon: "grid2" }, { value: "table", icon: "list" }]} />
        <button className="adm-btn adm-btn-primary" onClick={() => setModal({ open: true, item: null })}>
          <AdminIcons.plus style={{ width: 14, height: 14 }} /> New Project
        </button>
      </PageHead>

      <div className="adm-toolbar">
        <div className="adm-search">
          <AdminIcons.search style={{ width: 14, height: 14 }} />
          <input placeholder="Search projects…" value={q} onChange={(e) => setQ(e.target.value)} />
        </div>
      </div>

      {rows.length === 0 ? (
        <EmptyState
          icon={<AdminIcons.briefcase style={{ width: 24, height: 24 }} />}
          title="No projects found"
          sub={q ? "Try a different search." : "Create your first project to get started."}
          action={!q && (
            <button className="adm-btn adm-btn-primary" onClick={() => setModal({ open: true, item: null })}>
              <AdminIcons.plus style={{ width: 14, height: 14 }} /> New Project
            </button>
          )}
        />
      ) : view === "cards" ? (
        <div className="cms-proj-grid">
          {rows.map((p) => (
            <div key={p.id} className="cms-proj-card">
              <div className={`cms-proj-cover${p.image ? "" : " cms-proj-cover-fallback"}`} style={p.image ? { backgroundImage: `url(${p.image})` } : undefined}>
                <button className={`cms-star${p.featured ? " on" : ""}`} onClick={() => toggleFeatured(p)} title="Toggle featured">
                  <AdminIcons.star style={{ width: 13, height: 13 }} />
                </button>
                <span className={`adm-badge ${p.status === "published" ? "badge-green" : "badge-gray"}`} style={{ background: "rgba(4,5,9,0.5)", backdropFilter: "blur(4px)" }}>
                  <span className="badge-dot" />
                  {p.status}
                </span>
              </div>
              <div className="cms-proj-body">
                <div className="cms-proj-kind">{p.kind || "Project"}</div>
                <div className="cms-proj-title">{p.title}</div>
                <div className="cms-proj-desc">{p.desc}</div>
                <div style={{ display: "flex", gap: 5, flexWrap: "wrap", marginTop: 2 }}>
                  {p.tags.slice(0, 3).map((t) => <span key={t} className="adm-badge badge-gray" style={{ fontSize: 10.5 }}>{t}</span>)}
                  {p.tags.length > 3 && <span className="adm-badge badge-gray" style={{ fontSize: 10.5 }}>+{p.tags.length - 3}</span>}
                </div>
                <div className="cms-proj-foot">
                  {p.live && <a className="cms-card-action" href={p.live} target="_blank" rel="noreferrer" title="Live"><AdminIcons.external style={{ width: 13, height: 13 }} /></a>}
                  {p.repo && <a className="cms-card-action" href={p.repo} target="_blank" rel="noreferrer" title="Repo"><AdminIcons.link style={{ width: 13, height: 13 }} /></a>}
                  <div style={{ marginLeft: "auto", display: "flex", gap: 6 }}>
                    <button className="cms-card-action" onClick={() => setModal({ open: true, item: p })} title="Edit"><AdminIcons.edit style={{ width: 13, height: 13 }} /></button>
                    <button className="cms-card-action danger" onClick={() => onDelete(p)} title="Delete"><AdminIcons.trash style={{ width: 13, height: 13 }} /></button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="adm-card">
          <div className="adm-table-wrap">
            <table className="adm-table">
              <thead>
                <tr><th>Title</th><th>Category</th><th>Tags</th><th>Views</th><th>Status</th><th>Featured</th><th></th></tr>
              </thead>
              <tbody>
                {rows.map((p) => (
                  <tr key={p.id}>
                    <td className="txt-main">{p.title}</td>
                    <td>{p.kind}</td>
                    <td>{p.tags.slice(0, 3).join(", ")}{p.tags.length > 3 ? "…" : ""}</td>
                    <td style={{ fontFamily: "var(--font-jetbrains-mono), monospace" }}>{(p.views || 0).toLocaleString()}</td>
                    <td>
                      <span className={`adm-badge ${p.status === "published" ? "badge-green" : "badge-gray"}`}><span className="badge-dot" />{p.status}</span>
                    </td>
                    <td>
                      <button className={`cms-star${p.featured ? " on" : ""}`} style={{ background: "var(--bg-elev)" }} onClick={() => toggleFeatured(p)}>
                        <AdminIcons.star style={{ width: 13, height: 13 }} />
                      </button>
                    </td>
                    <td>
                      <div style={{ display: "flex", gap: 6, justifyContent: "flex-end" }}>
                        <button className="cms-card-action" onClick={() => setModal({ open: true, item: p })}><AdminIcons.edit style={{ width: 13, height: 13 }} /></button>
                        <button className="cms-card-action danger" onClick={() => onDelete(p)}><AdminIcons.trash style={{ width: 13, height: 13 }} /></button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      <ProjectModal open={modal.open} initial={modal.item} onClose={() => setModal({ open: false, item: null })} onSave={onSave} />
      {confirmNode}
    </>
  );
}
