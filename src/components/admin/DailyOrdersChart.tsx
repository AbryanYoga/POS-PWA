"use client";

import React, { useState } from "react";
import type { DailyTrendPoint } from "@/lib/actions/dashboard-actions";
import type { Language } from "@/lib/translations";

interface DailyOrdersChartProps {
  data: DailyTrendPoint[];
  todayOrders: number;
  lang: Language;
  onRefresh?: () => void;
}

export function DailyOrdersChart({
  data,
  todayOrders,
  lang,
  onRefresh,
}: DailyOrdersChartProps) {
  const isEn = lang === "en";
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);

  const dayNamesID = ["Sen", "Sel", "Rab", "Kam", "Jum", "Sab", "Min"];
  const dayNamesEN = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];
  const dayNames = isEn ? dayNamesEN : dayNamesID;

  const defaultDays: DailyTrendPoint[] = dayNames.map((name, i) => ({
    label: name,
    dateStr: "",
    count: [4, 8, 6, 12, 18, 24, todayOrders || 15][i],
    total: 100000 * (i + 1),
  }));

  const chartData = data && data.length >= 7 ? data : defaultDays;

  const counts = chartData.map((d) => Number(d.count) || 0);
  const maxCount = Math.max(
    10,
    Math.ceil(Math.max(...counts, todayOrders || 0) * 1.3)
  );

  const svgWidth = 600;
  const svgHeight = 185;
  const padLeft = 44;
  const padRight = 32;
  const padTop = 32;
  const padBottom = 38;
  const plotWidth = svgWidth - padLeft - padRight;
  const plotHeight = svgHeight - padTop - padBottom;

  const points = chartData.map((d, i) => {
    const x = padLeft + i * (plotWidth / (chartData.length - 1));
    const val = Number(d.count) || 0;
    const y = padTop + plotHeight - (val / maxCount) * plotHeight;
    return {
      x,
      y,
      val,
      label: d.label || "",
      dateStr: d.dateStr || "",
      total: d.total || 0,
    };
  });

  // Smooth Cubic Bezier Spline
  function getSmoothSpline(pts: typeof points) {
    if (!pts || pts.length === 0) return "";
    let d = `M ${pts[0].x.toFixed(1)} ${pts[0].y.toFixed(1)}`;
    for (let i = 0; i < pts.length - 1; i++) {
      const p0 = pts[i === 0 ? i : i - 1];
      const p1 = pts[i];
      const p2 = pts[i + 1];
      const p3 = pts[i + 2 < pts.length ? i + 2 : i + 1];

      const cp1x = p1.x + (p2.x - p0.x) / 5.5;
      const cp1y = p1.y + (p2.y - p0.y) / 5.5;
      const cp2x = p2.x - (p3.x - p1.x) / 5.5;
      const cp2y = p2.y - (p3.y - p1.y) / 5.5;

      d += ` C ${cp1x.toFixed(1)} ${cp1y.toFixed(1)}, ${cp2x.toFixed(
        1
      )} ${cp2y.toFixed(1)}, ${p2.x.toFixed(1)} ${p2.y.toFixed(1)}`;
    }
    return d;
  }

  const linePath = getSmoothSpline(points);
  const areaBottomY = padTop + plotHeight;
  const areaPath = `${linePath} L ${points[points.length - 1].x.toFixed(
    1
  )} ${areaBottomY} L ${points[0].x.toFixed(1)} ${areaBottomY} Z`;

  const yTiers = [
    { val: maxCount, y: padTop },
    { val: Math.round(maxCount * 0.66), y: padTop + plotHeight * 0.34 },
    { val: Math.round(maxCount * 0.33), y: padTop + plotHeight * 0.67 },
    { val: 0, y: areaBottomY },
  ];

  const lastIdx = points.length - 1;

  const allZero = counts.every((c) => c === 0) && (todayOrders || 0) === 0;

  return (
    <div className="ui-card">
      <div className="ui-card-header">
        <div className="ui-card-title-group">
          <h2>{isEn ? "Daily Orders" : "Pesanan Harian"}</h2>
          <p>{isEn ? "Track order volume trends" : "Tren volume pesanan 7 hari"}</p>
        </div>
        <div
          className="auto-update-pill"
          id="btnRefreshChart"
          onClick={onRefresh}
          title={isEn ? "Refresh chart data" : "Muat ulang grafik"}
        >
          <svg
            width="13"
            height="13"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2.2"
          >
            <polyline points="23 4 23 10 17 10" />
            <path d="M20.49 15a9 9 0 1 1-2.12-9.36L23 10" />
          </svg>
          <span>{isEn ? "Auto Update" : "Pembaruan Otomatis"}</span>
        </div>
      </div>

      <div className="chart-box" id="dashboardDailyChartBox" style={{ position: "relative" }}>
        {allZero && (
          <div
            style={{
              position: "absolute",
              top: "35%",
              left: "50%",
              transform: "translate(-50%, -50%)",
              background: "rgba(255, 255, 255, 0.92)",
              backdropFilter: "blur(4px)",
              padding: "6px 14px",
              borderRadius: "20px",
              border: "1px dashed var(--border, #E4E1D8)",
              fontSize: "11.5px",
              color: "var(--text-muted, #737D78)",
              pointerEvents: "none",
              display: "flex",
              alignItems: "center",
              gap: "6px",
              boxShadow: "0 2px 8px rgba(0,0,0,0.04)",
              zIndex: 3,
            }}
          >
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <line x1="18" y1="20" x2="18" y2="10" />
              <line x1="12" y1="20" x2="12" y2="4" />
              <line x1="6" y1="20" x2="6" y2="14" />
            </svg>
            <span>{isEn ? "No order data yet for this period" : "Belum ada data penjualan 7 hari terakhir"}</span>
          </div>
        )}
        <svg
          viewBox={`0 0 ${svgWidth} ${svgHeight}`}
          width="100%"
          height="100%"
          xmlns="http://www.w3.org/2000/svg"
          preserveAspectRatio="none"
        >
          <defs>
            <linearGradient id="softChartGradient" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="var(--primary, #2B5D4F)" stopOpacity="0.22" />
              <stop offset="55%" stopColor="var(--primary, #2B5D4F)" stopOpacity="0.06" />
              <stop offset="100%" stopColor="var(--primary, #2B5D4F)" stopOpacity="0.0" />
            </linearGradient>
            <filter id="softChartGlow" x="-10%" y="-10%" width="120%" height="140%">
              <feDropShadow
                dx="0"
                dy="3"
                stdDeviation="3.5"
                floodColor="var(--primary, #2B5D4F)"
                floodOpacity="0.18"
              />
            </filter>
          </defs>

          {/* Gridlines */}
          {yTiers.map((t, idx) => (
            <text
              key={idx}
              x={padLeft - 10}
              y={(t.y + 3.5).toFixed(1)}
              fontFamily="var(--font-mono)"
              fontSize="9.5"
              fill="var(--text-muted, #737D78)"
              textAnchor="end"
              opacity="0.75"
            >
              {t.val}
            </text>
          ))}

          {/* Area & Line */}
          <path className="chart-area-fill" d={areaPath} fill="url(#softChartGradient)" />
          <path
            className="chart-line-spline"
            d={linePath}
            fill="none"
            stroke="var(--primary, #2B5D4F)"
            strokeWidth="2.75"
            strokeLinecap="round"
            strokeLinejoin="round"
            filter="url(#softChartGlow)"
          />

          {/* Points & Labels */}
          {points.map((pt, idx) => {
            const isToday = idx === lastIdx;
            const isHovered = hoveredIndex === idx;
            const displayCount = pt.val;
            const tipText = `${displayCount} ${isEn ? "Orders" : "Pesanan"}`;
            const tipW = 86;
            const tipH = 28;
            const tipX = Math.min(
              Math.max(pt.x - tipW / 2, padLeft),
              svgWidth - padRight - tipW
            );
            const tipY = Math.max(4, pt.y - tipH - 10);

            return (
              <g key={idx}>
                {/* Day Label */}
                <text
                  x={pt.x.toFixed(1)}
                  y={svgHeight - 12}
                  fontFamily="var(--font-body)"
                  fontSize="11"
                  fontWeight={isToday ? "700" : "500"}
                  fill={
                    isToday
                      ? "var(--primary, #2B5D4F)"
                      : "var(--text-muted, #737D78)"
                  }
                  textAnchor="middle"
                >
                  {pt.label}
                </text>

                {/* Point */}
                {isToday ? (
                  <>
                    <circle
                      cx={pt.x.toFixed(1)}
                      cy={pt.y.toFixed(1)}
                      r="10"
                      fill="var(--primary, #2B5D4F)"
                      fillOpacity="0.18"
                      className="chart-pulse-ring"
                    />
                    <circle
                      cx={pt.x.toFixed(1)}
                      cy={pt.y.toFixed(1)}
                      r="5"
                      fill="var(--primary, #2B5D4F)"
                      stroke="var(--bg-surface, #ffffff)"
                      strokeWidth="2.5"
                    />
                    <g className="chart-active-tooltip">
                      <rect
                        x={tipX}
                        y={tipY}
                        width={tipW}
                        height={tipH}
                        rx="6"
                        fill="var(--bg-surface, #ffffff)"
                        stroke="var(--border, #E4E1D8)"
                        strokeWidth="1"
                        filter="drop-shadow(0 2px 6px rgba(0,0,0,0.08))"
                      />
                      <text
                        x={tipX + tipW / 2}
                        y={tipY + 12}
                        fontFamily="var(--font-body)"
                        fontSize="8.5"
                        fontWeight="600"
                        fill="var(--text-muted, #737D78)"
                        textAnchor="middle"
                      >
                        {isEn ? "Today" : "Hari Ini"}
                      </text>
                      <text
                        x={tipX + tipW / 2}
                        y={tipY + 23}
                        fontFamily="var(--font-mono)"
                        fontSize="10"
                        fontWeight="700"
                        fill="var(--primary, #2B5D4F)"
                        textAnchor="middle"
                      >
                        {tipText}
                      </text>
                    </g>
                  </>
                ) : (
                  <>
                    <circle
                      className="chart-dot-point"
                      cx={pt.x.toFixed(1)}
                      cy={pt.y.toFixed(1)}
                      r={isHovered ? 6 : 3}
                      fill="var(--primary, #2B5D4F)"
                      stroke="var(--bg-surface, #ffffff)"
                      strokeWidth="1.5"
                      opacity={isHovered ? 1 : 0.8}
                      onMouseEnter={() => setHoveredIndex(idx)}
                      onMouseLeave={() => setHoveredIndex(null)}
                    />
                    {isHovered && (
                      <g className="chart-hover-tooltip">
                        <rect
                          x={tipX}
                          y={tipY}
                          width={tipW}
                          height={tipH}
                          rx="6"
                          fill="var(--bg-surface, #ffffff)"
                          stroke="var(--border, #E4E1D8)"
                          strokeWidth="1"
                          filter="drop-shadow(0 2px 6px rgba(0,0,0,0.08))"
                        />
                        <text
                          x={tipX + tipW / 2}
                          y={tipY + 12}
                          fontFamily="var(--font-body)"
                          fontSize="8.5"
                          fontWeight="600"
                          fill="var(--text-muted, #737D78)"
                          textAnchor="middle"
                        >
                          {pt.label}
                        </text>
                        <text
                          x={tipX + tipW / 2}
                          y={tipY + 23}
                          fontFamily="var(--font-mono)"
                          fontSize="10"
                          fontWeight="700"
                          fill="var(--primary, #2B5D4F)"
                          textAnchor="middle"
                        >
                          {tipText}
                        </text>
                      </g>
                    )}
                  </>
                )}
              </g>
            );
          })}
        </svg>
      </div>
    </div>
  );
}
