# POS System — Modern Point of Sale PWA

A multi-store, web-based Point of Sale (cashier) system, built as a **Progressive Web App** that can be installed on tablets/desktops just like a native app. Originally built on top of Google Apps Script + Google Sheets, then completely rebuilt into a modern full-stack application with Next.js and PostgreSQL — with a primary focus on **transaction integrity** and **multi-tenant security**, rather than just basic CRUD.

> 🔗 **Live Demo:** https://pos-pwa-ebon.vercel.app
> 🎥 **Video Demo:** https://youtu.be/L-OwnL9O7A8

### Demo Accounts

| Role | Email | Password |
|---|---|---|
| Admin | `demo.admin@posdemo.app` | `Demo1234` |
| Cashier | `demo.kasir@posdemo.app` | `Demo1234` |

**Store Code:** `DEMO01`

---

## ✨ About This Project

POS PWA is a cashier system for retail/F&B businesses (cafes, small shops, grocery stores, etc.) that covers the entire store operations flow:

- **Multi-store (multi-tenant)** — a single application can serve many stores at once, each fully isolated via `kode_toko` (store code)
- **Fast, touch-friendly POS (cashier)**, optimized for tablets
- **Admin dashboard** with real-time financial data (not dummy data)
- **Automated business analytics** — health score, SWOT analysis, and recommendations based on real sales data
- **Installable as an app** (PWA) — can be used as an offline-shell on cashier tablets without needing to open a browser

This project was deliberately built with security and data integrity standards on par with production-grade financial applications — not just a CRUD demo — because it deals with real money and real inventory.

---

## 🛠️ Tech Stack

| Layer | Technology |
|---|---|
| **Framework** | Next.js 15 (App Router), React 19, TypeScript |
| **Styling** | Tailwind CSS, custom design system (CSS variables) |
| **Database** | PostgreSQL (Supabase) |
| **ORM** | Drizzle ORM |
| **Authentication** | Auth.js (NextAuth) v5, JWT session, bcrypt |
| **Font** | next/font/local — Archivo, IBM Plex Sans, IBM Plex Mono (self-hosted) |
| **PWA** | Web App Manifest, Service Worker (custom, versioned cache) |
| **Deployment** | Vercel |
| **Icons** | lucide-react |

---

## 🔐 What Sets This Project Apart

Most "learning" POS systems stop at simple product and transaction CRUD. This project adds a layer of data integrity and security that typically only appears in real production systems:

- **Atomic transactions** — every checkout (reducing stock, recording the transaction, recording items) is wrapped in a single database transaction; a partial failure rolls back everything
- **Overselling prevention** — row-level locking (`SELECT ... FOR UPDATE`) prevents two cashiers from selling the same last unit of stock at the same time
- **Deadlock-safe locking** — cart items are locked in a deterministic order (`product_id` ascending) to prevent deadlocks during parallel checkouts
- **Idempotency key** — prevents duplicate transactions caused by double-clicks or network retries
- **Price & category snapshotting** — historical financial reports use the price and category *as they were at the time of the transaction*, not the current product data, so editing a product's price/category never changes past reports
- **Instant session invalidation** — staff deactivated by an admin are logged out immediately (token versioning + heartbeat polling), including re-validation on the server when checkout is processed
- **Last-admin-standing protection** — the system rejects actions that would leave a store with no active admins at all
- **Multi-tenant isolation** — every query is strictly scoped by the `kode_toko` (store code) from the session, with a composite unique constraint to prevent cross-store data leaks
- **Audit trail** — failed/successful logins, staff changes, new store registrations — all recorded
- **Rate limiting** — login and store registration attempts are limited per IP to prevent brute-force attacks and spam

---

## 🚀 Key Features

### For Admins
- Real-time dashboard (revenue, net profit, sales trends, low stock)
- Product & category management (CRUD, image upload, stock adjustments with an audit trail)
- Staff/cashier management (admin/cashier roles, deactivate accounts, password reset)
- Transaction history & sales reports (filter by period, export to CSV)
- Business analytics: Business Health Score, automated SWOT analysis, strategic KPIs
- Store settings: profile, color theme, receipt paper size

