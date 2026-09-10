import {
  pgTable,
  uuid,
  varchar,
  text,
  numeric,
  integer,
  boolean,
  timestamp,
  jsonb,
  uniqueIndex,
  index,
  unique,
  pgEnum,
} from "drizzle-orm/pg-core";
import { relations } from "drizzle-orm";

// ============================================================================
// ENUMS
// ============================================================================
export const userRoleEnum = pgEnum("user_role", ["ADMIN", "CASHIER"]);
export const transactionStatusEnum = pgEnum("transaction_status", [
  "COMPLETED",
  "VOID",
  "PENDING",
]);
export const stockMovementTypeEnum = pgEnum("stock_movement_type", [
  "SALE",
  "IN",
  "OUT",
  "ADJUSTMENT",
]);

// ============================================================================
// 1. USERS (Multi-toko: di-scope oleh kode_toko)
// ============================================================================
export const users = pgTable(
  "users",
  {
    id: uuid("id").defaultRandom().primaryKey(),
    kodeToko: varchar("kode_toko", { length: 50 }).notNull(),
    namaLengkap: varchar("nama_lengkap", { length: 100 }).notNull(),
    email: varchar("email", { length: 100 }).notNull(),
    passwordHash: text("password_hash").notNull(),
    role: userRoleEnum("role").default("CASHIER").notNull(),
    isActive: boolean("is_active").default(true).notNull(),
    /**
     * tokenVersion: Di-increment setiap kali password di-reset atau akun dinonaktifkan oleh admin.
     * JWT yang dikeluarkan saat login menyimpan versi ini. Saat JWT divalidasi ulang,
     * versi di JWT dibandingkan dengan versi di DB — jika berbeda, sesi dianggap invalid
     * dan user dipaksa login ulang. Ini menggantikan kebutuhan blacklist token.
     */
    tokenVersion: integer("token_version").default(1).notNull(),
    createdAt: timestamp("created_at", { withTimezone: true })
      .defaultNow()
      .notNull(),
    updatedAt: timestamp("updated_at", { withTimezone: true })
      .defaultNow()
      .notNull(),
  },
  (table) => [
    index("idx_users_kode_toko").on(table.kodeToko),
    uniqueIndex("uq_users_email_kode_toko").on(table.email, table.kodeToko),
  ]
);


// ============================================================================
// 2. CATEGORIES
// ============================================================================
export const categories = pgTable(
  "categories",
  {
    id: uuid("id").defaultRandom().primaryKey(),
    kodeToko: varchar("kode_toko", { length: 50 }).notNull(),
    nama: varchar("nama", { length: 100 }).notNull(),
    deskripsi: text("deskripsi"),
    urutan: integer("urutan").default(0).notNull(),
    createdAt: timestamp("created_at", { withTimezone: true })
      .defaultNow()
      .notNull(),
    updatedAt: timestamp("updated_at", { withTimezone: true })
      .defaultNow()
      .notNull(),
  },
  (table) => [
    index("idx_categories_kode_toko").on(table.kodeToko),
    uniqueIndex("uq_categories_nama_kode_toko").on(table.nama, table.kodeToko),
  ]
);

// ============================================================================
// 3. PRODUCTS
// ============================================================================
export const products = pgTable(
  "products",
  {
    id: uuid("id").defaultRandom().primaryKey(),
    kodeToko: varchar("kode_toko", { length: 50 }).notNull(),
    categoryId: uuid("category_id").references(() => categories.id, {
      onDelete: "set null",
    }),
    nama: varchar("nama", { length: 150 }).notNull(),
    barcode: varchar("barcode", { length: 50 }),
    sku: varchar("sku", { length: 50 }),
    hargaBeli: numeric("harga_beli", { precision: 12, scale: 2 }).default("0").notNull(),
    hargaJual: numeric("harga_jual", { precision: 12, scale: 2 }).notNull(),
    stok: integer("stok").default(0).notNull(),
    stokMinimum: integer("stok_minimum").default(5).notNull(),
    gambar: text("gambar"),
    isActive: boolean("is_active").default(true).notNull(),
    createdAt: timestamp("created_at", { withTimezone: true })
      .defaultNow()
      .notNull(),
    updatedAt: timestamp("updated_at", { withTimezone: true })
      .defaultNow()
      .notNull(),
  },
  (table) => [
    index("idx_products_kode_toko").on(table.kodeToko),
    index("idx_products_category").on(table.categoryId),
    uniqueIndex("uq_products_barcode_kode_toko").on(table.barcode, table.kodeToko),
  ]
);

