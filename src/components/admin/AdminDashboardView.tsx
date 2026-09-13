"use client";

import React, { useState, useEffect, useTransition } from "react";
import { AdminSidebar } from "./AdminSidebar";
import { AdminTopbar } from "./AdminTopbar";
import { KpiCard } from "./KpiCard";
import { DailyOrdersChart } from "./DailyOrdersChart";
import { TopSellingList } from "./TopSellingList";
import { RecentTransactionsList } from "./RecentTransactionsList";
import { PaymentMethodsBar } from "./PaymentMethodsBar";
import { LowStockAlert } from "./LowStockAlert";
import { TransactionsHistoryTab } from "./transactions/TransactionsHistoryTab";
import { ReportsTab } from "./reports/ReportsTab";
import { StaffManagementTab } from "./staff/StaffManagementTab";
import { SettingsTab } from "./settings/SettingsTab";
import { AnalyticsTab } from "./analytics/AnalyticsTab";
import { ProductsTab } from "./products/ProductsTab";
import { CategoriesTab } from "./categories/CategoriesTab";
import { useToast } from "@/components/ui/Toast";
import type { DashboardData } from "@/lib/actions/dashboard-actions";
import { getDashboardData } from "@/lib/actions/dashboard-actions";
import type { Language } from "@/lib/translations";
import { TAB_KEYS } from "@/lib/tab-keys";
import type { TabKey } from "@/lib/tab-keys";
import { useScrollReveal } from "@/hooks/useScrollReveal";

interface AdminDashboardViewProps {
  initialData: DashboardData;
}