### For Cashiers
- Product catalog with search & category filters
- Shopping cart with automatic calculation
- Cash payment (with change calculation) & non-cash payment (QRIS, BCA/BRI/Mandiri banks — simulated)
- Thermal receipt printing (58mm/80mm) & digital receipts
- Personal transaction history

### General
- Multi-language (Indonesian/English)
- Progressive Web App — installable, app shell caching
- Self-service store registration (multi-tenant self-service)

---

## 📁 Project Structure

```
src/
├── app/
│   ├── login/              # Login page
│   ├── register/           # New store registration
│   ├── admin/               # Admin dashboard (tab-based SPA)
│   ├── cashier/              # Cashier POS + cashier history
│   ├── api/auth/            # Auth.js route handler
│   └── manifest.ts          # PWA manifest
├── components/
│   ├── admin/                # Per-tab admin components (dashboard, products, categories, etc.)
│   ├── cashier/               # POS components
│   ├── auth/                  # Session heartbeat
│   ├── pwa/                   # PWA registrar
│   └── ui/                    # Shared components (toast, etc.)
├── db/
│   ├── schema.ts              # Drizzle schema (10 core tables)
│   └── index.ts               # Database connection
├── lib/
│   ├── actions/                # Server Actions (auth, pos, staff, product, etc.)
│   ├── auth.ts / auth.config.ts # Auth.js configuration (Node & Edge runtime)
│   ├── analytics.ts             # Business analytics calculation engine
│   └── trx-number.ts            # Transaction number generator (advisory lock)
├── fonts/                       # Self-hosted fonts
└── middleware.ts                # Role-based route protection
```

---

## 🧱 Database Schema

10 core tables, all with multi-tenant isolation via `kode_toko` (store code):

| Table | Purpose |
|---|---|
| `users` | Admin & cashier accounts |
| `store_settings` | Per-store configuration |
| `categories` | Product categories |
| `products` | Product catalog |
| `transactions` | Sales transaction headers |
| `transaction_items` | Per-transaction item details (price & category snapshot) |
| `stock_movements` | Stock movement audit trail |
| `expenses` | Store operational expenses |
| `audit_logs` | Security activity trail |

Main relation: `users → transactions → transaction_items → products → categories`

---

## ⚙️ Running Locally

### Prerequisites
- Node.js 18+
- A [Supabase](https://supabase.com) account (free) for PostgreSQL

### Installation

```bash
# 1. Clone the repository
git clone <your-repo-url>
cd pos-nextjs

# 2. Install dependencies
npm install

# 3. Copy and fill in environment variables
cp .env.example .env.local
```

### Environment Variables

| Variable | Description |
|---|---|
| `DATABASE_URL` | Supabase connection string (Transaction Pooler, port 6543) |
| `DIRECT_URL` | Supabase connection string (Direct, port 5432) — for migrations only |
| `AUTH_SECRET` | JWT encryption secret — generate via `openssl rand -base64 32` |
| `AUTH_URL` / `NEXTAUTH_URL` | Application base URL (`http://localhost:3000` for local) |

```bash
# 4. Run the migration to the database
npm run db:push

# 5. (Optional) Seed initial data for testing
npm run db:seed

# 6. Run the development server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) — it will automatically redirect to the login page.

### Other Scripts

```bash
npm run build       # Production build
npm run start        # Run production build
npm run db:studio    # Open Drizzle Studio (database GUI)
npm run lint          # Linting
```

---

## 🗺️ Roadmap

- [x] Multi-tenant authentication & role-based access control
- [x] Admin dashboard with real-time data
- [x] Cashier POS with atomic transactions
- [x] Product, category, and stock management
- [x] Transaction history & financial reports
- [x] Staff management & store settings
- [x] Business analytics (health score, SWOT, KPIs)
- [x] Progressive Web App
- [x] Multi-channel payment simulation (QRIS, BCA/BRI/Mandiri banks)
- [x] Offline-first mode (transaction queue via IndexedDB, automatic sync when back online)
- [x] Email verification on store registration
- [x] Push notifications for low stock

---

## 📄 License

This project was created for portfolio/learning purposes.

---

## 👤 Contact

Built by **Abryan Yoga Pratama**