"use client";

import { useRef } from "react";
import { AdminIcons } from "../icons";
import { PageHead } from "../PageHead";
import { useConfirm } from "../cms/Modal";
import { toast } from "../cms/Toast";
import { useStore, uid, type Media } from "@/lib/cms-store";

export function MediaPage() {
  const [media, setMedia] = useStore("media");
  const [confirm, confirmNode] = useConfirm();
  const inputRef = useRef<HTMLInputElement>(null);

  const onFiles = (files: FileList | null) => {
    if (!files) return;
    const arr = [...files];
    let done = 0;
    const added: Media[] = [];
    arr.forEach((file) => {
      const reader = new FileReader();
      reader.onload = () => {
        added.push({ id: uid(), name: file.name, kind: "upload", src: reader.result as string });
        if (++done === arr.length) {
          setMedia([...added, ...media]);
          toast(`${arr.length} image${arr.length > 1 ? "s" : ""} uploaded`);
        }
      };
      reader.readAsDataURL(file);
    });
  };

  const onDelete = async (m: Media) => {
    if (await confirm({ title: "Delete asset?", message: `"${m.name}" will be removed.` })) {
      setMedia(media.filter((x) => x.id !== m.id));
      toast("Asset deleted", "info");
    }
  };

  return (
    <>
      <PageHead title="Media Library" sub={`${media.length} assets`}>
        <button className="adm-btn adm-btn-primary" onClick={() => inputRef.current?.click()}>
          <AdminIcons.upload style={{ width: 15, height: 15 }} /> Upload
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
