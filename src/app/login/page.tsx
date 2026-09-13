"use client";

import React, { useState, useEffect, useTransition } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { TRANSLATIONS, type Language } from "@/lib/translations";
import { useToast } from "@/components/ui/Toast";
import { loginAction } from "@/lib/actions/auth-actions";

export default function LoginPage() {
  const router = useRouter();
  const { showToast } = useToast();
  const [isPending, startTransition] = useTransition();

  // Language state
  const [lang, setLang] = useState<Language>("id");
  const t = TRANSLATIONS[lang];

  // Form states
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [kodeToko, setKodeToko] = useState("");
  const [rememberMe, setRememberMe] = useState(false);

  // Field validation errors
  const [errors, setErrors] = useState<{
    email?: string;
    password?: string;
    kodeToko?: string;
  }>({});

  // Initialize saved language and remember-me credentials
  useEffect(() => {
    const savedLang = localStorage.getItem("pos_lang") as Language;
    if (savedLang === "en" || savedLang === "id") {
      setLang(savedLang);
    }

    const savedRemember = localStorage.getItem("pos_remember") === "1";
    if (savedRemember) {
      setRememberMe(true);
      const savedEmail = localStorage.getItem("pos_rem_email");
      const savedKode = localStorage.getItem("pos_rem_kode");
      if (savedEmail) setEmail(savedEmail);
      if (savedKode) setKodeToko(savedKode);
    } else {
      const lastKode = localStorage.getItem("pos_last_kode_toko");
      if (lastKode) setKodeToko(lastKode);
    }
  }, []);

  const handleToggleLang = () => {
    const nextLang: Language = lang === "id" ? "en" : "id";
    setLang(nextLang);
    localStorage.setItem("pos_lang", nextLang);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const newErrors: {
      email?: string;
      password?: string;
      kodeToko?: string;
    } = {};

    const cleanEmail = email.trim().toLowerCase();
    const cleanKode = kodeToko.trim().toUpperCase();

    if (!cleanEmail) {
      newErrors.email = t.err_email_required;
    } else if (!cleanEmail.includes("@") || !cleanEmail.includes(".")) {
      newErrors.email = t.err_email_invalid;
    }

    if (!password) {
      newErrors.password = t.err_pass_required;
    }

    if (!cleanKode) {
      newErrors.kodeToko = t.err_kode_required;
    }

    setErrors(newErrors);

    if (Object.keys(newErrors).length > 0) {
      return;
    }

    startTransition(async () => {
      try {
        const result = await loginAction({
          email: cleanEmail,
          password,
          kodeToko: cleanKode,
        });

        if (result.success) {
          showToast(t.toast_login_success, "success");

          // Save / clear credentials based on Remember Me
          localStorage.setItem("pos_last_kode_toko", cleanKode);
          if (rememberMe) {
            localStorage.setItem("pos_remember", "1");
            localStorage.setItem("pos_rem_email", cleanEmail);
            localStorage.setItem("pos_rem_kode", cleanKode);
          } else {
            localStorage.removeItem("pos_remember");
            localStorage.removeItem("pos_rem_email");
            localStorage.removeItem("pos_rem_kode");
          }

          // Redirect based on role
          const target = result.role === "ADMIN" ? "/admin" : "/cashier";
          setTimeout(() => {
            router.push(target);
            router.refresh();
          }, 600);
        } else {
          showToast(result.message || t.toast_login_failed, "error");
        }
      } catch (err) {
        console.error("Login client error:", err);
        showToast(t.toast_server_error, "error");
      }
    });
  };

  return (
    <div className="page-wrap">
      {/* KOLOM KIRI */}
      <div className="left-col">
        <div className="left-col-inner">
          {/* Brand & Quick Language Switcher */}
          <div className="brand-row">
            <div className="brand-left">
              <div className="brand-logo-box">
                <span>POS</span>
              </div>
              <div>
                <div className="brand-name">POS System</div>
                <div className="brand-sub">{t.brand_sub}</div>
              </div>
            </div>
            <button
              type="button"
              className="lang-toggle-btn"
              id="btnLoginLangToggle"
              onClick={handleToggleLang}
              title="Ganti Bahasa / Switch Language"
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
              <span id="loginLangBadge">{lang.toUpperCase()}</span>
            </button>
          </div>

          <h1 className="form-heading">{t.heading_login}</h1>
          <p className="form-subhead">{t.subhead_login}</p>

          <form className="form-card" id="loginForm" onSubmit={handleSubmit} noValidate>
            {/* Alamat Email */}
            <div className="form-group">
              <label className="form-label" htmlFor="email">
                {t.label_email}
              </label>
              <div className="input-wrapper">
                <span className="input-icon">
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
                  type="email"
                  id="email"
                  className={`form-input ${errors.email ? "is-invalid" : ""}`}
                  placeholder={t.placeholder_email}
                  autoComplete="email"
                  value={email}
                  onChange={(e) => {
                    setEmail(e.target.value);
                    if (errors.email) setErrors((prev) => ({ ...prev, email: undefined }));
                  }}
                  required
                />
              </div>
              <div className={`field-error ${errors.email ? "show" : ""}`} id="errEmail">
                {errors.email}
              </div>
            </div>

            {/* Kata Sandi */}
            <div className="form-group">
              <label className="form-label" htmlFor="password">
                {t.label_password}
              </label>
              <div className="input-wrapper">
                <span className="input-icon">
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
                    <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
                    <path d="M7 11V7a5 5 0 0 1 10 0v4" />
                  </svg>
                </span>
                <input
                  type="password"
                  id="password"
                  className={`form-input ${errors.password ? "is-invalid" : ""}`}
                  placeholder={t.placeholder_password}
                  autoComplete="current-password"
                  value={password}
                  onChange={(e) => {
                    setPassword(e.target.value);
                    if (errors.password) setErrors((prev) => ({ ...prev, password: undefined }));
                  }}
                  required
                />
              </div>
              <div className={`field-error ${errors.password ? "show" : ""}`} id="errPassword">
                {errors.password}
              </div>
            </div>

            {/* Kode Toko */}
            <div className="form-group">
              <label className="form-label" htmlFor="kodeToko">
                {t.label_kode_toko}
              </label>
              <div className="input-wrapper">
                <span className="input-icon">
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
                    <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" />
                    <circle cx="12" cy="10" r="3" />
                  </svg>
                </span>
                <input
                  type="text"
                  id="kodeToko"
                  className={`form-input ${errors.kodeToko ? "is-invalid" : ""}`}
                  placeholder={t.placeholder_kode_toko}
                  style={{
                    textTransform: "uppercase",
                    fontWeight: 600,
                    letterSpacing: "1.5px",
                  }}
                  value={kodeToko}
                  onChange={(e) => {
                    setKodeToko(e.target.value.toUpperCase());
                    if (errors.kodeToko) setErrors((prev) => ({ ...prev, kodeToko: undefined }));
                  }}
                  autoComplete="off"
                  required
                />
              </div>
              <div className="field-hint">{t.hint_kode_toko}</div>
              <div className={`field-error ${errors.kodeToko ? "show" : ""}`} id="errKodeToko">
                {errors.kodeToko}
              </div>
            </div>

            {/* Ingat Saya */}
            <div className="remember-row">
              <label className="switch-sm" htmlFor="toggleIngat">
                <input
                  type="checkbox"
                  id="toggleIngat"
                  checked={rememberMe}
                  onChange={(e) => setRememberMe(e.target.checked)}
                />
                <span className="switch-track"></span>
              </label>
              <label
                className="remember-label"
                htmlFor="toggleIngat"
              >
                {t.label_remember_me}
              </label>
            </div>

            {/* Tombol Masuk */}
            <button
              type="submit"
              className="btn-submit"
              id="btnLogin"
              disabled={isPending}
            >
              {isPending ? (
                <span className="btn-loading-wrap">
                  <span className="spinner-sm"></span>
                  <span>{t.verifying}</span>
                </span>
              ) : (
                <span id="btnText">{t.btn_login}</span>
              )}
            </button>

            <div className="register-cta">
              <span>{t.no_account_text}</span>{" "}
              <Link href="/register">{t.link_register_new}</Link>
            </div>
          </form>
        </div>
      </div>

      {/* KOLOM KANAN – Ilustrasi Desktop Only */}
      <div className="right-col" aria-hidden="true">
        <div className="blob-bg"></div>
        <div className="blob-bg-2"></div>
        <div className="illustration-wrap">
          <div className="illustration-svg-wrap">
            <svg viewBox="0 0 480 380" xmlns="http://www.w3.org/2000/svg" fill="none">
              {/* Meja counter */}
              <rect x="60" y="248" width="360" height="18" rx="6" fill="#D4C9B8" />
              <rect x="75" y="266" width="330" height="80" rx="4" fill="#C5BAA8" />
              <rect x="90" y="340" width="16" height="30" rx="4" fill="#B8AC9A" />
              <rect x="374" y="340" width="16" height="30" rx="4" fill="#B8AC9A" />
              {/* Stand tablet */}
              <rect x="215" y="234" width="50" height="16" rx="4" fill="#A89B88" />
              <rect x="230" y="218" width="20" height="18" rx="3" fill="#B8AC9A" />
              {/* Body tablet (biru denim) */}
              <rect x="185" y="108" width="110" height="120" rx="10" fill="#2B4C7E" />
              {/* Layar tablet */}
              <rect x="193" y="116" width="94" height="102" rx="6" fill="#F6F5F1" />
              {/* App header bar kecil di layar tablet */}
              <rect x="193" y="116" width="94" height="14" rx="4" fill="#2B5D4F" />
              {/* Mini grid produk 2x2 */}
              <rect x="197" y="135" width="41" height="38" rx="4" fill="#EBF2EE" />
              <rect x="243" y="135" width="41" height="38" rx="4" fill="#EBF0F7" />
              <rect x="197" y="177" width="41" height="38" rx="4" fill="#EBF0F7" />
              <rect x="243" y="177" width="41" height="38" rx="4" fill="#EBF2EE" />
              {/* Ikon kecil di setiap kartu */}
              <circle cx="217" cy="150" r="9" fill="#2B5D4F" opacity="0.22" />
              <circle cx="263" cy="150" r="9" fill="#2B4C7E" opacity="0.22" />
              <circle cx="217" cy="192" r="9" fill="#2B4C7E" opacity="0.22" />
              <circle cx="263" cy="192" r="9" fill="#2B5D4F" opacity="0.22" />
              {/* Label harga mini */}
              <rect x="200" y="162" width="32" height="6" rx="3" fill="#2B5D4F" opacity="0.35" />
              <rect x="246" y="162" width="32" height="6" rx="3" fill="#2B4C7E" opacity="0.35" />
              <rect x="200" y="205" width="32" height="6" rx="3" fill="#2B4C7E" opacity="0.35" />
              <rect x="246" y="205" width="32" height="6" rx="3" fill="#2B5D4F" opacity="0.35" />
              {/* Tombol home */}
              <circle cx="240" cy="224" r="5" fill="#1E3A5A" />
              {/* Karakter kasir */}
              {/* Sepatu */}
              <ellipse cx="163" cy="368" rx="20" ry="7" fill="#343D39" />
              <ellipse cx="117" cy="368" rx="18" ry="7" fill="#343D39" />
              {/* Celana */}
              <rect x="108" y="295" width="66" height="72" rx="8" fill="#1B3B32" />
              {/* Baju (biru denim) */}
              <rect x="104" y="210" width="74" height="90" rx="14" fill="#2B4C7E" />
              {/* Kerah putih */}
              <path
                d="M131 210 L141 235 L151 210"
                stroke="#FFFFFF"
                strokeWidth="2.5"
                fill="none"
                strokeLinecap="round"
              />
              {/* Kepala */}
              <ellipse cx="141" cy="185" rx="28" ry="30" fill="#F4D4B0" />
              {/* Rambut */}
              <path
                d="M113 175 Q113 148 141 148 Q169 148 169 175 Q165 160 141 160 Q117 160 113 175Z"
                fill="#5C3D2E"
              />
              {/* Mata */}
              <ellipse cx="130" cy="183" rx="3.5" ry="4" fill="#343D39" />
              <ellipse cx="152" cy="183" rx="3.5" ry="4" fill="#343D39" />
              {/* Senyum */}
              <path
                d="M130 196 Q141 205 152 196"
                stroke="#C07A5A"
                strokeWidth="2"
                fill="none"
                strokeLinecap="round"
              />
              {/* Tangan kiri menunjuk ke tablet */}
              <path
                d="M178 248 Q200 228 205 220"
                stroke="#F4D4B0"
                strokeWidth="10"
                strokeLinecap="round"
              />
              <circle cx="208" cy="215" r="5" fill="#F4D4B0" />
              {/* Tangan kanan */}
              <path
                d="M104 248 Q90 265 88 280"
                stroke="#F4D4B0"
                strokeWidth="10"
                strokeLinecap="round"
              />
              {/* Dekorasi */}
              <circle cx="370" cy="100" r="4" fill="#2B5D4F" opacity="0.28" />
              <circle cx="382" cy="116" r="2.5" fill="#2B4C7E" opacity="0.28" />
              <circle cx="356" cy="118" r="3" fill="#2B5D4F" opacity="0.18" />
              <circle cx="98" cy="90" r="3" fill="#2B4C7E" opacity="0.22" />
              <circle cx="86" cy="108" r="2" fill="#2B5D4F" opacity="0.2" />
            </svg>
          </div>
          <div className="right-col-tagline">
            <h2 dangerouslySetInnerHTML={{ __html: t.hero_title }} />
            <p>{t.hero_sub}</p>
          </div>
          <div className="feature-pills">
            <div className="feat-pill">
              <svg
                width="12"
                height="12"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <polyline points="20 6 9 17 4 12" />
              </svg>
              <span>{t.feat_multi_cashier}</span>
            </div>
            <div className="feat-pill">
              <svg
                width="12"
                height="12"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <polyline points="20 6 9 17 4 12" />
              </svg>
              <span>{t.feat_auto_report}</span>
            </div>
            <div className="feat-pill">
              <svg
                width="12"
                height="12"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <polyline points="20 6 9 17 4 12" />
              </svg>
              <span>{t.feat_digital_receipt}</span>
            </div>
            <div className="feat-pill">
              <svg
                width="12"
                height="12"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <polyline points="20 6 9 17 4 12" />
              </svg>
              <span>{t.feat_qris}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
