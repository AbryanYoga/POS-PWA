import type { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "POS System Modern - Kasir & Manajemen Toko",
    short_name: "POS Kasir",
    description: "Sistem Kasir & Manajemen Toko Modern Berbasis Web & Next.js",
    start_url: "/",
    id: "/",
    display: "standalone",
    background_color: "#FFFFFF",
    theme_color: "#2B5D4F",
    orientation: "any",
    scope: "/",
    icons: [
      {
        src: "/icons/icon-192x192.png",
        sizes: "192x192",
        type: "image/png",
        purpose: "any",
      },
      {
        src: "/icons/icon-512x512.png",
        sizes: "512x512",
        type: "image/png",
        purpose: "any",
      },
      {
        src: "/icons/icon-maskable-192x192.png",
        sizes: "192x192",
        type: "image/png",
        purpose: "maskable",
      },
      {
        src: "/icons/icon-maskable-512x512.png",
        sizes: "512x512",
        type: "image/png",
        purpose: "maskable",
      },
    ],
    categories: ["business", "productivity", "finance"],
    shortcuts: [
      {
        name: "Buka Kasir POS",
        short_name: "Kasir",
        description: "Buka langsung terminal kasir penjualan",
        url: "/cashier",
        icons: [{ src: "/icons/icon-192x192.png", sizes: "192x192" }],
      },
      {
        name: "Dashboard Admin",
        short_name: "Admin",
        description: "Buka dashboard manajemen toko & laporan",
        url: "/admin",
        icons: [{ src: "/icons/icon-192x192.png", sizes: "192x192" }],
      },
    ],
  };
}
