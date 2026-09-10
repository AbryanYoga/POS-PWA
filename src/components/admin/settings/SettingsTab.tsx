"use client";

import React, { useState, useEffect, useTransition } from "react";
import type { Language } from "@/lib/translations";
import type { StoreSettingsData } from "@/lib/actions/settings-actions";
import {
  getStoreSettings,
  updateStoreInfoAction,
  updateStorePreferencesAction,
  changeOwnPasswordAction,
} from "@/lib/actions/settings-actions";
import { useToast } from "@/components/ui/Toast";

interface Props {
  lang: Language;
}

const THEME_OPTIONS = [
  { value: "primary", label: "Indigo", color: "#6366F1" },
  { value: "green", label: "Emerald", color: "#10B981" },
  { value: "purple", label: "Violet", color: "#8B5CF6" },
  { value: "orange", label: "Amber", color: "#F59E0B" },
  { value: "teal", label: "Teal", color: "#14B8A6" },
];

/**
 * Peta CSS variables per tema.
 * Setiap tema mengubah --primary, --primary-hover, --primary-light di :root
 * sehingga semua tombol, active state sidebar, badge, dsb berubah secara live.
 */
const THEME_CSS_MAP: Record<string, { primary: string; hover: string; light: string }> = {
  primary: { primary: "#6366F1", hover: "#4F46E5", light: "#EEF2FF" },
  green:   { primary: "#10B981", hover: "#059669", light: "#ECFDF5" },
  purple:  { primary: "#8B5CF6", hover: "#7C3AED", light: "#F5F3FF" },
  orange:  { primary: "#F59E0B", hover: "#D97706", light: "#FFFBEB" },
  teal:    { primary: "#14B8A6", hover: "#0D9488", light: "#F0FDFA" },
};

/** Terapkan CSS variables ke :root secara langsung (live update tanpa reload) */
function applyThemeLive(themeValue: string) {
  const vars = THEME_CSS_MAP[themeValue];
  if (!vars) return;
  const root = document.documentElement;
  root.style.setProperty("--primary", vars.primary);
  root.style.setProperty("--primary-hover", vars.hover);
  root.style.setProperty("--primary-light", vars.light);
  // Juga simpan di localStorage untuk persistensi lintas tab (sebelum setting DB di-load)
  localStorage.setItem("pos_theme", themeValue);
  localStorage.setItem("pos_theme_primary", vars.primary);
  localStorage.setItem("pos_theme_hover", vars.hover);
  localStorage.setItem("pos_theme_light", vars.light);
}

const PRINTER_OPTIONS = [
  { value: "58mm", label: "58mm (Thermal kecil)" },
  { value: "80mm", label: "80mm (Thermal standar)" },
];

