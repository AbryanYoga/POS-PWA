# POS System — Modern Point of Sale PWA

Sistem Point of Sale (kasir) multi-toko berbasis web, dibangun sebagai **Progressive Web App** yang bisa di-install di tablet/desktop layaknya aplikasi native. Awalnya dibangun di atas Google Apps Script + Google Sheets, lalu di-rebuild total menjadi aplikasi full-stack modern dengan Next.js dan PostgreSQL — dengan fokus utama pada **integritas transaksi** dan **keamanan multi-tenant**, bukan sekadar CRUD biasa.

> 🔗 **Live Demo:** `<isi link deploy Vercel di sini>`
> 👤 **Akun Demo:** `<isi email demo>` / `<isi password demo>` — atau daftar toko sendiri di halaman `/register`

---

## 📸 Preview

<!-- Tempel screenshot/GIF di sini setelah dideploy -->
<!-- Contoh: ![Dashboard](./docs/screenshot-dashboard.png) -->

| Login | Dashboard Admin | Cashier POS |
|---|---|---|
| _screenshot_ | _screenshot_ | _screenshot_ |

---

## ✨ Tentang Project Ini

POS PWA adalah sistem kasir untuk bisnis retail/F&B (kafe, warung, toko kelontong, dst) yang mencakup seluruh alur operasional toko:

- **Multi-toko (multi-tenant)** — satu aplikasi bisa melayani banyak toko sekaligus, masing-masing terisolasi penuh lewat `kode_toko`
- **Kasir (POS)** yang cepat dan touch-friendly, dioptimalkan untuk tablet
- **Dashboard admin** dengan data finansial real-time (bukan dummy data)
- **Analitik bisnis otomatis** — health score, analisis SWOT, dan rekomendasi berbasis data penjualan asli
- **Installable sebagai aplikasi** (PWA) — bisa dipakai offline-shell di tablet kasir tanpa perlu buka browser

Project ini sengaja dibangun dengan standar keamanan dan integritas data setingkat aplikasi finansial produksi — bukan sekadar demo CRUD — karena menyangkut uang dan stok sungguhan.

---

## 🛠️ Tech Stack

| Layer | Teknologi |
|---|---|
| **Framework** | Next.js 15 (App Router), React 19, TypeScript |
| **Styling** | Tailwind CSS, custom design system (CSS variables) |
| **Database** | PostgreSQL (Supabase) |
| **ORM** | Drizzle ORM |
| **Autentikasi** | Auth.js (NextAuth) v5, JWT session, bcrypt |
| **Font** | next/font/local — Archivo, IBM Plex Sans, IBM Plex Mono (self-hosted) |
| **PWA** | Web App Manifest, Service Worker (custom, versioned cache) |
| **Deployment** | Vercel |
| **Icon** | lucide-react |

---

## 🔐 Yang Membuat Project Ini Berbeda

Sebagian besar POS "belajar" berhenti di CRUD produk dan transaksi sederhana. Project ini menambahkan lapisan integritas data dan keamanan yang biasanya baru muncul di sistem produksi nyata:

- **Atomic transactions** — setiap checkout (kurangi stok, catat transaksi, catat item) dibungkus dalam satu database transaction; gagal sebagian = rollback semua
- **Overselling prevention** — row-level locking (`SELECT ... FOR UPDATE`) mencegah dua kasir menjual stok terakhir yang sama secara bersamaan
- **Deadlock-safe locking** — item di keranjang dikunci dalam urutan deterministik (`product_id` ascending) untuk mencegah deadlock saat checkout paralel
- **Idempotency key** — mencegah transaksi ganda akibat double-klik atau retry jaringan
- **Snapshot pricing** — laporan keuangan historis memakai harga *saat transaksi terjadi*, bukan harga produk saat ini, sehingga edit harga produk tidak pernah mengubah laporan masa lalu
- **Instant session invalidation** — staff yang dinonaktifkan admin langsung ter-logout (token versioning + heartbeat polling), termasuk validasi ulang di server saat checkout diproses
- **Last-admin-standing protection** — sistem menolak aksi yang bisa membuat satu toko kehilangan seluruh admin aktifnya
- **Multi-tenant isolation** — setiap query di-scope ketat berdasarkan `kode_toko` dari session, dengan composite unique constraint untuk mencegah kebocoran data lintas toko
- **Audit trail** — login gagal/berhasil, perubahan staff, registrasi toko baru, semuanya tercatat
- **Rate limiting** — percobaan login dan registrasi toko dibatasi per IP untuk mencegah brute-force dan spam

---

## 🚀 Fitur Utama

### Untuk Admin
- Dashboard real-time (omset, laba bersih, tren penjualan, stok menipis)
- Manajemen produk & kategori (CRUD, upload gambar, penyesuaian stok dengan jejak audit)
- Manajemen staf/kasir (role admin/kasir, nonaktifkan akun, reset password)
- Riwayat transaksi & laporan penjualan (filter periode, export CSV)
- Analitik bisnis: Business Health Score, analisis SWOT otomatis, KPI strategis
- Pengaturan toko: profil, tema warna, ukuran kertas struk

