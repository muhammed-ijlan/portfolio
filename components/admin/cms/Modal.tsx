"use client";

import { useEffect, useState, type ReactNode } from "react";
import { AdminIcons } from "../icons";

export function Modal({
  open,
  onClose,
  title,
  sub,
  children,
  footer,
  wide,
}: {
  open: boolean;
  onClose: () => void;
  title?: ReactNode;
  sub?: ReactNode;
  children?: ReactNode;
  footer?: ReactNode;
  wide?: boolean;
}) {
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    return () => {
      window.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
  }, [open, onClose]);

  if (!open) return null;

  return (
    <div className="cms-modal-overlay" onMouseDown={onClose}>
      <div className={`cms-modal${wide ? " wide" : ""}`} onMouseDown={(e) => e.stopPropagation()} role="dialog" aria-modal="true">
        <div className="cms-modal-head">
          <div>
            <div className="cms-modal-title">{title}</div>
            {sub && <div className="cms-modal-sub">{sub}</div>}
          </div>
          <button className="adm-icon-btn" onClick={onClose} aria-label="Close" style={{ width: 32, height: 32 }}>
            <AdminIcons.x style={{ width: 18, height: 18 }} />
          </button>
        </div>
        <div className="cms-modal-body">{children}</div>
        {footer && <div className="cms-modal-foot">{footer}</div>}
      </div>
    </div>
  );
}

type ConfirmOpts = { title?: string; message?: string; confirmLabel?: string };

export function useConfirm(): [(opts: ConfirmOpts) => Promise<boolean>, ReactNode] {
  const [state, setState] = useState<(ConfirmOpts & { res: (v: boolean) => void }) | null>(null);

  const confirm = (opts: ConfirmOpts) => new Promise<boolean>((res) => setState({ ...opts, res }));

  const node = state ? (
    <div
      className="cms-modal-overlay"
      onMouseDown={() => {
        state.res(false);
        setState(null);
      }}
    >
      <div className="cms-modal" style={{ maxWidth: 400 }} onMouseDown={(e) => e.stopPropagation()}>
        <div className="cms-modal-body" style={{ paddingTop: 24 }}>
          <div style={{ width: 44, height: 44, borderRadius: 12, background: "rgba(248,113,113,0.14)", display: "grid", placeItems: "center", marginBottom: 14 }}>
            <span style={{ color: "#f87171" }}>
              <AdminIcons.trash style={{ width: 18, height: 18 }} />
            </span>
          </div>
          <div className="cms-modal-title">{state.title || "Delete item?"}</div>
          <div className="cms-modal-sub" style={{ marginTop: 6 }}>{state.message || "This action cannot be undone."}</div>
        </div>
        <div className="cms-modal-foot">
          <button
            className="adm-btn"
            onClick={() => {
              state.res(false);
              setState(null);
            }}
          >
            Cancel
          </button>
          <button
            className="adm-btn"
            style={{ background: "#ef4444", borderColor: "transparent", color: "#fff" }}
            onClick={() => {
              state.res(true);
              setState(null);
            }}
          >
            {state.confirmLabel || "Delete"}
          </button>
        </div>
      </div>
    </div>
  ) : null;

  return [confirm, node];
}
