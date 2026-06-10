import type { ReactNode } from "react";

export function PageHead({ title, sub, children }: { title: string; sub?: string; children?: ReactNode }) {
  return (
    <div className="adm-page-header">
      <div>
        <h1 className="adm-page-title">{title}</h1>
        {sub && <p className="adm-page-sub">{sub}</p>}
      </div>
      {children && <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>{children}</div>}
    </div>
  );
}
