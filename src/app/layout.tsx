import type { Metadata, Viewport } from "next";
import localFont from "next/font/local";
import { ToastProvider } from "@/components/ui/Toast";
import { PwaRegistrar } from "@/components/pwa/PwaRegistrar";
import { SessionHeartbeat } from "@/components/auth/SessionHeartbeat";

// CSS Terpusat (Urutan: globals.css -> CSS halaman)
import "./globals.css";
import "./login/login.css";
import "./admin/admin.css";
import "./cashier/cashier.css";
import "./register/register.css";

const archivo = localFont({
  src: "../fonts/archivo.woff2",
  variable: "--font-heading",
  display: "swap",
});

const ibmPlexSans = localFont({
  src: "../fonts/ibm-plex-sans.woff2",
  variable: "--font-body",
  display: "swap",
});

const ibmPlexMono = localFont({
  src: [
    {
      path: "../fonts/ibm-plex-mono-400.woff2",
      weight: "400",
      style: "normal",
    },
    {
      path: "../fonts/ibm-plex-mono-500.woff2",
      weight: "500",
      style: "normal",
    },
    {
      path: "../fonts/ibm-plex-mono-600.woff2",
      weight: "600",
      style: "normal",
    },
    {
      path: "../fonts/ibm-plex-mono-700.woff2",
      weight: "700",
      style: "normal",
    },
  ],
  variable: "--font-mono",
  display: "swap",
});

export const metadata: Metadata = {
  title: "POS System - Modern Point of Sale",
  description: "Sistem Kasir & Manajemen Toko Modern berbasis Next.js & PostgreSQL",
  manifest: "/manifest.webmanifest",
  appleWebApp: {
    capable: true,
    statusBarStyle: "default",
    title: "POS Kasir",
  },
  icons: {
    icon: [
      { url: "/icons/icon-192x192.png", sizes: "192x192", type: "image/png" },
      { url: "/icons/icon-512x512.png", sizes: "512x512", type: "image/png" },
    ],
    apple: [
      { url: "/icons/icon-192x192.png", sizes: "192x192", type: "image/png" },
    ],
  },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
  themeColor: "#2B5D4F",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="id"
      className={`${archivo.variable} ${ibmPlexSans.variable} ${ibmPlexMono.variable}`}
    >
      <body className="antialiased selection:bg-[#2B5D4F] selection:text-white">
        <ToastProvider>
          <SessionHeartbeat />
          <PwaRegistrar />
          {children}
        </ToastProvider>
      </body>
    </html>
  );
}
