import React from "react";
import type { LowStockProductItem } from "@/lib/actions/dashboard-actions";
import type { Language } from "@/lib/translations";

interface LowStockAlertProps {
  items: LowStockProductItem[];
  lang: Language;
}

export function LowStockAlert({ items, lang }: LowStockAlertProps) {
  const isEn = lang === "en";

  return (
    <div className="ui-card">
      <div className="ui-card-header">
        <div className="ui-card-title-group">
          <h2>{isEn ? "Low Stock Alert" : "Low Stock Alert"}</h2>
          <p>{isEn ? "Need immediate restock" : "Perlu segera restock"}</p>
        </div>
        <svg
          width="18"
          height="18"
          viewBox="0 0 24 24"
          fill="none"
          stroke="var(--danger, #B23A2E)"
          strokeWidth="2"
        >
          <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z" />
          <line x1="12" y1="9" x2="12" y2="13" />
          <line x1="12" y1="17" x2="12.01" y2="17" />
        </svg>
      </div>

      <div className="low-stock-list" id="dashLowStockList">
        {items.length === 0 ? (
          <div
            style={{
              textAlign: "center",
              color: "var(--text-muted, #737D78)",
              fontSize: 12,
              padding: "10px 0",
            }}
          >
            {isEn
              ? "All stock levels are currently safe."
              : "Semua stok dalam batas aman."}
          </div>
        ) : (
          items.slice(0, 5).map((it) => (
            <div className="low-stock-item" key={it.id}>
              <span className="low-stock-name">{it.nama}</span>
              <span className="low-stock-qty">
                {it.stok} {isEn ? "left" : "tersisa"}
              </span>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
