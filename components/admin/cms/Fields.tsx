"use client";

import { useRef, useState, type ReactNode } from "react";
import { AdminIcons } from "../icons";

export function Field({ label, children, hint, full }: { label?: string; children: ReactNode; hint?: string; full?: boolean }) {
  return (
    <div className="cms-field" style={full ? { gridColumn: "1/-1" } : undefined}>
      {label && <label className="cms-label">{label}</label>}
      {children}
      {hint && <div className="cms-hint">{hint}</div>}
    </div>
  );
}

export function TextInput({ value, onChange, placeholder, type = "text" }: { value?: string; onChange: (v: string) => void; placeholder?: string; type?: string }) {
  return <input className="cms-input" type={type} value={value || ""} placeholder={placeholder} onChange={(e) => onChange(e.target.value)} />;
}

export function TextArea({ value, onChange, placeholder, rows = 4 }: { value?: string; onChange: (v: string) => void; placeholder?: string; rows?: number }) {
  return <textarea className="cms-input cms-textarea" rows={rows} value={value || ""} placeholder={placeholder} onChange={(e) => onChange(e.target.value)} />;
}

export function SelectInput({ value, onChange, options }: { value: string; onChange: (v: string) => void; options: { value: string; label: string }[] }) {
  return (
    <select className="cms-input" value={value} onChange={(e) => onChange(e.target.value)}>
      {options.map((o) => (
        <option key={o.value} value={o.value}>{o.label}</option>
      ))}
    </select>
  );
}

export function TagInput({ value = [], onChange, placeholder = "Add and press Enter" }: { value?: string[]; onChange: (v: string[]) => void; placeholder?: string }) {
  const [draft, setDraft] = useState("");
  const add = () => {
    const v = draft.trim();
    if (v && !value.includes(v)) onChange([...value, v]);
    setDraft("");
  };
  return (
    <div className="cms-taginput">
      {value.map((t) => (
        <span key={t} className="cms-tag">
          {t}
          <button type="button" onClick={() => onChange(value.filter((x) => x !== t))} aria-label={`Remove ${t}`}>×</button>
        </span>
      ))}
      <input
        value={draft}
        placeholder={placeholder}
        onChange={(e) => setDraft(e.target.value)}
        onKeyDown={(e) => {
          if (e.key === "Enter") {
            e.preventDefault();
            add();
          } else if (e.key === "Backspace" && !draft && value.length) {
            onChange(value.slice(0, -1));
          }
        }}
      />
    </div>
  );
}

export function Toggle({ on, onChange }: { on: boolean; onChange: (v: boolean) => void }) {
  return <button type="button" className={`adm-toggle ${on ? "on" : "off"}`} onClick={() => onChange(!on)} aria-pressed={!!on} aria-label="Toggle" />;
}

export function ImageField({ value, onChange, label = "Cover image" }: { value?: string; onChange: (v: string) => void; label?: string }) {
  const inputRef = useRef<HTMLInputElement>(null);
  const onFile = (file?: File) => {
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => onChange(reader.result as string);
    reader.readAsDataURL(file);
  };
  return (
    <div className="cms-imagefield">
      {value ? (
        <div className="cms-image-preview" style={{ backgroundImage: `url(${value})` }}>
          <div className="cms-image-actions">
            <button type="button" className="adm-btn" style={{ fontSize: 12, padding: "5px 10px" }} onClick={() => inputRef.current?.click()}>
              <AdminIcons.upload style={{ width: 13, height: 13 }} /> Replace
            </button>
            <button type="button" className="adm-btn" style={{ fontSize: 12, padding: "5px 10px" }} onClick={() => onChange("")}>
              <AdminIcons.trash style={{ width: 13, height: 13 }} /> Remove
            </button>
          </div>
        </div>
      ) : (
        <div
          className="cms-image-drop"
          onClick={() => inputRef.current?.click()}
          onDragOver={(e) => {
            e.preventDefault();
            e.currentTarget.classList.add("drag");
          }}
          onDragLeave={(e) => e.currentTarget.classList.remove("drag")}
          onDrop={(e) => {
            e.preventDefault();
            e.currentTarget.classList.remove("drag");
            onFile(e.dataTransfer.files[0]);
          }}
        >
          <span style={{ color: "var(--text-faint)" }}>
            <AdminIcons.image style={{ width: 22, height: 22 }} />
          </span>
          <div style={{ fontSize: 13, fontWeight: 600, marginTop: 8 }}>Drop image or click to upload</div>
          <div style={{ fontSize: 11.5, color: "var(--text-faint)", marginTop: 2 }}>PNG, JPG · {label}</div>
        </div>
      )}
      <input ref={inputRef} type="file" accept="image/*" hidden onChange={(e) => onFile(e.target.files?.[0])} />
    </div>
  );
}

export function EmptyState({ icon, title, sub, action }: { icon: ReactNode; title: string; sub?: string; action?: ReactNode }) {
  return (
    <div className="cms-empty">
      <div className="cms-empty-icon">{icon}</div>
      <div style={{ fontWeight: 600, fontSize: 15 }}>{title}</div>
      <div style={{ fontSize: 13, color: "var(--text-dim)", marginTop: 4, marginBottom: action ? 16 : 0 }}>{sub}</div>
      {action}
    </div>
  );
}

export function Segmented<T extends string>({
  value,
  onChange,
  options,
}: {
  value: T;
  onChange: (v: T) => void;
  options: { value: T; label?: string; icon?: keyof typeof AdminIcons }[];
}) {
  return (
    <div className="cms-segmented">
      {options.map((o) => {
        const Icon = o.icon ? AdminIcons[o.icon] : null;
        return (
          <button key={o.value} className={value === o.value ? "active" : ""} onClick={() => onChange(o.value)} aria-pressed={value === o.value}>
            {Icon && <Icon style={{ width: 15, height: 15 }} />}
            {o.label && <span>{o.label}</span>}
          </button>
        );
      })}
    </div>
  );
}
