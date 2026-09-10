"use client";

import React, { useState, useEffect, useTransition, useCallback } from "react";
import type { Language } from "@/lib/translations";
import type { StaffMember } from "@/lib/actions/staff-actions";
import {
  getStaffList,
  createStaffAction,
  updateStaffAction,
  deleteStaffAction,
} from "@/lib/actions/staff-actions";
import { useToast } from "@/components/ui/Toast";
import { formatDate } from "@/lib/utils";

interface Props {
  lang: Language;
}

type ModalMode = "create" | "edit" | "reset-password" | "delete" | null;

interface EditForm {
  namaLengkap: string;
  email: string;
  password: string;
  confirmPassword: string;
  role: "ADMIN" | "CASHIER";
  isActive: boolean;
}

const EMPTY_FORM: EditForm = {
  namaLengkap: "",
  email: "",
  password: "",
  confirmPassword: "",
  role: "CASHIER",
  isActive: true,
};

export function StaffManagementTab({ lang }: Props) {
  const isEn = lang === "en";
  const { showToast } = useToast();

  const [staff, setStaff] = useState<StaffMember[]>([]);
  const [loading, setLoading] = useState(true);
  const [isPending, startTransition] = useTransition();

  const [modalMode, setModalMode] = useState<ModalMode>(null);
  const [selectedStaff, setSelectedStaff] = useState<StaffMember | null>(null);
  const [form, setForm] = useState<EditForm>(EMPTY_FORM);
  const [formError, setFormError] = useState<string>("");

  const [searchQuery, setSearchQuery] = useState("");

  // ─── Load staff list ────────────────────────────────────────────────────
  const loadStaff = useCallback(async () => {
    setLoading(true);
    const res = await getStaffList();
    if (res.success && res.data) {
      setStaff(res.data);
    } else {
      showToast(res.error ?? "Gagal memuat daftar staff.", "error");
    }
    setLoading(false);
  }, [showToast]);

  useEffect(() => {
    loadStaff();
  }, [loadStaff]);

  // ─── Filter ──────────────────────────────────────────────────────────────
  const filtered = staff.filter((s) => {
    const q = searchQuery.toLowerCase();
    return (
      s.namaLengkap.toLowerCase().includes(q) ||
      s.email.toLowerCase().includes(q) ||
      s.role.toLowerCase().includes(q)
    );
  });

  // ─── Modal helpers ───────────────────────────────────────────────────────
  function openCreate() {
    setForm(EMPTY_FORM);
    setFormError("");
    setSelectedStaff(null);
    setModalMode("create");
  }

  function openEdit(member: StaffMember) {
    setForm({
      namaLengkap: member.namaLengkap,
      email: member.email,
      password: "",
      confirmPassword: "",
      role: member.role,
      isActive: member.isActive,
    });
    setFormError("");
    setSelectedStaff(member);
    setModalMode("edit");
  }

  function openResetPassword(member: StaffMember) {
    setForm({ ...EMPTY_FORM });
    setFormError("");
    setSelectedStaff(member);
    setModalMode("reset-password");
  }

  function openDelete(member: StaffMember) {
    setSelectedStaff(member);
    setModalMode("delete");
  }

  function closeModal() {
    setModalMode(null);
    setSelectedStaff(null);
    setForm(EMPTY_FORM);
    setFormError("");
  }

  // ─── Submit: Create ──────────────────────────────────────────────────────
  function handleCreate() {
    if (!form.namaLengkap.trim() || !form.email.trim() || !form.password) {
      setFormError("Semua kolom wajib diisi.");
      return;
    }
    if (form.password.length < 6) {
      setFormError("Kata sandi minimal 6 karakter.");
      return;
    }
    if (form.password !== form.confirmPassword) {
      setFormError("Konfirmasi kata sandi tidak cocok.");
      return;
    }
    setFormError("");

    startTransition(async () => {
      const res = await createStaffAction({
        namaLengkap: form.namaLengkap,
        email: form.email,
        password: form.password,
        role: form.role,
      });
      if (res.success) {
        showToast(res.message ?? "Staff berhasil ditambahkan.", "success");
        closeModal();
        loadStaff();
      } else {
        setFormError(res.message ?? "Gagal menambah staff.");
      }
    });
  }

  // ─── Submit: Edit ────────────────────────────────────────────────────────
  function handleUpdate() {
    if (!selectedStaff) return;
    if (!form.namaLengkap.trim()) {
      setFormError("Nama lengkap tidak boleh kosong.");
      return;
    }
    setFormError("");

    startTransition(async () => {
      const res = await updateStaffAction({
        targetUserId: selectedStaff.id,
        namaLengkap: form.namaLengkap,
        role: form.role,
        isActive: form.isActive,
      });
      if (res.success) {
        showToast(res.message ?? "Data staff diperbarui.", "success");
        closeModal();
        loadStaff();
      } else {
        setFormError(res.message ?? "Gagal memperbarui data.");
      }
    });
  }

  // ─── Submit: Reset Password ──────────────────────────────────────────────
  function handleResetPassword() {
    if (!selectedStaff) return;
    if (!form.password) {
      setFormError("Kata sandi baru wajib diisi.");
      return;
    }
    if (form.password.length < 6) {
      setFormError("Kata sandi minimal 6 karakter.");
      return;
    }
    if (form.password !== form.confirmPassword) {
      setFormError("Konfirmasi kata sandi tidak cocok.");
      return;
    }
    setFormError("");

    startTransition(async () => {
      const res = await updateStaffAction({
        targetUserId: selectedStaff.id,
        newPassword: form.password,
      });
      if (res.success) {
        showToast("Kata sandi berhasil direset.", "success");
        closeModal();
      } else {
        setFormError(res.message ?? "Gagal mereset kata sandi.");
      }
    });
  }

  // ─── Submit: Delete ──────────────────────────────────────────────────────
  function handleDelete() {
    if (!selectedStaff) return;
    startTransition(async () => {
      const res = await deleteStaffAction(selectedStaff.id);
      if (res.success) {
        showToast(res.message ?? "Staff berhasil dihapus.", "success");
        closeModal();
        loadStaff();
      } else {
        showToast(res.message ?? "Gagal menghapus staff.", "error");
        closeModal();
      }
    });
  }

  // ─── Helpers ─────────────────────────────────────────────────────────────
  const getRoleBadge = (role: string) => {
    if (role === "ADMIN") {
      return (
        <span className="staff-badge-admin">
          <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
            <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
          </svg>
          Admin
        </span>
      );
    }
    return (
      <span className="staff-badge-cashier">
        <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
          <rect x="2" y="6" width="20" height="12" rx="2" />
          <circle cx="12" cy="12" r="2" />
        </svg>
        Kasir
      </span>
    );
  };

  const getStatusBadge = (isActive: boolean) => {
    if (isActive) {
      return <span className="staff-status-active">● {isEn ? "Active" : "Aktif"}</span>;
    }
    return <span className="staff-status-inactive">● {isEn ? "Inactive" : "Nonaktif"}</span>;
  };

  const getInitials = (name: string) =>
    name
      .split(" ")
      .slice(0, 2)
      .map((n) => n[0])
      .join("")
      .toUpperCase();

  const getAvatarColor = (name: string) => {
    const colors = [
      "var(--primary)",
      "#7C3AED",
      "#0891B2",
      "#059669",
      "#D97706",
      "#DC2626",
    ];
    const idx = name.charCodeAt(0) % colors.length;
    return colors[idx];
  };

  return (
    <div className="staff-tab-container">
      {/* ── Header ─────────────────────────────────────────────── */}
      <div className="tab-section-header">
        <div>
          <h2 className="tab-section-title">
            {isEn ? "User Management" : "Manajemen Staff & Kasir"}
          </h2>
          <p className="tab-section-subtitle">
            {isEn
              ? "Manage cashiers and admin accounts for your store"
              : "Kelola akun kasir dan admin untuk toko Anda"}
          </p>
        </div>
        <button
          type="button"
          className="btn-staff-add"
          onClick={openCreate}
          id="btnAddStaff"
        >
          <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
            <line x1="12" y1="5" x2="12" y2="19" />
            <line x1="5" y1="12" x2="19" y2="12" />
          </svg>
          {isEn ? "Add Staff" : "Tambah Staff"}
        </button>
      </div>

      {/* ── Search ─────────────────────────────────────────────── */}
      <div className="staff-search-bar">
        <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <circle cx="11" cy="11" r="8" />
          <line x1="21" y1="21" x2="16.65" y2="16.65" />
        </svg>
        <input
          id="staffSearchInput"
          type="text"
          placeholder={isEn ? "Search by name, email, or role..." : "Cari nama, email, atau role..."}
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="staff-search-input"
        />
        {searchQuery && (
          <button type="button" className="staff-search-clear" onClick={() => setSearchQuery("")}>
            ✕
          </button>
        )}
      </div>

      {/* ── Stats Row ──────────────────────────────────────────── */}
      <div className="staff-stats-row">
        <div className="staff-stat-pill">
          <span className="staff-stat-num">{staff.length}</span>
          <span className="staff-stat-label">{isEn ? "Total" : "Total"}</span>
        </div>
        <div className="staff-stat-pill green">
          <span className="staff-stat-num">{staff.filter((s) => s.isActive).length}</span>
          <span className="staff-stat-label">{isEn ? "Active" : "Aktif"}</span>
        </div>
        <div className="staff-stat-pill blue">
          <span className="staff-stat-num">{staff.filter((s) => s.role === "CASHIER").length}</span>
          <span className="staff-stat-label">{isEn ? "Cashiers" : "Kasir"}</span>
        </div>
        <div className="staff-stat-pill purple">
          <span className="staff-stat-num">{staff.filter((s) => s.role === "ADMIN").length}</span>
          <span className="staff-stat-label">Admin</span>
        </div>
      </div>

      {/* ── Table ──────────────────────────────────────────────── */}
      <div className="staff-table-card">
        {loading ? (
          <div className="staff-loading-state">
            <div className="staff-spinner" />
            <p>{isEn ? "Loading staff..." : "Memuat data staff..."}</p>
          </div>
        ) : filtered.length === 0 ? (
          <div className="staff-empty-state">
            <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
              <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
              <circle cx="12" cy="7" r="4" />
            </svg>
            <p>
              {searchQuery
                ? (isEn ? "No staff found matching your search." : "Tidak ada staff yang cocok dengan pencarian.")
                : (isEn ? "No staff members yet. Add one above." : "Belum ada staff. Klik tombol di atas untuk menambahkan.")}
            </p>
          </div>
        ) : (
          <table className="staff-table">
            <thead>
              <tr>
                <th>{isEn ? "Staff" : "Staff"}</th>
                <th>{isEn ? "Email" : "Email"}</th>
                <th>{isEn ? "Role" : "Role"}</th>
                <th>{isEn ? "Status" : "Status"}</th>
                <th>{isEn ? "Joined" : "Bergabung"}</th>
                <th>{isEn ? "Actions" : "Aksi"}</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((member) => (
                <tr key={member.id} className="staff-table-row">
                  <td>
                    <div className="staff-member-cell">
                      <div
                        className="staff-avatar"
                        style={{ background: getAvatarColor(member.namaLengkap) }}
                      >
                        {getInitials(member.namaLengkap)}
                      </div>
                      <div>
                        <div className="staff-name">{member.namaLengkap.replace(/^\[Deleted\] /, "")}</div>
                        {member.namaLengkap.startsWith("[Deleted]") && (
                          <div style={{ fontSize: "10px", color: "var(--danger, #DC2626)" }}>
                            {isEn ? "Deleted account" : "Akun dihapus"}
                          </div>
                        )}
                      </div>
                    </div>
                  </td>
                  <td className="staff-email-cell">{member.email}</td>
                  <td>{getRoleBadge(member.role)}</td>
                  <td>{getStatusBadge(member.isActive)}</td>
                  <td className="staff-date-cell">{formatDate(member.createdAt)}</td>
                  <td>
                    <div className="staff-action-group">
                      <button
                        type="button"
                        className="staff-btn-edit"
                        onClick={() => openEdit(member)}
                        title={isEn ? "Edit" : "Edit"}
                      >
                        <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                          <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" />
                          <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" />
                        </svg>
                      </button>
                      <button
                        type="button"
                        className="staff-btn-key"
                        onClick={() => openResetPassword(member)}
                        title={isEn ? "Reset Password" : "Reset Kata Sandi"}
                      >
                        <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                          <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
                          <path d="M7 11V7a5 5 0 0 1 10 0v4" />
                        </svg>
                      </button>
                      <button
                        type="button"
                        className="staff-btn-delete"
                        onClick={() => openDelete(member)}
                        title={isEn ? "Delete" : "Hapus"}
                        disabled={member.role === "ADMIN"}
                      >
                        <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                          <polyline points="3 6 5 6 21 6" />
                          <path d="M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6" />
                          <path d="M10 11v6M14 11v6" />
                          <path d="M9 6V4a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v2" />
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

      {/* ════════════════════════════════════════════════════════ */}
      {/* MODAL OVERLAY                                          */}
      {/* ════════════════════════════════════════════════════════ */}
      {modalMode && (
        <div className="staff-modal-overlay" onClick={closeModal}>
          <div
            className="staff-modal"
            onClick={(e) => e.stopPropagation()}
          >
            {/* ── Modal: Create ─────────────────────────────── */}
            {modalMode === "create" && (
              <>
                <div className="staff-modal-header">
                  <h3>{isEn ? "Add New Staff" : "Tambah Staff Baru"}</h3>
                  <button type="button" className="staff-modal-close" onClick={closeModal}>✕</button>
                </div>
                <div className="staff-modal-body">
                  <div className="staff-form-group">
                    <label>{isEn ? "Full Name" : "Nama Lengkap"} <span className="required">*</span></label>
                    <input
                      id="createStaffNama"
                      type="text"
                      placeholder={isEn ? "e.g. Budi Santoso" : "contoh: Budi Santoso"}
                      value={form.namaLengkap}
                      onChange={(e) => setForm({ ...form, namaLengkap: e.target.value })}
                      className="staff-form-input"
                    />
                  </div>
                  <div className="staff-form-group">
                    <label>Email <span className="required">*</span></label>
                    <input
                      id="createStaffEmail"
                      type="email"
                      placeholder={isEn ? "e.g. budi@yourstore.com" : "contoh: budi@tokosaya.com"}
                      value={form.email}
                      onChange={(e) => setForm({ ...form, email: e.target.value })}
                      className="staff-form-input"
                    />
                  </div>
                  <div className="staff-form-row">
                    <div className="staff-form-group">
                      <label>{isEn ? "Password" : "Kata Sandi"} <span className="required">*</span></label>
                      <input
                        id="createStaffPassword"
                        type="password"
                        placeholder={isEn ? "Min 6 characters" : "Min. 6 karakter"}
                        value={form.password}
                        onChange={(e) => setForm({ ...form, password: e.target.value })}
                        className="staff-form-input"
                      />
                    </div>
                    <div className="staff-form-group">
                      <label>{isEn ? "Confirm Password" : "Konfirmasi"} <span className="required">*</span></label>
                      <input
                        id="createStaffConfirm"
                        type="password"
                        placeholder={isEn ? "Repeat password" : "Ulangi kata sandi"}
                        value={form.confirmPassword}
                        onChange={(e) => setForm({ ...form, confirmPassword: e.target.value })}
                        className="staff-form-input"
                      />
                    </div>
                  </div>
                  <div className="staff-form-group">
                    <label>Role</label>
                    <div className="staff-role-picker">
                      <button
                        type="button"
                        className={`staff-role-opt ${form.role === "CASHIER" ? "active" : ""}`}
                        onClick={() => setForm({ ...form, role: "CASHIER" })}
                      >
                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                          <rect x="2" y="6" width="20" height="12" rx="2" />
                          <circle cx="12" cy="12" r="2" />
                        </svg>
                        Kasir
                      </button>
                      <button
                        type="button"
                        className={`staff-role-opt ${form.role === "ADMIN" ? "active" : ""}`}
                        onClick={() => setForm({ ...form, role: "ADMIN" })}
                      >
                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                          <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
                        </svg>
                        Admin
                      </button>
                    </div>
                  </div>
                  {formError && <div className="staff-form-error">{formError}</div>}
                </div>
                <div className="staff-modal-footer">
                  <button type="button" className="btn-modal-cancel" onClick={closeModal}>
                    {isEn ? "Cancel" : "Batal"}
                  </button>
                  <button
                    type="button"
                    className="btn-modal-confirm"
                    onClick={handleCreate}
                    disabled={isPending}
                    id="btnConfirmCreateStaff"
                  >
                    {isPending ? (isEn ? "Saving..." : "Menyimpan...") : (isEn ? "Add Staff" : "Tambah Staff")}
                  </button>
                </div>
              </>
            )}

            {/* ── Modal: Edit ───────────────────────────────── */}
            {modalMode === "edit" && selectedStaff && (
              <>
                <div className="staff-modal-header">
                  <h3>{isEn ? "Edit Staff" : "Edit Data Staff"}</h3>
                  <button type="button" className="staff-modal-close" onClick={closeModal}>✕</button>
                </div>
                <div className="staff-modal-body">
                  <div className="staff-form-group">
                    <label>{isEn ? "Full Name" : "Nama Lengkap"} <span className="required">*</span></label>
                    <input
                      id="editStaffNama"
                      type="text"
                      value={form.namaLengkap}
                      onChange={(e) => setForm({ ...form, namaLengkap: e.target.value })}
                      className="staff-form-input"
                    />
                  </div>
                  <div className="staff-form-group">
                    <label>Email</label>
                    <input
                      type="email"
                      value={form.email}
                      disabled
                      className="staff-form-input disabled"
                      title={isEn ? "Email cannot be changed" : "Email tidak dapat diubah"}
                    />
                    <small className="staff-form-hint">
                      {isEn ? "Email cannot be changed after creation." : "Email tidak dapat diubah setelah akun dibuat."}
                    </small>
                  </div>
                  <div className="staff-form-group">
                    <label>Role</label>
                    <div className="staff-role-picker">
                      <button
                        type="button"
                        className={`staff-role-opt ${form.role === "CASHIER" ? "active" : ""}`}
                        onClick={() => setForm({ ...form, role: "CASHIER" })}
                      >
                        Kasir
                      </button>
                      <button
                        type="button"
                        className={`staff-role-opt ${form.role === "ADMIN" ? "active" : ""}`}
                        onClick={() => setForm({ ...form, role: "ADMIN" })}
                      >
                        Admin
                      </button>
                    </div>
                  </div>
                  <div className="staff-form-group">
                    <label>{isEn ? "Status" : "Status Akun"}</label>
                    <div className="staff-toggle-row">
                      <button
                        type="button"
                        className={`staff-toggle ${form.isActive ? "on" : "off"}`}
                        onClick={() => setForm({ ...form, isActive: !form.isActive })}
                        id="toggleStaffActive"
                      >
                        <span className="toggle-knob" />
                      </button>
                      <span className="staff-toggle-label">
                        {form.isActive
                          ? (isEn ? "Active" : "Aktif")
                          : (isEn ? "Inactive" : "Nonaktif")}
                      </span>
                    </div>
                  </div>
                  {formError && <div className="staff-form-error">{formError}</div>}
                </div>
                <div className="staff-modal-footer">
                  <button type="button" className="btn-modal-cancel" onClick={closeModal}>
                    {isEn ? "Cancel" : "Batal"}
                  </button>
                  <button
                    type="button"
                    className="btn-modal-confirm"
                    onClick={handleUpdate}
                    disabled={isPending}
                    id="btnConfirmEditStaff"
                  >
                    {isPending ? (isEn ? "Saving..." : "Menyimpan...") : (isEn ? "Save Changes" : "Simpan Perubahan")}
                  </button>
                </div>
              </>
            )}

            {/* ── Modal: Reset Password ─────────────────────── */}
            {modalMode === "reset-password" && selectedStaff && (
              <>
                <div className="staff-modal-header">
                  <h3>{isEn ? "Reset Password" : "Reset Kata Sandi"}</h3>
                  <button type="button" className="staff-modal-close" onClick={closeModal}>✕</button>
                </div>
                <div className="staff-modal-body">
                  <p className="staff-modal-info">
                    {isEn
                      ? `Set a new password for ${selectedStaff.namaLengkap}`
                      : `Atur kata sandi baru untuk ${selectedStaff.namaLengkap}`}
                  </p>
                  <div className="staff-form-group">
                    <label>{isEn ? "New Password" : "Kata Sandi Baru"} <span className="required">*</span></label>
                    <input
                      id="resetPassword"
                      type="password"
                      placeholder={isEn ? "Min 6 characters" : "Min. 6 karakter"}
                      value={form.password}
                      onChange={(e) => setForm({ ...form, password: e.target.value })}
                      className="staff-form-input"
                    />
                  </div>
                  <div className="staff-form-group">
                    <label>{isEn ? "Confirm New Password" : "Konfirmasi Kata Sandi"} <span className="required">*</span></label>
                    <input
                      id="resetConfirmPassword"
                      type="password"
                      placeholder={isEn ? "Repeat password" : "Ulangi kata sandi"}
                      value={form.confirmPassword}
                      onChange={(e) => setForm({ ...form, confirmPassword: e.target.value })}
                      className="staff-form-input"
                    />
                  </div>
                  {formError && <div className="staff-form-error">{formError}</div>}
                </div>
                <div className="staff-modal-footer">
                  <button type="button" className="btn-modal-cancel" onClick={closeModal}>
                    {isEn ? "Cancel" : "Batal"}
                  </button>
                  <button
                    type="button"
                    className="btn-modal-confirm"
                    onClick={handleResetPassword}
                    disabled={isPending}
                    id="btnConfirmResetPassword"
                  >
                    {isPending ? (isEn ? "Saving..." : "Menyimpan...") : (isEn ? "Reset Password" : "Reset Kata Sandi")}
                  </button>
                </div>
              </>
            )}

            {/* ── Modal: Delete ─────────────────────────────── */}
            {modalMode === "delete" && selectedStaff && (
              <>
                <div className="staff-modal-header danger">
                  <h3>{isEn ? "Delete Staff" : "Hapus Staff"}</h3>
                  <button type="button" className="staff-modal-close" onClick={closeModal}>✕</button>
                </div>
                <div className="staff-modal-body">
                  <div className="staff-delete-confirm">
                    <div className="staff-delete-icon">
                      <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <polyline points="3 6 5 6 21 6" />
                        <path d="M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6" />
                        <path d="M10 11v6M14 11v6" />
                        <path d="M9 6V4a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v2" />
                      </svg>
                    </div>
                    <p>
                      {isEn
                        ? `Are you sure you want to delete `
                        : `Apakah Anda yakin ingin menghapus `}
                      <strong>{selectedStaff.namaLengkap}</strong>?
                    </p>
                    <p className="staff-delete-note">
                      {isEn
                        ? "The account will be deactivated and historical transaction data will be preserved."
                        : "Akun akan dinonaktifkan. Data transaksi historis tetap tersimpan."}
                    </p>
                  </div>
                </div>
                <div className="staff-modal-footer">
                  <button type="button" className="btn-modal-cancel" onClick={closeModal}>
                    {isEn ? "Cancel" : "Batal"}
                  </button>
                  <button
                    type="button"
                    className="btn-modal-danger"
                    onClick={handleDelete}
                    disabled={isPending}
                    id="btnConfirmDeleteStaff"
                  >
                    {isPending ? (isEn ? "Deleting..." : "Menghapus...") : (isEn ? "Yes, Delete" : "Ya, Hapus")}
                  </button>
                </div>
              </>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
