"use server";

import { auth } from "@/lib/auth";
import { db } from "@/db";
import {
  transactions,
  transactionItems,
  products,
  users,
  storeSettings,
} from "@/db/schema";
import { eq, and, desc, gte, lte, sql, ilike, or } from "drizzle-orm";
import { getWibDayRange, getWib7DaysRange, formatWibDateTime, formatRupiah } from "@/lib/utils";

export interface TransactionFilterParams {
  period?: "today" | "7days" | "30days" | "this_month" | "all" | "custom";
  startDate?: string; // "YYYY-MM-DD"
  endDate?: string;   // "YYYY-MM-DD"
  paymentMethod?: string; // "ALL" | "CASH" | "QRIS"
  search?: string;
  page?: number;
  limit?: number;
}

export interface TransactionListItem {
  id: string;
  noTransaksi: string;
  kasirNama: string;
  kasirEmail: string;
  total: number;
  bayar: number;
  kembalian: number;
  metodePembayaran: string;
  status: string;
  totalItems: number;
  createdAt: string;
  rawCreatedAt: Date;
}

export interface TransactionDetail {
  id: string;
  noTransaksi: string;
  kodeToko: string;
  namaToko: string;
  alamatToko?: string | null;
  teleponToko?: string | null;
  printerWidth: string;
  kasirNama: string;
  kasirEmail: string;
  total: number;
  bayar: number;
  kembalian: number;
  metodePembayaran: string;
  status: string;
  catatan?: string | null;
  createdAt: string;
  items: {
    id: string;
    namaProduk: string;
    hargaSatuan: number;
    hargaBeli: number;
    qty: number;
    subtotal: number;
  }[];
}

export async function getTransactionsListAction(
  params: TransactionFilterParams = {}
): Promise<{
  success: boolean;
  data?: {
    transactions: TransactionListItem[];
    totalCount: number;
    page: number;
    limit: number;
    summary: {
      totalVolume: number;
      totalNominal: number;
      countCash: number;
      countQris: number;
    };
  };
  message?: string;
}> {
  try {
    const session = await auth();
    if (!session?.user?.kodeToko) {
      return { success: false, message: "Sesi admin tidak valid." };
    }

    const kodeToko = session.user.kodeToko;
    const page = Math.max(1, Number(params.page) || 1);
    const limit = Math.min(100, Math.max(5, Number(params.limit) || 20));
    const offset = (page - 1) * limit;

    // 1. Tentukan batas tanggal WIB
    let startUtc: Date | undefined;
    let endUtc: Date | undefined;
    const now = new Date();

    if (params.period === "today") {
      const r = getWibDayRange(now);
      startUtc = r.startUtc;
      endUtc = r.endUtc;
    } else if (params.period === "7days") {
      const r = getWib7DaysRange(now);
      startUtc = r.startUtc;
      endUtc = r.endUtc;
    } else if (params.period === "30days") {
      const r = getWibDayRange(now);
      const thirtyDaysAgo = new Date(r.startUtc.getTime() - 29 * 24 * 3600 * 1000);
      startUtc = thirtyDaysAgo;
      endUtc = r.endUtc;
    } else if (params.period === "custom" && params.startDate && params.endDate) {
      const startRange = getWibDayRange(params.startDate);
      const endRange = getWibDayRange(params.endDate);
      startUtc = startRange.startUtc;
      endUtc = endRange.endUtc;
    }

    // 2. Susun kondisi filter
    const conditions = [eq(transactions.kodeToko, kodeToko)];

    if (startUtc && endUtc) {
      conditions.push(gte(transactions.createdAt, startUtc));
      conditions.push(lte(transactions.createdAt, endUtc));
    }

    if (params.paymentMethod && params.paymentMethod !== "ALL") {
      conditions.push(eq(transactions.metodePembayaran, params.paymentMethod.toUpperCase()));
    }

    if (params.search && params.search.trim() !== "") {
      const q = `%${params.search.trim()}%`;
      conditions.push(
        or(
          ilike(transactions.noTransaksi, q),
          ilike(transactions.catatan, q)
        )!
      );
    }

    const whereClause = and(...conditions);

    // 3. Query All Transactions Matching Filter
    const allTrx = await db.query.transactions.findMany({
      where: whereClause,
      orderBy: [desc(transactions.createdAt)],
      with: {
        cashier: true,
        items: true,
      },
    });

    const totalCount = allTrx.length;
    const paginated = allTrx.slice(offset, offset + limit);

    // 4. Hitung Summary
    let totalNominal = 0;
    let countCash = 0;
    let countQris = 0;

    allTrx.forEach((t) => {
      totalNominal += Number(t.total || 0);
      const m = (t.metodePembayaran || "").toUpperCase();
      if (m.includes("QRIS") || m.includes("NON_CASH")) countQris++;
      else countCash++;
    });

    const mappedList: TransactionListItem[] = paginated.map((t) => ({
      id: t.id,
      noTransaksi: t.noTransaksi,
      kasirNama: t.cashier?.namaLengkap || "Kasir",
      kasirEmail: t.cashier?.email || "-",
      total: Number(t.total),
      bayar: Number(t.bayar),
      kembalian: Number(t.kembalian),
      metodePembayaran: t.metodePembayaran,
      status: t.status,
      totalItems: t.items?.reduce((sum: number, it: any) => sum + it.qty, 0) || 0,
      createdAt: formatWibDateTime(t.createdAt),
      rawCreatedAt: t.createdAt,
    }));

    return {
      success: true,
      data: {
        transactions: mappedList,
        totalCount,
        page,
        limit,
        summary: {
          totalVolume: totalCount,
          totalNominal,
          countCash,
          countQris,
        },
      },
    };
  } catch (error: any) {
    console.error("[Transaction History Error]:", error?.message || error);
    return { success: false, message: "Gagal memuat riwayat transaksi." };
  }
}

