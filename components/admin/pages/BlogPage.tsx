"use client";

import { useState } from "react";
import { AdminIcons } from "../icons";
import { PageHead } from "../PageHead";
import { Modal, useConfirm } from "../cms/Modal";
import { Field, TextInput, TextArea, SelectInput, TagInput, Toggle, ImageField, EmptyState, Segmented } from "../cms/Fields";
import { toast } from "../cms/Toast";
import { PageLoading, PageError, Spinner } from "../cms/Loading";
import { type BlogPost } from "@/lib/cms-store";
import { api } from "@/lib/api";
import { useCollection } from "@/lib/use-cms";

const emptyPost = (): BlogPost => ({ id: "", title: "", slug: "", excerpt: "", content: "", tags: [], coverImage: "", readTime: "", status: "draft", featured: false, date: "" });

const slugify = (s: string) => s.toLowerCase().trim().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");
const estimateReadTime = (content: string) => `${Math.max(1, Math.round(content.trim().split(/\s+/).filter(Boolean).length / 200))} min`;
const fmtDate = (iso: string) => (iso ? new Date(iso).toLocaleDateString("en", { year: "numeric", month: "short", day: "numeric" }) : "—");

function PostModal({ open, initial, onClose, onSave, saving }: { open: boolean; initial: BlogPost | null; onClose: () => void; onSave: (p: BlogPost) => void; saving: boolean }) {
  const [draft, setDraft] = useState<BlogPost>(initial || emptyPost());
  const [synced, setSynced] = useState({ initial, open });
  if (synced.initial !== initial || synced.open !== open) {
    setSynced({ initial, open });
    setDraft(initial || emptyPost());
  }
  const set = <K extends keyof BlogPost>(k: K, v: BlogPost[K]) => setDraft((d) => ({ ...d, [k]: v }));
  const isNew = !draft.id;
  const save = () => {
    if (!draft.title.trim()) {
      toast("Title is required", "error");
      return;
    }
    onSave({
      ...draft,
      slug: draft.slug.trim() ? slugify(draft.slug) : slugify(draft.title),
      readTime: draft.readTime.trim() || estimateReadTime(draft.content),
      date: draft.date || new Date().toISOString(),
    });
  };
  return (
    <Modal
      open={open}
      onClose={onClose}
      wide
      title={isNew ? "New Post" : "Edit Post"}
      sub={isNew ? "Write a blog post" : draft.title}
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
        <Field label="Post title" full><TextInput value={draft.title} onChange={(v) => set("title", v)} placeholder="Signing transactions on-device" /></Field>
        <Field label="Slug" hint="URL path — auto-filled from the title if left blank"><TextInput value={draft.slug} onChange={(v) => set("slug", v)} placeholder="on-device-signing" /></Field>
        <Field label="Status"><SelectInput value={draft.status} onChange={(v) => set("status", v as BlogPost["status"])} options={[{ value: "published", label: "Published" }, { value: "draft", label: "Draft" }]} /></Field>
        <Field label="Read time" hint="Auto-estimated from content if blank"><TextInput value={draft.readTime} onChange={(v) => set("readTime", v)} placeholder="6 min" /></Field>
        <Field label="Excerpt" full hint="One or two lines shown on cards and previews"><TextArea value={draft.excerpt} onChange={(v) => set("excerpt", v)} rows={2} placeholder="A short summary of the post…" /></Field>
        <Field label="Content (Markdown)" full hint="Supports headings, **bold**, `code`, code blocks, > quotes and lists"><TextArea value={draft.content} onChange={(v) => set("content", v)} rows={14} placeholder="## Heading&#10;&#10;Write your post in Markdown…" /></Field>
        <Field label="Tags" full hint="Type a tag and press Enter"><TagInput value={draft.tags} onChange={(v) => set("tags", v)} placeholder="Web3, React…" /></Field>
        <Field label="Cover image" full><ImageField value={draft.coverImage} onChange={(v) => set("coverImage", v)} /></Field>
        <Field full>
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", background: "var(--bg-elev)", border: "1px solid var(--border)", borderRadius: 9, padding: "10px 14px" }}>
            <div>
              <div className="cms-label" style={{ marginBottom: 1 }}>Featured post</div>
              <div className="cms-hint">Pin this to the top of the blog</div>
            </div>
            <Toggle on={draft.featured} onChange={(v) => set("featured", v)} />
          </div>
        </Field>
      </div>
    </Modal>
  );
}

