import React from "react";
import type { TopCategoryItem } from "@/lib/actions/dashboard-actions";
import type { Language } from "@/lib/translations";

interface TopSellingListProps {
  categories: TopCategoryItem[];
  lang: Language;
}

export function TopSellingList({ categories, lang }: TopSellingListProps) {
  const isEn = lang === "en";
  const styles = ["pine", "orange", "teal"];
  const max = Math.max(...categories.map((c) => c.count), 1);

  return (
    <div className="ui-card">
      <div className="ui-card-header">
        <div className="ui-card-title-group">
          <h2>{isEn ? "Top Selling Products" : "Top Selling Products"}</h2>
          <p>{isEn ? "Most popular categories" : "Kategori paling diminati"}</p>
        </div>
        <button type="button" className="btn-card-action-icon">
          •••
        </button>
      </div>

      <div className="top-selling-list" id="topSellingContainer">
        {categories.length === 0 ? (
          <div
            style={{
              textAlign: "center",
              color: "var(--text-muted, #737D78)",
              fontSize: 12,
              padding: "20px 0",
            }}
          >
            {isEn ? "No category sales data yet." : "Belum ada data penjualan kategori."}
          </div>
        ) : (
          categories.slice(0, 4).map((cat, idx) => {
            const theme = styles[idx % styles.length];
            const pct = Math.min(100, Math.round((cat.count / max) * 95));

            return (
              <div className="selling-bar-row" key={cat.id}>
                <div className="selling-bar-label">
                  <span>{cat.name}</span>
                  <span className={`selling-bar-badge ${theme}`}>
                    {cat.count} {isEn ? "items" : "item"}
                  </span>
                </div>
                <div className="selling-bar-track">
                  <div
                    className={`selling-bar-fill ${theme}`}
                    style={{ width: `${pct}%` }}
                  ></div>
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}
