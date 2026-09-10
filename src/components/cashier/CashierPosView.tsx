"use client";

import React, { useState, useEffect, useTransition } from "react";
import Link from "next/link";
import { logoutAction } from "@/lib/actions/auth-actions";
import {
  processCheckoutAction,
  getPosCatalogData,
  type CheckoutResult,
} from "@/lib/actions/pos-actions";
import { useToast } from "@/components/ui/Toast";
import { formatRupiah } from "@/lib/utils";
import type { Language } from "@/lib/translations";
import "@/app/cashier/cashier.css";

interface ProductItem {
  id: string;
  categoryId: string | null;
  nama: string;
  barcode: string | null;
  sku: string | null;
  hargaJual: number;
  stok: number;
  gambar: string | null;
  isActive: boolean;
}

interface CartItem {
  product: ProductItem;
  qty: number;
  catatan?: string;
}

interface CashierPosViewProps {
  initialData: NonNullable<Awaited<ReturnType<typeof getPosCatalogData>>["data"]>;
}

export function CashierPosView({ initialData }: CashierPosViewProps) {
  const { showToast } = useToast();
  const [data, setData] = useState(initialData);
  const [cart, setCart] = useState<CartItem[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string>("ALL");
  const [searchQuery, setSearchQuery] = useState("");
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [lang, setLang] = useState<Language>("id");
  const [liveClock, setLiveClock] = useState("00:00:00");

  // Payment Modal States
  const [isPaymentModalOpen, setIsPaymentModalOpen] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState<"CASH" | "QRIS">("CASH");
  const [cashAmount, setCashAmount] = useState<number>(0);
  const [idempotencyKey, setIdempotencyKey] = useState<string>("");
  const [receiptWidth, setReceiptWidth] = useState<"58mm" | "80mm">("58mm");
  const [isSubmitting, startTransition] = useTransition();

  // Receipt Modal State
  const [completedTx, setCompletedTx] = useState<CheckoutResult["transaction"] | null>(null);

  const isEn = lang === "en";

  // Clock Ticker
  useEffect(() => {
    const timer = setInterval(() => {
      const now = new Date();
      setLiveClock(now.toLocaleTimeString("id-ID", { hour12: false }));
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  // Filter Products
  const filteredProducts = data.products.filter((p) => {
    const matchCat =
      selectedCategory === "ALL" || p.categoryId === selectedCategory;
    const matchSearch =
      searchQuery.trim() === "" ||
      p.nama.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (p.barcode && p.barcode.toLowerCase().includes(searchQuery.toLowerCase())) ||
      (p.sku && p.sku.toLowerCase().includes(searchQuery.toLowerCase()));
    return matchCat && matchSearch;
  });

  // Cart Calculations
  const cartSubtotal = cart.reduce(
    (sum, item) => sum + item.product.hargaJual * item.qty,
    0
  );
  const cartTotalItems = cart.reduce((sum, item) => sum + item.qty, 0);

  // Add to Cart
  const handleAddToCart = (product: ProductItem) => {
    if (product.stok <= 0) {
      showToast(
        isEn ? "Out of stock!" : `Stok "${product.nama}" habis!`,
        "error"
      );
      return;
    }

    setCart((prev) => {
      const existing = prev.find((item) => item.product.id === product.id);
      if (existing) {
        if (existing.qty >= product.stok) {
          showToast(
            isEn
              ? `Max stock reached (${product.stok} items)!`
              : `Jumlah melebihi batas stok (${product.stok} unit)!`,
            "error"
          );
          return prev;
        }
        return prev.map((item) =>
          item.product.id === product.id
            ? { ...item, qty: item.qty + 1 }
            : item
        );
      }
      return [...prev, { product, qty: 1 }];
    });
  };

  const handleUpdateQty = (productId: string, delta: number) => {
    setCart((prev) =>
      prev
        .map((item) => {
          if (item.product.id === productId) {
            const nextQty = item.qty + delta;
            if (nextQty > item.product.stok) {
              showToast(
                `Stok maksimal "${item.product.nama}" adalah ${item.product.stok} unit.`,
                "error"
              );
              return item;
            }
            return { ...item, qty: nextQty };
          }
          return item;
        })
        .filter((item) => item.qty > 0)
    );
  };

  const handleRemoveCartItem = (productId: string) => {
    setCart((prev) => prev.filter((item) => item.product.id !== productId));
  };

  const handleClearCart = () => {
    setCart([]);
  };

  const handleOpenPayment = () => {
    if (cart.length === 0) return;
    setCashAmount(cartSubtotal); // default exact amount
    setPaymentMethod("CASH");
    // Generate fresh UUID idempotency key on each payment modal open
    const generatedKey =
      typeof crypto !== "undefined" && crypto.randomUUID
        ? crypto.randomUUID()
        : `idemp_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`;
    setIdempotencyKey(generatedKey);
    setIsPaymentModalOpen(true);
  };

  const handleProcessPayment = () => {
    if (isSubmitting) return;

    if (paymentMethod === "CASH" && cashAmount < cartSubtotal) {
      showToast(
        isEn
          ? "Cash paid is less than total amount!"
          : "Uang pembayaran tunai kurang dari total belanja!",
        "error"
      );
      return;
    }

    startTransition(async () => {
      try {
        const payload = {
          items: cart.map((c) => ({
            productId: c.product.id,
            qty: c.qty,
            catatan: c.catatan,
          })),
          metodePembayaran: paymentMethod,
          bayar: paymentMethod === "CASH" ? cashAmount : cartSubtotal,
          kembalian:
            paymentMethod === "CASH"
              ? Math.max(0, cashAmount - cartSubtotal)
              : 0,
          idempotencyKey,
        };

        const res = await processCheckoutAction(payload);

        if (res.success && res.transaction) {
          showToast(
            isEn ? "Transaction successful!" : "Transaksi berhasil diproses!",
            "success"
          );
          setCompletedTx(res.transaction);
          setIsPaymentModalOpen(false);
          setCart([]);

          // Refresh catalog data to update stock numbers & next transaction ID
          const fresh = await getPosCatalogData();
          if (fresh.success && fresh.data) {
            setData(fresh.data);
          }
        } else {
          showToast(
            res.message || "Gagal memproses pembayaran.",
            "error"
          );
        }
      } catch (err: any) {
        showToast(
          err?.message || "Terjadi kesalahan sistem saat checkout.",
          "error"
        );
      }
    });
  };

  const handleCopyReceiptText = () => {
    if (!completedTx) return;
    const lines = [
      `================================`,
      `       ${data.store.namaToko.toUpperCase()}`,
      data.store.alamat ? `   ${data.store.alamat}` : "",
      data.store.telepon ? `   Telp: ${data.store.telepon}` : "",
      `================================`,
      `No. Trx : ${completedTx.noTransaksi}`,
      `Waktu   : ${completedTx.createdAt}`,
      `Kasir   : ${completedTx.kasirNama}`,
      `--------------------------------`,
      ...completedTx.items.map(
        (it) =>
          `${it.nama}\n  ${it.qty} x Rp ${it.harga.toLocaleString("id-ID")} = Rp ${it.subtotal.toLocaleString("id-ID")}`
      ),
      `--------------------------------`,
      `TOTAL   : Rp ${completedTx.total.toLocaleString("id-ID")}`,
      `BAYAR   : Rp ${completedTx.bayar.toLocaleString("id-ID")} (${completedTx.metodePembayaran})`,
      completedTx.metodePembayaran === "CASH"
        ? `KEMBALI : Rp ${completedTx.kembalian.toLocaleString("id-ID")}`
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

  const changeAmount = Math.max(0, cashAmount - cartSubtotal);

  return (
    <div className="pos-app">
      {/* 1. HEADER */}
      <header className="pos-header">
        <div className="header-left">
          {data.cashier.role === "ADMIN" && (
            <Link
              href="/admin"
              className="btn-back-header"
              title={isEn ? "Back to Admin Dashboard" : "Kembali ke Admin"}
            >
              <svg
                width="18"
                height="18"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
              >
                <line x1="19" y1="12" x2="5" y2="12" />
                <polyline points="12 19 5 12 12 5" />
              </svg>
            </Link>
          )}

          <div className="header-trx-info">
            <div className="trx-title">
              <span>{isEn ? "Transaction" : "Transaksi"}</span>
              <span className="trx-number" id="headerTrxNumber">
                {data.nextNoTransaksi}
              </span>
            </div>
            <div className="cashier-subtext">
              <span>{isEn ? "Cashier:" : "Kasir:"}</span>
              <strong id="headerCashierName">{data.cashier.namaLengkap}</strong>
              <span className="store-badge" id="headerStoreBadge">
                {data.store.kodeToko}
              </span>
            </div>
          </div>
        </div>

        {/* Center Search */}
        <div className="header-center">
          <div className="search-container">
            <div className="search-icon-svg">
              <svg
                width="18"
                height="18"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
              >
                <circle cx="11" cy="11" r="8" />
                <line x1="21" y1="21" x2="16.65" y2="16.65" />
              </svg>
            </div>
            <input
              type="text"
              id="searchInput"
              className="search-input-box"
              placeholder={
                isEn
                  ? "Search product or scan barcode..."
                  : "Cari produk atau scan barcode..."
              }
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              autoComplete="off"
            />
            {searchQuery && (
              <button
                type="button"
                className="search-clear-btn"
                onClick={() => setSearchQuery("")}
              >
                ✕
              </button>
            )}
          </div>
        </div>

        {/* Right Tools */}
        <div className="header-right">
          <div className="view-switch-group">
            <button
              type="button"
              className={`view-switch-btn ${viewMode === "grid" ? "active" : ""}`}
              onClick={() => setViewMode("grid")}
              title="Grid View"
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <rect x="3" y="3" width="7" height="7" />
                <rect x="14" y="3" width="7" height="7" />
                <rect x="14" y="14" width="7" height="7" />
                <rect x="3" y="14" width="7" height="7" />
              </svg>
            </button>
            <button
              type="button"
              className={`view-switch-btn ${viewMode === "list" ? "active" : ""}`}
              onClick={() => setViewMode("list")}
              title="List View"
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <line x1="8" y1="6" x2="21" y2="6" />
                <line x1="8" y1="12" x2="21" y2="12" />
                <line x1="8" y1="18" x2="21" y2="18" />
                <line x1="3" y1="6" x2="3.01" y2="6" />
                <line x1="3" y1="12" x2="3.01" y2="12" />
                <line x1="3" y1="18" x2="3.01" y2="18" />
              </svg>
            </button>
          </div>

          <div className="header-clock-pill">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <circle cx="12" cy="12" r="10" />
              <polyline points="12 6 12 12 16 14" />
            </svg>
            <span>{liveClock}</span>
          </div>

          <Link
            href="/cashier/history"
            className="btn-header-action"
            title={isEn ? "My Transaction History" : "Riwayat Transaksi Saya"}
            id="btnHistoryLink"
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
              <polyline points="14 2 14 8 20 8" />
              <line x1="16" y1="13" x2="8" y2="13" />
              <line x1="16" y1="17" x2="8" y2="17" />
            </svg>
            <span>{isEn ? "History" : "Riwayat"}</span>
          </Link>

          <form action={logoutAction}>
            <button
              type="submit"
              className="btn-header-action"
              title={isEn ? "Logout Cashier" : "Keluar dari Kasir"}
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
                <polyline points="16 17 21 12 16 7" />
                <line x1="21" y1="12" x2="9" y2="12" />
              </svg>
              <span>{isEn ? "Logout" : "Keluar"}</span>
            </button>
          </form>
        </div>
      </header>

      {/* 2. MAIN LAYOUT */}
      <main className="pos-main-layout">
        {/* CATALOG VIEWPORT (LEFT) */}
        <section className="catalog-viewport">
          {/* Category Chips */}
          <div className="category-pills-bar">
            <button
              type="button"
              className={`cat-pill ${selectedCategory === "ALL" ? "active" : ""}`}
              onClick={() => setSelectedCategory("ALL")}
            >
              <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <rect x="3" y="3" width="7" height="7" />
                <rect x="14" y="3" width="7" height="7" />
                <rect x="14" y="14" width="7" height="7" />
                <rect x="3" y="14" width="7" height="7" />
              </svg>
              <span>{isEn ? "All Items" : "Semua Menu"}</span>
            </button>
            {data.categories.map((c) => (
              <button
                type="button"
                key={c.id}
                className={`cat-pill ${selectedCategory === c.id ? "active" : ""}`}
                onClick={() => setSelectedCategory(c.id)}
              >
                <span>{c.nama}</span>
              </button>
            ))}
          </div>

          {/* Status Bar */}
          <div className="catalog-status-bar">
            <div>
              <span>{isEn ? "Showing" : "Menampilkan"}</span>{" "}
              <strong>{filteredProducts.length}</strong>{" "}
              <span>{isEn ? "products" : "produk"}</span>
            </div>
            <div>
              {selectedCategory === "ALL"
                ? isEn ? "All Categories" : "Semua Kategori"
                : data.categories.find((c) => c.id === selectedCategory)?.nama}
            </div>
          </div>

          {/* Product Grid */}
          <div className={`product-grid ${viewMode === "list" ? "list-view" : ""}`}>
            {filteredProducts.length === 0 ? (
              <div
                style={{
                  gridColumn: "1 / -1",
                  textAlign: "center",
                  padding: "40px 0",
                  color: "var(--text-muted)",
                }}
              >
                {isEn
                  ? "No products found matching your search."
                  : "Tidak ada produk yang cocok dengan pencarian."}
              </div>
            ) : (
              filteredProducts.map((p) => {
                const isOutOfStock = p.stok <= 0;
                return (
                  <div
                    className="product-card"
                    key={p.id}
                    onClick={() => handleAddToCart(p)}
                    style={{ opacity: isOutOfStock ? 0.6 : 1 }}
                  >
                    <div className="product-card-img-wrap">
                      <img
                        src={
                          p.gambar ||
                          "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?auto=format&fit=crop&w=400&q=80"
                        }
                        alt={p.nama}
                        className="product-card-img"
                        loading="lazy"
                      />
                      <span
                        className={`product-badge-stock ${
                          p.stok <= 5 ? "low" : ""
                        }`}
                      >
                        {isOutOfStock
                          ? isEn ? "SOLD OUT" : "HABIS"
                          : `${p.stok} unit`}
                      </span>
                    </div>
                    <div className="product-card-body">
                      <div className="product-title">{p.nama}</div>
                      <div className="product-price">
                        {formatRupiah(p.hargaJual)}
                      </div>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </section>

        {/* 3. CART PANEL (RIGHT) */}
        <aside className="cart-panel-wrapper" id="cartPanel">
          <div className="cart-header-row">
            <div className="cart-header-title-group">
              <h2 className="cart-header-title">
                {isEn ? "Current Order" : "Pesanan Saat Ini"}
              </h2>
              <span className="cart-count-pill" id="cartCountBadge">
                {cartTotalItems} {isEn ? "items" : "item"}
              </span>
            </div>
            {cart.length > 0 && (
              <button
                type="button"
                className="btn-clear-cart-text"
                onClick={handleClearCart}
              >
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <polyline points="3 6 5 6 21 6" />
                  <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" />
                </svg>
                <span>{isEn ? "Clear" : "Kosongkan"}</span>
              </button>
            )}
          </div>

          {/* Cart Items List */}
          <div className="cart-items-scroll-area">
            {cart.length === 0 ? (
              <div className="cart-empty-view">
                <div className="cart-empty-icon-wrap">
                  <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75">
                    <circle cx="9" cy="21" r="1" />
                    <circle cx="20" cy="21" r="1" />
                    <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6" />
                  </svg>
                </div>
                <div className="cart-empty-title">
                  {isEn ? "Cart is empty" : "Keranjang Masih Kosong"}
                </div>
                <div className="cart-empty-desc">
                  {isEn
                    ? "Click on items in the catalog to add to order."
                    : "Klik produk pada katalog sebelah kiri untuk menambahkan pesanan."}
                </div>
              </div>
            ) : (
              cart.map((item) => (
                <div className="cart-item-card" key={item.product.id}>
                  <div className="cart-item-top">
                    <div>
                      <div className="cart-item-title">{item.product.nama}</div>
                      <div className="cart-item-unit-price">
                        {formatRupiah(item.product.hargaJual)}
                      </div>
                    </div>
                    <button
                      type="button"
                      onClick={() => handleRemoveCartItem(item.product.id)}
                      style={{
                        background: "none",
                        border: "none",
                        color: "var(--text-subtle)",
                        cursor: "pointer",
                      }}
                    >
                      ✕
                    </button>
                  </div>
                  <div className="cart-item-bottom">
                    <div className="qty-control-wrap">
                      <button
                        type="button"
                        className="qty-btn"
                        onClick={() => handleUpdateQty(item.product.id, -1)}
                      >
                        -
                      </button>
                      <span className="qty-value">{item.qty}</span>
                      <button
                        type="button"
                        className="qty-btn"
                        onClick={() => handleUpdateQty(item.product.id, 1)}
                      >
                        +
                      </button>
                    </div>
                    <div className="cart-item-subtotal">
                      {formatRupiah(item.product.hargaJual * item.qty)}
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>

          {/* Sticky Checkout Summary */}
          <div className="cart-footer-checkout">
            <div className="summary-calc-list">
              <div className="calc-row">
                <span>Subtotal</span>
                <span>{formatRupiah(cartSubtotal)}</span>
              </div>
              <div className="calc-row total-hero-row">
                <span>Total</span>
                <span>{formatRupiah(cartSubtotal)}</span>
              </div>
            </div>

            <button
              type="button"
              className="btn-charge-action"
              id="btnCheckout"
              disabled={cart.length === 0}
              onClick={handleOpenPayment}
            >
              <span>{isEn ? "Proceed to Payment" : "Lanjut Pembayaran"}</span>
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2">
                <line x1="5" y1="12" x2="19" y2="12" />
                <polyline points="12 5 19 12 12 19" />
              </svg>
            </button>
          </div>
        </aside>
      </main>

      {/* 4. PAYMENT MODAL */}
      {isPaymentModalOpen && (
        <div className="payment-modal-backdrop" id="paymentModal">
          <div className="payment-card-shell">
            <div className="payment-modal-header">
              <h3 style={{ fontSize: 16, fontWeight: 700, fontFamily: "var(--font-heading)" }}>
                {isEn ? "Payment Method" : "Pilih Metode Pembayaran"}
              </h3>
              <button
                type="button"
                onClick={() => setIsPaymentModalOpen(false)}
                style={{ background: "none", border: "none", fontSize: 18, cursor: "pointer" }}
              >
                ✕
              </button>
            </div>

            <div className="payment-modal-body">
              <div className="calc-row total-hero-row" style={{ margin: 0, padding: "0 0 8px 0" }}>
                <span>{isEn ? "Grand Total" : "Total Tagihan"}</span>
                <span style={{ fontSize: 20 }}>{formatRupiah(cartSubtotal)}</span>
              </div>

              {/* Methods Grid */}
              <div className="payment-methods-grid">
                <div
                  className={`payment-method-card ${paymentMethod === "CASH" ? "active" : ""}`}
                  onClick={() => setPaymentMethod("CASH")}
                >
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <rect x="2" y="6" width="20" height="12" rx="2" />
                    <circle cx="12" cy="12" r="2" />
                  </svg>
                  <span style={{ fontWeight: 600, fontSize: 13 }}>Tunai (Cash)</span>
                </div>
                <div
                  className={`payment-method-card ${paymentMethod === "QRIS" ? "active" : ""}`}
                  onClick={() => setPaymentMethod("QRIS")}
                >
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <rect x="3" y="3" width="7" height="7" />
                    <rect x="14" y="3" width="7" height="7" />
                    <rect x="14" y="14" width="7" height="7" />
                    <rect x="3" y="14" width="7" height="7" />
                  </svg>
                  <span style={{ fontWeight: 600, fontSize: 13 }}>QRIS (Non-Cash)</span>
                </div>
              </div>

              {paymentMethod === "CASH" ? (
                <>
                  <div>
                    <label style={{ fontSize: 12, fontWeight: 600, display: "block", marginBottom: 6 }}>
                      {isEn ? "Cash Received" : "Uang Diterima (Rp)"}
                    </label>
                    <input
                      type="number"
                      className="search-input-box"
                      style={{ padding: "0 14px", fontFamily: "var(--font-mono)", fontSize: 16, fontWeight: 700 }}
                      value={cashAmount || ""}
                      onChange={(e) => setCashAmount(Number(e.target.value) || 0)}
                      placeholder="0"
                    />
                  </div>

                  {/* Quick Money Buttons */}
                  <div className="quick-money-grid">
                    <button
                      type="button"
                      className="quick-money-btn"
                      onClick={() => setCashAmount(cartSubtotal)}
                    >
                      Uang Pas
                    </button>
                    <button
                      type="button"
                      className="quick-money-btn"
                      onClick={() => setCashAmount(50000)}
                    >
                      50.000
                    </button>
                    <button
                      type="button"
                      className="quick-money-btn"
                      onClick={() => setCashAmount(100000)}
                    >
                      100.000
                    </button>
                    <button
                      type="button"
                      className="quick-money-btn"
                      onClick={() => setCashAmount(200000)}
                    >
                      200.000
                    </button>
                  </div>

                  {/* Change Preview */}
                  <div className="change-preview-box">
                    <span>{isEn ? "Change:" : "Kembalian:"}</span>
                    <span style={{ fontFamily: "var(--font-mono)", fontSize: 18, color: "var(--primary)" }}>
                      {formatRupiah(changeAmount)}
                    </span>
                  </div>
                </>
              ) : (
                <div style={{ textAlign: "center", padding: "16px 0", color: "var(--text-muted)" }}>
                  <div
                    style={{
                      width: 140,
                      height: 140,
                      margin: "0 auto 12px auto",
                      border: "2px dashed var(--border)",
                      borderRadius: 8,
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      background: "var(--bg-muted)",
                      fontWeight: 700,
                      color: "var(--primary)",
                    }}
                  >
                    QRIS CODE
                  </div>
                  <p style={{ fontSize: 12 }}>
                    {isEn
                      ? "Ask customer to scan dynamic QRIS code."
                      : "Arahkan pelanggan untuk memindai kode QRIS pada monitor kasir."}
                  </p>
                </div>
              )}

              <button
                type="button"
                className="btn-charge-action"
                id="btnSubmitPayment"
                disabled={isSubmitting || (paymentMethod === "CASH" && cashAmount < cartSubtotal)}
                onClick={handleProcessPayment}
              >
                {isSubmitting ? (
                  <span className="btn-loading-wrap">
                    <span className="spinner-sm"></span>
                    <span>{isEn ? "Processing Transaction..." : "Memproses Transaksi..."}</span>
                  </span>
                ) : (
                  <span>{isEn ? "Complete Payment" : "Selesaikan Pembayaran"}</span>
                )}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 5. RECEIPT MODAL */}
      {completedTx && (
        <div className="payment-modal-backdrop">
          <div className="payment-card-shell" style={{ maxWidth: 400 }}>
            <div className="payment-modal-header">
              <h3 style={{ fontSize: 15, fontWeight: 700 }}>
                {isEn ? "Transaction Receipt" : "Struk Transaksi"}
              </h3>
              <button
                type="button"
                onClick={() => setCompletedTx(null)}
                style={{ background: "none", border: "none", fontSize: 18, cursor: "pointer" }}
              >
                ✕
              </button>
            </div>

            <div className="payment-modal-body">
              {/* Width Selector */}
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

              {/* Receipt Paper */}
              <div className={`receipt-paper-wrap width-${receiptWidth}`} id="printableReceipt">
                <div style={{ textAlign: "center", borderBottom: "1px dashed #333", paddingBottom: 10, marginBottom: 10 }}>
                  <div style={{ fontWeight: 800, fontSize: 14 }}>{data.store.namaToko}</div>
                  {data.store.alamat && <div style={{ fontSize: 10, color: "#666" }}>{data.store.alamat}</div>}
                  {data.store.telepon && <div style={{ fontSize: 10, color: "#666" }}>Telp: {data.store.telepon}</div>}
                </div>

                <div style={{ display: "flex", justifyContent: "space-between", fontSize: 10, marginBottom: 6 }}>
                  <span>No: {completedTx.noTransaksi}</span>
                  <span>{completedTx.createdAt}</span>
                </div>
                <div style={{ fontSize: 10, marginBottom: 8 }}>
                  Kasir: {completedTx.kasirNama}
                </div>

                <div style={{ borderTop: "1px dashed #333", borderBottom: "1px dashed #333", padding: "8px 0", marginBottom: 8 }}>
                  {completedTx.items.map((it, idx) => (
                    <div key={idx} style={{ marginBottom: 4 }}>
                      <div style={{ display: "flex", justifyContent: "space-between" }}>
                        <span>{it.nama}</span>
                        <span>{formatRupiah(it.subtotal)}</span>
                      </div>
                      <div style={{ fontSize: 10, color: "#666" }}>
                        {it.qty} x {formatRupiah(it.harga)}
                      </div>
                    </div>
                  ))}
                </div>

                <div style={{ display: "flex", justifyContent: "space-between", fontWeight: 700, marginBottom: 4 }}>
                  <span>TOTAL:</span>
                  <span>{formatRupiah(completedTx.total)}</span>
                </div>
                <div style={{ display: "flex", justifyContent: "space-between", fontSize: 10 }}>
                  <span>BAYAR ({completedTx.metodePembayaran}):</span>
                  <span>{formatRupiah(completedTx.bayar)}</span>
                </div>
                {completedTx.metodePembayaran === "CASH" && (
                  <div style={{ display: "flex", justifyContent: "space-between", fontSize: 10 }}>
                    <span>KEMBALIAN:</span>
                    <span>{formatRupiah(completedTx.kembalian)}</span>
                  </div>
                )}

                <div style={{ textAlign: "center", marginTop: 14, paddingTop: 10, borderTop: "1px dashed #333", fontSize: 10, color: "#555" }}>
                  Terima kasih atas kunjungan Anda!
                </div>
              </div>

              {/* Modal Actions */}
              <div style={{ display: "flex", flexDirection: "column", gap: 8, marginTop: 12 }}>
                <div style={{ display: "flex", gap: 8 }}>
                  <button
                    type="button"
                    className="btn-charge-action"
                    onClick={() => window.print()}
                    style={{ flex: 1, background: "var(--secondary)" }}
                  >
                    🖨️ {isEn ? "Print Receipt" : "Cetak Thermal"}
                  </button>
                  <button
                    type="button"
                    className="btn-charge-action"
                    onClick={handleCopyReceiptText}
                    style={{ flex: 1, background: "var(--bg-muted)", color: "var(--text-heading)", border: "1px solid var(--border)" }}
                  >
                    📋 {isEn ? "Copy Text" : "Salin Teks"}
                  </button>
                </div>
                <button
                  type="button"
                  className="btn-charge-action"
                  onClick={() => setCompletedTx(null)}
                  style={{ width: "100%" }}
                >
                  ✓ {isEn ? "New Order" : "Transaksi Baru"}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