export function BlogPage() {
  const { items: posts, loading, error, create, update, remove } = useCollection(api.blog);
  const [view, setView] = useState<"cards" | "table">("cards");
  const [q, setQ] = useState("");
  const [modal, setModal] = useState<{ open: boolean; item: BlogPost | null }>({ open: false, item: null });
  const [saving, setSaving] = useState(false);
  const [busyId, setBusyId] = useState<string | null>(null);
  const [confirm, confirmNode] = useConfirm();

  const rows = posts.filter((p) => p.title.toLowerCase().includes(q.toLowerCase()) || p.tags.join(" ").toLowerCase().includes(q.toLowerCase()));

  const onSave = async (item: BlogPost) => {
    setSaving(true);
    try {
      if (item.id) {
        await update(item.id, item);
        toast("Post updated");
      } else {
        const { id: _id, ...body } = item;
        void _id;
        await create(body);
        toast("Post created");
      }
      setModal({ open: false, item: null });
    } catch (e) {
      toast(e instanceof Error ? e.message : "Failed to save post", "error");
    } finally {
      setSaving(false);
    }
  };
  const onDelete = async (p: BlogPost) => {
    if (await confirm({ title: "Delete post?", message: `"${p.title}" will be permanently removed.` })) {
      setBusyId(p.id);
      try {
        await remove(p.id);
        toast("Post deleted", "info");
      } catch (e) {
        toast(e instanceof Error ? e.message : "Failed to delete post", "error");
      } finally {
        setBusyId(null);
      }
    }
  };
  const toggleFeatured = async (p: BlogPost) => {
    setBusyId(p.id);
    try {
      await update(p.id, { featured: !p.featured });
    } catch (e) {
      toast(e instanceof Error ? e.message : "Failed to update post", "error");
    } finally {
      setBusyId(null);
    }
  };

  if (loading) return <PageLoading />;
  if (error) return <PageError error={error} />;

  return (
    <>
      <PageHead title="Blog" sub={`${posts.length} posts · ${posts.filter((p) => p.status === "published").length} published`}>
        <Segmented value={view} onChange={setView} options={[{ value: "cards", icon: "grid2" }, { value: "table", icon: "list" }]} />
        <button className="adm-btn adm-btn-primary" onClick={() => setModal({ open: true, item: null })}>
          <AdminIcons.plus style={{ width: 14, height: 14 }} /> New Post
        </button>
      </PageHead>

      <div className="adm-toolbar">
        <div className="adm-search">
          <AdminIcons.search style={{ width: 14, height: 14 }} />
          <input placeholder="Search posts…" value={q} onChange={(e) => setQ(e.target.value)} />
        </div>
      </div>

      {rows.length === 0 ? (
        <EmptyState
          icon={<AdminIcons.feather style={{ width: 24, height: 24 }} />}
          title="No posts found"
          sub={q ? "Try a different search." : "Write your first post to get started."}
          action={!q && (
            <button className="adm-btn adm-btn-primary" onClick={() => setModal({ open: true, item: null })}>
              <AdminIcons.plus style={{ width: 14, height: 14 }} /> New Post
            </button>
          )}
        />
      ) : view === "cards" ? (
        <div className="cms-proj-grid">
          {rows.map((p) => (
            <div key={p.id} className="cms-proj-card">
              <div className={`cms-proj-cover${p.coverImage ? "" : " cms-proj-cover-fallback"}`} style={p.coverImage ? { backgroundImage: `url(${p.coverImage})` } : undefined}>
                <button className={`cms-star${p.featured ? " on" : ""}`} onClick={() => toggleFeatured(p)} title="Toggle featured" disabled={busyId === p.id}>
                  <AdminIcons.star style={{ width: 13, height: 13 }} />
                </button>
                <span className={`adm-badge ${p.status === "published" ? "badge-green" : "badge-gray"}`} style={{ background: "rgba(4,5,9,0.5)", backdropFilter: "blur(4px)" }}>
                  <span className="badge-dot" />
                  {p.status}
                </span>
              </div>
              <div className="cms-proj-body">
                <div className="cms-proj-kind">{fmtDate(p.date)} · {p.readTime || "—"}</div>
                <div className="cms-proj-title">{p.title}</div>
                <div className="cms-proj-desc">{p.excerpt}</div>
                <div style={{ display: "flex", gap: 5, flexWrap: "wrap", marginTop: 2 }}>
                  {p.tags.slice(0, 3).map((t) => <span key={t} className="adm-badge badge-gray" style={{ fontSize: 10.5 }}>{t}</span>)}
                  {p.tags.length > 3 && <span className="adm-badge badge-gray" style={{ fontSize: 10.5 }}>+{p.tags.length - 3}</span>}
                </div>
                <div className="cms-proj-foot">
                  {p.status === "published" && <a className="cms-card-action" href={`/blog/${p.slug}`} target="_blank" rel="noreferrer" title="View live"><AdminIcons.external style={{ width: 13, height: 13 }} /></a>}
                  <div style={{ marginLeft: "auto", display: "flex", gap: 6 }}>
                    <button className="cms-card-action" onClick={() => setModal({ open: true, item: p })} title="Edit" disabled={busyId === p.id}><AdminIcons.edit style={{ width: 13, height: 13 }} /></button>
                    <button className="cms-card-action danger" onClick={() => onDelete(p)} title="Delete" disabled={busyId === p.id}>{busyId === p.id ? <Spinner size={13} /> : <AdminIcons.trash style={{ width: 13, height: 13 }} />}</button>
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
                <tr><th>Title</th><th>Slug</th><th>Tags</th><th>Date</th><th>Status</th><th>Featured</th><th></th></tr>
              </thead>
              <tbody>
                {rows.map((p) => (
                  <tr key={p.id}>
                    <td className="txt-main">{p.title}</td>
                    <td style={{ fontFamily: "var(--font-jetbrains-mono)", fontSize: 12 }}>{p.slug}</td>
                    <td>{p.tags.slice(0, 3).join(", ")}{p.tags.length > 3 ? "…" : ""}</td>
                    <td>{fmtDate(p.date)}</td>
                    <td>
                      <span className={`adm-badge ${p.status === "published" ? "badge-green" : "badge-gray"}`}><span className="badge-dot" />{p.status}</span>
                    </td>
                    <td>
                      <button className={`cms-star${p.featured ? " on" : ""}`} style={{ background: "var(--bg-elev)" }} onClick={() => toggleFeatured(p)} disabled={busyId === p.id}>
                        <AdminIcons.star style={{ width: 13, height: 13 }} />
                      </button>
                    </td>
                    <td>
                      <div style={{ display: "flex", gap: 6, justifyContent: "flex-end" }}>
                        <button className="cms-card-action" onClick={() => setModal({ open: true, item: p })} disabled={busyId === p.id}><AdminIcons.edit style={{ width: 13, height: 13 }} /></button>
                        <button className="cms-card-action danger" onClick={() => onDelete(p)} disabled={busyId === p.id}>{busyId === p.id ? <Spinner size={13} /> : <AdminIcons.trash style={{ width: 13, height: 13 }} />}</button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      <PostModal open={modal.open} initial={modal.item} onClose={() => setModal({ open: false, item: null })} onSave={onSave} saving={saving} />
      {confirmNode}
    </>
  );
}