export function SettingsTab({ lang }: Props) {
  const isEn = lang === "en";
  const { showToast } = useToast();
  const [isPending, startTransition] = useTransition();

  // ── Store Info ──────────────────────────────────────────────────────────
  const [settings, setSettings] = useState<StoreSettingsData | null>(null);
  const [loading, setLoading] = useState(true);

  const [storeInfo, setStoreInfo] = useState({
    namaToko: "",
    alamat: "",
    telepon: "",
  });

  // ── Preferences ─────────────────────────────────────────────────────────
  const [printerWidth, setPrinterWidth] = useState("58mm");
  const [themeColor, setThemeColor] = useState("primary");

  // ── Change Password ──────────────────────────────────────────────────────
  const [pwForm, setPwForm] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });
  const [pwError, setPwError] = useState("");
  const [showPw, setShowPw] = useState({
    current: false,
    new: false,
    confirm: false,
  });

  // ── Load settings ────────────────────────────────────────────────────────
  useEffect(() => {
    // Terapkan tema dari localStorage SEBELUM DB response (menghindari flash)
    const cachedTheme = localStorage.getItem("pos_theme");
    if (cachedTheme) {
      applyThemeLive(cachedTheme);
    }

    getStoreSettings().then((res) => {
      if (res.success && res.data) {
        setSettings(res.data);
        setStoreInfo({
          namaToko: res.data.namaToko,
          alamat: res.data.alamat ?? "",
          telepon: res.data.telepon ?? "",
        });
        setPrinterWidth(res.data.printerWidth);
        setThemeColor(res.data.themeColor);
        // Terapkan tema dari DB (sumber of truth)
        applyThemeLive(res.data.themeColor);
      } else {
        showToast(res.error ?? "Gagal memuat pengaturan.", "error");
      }
      setLoading(false);
    });
  }, [showToast]);

  // ── Submit Store Info ─────────────────────────────────────────────────────
  function handleSaveStoreInfo() {
    if (!storeInfo.namaToko.trim()) {
      showToast(isEn ? "Store name cannot be empty." : "Nama toko tidak boleh kosong.", "error");
      return;
    }
    startTransition(async () => {
      const res = await updateStoreInfoAction(storeInfo);
      if (res.success) {
        showToast(
          res.message ?? (isEn ? "Store info updated." : "Informasi toko diperbarui."),
          "success"
        );
        if (res.data) {
          setSettings(res.data);
        }
      } else {
        showToast(res.message ?? "Gagal menyimpan.", "error");
      }
    });
  }

  // ── Submit Preferences ────────────────────────────────────────────────────
  function handleSavePreferences() {
    // Terapkan tema secara live sebelum request selesai (instant feedback)
    applyThemeLive(themeColor);
    startTransition(async () => {
      const res = await updateStorePreferencesAction({
        printerWidth,
        themeColor,
      });
      if (res.success) {
        showToast(
          res.message ?? (isEn ? "Preferences saved." : "Preferensi disimpan."),
          "success"
        );
      } else {
        showToast(res.message ?? "Gagal menyimpan preferensi.", "error");
      }
    });
  }

  // ── Submit Change Password ─────────────────────────────────────────────────
  function handleChangePassword() {
    setPwError("");
    if (!pwForm.currentPassword) {
      setPwError(isEn ? "Current password is required." : "Kata sandi lama wajib diisi.");
      return;
    }
    if (!pwForm.newPassword || pwForm.newPassword.length < 6) {
      setPwError(isEn ? "New password must be at least 6 characters." : "Kata sandi baru minimal 6 karakter.");
      return;
    }
    if (pwForm.newPassword !== pwForm.confirmPassword) {
      setPwError(isEn ? "Passwords do not match." : "Konfirmasi kata sandi tidak cocok.");
      return;
    }

    startTransition(async () => {
      const res = await changeOwnPasswordAction(pwForm);
      if (res.success) {
        showToast(res.message, "success");
        setPwForm({ currentPassword: "", newPassword: "", confirmPassword: "" });
        setPwError("");
      } else {
        setPwError(res.message);
      }
    });
  }

  if (loading) {
    return (
      <div className="settings-loading">
        <div className="staff-spinner" />
        <p>{isEn ? "Loading settings..." : "Memuat pengaturan..."}</p>
      </div>
    );
  }

  return (
    <div className="settings-tab-container">
      {/* ── Page Header ─────────────────────────────────────── */}
      <div className="tab-section-header">
        <div>
          <h2 className="tab-section-title">
            {isEn ? "Settings" : "Pengaturan"}
          </h2>
          <p className="tab-section-subtitle">
            {isEn
              ? "Manage store profile, preferences, and account security"
              : "Kelola profil toko, preferensi tampilan, dan keamanan akun"}
          </p>
        </div>
        {/* Outlet badge */}
        <div className="outlet-badge-pill">
          <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
            <polyline points="9 22 9 12 15 12 15 22" />
          </svg>
          <span>{settings?.kodeToko}</span>
        </div>
      </div>

      <div className="settings-grid">
        {/* ════════════════════════════════════════════════════ */}
        {/* LEFT COLUMN                                         */}
        {/* ════════════════════════════════════════════════════ */}
        <div className="settings-left-col">

          {/* ── Card 1: Store Info ──────────────────────────── */}
          <div className="settings-card">
            <div className="settings-card-header">
              <div className="settings-card-icon blue">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
                  <polyline points="9 22 9 12 15 12 15 22" />
                </svg>
              </div>
              <div>
                <h3 className="settings-card-title">
                  {isEn ? "Store Information" : "Informasi Toko"}
                </h3>
                <p className="settings-card-sub">
                  {isEn ? "Store name, address, and contact" : "Nama toko, alamat, dan kontak"}
                </p>
              </div>
            </div>

            <div className="settings-form-body">
              <div className="settings-form-group">
                <label>{isEn ? "Outlet Code" : "Kode Toko"}</label>
                <input
                  type="text"
                  value={settings?.kodeToko ?? ""}
                  disabled
                  className="settings-input disabled"
                />
                <small className="settings-hint">
                  {isEn ? "Outlet code cannot be changed." : "Kode Toko tidak dapat diubah."}
                </small>
              </div>

              <div className="settings-form-group">
                <label>{isEn ? "Store Name" : "Nama Toko"} <span className="required">*</span></label>
                <input
                  id="settingsNamaToko"
                  type="text"
                  value={storeInfo.namaToko}
                  onChange={(e) => setStoreInfo({ ...storeInfo, namaToko: e.target.value })}
                  placeholder={isEn ? "e.g. Toko Maju Jaya" : "contoh: Toko Maju Jaya"}
                  className="settings-input"
                />
              </div>

              <div className="settings-form-group">
                <label>{isEn ? "Address" : "Alamat"}</label>
                <textarea
                  id="settingsAlamat"
                  value={storeInfo.alamat}
                  onChange={(e) => setStoreInfo({ ...storeInfo, alamat: e.target.value })}
                  placeholder={isEn ? "e.g. Jl. Raya No.1, Jakarta" : "contoh: Jl. Raya No.1, Jakarta"}
                  className="settings-textarea"
                  rows={3}
                />
              </div>

              <div className="settings-form-group">
                <label>{isEn ? "Phone Number" : "Nomor Telepon"}</label>
                <input
                  id="settingsTelepon"
                  type="tel"
                  value={storeInfo.telepon}
                  onChange={(e) => setStoreInfo({ ...storeInfo, telepon: e.target.value })}
                  placeholder="contoh: 0812-3456-7890"
                  className="settings-input"
                />
              </div>

              <button
                type="button"
                className="btn-settings-save"
                onClick={handleSaveStoreInfo}
                disabled={isPending}
                id="btnSaveStoreInfo"
              >
                {isPending ? (
                  <><span className="btn-spinner" />{isEn ? "Saving..." : "Menyimpan..."}</>
                ) : (
                  <>{isEn ? "Save Store Info" : "Simpan Informasi Toko"}</>
                )}
              </button>
            </div>
          </div>

          {/* ── Card 2: Preferences ─────────────────────────── */}
          <div className="settings-card">
            <div className="settings-card-header">
              <div className="settings-card-icon purple">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <circle cx="12" cy="12" r="3" />
                  <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 2.83-2.83l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z" />
                </svg>
              </div>
              <div>
                <h3 className="settings-card-title">
                  {isEn ? "Preferences" : "Preferensi Tampilan"}
                </h3>
                <p className="settings-card-sub">
                  {isEn ? "Printer size and theme color" : "Ukuran printer dan tema warna"}
                </p>
              </div>
            </div>

            <div className="settings-form-body">
              {/* Printer Width */}
              <div className="settings-form-group">
                <label>{isEn ? "Receipt Printer Width" : "Lebar Printer Struk"}</label>
                <div className="settings-option-group">
                  {PRINTER_OPTIONS.map((opt) => (
                    <button
                      key={opt.value}
                      type="button"
                      className={`settings-option-btn ${printerWidth === opt.value ? "active" : ""}`}
                      onClick={() => setPrinterWidth(opt.value)}
                      id={`printerOpt_${opt.value}`}
                    >
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <polyline points="6 9 6 2 18 2 18 9" />
                        <path d="M6 18H4a2 2 0 0 1-2-2v-5a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2v5a2 2 0 0 1-2 2h-2" />
                        <rect x="6" y="14" width="12" height="8" />
                      </svg>
                      {opt.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Theme Color */}
              <div className="settings-form-group">
                <label>{isEn ? "Theme Color" : "Tema Warna"}</label>
                <div className="settings-theme-grid">
                  {THEME_OPTIONS.map((opt) => (
                    <button
                      key={opt.value}
                      type="button"
                      className={`settings-theme-btn ${themeColor === opt.value ? "active" : ""}`}
                      onClick={() => {
                        setThemeColor(opt.value);
                        // Preview live: terapkan CSS variables langsung tanpa tunggu Save
                        applyThemeLive(opt.value);
                      }}
                      style={{ "--theme-col": opt.color } as React.CSSProperties}
                      id={`themeOpt_${opt.value}`}
                      title={opt.label}
                    >
                      <span className="theme-swatch" style={{ background: opt.color }} />
                      <span>{opt.label}</span>
                      {themeColor === opt.value && (
                        <svg className="theme-check" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3">
                          <polyline points="20 6 9 17 4 12" />
                        </svg>
                      )}
                    </button>
                  ))}
                </div>
              </div>

              <button
                type="button"
                className="btn-settings-save"
                onClick={handleSavePreferences}
                disabled={isPending}
                id="btnSavePreferences"
              >
                {isPending ? (
                  <><span className="btn-spinner" />{isEn ? "Saving..." : "Menyimpan..."}</>
                ) : (
                  <>{isEn ? "Save Preferences" : "Simpan Preferensi"}</>
                )}
              </button>
            </div>
          </div>
        </div>

        {/* ════════════════════════════════════════════════════ */}
        {/* RIGHT COLUMN                                        */}
        {/* ════════════════════════════════════════════════════ */}
        <div className="settings-right-col">

          {/* ── Card 3: Security / Change Password ──────────── */}
          <div className="settings-card">
            <div className="settings-card-header">
              <div className="settings-card-icon red">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
                  <path d="M7 11V7a5 5 0 0 1 10 0v4" />
                </svg>
              </div>
              <div>
                <h3 className="settings-card-title">
                  {isEn ? "Account Security" : "Keamanan Akun"}
                </h3>
                <p className="settings-card-sub">
                  {isEn ? "Change your admin password" : "Ubah kata sandi akun admin Anda"}
                </p>
              </div>
            </div>

            <div className="settings-form-body">
              <div className="settings-form-group">
                <label>{isEn ? "Current Password" : "Kata Sandi Lama"} <span className="required">*</span></label>
                <div className="settings-pw-wrapper">
                  <input
                    id="currentPassword"
                    type={showPw.current ? "text" : "password"}
                    value={pwForm.currentPassword}
                    onChange={(e) => setPwForm({ ...pwForm, currentPassword: e.target.value })}
                    placeholder="••••••••"
                    className="settings-input"
                  />
                  <button
                    type="button"
                    className="settings-pw-toggle"
                    onClick={() => setShowPw({ ...showPw, current: !showPw.current })}
                    tabIndex={-1}
                  >
                    {showPw.current ? (
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94" />
                        <path d="M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19" />
                        <line x1="1" y1="1" x2="23" y2="23" />
                      </svg>
                    ) : (
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
                        <circle cx="12" cy="12" r="3" />
                      </svg>
                    )}
                  </button>
                </div>
              </div>

              <div className="settings-form-group">
                <label>{isEn ? "New Password" : "Kata Sandi Baru"} <span className="required">*</span></label>
                <div className="settings-pw-wrapper">
                  <input
                    id="newPassword"
                    type={showPw.new ? "text" : "password"}
                    value={pwForm.newPassword}
                    onChange={(e) => setPwForm({ ...pwForm, newPassword: e.target.value })}
                    placeholder={isEn ? "Min 6 characters" : "Min. 6 karakter"}
                    className="settings-input"
                  />
                  <button
                    type="button"
                    className="settings-pw-toggle"
                    onClick={() => setShowPw({ ...showPw, new: !showPw.new })}
                    tabIndex={-1}
                  >
                    {showPw.new ? (
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94" />
                        <path d="M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19" />
                        <line x1="1" y1="1" x2="23" y2="23" />
                      </svg>
                    ) : (
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
                        <circle cx="12" cy="12" r="3" />
                      </svg>
                    )}
                  </button>
                </div>
              </div>

              <div className="settings-form-group">
                <label>{isEn ? "Confirm New Password" : "Konfirmasi Kata Sandi"} <span className="required">*</span></label>
                <div className="settings-pw-wrapper">
                  <input
                    id="confirmPassword"
                    type={showPw.confirm ? "text" : "password"}
                    value={pwForm.confirmPassword}
                    onChange={(e) => setPwForm({ ...pwForm, confirmPassword: e.target.value })}
                    placeholder={isEn ? "Repeat new password" : "Ulangi kata sandi baru"}
                    className="settings-input"
                  />
                  <button
                    type="button"
                    className="settings-pw-toggle"
                    onClick={() => setShowPw({ ...showPw, confirm: !showPw.confirm })}
                    tabIndex={-1}
                  >
                    {showPw.confirm ? (
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94" />
                        <path d="M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19" />
                        <line x1="1" y1="1" x2="23" y2="23" />
                      </svg>
                    ) : (
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
                        <circle cx="12" cy="12" r="3" />
                      </svg>
                    )}
                  </button>
                </div>
              </div>

              {pwError && (
                <div className="settings-pw-error">{pwError}</div>
              )}

              <button
                type="button"
                className="btn-settings-save danger"
                onClick={handleChangePassword}
                disabled={isPending}
                id="btnChangePassword"
              >
                {isPending ? (
                  <><span className="btn-spinner" />{isEn ? "Saving..." : "Menyimpan..."}</>
                ) : (
                  <>{isEn ? "Change Password" : "Ubah Kata Sandi"}</>
                )}
              </button>
            </div>
          </div>

          {/* ── Card 4: System Info ──────────────────────────── */}
          <div className="settings-card settings-sys-info">
            <div className="settings-card-header">
              <div className="settings-card-icon green">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <circle cx="12" cy="12" r="10" />
                  <line x1="12" y1="8" x2="12" y2="12" />
                  <line x1="12" y1="16" x2="12.01" y2="16" />
                </svg>
              </div>
              <div>
                <h3 className="settings-card-title">
                  {isEn ? "System Info" : "Informasi Sistem"}
                </h3>
                <p className="settings-card-sub">
                  {isEn ? "Current configuration overview" : "Ringkasan konfigurasi saat ini"}
                </p>
              </div>
            </div>
            <div className="settings-sys-rows">
              <div className="settings-sys-row">
                <span>{isEn ? "Application" : "Aplikasi"}</span>
                <strong>BrightPOS v2.0</strong>
              </div>
              <div className="settings-sys-row">
                <span>{isEn ? "Outlet Code" : "Kode Toko"}</span>
                <strong>{settings?.kodeToko ?? "-"}</strong>
              </div>
              <div className="settings-sys-row">
                <span>{isEn ? "Store Name" : "Nama Toko"}</span>
                <strong>{settings?.namaToko ?? "-"}</strong>
              </div>
              <div className="settings-sys-row">
                <span>{isEn ? "Printer Width" : "Lebar Printer"}</span>
                <strong>{printerWidth}</strong>
              </div>
              <div className="settings-sys-row">
                <span>{isEn ? "Active Theme" : "Tema Aktif"}</span>
                <strong style={{ display: "flex", alignItems: "center", gap: "6px" }}>
                  <span
                    style={{
                      width: "10px",
                      height: "10px",
                      borderRadius: "50%",
                      background: THEME_OPTIONS.find((t) => t.value === themeColor)?.color ?? "#6366F1",
                      display: "inline-block",
                    }}
                  />
                  {THEME_OPTIONS.find((t) => t.value === themeColor)?.label ?? "-"}
                </strong>
              </div>
              <div className="settings-sys-row">
                <span>{isEn ? "Timezone" : "Zona Waktu"}</span>
                <strong>Asia/Jakarta (WIB UTC+7)</strong>
              </div>
              <div className="settings-sys-row">
                <span>{isEn ? "Database" : "Database"}</span>
                <strong>PostgreSQL (Neon)</strong>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