### Untuk Kasir
- Katalog produk dengan pencarian & filter kategori
- Keranjang belanja dengan kalkulasi otomatis
- Pembayaran tunai (dengan kalkulasi kembalian) & non-tunai (QRIS/transfer)
- Cetak struk thermal (58mm/80mm) & struk digital
- Riwayat transaksi milik sendiri

### Umum
- Multi-bahasa (Indonesia/Inggris)
- Progressive Web App — installable, app shell caching
- Pendaftaran toko mandiri (multi-tenant self-service)

---

## 📁 Struktur Project

```
src/
├── app/
│   ├── login/              # Halaman login
│   ├── register/           # Pendaftaran toko baru
│   ├── admin/               # Dashboard admin (SPA tab-based)
│   ├── cashier/              # POS kasir + riwayat kasir
│   ├── api/auth/            # Auth.js route handler
│   └── manifest.ts          # PWA manifest
├── components/
│   ├── admin/                # Komponen per-tab admin (dashboard, produk, kategori, dst)
│   ├── cashier/               # Komponen POS
│   ├── auth/                  # Session heartbeat
│   ├── pwa/                   # PWA registrar
│   └── ui/                    # Komponen shared (toast, dst)
├── db/
│   ├── schema.ts              # Skema Drizzle (10 tabel core)
│   └── index.ts               # Koneksi database
├── lib/
│   ├── actions/                # Server Actions (auth, pos, staff, product, dst)
│   ├── auth.ts / auth.config.ts # Konfigurasi Auth.js (Node & Edge runtime)
│   ├── analytics.ts             # Engine kalkulasi business analytics
│   └── trx-number.ts            # Generator nomor transaksi (advisory lock)
├── fonts/                       # Font self-hosted
└── middleware.ts                # Proteksi route berbasis role
```

---

## 🧱 Skema Database

10 tabel inti, semua dengan isolasi multi-tenant via `kode_toko`:

| Tabel | Fungsi |
|---|---|
| `users` | Akun admin & kasir |
| `store_settings` | Konfigurasi per toko |
| `categories` | Kategori produk |
| `products` | Katalog produk |
| `transactions` | Header transaksi penjualan |
| `transaction_items` | Detail item per transaksi (snapshot harga) |
| `stock_movements` | Jejak audit pergerakan stok |
| `expenses` | Pengeluaran operasional toko |
| `audit_logs` | Jejak aktivitas keamanan |

Relasi utama: `users → transactions → transaction_items → products → categories`

---

## ⚙️ Menjalankan Secara Lokal

### Prasyarat
- Node.js 18+
- Akun [Supabase](https://supabase.com) (gratis) untuk PostgreSQL

### Instalasi

```bash
# 1. Clone repository
git clone <url-repo-anda>
cd pos-nextjs

# 2. Install dependencies
npm install

# 3. Salin dan isi environment variables
cp .env.example .env.local
```

### Environment Variables

| Variable | Deskripsi |
|---|---|
| `DATABASE_URL` | Connection string Supabase (Transaction Pooler, port 6543) |
| `DIRECT_URL` | Connection string Supabase (Direct, port 5432) — khusus migration |
| `AUTH_SECRET` | Secret enkripsi JWT — generate via `openssl rand -base64 32` |
| `AUTH_URL` / `NEXTAUTH_URL` | Base URL aplikasi (`http://localhost:3000` untuk lokal) |

```bash
# 4. Jalankan migration ke database
npm run db:push

# 5. (Opsional) Isi data awal untuk testing
npm run db:seed

# 6. Jalankan development server
npm run dev
```

Buka [http://localhost:3000](http://localhost:3000) — akan redirect otomatis ke halaman login.

### Script Lain

```bash
npm run build       # Build production
npm run start        # Jalankan production build
npm run db:studio    # Buka Drizzle Studio (GUI database)
npm run lint          # Linting
```

---

## 🗺️ Roadmap

- [x] Autentikasi multi-tenant & role-based access control
- [x] Dashboard admin dengan data real-time
- [x] Cashier POS dengan transaksi atomic
- [x] Manajemen produk, kategori, dan stok
- [x] Riwayat transaksi & laporan keuangan
- [x] Manajemen staf & pengaturan toko
- [x] Business analytics (health score, SWOT, KPI)
- [x] Progressive Web App
- [ ] Offline-first mode (antrian transaksi via IndexedDB, sinkronisasi otomatis saat online kembali)
- [ ] Verifikasi email saat registrasi toko
- [ ] Notifikasi push untuk stok menipis

---

## 📄 Lisensi

Project ini dibuat untuk keperluan portfolio/pembelajaran.


## 👤 Kontak

Dibangun oleh **[Abryan Yoga Pratama]**