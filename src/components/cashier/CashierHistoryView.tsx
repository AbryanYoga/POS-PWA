"use client";

import React, { useState, useEffect, useCallback, useTransition } from "react";
import Link from "next/link";
import { logoutAction } from "@/lib/actions/auth-actions";
import {
  getCashierHistory,
  type CashierTxRecord,
  type CashierHistoryPeriod,
} from "@/lib/actions/cashier-history-actions";
import { useToast } from "@/components/ui/Toast";
import { formatRupiah, formatWibDateTime } from "@/lib/utils";
import "@/app/cashier/cashier.css";

interface Props {
  cashierName: string;
  kodeToko: string;
}

export function CashierHistoryView({ cashierName, kodeToko }: Props) {
  const { showToast } = useToast();
  const [isPending, startTransition] = useTransition();

  const [period, setPeriod] = useState<CashierHistoryPeriod>("today");
  const [transactions, setTransactions] = useState<CashierTxRecord[]>([]);
  const [stats, setStats] = useState({ totalTransaksi: 0, totalPendapatan: 0, rataRataPerTransaksi: 0 });
  const [loading, setLoading] = useState(true);

  // Detail modal
  const [selectedTx, setSelectedTx] = useState<CashierTxRecord | null>(null);

  // Load data
  const loadHistory = useCallback(
    async (p: CashierHistoryPeriod) => {
      setLoading(true);
      const res = await getCashierHistory(p);
      if (res.success && res.data) {
        setTransactions(res.data);
        setStats(res.stats ?? { totalTransaksi: 0, totalPendapatan: 0, rataRataPerTransaksi: 0 });
      } else {
        showToast(res.error ?? "Gagal memuat riwayat.", "error");
      }
      setLoading(false);
    },
    [showToast]
  );

  useEffect(() => {
    loadHistory(period);
  }, [period, loadHistory]);

  function handleRefresh() {
    startTransition(() => {
      loadHistory(period);
    });
  }

  // ─── Cetak ulang struk ──────────────────────────────────────────────
  function handleReprintReceipt(tx: CashierTxRecord) {
    const lines: string[] = [];
    lines.push("================================");
    lines.push(`  ${kodeToko} — KASIR: ${cashierName}`);
    lines.push("================================");
    lines.push(`No: ${tx.noTransaksi}`);
    lines.push(`Tgl: ${formatWibDateTime(tx.createdAt)}`);
    lines.push(`Bayar: ${tx.metodePembayaran}`);
    lines.push("--------------------------------");
    for (const item of tx.items) {
      lines.push(`${item.namaProduk}`);
      lines.push(`  ${item.qty} x ${formatRupiah(item.hargaJual)} = ${formatRupiah(item.subtotal)}`);
    }
    lines.push("--------------------------------");
    lines.push(`TOTAL : ${formatRupiah(tx.total)}`);
    lines.push(`BAYAR : ${formatRupiah(tx.bayar)}`);
    lines.push(`KEMBALI: ${formatRupiah(tx.kembalian)}`);
    lines.push("================================");
    lines.push("    Terima kasih, selamat    ");
    lines.push("       berbelanja!           ");
    lines.push("================================");

    const printContent = lines.join("\n");
    const win = window.open("", "_blank", "width=400,height=600");
    if (!win) {
      // Fallback: copy to clipboard
      navigator.clipboard.writeText(printContent).then(() => {
        showToast("Struk disalin ke clipboard.", "info");
      });
      return;
    }
    win.document.write(`
      <html><head><title>Struk ${tx.noTransaksi}</title>
      <style>
        body { font-family: 'Courier New', monospace; font-size: 12px; padding: 16px; white-space: pre; }
        @media print { body { margin: 0; } }
      </style></head>
      <body>${printContent}</body></html>
    `);
    win.document.close();
    win.print();
    win.close();
  }

  // ─── Status badge ────────────────────────────────────────────────────
  const getStatusBadge = (status: string) => {
    if (status === "COMPLETED")
      return <span className="hist-badge-completed">✓ Selesai</span>;
    if (status === "VOID")
      return <span className="hist-badge-void">✕ Void</span>;
    return <span className="hist-badge-pending">⏳ Pending</span>;
  };

  const getMethodIcon = (method: string) => {
    if (method === "QRIS") {
      return (
        <span className="hist-method-badge qris">
          <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
            <rect x="3" y="3" width="7" height="7" /><rect x="14" y="3" width="7" height="7" />
            <rect x="14" y="14" width="7" height="7" /><rect x="3" y="14" width="7" height="7" />
          </svg>
          QRIS
        </span>
      );
    }
    return (
      <span className="hist-method-badge cash">
        <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
          <rect x="2" y="6" width="20" height="12" rx="2" /><circle cx="12" cy="12" r="2" />
        </svg>
        Cash
      </span>
    );
  };

  const PERIOD_LABELS: Record<CashierHistoryPeriod, string> = {
    today: "Hari Ini",
    "7days": "7 Hari",
    "30days": "30 Hari",
  };

  const initials = (cashierName || "K").substring(0, 2).toUpperCase();

  return (
    <div className="ch-page">
      {/* ── TOP BAR ─────────────────────────────────────────────────── */}
      <div className="ch-topbar">
        <div className="ch-topbar-left">
          <Link href="/cashier" className="ch-back-btn">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <polyline points="15 18 9 12 15 6" />
            </svg>
            Kasir
          </Link>
          <div className="ch-topbar-title">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
              <polyline points="14 2 14 8 20 8" />
              <line x1="16" y1="13" x2="8" y2="13" /><line x1="16" y1="17" x2="8" y2="17" />
              <polyline points="10 9 9 9 8 9" />
            </svg>
            Riwayat Transaksi Saya
          </div>
        </div>
        <div className="ch-topbar-right">
          <div className="ch-outlet-pill">{kodeToko}</div>
          <div className="ch-avatar">{initials}</div>
          <form action={logoutAction}>
            <button type="submit" className="ch-logout-btn" title="Logout">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
                <polyline points="16 17 21 12 16 7" /><line x1="21" y1="12" x2="9" y2="12" />
              </svg>
            </button>
          </form>
        </div>
      </div>

      {/* ── MAIN CONTENT ──────────────────────────────────────────────── */}
      <div className="ch-body">
        {/* Header + Controls */}
        <div className="ch-header">
          <div>
            <h1 className="ch-title">Riwayat Saya</h1>
            <p className="ch-subtitle">Transaksi yang diproses oleh <strong>{cashierName}</strong></p>
          </div>
          <div className="ch-controls">
            {/* Period Filter */}
            <div className="ch-period-tabs">
              {(["today", "7days", "30days"] as CashierHistoryPeriod[]).map((p) => (
                <button
                  key={p}
                  type="button"
                  className={`ch-period-tab ${period === p ? "active" : ""}`}
                  onClick={() => setPeriod(p)}
                  id={`periodTab_${p}`}
                >
                  {PERIOD_LABELS[p]}
                </button>
              ))}
            </div>
            {/* Refresh */}
            <button
              type="button"
              className="ch-refresh-btn"
              onClick={handleRefresh}
              disabled={loading || isPending}
              id="btnRefreshHistory"
            >
              <svg
                width="14"
                height="14"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2.5"
                style={{ animation: loading ? "spin 0.8s linear infinite" : "none" }}
              >
                <polyline points="23 4 23 10 17 10" />
                <polyline points="1 20 1 14 7 14" />
                <path d="M3.51 9a9 9 0 0 1 14.85-3.36L23 10M1 14l4.64 4.36A9 9 0 0 0 20.49 15" />
              </svg>
              Refresh
            </button>
          </div>
        </div>

        {/* Stats Row */}
        <div className="ch-stats-row">
          <div className="ch-stat-card">
            <div className="ch-stat-icon blue">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <circle cx="9" cy="21" r="1" /><circle cx="20" cy="21" r="1" />
                <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6" />
              </svg>
            </div>
            <div className="ch-stat-info">
              <div className="ch-stat-value">{stats.totalTransaksi}</div>
              <div className="ch-stat-label">Total Transaksi</div>
            </div>
          </div>
          <div className="ch-stat-card">
            <div className="ch-stat-icon green">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <rect x="2" y="6" width="20" height="12" rx="2" /><circle cx="12" cy="12" r="2" />
              </svg>
            </div>
            <div className="ch-stat-info">
              <div className="ch-stat-value">{formatRupiah(stats.totalPendapatan)}</div>
              <div className="ch-stat-label">Total Penjualan</div>
            </div>
          </div>
          <div className="ch-stat-card">
            <div className="ch-stat-icon purple">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <line x1="12" y1="1" x2="12" y2="23" />
                <path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" />
              </svg>
            </div>
            <div className="ch-stat-info">
              <div className="ch-stat-value">{formatRupiah(stats.rataRataPerTransaksi)}</div>
              <div className="ch-stat-label">Rata-rata/Transaksi</div>
            </div>
          </div>
        </div>

        {/* Transaction List */}
        <div className="ch-table-card">
          {loading ? (
            <div className="ch-loading">
              <div className="ch-spinner" />
              <p>Memuat riwayat transaksi...</p>
            </div>
          ) : transactions.length === 0 ? (
            <div className="ch-empty">
              <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.2">
                <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
                <polyline points="14 2 14 8 20 8" />
              </svg>
              <p>Tidak ada transaksi pada periode ini.</p>
              <small>Mulai buat transaksi di halaman kasir.</small>
            </div>
          ) : (
            <table className="ch-table">
              <thead>
                <tr>
                  <th>No. Transaksi</th>
                  <th>Waktu</th>
                  <th>Item</th>
                  <th>Total</th>
                  <th>Metode</th>
                  <th>Status</th>
                  <th>Aksi</th>
                </tr>
              </thead>
              <tbody>
                {transactions.map((tx) => (
                  <tr key={tx.id} className="ch-table-row">
                    <td className="ch-no-trx">{tx.noTransaksi}</td>
                    <td className="ch-datetime">{formatWibDateTime(tx.createdAt)}</td>
                    <td className="ch-item-count">
                      {tx.items.length} item
                      {tx.items.length !== 1 ? "s" : ""}
                    </td>
                    <td className="ch-total">{formatRupiah(tx.total)}</td>
                    <td>{getMethodIcon(tx.metodePembayaran)}</td>
                    <td>{getStatusBadge(tx.status)}</td>
                    <td>
                      <div className="ch-action-group">
                        <button
                          type="button"
                          className="ch-btn-detail"
                          onClick={() => setSelectedTx(tx)}
                          title="Lihat Detail"
                          id={`btnDetailTx_${tx.id.substring(0, 8)}`}
                        >
                          <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                            <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
                            <circle cx="12" cy="12" r="3" />
                          </svg>
                        </button>
                        <button
                          type="button"
                          className="ch-btn-print"
                          onClick={() => handleReprintReceipt(tx)}
                          title="Cetak Ulang Struk"
                          id={`btnReprintTx_${tx.id.substring(0, 8)}`}
                        >
                          <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                            <polyline points="6 9 6 2 18 2 18 9" />
                            <path d="M6 18H4a2 2 0 0 1-2-2v-5a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2v5a2 2 0 0 1-2 2h-2" />
                            <rect x="6" y="14" width="12" height="8" />
                          </svg>
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>

      {/* ── DETAIL MODAL ────────────────────────────────────────────────── */}
      {selectedTx && (
        <div className="ch-modal-overlay" onClick={() => setSelectedTx(null)}>
          <div className="ch-modal" onClick={(e) => e.stopPropagation()}>
            {/* Header */}
            <div className="ch-modal-header">
              <div>
                <h3 className="ch-modal-title">{selectedTx.noTransaksi}</h3>
                <p className="ch-modal-time">{formatWibDateTime(selectedTx.createdAt)}</p>
              </div>
              <button type="button" className="ch-modal-close" onClick={() => setSelectedTx(null)}>✕</button>
            </div>

            {/* Items */}
            <div className="ch-modal-body">
              <div className="ch-modal-section-label">Rincian Produk</div>
              {selectedTx.items.map((item) => (
                <div key={item.id} className="ch-modal-item">
                  <div className="ch-modal-item-name">{item.namaProduk}</div>
                  <div className="ch-modal-item-right">
                    <span className="ch-modal-item-qty">{item.qty}x</span>
                    <span className="ch-modal-item-price">{formatRupiah(item.hargaJual)}</span>
                    <span className="ch-modal-item-sub">{formatRupiah(item.subtotal)}</span>
                  </div>
                </div>
              ))}
            </div>

            {/* Summary */}
            <div className="ch-modal-summary">
              <div className="ch-modal-summary-row">
                <span>Metode</span>
                <strong>{selectedTx.metodePembayaran}</strong>
              </div>
              <div className="ch-modal-summary-row">
                <span>Status</span>
                <strong>{getStatusBadge(selectedTx.status)}</strong>
              </div>
              <div className="ch-modal-summary-row total">
                <span>Total</span>
                <strong>{formatRupiah(selectedTx.total)}</strong>
              </div>
              <div className="ch-modal-summary-row">
                <span>Dibayar</span>
                <span>{formatRupiah(selectedTx.bayar)}</span>
              </div>
              <div className="ch-modal-summary-row">
                <span>Kembalian</span>
                <span>{formatRupiah(selectedTx.kembalian)}</span>
              </div>
              {selectedTx.catatan && (
                <div className="ch-modal-summary-row">
                  <span>Catatan</span>
                  <span>{selectedTx.catatan}</span>
                </div>
              )}
            </div>

            {/* Footer */}
            <div className="ch-modal-footer">
              <button type="button" className="ch-btn-close-modal" onClick={() => setSelectedTx(null)}>
                Tutup
              </button>
              <button
                type="button"
                className="ch-btn-reprint"
                onClick={() => { handleReprintReceipt(selectedTx); setSelectedTx(null); }}
              >
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <polyline points="6 9 6 2 18 2 18 9" />
                  <path d="M6 18H4a2 2 0 0 1-2-2v-5a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2v5a2 2 0 0 1-2 2h-2" />
                  <rect x="6" y="14" width="12" height="8" />
                </svg>
                Cetak Ulang Struk
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
