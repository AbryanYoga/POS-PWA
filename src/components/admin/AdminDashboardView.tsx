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
import { useToast } from "@/components/ui/Toast";
import type { DashboardData } from "@/lib/actions/dashboard-actions";
import { getDashboardData } from "@/lib/actions/dashboard-actions";
import type { Language } from "@/lib/translations";
import "@/app/admin/admin.css";

interface AdminDashboardViewProps {
  initialData: DashboardData;
}

export function AdminDashboardView({ initialData }: AdminDashboardViewProps) {
  const { showToast } = useToast();
  const [data, setData] = useState<DashboardData>(initialData);
  const [activeTab, setActiveTab] = useState("tabDashboard");
  const [collapsed, setCollapsed] = useState(false);
  const [lang, setLang] = useState<Language>("id");
  const [isPending, startTransition] = useTransition();

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
        onSelectTab={setActiveTab}
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
              <div className="dash-header-bar">
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

                {/* 2. Total Expense */}
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

                {/* 3. Net Profit */}
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

                {/* 4. Total Orders */}
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

              {/* Main 2-Column Grid (Left 68% / Right 32%) */}
              <div className="dash-main-grid">
                {/* LEFT COLUMN */}
                <div className="dash-left-column">
                  {/* Daily Orders Curved SVG Chart */}
                  <DailyOrdersChart
                    data={data.dailyTrend}
                    todayOrders={data.metrics.totalOrders}
                    lang={lang}
                    onRefresh={handleRefresh}
                  />

                  {/* Sub Grid: Top Selling & Recent Transactions */}
                  <div className="dash-sub-grid">
                    <TopSellingList
                      categories={data.topCategories}
                      lang={lang}
                    />
                    <RecentTransactionsList
                      transactions={data.recentTransactions}
                      lang={lang}
                    />
                  </div>
                </div>

                {/* RIGHT COLUMN */}
                <div className="dash-right-column">
                  {/* Active Staff */}
                  <div className="ui-card kpi-icon-card">
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
                  <div className="ui-card kpi-icon-card">
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
                  <PaymentMethodsBar
                    qrisCount={data.paymentBreakdown.countQris}
                    cashCount={data.paymentBreakdown.countCash}
                    lang={lang}
                  />

                  {/* Low Stock Alert */}
                  <LowStockAlert
                    items={data.lowStockProducts}
                    lang={lang}
                  />
                </div>
              </div>
            </section>
          )}

          {/* Tab 2: Riwayat Transaksi */}
          {activeTab === "tabRiwayat" && (
            <section className="dashboard-content-body">
              <TransactionsHistoryTab lang={lang} />
            </section>
          )}

          {/* Tab 3: Laporan Penjualan & Keuangan */}
          {activeTab === "tabLaporan" && (
            <section className="dashboard-content-body">
              <ReportsTab lang={lang} />
            </section>
          )}

          {/* Tab 4: User Management / Kasir & Staff */}
          {activeTab === "tabKasirStaff" && (
            <section className="dashboard-content-body">
              <StaffManagementTab lang={lang} />
            </section>
          )}

          {/* Tab 5: Settings */}
          {activeTab === "tabPengaturan" && (
            <section className="dashboard-content-body">
              <SettingsTab lang={lang} />
            </section>
          )}

          {/* Tab 6: Analytics & Business Intelligence */}
          {activeTab === "tabAnalytik" && (
            <section className="dashboard-content-body">
              <AnalyticsTab lang={lang} kodeToko={data.user?.kodeToko ?? ""} />
            </section>
          )}

          {/* Placeholder for any other tabs not yet implemented */}
          {activeTab !== "tabDashboard" &&
            activeTab !== "tabRiwayat" &&
            activeTab !== "tabLaporan" &&
            activeTab !== "tabKasirStaff" &&
            activeTab !== "tabPengaturan" &&
            activeTab !== "tabAnalytik" && (
            <div className="ui-card p-8 text-center py-16">
              <h2 className="text-base font-bold font-heading mb-2 text-[#141A17]">
                Tab {activeTab.replace("tab", "")} — Coming Soon
              </h2>
              <p className="text-xs text-[#737D78] max-w-md mx-auto mb-6">
                Modul ini akan tersedia pada fase migrasi berikutnya.
              </p>
              <button
                type="button"
                onClick={() => setActiveTab("tabDashboard")}
                className="btn-new-trx"
              >
                Kembali ke Overview Dashboard
              </button>
            </div>
          )}
        </main>
      </div>
    </div>
  );
}
