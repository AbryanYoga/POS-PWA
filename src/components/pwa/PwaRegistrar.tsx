"use client";

import { useEffect, useState } from "react";
import { useToast } from "@/components/ui/Toast";

interface BeforeInstallPromptEvent extends Event {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: "accepted" | "dismissed"; platform: string }>;
}

export function PwaRegistrar() {
  const { showToast } = useToast();
  const [deferredPrompt, setDeferredPrompt] = useState<BeforeInstallPromptEvent | null>(null);
  const [isInstallable, setIsInstallable] = useState(false);
  const [showIosPrompt, setShowIosPrompt] = useState(false);

  useEffect(() => {
    // 1. Daftarkan Service Worker & tangani siklus update
    if (typeof window !== "undefined" && "serviceWorker" in navigator) {
      window.addEventListener("load", () => {
        navigator.serviceWorker
          .register("/sw.js")
          .then((registration) => {
            console.log("[PWA] Service Worker terdaftar:", registration.scope);

            // Cek update saat tab/halaman dibuka
            registration.addEventListener("updatefound", () => {
              const installingWorker = registration.installing;
              if (installingWorker) {
                installingWorker.addEventListener("statechange", () => {
                  if (
                    installingWorker.state === "installed" &&
                    navigator.serviceWorker.controller
                  ) {
                    showToast(
                      "Versi baru POS telah diperbarui di latar belakang.",
                      "info"
                    );
                  }
                });
              }
            });
          })
          .catch((err) => {
            console.warn("[PWA] Registrasi Service Worker gagal:", err);
          });
      });

      // Reload tab jika ada controllerchange (ketika SW baru memanggil clients.claim())
      let refreshing = false;
      navigator.serviceWorker.addEventListener("controllerchange", () => {
        if (!refreshing) {
          refreshing = true;
          // SW baru sudah aktif mengambil alih kendali
          console.log("[PWA] Service worker baru telah mengambil alih kendali.");
        }
      });
    }

    // 2. Cek apakah sudah dalam mode standalone (app sudah terinstall)
    const isStandalone =
      window.matchMedia("(display-mode: standalone)").matches ||
      ("standalone" in navigator && (navigator as { standalone?: boolean }).standalone === true);

    if (isStandalone) {
      return;
    }

    // 3. Tangkap event prompt instalasi PWA (Chrome/Edge di Android/Windows/macOS)
    const handleBeforeInstallPrompt = (e: Event) => {
      e.preventDefault();
      setDeferredPrompt(e as BeforeInstallPromptEvent);
      setIsInstallable(true);
    };

    window.addEventListener("beforeinstallprompt", handleBeforeInstallPrompt);

    // 4. Deteksi Safari di iOS/iPadOS (yang tidak mendukung beforeinstallprompt)
    const isIos =
      /iPad|iPhone|iPod/.test(navigator.userAgent) ||
      (navigator.maxTouchPoints > 1 && /Macintosh/.test(navigator.userAgent));

    const isSafari =
      /Safari/.test(navigator.userAgent) && !/Chrome|CriOS|FxiOS|EdgiOS/.test(navigator.userAgent);

    const iosDismissed = localStorage.getItem("pos_pwa_ios_dismissed") === "1";

    if (isIos && isSafari && !iosDismissed) {
      // Tampilkan panduan instalasi iOS jika belum di-dismiss
      setShowIosPrompt(true);
    }

    // 5. Listener Status Jaringan (Online / Offline)
    const handleOnline = () => {
      showToast("Koneksi internet terhubung kembali.", "success");
    };

    const handleOffline = () => {
      showToast("Anda sedang offline. Transaksi kasir membutuhkan koneksi.", "error");
    };

    window.addEventListener("online", handleOnline);
    window.addEventListener("offline", handleOffline);

    return () => {
      window.removeEventListener("beforeinstallprompt", handleBeforeInstallPrompt);
      window.removeEventListener("online", handleOnline);
      window.removeEventListener("offline", handleOffline);
    };
  }, [showToast]);

  const handleInstallClick = async () => {
    if (!deferredPrompt) return;
    await deferredPrompt.prompt();
    const { outcome } = await deferredPrompt.userChoice;
    if (outcome === "accepted") {
      setIsInstallable(false);
      setDeferredPrompt(null);
      showToast("Aplikasi POS berhasil dipasang di perangkat!", "success");
    }
  };

  const dismissIosPrompt = () => {
    setShowIosPrompt(false);
    localStorage.setItem("pos_pwa_ios_dismissed", "1");
  };

  // Render Prompt Chrome/Edge Android/Windows
  if (isInstallable) {
    return (
      <div
        style={{
          position: "fixed",
          bottom: 20,
          right: 20,
          zIndex: 9999,
          background: "#1A2421",
          color: "#FFFFFF",
          padding: "12px 18px",
          borderRadius: 14,
          boxShadow: "0 10px 30px rgba(0,0,0,0.3)",
          display: "flex",
          alignItems: "center",
          gap: 12,
          border: "1px solid rgba(255,255,255,0.15)",
        }}
      >
        <div
          style={{
            width: 36,
            height: 36,
            borderRadius: 8,
            background: "#2B5D4F",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#FFFFFF" strokeWidth="2">
            <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
            <polyline points="7 10 12 15 17 10" />
            <line x1="12" y1="15" x2="12" y2="3" />
          </svg>
        </div>
        <div>
          <div style={{ fontSize: 13, fontWeight: 700 }}>Pasang POS Kasir</div>
          <div style={{ fontSize: 11, color: "#A3B3AC" }}>Buka lebih cepat sebagai aplikasi standalone</div>
        </div>
        <button
          type="button"
          onClick={handleInstallClick}
          style={{
            marginLeft: 8,
            background: "#10B981",
            color: "#FFFFFF",
            border: "none",
            padding: "8px 14px",
            borderRadius: 8,
            fontSize: 12,
            fontWeight: 600,
            cursor: "pointer",
          }}
        >
          Install
        </button>
        <button
          type="button"
          onClick={() => setIsInstallable(false)}
          style={{
            background: "transparent",
            border: "none",
            color: "#8C9993",
            cursor: "pointer",
            padding: 4,
          }}
          title="Tutup"
        >
          ✕
        </button>
      </div>
    );
  }

  // Render Prompt Safari di iPad / iPhone
  if (showIosPrompt) {
    return (
      <div
        style={{
          position: "fixed",
          bottom: 20,
          left: 20,
          right: 20,
          maxWidth: 420,
          margin: "0 auto",
          zIndex: 9999,
          background: "#1A2421",
          color: "#FFFFFF",
          padding: "14px 18px",
          borderRadius: 16,
          boxShadow: "0 12px 36px rgba(0,0,0,0.35)",
          display: "flex",
          alignItems: "flex-start",
          gap: 12,
          border: "1px solid rgba(255,255,255,0.15)",
        }}
      >
        <div
          style={{
            width: 38,
            height: 38,
            borderRadius: 10,
            background: "#2B5D4F",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            flexShrink: 0,
            marginTop: 2,
          }}
        >
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#FFFFFF" strokeWidth="2">
            <path d="M4 12v8a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-8" />
            <polyline points="16 6 12 2 8 6" />
            <line x1="12" y1="2" x2="12" y2="15" />
          </svg>
        </div>
        <div style={{ flex: 1 }}>
          <div style={{ fontSize: 13, fontWeight: 700, marginBottom: 4 }}>
            Pasang di iPad / iPhone
          </div>
          <div style={{ fontSize: 12, color: "#C5D1CB", lineHeight: 1.4 }}>
            Tap tombol <strong>Bagikan</strong> (ikon <span style={{ fontSize: 14 }}>⎋</span> di browser Safari), lalu pilih <strong>&quot;Add to Home Screen&quot;</strong>.
          </div>
        </div>
        <button
          type="button"
          onClick={dismissIosPrompt}
          style={{
            background: "transparent",
            border: "none",
            color: "#8C9993",
            cursor: "pointer",
            padding: 4,
            fontSize: 14,
          }}
          title="Tutup"
        >
          ✕
        </button>
      </div>
    );
  }

  return null;
}
