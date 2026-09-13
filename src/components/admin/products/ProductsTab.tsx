"use client";

import React, {
  useState,
  useEffect,
  useTransition,
  useCallback,
  useRef,
} from "react";
import type { Language } from "@/lib/translations";
import type { ProductItem } from "@/lib/actions/product-actions";
import type { CategoryItem } from "@/lib/actions/category-actions";
import {
  getProductsList,
  createProductAction,
  updateProductAction,
  toggleProductStatusAction,
  deleteProductAction,
  adjustStockAction,
} from "@/lib/actions/product-actions";
import { getCategoriesList } from "@/lib/actions/category-actions";
import { useToast } from "@/components/ui/Toast";
import { formatRupiah } from "@/lib/utils";

interface Props {
  lang: Language;
}

type ModalMode = "create" | "edit" | "delete" | "stock" | null;

interface ProductForm {
  nama: string;
  categoryId: string;
  barcode: string;
  sku: string;
  hargaBeli: string;
  hargaJual: string;
  stok: string;
  stokMinimum: string;
  gambar: string; // Base64 data URL atau URL string
}

const EMPTY_FORM: ProductForm = {
  nama: "",
  categoryId: "",
  barcode: "",
  sku: "",
  hargaBeli: "0",
  hargaJual: "0",
  stok: "0",
  stokMinimum: "5",
  gambar: "",
};

interface StockForm {
  tipe: "IN" | "ADJUSTMENT";
  qty: string;
  keterangan: string;
}

const EMPTY_STOCK_FORM: StockForm = {
  tipe: "IN",
  qty: "1",
  keterangan: "",
};

const PAGE_SIZE = 20;

