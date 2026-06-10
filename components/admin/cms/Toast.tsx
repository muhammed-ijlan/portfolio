"use client";

import { useEffect, useState } from "react";
import { uid } from "@/lib/cms-store";

type ToastKind = "success" | "error" | "info";
type ToastItem = { id: string; msg: string; kind: ToastKind };

let _toastFn: ((msg: string, kind: ToastKind) => void) | null = null;

export function toast(msg: string, kind: ToastKind = "success") {
  _toastFn?.(msg, kind);
}

export function ToastHost() {
  const [items, setItems] = useState<ToastItem[]>([]);

  useEffect(() => {
    _toastFn = (msg, kind) => {
      const id = uid();
      setItems((s) => [...s, { id, msg, kind }]);
      setTimeout(() => setItems((s) => s.filter((t) => t.id !== id)), 2600);
    };
    return () => {
      _toastFn = null;
    };
  }, []);

  return (
    <div className="cms-toast-host">
      {items.map((t) => (
        <div key={t.id} className={`cms-toast cms-toast-${t.kind}`}>
          <span className="cms-toast-dot" />
          {t.msg}
        </div>
      ))}
    </div>
  );
}
