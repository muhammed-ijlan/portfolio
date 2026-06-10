"use client";

import { useState } from "react";
import { AdminIcons } from "../icons";
import { PageHead } from "../PageHead";
import { Modal, useConfirm } from "../cms/Modal";
import { EmptyState, Segmented } from "../cms/Fields";
import { toast } from "../cms/Toast";
import { PageLoading, PageError } from "../cms/Loading";
import { initials, avatarColor, relTime, type Message } from "@/lib/cms-store";
import { api } from "@/lib/api";
import { useCollection } from "@/lib/use-cms";

type Filter = "all" | "new" | "replied" | "starred";

const PAGE_SIZE = 12;

export function MessagesPage() {
  const { items: messages, setItems, loading, error, update, remove } = useCollection(api.messages);
  const [filter, setFilter] = useState<Filter>("all");
  const [q, setQ] = useState("");
  const [page, setPage] = useState(1);
  const [open, setOpen] = useState<Message | null>(null);
  const [confirm, confirmNode] = useConfirm();

  const counts = {
    all: messages.length,
    new: messages.filter((m) => m.status === "new").length,
    starred: messages.filter((m) => m.starred).length,
  };
  const query = q.trim().toLowerCase();
  const rows = messages.filter((m) => {
    const matchesFilter = filter === "all" ? true : filter === "starred" ? m.starred : m.status === filter;
    const matchesQuery =
      !query ||
      [m.name, m.email, m.subject, m.message].some((f) => f.toLowerCase().includes(query));
    return matchesFilter && matchesQuery;
  });
  const visible = rows.slice(0, page * PAGE_SIZE);

  // Optimistic: reflect the change instantly, then persist; roll back on failure.
  const patch = (m: Message, change: Partial<Message>) => {
    setItems((prev) => prev.map((x) => (x.id === m.id ? { ...x, ...change } : x)));
    update(m.id, change).catch((e) => {
      setItems((prev) => prev.map((x) => (x.id === m.id ? m : x)));
      toast(e instanceof Error ? e.message : "Failed to update", "error");
    });
  };
  const markStatus = (m: Message, status: Message["status"]) => patch(m, { status });
  const toggleStar = (m: Message) => patch(m, { starred: !m.starred });
  const openMsg = (m: Message) => {
    if (m.status === "new") markStatus(m, "read");
    setOpen({ ...m, status: m.status === "new" ? "read" : m.status });
  };
  const onDelete = async (m: Message) => {
    if (await confirm({ title: "Delete message?", message: `Message from ${m.name} will be removed.` })) {
      try {
        await remove(m.id);
        setOpen(null);
        toast("Message deleted", "info");
      } catch (e) {
        toast(e instanceof Error ? e.message : "Failed to delete message", "error");
      }
    }
  };

  if (loading) return <PageLoading />;
  if (error) return <PageError error={error} />;

  return (
    <>
      <PageHead title="Messages" sub={`${counts.new} new · ${counts.all} total from your contact form`}>
        <Segmented value={filter} onChange={(v: Filter) => { setFilter(v); setPage(1); }} options={[{ value: "all", label: "All" }, { value: "new", label: "New" }, { value: "replied", label: "Replied" }, { value: "starred", label: "Starred" }]} />
      </PageHead>

      <div className="adm-toolbar">
        <div className="adm-search">
          <AdminIcons.search style={{ width: 14, height: 14 }} />
          <input placeholder="Search messages…" value={q} onChange={(e) => { setQ(e.target.value); setPage(1); }} />
        </div>
      </div>

      {rows.length === 0 ? (
        <EmptyState icon={<AdminIcons.mail style={{ width: 24, height: 24 }} />} title={query || filter !== "all" ? "No matching messages" : "No messages"} sub={query || filter !== "all" ? "Try a different search or filter." : "Contact form submissions will appear here."} />
      ) : (
        <div style={{ display: "grid", gap: 10 }}>
          {visible.map((m) => (
            <div key={m.id} className={`cms-msg-row${m.status === "new" ? " unread" : ""}`} onClick={() => openMsg(m)}>
              <div className="cms-msg-avatar" style={{ background: avatarColor(m.name) }}>{initials(m.name)}</div>
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ display: "flex", alignItems: "center", gap: 8, flexWrap: "wrap" }}>
                  <span style={{ fontWeight: 700, fontSize: 14 }}>{m.name}</span>
                  <span className="adm-feed-time" style={{ fontFamily: "var(--font-jetbrains-mono)" }}>{m.email}</span>
                  {m.status === "replied" && <span className="adm-badge badge-green" style={{ fontSize: 10 }}>replied</span>}
                </div>
                <div style={{ fontWeight: 600, fontSize: 13, marginTop: 3, color: "var(--text)" }}>{m.subject}</div>
                <div style={{ fontSize: 12.5, color: "var(--text-dim)", marginTop: 2, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis", maxWidth: "46ch" }}>{m.message}</div>
              </div>
              <div style={{ display: "flex", flexDirection: "column", alignItems: "flex-end", gap: 8, flexShrink: 0 }}>
                <span className="adm-feed-time">{relTime(m.date)}</span>
                <div style={{ display: "flex", gap: 6 }}>
                  <button className={`cms-star${m.starred ? " on" : ""}`} style={{ background: "var(--bg-elev)" }} onClick={(e) => { e.stopPropagation(); toggleStar(m); }}>
                    <AdminIcons.star style={{ width: 13, height: 13 }} />
                  </button>
                  {m.status === "new" && <span className="cms-msg-unreaddot" style={{ marginTop: 9 }} />}
                </div>
              </div>
            </div>
          ))}
          {visible.length < rows.length && (
            <div style={{ display: "flex", justifyContent: "center", marginTop: 6 }}>
              <button className="adm-btn" onClick={() => setPage((p) => p + 1)}>
                Load more ({rows.length - visible.length})
              </button>
            </div>
          )}
        </div>
      )}

      <Modal
        open={!!open}
        onClose={() => setOpen(null)}
        wide
        title={open?.subject}
        sub={open ? `${open.name} · ${open.email}` : ""}
        footer={
          open && (
            <>
              <button className="adm-btn" style={{ color: "#f87171" }} onClick={() => onDelete(open)}>
                <AdminIcons.trash style={{ width: 14, height: 14 }} /> Delete
              </button>
              <div style={{ flex: 1 }} />
              {open.status !== "replied" && (
                <button className="adm-btn" onClick={() => { markStatus(open, "replied"); setOpen({ ...open, status: "replied" }); toast("Marked as replied"); }}>
                  Mark replied
                </button>
              )}
              <a className="adm-btn adm-btn-primary" href={`mailto:${open.email}?subject=Re: ${encodeURIComponent(open.subject)}`}>
                <AdminIcons.reply style={{ width: 14, height: 14 }} /> Reply
              </a>
            </>
          )
        }
      >
        {open && (
          <div>
            <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 16 }}>
              <div className="cms-msg-avatar" style={{ width: 48, height: 48, fontSize: 16, background: avatarColor(open.name) }}>{initials(open.name)}</div>
              <div>
                <div style={{ fontWeight: 700, fontSize: 15 }}>{open.name}</div>
                <div style={{ fontSize: 12.5, color: "var(--text-dim)", fontFamily: "var(--font-jetbrains-mono)" }}>{open.email}</div>
              </div>
              <div style={{ marginLeft: "auto", textAlign: "right" }}>
                <span className={`adm-badge ${open.status === "replied" ? "badge-green" : open.status === "read" ? "badge-cyan" : "badge-violet"}`}>
                  <span className="badge-dot" />{open.status}
                </span>
                <div className="adm-feed-time" style={{ marginTop: 4 }}>{new Date(open.date).toLocaleString("en", { dateStyle: "medium", timeStyle: "short" })}</div>
              </div>
            </div>
            <div style={{ background: "var(--bg-elev)", border: "1px solid var(--border)", borderRadius: 11, padding: "16px 18px", fontSize: 14, lineHeight: 1.7, color: "var(--text)", whiteSpace: "pre-wrap" }}>{open.message}</div>
          </div>
        )}
      </Modal>
      {confirmNode}
    </>
  );
}