// ============================================================================
// 4. TRANSACTIONS
// Catatan Arsitektur:
// - Kolom `metode_pembayaran` menyimpan metode bayar (Cash, QRIS, Bank BCA, dll.).
// - Asumsi saat ini: "Satu transaksi = satu metode pembayaran". Jika nanti
//   dibutuhkan split payment (misal: 50% Cash + 50% QRIS), akan direfactor
//   menjadi tabel relasi `payments` terpisah.
// - `no_transaksi` (#TRX-HHMM-seq) sequence di-reset setiap hari per kode_toko.
//   Unique constraint dibuat gabungan (kode_toko + no_transaksi), bukan global.
// ============================================================================
export const transactions = pgTable(
  "transactions",
  {
    id: uuid("id").defaultRandom().primaryKey(),
    kodeToko: varchar("kode_toko", { length: 50 }).notNull(),
    noTransaksi: varchar("no_transaksi", { length: 50 }).notNull(),
    userId: uuid("user_id").references(() => users.id, { onDelete: "restrict" }),
    total: numeric("total", { precision: 12, scale: 2 }).notNull(),
    bayar: numeric("bayar", { precision: 12, scale: 2 }).notNull(),
    kembalian: numeric("kembalian", { precision: 12, scale: 2 }).default("0").notNull(),
    metodePembayaran: varchar("metode_pembayaran", { length: 50 }).notNull(),
    status: transactionStatusEnum("status").default("COMPLETED").notNull(),
    idempotencyKey: varchar("idempotency_key", { length: 100 }),
    catatan: text("catatan"),
    createdAt: timestamp("created_at", { withTimezone: true })
      .defaultNow()
      .notNull(),
  },
  (table) => [
    index("idx_transactions_kode_toko").on(table.kodeToko),
    index("idx_transactions_user").on(table.userId),
    index("idx_transactions_created_at").on(table.createdAt),
    unique("uq_transaksi_toko_no").on(table.kodeToko, table.noTransaksi),
    uniqueIndex("uq_transactions_idempotency").on(table.kodeToko, table.idempotencyKey),
  ]
);

// ============================================================================
// 5. TRANSACTION_ITEMS
// ============================================================================
export const transactionItems = pgTable(
  "transaction_items",
  {
    id: uuid("id").defaultRandom().primaryKey(),
    transactionId: uuid("transaction_id")
      .references(() => transactions.id, { onDelete: "cascade" })
      .notNull(),
    productId: uuid("product_id").references(() => products.id, {
      onDelete: "set null",
    }),
    namaProduk: varchar("nama_produk", { length: 150 }).notNull(),
    hargaBeli: numeric("harga_beli", { precision: 12, scale: 2 }).default("0").notNull(),
    hargaJual: numeric("harga_jual", { precision: 12, scale: 2 }).notNull(),
    qty: integer("qty").notNull(),
    subtotal: numeric("subtotal", { precision: 12, scale: 2 }).notNull(),
  },
  (table) => [
    index("idx_trx_items_transaction").on(table.transactionId),
    index("idx_trx_items_product").on(table.productId),
  ]
);

// ============================================================================
// 6. STOCK_MOVEMENTS
// Log riwayat audit perubahan stok (penjualan, restock masuk, keluar, adj)
// ============================================================================
export const stockMovements = pgTable(
  "stock_movements",
  {
    id: uuid("id").defaultRandom().primaryKey(),
    kodeToko: varchar("kode_toko", { length: 50 }).notNull(),
    productId: uuid("product_id")
      .references(() => products.id, { onDelete: "cascade" })
      .notNull(),
    tipe: stockMovementTypeEnum("tipe").notNull(),
    qty: integer("qty").notNull(),
    stokSebelum: integer("stok_sebelum").notNull(),
    stokSesudah: integer("stok_sesudah").notNull(),
    referensiId: uuid("referensi_id"), // ID transaksi jika penjualan
    keterangan: text("keterangan"),
    createdAt: timestamp("created_at", { withTimezone: true })
      .defaultNow()
      .notNull(),
  },
  (table) => [
    index("idx_stock_mov_kode_toko").on(table.kodeToko),
    index("idx_stock_mov_product").on(table.productId),
    index("idx_stock_mov_created_at").on(table.createdAt),
  ]
);

