"use client";

import React from "react";
import { logoutAction } from "@/lib/actions/auth-actions";
import type { Language } from "@/lib/translations";

interface AdminSidebarProps {
  collapsed: boolean;
  onToggleCollapse: () => void;
  activeTab: string;
  onSelectTab: (tab: string) => void;
  storeName: string;
  userName: string;
  userEmail: string;
  lang: Language;
}

export function AdminSidebar({
  collapsed,
  onToggleCollapse,
  activeTab,
  onSelectTab,
  storeName,
  userName,
  userEmail,
  lang,
}: AdminSidebarProps) {
  const isEn = lang === "en";
  const initials = (userName || "Admin").substring(0, 2).toUpperCase();

  return (
    <aside className={`sidebar ${collapsed ? "collapsed" : ""}`} id="mainSidebar">
      {/* Brand Header with Integrated Toggle */}
      <div className="sidebar-brand">
        <div className="sidebar-brand-left">
          <div className="sidebar-brand-icon">
            <svg
              width="20"
              height="20"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2.2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <circle cx="12" cy="12" r="9" />
              <path d="M12 3v18M3 12h18" />
            </svg>
          </div>
          <div className="sidebar-brand-text">
            <div className="brand-title" id="navStoreName" title={storeName}>
              {storeName || "BrightPOS"}
            </div>
            <div className="brand-sub">
              {isEn ? "Store Management System" : "Sistem Manajemen Toko"}
            </div>
          </div>
        </div>
        {/* Sidebar Toggle Button */}
        <button
          type="button"
          className="sidebar-toggle-btn"
          id="sidebarToggleBtn"
          onClick={onToggleCollapse}
          title={isEn ? "Collapse / Expand Menu" : "Kecilkan / Perbesar Menu"}
        >
          <svg
            width="14"
            height="14"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2.2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <polyline points="15 18 9 12 15 6" />
          </svg>
        </button>
      </div>

      {/* Navigation Menu Groups */}
      <div className="sidebar-menu">
        {/* Group 1: Main Menu */}
        <div className="menu-group">
          <div className="menu-group-label">{isEn ? "Main Menu" : "Main Menu"}</div>
          <button
            type="button"
            className={`nav-item-btn ${activeTab === "tabDashboard" ? "active" : ""}`}
            onClick={() => onSelectTab("tabDashboard")}
            data-tooltip="Overview"
          >
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
              <rect x="3" y="3" width="7" height="7" rx="1" />
              <rect x="14" y="3" width="7" height="7" rx="1" />
              <rect x="14" y="14" width="7" height="7" rx="1" />
              <rect x="3" y="14" width="7" height="7" rx="1" />
            </svg>
            <span>Overview</span>
          </button>
          <button
            type="button"
            className={`nav-item-btn ${activeTab === "tabRiwayat" ? "active" : ""}`}
            onClick={() => onSelectTab("tabRiwayat")}
            data-tooltip={isEn ? "Orders / Transactions" : "Orders / Transaksi"}
          >
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
              <circle cx="9" cy="21" r="1" />
              <circle cx="20" cy="21" r="1" />
              <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6" />
            </svg>
            <span>{isEn ? "Orders / Transactions" : "Orders / Transaksi"}</span>
          </button>
          <button
            type="button"
            className={`nav-item-btn ${activeTab === "tabKategori" ? "active" : ""}`}
            onClick={() => onSelectTab("tabKategori")}
            data-tooltip={isEn ? "Categories" : "Kategori Produk"}
          >
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
              <rect x="3" y="3" width="7" height="7" rx="1" />
              <rect x="14" y="3" width="7" height="7" rx="1" />
              <rect x="14" y="14" width="7" height="7" rx="1" />
              <rect x="3" y="14" width="7" height="7" rx="1" />
            </svg>
            <span>{isEn ? "Categories" : "Kategori Produk"}</span>
          </button>
        </div>

        {/* Group 2: Inventory */}
        <div className="menu-group">
          <div className="menu-group-label">{isEn ? "Inventory" : "Inventory"}</div>
          <button
            type="button"
            className={`nav-item-btn ${activeTab === "tabProduk" ? "active" : ""}`}
            onClick={() => onSelectTab("tabProduk")}
            data-tooltip={isEn ? "Products" : "Katalog Produk"}
          >
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
              <path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z" />
              <polyline points="3.27 6.96 12 12.01 20.73 6.96" />
              <line x1="12" y1="22.08" x2="12" y2="12" />
            </svg>
            <span>{isEn ? "Products" : "Katalog Produk"}</span>
          </button>
        </div>

        {/* Group 3: Report */}
        <div className="menu-group">
          <div className="menu-group-label">{isEn ? "Report & Analytics" : "Report & Analytics"}</div>
          <button
            type="button"
            className={`nav-item-btn ${activeTab === "tabLaporan" ? "active" : ""}`}
            onClick={() => onSelectTab("tabLaporan")}
            data-tooltip={isEn ? "Reporting" : "Laporan Penjualan"}
          >
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
              <line x1="18" y1="20" x2="18" y2="10" />
              <line x1="12" y1="20" x2="12" y2="4" />
              <line x1="6" y1="20" x2="6" y2="14" />
            </svg>
            <span>{isEn ? "Reporting" : "Laporan Penjualan"}</span>
          </button>
          <button
            type="button"
            className={`nav-item-btn ${activeTab === "tabAnalytics" ? "active" : ""}`}
            onClick={() => onSelectTab("tabAnalytics")}
            data-tooltip={isEn ? "Analytics & Insights" : "Analytics & Insights"}
          >
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
              <path d="M21.21 15.89A10 10 0 1 1 8 2.83" />
              <path d="M22 12A10 10 0 0 0 12 2v10z" />
            </svg>
            <span>Analytics & Insights</span>
          </button>
        </div>

        {/* Group 4: Settings */}
        <div className="menu-group">
          <div className="menu-group-label">{isEn ? "Settings" : "Settings"}</div>
          <button
            type="button"
            className={`nav-item-btn ${activeTab === "tabKasirStaff" ? "active" : ""}`}
            onClick={() => onSelectTab("tabKasirStaff")}
            data-tooltip={isEn ? "User Management" : "User Management"}
          >
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
              <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
              <circle cx="12" cy="7" r="4" />
            </svg>
            <span>{isEn ? "User Management" : "User Management"}</span>
          </button>
          <button
            type="button"
            className={`nav-item-btn ${activeTab === "tabPengaturan" ? "active" : ""}`}
            onClick={() => onSelectTab("tabPengaturan")}
            data-tooltip={isEn ? "Settings" : "Pengaturan"}
          >
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
              <circle cx="12" cy="12" r="3" />
              <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z" />
            </svg>
            <span>{isEn ? "Settings" : "Pengaturan"}</span>
          </button>
        </div>
      </div>

      {/* User Profile at Bottom of Sidebar */}
      <div className="sidebar-footer-profile">
        <div className="profile-info-group">
          <div className="profile-avatar-circle" id="userAvatarText">
            {initials}
          </div>
          <div className="profile-meta">
            <div className="profile-name" id="userProfileName" title={userName}>
              {userName}
            </div>
            <div className="profile-email" id="userProfileEmail" title={userEmail}>
              {userEmail}
            </div>
          </div>
        </div>
        <form action={logoutAction}>
          <button
            type="submit"
            className="btn-logout-icon"
            id="btnLogout"
            title={isEn ? "Logout from System" : "Keluar dari Sistem"}
          >
            <svg
              width="18"
              height="18"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
              <polyline points="16 17 21 12 16 7" />
              <line x1="21" y1="12" x2="9" y2="12" />
            </svg>
          </button>
        </form>
      </div>
    </aside>
  );
}
