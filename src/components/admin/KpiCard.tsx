import React from "react";

export type KpiTheme = "green" | "orange" | "teal" | "blue";

interface KpiCardProps {
  title: string;
  value: string | number;
  trendPct: number;
  trendLabel: string;
  theme: KpiTheme;
  icon: React.ReactNode;
}

export function KpiCard({
  title,
  value,
  trendPct,
  trendLabel,
  theme,
  icon,
}: KpiCardProps) {
  const isUp = trendPct >= 0;

  return (
    <div className="kpi-card">
      <div className="kpi-card-top">
        <span>{title}</span>
        <div className={`kpi-card-icon-wrap ${theme}`}>{icon}</div>
      </div>
      <div className="kpi-card-value">{value}</div>
      <div className={`kpi-card-trend ${isUp ? "up" : "down"}`}>
        <span>
          {isUp ? "↑ +" : "↓ "}
          {Math.abs(trendPct)}%
        </span>{" "}
        <span style={{ color: "var(--text-muted, #737D78)", fontWeight: "normal" }}>
          {trendLabel}
        </span>
      </div>
    </div>
  );
}
