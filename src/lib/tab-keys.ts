/**
 * TAB_KEYS — konstanta tunggal yang di-share antara AdminSidebar dan AdminDashboardView.
 *
 * Gunakan SELALU konstanta ini, bukan string literal langsung, untuk menghindari
 * typo seperti "tabAnalytik" vs "tabAnalytics" yang menyebabkan tab tidak pernah tampil.
 *
 * @example
 * // Sidebar:
 * onClick={() => onSelectTab(TAB_KEYS.ANALYTICS)}
 *
 * // DashboardView:
 * {activeTab === TAB_KEYS.ANALYTICS && <AnalyticsTab />}
 */
export const TAB_KEYS = {
  DASHBOARD: "tabDashboard",
  RIWAYAT: "tabRiwayat",
  KATEGORI: "tabKategori",
  PRODUK: "tabProduk",
  LAPORAN: "tabLaporan",
  ANALYTICS: "tabAnalytics",
  KASIR_STAFF: "tabKasirStaff",
  PENGATURAN: "tabPengaturan",
} as const;

export type TabKey = (typeof TAB_KEYS)[keyof typeof TAB_KEYS];
