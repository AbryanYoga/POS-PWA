import type { InferSelectModel, InferInsertModel } from "drizzle-orm";
import {
  users,
  categories,
  products,
  transactions,
  transactionItems,
  stockMovements,
  expenses,
  auditLogs,
  storeSettings,
} from "@/db/schema";

// Drizzle Models
export type User = InferSelectModel<typeof users>;
export type NewUser = InferInsertModel<typeof users>;

export type Category = InferSelectModel<typeof categories>;
export type NewCategory = InferInsertModel<typeof categories>;

export type Product = InferSelectModel<typeof products>;
export type NewProduct = InferInsertModel<typeof products>;

export type Transaction = InferSelectModel<typeof transactions>;
export type NewTransaction = InferInsertModel<typeof transactions>;

export type TransactionItem = InferSelectModel<typeof transactionItems>;
export type NewTransactionItem = InferInsertModel<typeof transactionItems>;

export type StockMovement = InferSelectModel<typeof stockMovements>;
export type NewStockMovement = InferInsertModel<typeof stockMovements>;

export type Expense = InferSelectModel<typeof expenses>;
export type NewExpense = InferInsertModel<typeof expenses>;

export type AuditLog = InferSelectModel<typeof auditLogs>;
export type NewAuditLog = InferInsertModel<typeof auditLogs>;

export type StoreSettings = InferSelectModel<typeof storeSettings>;
export type NewStoreSettings = InferInsertModel<typeof storeSettings>;

// Session & Auth Types
export type UserRole = "ADMIN" | "CASHIER";

export interface SessionUser {
  id: string;
  email: string;
  namaLengkap: string;
  kodeToko: string;
  role: UserRole;
}

// POS Cart & Checkout Types
export interface CartItem {
  id: string;
  nama: string;
  hargaJual: number;
  hargaBeli: number;
  qty: number;
  gambar?: string | null;
  stok: number;
}

export type PaymentMethod =
  | "Cash"
  | "QRIS"
  | "Bank BCA"
  | "Bank Mandiri"
  | "Bank BRI";

// Analytics & Insights Types
export interface AnalyticsSummary {
  healthScore: number;
  healthGrade: string;
  healthStatus: string;
  profitMarginPct: number;
  grossProfit: number;
  aov: number;
  totalOrders: number;
  peakHour: string;
  peakHourOrders: number;
  avgItemsPerOrder: number;
  totalItemsSold: number;
}

export interface SwotItem {
  title: string;
  metric: string;
  desc: string;
  severity?: "normal" | "warning" | "danger";
}

export interface AnalyticsData {
  period: "today" | "7days" | "month" | "all";
  filterStart: string;
  filterEnd: string;
  summary: AnalyticsSummary;
  swot: {
    plus: SwotItem[];
    minus: SwotItem[];
  };
  recommendations: Array<{
    category: string;
    text: string;
  }>;
}
