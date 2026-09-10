"use server";

import { auth } from "@/lib/auth";
import { db } from "@/db";
import {
  transactions,
  transactionItems,
  products,
  categories,
  expenses,
  users,
} from "@/db/schema";
import { eq, and, desc, gte, lte, sql } from "drizzle-orm";
import { getWibDayRange, getWib7DaysRange, formatWibDateTime } from "@/lib/utils";

export interface SalesReportParams {
  period?: "today" | "7days" | "30days" | "this_month" | "all" | "custom";
  startDate?: string;
  endDate?: string;
}

export interface ExpenseItem {
  id: string;
  kategori: string;
  jumlah: number;
  keterangan?: string | null;
  tanggal: string;
  createdAt: string;
}

export interface BestSellerItem {
  id: string;
  nama: string;
  categoryName: string;
  qtySold: number;
  totalOmset: number;
  totalProfit: number;
}

export interface CategorySalesItem {
  id: string;
  nama: string;
  qtySold: number;
  totalOmset: number;
}

export interface SalesReportData {
  periodLabel: string;
  totalGrossRevenue: number; // Omset Kotor
  totalCogs: number;         // Total HPP (Harga Pokok Penjualan)
  totalGrossProfit: number;   // Laba Kotor (Omset - HPP)
  totalExpenses: number;      // Total Beban Pengeluaran Operasional
  totalNetProfit: number;     // Laba Bersih (Laba Kotor - Pengeluaran)
  totalTransactionsCount: number;
  totalUnitsSold: number;
  avgOrderValue: number;
  paymentBreakdown: {
    cashNominal: number;
    cashCount: number;
    qrisNominal: number;
    qrisCount: number;
  };
  bestSellers: BestSellerItem[];
  categorySales: CategorySalesItem[];
  expensesList: ExpenseItem[];
}

