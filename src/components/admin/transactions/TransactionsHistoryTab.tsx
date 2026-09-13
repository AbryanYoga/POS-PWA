"use client";

import React, { useState, useEffect, useTransition } from "react";
import {
  getTransactionsListAction,
  getTransactionDetailAction,
  type TransactionListItem,
  type TransactionDetail,
  type TransactionFilterParams,
} from "@/lib/actions/transaction-actions";
import { useToast } from "@/components/ui/Toast";
import { formatRupiah } from "@/lib/utils";
import type { Language } from "@/lib/translations";

interface TransactionsHistoryTabProps {
  lang: Language;
}

export function TransactionsHistoryTab({ lang }: TransactionsHistoryTabProps) {
  const { showToast } = useToast();
  const isEn = lang === "en";

  const [period, setPeriod] = useState<TransactionFilterParams["period"]>("7days");
  const [paymentMethod, setPaymentMethod] = useState("ALL");
  const [searchQuery, setSearchQuery] = useState("");
  const [transactionsList, setTransactionsList] = useState<TransactionListItem[]>([]);
  const [summary, setSummary] = useState({
    totalVolume: 0,
    totalNominal: 0,
    countCash: 0,
    countQris: 0,
  });

  const [selectedTrxId, setSelectedTrxId] = useState<string | null>(null);
  const [detailData, setDetailData] = useState<TransactionDetail | null>(null);
  const [receiptWidth, setReceiptWidth] = useState<"58mm" | "80mm">("58mm");
  const [isPending, startTransition] = useTransition();

  const loadData = () => {
    startTransition(async () => {
      const res = await getTransactionsListAction({
        period,
        paymentMethod,
        search: searchQuery,
      });

      if (res.success && res.data) {
        setTransactionsList(res.data.transactions);
        setSummary(res.data.summary);
      } else {
        showToast(res.message || "Gagal memuat data transaksi.", "error");
      }
    });
  };

  useEffect(() => {
    loadData();
  }, [period, paymentMethod]);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    loadData();
  };

  const handleOpenDetail = async (id: string) => {
    setSelectedTrxId(id);
    const res = await getTransactionDetailAction(id);
    if (res.success && res.data) {
      setDetailData(res.data);
    } else {
      showToast(res.message || "Gagal memuat detail transaksi.", "error");
      setSelectedTrxId(null);
    }
  };

  const handleExportCsv = () => {
    if (transactionsList.length === 0) {
      showToast(isEn ? "No transactions to export." : "Tidak ada transaksi untuk diekspor.", "error");
      return;
    }

    const headers = ["No Transaksi", "Waktu (WIB)", "Kasir", "Metode", "Total", "Bayar", "Kembalian", "Status"];
    const rows = transactionsList.map((t) => [
      `"${t.noTransaksi}"`,
      `"${t.createdAt}"`,
      `"${t.kasirNama}"`,
      `"${t.metodePembayaran}"`,
      t.total,
      t.bayar,
      t.kembalian,
      `"${t.status}"`,
    ]);

    const csvContent = "data:text/csv;charset=utf-8," + [headers.join(","), ...rows.map((r) => r.join(","))].join("\n");
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `riwayat_transaksi_${period}_${Date.now()}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    showToast(isEn ? "CSV exported successfully!" : "File CSV berhasil diunduh!", "success");
  };

  const handleCopyReceiptText = () => {
    if (!detailData) return;
    const lines = [
      `================================`,
      `       ${detailData.namaToko.toUpperCase()}`,
      detailData.alamatToko ? `   ${detailData.alamatToko}` : "",
      detailData.teleponToko ? `   Telp: ${detailData.teleponToko}` : "",
      `================================`,
      `No. Trx : ${detailData.noTransaksi}`,
      `Waktu   : ${detailData.createdAt}`,
      `Kasir   : ${detailData.kasirNama}`,
      `--------------------------------`,
      ...detailData.items.map(
        (it) =>
          `${it.namaProduk}\n  ${it.qty} x Rp ${it.hargaSatuan.toLocaleString("id-ID")} = Rp ${it.subtotal.toLocaleString("id-ID")}`
      ),
      `--------------------------------`,
      `TOTAL   : Rp ${detailData.total.toLocaleString("id-ID")}`,
      `BAYAR   : Rp ${detailData.bayar.toLocaleString("id-ID")} (${detailData.metodePembayaran})`,
      detailData.metodePembayaran === "CASH"
        ? `KEMBALI : Rp ${detailData.kembalian.toLocaleString("id-ID")}`
        : "",
      `================================`,
      ` Terima kasih atas kunjungan Anda! `,
      `================================`,
    ]
      .filter(Boolean)
      .join("\n");

    navigator.clipboard.writeText(lines).then(() => {
      showToast(
        isEn ? "Receipt copied to clipboard!" : "Teks struk berhasil disalin ke clipboard!",
        "success"
      );
    });
  };

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
      {/* 1. Header & Quick Summary */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))", gap: 16 }}>
        <div className="ui-card admin-card-anim anim-delay-0" style={{ padding: "16px 20px" }}>
          <div style={{ fontSize: 12, color: "var(--text-muted)", fontWeight: 600, marginBottom: 4 }}>
            {isEn ? "Total Revenue" : "Total Pendapatan"}
          </div>
          <div style={{ fontSize: 20, fontWeight: 700, fontFamily: "var(--font-mono)", color: "var(--primary)" }}>
            {formatRupiah(summary.totalNominal)}
          </div>
          <div style={{ fontSize: 11, color: "var(--text-muted)", marginTop: 4 }}>
            {summary.totalVolume} {isEn ? "completed orders" : "transaksi selesai"}
          </div>
        </div>

        <div className="ui-card admin-card-anim anim-delay-1" style={{ padding: "16px 20px" }}>
          <div style={{ fontSize: 12, color: "var(--text-muted)", fontWeight: 600, marginBottom: 4 }}>
            {isEn ? "Payment Breakdown" : "Metode Pembayaran"}
          </div>
          <div style={{ display: "flex", gap: 16, marginTop: 6, fontSize: 13, fontWeight: 600 }}>
            <span style={{ color: "var(--primary)", display: "inline-flex", alignItems: "center", gap: 6 }}>
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <rect x="2" y="6" width="20" height="12" rx="2" />
                <circle cx="12" cy="12" r="2" />
              </svg>
              <span>{isEn ? "Cash" : "Tunai"}: {summary.countCash}</span>
            </span>
            <span style={{ color: "var(--secondary)", display: "inline-flex", alignItems: "center", gap: 6 }}>
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <rect x="5" y="2" width="14" height="20" rx="2" ry="2" />
                <line x1="12" y1="18" x2="12.01" y2="18" />
              </svg>
              <span>QRIS: {summary.countQris}</span>
            </span>
          </div>
          <div style={{ fontSize: 11, color: "var(--text-muted)", marginTop: 4 }}>
            {isEn ? "In selected date filter" : "Dalam periode terpilih"}
          </div>
        </div>
      </div>

      {/* 2. Filter Bar */}
      <div className="ui-card admin-card-anim anim-delay-2" style={{ padding: 16 }}>
        <div style={{ display: "flex", flexWrap: "wrap", alignItems: "center", justifyContent: "space-between", gap: 12 }}>
          {/* Period Pills */}
          <div style={{ display: "flex", gap: 6, flexWrap: "wrap" }}>
            {[
              { id: "today", label: isEn ? "Today" : "Hari Ini" },
              { id: "7days", label: isEn ? "Last 7 Days" : "7 Hari" },
              { id: "30days", label: isEn ? "Last 30 Days" : "30 Hari" },
              { id: "all", label: isEn ? "All Time" : "Semua" },
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

          {/* Payment & Search Controls */}
          <div style={{ display: "flex", alignItems: "center", gap: 10, flexWrap: "wrap" }}>
            <select
              value={paymentMethod}
              onChange={(e) => setPaymentMethod(e.target.value)}
              style={{
                padding: "6px 12px",
                borderRadius: 6,
                border: "1px solid var(--border)",
                fontSize: 12,
                background: "var(--bg-surface)",
                fontWeight: 600,
              }}
            >
              <option value="ALL">{isEn ? "All Methods" : "Semua Metode"}</option>
              <option value="CASH">{isEn ? "Cash" : "Tunai (Cash)"}</option>
              <option value="QRIS">QRIS</option>
            </select>

            <form onSubmit={handleSearchSubmit} style={{ display: "flex", gap: 6 }}>
              <input
                type="text"
                placeholder={isEn ? "Search No Trx..." : "Cari No Transaksi..."}
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                style={{
                  padding: "6px 12px",
                  borderRadius: 6,
                  border: "1px solid var(--border)",
                  fontSize: 12,
                  width: 160,
                }}
              />
              <button
                type="submit"
                style={{
                  padding: "6px 12px",
                  borderRadius: 6,
                  background: "var(--primary)",
                  color: "#fff",
                  border: "none",
                  fontSize: 12,
                  fontWeight: 600,
                  cursor: "pointer",
                  display: "inline-flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}
                title={isEn ? "Search" : "Cari"}
              >
                <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <circle cx="11" cy="11" r="8" />
                  <line x1="21" y1="21" x2="16.65" y2="16.65" />
                </svg>
              </button>
            </form>

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
              <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
                <polyline points="7 10 12 15 17 10" />
                <line x1="12" y1="15" x2="12" y2="3" />
              </svg>
              <span>{isEn ? "Export CSV" : "Ekspor CSV"}</span>
            </button>
          </div>
        </div>
      </div>

      {/* 3. Transactions Table */}
      <div className="ui-card admin-card-anim anim-delay-3" style={{ padding: 0, overflow: "hidden" }}>
        <div style={{ padding: "16px 20px", borderBottom: "1px solid var(--border)", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <h3 style={{ fontSize: 14, fontWeight: 700, margin: 0 }}>
            {isEn ? "Transaction Records" : "Daftar Riwayat Transaksi"}
          </h3>
          <span style={{ fontSize: 12, color: "var(--text-muted)" }}>
            {transactionsList.length} {isEn ? "records found" : "transaksi ditemukan"}
          </span>
        </div>

        {transactionsList.length === 0 ? (
          <div style={{ padding: 48, textAlign: "center", color: "var(--text-muted)" }}>
            <div style={{ display: "flex", justifyContent: "center", marginBottom: 12 }}>
              <div style={{ width: 48, height: 48, borderRadius: "50%", background: "var(--bg-muted)", display: "flex", alignItems: "center", justifyContent: "center", color: "var(--text-muted)" }}>
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round">
                  <circle cx="9" cy="21" r="1" />
                  <circle cx="20" cy="21" r="1" />
                  <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6" />
                </svg>
              </div>
            </div>
            <div style={{ fontWeight: 600, fontSize: 14 }}>
              {isEn ? "No transactions found" : "Belum ada transaksi pada periode ini"}
            </div>
            <p style={{ fontSize: 12, marginTop: 4 }}>
              {isEn ? "Try changing the filter period or search query." : "Ubah rentang filter atau gunakan kasir POS untuk membuat transaksi baru."}
            </p>
          </div>
        ) : (
          <div style={{ overflowX: "auto" }}>
            <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 12.5 }}>
              <thead>
                <tr style={{ background: "var(--bg-muted)", textAlign: "left", color: "var(--text-muted)", borderBottom: "1px solid var(--border)" }}>
                  <th style={{ padding: "10px 16px" }}>No Transaksi</th>
                  <th style={{ padding: "10px 16px" }}>Waktu (WIB)</th>
                  <th style={{ padding: "10px 16px" }}>Kasir</th>
                  <th style={{ padding: "10px 16px" }}>Metode</th>
                  <th style={{ padding: "10px 16px", textAlign: "right" }}>Total</th>
                  <th style={{ padding: "10px 16px", textAlign: "center" }}>Status</th>
                  <th style={{ padding: "10px 16px", textAlign: "center" }}>Aksi</th>
                </tr>
              </thead>
              <tbody>
                {transactionsList.map((t) => (
                  <tr key={t.id} style={{ borderBottom: "1px solid var(--border-subtle)" }}>
                    <td style={{ padding: "12px 16px", fontFamily: "var(--font-mono)", fontWeight: 700 }}>
                      {t.noTransaksi}
                    </td>
                    <td style={{ padding: "12px 16px", color: "var(--text-muted)", fontSize: 11.5 }}>
                      {t.createdAt}
                    </td>
                    <td style={{ padding: "12px 16px" }}>
                      {t.kasirNama}
                    </td>
                    <td style={{ padding: "12px 16px" }}>
                      <span
                        style={{
                          padding: "2px 8px",
                          borderRadius: 4,
                          fontSize: 11,
                          fontWeight: 700,
                          background: t.metodePembayaran === "CASH" ? "var(--primary-light)" : "var(--secondary-light)",
                          color: t.metodePembayaran === "CASH" ? "var(--primary)" : "var(--secondary)",
                        }}
                      >
                        {t.metodePembayaran}
                      </span>
                    </td>
                    <td style={{ padding: "12px 16px", textAlign: "right", fontFamily: "var(--font-mono)", fontWeight: 700 }}>
                      {formatRupiah(t.total)}
                    </td>
                    <td style={{ padding: "12px 16px", textAlign: "center" }}>
                      <span
                        style={{
                          padding: "2px 8px",
                          borderRadius: 12,
                          fontSize: 10.5,
                          fontWeight: 700,
                          background: "#EBF2EE",
                          color: "#2B5D4F",
                        }}
                      >
                        {t.status}
                      </span>
                    </td>
                    <td style={{ padding: "12px 16px", textAlign: "center" }}>
                      <button
                        type="button"
                        onClick={() => handleOpenDetail(t.id)}
                        style={{
                          padding: "4px 10px",
                          borderRadius: 4,
                          border: "1px solid var(--border)",
                          background: "var(--bg-surface)",
                          fontSize: 11,
                          fontWeight: 600,
                          cursor: "pointer",
                          color: "var(--primary)",
                          display: "inline-flex",
                          alignItems: "center",
                          gap: 5,
                        }}
                      >
                        <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                          <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
                          <polyline points="14 2 14 8 20 8" />
                          <line x1="16" y1="13" x2="8" y2="13" />
                          <line x1="16" y1="17" x2="8" y2="17" />
                        </svg>
                        <span>{isEn ? "Detail & Struk" : "Detail & Struk"}</span>
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* 4. Modal Detail & Reprint Struk Thermal */}
      {selectedTrxId && detailData && (
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
              maxWidth: 420,
              width: "100%",
              maxHeight: "90vh",
              overflowY: "auto",
              padding: 20,
              boxShadow: "0 10px 30px rgba(0,0,0,0.2)",
            }}
          >
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 12 }}>
              <h3 style={{ margin: 0, fontSize: 15, fontWeight: 700 }}>
                {isEn ? "Receipt & Transaction Details" : "Detail & Cetak Ulang Struk"}
              </h3>
              <button
                type="button"
                onClick={() => {
                  setSelectedTrxId(null);
                  setDetailData(null);
                }}
                style={{ background: "none", border: "none", fontSize: 18, cursor: "pointer" }}
              >
                ✕
              </button>
            </div>

            {/* Thermal Width Selector */}
            <div style={{ display: "flex", justifyContent: "center", gap: 8, marginBottom: 12 }}>
              <button
                type="button"
                style={{
                  padding: "4px 10px",
                  borderRadius: 4,
                  fontSize: 11,
                  fontWeight: 600,
                  border: "1px solid",
                  borderColor: receiptWidth === "58mm" ? "var(--primary)" : "var(--border)",
                  background: receiptWidth === "58mm" ? "var(--primary-light)" : "var(--bg-surface)",
                  color: receiptWidth === "58mm" ? "var(--primary)" : "var(--text-muted)",
                  cursor: "pointer",
                }}
                onClick={() => setReceiptWidth("58mm")}
              >
                Thermal 58mm
              </button>
              <button
                type="button"
                style={{
                  padding: "4px 10px",
                  borderRadius: 4,
                  fontSize: 11,
                  fontWeight: 600,
                  border: "1px solid",
                  borderColor: receiptWidth === "80mm" ? "var(--primary)" : "var(--border)",
                  background: receiptWidth === "80mm" ? "var(--primary-light)" : "var(--bg-surface)",
                  color: receiptWidth === "80mm" ? "var(--primary)" : "var(--text-muted)",
                  cursor: "pointer",
                }}
                onClick={() => setReceiptWidth("80mm")}
              >
                Thermal 80mm
              </button>
            </div>

            {/* Receipt Box */}
            <div className={`receipt-paper-wrap width-${receiptWidth}`} id="printableReceipt" style={{ marginBottom: 16 }}>
              <div style={{ textAlign: "center", borderBottom: "1px dashed #333", paddingBottom: 10, marginBottom: 10 }}>
                <div style={{ fontWeight: 800, fontSize: 14 }}>{detailData.namaToko}</div>
                {detailData.alamatToko && <div style={{ fontSize: 10, color: "#666" }}>{detailData.alamatToko}</div>}
                {detailData.teleponToko && <div style={{ fontSize: 10, color: "#666" }}>Telp: {detailData.teleponToko}</div>}
              </div>

              <div style={{ display: "flex", justifyContent: "space-between", fontSize: 10, marginBottom: 6 }}>
                <span>No: {detailData.noTransaksi}</span>
                <span>{detailData.createdAt}</span>
              </div>
              <div style={{ fontSize: 10, marginBottom: 8 }}>
                Kasir: {detailData.kasirNama}
              </div>

              <div style={{ borderTop: "1px dashed #333", borderBottom: "1px dashed #333", padding: "8px 0", marginBottom: 8 }}>
                {detailData.items.map((it, idx) => (
                  <div key={idx} style={{ marginBottom: 4 }}>
                    <div style={{ display: "flex", justifyContent: "space-between" }}>
                      <span>{it.namaProduk}</span>
                      <span>{formatRupiah(it.subtotal)}</span>
                    </div>
                    <div style={{ fontSize: 10, color: "#666" }}>
                      {it.qty} x {formatRupiah(it.hargaSatuan)}
                    </div>
                  </div>
                ))}
              </div>

              <div style={{ display: "flex", justifyContent: "space-between", fontWeight: 700, marginBottom: 4 }}>
                <span>TOTAL:</span>
                <span>{formatRupiah(detailData.total)}</span>
              </div>
              <div style={{ display: "flex", justifyContent: "space-between", fontSize: 10 }}>
                <span>BAYAR ({detailData.metodePembayaran}):</span>
                <span>{formatRupiah(detailData.bayar)}</span>
              </div>
              {detailData.metodePembayaran === "CASH" && (
                <div style={{ display: "flex", justifyContent: "space-between", fontSize: 10 }}>
                  <span>KEMBALIAN:</span>
                  <span>{formatRupiah(detailData.kembalian)}</span>
                </div>
              )}

              <div style={{ textAlign: "center", marginTop: 14, paddingTop: 10, borderTop: "1px dashed #333", fontSize: 10, color: "#555" }}>
                Terima kasih atas kunjungan Anda!
              </div>
            </div>

            {/* Action Buttons */}
            <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
              <div style={{ display: "flex", gap: 8 }}>
                <button
                  type="button"
                  onClick={() => window.print()}
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
                    display: "inline-flex",
                    alignItems: "center",
                    justifyContent: "center",
                    gap: 6,
                  }}
                >
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <polyline points="6 9 6 2 18 2 18 9" />
                    <path d="M6 18H4a2 2 0 0 1-2-2v-5a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2v5a2 2 0 0 1-2 2h-2" />
                    <rect x="6" y="14" width="12" height="8" />
                  </svg>
                  <span>{isEn ? "Print Receipt" : "Cetak Struk"}</span>
                </button>
                <button
                  type="button"
                  onClick={handleCopyReceiptText}
                  style={{
                    flex: 1,
                    padding: "10px",
                    borderRadius: 6,
                    background: "var(--bg-muted)",
                    color: "var(--text-heading)",
                    border: "1px solid var(--border)",
                    fontSize: 12,
                    fontWeight: 700,
                    cursor: "pointer",
                    display: "inline-flex",
                    alignItems: "center",
                    justifyContent: "center",
                    gap: 6,
                  }}
                >
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <rect x="9" y="9" width="13" height="13" rx="2" ry="2" />
                    <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1" />
                  </svg>
                  <span>{isEn ? "Copy Text" : "Salin Teks"}</span>
                </button>
              </div>
              <button
                type="button"
                onClick={() => {
                  setSelectedTrxId(null);
                  setDetailData(null);
                }}
                style={{
                  width: "100%",
                  padding: "8px",
                  borderRadius: 6,
                  background: "transparent",
                  border: "1px solid var(--border)",
                  fontSize: 12,
                  fontWeight: 600,
                  cursor: "pointer",
                }}
              >
                {isEn ? "Close" : "Tutup"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
