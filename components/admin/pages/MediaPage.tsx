"use client";

import { useRef, useState } from "react";
import { AdminIcons } from "../icons";
import { PageHead } from "../PageHead";
import { useConfirm } from "../cms/Modal";
import { toast } from "../cms/Toast";
import { PageLoading, PageError } from "../cms/Loading";
import { type Media } from "@/lib/cms-store";
import { api, uploadApi } from "@/lib/api";
import { useCollection } from "@/lib/use-cms";

export function MediaPage() {
  const { items: media, loading, error, create, remove } = useCollection(api.media);
  const [confirm, confirmNode] = useConfirm();
  const [uploading, setUploading] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const onFiles = async (files: FileList | null) => {
    if (!files || uploading) return;
    const arr = [...files];
    setUploading(true);
    try {
      for (const file of arr) {
        const { url } = await uploadApi.image(file);
        await create({ name: file.name, kind: "image", src: url });
      }
      toast(`${arr.length} image${arr.length > 1 ? "s" : ""} uploaded`);
    } catch (e) {
      toast(e instanceof Error ? e.message : "Upload failed", "error");
    } finally {
      setUploading(false);
      if (inputRef.current) inputRef.current.value = "";
    }
  };

  const onDelete = async (m: Media) => {
    if (await confirm({ title: "Delete asset?", message: `"${m.name}" will be removed.` })) {
      try {
        await remove(m.id);
        toast("Asset deleted", "info");
      } catch (e) {
        toast(e instanceof Error ? e.message : "Failed to delete asset", "error");
      }
    }
  };

  if (loading) return <PageLoading />;
  if (error) return <PageError error={error} />;

  return (
    <>
      <PageHead title="Media Library" sub={`${media.length} assets`}>
        <button className="adm-btn adm-btn-primary" onClick={() => inputRef.current?.click()} disabled={uploading}>
          <AdminIcons.upload style={{ width: 15, height: 15 }} /> {uploading ? "Uploading…" : "Upload"}
        </button>
        <input ref={inputRef} type="file" accept="image/*" multiple hidden onChange={(e) => onFiles(e.target.files)} />
      </PageHead>
      <div className="cms-media-grid">
        {media.map((m) => (
          <div key={m.id} className="cms-media-card">
            <div className="cms-media-thumb" style={m.src ? { backgroundImage: `url(${m.src})` } : { background: m.color }}>
              <button className="cms-card-action danger" style={{ position: "absolute", top: 8, right: 8, background: "rgba(4,5,9,0.5)", backdropFilter: "blur(4px)" }} onClick={() => onDelete(m)}>
                <AdminIcons.trash style={{ width: 13, height: 13 }} />
              </button>
            </div>
            <div className="cms-media-meta">
              <div style={{ fontSize: 12.5, fontWeight: 600, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{m.name}</div>
              <div className="adm-feed-time">{m.kind}</div>
            </div>
          </div>
        ))}
      </div>
      {confirmNode}
    </>
  );
}
