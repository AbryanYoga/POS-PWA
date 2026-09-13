"use client";

import React, { useState, useEffect, useTransition, useCallback } from "react";
import type { Language } from "@/lib/translations";
import type { CategoryItem } from "@/lib/actions/category-actions";
import {
  getCategoriesList,
  createCategoryAction,
  updateCategoryAction,
  deleteCategoryAction,
} from "@/lib/actions/category-actions";
import { useToast } from "@/components/ui/Toast";

interface Props {
  lang: Language;
}

type ModalMode = "create" | "edit" | "delete" | null;

interface CategoryForm {
  nama: string;
  deskripsi: string;
  urutan: number;
}

const EMPTY_FORM: CategoryForm = {
  nama: "",
  deskripsi: "",
  urutan: 0,
};

export function CategoriesTab({ lang }: Props) {
  const isEn = lang === "en";
  const { showToast } = useToast();

  const [categories, setCategories] = useState<CategoryItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [isPending, startTransition] = useTransition();

  const [modalMode, setModalMode] = useState<ModalMode>(null);
  const [selectedCategory, setSelectedCategory] = useState<CategoryItem | null>(null);
  const [form, setForm] = useState<CategoryForm>(EMPTY_FORM);
  const [formError, setFormError] = useState("");
  const [searchQuery, setSearchQuery] = useState("");

  // ── Load categories ──────────────────────────────────────────────────────
  const loadCategories = useCallback(async () => {
    setLoading(true);
    const res = await getCategoriesList();
    if (res.success && res.data) {
      setCategories(res.data);
    } else {
      showToast(res.error ?? (isEn ? "Failed to load categories." : "Gagal memuat daftar kategori."), "error");
    }
    setLoading(false);
  }, [isEn, showToast]);

  useEffect(() => {
    loadCategories();
  }, [loadCategories]);

  // ── Filter ───────────────────────────────────────────────────────────────
  const filtered = categories.filter((c) => {
    const q = searchQuery.toLowerCase();
    return (
      c.nama.toLowerCase().includes(q) ||
      (c.deskripsi ?? "").toLowerCase().includes(q)
    );
  });

  // ── Modal helpers ────────────────────────────────────────────────────────
  function openCreate() {
    setForm(EMPTY_FORM);
    setFormError("");
    setSelectedCategory(null);
    setModalMode("create");
  }

  function openEdit(cat: CategoryItem) {
    setForm({
      nama: cat.nama,
      deskripsi: cat.deskripsi ?? "",
      urutan: cat.urutan,
    });
    setFormError("");
    setSelectedCategory(cat);
    setModalMode("edit");
  }

  function openDelete(cat: CategoryItem) {
    setSelectedCategory(cat);
    setModalMode("delete");
  }

  function closeModal() {
    setModalMode(null);
    setSelectedCategory(null);
    setFormError("");
  }

  // ── Submit create ────────────────────────────────────────────────────────
  function handleCreate() {
    if (!form.nama.trim()) {
      setFormError(isEn ? "Category name is required." : "Nama kategori wajib diisi.");
      return;
    }
    startTransition(async () => {
      const res = await createCategoryAction({
        nama: form.nama,
        deskripsi: form.deskripsi || undefined,
        urutan: form.urutan,
      });
      if (res.success) {
        showToast(res.message ?? (isEn ? "Category added." : "Kategori ditambahkan."), "success");
        closeModal();
        await loadCategories();
      } else {
        setFormError(res.message ?? (isEn ? "Failed to add category." : "Gagal menambahkan kategori."));
      }
    });
  }

  // ── Submit edit ──────────────────────────────────────────────────────────
  function handleEdit() {
    if (!form.nama.trim()) {
      setFormError(isEn ? "Category name is required." : "Nama kategori wajib diisi.");
      return;
    }
    if (!selectedCategory) return;
    startTransition(async () => {
      const res = await updateCategoryAction({
        categoryId: selectedCategory.id,
        nama: form.nama,
        deskripsi: form.deskripsi || null,
        urutan: form.urutan,
      });
      if (res.success) {
        showToast(res.message ?? (isEn ? "Category updated." : "Kategori diperbarui."), "success");
        closeModal();
        await loadCategories();
      } else {
        setFormError(res.message ?? (isEn ? "Failed to update category." : "Gagal memperbarui kategori."));
      }
    });
  }

  // ── Submit delete ────────────────────────────────────────────────────────
  function handleDelete() {
    if (!selectedCategory) return;
    startTransition(async () => {
      const res = await deleteCategoryAction(selectedCategory.id);
      if (res.success) {
        showToast(res.message ?? (isEn ? "Category deleted." : "Kategori dihapus."), "success");
        closeModal();
        await loadCategories();
      } else {
        showToast(res.message ?? (isEn ? "Failed to delete category." : "Gagal menghapus kategori."), "error");
        closeModal();
      }
    });
  }

  // ── Render ───────────────────────────────────────────────────────────────
  return (
    <div className="category-tab-container">
      {/* Header */}
      <div className="tab-section-header admin-card-anim anim-delay-0">
        <div>
          <h2 className="tab-section-title">
            {isEn ? "Category Management" : "Manajemen Kategori"}
          </h2>
          <p className="tab-section-subtitle">
            {isEn
              ? "Organize product categories for your store"
              : "Kelola kategori produk toko Anda"}
          </p>
        </div>
        <button
          type="button"
          id="btnAddCategory"
          className="btn-category-add"
          onClick={openCreate}
        >
          <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
            <line x1="12" y1="5" x2="12" y2="19" />
            <line x1="5" y1="12" x2="19" y2="12" />
          </svg>
          {isEn ? "Add Category" : "Tambah Kategori"}
        </button>
      </div>

      {/* Search Bar */}
      <div className="category-search-bar admin-card-anim anim-delay-1">
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
          id="categorySearchInput"
          type="text"
          className="category-search-input"
          placeholder={isEn ? "Search categories…" : "Cari kategori…"}
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
        {searchQuery && (
          <button
            type="button"
            className="category-search-clear"
            onClick={() => setSearchQuery("")}
          >
            ✕
          </button>
        )}
      </div>

      {/* Stats row */}
      <div className="category-stats-row admin-card-anim anim-delay-2">
        <div className="category-stat-pill">
          <span className="category-stat-num">{categories.length}</span>
          <span className="category-stat-label">{isEn ? "Total" : "Total"}</span>
        </div>
        <div className="category-stat-pill filled">
          <span className="category-stat-num">
            {categories.filter((c) => c.productCount > 0).length}
          </span>
          <span className="category-stat-label">{isEn ? "With Products" : "Berisi Produk"}</span>
        </div>
        <div className="category-stat-pill empty">
          <span className="category-stat-num">
            {categories.filter((c) => c.productCount === 0).length}
          </span>
          <span className="category-stat-label">{isEn ? "Empty" : "Kosong"}</span>
        </div>
      </div>

      {/* Table Card */}
      <div className="category-table-card admin-card-anim anim-delay-3">
        {loading ? (
          <div className="category-loading-state">
            <div className="category-spinner" />
            <p>{isEn ? "Loading categories…" : "Memuat data kategori…"}</p>
          </div>
        ) : filtered.length === 0 ? (
          <div className="category-empty-state">
            <svg
              width="40"
              height="40"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.5"
            >
              <rect x="3" y="3" width="7" height="7" rx="1" />
              <rect x="14" y="3" width="7" height="7" rx="1" />
              <rect x="14" y="14" width="7" height="7" rx="1" />
              <rect x="3" y="14" width="7" height="7" rx="1" />
            </svg>
            <p>
              {searchQuery
                ? isEn
                  ? "No categories match your search."
                  : "Tidak ada kategori yang cocok dengan pencarian."
                : isEn
                ? "No categories yet. Add your first category above."
                : "Belum ada kategori. Klik tombol di atas untuk menambahkan."}
            </p>
          </div>
        ) : (
          <div className="category-table-wrapper">
            <table className="category-table">
              <thead>
                <tr>
                  <th>{isEn ? "Category Name" : "Nama Kategori"}</th>
                  <th>{isEn ? "Description" : "Deskripsi"}</th>
                  <th className="th-center">{isEn ? "Order" : "Urutan"}</th>
                  <th className="th-center">
                    {isEn ? "Active Products" : "Produk Aktif"}
                  </th>
                  <th className="th-right">{isEn ? "Actions" : "Aksi"}</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map((cat) => (
                  <tr key={cat.id} className="category-table-row">
                    <td>
                      <div className="category-cell-main">
                        <div className="category-avatar">
                          {cat.nama.substring(0, 2).toUpperCase()}
                        </div>
                        <div>
                          <div className="category-name">{cat.nama}</div>
                          <div className="category-id-sub">
                            ID: {cat.id.split("-")[0]}…
                          </div>
                        </div>
                      </div>
                    </td>
                    <td>
                      <span className="category-desc-cell">
                        {cat.deskripsi || "—"}
                      </span>
                    </td>
                    <td className="td-center">
                      <span className="category-badge-order">{cat.urutan}</span>
                    </td>
                    <td className="td-center">
                      <span
                        className={`category-badge-count ${
                          cat.productCount === 0 ? "empty" : ""
                        }`}
                      >
                        {cat.productCount}
                      </span>
                    </td>
                    <td className="td-right">
                      <div className="category-action-group">
                        <button
                          type="button"
                          id={`btnEditCategory-${cat.id}`}
                          className="category-btn-edit"
                          title={isEn ? "Edit" : "Edit"}
                          onClick={() => openEdit(cat)}
                        >
                          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                            <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" />
                            <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" />
                          </svg>
                        </button>
                        <button
                          type="button"
                          id={`btnDeleteCategory-${cat.id}`}
                          className="category-btn-delete"
                          title={
                            cat.productCount > 0
                              ? isEn
                                ? "Cannot delete: category has active products"
                                : "Tidak bisa dihapus: kategori memiliki produk aktif"
                              : isEn
                              ? "Delete"
                              : "Hapus"
                          }
                          onClick={() => openDelete(cat)}
                          disabled={cat.productCount > 0}
                        >
                          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                            <polyline points="3 6 5 6 21 6" />
                            <path d="M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6" />
                            <path d="M10 11v6M14 11v6" />
                          </svg>
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* ─── MODAL CREATE / EDIT ─────────────────────────────────────────────── */}
      {(modalMode === "create" || modalMode === "edit") && (
        <div className="category-modal-overlay" onClick={closeModal}>
          <div
            className="category-modal"
            style={{ maxWidth: 480 }}
            onClick={(e) => e.stopPropagation()}
          >
            <div className="category-modal-header">
              <h3>
                {modalMode === "create"
                  ? isEn
                    ? "Add New Category"
                    : "Tambah Kategori Baru"
                  : isEn
                  ? `Edit Category: ${selectedCategory?.nama}`
                  : `Edit Kategori: ${selectedCategory?.nama}`}
              </h3>
              <button type="button" className="category-modal-close" onClick={closeModal}>
                ✕
              </button>
            </div>

            <div className="category-modal-body">
              {formError && (
                <div className="category-form-error">
                  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <circle cx="12" cy="12" r="10" />
                    <line x1="12" y1="8" x2="12" y2="12" />
                    <line x1="12" y1="16" x2="12.01" y2="16" />
                  </svg>
                  <span>{formError}</span>
                </div>
              )}

              <div className="category-form-group">
                <label htmlFor="catNama">
                  {isEn ? "Category Name" : "Nama Kategori"}{" "}
                  <span style={{ color: "var(--danger)" }}>*</span>
                </label>
                <input
                  id="catNama"
                  type="text"
                  className="category-form-input"
                  placeholder={isEn ? "e.g. Beverages" : "cth. Minuman"}
                  value={form.nama}
                  onChange={(e) => setForm((f) => ({ ...f, nama: e.target.value }))}
                  autoFocus
                />
              </div>

              <div className="category-form-group">
                <label htmlFor="catDeskripsi">
                  {isEn ? "Description" : "Deskripsi"}
                </label>
                <textarea
                  id="catDeskripsi"
                  className="category-form-input"
                  style={{ minHeight: 74, resize: "vertical" }}
                  placeholder={isEn ? "Optional description…" : "Deskripsi opsional…"}
                  value={form.deskripsi}
                  onChange={(e) => setForm((f) => ({ ...f, deskripsi: e.target.value }))}
                />
              </div>

              <div className="category-form-group">
                <label htmlFor="catUrutan">
                  {isEn ? "Display Order" : "Urutan Tampil"}
                </label>
                <input
                  id="catUrutan"
                  type="number"
                  className="category-form-input"
                  min={0}
                  value={form.urutan}
                  onChange={(e) =>
                    setForm((f) => ({
                      ...f,
                      urutan: parseInt(e.target.value, 10) || 0,
                    }))
                  }
                />
                <span className="category-form-hint">
                  {isEn
                    ? "Lower number = displayed first"
                    : "Angka kecil = tampil lebih dulu di katalog kasir"}
                </span>
              </div>
            </div>

            <div className="category-modal-footer">
              <button type="button" className="btn-category-cancel" onClick={closeModal}>
                {isEn ? "Cancel" : "Batal"}
              </button>
              <button
                type="button"
                id={`btnSubmitCategory-${modalMode}`}
                className="btn-category-save"
                onClick={modalMode === "create" ? handleCreate : handleEdit}
                disabled={isPending}
              >
                {isPending
                  ? isEn
                    ? "Saving…"
                    : "Menyimpan…"
                  : modalMode === "create"
                  ? isEn
                    ? "Add Category"
                    : "Tambah Kategori"
                  : isEn
                  ? "Save Changes"
                  : "Simpan Perubahan"}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ─── MODAL DELETE ────────────────────────────────────────────────────── */}
      {modalMode === "delete" && selectedCategory && (
        <div className="category-modal-overlay" onClick={closeModal}>
          <div
            className="category-modal"
            style={{ maxWidth: 440 }}
            onClick={(e) => e.stopPropagation()}
          >
            <div className="category-modal-header danger">
              <h3>
                {isEn ? "Delete Category?" : "Hapus Kategori?"}
              </h3>
              <button type="button" className="category-modal-close" onClick={closeModal}>
                ✕
              </button>
            </div>
            <div className="category-modal-body">
              <p style={{ color: "var(--text-body)", margin: 0 }}>
                {isEn
                  ? `Are you sure you want to delete category `
                  : `Yakin ingin menghapus kategori `}
                <strong>&ldquo;{selectedCategory.nama}&rdquo;</strong>?
              </p>
              {selectedCategory.productCount > 0 && (
                <div className="category-warning-box">
                  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" style={{ flexShrink: 0, marginTop: 1 }}>
                    <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z" />
                    <line x1="12" y1="9" x2="12" y2="13" />
                    <line x1="12" y1="17" x2="12.01" y2="17" />
                  </svg>
                  <span>
                    {isEn
                      ? `This category still has ${selectedCategory.productCount} active products. Move or deactivate them first.`
                      : `Kategori ini masih memiliki ${selectedCategory.productCount} produk aktif. Pindahkan atau nonaktifkan produk tersebut dulu.`}
                  </span>
                </div>
              )}
            </div>
            <div className="category-modal-footer">
              <button type="button" className="btn-category-cancel" onClick={closeModal}>
                {isEn ? "Cancel" : "Batal"}
              </button>
              <button
                type="button"
                id="btnConfirmDeleteCategory"
                className="btn-category-danger"
                onClick={handleDelete}
                disabled={isPending || selectedCategory.productCount > 0}
              >
                {isPending ? (isEn ? "Deleting…" : "Menghapus…") : isEn ? "Delete Category" : "Hapus Kategori"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
