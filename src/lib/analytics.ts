"use server";

/**
 * lib/analytics.ts
 * Fase 7: Seluruh kalkulasi analytics dilakukan di server berdasarkan data asli DB.
 * Tidak ada logika kalkulasi di client-side.
 */

import { db } from "@/db";
import { transactions, transactionItems, products, expenses } from "@/db/schema";
import { eq, and, gte, lte, desc, sum, count, avg } from "drizzle-orm";
import { sql } from "drizzle-orm";
import { getWib30DaysRange, getWib7DaysRange, getWibDayRange } from "@/lib/utils";

// ============================================================================
// TYPES
// ============================================================================
export interface HourlyDistribution {
  hour: number; // 0–23 (WIB)
  label: string; // "00:00", "01:00", ... "23:00"
  count: number;
  revenue: number;
}

export interface CategoryBreakdown {
  categoryId: string | null;
  categoryName: string;
  revenue: number;
  itemsSold: number;
  share: number; // 0–100 persen
}

export interface SwotItem {
  type: "strength" | "weakness" | "opportunity" | "threat";
  title: string;
  description: string;
  metric?: string; // nilai metrik yang memicu insight ini
}

export interface KpiStrategic {
  /** Average Order Value (Rp) */
  aov: number;
  /** Gross Margin % = (Revenue - COGS) / Revenue * 100 */
  grossMarginPct: number;
  /** Gross Profit absolute */
  grossProfit: number;
  /** Revenue 30 hari */
  revenue30d: number;
  /** Revenue 7 hari */
  revenue7d: number;
  /** Revenue hari ini */
  revenueToday: number;
  /** Total transaksi 30 hari */
  txCount30d: number;
  /** Transaksi/hari rata-rata 30 hari */
  txPerDay: number;
  /** Jam puncak (mode dari distribusi per jam) */
  peakHour: number;
  /** Revenue pct change 7d vs 7d sebelumnya */
  revenue7dPctChange: number | null;
  /** Stok total produk aktif */
  totalStokAktif: number;
  /** Produk dengan stok ≤ 5 */
  lowStokCount: number;
  /** Total pengeluaran 30 hari */
  totalExpenses30d: number;
  /** Net profit 30 hari (Revenue - COGS - Expenses) */
  netProfit30d: number;
}

export interface BusinessHealthScore {
  /** Skor 0–100 */
  score: number;
  /** Label: Kritis / Perlu Perhatian / Cukup / Baik / Luar Biasa */
  label: string;
  /** Warna representasi skor */
  color: string;
  /** Komponen skor */
  components: {
    revenueGrowth: number; // 0–25
    margin: number;        // 0–25
    txFrequency: number;   // 0–25
    stockHealth: number;   // 0–25
  };
}

export interface AnalyticsData {
  kpi: KpiStrategic;
  healthScore: BusinessHealthScore;
  swot: SwotItem[];
  hourlyDistribution: HourlyDistribution[];
  categoryBreakdown: CategoryBreakdown[];
  generatedAt: string; // ISO timestamp WIB
}

