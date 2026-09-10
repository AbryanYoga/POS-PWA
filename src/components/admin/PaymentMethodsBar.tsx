import React from "react";
import type { Language } from "@/lib/translations";

interface PaymentMethodsBarProps {
  qrisCount: number;
  cashCount: number;
  lang: Language;
}

export function PaymentMethodsBar({
  qrisCount,
  cashCount,
  lang,
}: PaymentMethodsBarProps) {
  const isEn = lang === "en";
  const maxCount = Math.max(qrisCount, cashCount, 1);
  const qrisHeight = `${Math.round((qrisCount / maxCount) * 80) + 15}%`;
  const cashHeight = `${Math.round((cashCount / maxCount) * 80) + 15}%`;

  return (
    <div className="ui-card">
      <div className="ui-card-header">
        <div className="ui-card-title-group">
          <h2>{isEn ? "Payment Methods" : "Payment Methods"}</h2>
          <p>{isEn ? "How customers pay" : "Cara pelanggan membayar"}</p>
        </div>
        <button type="button" className="btn-card-action-icon">
          •••
        </button>
      </div>

      <div className="payment-bars-grid">
        <div className="pay-bar-col">
          <span className="pay-bar-val-badge qris" id="dashQrisCountBadge">
            {qrisCount}
          </span>
          <div
            className="pay-bar-visual qris"
            id="dashQrisBarVisual"
            style={{ height: qrisHeight }}
          ></div>
          <span className="pay-bar-label">QRIS</span>
        </div>
        <div className="pay-bar-col">
          <span className="pay-bar-val-badge cash" id="dashCashCountBadge">
            {cashCount}
          </span>
          <div
            className="pay-bar-visual cash"
            id="dashCashBarVisual"
            style={{ height: cashHeight }}
          ></div>
          <span className="pay-bar-label">Cash</span>
        </div>
      </div>
    </div>
  );
}
