import type { ReactNode } from "react";

export function StatCard({
  title,
  value,
  delta,
  type,
  icon,
  accent,
}: {
  title: string;
  value: string | number;
  delta?: string;
  type?: "up" | "dn" | "neu";
  icon: ReactNode;
  accent: string;
}) {
  return (
    <div className="adm-card" style={{ overflow: "visible" }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
        <div>
          <div className="adm-card-title">{title}</div>
          <div className="adm-card-val">{value}</div>
          {delta && (
            <div className={`adm-card-delta ${type === "up" ? "delta-up" : type === "dn" ? "delta-dn" : "delta-neu"}`}>
              {delta}
            </div>
          )}
        </div>
        <div style={{ width: 40, height: 40, borderRadius: 11, background: accent, display: "grid", placeItems: "center" }}>
          {icon}
        </div>
      </div>
    </div>
  );
}
