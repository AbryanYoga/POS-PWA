"use client";

import React, { useState, useEffect, useTransition } from "react";
import {
  getSalesReportDataAction,
  addExpenseAction,
  deleteExpenseAction,
  type SalesReportData,
  type SalesReportParams,
} from "@/lib/actions/report-actions";
import { useToast } from "@/components/ui/Toast";
import { formatRupiah } from "@/lib/utils";
import type { Language } from "@/lib/translations";

interface ReportsTabProps {
  lang: Language;
}

export function ReportsTab({ lang }: ReportsTabProps) {
  const { showToast } = useToast();
  const isEn = lang === "en";

  const [period, setPeriod] = useState<SalesReportParams["period"]>("7days");
  const [reportData, setReportData] = useState<SalesReportData | null>(null);
  const [isPending, startTransition] = useTransition();

  // Expense Modal State
  const [isExpenseModalOpen, setIsExpenseModalOpen] = useState(false);
  const [expenseKategori, setExpenseKategori] = useState("Operasional");
  const [expenseJumlah, setExpenseJumlah] = useState<number>(0);
  const [expenseKeterangan, setExpenseKeterangan] = useState("");

  const loadReport = () => {
    startTransition(async () => {
      const res = await getSalesReportDataAction({ period });
      if (res.success && res.data) {
        setReportData(res.data);
      } else {
        showToast(res.message || "Gagal memuat data laporan.", "error");
      }
    });
  };

  useEffect(() => {
    loadReport();
  }, [period]);

  const handleAddExpenseSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (expenseJumlah <= 0) {
      showToast(isEn ? "Expense amount must be greater than 0" : "Jumlah pengeluaran harus lebih dari 0", "error");
      return;
    }

    const res = await addExpenseAction({
      kategori: expenseKategori,
      jumlah: expenseJumlah,
      keterangan: expenseKeterangan,
    });

    if (res.success) {
      showToast(isEn ? "Expense added successfully!" : "Pengeluaran berhasil dicatat!", "success");
      setIsExpenseModalOpen(false);
      setExpenseJumlah(0);
      setExpenseKeterangan("");
      loadReport();
    } else {
      showToast(res.message || "Gagal mencatat pengeluaran.", "error");
    }
  };

  const handleDeleteExpense = async (id: string) => {
    if (!confirm(isEn ? "Delete this expense record?" : "Hapus catatan pengeluaran ini?")) return;
    const res = await deleteExpenseAction(id);
    if (res.success) {
      showToast(isEn ? "Expense deleted." : "Pengeluaran dihapus.", "info");
      loadReport();
    } else {
      showToast(res.message || "Gagal menghapus pengeluaran.", "error");
    }
  };

  const handleExportCsv = () => {
    if (!reportData) return;
    const lines = [
      `LAPORAN KEUANGAN & PENJUALAN (${reportData.periodLabel})`,
      `Total Omset (Gross Revenue),${reportData.totalGrossRevenue}`,
      `Total HPP (COGS),${reportData.totalCogs}`,
      `Laba Kotor (Gross Profit),${reportData.totalGrossProfit}`,
      `Total Pengeluaran (Expenses),${reportData.totalExpenses}`,
      `Laba Bersih (Net Profit),${reportData.totalNetProfit}`,
      `Total Transaksi,${reportData.totalTransactionsCount}`,
      `Total Unit Terjual,${reportData.totalUnitsSold}`,
      ``,
      `PRODUK TERLARIS (TOP 10)`,
      `Nama Produk,Kategori,Unit Terjual,Total Omset,Estimasi Profit`,
      ...reportData.bestSellers.map(
        (b) => `"${b.nama}","${b.categoryName}",${b.qtySold},${b.totalOmset},${b.totalProfit}`
      ),
      ``,
      `PENGELUARAN OPERASIONAL`,
      `Kategori,Jumlah,Keterangan,Tanggal`,
      ...reportData.expensesList.map(
        (ex) => `"${ex.kategori}",${ex.jumlah},"${ex.keterangan || "-"}",${ex.tanggal}`
      ),
    ].join("\n");

    const csvContent = "data:text/csv;charset=utf-8," + encodeURIComponent(lines);
    const link = document.createElement("a");
    link.setAttribute("href", csvContent);
    link.setAttribute("download", `laporan_penjualan_${period}_${Date.now()}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    showToast(isEn ? "Financial report CSV exported!" : "Laporan keuangan berhasil diekspor ke CSV!", "success");
  };

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
      {/* 1. Header & Filter Bar */}
      <div className="ui-card admin-card-anim anim-delay-0" style={{ padding: 16 }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: 12 }}>
          {/* Period Selector */}
          <div style={{ display: "flex", gap: 6, flexWrap: "wrap" }}>
            {[
              { id: "today", label: isEn ? "Today" : "Hari Ini" },
              { id: "7days", label: isEn ? "Last 7 Days" : "7 Hari Terakhir" },
              { id: "30days", label: isEn ? "Last 30 Days" : "30 Hari Terakhir" },
            ].map((p) => (
              <button
                key={p.id}
                type="button"
                style={{
                  padding: "6px 14px",
                  borderRadius: 20,
                  fontSize: 12,
                  fontWeight: 600,
                  border: "1px solid",
                  borderColor: period === p.id ? "var(--primary)" : "var(--border)",
                  background: period === p.id ? "var(--primary-light)" : "var(--bg-surface)",
                  color: period === p.id ? "var(--primary)" : "var(--text-body)",
                  cursor: "pointer",
                }}
                onClick={() => setPeriod(p.id as any)}
              >
                {p.label}
              </button>
            ))}
          </div>

          <div style={{ display: "flex", gap: 10 }}>
            <button
              type="button"
              onClick={() => setIsExpenseModalOpen(true)}
              style={{
                padding: "6px 14px",
                borderRadius: 6,
                background: "var(--primary)",
                color: "#fff",
                border: "none",
                fontSize: 12,
                fontWeight: 600,
                cursor: "pointer",
              }}
            >
              + {isEn ? "Add Expense" : "Catat Beban Pengeluaran"}
            </button>
            <button
              type="button"
              onClick={handleExportCsv}
              style={{
                padding: "6px 14px",
                borderRadius: 6,
                background: "var(--secondary)",
                color: "#fff",
                border: "none",
                fontSize: 12,
                fontWeight: 600,
                cursor: "pointer",
                display: "inline-flex",
                alignItems: "center",
                gap: 6,
              }}
            >
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
                <polyline points="7 10 12 15 17 10" />
                <line x1="12" y1="15" x2="12" y2="3" />
              </svg>
              <span>{isEn ? "Export Report" : "Ekspor Laporan"}</span>
            </button>
          </div>
        </div>
      </div>

      {/* 2. Financial KPI Cards */}
      {reportData && (
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: 16 }}>
          {/* Omset */}
          <div className="ui-card admin-card-anim anim-delay-1" style={{ padding: "16px 20px" }}>
            <div style={{ fontSize: 11.5, color: "var(--text-muted)", fontWeight: 600, marginBottom: 4 }}>
              {isEn ? "Gross Revenue" : "Total Omset (Penjualan)"}
            </div>
            <div style={{ fontSize: 20, fontWeight: 700, fontFamily: "var(--font-mono)", color: "var(--primary)" }}>
              {formatRupiah(reportData.totalGrossRevenue)}
            </div>
            <div style={{ fontSize: 11, color: "var(--text-muted)", marginTop: 4 }}>
              {reportData.totalTransactionsCount} {isEn ? "transactions" : "pesanan"} ({reportData.totalUnitsSold} unit)
            </div>
          </div>

          {/* Laba Kotor */}
          <div className="ui-card admin-card-anim anim-delay-2" style={{ padding: "16px 20px" }}>
            <div style={{ fontSize: 11.5, color: "var(--text-muted)", fontWeight: 600, marginBottom: 4 }}>
              {isEn ? "Gross Profit (Revenue - COGS)" : "Laba Kotor (Omset - HPP)"}
            </div>
            <div style={{ fontSize: 20, fontWeight: 700, fontFamily: "var(--font-mono)", color: "#2B4C7E" }}>
              {formatRupiah(reportData.totalGrossProfit)}
            </div>
            <div style={{ fontSize: 11, color: "var(--text-muted)", marginTop: 4 }}>
              HPP: {formatRupiah(reportData.totalCogs)}
            </div>
          </div>

          {/* Pengeluaran */}
          <div className="ui-card admin-card-anim anim-delay-3" style={{ padding: "16px 20px" }}>
            <div style={{ fontSize: 11.5, color: "var(--text-muted)", fontWeight: 600, marginBottom: 4 }}>
              {isEn ? "Operational Expenses" : "Beban Pengeluaran Operasional"}
            </div>
            <div style={{ fontSize: 20, fontWeight: 700, fontFamily: "var(--font-mono)", color: "#C84B31" }}>
              {formatRupiah(reportData.totalExpenses)}
            </div>
            <div style={{ fontSize: 11, color: "var(--text-muted)", marginTop: 4 }}>
              {reportData.expensesList.length} {isEn ? "expense entries" : "catatan pengeluaran"}
            </div>
          </div>

          {/* Laba Bersih */}
          <div className="ui-card admin-card-anim anim-delay-4" style={{ padding: "16px 20px" }}>
            <div style={{ fontSize: 11.5, color: "var(--text-muted)", fontWeight: 600, marginBottom: 4 }}>
              {isEn ? "Net Profit" : "Laba Bersih (Net Profit)"}
            </div>
            <div
              style={{
                fontSize: 20,
                fontWeight: 700,
                fontFamily: "var(--font-mono)",
                color: reportData.totalNetProfit >= 0 ? "var(--primary)" : "#C84B31",
              }}
            >
              {formatRupiah(reportData.totalNetProfit)}
            </div>
            <div style={{ fontSize: 11, color: "var(--text-muted)", marginTop: 4 }}>
              {isEn ? "After operational expenses" : "Setelah beban operasional"}
            </div>
          </div>
        </div>
      )}

      {/* 3. Tables Grid: Best Sellers & Expenses */}
      {reportData && (
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(360px, 1fr))", gap: 16 }}>
          {/* Best Sellers */}
          <div className="ui-card admin-card-anim anim-delay-5" style={{ padding: 0, overflow: "hidden" }}>
            <div style={{ padding: "14px 18px", borderBottom: "1px solid var(--border)", fontWeight: 700, fontSize: 13, display: "flex", alignItems: "center", gap: 8 }}>
              <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="var(--primary)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M6 9H4.5a2.5 2.5 0 0 1 0-5H6" />
                <path d="M18 9h1.5a2.5 2.5 0 0 0 0-5H18" />
                <path d="M4 22h16" />
                <path d="M10 14.66V17c0 .55-.45 1-1 1H7v4h10v-4h-2a1 1 0 0 1-1-1v-2.34" />
                <path d="M18 2H6v7a6 6 0 0 0 12 0V2z" />
              </svg>
              <span>{isEn ? "Top 10 Best Selling Products" : "10 Produk Terlaris"}</span>
            </div>
            {reportData.bestSellers.length === 0 ? (
              <div style={{ padding: 32, textAlign: "center", color: "var(--text-muted)", fontSize: 12 }}>
                {isEn ? "No sales in this period" : "Belum ada produk terjual dalam periode ini"}
              </div>
            ) : (
              <div style={{ overflowX: "auto" }}>
                <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 12 }}>
                  <thead>
                    <tr style={{ background: "var(--bg-muted)", textAlign: "left", color: "var(--text-muted)" }}>
                      <th style={{ padding: "8px 14px" }}>Produk</th>
                      <th style={{ padding: "8px 14px", textAlign: "center" }}>Qty</th>
                      <th style={{ padding: "8px 14px", textAlign: "right" }}>Omset</th>
                    </tr>
                  </thead>
                  <tbody>
                    {reportData.bestSellers.map((b, idx) => (
                      <tr key={idx} style={{ borderBottom: "1px solid var(--border-subtle)" }}>
                        <td style={{ padding: "10px 14px", fontWeight: 600 }}>
                          <div>{b.nama}</div>
                          <div style={{ fontSize: 10.5, color: "var(--text-muted)" }}>{b.categoryName}</div>
                        </td>
                        <td style={{ padding: "10px 14px", textAlign: "center", fontWeight: 700 }}>
                          {b.qtySold}
                        </td>
                        <td style={{ padding: "10px 14px", textAlign: "right", fontFamily: "var(--font-mono)", fontWeight: 700 }}>
                          {formatRupiah(b.totalOmset)}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>

          {/* Expenses List */}
          <div className="ui-card admin-card-anim anim-delay-6" style={{ padding: 0, overflow: "hidden" }}>
            <div style={{ padding: "14px 18px", borderBottom: "1px solid var(--border)", fontWeight: 700, fontSize: 13, display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <span style={{ display: "inline-flex", alignItems: "center", gap: 8 }}>
                <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="var(--danger)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <rect x="2" y="5" width="20" height="14" rx="2" />
                  <line x1="2" y1="10" x2="22" y2="10" />
                </svg>
                <span>{isEn ? "Operational Expenses" : "Catatan Pengeluaran Operasional"}</span>
              </span>
              <button
                type="button"
                onClick={() => setIsExpenseModalOpen(true)}
                style={{ fontSize: 11, background: "none", border: "none", color: "var(--primary)", fontWeight: 700, cursor: "pointer" }}
              >
                + {isEn ? "Add" : "Tambah"}
              </button>
            </div>
            {reportData.expensesList.length === 0 ? (
              <div style={{ padding: 32, textAlign: "center", color: "var(--text-muted)", fontSize: 12 }}>
                {isEn ? "No expenses recorded in this period" : "Tidak ada beban pengeluaran dalam periode ini"}
              </div>
            ) : (
              <div style={{ overflowX: "auto" }}>
                <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 12 }}>
                  <thead>
                    <tr style={{ background: "var(--bg-muted)", textAlign: "left", color: "var(--text-muted)" }}>
                      <th style={{ padding: "8px 14px" }}>Kategori</th>
                      <th style={{ padding: "8px 14px" }}>Ket</th>
                      <th style={{ padding: "8px 14px", textAlign: "right" }}>Jumlah</th>
                      <th style={{ padding: "8px 14px", textAlign: "center" }}>Aksi</th>
                    </tr>
                  </thead>
                  <tbody>
                    {reportData.expensesList.map((ex) => (
                      <tr key={ex.id} style={{ borderBottom: "1px solid var(--border-subtle)" }}>
                        <td style={{ padding: "10px 14px", fontWeight: 600 }}>
                          <div>{ex.kategori}</div>
                          <div style={{ fontSize: 10, color: "var(--text-muted)" }}>{ex.tanggal}</div>
                        </td>
                        <td style={{ padding: "10px 14px", color: "var(--text-muted)" }}>
                          {ex.keterangan || "-"}
                        </td>
                        <td style={{ padding: "10px 14px", textAlign: "right", fontFamily: "var(--font-mono)", fontWeight: 700, color: "#C84B31" }}>
                          {formatRupiah(ex.jumlah)}
                        </td>
                        <td style={{ padding: "10px 14px", textAlign: "center" }}>
                          <button
                            type="button"
                            onClick={() => handleDeleteExpense(ex.id)}
                            style={{ background: "none", border: "none", color: "#C84B31", cursor: "pointer", display: "inline-flex", alignItems: "center", justifyContent: "center" }}
                            title={isEn ? "Delete" : "Hapus"}
                          >
                            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                              <polyline points="3 6 5 6 21 6" />
                              <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" />
                              <line x1="10" y1="11" x2="10" y2="17" />
                              <line x1="14" y1="11" x2="14" y2="17" />
                            </svg>
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>
      )}

      {/* 4. Add Expense Modal */}
      {isExpenseModalOpen && (
        <div
          style={{
            position: "fixed",
            inset: 0,
            background: "rgba(0,0,0,0.5)",
            zIndex: 100,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            padding: 20,
          }}
        >
          <div
            style={{
              background: "#fff",
              borderRadius: 8,
              maxWidth: 400,
              width: "100%",
              padding: 20,
              boxShadow: "0 10px 30px rgba(0,0,0,0.2)",
            }}
          >
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 14 }}>
              <h3 style={{ margin: 0, fontSize: 15, fontWeight: 700 }}>
                {isEn ? "Add Operational Expense" : "Catat Pengeluaran Operasional"}
              </h3>
              <button
                type="button"
                onClick={() => setIsExpenseModalOpen(false)}
                style={{ background: "none", border: "none", fontSize: 18, cursor: "pointer" }}
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleAddExpenseSubmit} style={{ display: "flex", flexDirection: "column", gap: 12 }}>
              <div>
                <label style={{ fontSize: 12, fontWeight: 600, display: "block", marginBottom: 4 }}>
                  {isEn ? "Category" : "Kategori Pengeluaran"}
                </label>
                <select
                  value={expenseKategori}
                  onChange={(e) => setExpenseKategori(e.target.value)}
                  style={{ width: "100%", padding: "8px 12px", borderRadius: 6, border: "1px solid var(--border)", fontSize: 12 }}
                >
                  <option value="Operasional">Operasional Harian</option>
                  <option value="Listrik & Air">Listrik & Air</option>
                  <option value="Gaji & Uang Makan">Gaji & Uang Makan</option>
                  <option value="Bahan & Kemasan">Bahan & Kemasan</option>
                  <option value="Sewa & Maintenance">Sewa & Maintenance</option>
                  <option value="Lain-lain">Lain-lain</option>
                </select>
              </div>

              <div>
                <label style={{ fontSize: 12, fontWeight: 600, display: "block", marginBottom: 4 }}>
                  {isEn ? "Amount (Rp)" : "Nominal Pengeluaran (Rp)"}
                </label>
                <input
                  type="number"
                  placeholder="0"
                  value={expenseJumlah || ""}
                  onChange={(e) => setExpenseJumlah(Number(e.target.value) || 0)}
                  style={{ width: "100%", padding: "8px 12px", borderRadius: 6, border: "1px solid var(--border)", fontSize: 13, fontFamily: "var(--font-mono)", fontWeight: 700 }}
                  required
                />
              </div>

              <div>
                <label style={{ fontSize: 12, fontWeight: 600, display: "block", marginBottom: 4 }}>
                  {isEn ? "Description / Notes" : "Keterangan (Opsional)"}
                </label>
                <input
                  type="text"
                  placeholder={isEn ? "e.g. Bought receipt paper..." : "misal: Beli kertas struk kasir..."}
                  value={expenseKeterangan}
                  onChange={(e) => setExpenseKeterangan(e.target.value)}
                  style={{ width: "100%", padding: "8px 12px", borderRadius: 6, border: "1px solid var(--border)", fontSize: 12 }}
                />
              </div>

              <div style={{ display: "flex", gap: 8, marginTop: 8 }}>
                <button
                  type="submit"
                  style={{
                    flex: 1,
                    padding: "10px",
                    borderRadius: 6,
                    background: "var(--primary)",
                    color: "#fff",
                    border: "none",
                    fontSize: 12,
                    fontWeight: 700,
                    cursor: "pointer",
                  }}
                >
                  {isEn ? "Save Expense" : "Simpan Pengeluaran"}
                </button>
                <button
                  type="button"
                  onClick={() => setIsExpenseModalOpen(false)}
                  style={{
                    padding: "10px 16px",
                    borderRadius: 6,
                    background: "transparent",
                    border: "1px solid var(--border)",
                    fontSize: 12,
                    fontWeight: 600,
                    cursor: "pointer",
                  }}
                >
                  {isEn ? "Cancel" : "Batal"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
