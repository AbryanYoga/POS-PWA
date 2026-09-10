"use server";

import { db } from "@/db";
import { transactions, transactionItems } from "@/db/schema";
import { eq, and, desc, gte, lte, inArray } from "drizzle-orm";
import { auth } from "@/lib/auth";
import { normalizeKodeToko, getWibDayRange, getWib7DaysRange, getWib30DaysRange } from "@/lib/utils";

// ============================================================================
// TYPES
// ============================================================================
export interface CashierTxItem {
  id: string;
  productId: string | null;
  namaProduk: string;
  hargaJual: number;
  qty: number;
  subtotal: number;
}

export interface CashierTxRecord {
  id: string;
  noTransaksi: string;
  total: number;
  bayar: number;
  kembalian: number;
  metodePembayaran: string;
  status: string;
  catatan: string | null;
  createdAt: string;
  items: CashierTxItem[];
}

export interface CashierHistoryResult {
  success: boolean;
  data?: CashierTxRecord[];
  error?: string;
  stats?: {
    totalTransaksi: number;
    totalPendapatan: number;
    rataRataPerTransaksi: number;
  };
}

export type CashierHistoryPeriod = "today" | "7days" | "30days";

// ============================================================================
// GET CASHIER TRANSACTION HISTORY
// Hanya menampilkan transaksi yang dibuat oleh kasir yang sedang login.
// TIDAK ada data finansial toko keseluruhan — itu wewenang admin.
// ============================================================================
export async function getCashierHistory(
  period: CashierHistoryPeriod = "today"
): Promise<CashierHistoryResult> {
  try {
    const session = await auth();
    if (!session?.user?.id || !session.user.kodeToko) {
      return { success: false, error: "Sesi tidak valid. Silakan login kembali." };
    }

    const userId = session.user.id;
    const kodeToko = normalizeKodeToko(session.user.kodeToko);

    // Tentukan rentang waktu berdasarkan periode (batas WIB)
    const now = new Date();
    let startUtc: Date;
    let endUtc: Date;

    if (period === "today") {
      const range = getWibDayRange(now);
      startUtc = range.startUtc;
      endUtc = range.endUtc;
    } else if (period === "7days") {
      const range = getWib7DaysRange(now);
      startUtc = range.startUtc;
      endUtc = range.endUtc;
    } else {
      // 30days
      const range = getWib30DaysRange(now);
      startUtc = range.startUtc;
      endUtc = range.endUtc;
    }

    // Query transaksi MILIK kasir ini saja (userId + kodeToko scope)
    const txRows = await db
      .select({
        id: transactions.id,
        noTransaksi: transactions.noTransaksi,
        total: transactions.total,
        bayar: transactions.bayar,
        kembalian: transactions.kembalian,
        metodePembayaran: transactions.metodePembayaran,
        status: transactions.status,
        catatan: transactions.catatan,
        createdAt: transactions.createdAt,
      })
      .from(transactions)
      .where(
        and(
          eq(transactions.kodeToko, kodeToko),
          eq(transactions.userId, userId),
          gte(transactions.createdAt, startUtc),
          lte(transactions.createdAt, endUtc)
        )
      )
      .orderBy(desc(transactions.createdAt));

    if (txRows.length === 0) {
      return {
        success: true,
        data: [],
        stats: { totalTransaksi: 0, totalPendapatan: 0, rataRataPerTransaksi: 0 },
      };
    }

    // Fetch semua items dalam satu query
    const txIds = txRows.map((t) => t.id);
    const allItems = await db
      .select({
        transactionId: transactionItems.transactionId,
        id: transactionItems.id,
        productId: transactionItems.productId,
        namaProduk: transactionItems.namaProduk,
        hargaJual: transactionItems.hargaJual,
        qty: transactionItems.qty,
        subtotal: transactionItems.subtotal,
      })
      .from(transactionItems)
      .where(inArray(transactionItems.transactionId, txIds));

    // Group items by transactionId
    const itemsByTx = new Map<string, CashierTxItem[]>();
    for (const item of allItems) {
      const list = itemsByTx.get(item.transactionId) ?? [];
      list.push({
        id: item.id,
        productId: item.productId,
        namaProduk: item.namaProduk,
        hargaJual: parseFloat(String(item.hargaJual)),
        qty: item.qty,
        subtotal: parseFloat(String(item.subtotal)),
      });
      itemsByTx.set(item.transactionId, list);
    }

    // Build result
    const data: CashierTxRecord[] = txRows.map((tx) => ({
      id: tx.id,
      noTransaksi: tx.noTransaksi,
      total: parseFloat(String(tx.total)),
      bayar: parseFloat(String(tx.bayar)),
      kembalian: parseFloat(String(tx.kembalian)),
      metodePembayaran: tx.metodePembayaran,
      status: tx.status,
      catatan: tx.catatan,
      createdAt: tx.createdAt.toISOString(),
      items: itemsByTx.get(tx.id) ?? [],
    }));

    // Stats hanya transaksi kasir ini (bukan seluruh toko)
    const completedTx = data.filter((t) => t.status === "COMPLETED");
    const totalPendapatan = completedTx.reduce((sum, t) => sum + t.total, 0);

    return {
      success: true,
      data,
      stats: {
        totalTransaksi: data.length,
        totalPendapatan,
        rataRataPerTransaksi:
          completedTx.length > 0 ? Math.round(totalPendapatan / completedTx.length) : 0,
      },
    };
  } catch (err) {
    console.error("[getCashierHistory]", err);
    return { success: false, error: "Gagal memuat riwayat transaksi." };
  }
}
