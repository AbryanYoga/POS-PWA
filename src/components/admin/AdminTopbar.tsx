"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import type { Language } from "@/lib/translations";
import type { NotificationItem } from "@/lib/actions/dashboard-actions";

interface AdminTopbarProps {
  lang: Language;
  onToggleLang: () => void;
  notifications: NotificationItem[];
  onClearNotifications: () => void;
  onExport: () => void;
}

export function AdminTopbar({
  lang,
  onToggleLang,
  notifications,
  onClearNotifications,
  onExport,
}: AdminTopbarProps) {
  const isEn = lang === "en";
  const [isNotifOpen, setIsNotifOpen] = useState(false);
  const [liveDate, setLiveDate] = useState("");

  useEffect(() => {
    const now = new Date();
    const locale = isEn ? "en-US" : "id-ID";
    const dateStr = now.toLocaleDateString(locale, {
      day: "numeric",
      month: "long",
      year: "numeric",
    });
    setLiveDate(dateStr);
  }, [isEn]);

  const hasUnread = notifications.length > 0;

  return (
    <header className="topbar">
      <div className="topbar-left">
        {/* Global Search */}
        <div className="search-box-wrap">
          <svg
            width="16"
            height="16"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <circle cx="11" cy="11" r="8" />
            <line x1="21" y1="21" x2="16.65" y2="16.65" />
          </svg>
          <input
            type="text"
            className="topbar-search-input"
            id="globalSearchInput"
            placeholder={
              isEn
                ? "Search menu, transactions, or cashier..."
                : "Cari menu, transaksi, atau kasir..."
            }
          />
        </div>

        {/* Export Button */}
        <button
          type="button"
          className="btn-topbar-action"
          id="btnExportTop"
          onClick={onExport}
          title={isEn ? "Export Report" : "Export Laporan"}
        >
          <svg
            width="14"
            height="14"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
          >
            <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
            <polyline points="7 10 12 15 17 10" />
            <line x1="12" y1="15" x2="12" y2="3" />
          </svg>
          <span>{isEn ? "Export" : "Export"}</span>
        </button>

        {/* Notifications */}
        <div className="notif-btn-wrapper">
          <button
            type="button"
            className="btn-topbar-action"
            id="btnNotifToggle"
            onClick={() => setIsNotifOpen((prev) => !prev)}
            title={isEn ? "Store Notifications" : "Notifikasi Toko"}
          >
            <svg
              width="14"
              height="14"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
            >
              <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9" />
              <path d="M13.73 21a2 2 0 0 1-3.46 0" />
            </svg>
            <span>{isEn ? "Notification" : "Notifikasi"}</span>
            {hasUnread && <span className="notif-badge-dot" id="notifBadgeDot"></span>}
          </button>

          {/* Notification Dropdown Panel */}
          <div className={`notif-panel-wrap ${isNotifOpen ? "open" : ""}`} id="notifPanel">
            <div className="notif-panel">
              <div className="notif-panel-header">
                <span className="notif-panel-title">
                  {isEn ? "Notifications" : "Notifikasi"}
                </span>
                {notifications.length > 0 && (
                  <button
                    type="button"
                    className="notif-panel-clear"
                    id="btnClearNotif"
                    onClick={onClearNotifications}
                  >
                    {isEn ? "Clear All" : "Hapus Semua"}
                  </button>
                )}
              </div>
              <div className="notif-panel-body" id="notifPanelBody">
                {notifications.length === 0 ? (
                  <div className="notif-empty">
                    {isEn ? "No new notifications." : "Tidak ada notifikasi baru."}
                  </div>
                ) : (
                  notifications.map((n) => (
                    <div className="notif-item" key={n.id}>
                      <div className={`notif-icon-wrap ${n.type}`}>
                        {n.type === "danger" ? (
                          <svg
                            width="16"
                            height="16"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="2"
                          >
                            <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z" />
                            <line x1="12" y1="9" x2="12" y2="13" />
                            <line x1="12" y1="17" x2="12.01" y2="17" />
                          </svg>
                        ) : (
                          <svg
                            width="16"
                            height="16"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="2"
                          >
                            <circle cx="12" cy="12" r="10" />
                            <line x1="12" y1="16" x2="12" y2="12" />
                            <line x1="12" y1="8" x2="12.01" y2="8" />
                          </svg>
                        )}
                      </div>
                      <div className="notif-text-group">
                        <div className="notif-text-title">{n.title}</div>
                        <div className="notif-text-sub">{n.message}</div>
                      </div>
                    </div>
                  ))
                )}
              </div>
              <div className="notif-panel-footer">
                {isEn ? "Updated just now" : "Diperbarui baru saja"}
              </div>
            </div>
          </div>
        </div>

        {/* Quick Language Toggle */}
        <button
          type="button"
          className="btn-topbar-action"
          id="btnQuickLangToggle"
          onClick={onToggleLang}
          title={isEn ? "Switch Language" : "Ganti Bahasa"}
          style={{ gap: 6 }}
        >
          <svg
            width="15"
            height="15"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.75"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <circle cx="12" cy="12" r="10" />
            <line x1="2" y1="12" x2="22" y2="12" />
            <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z" />
          </svg>
          <span
            id="quickLangBadge"
            style={{
              fontWeight: 700,
              fontSize: 11,
              background: "var(--primary-light, #EBF2EE)",
              color: "var(--primary, #2B5D4F)",
              padding: "1px 6px",
              borderRadius: 4,
            }}
          >
            {lang.toUpperCase()}
          </span>
        </button>
      </div>

      <div className="topbar-right">
        {/* Live Date Pill */}
        <div className="topbar-date-pill">
          <svg
            width="14"
            height="14"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
          >
            <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
            <line x1="16" y1="2" x2="16" y2="6" />
            <line x1="8" y1="2" x2="8" y2="6" />
            <line x1="3" y1="10" x2="21" y2="10" />
          </svg>
          <span id="topbarLiveDate">{liveDate}</span>
        </div>

        {/* As a Cashier Button */}
        <Link href="/cashier" className="btn-as-cashier">
          <svg
            width="15"
            height="15"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
          >
            <circle cx="9" cy="21" r="1" />
            <circle cx="20" cy="21" r="1" />
            <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6" />
          </svg>
          <span>{isEn ? "Open POS Cashier" : "Buka POS Kasir"}</span>
        </Link>
      </div>
    </header>
  );
}
