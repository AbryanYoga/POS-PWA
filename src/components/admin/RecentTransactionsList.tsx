import React from "react";
import type { RecentTransactionItem } from "@/lib/actions/dashboard-actions";
import type { Language } from "@/lib/translations";

interface RecentTransactionsListProps {
  transactions: RecentTransactionItem[];
  lang: Language;
}

export function RecentTransactionsList({
  transactions,
  lang,
}: RecentTransactionsListProps) {
  const isEn = lang === "en";

  const formatRupiah = (num: number) => {
    return "Rp " + Number(num || 0).toLocaleString("id-ID");
  };

  return (
    <div className="ui-card">
      <div className="ui-card-header">
        <div className="ui-card-title-group">
          <h2>{isEn ? "Recent Transactions" : "Recent Transactions"}</h2>
          <p>{isEn ? "Live direct sales activity" : "Aktivitas penjualan langsung"}</p>
        </div>
        <button type="button" className="btn-card-action-icon">
          •••
        </button>
      </div>

      <div className="recent-trx-list" id="dashRecentTrxList">
        {transactions.length === 0 ? (
          <div
            style={{
              textAlign: "center",
              color: "var(--text-muted, #737D78)",
              fontSize: 12,
              padding: "20px 0",
            }}
          >
            {isEn ? "No transactions recorded today." : "Belum ada transaksi hari ini."}
          </div>
        ) : (
          transactions.slice(0, 5).map((tx) => (
            <div className="recent-trx-item" key={tx.id}>
              <div className="recent-trx-info">
                <div className="trx-name">{tx.noTransaksi}</div>
                <div className="trx-meta">
                  {tx.kasir} • {tx.metode}
                </div>
              </div>
              <div className="recent-trx-amount">
                <div className="trx-price">{formatRupiah(tx.total)}</div>
                <div className="trx-status-pill">{isEn ? "SUCCESS" : "SUKSES"}</div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
