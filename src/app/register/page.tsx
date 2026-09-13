"use client";

import React, { useState, useEffect, useTransition } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useToast } from "@/components/ui/Toast";
import { registerStoreAction } from "@/lib/actions/auth-actions";
import { TRANSLATIONS, type Language } from "@/lib/translations";

export default function RegisterPage() {
  const router = useRouter();
  const { showToast } = useToast();
  const [isPending, startTransition] = useTransition();

  // Language state
  const [lang, setLang] = useState<Language>("id");
  const t = TRANSLATIONS[lang];

  // Form states
  const [namaToko, setNamaToko] = useState("");
  const [kodeToko, setKodeToko] = useState("");
  const [namaAdmin, setNamaAdmin] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  // UI helpers
  const [showPassword, setShowPassword] = useState(false);
  const [copiedKode, setCopiedKode] = useState(false);

  // Success state
  const [registeredData, setRegisteredData] = useState<{
    kodeToko: string;
    email: string;
    namaToko: string;
  } | null>(null);


  // Field validation errors
  const [errors, setErrors] = useState<{
    namaToko?: string;
    kodeToko?: string;
    namaAdmin?: string;
    email?: string;
    password?: string;
    confirmPassword?: string;
  }>({});

  // Initialize saved language
  useEffect(() => {
    const savedLang = localStorage.getItem("pos_lang") as Language;
    if (savedLang === "en" || savedLang === "id") {
      setLang(savedLang);
    }
  }, []);

  const handleToggleLang = () => {
    const nextLang: Language = lang === "id" ? "en" : "id";
    setLang(nextLang);
    localStorage.setItem("pos_lang", nextLang);
  };

  // Helper auto-generate Kode Toko dari Nama Toko
  const handleGenerateKodeToko = () => {
    if (!namaToko.trim()) {
      setErrors((prev) => ({
        ...prev,
        kodeToko: t.err_auto_need_name,
      }));
      return;
    }
    // Buat kode toko: ambil 4-6 karakter pertama alfanumerik + 2 digit angka acak
    const cleanName = namaToko
      .replace(/[^a-zA-Z0-9]/g, "")
      .toUpperCase()
      .slice(0, 6);
    const randomDigits = Math.floor(10 + Math.random() * 90);
    const generated = `${cleanName || "TOKO"}${randomDigits}`;
    setKodeToko(generated);
    setErrors((prev) => ({ ...prev, kodeToko: undefined }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const newErrors: typeof errors = {};

    const cleanNamaToko = namaToko.trim();
    const cleanKode = kodeToko.trim().toUpperCase();
    const cleanNamaAdmin = namaAdmin.trim();
    const cleanEmail = email.trim().toLowerCase();

    if (!cleanNamaToko) {
      newErrors.namaToko = t.err_nama_toko_req;
    }

    if (!cleanKode) {
      newErrors.kodeToko = t.err_kode_toko_req;
    } else if (!/^[A-Z0-9_-]{3,20}$/.test(cleanKode)) {
      newErrors.kodeToko = t.err_kode_toko_inv;
    }

    if (!cleanNamaAdmin) {
      newErrors.namaAdmin = t.err_nama_admin_req;
    }

    if (!cleanEmail) {
      newErrors.email = t.err_email_required;
    } else if (!cleanEmail.includes("@") || !cleanEmail.includes(".")) {
      newErrors.email = t.err_email_invalid;
    }

    if (!password) {
      newErrors.password = t.err_pass_required;
    } else if (password.length < 6) {
      newErrors.password = t.err_pass_min;
    }

    if (password !== confirmPassword) {
      newErrors.confirmPassword = t.err_confirm_pass_mismatch;
    }

    setErrors(newErrors);

    if (Object.keys(newErrors).length > 0) {
      return;
    }

    startTransition(async () => {
      try {
        const result = await registerStoreAction({
          namaToko: cleanNamaToko,
          kodeToko: cleanKode,
          namaAdmin: cleanNamaAdmin,
          email: cleanEmail,
          password,
        });

        if (result.success) {
          showToast(t.reg_toast_success, "success");
          setRegisteredData({
            kodeToko: cleanKode,
            email: cleanEmail,
            namaToko: cleanNamaToko,
          });
          // Simpan kode toko agar di halaman login langsung terisi otomatis
          localStorage.setItem("pos_last_kode_toko", cleanKode);
        } else {
          showToast(
            result.message || t.reg_toast_error,
            "error"
          );
        }
      } catch (err: any) {
        console.error("Register error:", err);
        showToast(t.reg_toast_catch, "error");
      }
    });
  };

  const handleCopyKode = () => {
    if (registeredData?.kodeToko) {
      navigator.clipboard.writeText(registeredData.kodeToko);
      setCopiedKode(true);
      showToast(t.reg_toast_copy, "success");
      setTimeout(() => setCopiedKode(false), 2500);
    }
  };

  return (
    <div className="reg-page-wrap">
      {/* ================================================================ */}
      {/* KOLOM KIRI: FORMULIR ATAU KARTU SUKSES */}
      {/* ================================================================ */}
      <div className="reg-left-col">
        <div className="reg-left-col-inner">
          {/* Brand Row */}
          <div className="reg-brand-row">
            <div className="reg-brand-left">
              <div className="reg-brand-logo-box">
                <span>POS</span>
              </div>
              <div>
                <div className="reg-brand-name">POS System</div>
                <div className="reg-brand-sub">{t.brand_sub}</div>
              </div>
            </div>
            <div className="reg-brand-actions">
              <button
                type="button"
                className="reg-lang-toggle-btn"
                id="btnRegisterLangToggle"
                onClick={handleToggleLang}
                title={lang === "id" ? "Switch Language (English)" : "Ganti Bahasa (Indonesia)"}
              >
                <svg
                  width="14"
                  height="14"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.75"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <circle cx="12" cy="12" r="10" />
                  <line x1="2" y1="12" x2="22" y2="12" />
                  <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z" />
                </svg>
                <span id="regLangBadge">{lang.toUpperCase()}</span>
              </button>
              <Link href="/login" className="reg-login-link-top" id="btnBackToLogin">
                <svg
                  width="14"
                  height="14"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="M15 18l-6-6 6-6" />
                </svg>
                <span>{t.back_to_login}</span>
              </Link>
            </div>
          </div>

          {registeredData ? (
            /* STATE BERHASIL (SUCCESS CARD) */
            <div className="reg-success-card">
              <div className="reg-success-icon-wrap">
                <svg
                  width="28"
                  height="28"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <polyline points="20 6 9 17 4 12" />
                </svg>
              </div>

              <h2 className="reg-success-title">{t.reg_success_title}</h2>
              <p className="reg-success-desc">
                {t.reg_success_desc_1} <strong>{registeredData.namaToko}</strong>{" "}
                {t.reg_success_desc_2}
              </p>

              <div className="reg-info-box">
                <div className="reg-info-row">
                  <span className="reg-info-label">{t.reg_your_store_code}</span>
                  <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
                    <span className="reg-info-val-badge">
                      {registeredData.kodeToko}
                    </span>
                    <button
                      type="button"
                      onClick={handleCopyKode}
                      className="reg-input-action-btn"
                      style={{ position: "static", transform: "none" }}
                      title={t.reg_btn_copy}
                    >
                      {copiedKode ? t.reg_btn_copied : t.reg_btn_copy}
                    </button>
                  </div>
                </div>
                <div className="reg-info-row">
                  <span className="reg-info-label">{t.reg_admin_email}</span>
                  <span className="reg-info-val">{registeredData.email}</span>
                </div>
              </div>

              <div className="reg-alert-notice">
                <svg
                  width="16"
                  height="16"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <circle cx="12" cy="12" r="10" />
                  <line x1="12" y1="8" x2="12" y2="12" />
                  <line x1="12" y1="16" x2="12.01" y2="16" />
                </svg>
                <span>
                  <strong>{lang === "en" ? "Important:" : "Penting:"}</strong>{" "}
                  {lang === "en"
                    ? "Save the Store Code above. You and your cashiers will need this code to log into the system."
                    : "Simpan Kode Toko di atas. Anda dan seluruh staf kasir akan memerlukan kode ini setiap kali masuk ke sistem."}
                </span>
              </div>

              <button
                type="button"
                className="reg-btn-submit"
                onClick={() => router.push("/login")}
                id="btnSuccessLoginNow"
              >
                <span>{t.reg_btn_proceed_login}</span>
                <svg
                  width="16"
                  height="16"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="M5 12h14" />
                  <path d="M12 5l7 7-7 7" />
                </svg>
              </button>
            </div>
          ) : (
            /* FORMULIR PENDAFTARAN */
            <>


              <h1 className="reg-form-heading">{t.heading_register}</h1>
              <p className="reg-form-subhead">{t.subhead_register}</p>

              <form
                className="reg-form-card"
                id="registerForm"
                onSubmit={handleSubmit}
                noValidate
              >
                {/* 1. Nama Toko */}
                <div className="reg-form-group">
                  <label className="reg-form-label" htmlFor="namaToko">
                    {t.label_nama_toko}
                  </label>
                  <div className="reg-input-wrapper">
                    <span className="reg-input-icon">
                      <svg
                        width="16"
                        height="16"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="1.75"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      >
                        <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
                        <polyline points="9 22 9 12 15 12 15 22" />
                      </svg>
                    </span>
                    <input
                      type="text"
                      id="namaToko"
                      className={`reg-form-input ${
                        errors.namaToko ? "is-invalid" : ""
                      }`}
                      placeholder={t.placeholder_nama_toko}
                      value={namaToko}
                      onChange={(e) => {
                        setNamaToko(e.target.value);
                        if (errors.namaToko)
                          setErrors((prev) => ({ ...prev, namaToko: undefined }));
                      }}
                      required
                    />
                  </div>
                  <div
                    className={`reg-field-error ${
                      errors.namaToko ? "show" : ""
                    }`}
                    id="errNamaToko"
                  >
                    {errors.namaToko}
                  </div>
                </div>

                {/* 2. Kode Toko */}
                <div className="reg-form-group">
                  <div className="reg-form-label">
                    <label htmlFor="kodeToko">{t.label_kode_toko_reg}</label>
                  </div>
                  <div className="reg-input-wrapper">
                    <span className="reg-input-icon">
                      <svg
                        width="16"
                        height="16"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="1.75"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      >
                        <rect
                          x="3"
                          y="4"
                          width="18"
                          height="16"
                          rx="2"
                        />
                        <line x1="7" y1="8" x2="17" y2="8" />
                        <line x1="7" y1="12" x2="17" y2="12" />
                        <line x1="7" y1="16" x2="13" y2="16" />
                      </svg>
                    </span>
                    <input
                      type="text"
                      id="kodeToko"
                      className={`reg-form-input ${
                        errors.kodeToko ? "is-invalid" : ""
                      }`}
                      placeholder={t.placeholder_kode_toko_reg}
                      style={{
                        textTransform: "uppercase",
                        fontWeight: 700,
                        letterSpacing: "1px",
                        paddingRight: "110px",
                      }}
                      value={kodeToko}
                      onChange={(e) => {
                        setKodeToko(e.target.value.toUpperCase());
                        if (errors.kodeToko)
                          setErrors((prev) => ({ ...prev, kodeToko: undefined }));
                      }}
                      autoComplete="off"
                      required
                    />
                    <button
                      type="button"
                      onClick={handleGenerateKodeToko}
                      className="reg-input-action-btn"
                      title={t.btn_auto_kode}
                    >
                      <svg
                        width="12"
                        height="12"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      >
                        <path d="M21.5 2v6h-6M21.34 15.57a10 10 0 1 1-.57-8.38l5.67-5.67" />
                      </svg>
                      <span>{t.btn_auto_kode}</span>
                    </button>
                  </div>
                  <div className="reg-field-hint">
                    {t.hint_kode_toko_reg}
                  </div>
                  <div
                    className={`reg-field-error ${
                      errors.kodeToko ? "show" : ""
                    }`}
                    id="errKodeToko"
                  >
                    {errors.kodeToko}
                  </div>
                </div>

                {/* 3. Nama Lengkap Admin */}
                <div className="reg-form-group">
                  <label className="reg-form-label" htmlFor="namaAdmin">
                    {t.label_nama_admin}
                  </label>
                  <div className="reg-input-wrapper">
                    <span className="reg-input-icon">
                      <svg
                        width="16"
                        height="16"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="1.75"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      >
                        <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
                        <circle cx="12" cy="7" r="4" />
                      </svg>
                    </span>
                    <input
                      type="text"
                      id="namaAdmin"
                      className={`reg-form-input ${
                        errors.namaAdmin ? "is-invalid" : ""
                      }`}
                      placeholder={t.placeholder_nama_admin}
                      value={namaAdmin}
                      onChange={(e) => {
                        setNamaAdmin(e.target.value);
                        if (errors.namaAdmin)
                          setErrors((prev) => ({ ...prev, namaAdmin: undefined }));
                      }}
                      required
                    />
                  </div>
                  <div
                    className={`reg-field-error ${
                      errors.namaAdmin ? "show" : ""
                    }`}
                    id="errNamaAdmin"
                  >
                    {errors.namaAdmin}
                  </div>
                </div>

                {/* 4. Alamat Email */}
                <div className="reg-form-group">
                  <label className="reg-form-label" htmlFor="email">
                    {t.label_email}
                  </label>
                  <div className="reg-input-wrapper">
                    <span className="reg-input-icon">
                      <svg
                        width="16"
                        height="16"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="1.75"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      >
                        <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" />
                        <polyline points="22,6 12,13 2,6" />
                      </svg>
                    </span>
                    <input
                      type="email"
                      id="email"
                      className={`reg-form-input ${
                        errors.email ? "is-invalid" : ""
                      }`}
                      placeholder={t.placeholder_email}
                      value={email}
                      onChange={(e) => {
                        setEmail(e.target.value);
                        if (errors.email)
                          setErrors((prev) => ({ ...prev, email: undefined }));
                      }}
                      autoComplete="email"
                      required
                    />
                  </div>
                  <div
                    className={`reg-field-error ${errors.email ? "show" : ""}`}
                    id="errEmail"
                  >
                    {errors.email}
                  </div>
                </div>

                {/* 5. Kata Sandi & Konfirmasi */}
                <div className="reg-form-group">
                  <label className="reg-form-label" htmlFor="password">
                    {t.label_password_reg}
                  </label>
                  <div className="reg-input-wrapper">
                    <span className="reg-input-icon">
                      <svg
                        width="16"
                        height="16"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="1.75"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      >
                        <rect
                          x="3"
                          y="11"
                          width="18"
                          height="11"
                          rx="2"
                          ry="2"
                        />
                        <path d="M7 11V7a5 5 0 0 1 10 0v4" />
                      </svg>
                    </span>
                    <input
                      type={showPassword ? "text" : "password"}
                      id="password"
                      className={`reg-form-input ${
                        errors.password ? "is-invalid" : ""
                      }`}
                      placeholder={t.placeholder_password_reg}
                      value={password}
                      onChange={(e) => {
                        setPassword(e.target.value);
                        if (errors.password)
                          setErrors((prev) => ({ ...prev, password: undefined }));
                      }}
                      autoComplete="new-password"
                      required
                    />
                    <button
                      type="button"
                      className="reg-password-toggle"
                      onClick={() => setShowPassword(!showPassword)}
                      title={showPassword ? "Hide" : "Show"}
                    >
                      {showPassword ? (
                        <svg
                          width="16"
                          height="16"
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="1.75"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        >
                          <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24" />
                          <line x1="1" y1="1" x2="23" y2="23" />
                        </svg>
                      ) : (
                        <svg
                          width="16"
                          height="16"
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="1.75"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        >
                          <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
                          <circle cx="12" cy="12" r="3" />
                        </svg>
                      )}
                    </button>
                  </div>
                  <div
                    className={`reg-field-error ${
                      errors.password ? "show" : ""
                    }`}
                    id="errPassword"
                  >
                    {errors.password}
                  </div>
                </div>

                {/* 6. Konfirmasi Kata Sandi */}
                <div className="reg-form-group">
                  <label className="reg-form-label" htmlFor="confirmPassword">
                    {t.label_confirm_password}
                  </label>
                  <div className="reg-input-wrapper">
                    <span className="reg-input-icon">
                      <svg
                        width="16"
                        height="16"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="1.75"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      >
                        <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
                      </svg>
                    </span>
                    <input
                      type={showPassword ? "text" : "password"}
                      id="confirmPassword"
                      className={`reg-form-input ${
                        errors.confirmPassword ? "is-invalid" : ""
                      }`}
                      placeholder={t.placeholder_confirm_password}
                      value={confirmPassword}
                      onChange={(e) => {
                        setConfirmPassword(e.target.value);
                        if (errors.confirmPassword)
                          setErrors((prev) => ({
                            ...prev,
                            confirmPassword: undefined,
                          }));
                      }}
                      autoComplete="new-password"
                      required
                    />
                  </div>
                  <div
                    className={`reg-field-error ${
                      errors.confirmPassword ? "show" : ""
                    }`}
                    id="errConfirmPassword"
                  >
                    {errors.confirmPassword}
                  </div>
                </div>



                {/* Submit Button */}
                <button
                  type="submit"
                  className="reg-btn-submit"
                  id="btnSubmitRegister"
                  disabled={isPending}
                >
                  {isPending ? (
                    <span className="reg-btn-loading-wrap">
                      <span className="reg-spinner-sm"></span>
                      <span>{t.btn_register_submitting}</span>
                    </span>
                  ) : (
                    <span>{t.btn_register_submit}</span>
                  )}
                </button>

                <p className="reg-terms-text">
                  {lang === "en"
                    ? "By registering, you agree to the terms of service and privacy policy of POS System."
                    : "Dengan mendaftar, Anda menyetujui seluruh ketentuan operasional dan kebijakan privasi POS System."}
                </p>

                <div className="reg-login-cta">
                  <span>{t.already_have_account}</span>{" "}
                  <Link href="/login">{t.link_login_here}</Link>
                </div>
              </form>
            </>
          )}
        </div>
      </div>

      {/* ================================================================ */}
      {/* KOLOM KANAN: ILUSTRASI & FITUR UNGGULAN */}
      {/* ================================================================ */}
      <div className="reg-right-col" aria-hidden="true">
        <div className="reg-blob-bg"></div>
        <div className="reg-blob-bg-2"></div>

        <div className="reg-illustration-wrap">
          {/* Ilustrasi Toko & Kasir Modern */}
          <div className="reg-illustration-svg-wrap">
            <svg viewBox="0 0 460 340" fill="none" xmlns="http://www.w3.org/2000/svg">
              {/* Toko Kanopi */}
              <path
                d="M50 80 L410 80 L380 125 L80 125 Z"
                fill="#2B5D4F"
              />
              <path
                d="M80 80 L130 80 L115 125 L70 125 Z"
                fill="#224A3F"
              />
              <path
                d="M190 80 L240 80 L230 125 L180 125 Z"
                fill="#224A3F"
              />
              <path
                d="M300 80 L350 80 L345 125 L295 125 Z"
                fill="#224A3F"
              />
              {/* Rumbai Kanopi */}
              <circle cx="102" cy="125" r="15" fill="#2B5D4F" />
              <circle cx="152" cy="125" r="15" fill="#224A3F" />
              <circle cx="202" cy="125" r="15" fill="#2B5D4F" />
              <circle cx="252" cy="125" r="15" fill="#224A3F" />
              <circle cx="302" cy="125" r="15" fill="#2B5D4F" />
              <circle cx="352" cy="125" r="15" fill="#224A3F" />

              {/* Dinding Toko */}
              <rect x="75" y="125" width="310" height="150" rx="4" fill="#FFFFFF" stroke="#E4E1D8" strokeWidth="2" />

              {/* Meja Etalase Kasir */}
              <rect x="100" y="195" width="260" height="80" rx="8" fill="#F6F5F1" stroke="#E4E1D8" strokeWidth="2" />
              <rect x="115" y="210" width="80" height="50" rx="4" fill="#EBF2EE" />
              <rect x="125" y="222" width="60" height="8" rx="3" fill="#2B5D4F" opacity="0.3" />
              <rect x="125" y="236" width="40" height="8" rx="3" fill="#2B5D4F" opacity="0.2" />

              {/* Layar POS Tablet Modern */}
              <rect x="220" y="150" width="96" height="74" rx="8" fill="#141A17" />
              <rect x="226" y="156" width="84" height="62" rx="4" fill="#2B5D4F" />
              {/* Header Tablet */}
              <rect x="232" y="162" width="72" height="10" rx="2" fill="#3D7D6B" />
              {/* Item Cart Tablet */}
              <rect x="232" y="178" width="40" height="6" rx="2" fill="#FFFFFF" opacity="0.8" />
              <rect x="232" y="188" width="50" height="6" rx="2" fill="#FFFFFF" opacity="0.8" />
              <rect x="232" y="198" width="30" height="6" rx="2" fill="#FFFFFF" opacity="0.8" />
              <rect x="282" y="196" width="22" height="14" rx="3" fill="#48B490" />

              {/* Penyangga Tablet */}
              <polygon points="260,224 276,224 282,246 254,246" fill="#737D78" />
              <rect x="246" y="246" width="44" height="6" rx="2" fill="#4B5563" />

              {/* Struk Pembayaran Digital Melayang */}
              <g transform="translate(325, 140) rotate(8)">
                <rect x="0" y="0" width="64" height="96" rx="4" fill="#FFFFFF" stroke="#E4E1D8" strokeWidth="1.5" />
                <rect x="12" y="12" width="40" height="6" rx="2" fill="#2B5D4F" />
                <line x1="12" y1="28" x2="52" y2="28" stroke="#E4E1D8" strokeWidth="1.5" strokeDasharray="3 3" />
                <rect x="12" y="36" width="28" height="4" rx="1.5" fill="#737D78" />
                <rect x="12" y="46" width="34" height="4" rx="1.5" fill="#737D78" />
                <rect x="12" y="56" width="22" height="4" rx="1.5" fill="#737D78" />
                <line x1="12" y1="68" x2="52" y2="68" stroke="#E4E1D8" strokeWidth="1.5" strokeDasharray="3 3" />
                <rect x="12" y="76" width="40" height="8" rx="2" fill="#EBF2EE" />
              </g>

              {/* Efek Bintang & Sparkles */}
              <circle cx="90" cy="60" r="3" fill="#2B5D4F" opacity="0.4" />
              <circle cx="390" cy="50" r="4" fill="#2B4C7E" opacity="0.3" />
              <circle cx="370" cy="270" r="3.5" fill="#2B5D4F" opacity="0.3" />
              <circle cx="60" cy="220" r="2.5" fill="#2B5D4F" opacity="0.4" />
            </svg>
          </div>

          <div className="reg-right-col-tagline">
            <h2>{t.reg_sidebar_title}</h2>
            <p>{t.reg_sidebar_sub}</p>
          </div>

          {/* Grid Keunggulan */}
          <div className="reg-feature-grid">
            <div className="reg-feature-card">
              <div className="reg-feature-card-icon">
                <svg
                  width="16"
                  height="16"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
                  <circle cx="9" cy="7" r="4" />
                  <path d="M23 21v-2a4 4 0 0 0-3-3.87" />
                  <path d="M16 3.13a4 4 0 0 1 0 7.75" />
                </svg>
              </div>
              <span className="reg-feature-card-text">{t.feat_multi_cashier}</span>
            </div>

            <div className="reg-feature-card">
              <div className="reg-feature-card-icon">
                <svg
                  width="16"
                  height="16"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <line x1="18" y1="20" x2="18" y2="10" />
                  <line x1="12" y1="20" x2="12" y2="4" />
                  <line x1="6" y1="20" x2="6" y2="14" />
                </svg>
              </div>
              <span className="reg-feature-card-text">{t.feat_auto_report}</span>
            </div>

            <div className="reg-feature-card">
              <div className="reg-feature-card-icon">
                <svg
                  width="16"
                  height="16"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z" />
                </svg>
              </div>
              <span className="reg-feature-card-text">{t.feat_digital_receipt}</span>
            </div>

            <div className="reg-feature-card">
              <div className="reg-feature-card-icon">
                <svg
                  width="16"
                  height="16"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <rect x="2" y="5" width="20" height="14" rx="2" />
                  <line x1="2" y1="10" x2="22" y2="10" />
                </svg>
              </div>
              <span className="reg-feature-card-text">{t.feat_qris}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