export function AdminDashboardView({ initialData }: AdminDashboardViewProps) {
  const { showToast } = useToast();
  const [data, setData] = useState<DashboardData>(initialData);
  const [activeTab, setActiveTab] = useState<TabKey>(TAB_KEYS.DASHBOARD);
  const [collapsed, setCollapsed] = useState(false);
  const [lang, setLang] = useState<Language>("id");
  const [isPending, startTransition] = useTransition();

  // Scroll reveal — works on all tabs via MutationObserver
  useScrollReveal();

  const isEn = lang === "en";

  useEffect(() => {
    const savedLang = localStorage.getItem("pos_lang") as Language;
    if (savedLang === "en" || savedLang === "id") {
      setLang(savedLang);
    }
    const savedCollapsed = localStorage.getItem("pos_sidebar_collapsed") === "1";
    setCollapsed(savedCollapsed);

    // Restorasi tema dari localStorage (set oleh SettingsTab saat save)
    // Ini memastikan tema yang dipilih admin tetap aktif di setiap load halaman admin
    const savedPrimary = localStorage.getItem("pos_theme_primary");
    const savedHover = localStorage.getItem("pos_theme_hover");
    const savedLight = localStorage.getItem("pos_theme_light");
    if (savedPrimary && savedHover && savedLight) {
      const root = document.documentElement;
      root.style.setProperty("--primary", savedPrimary);
      root.style.setProperty("--primary-hover", savedHover);
      root.style.setProperty("--primary-light", savedLight);
    }
  }, []);


  const handleToggleCollapse = () => {
    setCollapsed((prev) => {
      const next = !prev;
      localStorage.setItem("pos_sidebar_collapsed", next ? "1" : "0");
      return next;
    });
  };

  // Cast string → TabKey (safe because AdminSidebar only emits TAB_KEYS values)
  const handleSelectTab = (tab: string) => {
    setActiveTab(tab as TabKey);
  };

  const handleToggleLang = () => {
    const nextLang: Language = lang === "id" ? "en" : "id";
    setLang(nextLang);
    localStorage.setItem("pos_lang", nextLang);
    showToast(
      nextLang === "en"
        ? "Language switched to English"
        : "Bahasa diubah ke Bahasa Indonesia",
      "info"
    );
  };

  const handleRefresh = () => {
    startTransition(async () => {
      const res = await getDashboardData();
      if (res.success && res.data) {
        setData(res.data);
        showToast(
          isEn ? "Dashboard metrics updated!" : "Metrik dashboard diperbarui!",
          "success"
        );
      } else {
        showToast(
          isEn ? "Failed to refresh dashboard." : "Gagal memuat ulang data.",
          "error"
        );
      }
    });
  };

  const handleClearNotifications = () => {
    setData((prev) => ({ ...prev, notifications: [] }));
    showToast(
      isEn ? "Notifications cleared." : "Notifikasi dihapus.",
      "info"
    );
  };

  const handleExport = () => {
    showToast(
      isEn
        ? "Preparing report export CSV..."
        : "Menyiapkan file ekspor laporan CSV...",
      "info"
    );
    // Simple CSV generator for demo
    const rows = [
      ["No Transaksi", "Kasir", "Metode", "Total", "Status", "Waktu"],
      ...data.recentTransactions.map((tx) => [
        tx.noTransaksi,
        tx.kasir,
        tx.metode,
        tx.total.toString(),
        tx.status,
        tx.createdAt,
      ]),
    ];
    const csvContent =
      "data:text/csv;charset=utf-8," +
      rows.map((e) => e.join(",")).join("\n");
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `laporan_transaksi_${data.user.kodeToko}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const formatRupiah = (num: number) => {
    return "Rp " + Number(num || 0).toLocaleString("id-ID");
  };

  return (
    <div className="app-shell">
      {/* 1. SIDEBAR */}
      <AdminSidebar
        collapsed={collapsed}
        onToggleCollapse={handleToggleCollapse}
        activeTab={activeTab}
        onSelectTab={handleSelectTab}
        storeName={data.user.namaToko}
        userName={data.user.namaLengkap}
        userEmail={data.user.email}
        lang={lang}
      />

      {/* 2. MAIN VIEWPORT */}
      <div className="main-viewport">
        <AdminTopbar
          lang={lang}
          onToggleLang={handleToggleLang}
          notifications={data.notifications}
          onClearNotifications={handleClearNotifications}
          onExport={handleExport}
        />

        {/* 3. CONTENT BODY */}
        <main className="content-body">
          {activeTab === "tabDashboard" && (
            <section className="tab-pane active" id="tabDashboard">
              {/* Header Bar */}
              <div className="dash-header-bar" data-reveal="up" data-reveal-delay="0">
                <div className="dash-welcome-text">
                  <h1 id="dashGreetingTitle">
                    {isEn ? "Welcome to" : "Selamat Datang di"}{" "}
                    {data.user.namaToko || "BrightPOS"}
                  </h1>
                  <p>
                    {isEn
                      ? "Clear overview of your store performance"
                      : "Ringkasan komprehensif performa dan kesehatan toko Anda"}
                  </p>
                </div>
                <div className="dash-header-actions">
                  <div className="outlet-badge-pill" id="dashOutletPill">
                    <svg
                      width="14"
                      height="14"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                    >
                      <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
                      <polyline points="9 22 9 12 15 12 15 22" />
                    </svg>
                    <span id="dashKodeTokoBadge">
                      Outlet: {data.user.kodeToko}
                    </span>
                  </div>
                </div>
              </div>

              {/* 4 Top KPI Cards */}
              <div className="kpi-cards-grid">
                {/* 1. Total Income */}
                <div className="admin-card-anim anim-delay-0">
                <KpiCard
                  title="Total Income"
                  value={formatRupiah(data.metrics.totalIncome)}
                  trendPct={data.metrics.incomeTrendPct}
                  trendLabel={isEn ? "this week" : "minggu ini"}
                  theme="green"
                  icon={
                    <svg
                      width="16"
                      height="16"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                    >
                      <rect x="2" y="6" width="20" height="12" rx="2" />
                      <circle cx="12" cy="12" r="2" />
                    </svg>
                  }
                />
                </div>

                {/* 2. Total Expense */}
                <div className="admin-card-anim anim-delay-1">
                <KpiCard
                  title="Total Expense"
                  value={formatRupiah(data.metrics.totalExpense)}
                  trendPct={data.metrics.expenseTrendPct}
                  trendLabel={isEn ? "this week" : "minggu ini"}
                  theme="orange"
                  icon={
                    <svg
                      width="16"
                      height="16"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                    >
                      <line x1="7" y1="17" x2="17" y2="7" />
                      <polyline points="7 7 17 7 17 17" />
                    </svg>
                  }
                />
                </div>

                {/* 3. Net Profit */}
                <div className="admin-card-anim anim-delay-2">
                <KpiCard
                  title="Net Profit"
                  value={formatRupiah(data.metrics.netProfit)}
                  trendPct={data.metrics.profitTrendPct}
                  trendLabel={isEn ? "this week" : "minggu ini"}
                  theme="teal"
                  icon={
                    <svg
                      width="16"
                      height="16"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                    >
                      <polyline points="20 6 9 17 4 12" />
                    </svg>
                  }
                />
                </div>

                {/* 4. Total Orders */}
                <div className="admin-card-anim anim-delay-3">
                <KpiCard
                  title="Total Orders"
                  value={data.metrics.totalOrders}
                  trendPct={data.metrics.ordersTrendPct}
                  trendLabel={isEn ? "this week" : "minggu ini"}
                  theme="blue"
                  icon={
                    <svg
                      width="16"
                      height="16"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                    >
                      <circle cx="9" cy="21" r="1" />
                      <circle cx="20" cy="21" r="1" />
                      <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6" />
                    </svg>
                  }
                />
                </div>
              </div>

              {/* Main 2-Column Grid (Left 68% / Right 32%) */}
              <div className="dash-main-grid">
                {/* LEFT COLUMN */}
                <div className="dash-left-column">
                  {/* Daily Orders Curved SVG Chart */}
                  <div className="admin-card-anim anim-delay-4">
                    <DailyOrdersChart
                      data={data.dailyTrend}
                      todayOrders={data.metrics.totalOrders}
                      lang={lang}
                      onRefresh={handleRefresh}
                    />
                  </div>

                  {/* Sub Grid: Top Selling & Recent Transactions */}
                  <div className="dash-sub-grid">
                    <div className="admin-card-anim anim-delay-5">
                      <TopSellingList
                        categories={data.topCategories}
                        lang={lang}
                      />
                    </div>
                    <div className="admin-card-anim anim-delay-6">
                      <RecentTransactionsList
                        transactions={data.recentTransactions}
                        lang={lang}
                      />
                    </div>
                  </div>
                </div>

                {/* RIGHT COLUMN */}
                <div className="dash-right-column">
                  {/* Active Staff */}
                  <div className="ui-card kpi-icon-card admin-card-anim anim-delay-4">
                    <div className="kpi-big-icon">
                      <svg
                        width="22"
                        height="22"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                      >
                        <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
                        <circle cx="9" cy="7" r="4" />
                        <path d="M23 21v-2a4 4 0 0 0-3-3.87" />
                        <path d="M16 3.13a4 4 0 0 1 0 7.75" />
                      </svg>
                    </div>
                    <div className="kpi-icon-details">
                      <div className="kpi-main-number" id="dashActiveStaffText">
                        {data.metrics.activeStaffCount}{" "}
                        {isEn ? "Staff" : "Staff"}
                      </div>
                      <div className="kpi-sub-text">
                        {isEn ? "Currently on duty" : "Sedang bertugas"}
                      </div>
                    </div>
                  </div>

                  {/* Total Products */}
                  <div className="ui-card kpi-icon-card admin-card-anim anim-delay-5">
                    <div
                      className="kpi-big-icon"
                      style={{
                        background: "var(--secondary-light, #EBF0F7)",
                        color: "var(--secondary, #2B4C7E)",
                      }}
                    >
                      <svg
                        width="22"
                        height="22"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                      >
                        <path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z" />
                      </svg>
                    </div>
                    <div className="kpi-icon-details">
                      <div className="kpi-main-number" id="dashTotalItemsText">
                        {data.metrics.totalProduk} {isEn ? "Items" : "Items"}
                      </div>
                      <div className="kpi-sub-text">
                        {isEn ? "Across all categories" : "Di semua kategori"}
                      </div>
                    </div>
                  </div>

                  {/* Payment Methods Breakdown */}
                  <div className="admin-card-anim anim-delay-6">
                  <PaymentMethodsBar
                    qrisCount={data.paymentBreakdown.countQris}
                    cashCount={data.paymentBreakdown.countCash}
                    lang={lang}
                  />
                  </div>

                  {/* Low Stock Alert */}
                  <div className="admin-card-anim anim-delay-7">
                  <LowStockAlert
                    items={data.lowStockProducts}
                    lang={lang}
                  />
                  </div>
                </div>
              </div>
            </section>
          )}

          {/* Tab 2: Riwayat Transaksi */}
          {activeTab === TAB_KEYS.RIWAYAT && (
            <section className="dashboard-content-body" data-reveal="up" data-reveal-delay="0">
              <TransactionsHistoryTab lang={lang} />
            </section>
          )}

          {/* Tab 3: Laporan Penjualan & Keuangan */}
          {activeTab === TAB_KEYS.LAPORAN && (
            <section className="dashboard-content-body" data-reveal="up" data-reveal-delay="0">
              <ReportsTab lang={lang} />
            </section>
          )}

          {/* Tab 4: Katalog Produk */}
          {activeTab === TAB_KEYS.PRODUK && (
            <section className="dashboard-content-body" data-reveal="up" data-reveal-delay="0">
              <ProductsTab lang={lang} />
            </section>
          )}

          {/* Tab 5: Kategori Produk */}
          {activeTab === TAB_KEYS.KATEGORI && (
            <section className="dashboard-content-body" data-reveal="up" data-reveal-delay="0">
              <CategoriesTab lang={lang} />
            </section>
          )}

          {/* Tab 6: User Management / Kasir & Staff */}
          {activeTab === TAB_KEYS.KASIR_STAFF && (
            <section className="dashboard-content-body" data-reveal="up" data-reveal-delay="0">
              <StaffManagementTab lang={lang} />
            </section>
          )}

          {/* Tab 7: Settings */}
          {activeTab === TAB_KEYS.PENGATURAN && (
            <section className="dashboard-content-body" data-reveal="up" data-reveal-delay="0">
              <SettingsTab lang={lang} />
            </section>
          )}

          {/* Tab 8: Analytics & Business Intelligence — FIX: was "tabAnalytik" (typo), now TAB_KEYS.ANALYTICS */}
          {activeTab === TAB_KEYS.ANALYTICS && (
            <section className="dashboard-content-body" data-reveal="up" data-reveal-delay="0">
              <AnalyticsTab lang={lang} kodeToko={data.user?.kodeToko ?? ""} />
            </section>
          )}

          {/* Fallback placeholder for any unrecognised tab key */}
          {activeTab !== TAB_KEYS.DASHBOARD &&
            activeTab !== TAB_KEYS.RIWAYAT &&
            activeTab !== TAB_KEYS.LAPORAN &&
            activeTab !== TAB_KEYS.PRODUK &&
            activeTab !== TAB_KEYS.KATEGORI &&
            activeTab !== TAB_KEYS.KASIR_STAFF &&
            activeTab !== TAB_KEYS.PENGATURAN &&
            activeTab !== TAB_KEYS.ANALYTICS && (
            <div className="ui-card p-8 text-center py-16">
              <h2 className="text-base font-bold font-heading mb-2 text-[#141A17]">
                Tab {(activeTab as string).replace("tab", "")} — Coming Soon
              </h2>
              <p className="text-xs text-[#737D78] max-w-md mx-auto mb-6">
                Modul ini akan tersedia pada fase migrasi berikutnya.
              </p>
              <button
                type="button"
                onClick={() => setActiveTab(TAB_KEYS.DASHBOARD)}
                className="btn-new-trx"
              >
                Kembali ke Overview Dashboard
              </button>
            </div>
          )}
        </main>
      </div>

      {/* Floating Scroll Controls with Smooth Scroll Animation */}
      <AdminScrollControls lang={lang} />
    </div>
  );
}

function AdminScrollControls({ lang }: { lang: Language }) {
  const [scrollPos, setScrollPos] = useState({ y: 0, max: 0, pct: 0 });
  const [showControls, setShowControls] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      const scrollY = window.scrollY || document.documentElement.scrollTop;
      const scrollHeight = document.documentElement.scrollHeight - window.innerHeight;
      const pct = scrollHeight > 0 ? Math.min(100, Math.round((scrollY / scrollHeight) * 100)) : 0;

      setScrollPos({ y: scrollY, max: scrollHeight, pct });
      setShowControls(scrollHeight > 120);
    };

    handleScroll();
    window.addEventListener("scroll", handleScroll, { passive: true });
    window.addEventListener("resize", handleScroll);

    const observer = new ResizeObserver(() => {
      handleScroll();
    });
    observer.observe(document.body);

    return () => {
      window.removeEventListener("scroll", handleScroll);
      window.removeEventListener("resize", handleScroll);
      observer.disconnect();
    };
  }, []);

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  const scrollToBottom = () => {
    window.scrollTo({
      top: document.documentElement.scrollHeight,
      behavior: "smooth",
    });
  };

  if (!showControls) return null;

  const isAtTop = scrollPos.y <= 60;
  const isAtBottom = scrollPos.y >= scrollPos.max - 60;

  return (
    <div
      className="admin-scroll-controls"
      id="adminScrollControls"
      role="navigation"
      aria-label="Scroll Navigation Controls"
    >
      {/* Scroll Up Button */}
      <button
        type="button"
        id="btnScrollToTop"
        className={`admin-scroll-btn up ${isAtTop ? "is-disabled" : "animate-attention"}`}
        onClick={scrollToTop}
        disabled={isAtTop}
        title={lang === "en" ? "Scroll to top" : "Scroll ke atas"}
        aria-label="Scroll to top"
      >
        <svg
          width="16"
          height="16"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2.5"
          strokeLinecap="round"
          strokeLinejoin="round"
          className="admin-scroll-arrow up"
        >
          <path d="M18 15l-6-6-6 6" />
        </svg>
      </button>

      {/* Indicator Track */}
      <div className="admin-scroll-indicator" title={`${scrollPos.pct}%`}>
        <span
          className="admin-scroll-indicator-bar"
          style={{ height: `${scrollPos.pct}%` }}
        />
      </div>

      {/* Scroll Down Button */}
      <button
        type="button"
        id="btnScrollToBottom"
        className={`admin-scroll-btn down ${isAtBottom ? "is-disabled" : "animate-attention"}`}
        onClick={scrollToBottom}
        disabled={isAtBottom}
        title={lang === "en" ? "Scroll to bottom" : "Scroll ke bawah"}
        aria-label="Scroll to bottom"
      >
        <svg
          width="16"
          height="16"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2.5"
          strokeLinecap="round"
          strokeLinejoin="round"
          className="admin-scroll-arrow down"
        >
          <path d="M6 9l6 6 6-6" />
        </svg>
      </button>
    </div>
  );
}