/**
 * Mengambil detail 1 transaksi lengkap dengan item penjualan untuk struk & modal
 */
export async function getTransactionDetailAction(
  transactionId: string
): Promise<{
  success: boolean;
  data?: TransactionDetail;
  message?: string;
}> {
  try {
    const session = await auth();
    if (!session?.user?.kodeToko) {
      return { success: false, message: "Sesi tidak valid." };
    }

    const kodeToko = session.user.kodeToko;

    const trx = await db.query.transactions.findFirst({
      where: and(
        eq(transactions.id, transactionId),
        eq(transactions.kodeToko, kodeToko)
      ),
      with: {
        cashier: true,
        items: true,
      },
    });

    if (!trx) {
      return { success: false, message: "Transaksi tidak ditemukan." };
    }

    const setting = await db.query.storeSettings.findFirst({
      where: eq(storeSettings.kodeToko, kodeToko),
    });

    return {
      success: true,
      data: {
        id: trx.id,
        noTransaksi: trx.noTransaksi,
        kodeToko,
        namaToko: setting?.namaToko || `Toko ${kodeToko}`,
        alamatToko: setting?.alamat || null,
        teleponToko: setting?.telepon || null,
        printerWidth: setting?.printerWidth || "58mm",
        kasirNama: trx.cashier?.namaLengkap || "Kasir",
        kasirEmail: trx.cashier?.email || "-",
        total: Number(trx.total),
        bayar: Number(trx.bayar),
        kembalian: Number(trx.kembalian),
        metodePembayaran: trx.metodePembayaran,
        status: trx.status,
        catatan: trx.catatan || null,
        createdAt: formatWibDateTime(trx.createdAt),
        items: trx.items.map((it: any) => ({
          id: it.id,
          namaProduk: it.namaProduk,
          hargaSatuan: Number(it.hargaJual),
          hargaBeli: Number(it.hargaBeli),
          qty: it.qty,
          subtotal: Number(it.subtotal),
        })),
      },
    };
  } catch (error: any) {
    console.error("[Transaction Detail Error]:", error?.message || error);
    return { success: false, message: "Gagal memuat detail transaksi." };
  }
}