export function ProductsTab({ lang }: Props) {
  const isEn = lang === "en";
  const { showToast } = useToast();

  const [productList, setProductList] = useState<ProductItem[]>([]);
  const [categories, setCategories] = useState<CategoryItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [isPending, startTransition] = useTransition();

  const [modalMode, setModalMode] = useState<ModalMode>(null);
  const [selectedProduct, setSelectedProduct] = useState<ProductItem | null>(null);
  const [form, setForm] = useState<ProductForm>(EMPTY_FORM);
  const [stockForm, setStockForm] = useState<StockForm>(EMPTY_STOCK_FORM);
  const [formError, setFormError] = useState("");

  const [searchQuery, setSearchQuery] = useState("");
  const [filterCategoryId, setFilterCategoryId] = useState("");
  const [filterStatus, setFilterStatus] = useState<"all" | "active" | "inactive">("all");
  const [currentPage, setCurrentPage] = useState(1);

  const [isDragOver, setIsDragOver] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // ── Load data ────────────────────────────────────────────────────────────
  const loadData = useCallback(async () => {
    setLoading(true);
    const [prodRes, catRes] = await Promise.all([
      getProductsList(),
      getCategoriesList(),
    ]);
    if (prodRes.success && prodRes.data) setProductList(prodRes.data);
    else showToast(prodRes.error ?? "Gagal memuat produk.", "error");
    if (catRes.success && catRes.data) setCategories(catRes.data);
    setLoading(false);
  }, [showToast]);

  useEffect(() => {
    loadData();
  }, [loadData]);

  // ── Filter & Pagination ──────────────────────────────────────────────────
  const filtered = productList.filter((p) => {
    const q = searchQuery.toLowerCase();
    const matchQuery =
      p.nama.toLowerCase().includes(q) ||
      (p.barcode ?? "").toLowerCase().includes(q) ||
      (p.sku ?? "").toLowerCase().includes(q);
    const matchCat = filterCategoryId
      ? p.categoryId === filterCategoryId
      : true;
    const matchStatus =
      filterStatus === "all"
        ? true
        : filterStatus === "active"
        ? p.isActive
        : !p.isActive;
    return matchQuery && matchCat && matchStatus;
  });

  const totalPages = Math.ceil(filtered.length / PAGE_SIZE);
  const paginated = filtered.slice(
    (currentPage - 1) * PAGE_SIZE,
    currentPage * PAGE_SIZE
  );

  // Reset ke page 1 saat filter berubah
  useEffect(() => {
    setCurrentPage(1);
  }, [searchQuery, filterCategoryId, filterStatus]);

  // ── Image helpers ────────────────────────────────────────────────────────
  function handleImageFile(file: File) {
    if (file.size > 2 * 1024 * 1024) {
      setFormError(isEn ? "Image size exceeds 2MB limit." : "Gambar maksimal 2MB.");
      return;
    }
    const reader = new FileReader();
    reader.onload = (e) => {
      setForm((f) => ({ ...f, gambar: e.target?.result as string }));
      setFormError("");
    };
    reader.readAsDataURL(file);
  }

  function handleDrop(e: React.DragEvent) {
    e.preventDefault();
    setIsDragOver(false);
    const file = e.dataTransfer.files[0];
    if (file && file.type.startsWith("image/")) handleImageFile(file);
  }

  // ── Modal helpers ────────────────────────────────────────────────────────
  function openCreate() {
    setForm(EMPTY_FORM);
    setFormError("");
    setSelectedProduct(null);
    setModalMode("create");
  }

  function openEdit(p: ProductItem) {
    setForm({
      nama: p.nama,
      categoryId: p.categoryId ?? "",
      barcode: p.barcode ?? "",
      sku: p.sku ?? "",
      hargaBeli: p.hargaBeli,
      hargaJual: p.hargaJual,
      stok: p.stok.toString(),
      stokMinimum: p.stokMinimum.toString(),
      gambar: p.gambar ?? "",
    });
    setFormError("");
    setSelectedProduct(p);
    setModalMode("edit");
  }

  function openStock(p: ProductItem) {
    setStockForm(EMPTY_STOCK_FORM);
    setFormError("");
    setSelectedProduct(p);
    setModalMode("stock");
  }

  function openDelete(p: ProductItem) {
    setSelectedProduct(p);
    setModalMode("delete");
  }

  function closeModal() {
    setModalMode(null);
    setSelectedProduct(null);
    setFormError("");
  }

  // ── Validate & Submit Product Form ───────────────────────────────────────
  function validateForm(): boolean {
    if (!form.nama.trim()) {
      setFormError(isEn ? "Product name is required." : "Nama produk wajib diisi.");
      return false;
    }
    const hargaJual = parseFloat(form.hargaJual);
    if (isNaN(hargaJual) || hargaJual <= 0) {
      setFormError(isEn ? "Selling price must be greater than 0." : "Harga jual harus lebih dari 0.");
      return false;
    }
    const hargaBeli = parseFloat(form.hargaBeli);
    if (isNaN(hargaBeli) || hargaBeli < 0) {
      setFormError(isEn ? "Purchase price is invalid." : "Harga beli tidak valid.");
      return false;
    }
    return true;
  }

  function handleCreate() {
    if (!validateForm()) return;
    startTransition(async () => {
      const res = await createProductAction({
        nama: form.nama.trim(),
        categoryId: form.categoryId || undefined,
        barcode: form.barcode || undefined,
        sku: form.sku || undefined,
        hargaBeli: parseFloat(form.hargaBeli) || 0,
        hargaJual: parseFloat(form.hargaJual),
        stok: parseInt(form.stok, 10) || 0,
        stokMinimum: parseInt(form.stokMinimum, 10) || 5,
        gambar: form.gambar || undefined,
      });
      if (res.success) {
        showToast(res.message ?? (isEn ? "Product added." : "Produk ditambahkan."), "success");
        closeModal();
        await loadData();
      } else {
        setFormError(res.message ?? (isEn ? "Failed to add product." : "Gagal menambahkan produk."));
      }
    });
  }

  function handleEdit() {
    if (!validateForm()) return;
    if (!selectedProduct) return;
    startTransition(async () => {
      const res = await updateProductAction({
        productId: selectedProduct.id,
        nama: form.nama.trim(),
        categoryId: form.categoryId || null,
        barcode: form.barcode || null,
        sku: form.sku || null,
        hargaBeli: parseFloat(form.hargaBeli) || 0,
        hargaJual: parseFloat(form.hargaJual),
        stokMinimum: parseInt(form.stokMinimum, 10) || 5,
        gambar: form.gambar || null,
      });
      if (res.success) {
        showToast(res.message ?? (isEn ? "Product updated." : "Produk diperbarui."), "success");
        closeModal();
        await loadData();
      } else {
        setFormError(res.message ?? (isEn ? "Failed to update product." : "Gagal memperbarui produk."));
      }
    });
  }

  function handleToggleStatus(p: ProductItem) {
    startTransition(async () => {
      const res = await toggleProductStatusAction(p.id);
      if (res.success) {
        showToast(res.message ?? (isEn ? "Status updated." : "Status diubah."), "success");
        await loadData();
      } else {
        showToast(res.message ?? (isEn ? "Failed to toggle status." : "Gagal mengubah status."), "error");
      }
    });
  }

  function handleDelete() {
    if (!selectedProduct) return;
    startTransition(async () => {
      const res = await deleteProductAction(selectedProduct.id);
      if (res.success) {
        showToast(res.message ?? (isEn ? "Product deleted." : "Produk dihapus."), "success");
        closeModal();
        await loadData();
      } else {
        showToast(res.message ?? (isEn ? "Failed to delete product." : "Gagal menghapus produk."), "error");
        closeModal();
      }
    });
  }

  function handleAdjustStock() {
    if (!selectedProduct) return;
    if (!stockForm.keterangan.trim()) {
      setFormError(isEn ? "Notes are required for stock adjustment." : "Keterangan wajib diisi untuk penyesuaian stok.");
      return;
    }
    const qty = parseInt(stockForm.qty, 10);
    if (isNaN(qty) || qty === 0) {
      setFormError(isEn ? "Quantity is required." : "Jumlah stok harus diisi (bisa negatif untuk ADJUSTMENT).");
      return;
    }
    startTransition(async () => {
      const res = await adjustStockAction({
        productId: selectedProduct.id,
        tipe: stockForm.tipe,
        qty,
        keterangan: stockForm.keterangan.trim(),
      });
      if (res.success) {
        showToast(res.message ?? (isEn ? "Stock adjusted." : "Stok diperbarui."), "success");
        closeModal();
        await loadData();
      } else {
        setFormError(res.message ?? (isEn ? "Failed to adjust stock." : "Gagal menyesuaikan stok."));
      }
    });
  }

  // ── Shared Form Fields ───────────────────────────────────────────────────
  function renderProductForm() {
    return (
      <>
        {formError && (
          <div className="product-form-error">
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <circle cx="12" cy="12" r="10" />
              <line x1="12" y1="8" x2="12" y2="12" />
              <line x1="12" y1="16" x2="12.01" y2="16" />
            </svg>
            <span>{formError}</span>
          </div>
        )}

        {/* Gambar drag & drop */}
        <div className="product-form-group">
          <label>{isEn ? "Product Image" : "Gambar Produk"}</label>
          <div
            className={`product-image-dropzone ${isDragOver ? "dragover" : ""}`}
            onDragOver={(e) => {
              e.preventDefault();
              setIsDragOver(true);
            }}
            onDragLeave={() => setIsDragOver(false)}
            onDrop={handleDrop}
            onClick={() => fileInputRef.current?.click()}
          >
            {form.gambar ? (
              <>
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={form.gambar}
                  alt="preview"
                  className="product-image-preview"
                />
                <button
                  type="button"
                  className="product-image-remove-btn"
                  onClick={(e) => {
                    e.stopPropagation();
                    setForm((f) => ({ ...f, gambar: "" }));
                  }}
                >
                  {isEn ? "Remove image" : "Hapus gambar"}
                </button>
              </>
            ) : (
              <>
                <svg
                  width="32"
                  height="32"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.5"
                  className="product-image-icon"
                >
                  <rect x="3" y="3" width="18" height="18" rx="2" />
                  <circle cx="8.5" cy="8.5" r="1.5" />
                  <polyline points="21 15 16 10 5 21" />
                </svg>
                <span className="product-image-title">
                  {isEn
                    ? "Drag & drop image or click to browse"
                    : "Drag & drop gambar atau klik untuk pilih"}
                </span>
                <span className="product-image-hint">
                  {isEn ? "Max 2MB, JPG / PNG / WEBP" : "Maks 2MB, JPG / PNG / WEBP"}
                </span>
              </>
            )}
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              style={{ display: "none" }}
              onChange={(e) => {
                const file = e.target.files?.[0];
                if (file) handleImageFile(file);
              }}
            />
          </div>
        </div>

        {/* Nama & Kategori */}
        <div className="product-form-row">
          <div className="product-form-group">
            <label htmlFor="prodNama">
              {isEn ? "Product Name" : "Nama Produk"} <span style={{ color: "var(--danger)" }}>*</span>
            </label>
            <input
              id="prodNama"
              type="text"
              className="product-form-input"
              placeholder={isEn ? "e.g. Nasi Goreng" : "cth. Nasi Goreng"}
              value={form.nama}
              onChange={(e) => setForm((f) => ({ ...f, nama: e.target.value }))}
            />
          </div>
          <div className="product-form-group">
            <label htmlFor="prodKategori">
              {isEn ? "Category" : "Kategori"}
            </label>
            <select
              id="prodKategori"
              className="product-form-select"
              value={form.categoryId}
              onChange={(e) => setForm((f) => ({ ...f, categoryId: e.target.value }))}
            >
              <option value="">
                — {isEn ? "No Category" : "Tanpa Kategori"} —
              </option>
              {categories.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.nama}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Barcode & SKU */}
        <div className="product-form-row">
          <div className="product-form-group">
            <label htmlFor="prodBarcode">
              {isEn ? "Barcode" : "Barcode"}
            </label>
            <input
              id="prodBarcode"
              type="text"
              className="product-form-input"
              placeholder="e.g. 8991234567890"
              value={form.barcode}
              onChange={(e) => setForm((f) => ({ ...f, barcode: e.target.value }))}
            />
          </div>
          <div className="product-form-group">
            <label htmlFor="prodSku">SKU</label>
            <input
              id="prodSku"
              type="text"
              className="product-form-input"
              placeholder="e.g. NG-001"
              value={form.sku}
              onChange={(e) => setForm((f) => ({ ...f, sku: e.target.value }))}
            />
          </div>
        </div>

        {/* Harga Beli & Harga Jual */}
        <div className="product-form-row">
          <div className="product-form-group">
            <label htmlFor="prodHargaBeli">
              {isEn ? "Purchase Price (Rp)" : "Harga Beli (Rp)"}
            </label>
            <input
              id="prodHargaBeli"
              type="number"
              className="product-form-input"
              min={0}
              value={form.hargaBeli}
              onChange={(e) => setForm((f) => ({ ...f, hargaBeli: e.target.value }))}
            />
          </div>
          <div className="product-form-group">
            <label htmlFor="prodHargaJual">
              {isEn ? "Selling Price (Rp)" : "Harga Jual (Rp)"}{" "}
              <span style={{ color: "var(--danger)" }}>*</span>
            </label>
            <input
              id="prodHargaJual"
              type="number"
              className="product-form-input"
              min={1}
              value={form.hargaJual}
              onChange={(e) => setForm((f) => ({ ...f, hargaJual: e.target.value }))}
            />
          </div>
        </div>

        {/* Stok & Stok Minimum */}
        <div className="product-form-row">
          {modalMode === "create" && (
            <div className="product-form-group">
              <label htmlFor="prodStok">
                {isEn ? "Initial Stock" : "Stok Awal"}
              </label>
              <input
                id="prodStok"
                type="number"
                className="product-form-input"
                min={0}
                value={form.stok}
                onChange={(e) => setForm((f) => ({ ...f, stok: e.target.value }))}
              />
            </div>
          )}
          {modalMode === "edit" && (
            <div className="product-form-group">
              <label>{isEn ? "Current Stock" : "Stok Saat Ini"}</label>
              <div className="product-form-input disabled" style={{ display: "flex", alignItems: "center", gap: 8 }}>
                <span style={{ fontWeight: 700, fontFamily: "var(--font-mono)" }}>
                  {selectedProduct?.stok ?? 0}
                </span>
                <span className="product-form-hint">
                  {isEn ? "(use Adjust Stock)" : "(gunakan Atur Stok)"}
                </span>
              </div>
            </div>
          )}
          <div className="product-form-group">
            <label htmlFor="prodStokMin">
              {isEn ? "Min. Stock Alert" : "Stok Minimum Alert"}
            </label>
            <input
              id="prodStokMin"
              type="number"
              className="product-form-input"
              min={0}
              value={form.stokMinimum}
              onChange={(e) => setForm((f) => ({ ...f, stokMinimum: e.target.value }))}
            />
          </div>
        </div>

        {/* Info harga_beli tidak mempengaruhi historis */}
        {modalMode === "edit" && (
          <div className="product-info-box">
            <svg
              width="15"
              height="15"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              style={{ flexShrink: 0, marginTop: 1 }}
            >
              <circle cx="12" cy="12" r="10" />
              <line x1="12" y1="8" x2="12" y2="12" />
              <line x1="12" y1="16" x2="12.01" y2="16" />
            </svg>
            <span>
              {isEn
                ? "Changing the purchase price will NOT affect historical reports — transaction records already store a snapshot of the price at the time of sale."
                : "Perubahan harga beli TIDAK akan mempengaruhi laporan historis — catatan transaksi sudah menyimpan snapshot harga saat penjualan terjadi."}
            </span>
          </div>
        )}
      </>
    );
  }

  // ── RENDER ───────────────────────────────────────────────────────────────
  return (
    <div className="product-tab-container">
      {/* Header */}
      <div className="tab-section-header admin-card-anim anim-delay-0">
        <div>
          <h2 className="tab-section-title">
            {isEn ? "Product Catalog" : "Katalog Produk"}
          </h2>
          <p className="tab-section-subtitle">
            {isEn
              ? "Manage your store products, stock, and pricing"
              : "Kelola produk, stok, dan harga toko Anda"}
          </p>
        </div>
        <button
          type="button"
          id="btnAddProduct"
          className="btn-product-add"
          onClick={openCreate}
        >
          <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
            <line x1="12" y1="5" x2="12" y2="19" />
            <line x1="5" y1="12" x2="19" y2="12" />
          </svg>
          {isEn ? "Add Product" : "Tambah Produk"}
        </button>
      </div>

      {/* Stats row */}
      <div className="product-stats-row admin-card-anim anim-delay-1">
        <div className="product-stat-pill">
          <span className="product-stat-num">{productList.length}</span>
          <span className="product-stat-label">{isEn ? "Total" : "Total"}</span>
        </div>
        <div className="product-stat-pill active">
          <span className="product-stat-num">
            {productList.filter((p) => p.isActive).length}
          </span>
          <span className="product-stat-label">{isEn ? "Active" : "Aktif"}</span>
        </div>
        <div className="product-stat-pill lowstock">
          <span className="product-stat-num">
            {
              productList.filter(
                (p) => p.isActive && p.stok <= p.stokMinimum
              ).length
            }
          </span>
          <span className="product-stat-label">
            {isEn ? "Low Stock" : "Stok Rendah"}
          </span>
        </div>
        <div className="product-stat-pill inactive">
          <span className="product-stat-num">
            {productList.filter((p) => !p.isActive).length}
          </span>
          <span className="product-stat-label">
            {isEn ? "Inactive" : "Nonaktif"}
          </span>
        </div>
      </div>

      {/* Filters */}
      <div className="product-filters-row admin-card-anim anim-delay-2">
        <div className="product-search-bar">
          <svg
            width="15"
            height="15"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
          >
            <circle cx="11" cy="11" r="8" />
            <line x1="21" y1="21" x2="16.65" y2="16.65" />
          </svg>
          <input
            id="productSearchInput"
            type="text"
            className="product-search-input"
            placeholder={isEn ? "Search by name, barcode, SKU…" : "Cari nama, barcode, SKU…"}
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
          {searchQuery && (
            <button
              type="button"
              className="product-search-clear"
              onClick={() => setSearchQuery("")}
            >
              ✕
            </button>
          )}
        </div>
        <select
          id="productCategoryFilter"
          className="product-filter-select"
          value={filterCategoryId}
          onChange={(e) => setFilterCategoryId(e.target.value)}
        >
          <option value="">
            — {isEn ? "All Categories" : "Semua Kategori"} —
          </option>
          {categories.map((c) => (
            <option key={c.id} value={c.id}>
              {c.nama}
            </option>
          ))}
        </select>
        <select
          id="productStatusFilter"
          className="product-filter-select"
          value={filterStatus}
          onChange={(e) =>
            setFilterStatus(e.target.value as "all" | "active" | "inactive")
          }
        >
          <option value="all">{isEn ? "All Status" : "Semua Status"}</option>
          <option value="active">{isEn ? "Active" : "Aktif"}</option>
          <option value="inactive">{isEn ? "Inactive" : "Nonaktif"}</option>
        </select>
      </div>

      {/* Table Card */}
      <div className="product-table-card admin-card-anim anim-delay-3">
        {loading ? (
          <div className="product-loading-state">
            <div className="product-spinner" />
            <p>{isEn ? "Loading products…" : "Memuat data produk…"}</p>
          </div>
        ) : filtered.length === 0 ? (
          <div className="product-empty-state">
            <svg
              width="40"
              height="40"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.5"
            >
              <path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z" />
            </svg>
            <p>
              {searchQuery || filterCategoryId || filterStatus !== "all"
                ? isEn
                  ? "No products match your filters."
                  : "Tidak ada produk yang cocok dengan filter."
                : isEn
                ? "No products yet. Add your first product above."
                : "Belum ada produk. Klik tombol di atas untuk menambahkan."}
            </p>
          </div>
        ) : (
          <>
            <div className="product-table-wrapper">
              <table className="product-table">
                <thead>
                  <tr>
                    <th>{isEn ? "Product" : "Produk"}</th>
                    <th>{isEn ? "Category" : "Kategori"}</th>
                    <th className="th-right">
                      {isEn ? "Buy Price" : "Harga Beli"}
                    </th>
                    <th className="th-right">
                      {isEn ? "Sell Price" : "Harga Jual"}
                    </th>
                    <th className="th-center">
                      {isEn ? "Stock" : "Stok"}
                    </th>
                    <th className="th-center">
                      {isEn ? "Status" : "Status"}
                    </th>
                    <th className="th-right">
                      {isEn ? "Actions" : "Aksi"}
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {paginated.map((p) => {
                    const isLowStock = p.stok <= p.stokMinimum && p.isActive;
                    return (
                      <tr key={p.id} className={`product-table-row ${!p.isActive ? "inactive" : ""}`}>
                        <td>
                          <div className="product-cell-main">
                            {/* Thumbnail */}
                            <div className="product-thumbnail-box">
                              {p.gambar ? (
                                // eslint-disable-next-line @next/next/no-img-element
                                <img
                                  src={p.gambar}
                                  alt={p.nama}
                                  className="product-thumbnail-img"
                                />
                              ) : (
                                <div className="product-thumbnail-placeholder">
                                  <svg
                                    width="20"
                                    height="20"
                                    viewBox="0 0 24 24"
                                    fill="none"
                                    stroke="currentColor"
                                    strokeWidth="1.5"
                                  >
                                    <path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z" />
                                  </svg>
                                </div>
                              )}
                            </div>
                            <div>
                              <div className="product-name">{p.nama}</div>
                              <div className="product-meta">
                                {[p.barcode && `Barcode: ${p.barcode}`, p.sku && `SKU: ${p.sku}`]
                                  .filter(Boolean)
                                  .join(" · ") || "—"}
                              </div>
                            </div>
                          </div>
                        </td>
                        <td>
                          {p.categoryNama ? (
                            <span className="product-badge-category">{p.categoryNama}</span>
                          ) : (
                            <span className="product-text-muted">—</span>
                          )}
                        </td>
                        <td className="product-price-cell">
                          {formatRupiah(p.hargaBeli)}
                        </td>
                        <td className="product-price-cell product-price-sell">
                          {formatRupiah(p.hargaJual)}
                        </td>
                        <td className="td-center">
                          <span
                            className={`product-badge-stock ${
                              isLowStock
                                ? "low"
                                : p.stok === 0
                                ? "empty"
                                : "normal"
                            }`}
                            title={
                              isLowStock
                                ? `Min: ${p.stokMinimum}`
                                : undefined
                            }
                          >
                            {p.stok}
                          </span>
                        </td>
                        <td className="td-center">
                          <button
                            type="button"
                            id={`btnToggleProduct-${p.id}`}
                            className={`product-status-btn ${
                              p.isActive ? "active" : "inactive"
                            }`}
                            onClick={() => handleToggleStatus(p)}
                            disabled={isPending}
                            title={
                              p.isActive
                                ? isEn
                                  ? "Click to deactivate"
                                  : "Klik untuk nonaktifkan"
                                : isEn
                                ? "Click to activate"
                                : "Klik untuk aktifkan"
                            }
                          >
                            ● {p.isActive
                              ? isEn
                                ? "Active"
                                : "Aktif"
                              : isEn
                              ? "Inactive"
                              : "Nonaktif"}
                          </button>
                        </td>
                        <td className="td-right">
                          <div className="product-action-group">
                            {/* Adjust Stock */}
                            <button
                              type="button"
                              id={`btnAdjustStock-${p.id}`}
                              className="product-btn-stock"
                              title={isEn ? "Adjust Stock" : "Atur Stok"}
                              onClick={() => openStock(p)}
                            >
                              <svg
                                width="15"
                                height="15"
                                viewBox="0 0 24 24"
                                fill="none"
                                stroke="currentColor"
                                strokeWidth="2"
                              >
                                <line x1="12" y1="5" x2="12" y2="19" />
                                <polyline points="19 12 12 19 5 12" />
                              </svg>
                            </button>
                            {/* Edit */}
                            <button
                              type="button"
                              id={`btnEditProduct-${p.id}`}
                              className="product-btn-edit"
                              title={isEn ? "Edit" : "Edit"}
                              onClick={() => openEdit(p)}
                            >
                              <svg
                                width="14"
                                height="14"
                                viewBox="0 0 24 24"
                                fill="none"
                                stroke="currentColor"
                                strokeWidth="2"
                              >
                                <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" />
                                <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" />
                              </svg>
                            </button>
                            {/* Delete */}
                            <button
                              type="button"
                              id={`btnDeleteProduct-${p.id}`}
                              className="product-btn-delete"
                              title={isEn ? "Delete" : "Hapus"}
                              onClick={() => openDelete(p)}
                            >
                              <svg
                                width="14"
                                height="14"
                                viewBox="0 0 24 24"
                                fill="none"
                                stroke="currentColor"
                                strokeWidth="2"
                              >
                                <polyline points="3 6 5 6 21 6" />
                                <path d="M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6" />
                                <path d="M10 11v6M14 11v6" />
                              </svg>
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="product-pagination">
                <span className="product-page-info">
                  {isEn
                    ? `Page ${currentPage} of ${totalPages} (${filtered.length} products)`
                    : `Halaman ${currentPage} dari ${totalPages} (${filtered.length} produk)`}
                </span>
                <button
                  type="button"
                  id="btnPrevPage"
                  className="product-page-btn"
                  disabled={currentPage <= 1}
                  onClick={() => setCurrentPage((p) => p - 1)}
                >
                  ‹
                </button>
                <button
                  type="button"
                  id="btnNextPage"
                  className="product-page-btn"
                  disabled={currentPage >= totalPages}
                  onClick={() => setCurrentPage((p) => p + 1)}
                >
                  ›
                </button>
              </div>
            )}
          </>
        )}
      </div>

      {/* ─── MODAL CREATE / EDIT ─────────────────────────────────────────────── */}
      {(modalMode === "create" || modalMode === "edit") && (
        <div className="product-modal-overlay" onClick={closeModal}>
          <div
            className="product-modal"
            style={{ maxWidth: 580 }}
            onClick={(e) => e.stopPropagation()}
          >
            <div className="product-modal-header">
              <h3>
                {modalMode === "create"
                  ? isEn
                    ? "Add New Product"
                    : "Tambah Produk Baru"
                  : isEn
                  ? `Edit Product: ${selectedProduct?.nama}`
                  : `Edit Produk: ${selectedProduct?.nama}`}
              </h3>
              <button type="button" className="product-modal-close" onClick={closeModal}>
                ✕
              </button>
            </div>
            <div className="product-modal-body">{renderProductForm()}</div>
            <div className="product-modal-footer">
              <button type="button" className="btn-product-cancel" onClick={closeModal}>
                {isEn ? "Cancel" : "Batal"}
              </button>
              <button
                type="button"
                id={`btnSubmitProduct-${modalMode}`}
                className="btn-product-save"
                onClick={modalMode === "create" ? handleCreate : handleEdit}
                disabled={isPending}
              >
                {isPending
                  ? isEn
                    ? "Saving…"
                    : "Menyimpan…"
                  : modalMode === "create"
                  ? isEn
                    ? "Add Product"
                    : "Tambah Produk"
                  : isEn
                  ? "Save Changes"
                  : "Simpan Perubahan"}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ─── MODAL ADJUST STOCK ──────────────────────────────────────────────── */}
      {modalMode === "stock" && selectedProduct && (
        <div className="product-modal-overlay" onClick={closeModal}>
          <div
            className="product-modal"
            style={{ maxWidth: 460 }}
            onClick={(e) => e.stopPropagation()}
          >
            <div className="product-modal-header">
              <h3>
                {isEn ? "Adjust Product Stock" : "Penyesuaian Stok Produk"}
              </h3>
              <button type="button" className="product-modal-close" onClick={closeModal}>
                ✕
              </button>
            </div>
            <div className="product-modal-body">
              {formError && (
                <div className="product-form-error">
                  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <circle cx="12" cy="12" r="10" />
                    <line x1="12" y1="8" x2="12" y2="12" />
                    <line x1="12" y1="16" x2="12.01" y2="16" />
                  </svg>
                  <span>{formError}</span>
                </div>
              )}

              {/* Produk info */}
              <div className="product-info-box" style={{ flexDirection: "column", gap: 4 }}>
                <div style={{ fontWeight: 700, color: "var(--text-heading)" }}>{selectedProduct.nama}</div>
                <div style={{ color: "var(--text-body)" }}>
                  {isEn ? "Current stock" : "Stok saat ini"}: &nbsp;
                  <strong
                    style={{
                      fontFamily: "var(--font-mono)",
                      color:
                        selectedProduct.stok <= selectedProduct.stokMinimum
                          ? "var(--danger)"
                          : "var(--primary)",
                    }}
                  >
                    {selectedProduct.stok}
                  </strong>
                  &nbsp; ({isEn ? "min alert" : "peringatan min"}: {selectedProduct.stokMinimum})
                </div>
              </div>

              <div className="product-form-group">
                <label htmlFor="stockTipe">
                  {isEn ? "Adjustment Type" : "Tipe Penyesuaian"}
                </label>
                <select
                  id="stockTipe"
                  className="product-form-select"
                  value={stockForm.tipe}
                  onChange={(e) =>
                    setStockForm((f) => ({
                      ...f,
                      tipe: e.target.value as "IN" | "ADJUSTMENT",
                    }))
                  }
                >
                  <option value="IN">
                    IN — {isEn ? "Stock In (always positive)" : "Stok Masuk (selalu positif)"}
                  </option>
                  <option value="ADJUSTMENT">
                    ADJUSTMENT — {isEn ? "Correction (can be negative)" : "Koreksi Fisik (bisa negatif)"}
                  </option>
                </select>
              </div>

              <div className="product-form-group">
                <label htmlFor="stockQty">
                  {isEn ? "Quantity" : "Jumlah"}
                </label>
                <input
                  id="stockQty"
                  type="number"
                  className="product-form-input"
                  value={stockForm.qty}
                  onChange={(e) =>
                    setStockForm((f) => ({ ...f, qty: e.target.value }))
                  }
                  placeholder={
                    stockForm.tipe === "ADJUSTMENT"
                      ? isEn
                        ? "e.g. -3 for correction"
                        : "cth. -3 untuk koreksi fisik"
                      : "e.g. 50"
                  }
                />
                {stockForm.qty && !isNaN(parseInt(stockForm.qty)) && (
                  <span className="product-form-hint">
                    {isEn ? "New stock will be" : "Stok baru akan menjadi"}:{" "}
                    <strong style={{ color: "var(--text-heading)", fontFamily: "var(--font-mono)" }}>
                      {Math.max(
                        0,
                        selectedProduct.stok + (parseInt(stockForm.qty) || 0)
                      )}
                    </strong>
                  </span>
                )}
              </div>

              <div className="product-form-group">
                <label htmlFor="stockKeterangan">
                  {isEn ? "Notes" : "Keterangan Audit"}{" "}
                  <span style={{ color: "var(--danger)" }}>*</span>
                </label>
                <textarea
                  id="stockKeterangan"
                  className="product-form-input"
                  style={{ minHeight: 74, resize: "vertical" }}
                  placeholder={
                    isEn
                      ? "e.g. Restock from supplier, or Physical stock recount"
                      : "cth. Restock dari supplier, atau Penyesuaian stok opname fisik"
                  }
                  value={stockForm.keterangan}
                  onChange={(e) =>
                    setStockForm((f) => ({ ...f, keterangan: e.target.value }))
                  }
                />
              </div>
            </div>
            <div className="product-modal-footer">
              <button type="button" className="btn-product-cancel" onClick={closeModal}>
                {isEn ? "Cancel" : "Batal"}
              </button>
              <button
                type="button"
                id="btnConfirmAdjustStock"
                className="btn-product-save"
                onClick={handleAdjustStock}
                disabled={isPending}
              >
                {isPending
                  ? isEn
                    ? "Saving…"
                    : "Menyimpan…"
                  : isEn
                  ? "Save Adjustment"
                  : "Simpan Penyesuaian"}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ─── MODAL DELETE ────────────────────────────────────────────────────── */}
      {modalMode === "delete" && selectedProduct && (
        <div className="product-modal-overlay" onClick={closeModal}>
          <div
            className="product-modal"
            style={{ maxWidth: 440 }}
            onClick={(e) => e.stopPropagation()}
          >
            <div className="product-modal-header danger">
              <h3>
                {isEn ? "Delete Product?" : "Hapus Produk?"}
              </h3>
              <button type="button" className="product-modal-close" onClick={closeModal}>
                ✕
              </button>
            </div>
            <div className="product-modal-body">
              <p style={{ color: "var(--text-body)", margin: 0 }}>
                {isEn
                  ? `Are you sure you want to delete `
                  : `Yakin ingin menghapus produk `}
                <strong>&ldquo;{selectedProduct.nama}&rdquo;</strong>?
              </p>
              <div className="product-warning-box">
                <svg
                  width="15"
                  height="15"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  style={{ flexShrink: 0, marginTop: 1 }}
                >
                  <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z" />
                  <line x1="12" y1="9" x2="12" y2="13" />
                  <line x1="12" y1="17" x2="12.01" y2="17" />
                </svg>
                <span>
                  {isEn
                    ? "If this product was ever used in a transaction, it will be deactivated (soft delete) instead of permanently removed, to preserve sales history."
                    : "Jika produk ini pernah ada dalam transaksi, sistem akan menonaktifkannya (soft delete) bukan dihapus permanen, untuk menjaga keutuhan laporan penjualan historis."}
                </span>
              </div>
            </div>
            <div className="product-modal-footer">
              <button type="button" className="btn-product-cancel" onClick={closeModal}>
                {isEn ? "Cancel" : "Batal"}
              </button>
              <button
                type="button"
                id="btnConfirmDeleteProduct"
                className="btn-product-danger"
                onClick={handleDelete}
                disabled={isPending}
              >
                {isPending
                  ? isEn
                    ? "Processing…"
                    : "Memproses…"
                  : isEn
                  ? "Delete Product"
                  : "Hapus Produk"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