// ============================================================================
// MAIN ANALYTICS FUNCTION
// ============================================================================
export async function computeAnalytics(kodeToko: string): Promise<AnalyticsData> {
  const now = new Date();

  // Time ranges
  const todayRange = getWibDayRange(now);
  const range30d = getWib30DaysRange(now);

  // Previous 7-day period untuk perbandingan pertumbuhan
  const range7d = getWib7DaysRange(now);
  const prev7dStart = new Date(range7d.startUtc.getTime() - 7 * 24 * 3600 * 1000);
  const prev7dEnd = new Date(range7d.startUtc.getTime() - 1);

  // ── Paralel fetch semua data yang diperlukan ──────────────────────────────
  const [
    tx30d,
    tx7d,
    txToday,
    txPrev7d,
    txItems30d,
    allActiveProducts,
    expenses30d,
    txHourly,
  ] = await Promise.all([
    // Transaksi 30 hari
    db
      .select({
        id: transactions.id,
        total: transactions.total,
        createdAt: transactions.createdAt,
      })
      .from(transactions)
      .where(
        and(
          eq(transactions.kodeToko, kodeToko),
          eq(transactions.status, "COMPLETED"),
          gte(transactions.createdAt, range30d.startUtc),
          lte(transactions.createdAt, range30d.endUtc)
        )
      ),

    // Transaksi 7 hari
    db
      .select({ total: transactions.total })
      .from(transactions)
      .where(
        and(
          eq(transactions.kodeToko, kodeToko),
          eq(transactions.status, "COMPLETED"),
          gte(transactions.createdAt, range7d.startUtc),
          lte(transactions.createdAt, range7d.endUtc)
        )
      ),

    // Transaksi hari ini
    db
      .select({ total: transactions.total })
      .from(transactions)
      .where(
        and(
          eq(transactions.kodeToko, kodeToko),
          eq(transactions.status, "COMPLETED"),
          gte(transactions.createdAt, todayRange.startUtc),
          lte(transactions.createdAt, todayRange.endUtc)
        )
      ),

    // Transaksi 7 hari sebelumnya (untuk growth %)
    db
      .select({ total: transactions.total })
      .from(transactions)
      .where(
        and(
          eq(transactions.kodeToko, kodeToko),
          eq(transactions.status, "COMPLETED"),
          gte(transactions.createdAt, prev7dStart),
          lte(transactions.createdAt, prev7dEnd)
        )
      ),

    // Items transaksi 30 hari (untuk COGS & kategori breakdown)
    db
      .select({
        transactionId: transactionItems.transactionId,
        productId: transactionItems.productId,
        namaProduk: transactionItems.namaProduk,
        hargaJual: transactionItems.hargaJual,
        hargaBeli: transactionItems.hargaBeli,
        qty: transactionItems.qty,
        subtotal: transactionItems.subtotal,
        categoryId: products.categoryId,
      })
      .from(transactionItems)
      .leftJoin(products, eq(transactionItems.productId, products.id))
      .innerJoin(transactions, eq(transactionItems.transactionId, transactions.id))
      .where(
        and(
          eq(transactions.kodeToko, kodeToko),
          eq(transactions.status, "COMPLETED"),
          gte(transactions.createdAt, range30d.startUtc),
          lte(transactions.createdAt, range30d.endUtc)
        )
      ),

    // Produk aktif (untuk stok health)
    db
      .select({
        id: products.id,
        stok: products.stok,
        isActive: products.isActive,
      })
      .from(products)
      .where(
        and(
          eq(products.kodeToko, kodeToko),
          eq(products.isActive, true)
        )
      ),

    // Pengeluaran 30 hari
    db
      .select({ jumlah: expenses.jumlah })
      .from(expenses)
      .where(
        and(
          eq(expenses.kodeToko, kodeToko),
          gte(expenses.tanggal, range30d.startUtc),
          lte(expenses.tanggal, range30d.endUtc),
          // Hanya expenses yang belum di-soft-delete
          sql`${expenses.deletedAt} IS NULL`
        )
      ),

    // Distribusi per jam (30 hari) — group by jam WIB
    // Menggunakan AT TIME ZONE 'Asia/Jakarta' untuk konversi
    db.execute(sql`
      SELECT
        EXTRACT(HOUR FROM created_at AT TIME ZONE 'Asia/Jakarta') AS hour_wib,
        COUNT(*) AS tx_count,
        SUM(total) AS revenue
      FROM transactions
      WHERE kode_toko = ${kodeToko}
        AND status = 'COMPLETED'
        AND created_at >= ${range30d.startUtc.toISOString()}::timestamptz
        AND created_at <= ${range30d.endUtc.toISOString()}::timestamptz
      GROUP BY hour_wib
      ORDER BY hour_wib
    `),
  ]);

  // ── Kalkulasi KPI ─────────────────────────────────────────────────────────
  const revenue30d = tx30d.reduce((s, t) => s + parseFloat(String(t.total)), 0);
  const revenue7d = tx7d.reduce((s, t) => s + parseFloat(String(t.total)), 0);
  const revenueToday = txToday.reduce((s, t) => s + parseFloat(String(t.total)), 0);
  const revenuePrev7d = txPrev7d.reduce((s, t) => s + parseFloat(String(t.total)), 0);
  const txCount30d = tx30d.length;

  // Persentase pertumbuhan omset: null jika tidak ada data pembanding (mencegah divide-by-zero / angka semu)
  const revenue7dPctChange =
    revenuePrev7d > 0
      ? ((revenue7d - revenuePrev7d) / revenuePrev7d) * 100
      : null;

  const aov = txCount30d > 0 ? revenue30d / txCount30d : 0;
  const txPerDay = txCount30d / 30;

  // COGS dari transaction_items.hargaBeli (snapshot historis, bukan products.hargaBeli saat ini)
  let totalCogs = 0;
  for (const item of txItems30d) {
    totalCogs += parseFloat(String(item.hargaBeli)) * item.qty;
  }
  const grossProfit = revenue30d - totalCogs;
  const grossMarginPct = revenue30d > 0 ? (grossProfit / revenue30d) * 100 : 0;

  // Stok health
  const totalStokAktif = allActiveProducts.reduce((s, p) => s + (p.stok ?? 0), 0);
  const lowStokCount = allActiveProducts.filter((p) => (p.stok ?? 0) <= 5).length;

  // Pengeluaran
  const totalExpenses30d = expenses30d.reduce((s, e) => s + parseFloat(String(e.jumlah)), 0);
  const netProfit30d = grossProfit - totalExpenses30d;

  // Jam puncak (peak hour) dari distribusi
  const rawRows = txHourly as unknown as Record<string, unknown>[] | { rows?: Record<string, unknown>[] };
  const hourlyRows: Array<Record<string, unknown>> = Array.isArray(rawRows)
    ? rawRows
    : Array.isArray(rawRows?.rows)
    ? rawRows.rows
    : [];
  const hourlyMap = new Map<number, { count: number; revenue: number }>();
  for (const row of hourlyRows) {
    const h = parseInt(String(row.hour_wib ?? 0), 10);
    hourlyMap.set(h, {
      count: parseInt(String(row.tx_count ?? 0), 10),
      revenue: parseFloat(String(row.revenue ?? 0)),
    });
  }

  let peakHour = 12; // default
  let peakCount = 0;
  for (const [h, v] of hourlyMap) {
    if (v.count > peakCount) {
      peakCount = v.count;
      peakHour = h;
    }
  }

  // Hourly distribution array lengkap 0–23
  const hourlyDistribution: HourlyDistribution[] = Array.from({ length: 24 }, (_, i) => {
    const d = hourlyMap.get(i);
    return {
      hour: i,
      label: `${String(i).padStart(2, "0")}:00`,
      count: d?.count ?? 0,
      revenue: d?.revenue ?? 0,
    };
  });

  const kpi: KpiStrategic = {
    aov,
    grossMarginPct,
    grossProfit,
    revenue30d,
    revenue7d,
    revenueToday,
    txCount30d,
    txPerDay,
    peakHour,
    revenue7dPctChange,
    totalStokAktif,
    lowStokCount,
    totalExpenses30d,
    netProfit30d,
  };

  // ── Kategori Breakdown ────────────────────────────────────────────────────
  const catRevMap = new Map<string | null, { name: string; revenue: number; items: number }>();
  for (const item of txItems30d) {
    const catKey = item.categoryId ?? "__none__";
    const existing = catRevMap.get(catKey);
    const rev = parseFloat(String(item.subtotal));
    if (existing) {
      existing.revenue += rev;
      existing.items += item.qty;
    } else {
      catRevMap.set(catKey, { name: catKey === "__none__" ? "Lain-lain" : catKey, revenue: rev, items: item.qty });
    }
  }

  const catTotal = revenue30d || 1;
  const categoryBreakdown: CategoryBreakdown[] = Array.from(catRevMap.entries())
    .map(([catId, v]) => ({
      categoryId: catId === "__none__" ? null : catId,
      categoryName: v.name,
      revenue: v.revenue,
      itemsSold: v.items,
      share: Math.round((v.revenue / catTotal) * 1000) / 10,
    }))
    .sort((a, b) => b.revenue - a.revenue)
    .slice(0, 5);

  // ── Business Health Score ─────────────────────────────────────────────────
  // Komponen 1: Revenue Growth (0–25 pts) — berdasarkan pct change 7 hari
  let revGrowthScore = 12; // neutral baseline
  if (revenue7dPctChange !== null) {
    if (revenue7dPctChange >= 20) revGrowthScore = 25;
    else if (revenue7dPctChange >= 10) revGrowthScore = 20;
    else if (revenue7dPctChange >= 0) revGrowthScore = 15;
    else if (revenue7dPctChange >= -10) revGrowthScore = 8;
    else revGrowthScore = 3;
  } else if (revenue7d > 0) {
    revGrowthScore = 15; // ada revenue tapi tidak ada data sebelumnya
  }

  // Komponen 2: Gross Margin (0–25 pts)
  let marginScore: number;
  if (grossMarginPct >= 50) marginScore = 25;
  else if (grossMarginPct >= 35) marginScore = 20;
  else if (grossMarginPct >= 20) marginScore = 15;
  else if (grossMarginPct >= 10) marginScore = 8;
  else marginScore = 3;

  // Komponen 3: Transaction Frequency (0–25 pts) — transaksi/hari
  let txFreqScore: number;
  if (txPerDay >= 20) txFreqScore = 25;
  else if (txPerDay >= 10) txFreqScore = 20;
  else if (txPerDay >= 5) txFreqScore = 15;
  else if (txPerDay >= 2) txFreqScore = 8;
  else if (txPerDay >= 0.5) txFreqScore = 4;
  else txFreqScore = 1;

  // Komponen 4: Stock Health (0–25 pts) — persentase produk ≥ stok 5
  const totalProducts = allActiveProducts.length || 1;
  const lowStokPct = (lowStokCount / totalProducts) * 100;
  let stockScore: number;
  if (lowStokPct <= 5) stockScore = 25;
  else if (lowStokPct <= 15) stockScore = 20;
  else if (lowStokPct <= 25) stockScore = 14;
  else if (lowStokPct <= 40) stockScore = 8;
  else stockScore = 3;

  const totalScore = Math.round(revGrowthScore + marginScore + txFreqScore + stockScore);
  let scoreLabel: string;
  let scoreColor: string;
  if (totalScore >= 85) { scoreLabel = "Luar Biasa"; scoreColor = "#10B981"; }
  else if (totalScore >= 70) { scoreLabel = "Baik"; scoreColor = "#22C55E"; }
  else if (totalScore >= 55) { scoreLabel = "Cukup"; scoreColor = "#F59E0B"; }
  else if (totalScore >= 35) { scoreLabel = "Perlu Perhatian"; scoreColor = "#F97316"; }
  else { scoreLabel = "Kritis"; scoreColor = "#EF4444"; }

  const healthScore: BusinessHealthScore = {
    score: totalScore,
    label: scoreLabel,
    color: scoreColor,
    components: {
      revenueGrowth: revGrowthScore,
      margin: marginScore,
      txFrequency: txFreqScore,
      stockHealth: stockScore,
    },
  };

  // ── SWOT Otomatis (rules-based dari data aktual) ──────────────────────────
  const swot: SwotItem[] = [];

  // STRENGTHS
  if (grossMarginPct >= 35) {
    swot.push({
      type: "strength",
      title: "Margin keuntungan sehat",
      description: "Gross margin di atas 35% menunjukkan penetapan harga dan pengelolaan biaya yang baik.",
      metric: `${grossMarginPct.toFixed(1)}%`,
    });
  }
  if (txPerDay >= 10) {
    swot.push({
      type: "strength",
      title: "Volume transaksi tinggi",
      description: "Rata-rata lebih dari 10 transaksi per hari menandakan loyalitas pelanggan yang kuat.",
      metric: `${txPerDay.toFixed(1)}/hari`,
    });
  }
  if (aov >= 50000) {
    swot.push({
      type: "strength",
      title: "Nilai transaksi rata-rata tinggi",
      description: "Average Order Value yang tinggi menunjukkan pelanggan membeli dengan jumlah yang signifikan.",
      metric: `Rp ${Math.round(aov).toLocaleString("id-ID")}`,
    });
  }

  // WEAKNESSES
  if (lowStokPct > 25) {
    swot.push({
      type: "weakness",
      title: "Banyak produk dengan stok rendah",
      description: "Lebih dari 25% produk aktif memiliki stok ≤ 5 unit. Risiko kehilangan penjualan.",
      metric: `${lowStokCount} produk`,
    });
  }
  if (grossMarginPct < 20 && revenue30d > 0) {
    swot.push({
      type: "weakness",
      title: "Margin kotor rendah",
      description: "Gross margin di bawah 20% mengindikasikan HPP terlalu tinggi atau harga jual terlalu rendah.",
      metric: `${grossMarginPct.toFixed(1)}%`,
    });
  }
  if (txPerDay < 2 && txCount30d > 0) {
    swot.push({
      type: "weakness",
      title: "Frekuensi transaksi masih rendah",
      description: "Kurang dari 2 transaksi per hari. Pertimbangkan strategi promosi untuk meningkatkan traffic.",
      metric: `${txPerDay.toFixed(1)}/hari`,
    });
  }

  // OPPORTUNITIES
  if (peakHour >= 11 && peakHour <= 14) {
    swot.push({
      type: "opportunity",
      title: "Potensi paket makan siang",
      description: `Jam puncak transaksi terjadi sekitar pukul ${peakHour}:00. Buat bundel/promo jam makan siang untuk memaksimalkan revenue.`,
      metric: `Puncak jam ${peakHour}:00`,
    });
  } else if (peakHour >= 17 && peakHour <= 20) {
    swot.push({
      type: "opportunity",
      title: "Potensi paket sore/malam",
      description: `Jam puncak di sore/malam hari (${peakHour}:00). Pertimbangkan promosi happy hour untuk menarik lebih banyak pelanggan.`,
      metric: `Puncak jam ${peakHour}:00`,
    });
  }
  if (revenue7dPctChange !== null && revenue7dPctChange > 15) {
    swot.push({
      type: "opportunity",
      title: "Momentum pertumbuhan sedang kuat",
      description: "Revenue 7 hari terakhir naik signifikan. Momentum ini tepat untuk kampanye promosi baru.",
      metric: `+${revenue7dPctChange.toFixed(1)}%`,
    });
  }
  if (netProfit30d > 0 && netProfit30d / revenue30d > 0.2) {
    swot.push({
      type: "opportunity",
      title: "Net profit positif — peluang reinvestasi",
      description: "Net profit 30 hari positif dan sehat. Pertimbangkan reinvestasi ke stok atau marketing.",
      metric: `Rp ${Math.round(netProfit30d).toLocaleString("id-ID")}`,
    });
  }

  // THREATS
  if (revenue7dPctChange !== null && revenue7dPctChange < -15) {
    swot.push({
      type: "threat",
      title: "Penurunan revenue signifikan",
      description: "Revenue 7 hari terakhir turun lebih dari 15% dibanding periode sebelumnya. Perlu investigasi segera.",
      metric: `${revenue7dPctChange.toFixed(1)}%`,
    });
  }
  if (lowStokPct > 40) {
    swot.push({
      type: "threat",
      title: "Risiko kehabisan stok massal",
      description: "Lebih dari 40% produk hampir kehabisan stok. Segera lakukan pemesanan ulang untuk mencegah kehilangan penjualan.",
      metric: `${lowStokCount} produk`,
    });
  }
  if (totalExpenses30d > revenue30d * 0.3 && revenue30d > 0) {
    swot.push({
      type: "threat",
      title: "Pengeluaran operasional tinggi",
      description: "Total pengeluaran melebihi 30% dari revenue. Tinjau dan optimalkan biaya operasional.",
      metric: `${((totalExpenses30d / revenue30d) * 100).toFixed(1)}%`,
    });
  }

  // Pastikan minimal ada 1 item per kategori SWOT
  if (!swot.find((s) => s.type === "strength")) {
    swot.push({
      type: "strength",
      title: "Operasional berjalan",
      description: "Sistem POS aktif dan transaksi terekam dengan baik.",
    });
  }
  if (!swot.find((s) => s.type === "opportunity")) {
    swot.push({
      type: "opportunity",
      title: "Diversifikasi produk",
      description: "Tambahkan lebih banyak variasi produk untuk meningkatkan AOV dan menarik segmen pelanggan baru.",
    });
  }
  if (!swot.find((s) => s.type === "threat")) {
    swot.push({
      type: "threat",
      title: "Persaingan pasar",
      description: "Pantau pergerakan kompetitor dan pertahankan keunggulan harga/kualitas produk Anda.",
    });
  }
  if (!swot.find((s) => s.type === "weakness")) {
    swot.push({
      type: "weakness",
      title: "Data terbatas",
      description: "Belum ada data transaksi yang cukup untuk analisis mendalam. Terus operasikan toko untuk mendapatkan insight lebih akurat.",
    });
  }

  return {
    kpi,
    healthScore,
    swot,
    hourlyDistribution,
    categoryBreakdown,
    generatedAt: new Date().toLocaleString("id-ID", { timeZone: "Asia/Jakarta" }),
  };
}
