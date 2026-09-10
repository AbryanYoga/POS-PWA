"use client";

import React, { useState, useEffect, useCallback } from "react";
import type { Language } from "@/lib/translations";
import type { AnalyticsData, SwotItem, HourlyDistribution } from "@/lib/analytics";
import { computeAnalytics } from "@/lib/analytics";
import { useToast } from "@/components/ui/Toast";
import { formatRupiah } from "@/lib/utils";

interface Props {
  lang: Language;
  kodeToko: string;
}

// ── Small helpers ─────────────────────────────────────────────────────────────
function ScoreArc({ score }: { score: number }) {
  // SVG semi-circle gauge
  const r = 70;
  const cx = 90;
  const cy = 90;
  const circumference = Math.PI * r; // semi-circle
  const dashOffset = circumference - (score / 100) * circumference;

  const getColor = (s: number) => {
    if (s >= 85) return "#10B981";
    if (s >= 70) return "#22C55E";
    if (s >= 55) return "#F59E0B";
    if (s >= 35) return "#F97316";
    return "#EF4444";
  };

  return (
    <svg viewBox="0 0 180 100" width="180" height="100">
      {/* Track */}
      <path
        d={`M ${cx - r} ${cy} A ${r} ${r} 0 0 1 ${cx + r} ${cy}`}
        fill="none"
        stroke="#E4E1D8"
        strokeWidth="14"
        strokeLinecap="round"
      />
      {/* Fill */}
      <path
        d={`M ${cx - r} ${cy} A ${r} ${r} 0 0 1 ${cx + r} ${cy}`}
        fill="none"
        stroke={getColor(score)}
        strokeWidth="14"
        strokeLinecap="round"
        strokeDasharray={`${circumference}`}
        strokeDashoffset={`${dashOffset}`}
        style={{ transition: "stroke-dashoffset 1s ease, stroke 0.5s" }}
      />
      {/* Score text */}
      <text x={cx} y={cy - 14} textAnchor="middle" fontSize="32" fontWeight="700" fill="#141A17">
        {score}
      </text>
      <text x={cx} y={cy} textAnchor="middle" fontSize="11" fill="#737D78" fontWeight="600">
        / 100
      </text>
    </svg>
  );
}