export async function getSalesReportDataAction(
  params: SalesReportParams = {}
): Promise<{
  success: boolean;
  data?: SalesReportData;
  message?: string;
}> {
  try {
    const session = await auth();
    if (!session?.user?.kodeToko) {
      return { success: false, message: "Sesi admin tidak valid." };
    }

    const kodeToko = session.user.kodeToko;
    const now = new Date();

    let startUtc: Date | undefined;
    let endUtc: Date | undefined;
    let periodLabel = "7 Hari Terakhir";

    if (params.period === "today") {
      const r = getWibDayRange(now);
      startUtc = r.startUtc;
      endUtc = r.endUtc;
      periodLabel = `Hari Ini (${r.dateStr})`;
    } else if (params.period === "7days" || !params.period) {
      const r = getWib7DaysRange(now);
      startUtc = r.startUtc;
      endUtc = r.endUtc;
      periodLabel = "7 Hari Terakhir";
    } else if (params.period === "30days") {
      const r = getWibDayRange(now);
      const thirtyDaysAgo = new Date(r.startUtc.getTime() - 29 * 24 * 3600 * 1000);
      startUtc = thirtyDaysAgo;
      endUtc = r.endUtc;
      periodLabel = "30 Hari Terakhir";
    } else if (params.period === "custom" && params.startDate && params.endDate) {
      const startRange = getWibDayRange(params.startDate);
      const endRange = getWibDayRange(params.endDate);
      startUtc = startRange.startUtc;
      endUtc = endRange.endUtc;
      periodLabel = `${params.startDate} s/d ${params.endDate}`;
    }

    // 1. Fetch Completed Transactions in Period
    const conditions = [
      eq(transactions.kodeToko, kodeToko),
      eq(transactions.status, "COMPLETED"),
    ];

    if (startUtc && endUtc) {
      conditions.push(gte(transactions.createdAt, startUtc));
      conditions.push(lte(transactions.createdAt, endUtc));
    }

    const periodTrx = await db.query.transactions.findMany({
      where: and(...conditions),
      with: {
        items: true,
      },
    });

    // 2. Fetch Expenses in Period
    const expenseConditions = [eq(expenses.kodeToko, kodeToko)];
    if (startUtc && endUtc) {
      expenseConditions.push(gte(expenses.tanggal, startUtc));
      expenseConditions.push(lte(expenses.tanggal, endUtc));
    }

    const periodExpenses = await db.query.expenses.findMany({
      where: and(...expenseConditions),
      orderBy: [desc(expenses.tanggal)],
    });

    // 3. Aggregate Financial Metrics
    let totalGrossRevenue = 0;
    let totalCogs = 0;
    let totalUnitsSold = 0;
    let cashNominal = 0;
    let cashCount = 0;
    let qrisNominal = 0;
    let qrisCount = 0;

    const productSalesMap = new Map<
      string,
      { nama: string; qty: number; omset: number; cogs: number; categoryId?: string }
    >();

    periodTrx.forEach((tx) => {
      const txTotal = Number(tx.total || 0);
      totalGrossRevenue += txTotal;

      const m = (tx.metodePembayaran || "").toUpperCase();
      if (m.includes("QRIS") || m.includes("NON_CASH")) {
        qrisNominal += txTotal;
        qrisCount++;
      } else {
        cashNominal += txTotal;
        cashCount++;
      }

      tx.items?.forEach((it) => {
        const itQty = it.qty || 0;
        const itSubtotal = Number(it.subtotal || 0);
        const itHpp = Number(it.hargaBeli || 0) * itQty;

        totalUnitsSold += itQty;
        totalCogs += itHpp;

        const prodId = it.productId || it.namaProduk;
        const exist = productSalesMap.get(prodId) || {
          nama: it.namaProduk,
          qty: 0,
          omset: 0,
          cogs: 0,
        };
        exist.qty += itQty;
        exist.omset += itSubtotal;
        exist.cogs += itHpp;
        productSalesMap.set(prodId, exist);
      });
    });

    const totalGrossProfit = totalGrossRevenue - totalCogs;
    const totalExpenses = periodExpenses.reduce(
      (sum, ex) => sum + Number(ex.jumlah || 0),
      0
    );
    const totalNetProfit = totalGrossProfit - totalExpenses;
    const totalTransactionsCount = periodTrx.length;
    const avgOrderValue =
      totalTransactionsCount > 0
        ? Math.round(totalGrossRevenue / totalTransactionsCount)
        : 0;

    // 4. Top Best Sellers
    const allProducts = await db.query.products.findMany({
      where: eq(products.kodeToko, kodeToko),
      with: { category: true },
    });

    const bestSellers: BestSellerItem[] = Array.from(productSalesMap.entries())
      .map(([prodId, val]) => {
        const prodMatch = allProducts.find((p) => p.id === prodId || p.nama === val.nama);
        return {
          id: prodId,
          nama: val.nama,
          categoryName: prodMatch?.category?.nama || "Umum",
          qtySold: val.qty,
          totalOmset: val.omset,
          totalProfit: val.omset - val.cogs,
        };
      })
      .sort((a, b) => b.qtySold - a.qtySold)
      .slice(0, 10);

    // 5. Category Sales Breakdown
    const allCategories = await db.query.categories.findMany({
      where: eq(categories.kodeToko, kodeToko),
      orderBy: [categories.urutan],
    });

    const categorySales: CategorySalesItem[] = allCategories.map((cat) => {
      const catProductIds = new Set(
        allProducts.filter((p) => p.categoryId === cat.id).map((p) => p.id)
      );

      let catQty = 0;
      let catOmset = 0;

      productSalesMap.forEach((val, pId) => {
        if (catProductIds.has(pId)) {
          catQty += val.qty;
          catOmset += val.omset;
        }
      });

      return {
        id: cat.id,
        nama: cat.nama,
        qtySold: catQty,
        totalOmset: catOmset,
      };
    });

    // 6. Format Expenses
    const expensesList: ExpenseItem[] = periodExpenses.map((ex) => ({
      id: ex.id,
      kategori: ex.kategori,
      jumlah: Number(ex.jumlah),
      keterangan: ex.keterangan,
      tanggal: formatWibDateTime(ex.tanggal),
      createdAt: formatWibDateTime(ex.createdAt),
    }));

    return {
      success: true,
      data: {
        periodLabel,
        totalGrossRevenue,
        totalCogs,
        totalGrossProfit,
        totalExpenses,
        totalNetProfit,
        totalTransactionsCount,
        totalUnitsSold,
        avgOrderValue,
        paymentBreakdown: {
          cashNominal,
          cashCount,
          qrisNominal,
          qrisCount,
        },
        bestSellers,
        categorySales,
        expensesList,
      },
    };
  } catch (error: any) {
    console.error("[Sales Report Error]:", error?.message || error);
    return { success: false, message: "Gagal memuat data laporan penjualan." };
  }
}

/**
 * Tambah Pengeluaran Operasional Toko
 */
export async function addExpenseAction(payload: {
  kategori: string;
  jumlah: number;
  keterangan?: string;
  tanggal?: string;
}): Promise<{ success: boolean; message?: string }> {
  try {
    const session = await auth();
    if (!session?.user?.kodeToko) {
      return { success: false, message: "Sesi tidak valid." };
    }

    if (!payload.kategori || payload.jumlah <= 0) {
      return { success: false, message: "Kategori dan jumlah pengeluaran wajib diisi." };
    }

    const tgl = payload.tanggal ? new Date(payload.tanggal) : new Date();

    await db.insert(expenses).values({
      kodeToko: session.user.kodeToko,
      kategori: payload.kategori.trim(),
      jumlah: payload.jumlah.toString(),
      keterangan: payload.keterangan || null,
      tanggal: tgl,
    });

    return { success: true, message: "Pengeluaran operasional berhasil dicatat." };
  } catch (error: any) {
    return { success: false, message: error?.message || "Gagal menyimpan pengeluaran." };
  }
}

/**
 * Hapus Pengeluaran Toko
 */
export async function deleteExpenseAction(
  expenseId: string
): Promise<{ success: boolean; message?: string }> {
  try {
    const session = await auth();
    if (!session?.user?.kodeToko) {
      return { success: false, message: "Sesi tidak valid." };
    }

    await db
      .delete(expenses)
      .where(
        and(
          eq(expenses.id, expenseId),
          eq(expenses.kodeToko, session.user.kodeToko)
        )
      );

    return { success: true, message: "Pengeluaran berhasil dihapus." };
  } catch (error: any) {
    return { success: false, message: error?.message || "Gagal menghapus pengeluaran." };
  }
}