// ============================================================================
// 7. EXPENSES
// Pencatatan beban pengeluaran operasional toko untuk KPI Net Profit
// ============================================================================
export const expenses = pgTable(
  "expenses",
  {
    id: uuid("id").defaultRandom().primaryKey(),
    kodeToko: varchar("kode_toko", { length: 50 }).notNull(),
    kategori: varchar("kategori", { length: 100 }).notNull(),
    jumlah: numeric("jumlah", { precision: 12, scale: 2 }).notNull(),
    keterangan: text("keterangan"),
    tanggal: timestamp("tanggal", { withTimezone: true }).notNull(),
    deletedAt: timestamp("deleted_at", { withTimezone: true }),
    createdAt: timestamp("created_at", { withTimezone: true })
      .defaultNow()
      .notNull(),
  },
  (table) => [
    index("idx_expenses_kode_toko").on(table.kodeToko),
    index("idx_expenses_tanggal").on(table.tanggal),
  ]
);

// ============================================================================
// 8. AUDIT_LOGS
// Log riwayat aksi sistem penting (login, perubahan harga, hapus data, dsb)
// ============================================================================
export const auditLogs = pgTable(
  "audit_logs",
  {
    id: uuid("id").defaultRandom().primaryKey(),
    kodeToko: varchar("kode_toko", { length: 50 }).notNull(),
    userId: uuid("user_id").references(() => users.id, { onDelete: "set null" }),
    aksi: varchar("aksi", { length: 100 }).notNull(),
    detail: jsonb("detail"),
    createdAt: timestamp("created_at", { withTimezone: true })
      .defaultNow()
      .notNull(),
  },
  (table) => [
    index("idx_audit_logs_kode_toko").on(table.kodeToko),
    index("idx_audit_logs_created_at").on(table.createdAt),
  ]
);

// ============================================================================
// 9. STORE_SETTINGS
// Konfigurasi toko (identitas, cetak thermal, preferensi tema)
// ============================================================================
export const storeSettings = pgTable(
  "store_settings",
  {
    id: uuid("id").defaultRandom().primaryKey(),
    kodeToko: varchar("kode_toko", { length: 50 }).unique().notNull(),
    namaToko: varchar("nama_toko", { length: 100 }).notNull(),
    alamat: text("alamat"),
    telepon: varchar("telepon", { length: 30 }),
    printerWidth: varchar("printer_width", { length: 10 }).default("58mm").notNull(),
    themeColor: varchar("theme_color", { length: 30 }).default("primary").notNull(),
    updatedAt: timestamp("updated_at", { withTimezone: true })
      .defaultNow()
      .notNull(),
  },
  (table) => [
    uniqueIndex("uq_store_settings_kode_toko").on(table.kodeToko),
  ]
);

// ============================================================================
// RELATIONS
// ============================================================================
export const usersRelations = relations(users, ({ many }) => ({
  transactions: many(transactions),
  auditLogs: many(auditLogs),
}));

export const categoriesRelations = relations(categories, ({ many }) => ({
  products: many(products),
}));

export const productsRelations = relations(products, ({ one, many }) => ({
  category: one(categories, {
    fields: [products.categoryId],
    references: [categories.id],
  }),
  transactionItems: many(transactionItems),
  stockMovements: many(stockMovements),
}));

export const transactionsRelations = relations(transactions, ({ one, many }) => ({
  cashier: one(users, {
    fields: [transactions.userId],
    references: [users.id],
  }),
  items: many(transactionItems),
}));

export const transactionItemsRelations = relations(
  transactionItems,
  ({ one }) => ({
    transaction: one(transactions, {
      fields: [transactionItems.transactionId],
      references: [transactions.id],
    }),
    product: one(products, {
      fields: [transactionItems.productId],
      references: [products.id],
    }),
  })
);

export const stockMovementsRelations = relations(stockMovements, ({ one }) => ({
  product: one(products, {
    fields: [stockMovements.productId],
    references: [products.id],
  }),
}));

export const expensesRelations = relations(expenses, () => ({}));

export const auditLogsRelations = relations(auditLogs, ({ one }) => ({
  user: one(users, {
    fields: [auditLogs.userId],
    references: [users.id],
  }),
}));