function SwotCard({ items, type }: { items: SwotItem[]; type: SwotItem["type"] }) {
  const CONFIG: Record<SwotItem["type"], { label: string; icon: string; bg: string; border: string; color: string }> = {
    strength: { label: "Kekuatan", icon: "💪", bg: "#ECFDF5", border: "#6EE7B7", color: "#059669" },
    weakness: { label: "Kelemahan", icon: "⚠️", bg: "#FEF2F2", border: "#FCA5A5", color: "#DC2626" },
    opportunity: { label: "Peluang", icon: "🚀", bg: "#EFF6FF", border: "#93C5FD", color: "#2563EB" },
    threat: { label: "Ancaman", icon: "🛡️", bg: "#FFFBEB", border: "#FCD34D", color: "#D97706" },
  };
  const cfg = CONFIG[type];
  const filtered = items.filter((s) => s.type === type);

  return (
    <div className="analytics-swot-card" style={{ background: cfg.bg, borderColor: cfg.border }}>
      <div className="analytics-swot-card-header" style={{ color: cfg.color }}>
        <span>{cfg.icon}</span>
        <strong>{cfg.label}</strong>
        <span className="analytics-swot-count">{filtered.length}</span>
      </div>
      <div className="analytics-swot-items">
        {filtered.map((item, i) => (
          <div key={i} className="analytics-swot-item">
            <div className="analytics-swot-item-title" style={{ color: cfg.color }}>{item.title}</div>
            <div className="analytics-swot-item-desc">{item.description}</div>
            {item.metric && (
              <div className="analytics-swot-metric" style={{ color: cfg.color }}>{item.metric}</div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

function HeatmapBar({ data }: { data: HourlyDistribution[] }) {
  const maxCount = Math.max(...data.map((d) => d.count), 1);
  return (
    <div className="analytics-heatmap">
      {data.map((d) => {
        const intensity = d.count / maxCount;
        const alpha = 0.08 + intensity * 0.85;
        const bg = `rgba(99, 102, 241, ${alpha})`;
        const isPeak = d.count === Math.max(...data.map((x) => x.count)) && d.count > 0;
        return (
          <div key={d.hour} className="analytics-heatmap-col" title={`${d.label}: ${d.count} transaksi`}>
            <div
              className="analytics-heatmap-bar"
              style={{
                height: `${Math.max(4, Math.round(intensity * 80))}px`,
                background: isPeak ? "#6366F1" : bg,
                boxShadow: isPeak ? "0 0 8px rgba(99,102,241,0.5)" : "none",
              }}
            />
            {d.hour % 4 === 0 && (
              <div className="analytics-heatmap-label">{d.label}</div>
            )}
          </div>
        );
      })}
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
export function AnalyticsTab({ lang, kodeToko }: Props) {
  const { showToast } = useToast();
  const [data, setData] = useState<AnalyticsData | null>(null);
  const [loading, setLoading] = useState(true);
  const [lastRefresh, setLastRefresh] = useState<string>("");

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const result = await computeAnalytics(kodeToko);
      setData(result);
      setLastRefresh(result.generatedAt);
    } catch (err) {
      showToast("Gagal memuat data analytics.", "error");
    } finally {
      setLoading(false);
    }
  }, [kodeToko, showToast]);

  useEffect(() => {
    load();
  }, [load]);

  if (loading || !data) {
    return (
      <div className="analytics-loading">
        <div className="analytics-spinner" />
        <p>Menghitung analytics dari data transaksi...</p>
        <small>Mohon tunggu, ini mungkin memerlukan beberapa detik</small>
      </div>
    );
  }

  const { kpi, healthScore, swot, hourlyDistribution, categoryBreakdown } = data;

  const isEn = lang === "en";
  const pctChange = kpi.revenue7dPctChange;
  const pctLabel =
    pctChange === null
      ? (isEn ? "Data belum cukup" : "Data belum cukup")
      : pctChange >= 0
      ? `+${pctChange.toFixed(1)}% vs minggu lalu`
      : `${pctChange.toFixed(1)}% vs minggu lalu`;
  const pctColor = pctChange === null ? "#737D78" : pctChange >= 0 ? "#059669" : "#DC2626";

  return (
    <div className="analytics-tab">
      {/* ── Header ────────────────────────────────────────────────────── */}
      <div className="tab-section-header">
        <div>
          <h2 className="tab-section-title">Analytics & Business Intelligence</h2>
          <p className="tab-section-subtitle">
            Diperbarui: {lastRefresh} · Data 30 hari terakhir (batas WIB)
          </p>
        </div>
        <button
          type="button"
          className="analytics-refresh-btn"
          onClick={load}
          disabled={loading}
          id="btnRefreshAnalytics"
        >
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
            <polyline points="23 4 23 10 17 10" />
            <polyline points="1 20 1 14 7 14" />
            <path d="M3.51 9a9 9 0 0 1 14.85-3.36L23 10M1 14l4.64 4.36A9 9 0 0 0 20.49 15" />
          </svg>
          Hitung Ulang
        </button>
      </div>

      {/* ── ROW 1: Health Score + KPI Cards ───────────────────────────── */}
      <div className="analytics-top-row">
        {/* Health Score Card */}
        <div className="analytics-health-card">
          <div className="analytics-health-header">
            <span className="analytics-health-title">Business Health Score</span>
            <span className="analytics-health-badge" style={{ background: healthScore.color + "22", color: healthScore.color, border: `1px solid ${healthScore.color}44` }}>
              {healthScore.label}
            </span>
          </div>
          <div className="analytics-health-gauge">
            <ScoreArc score={healthScore.score} />
          </div>
          <div className="analytics-health-components">
            {[
              { label: "Revenue Growth", val: healthScore.components.revenueGrowth, max: 25 },
              { label: "Gross Margin", val: healthScore.components.margin, max: 25 },
              { label: "Frekuensi Transaksi", val: healthScore.components.txFrequency, max: 25 },
              { label: "Kesehatan Stok", val: healthScore.components.stockHealth, max: 25 },
            ].map((c) => (
              <div key={c.label} className="analytics-health-row">
                <span className="analytics-health-row-label">{c.label}</span>
                <div className="analytics-health-row-bar">
                  <div
                    className="analytics-health-row-fill"
                    style={{ width: `${(c.val / c.max) * 100}%`, background: healthScore.color }}
                  />
                </div>
                <span className="analytics-health-row-val">{c.val}/{c.max}</span>
              </div>
            ))}
          </div>
        </div>

        {/* KPI Grid */}
        <div className="analytics-kpi-grid">
          {[
            {
              label: "Revenue 30 Hari",
              value: formatRupiah(kpi.revenue30d),
              sub: `Hari ini: ${formatRupiah(kpi.revenueToday)}`,
              icon: "💰",
              color: "#059669",
            },
            {
              label: "Revenue 7 Hari",
              value: formatRupiah(kpi.revenue7d),
              sub: pctLabel,
              subColor: pctColor,
              icon: "📈",
              color: pctChange !== null && pctChange < 0 ? "#DC2626" : "#3B82F6",
            },
            {
              label: "Average Order Value",
              value: formatRupiah(kpi.aov),
              sub: `${kpi.txCount30d} transaksi / 30 hari`,
              icon: "🛒",
              color: "#8B5CF6",
            },
            {
              label: "Gross Margin",
              value: `${kpi.grossMarginPct.toFixed(1)}%`,
              sub: `Laba kotor: ${formatRupiah(kpi.grossProfit)}`,
              icon: "📊",
              color: kpi.grossMarginPct >= 30 ? "#059669" : "#F59E0B",
            },
            {
              label: "Net Profit 30 Hari",
              value: formatRupiah(kpi.netProfit30d),
              sub: `Pengeluaran: ${formatRupiah(kpi.totalExpenses30d)}`,
              icon: "💵",
              color: kpi.netProfit30d >= 0 ? "#059669" : "#DC2626",
            },
            {
              label: "Jam Puncak Transaksi",
              value: `${String(kpi.peakHour).padStart(2, "0")}:00`,
              sub: `${kpi.txPerDay.toFixed(1)} transaksi/hari rata-rata`,
              icon: "⏰",
              color: "#F59E0B",
            },
          ].map((card, i) => (
            <div key={i} className="analytics-kpi-card" id={`kpiCard_${i}`}>
              <div className="analytics-kpi-icon" style={{ background: card.color + "18" }}>
                <span>{card.icon}</span>
              </div>
              <div className="analytics-kpi-info">
                <div className="analytics-kpi-label">{card.label}</div>
                <div className="analytics-kpi-value" style={{ color: card.color }}>{card.value}</div>
                {card.sub && (
                  <div className="analytics-kpi-sub" style={card.subColor ? { color: card.subColor, fontWeight: 700 } : {}}>
                    {card.sub}
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* ── ROW 2: SWOT ───────────────────────────────────────────────── */}
      <div className="analytics-section">
        <h3 className="analytics-section-title">Analisis SWOT Otomatis</h3>
        <p className="analytics-section-sub">Dihasilkan dari data transaksi aktual — diperbarui setiap kali halaman dimuat</p>
        <div className="analytics-swot-grid">
          <SwotCard items={swot} type="strength" />
          <SwotCard items={swot} type="weakness" />
          <SwotCard items={swot} type="opportunity" />
          <SwotCard items={swot} type="threat" />
        </div>
      </div>

      {/* ── ROW 3: Hourly + Category ───────────────────────────────────── */}
      <div className="analytics-bottom-row">
        {/* Distribusi Per Jam */}
        <div className="analytics-card">
          <div className="analytics-card-header">
            <div className="analytics-card-title">Distribusi Transaksi Per Jam (WIB)</div>
            <div className="analytics-card-sub">30 hari terakhir · jam {String(kpi.peakHour).padStart(2,"0")}:00 adalah jam paling ramai</div>
          </div>
          <div className="analytics-card-body">
            <HeatmapBar data={hourlyDistribution} />
            <div className="analytics-heatmap-legend">
              <span style={{ color: "#737D78", fontSize: "12px" }}>Lebih sepi</span>
              <div className="analytics-heatmap-legend-bar" />
              <span style={{ color: "#6366F1", fontSize: "12px", fontWeight: 700 }}>Lebih ramai</span>
            </div>
          </div>
        </div>

        {/* Top 5 Kategori */}
        <div className="analytics-card">
          <div className="analytics-card-header">
            <div className="analytics-card-title">Top 5 Kategori by Revenue</div>
            <div className="analytics-card-sub">30 hari terakhir</div>
          </div>
          <div className="analytics-card-body">
            {categoryBreakdown.length === 0 ? (
              <div className="analytics-empty">Belum ada data transaksi.</div>
            ) : (
              <div className="analytics-cat-list">
                {categoryBreakdown.map((cat, i) => (
                  <div key={i} className="analytics-cat-row">
                    <div className="analytics-cat-rank">#{i + 1}</div>
                    <div className="analytics-cat-info">
                      <div className="analytics-cat-name">{cat.categoryName}</div>
                      <div className="analytics-cat-bar-wrap">
                        <div
                          className="analytics-cat-bar"
                          style={{
                            width: `${cat.share}%`,
                            background: `hsl(${220 + i * 25}, 80%, ${55 - i * 5}%)`,
                          }}
                        />
                      </div>
                    </div>
                    <div className="analytics-cat-right">
                      <div className="analytics-cat-revenue">{formatRupiah(cat.revenue)}</div>
                      <div className="analytics-cat-share">{cat.share}%</div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* ── Stok Health Summary ────────────────────────────────────────── */}
      <div className="analytics-stock-row">
        <div className="analytics-stock-stat" style={{ borderColor: kpi.lowStokCount > 10 ? "#EF4444" : "#E4E1D8" }}>
          <div className="analytics-stock-num" style={{ color: kpi.lowStokCount > 10 ? "#EF4444" : "#141A17" }}>
            {kpi.lowStokCount}
          </div>
          <div className="analytics-stock-label">Produk Stok Kritis (≤5)</div>
        </div>
        <div className="analytics-stock-stat">
          <div className="analytics-stock-num">{kpi.totalStokAktif.toLocaleString("id-ID")}</div>
          <div className="analytics-stock-label">Total Unit Stok Aktif</div>
        </div>
        <div className="analytics-stock-stat">
          <div className="analytics-stock-num" style={{ color: kpi.netProfit30d >= 0 ? "#059669" : "#DC2626" }}>
            {formatRupiah(kpi.netProfit30d)}
          </div>
          <div className="analytics-stock-label">Net Profit 30 Hari</div>
        </div>
        <div className="analytics-stock-stat">
          <div className="analytics-stock-num">{kpi.txPerDay.toFixed(1)}</div>
          <div className="analytics-stock-label">Transaksi/Hari (rata-rata)</div>
        </div>
      </div>
    </div>
  );
}
