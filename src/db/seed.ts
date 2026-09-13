import { config } from "dotenv";
config({ path: ".env.local" });

import { db } from "./index";
import {
  users,
  categories,
  products,
  storeSettings,
  transactions,
  transactionItems,
  stockMovements,
  expenses,
} from "./schema";
import bcrypt from "bcryptjs";
import { eq, sql } from "drizzle-orm";

// ============================================================================
// KONFIGURASI DEMO
// ============================================================================
const KODE_TOKO = "DEMO01";
const NAMA_TOKO = "Kedai Kopi Senja";

// Zona waktu WIB = UTC+7
const WIB_OFFSET_MS = 7 * 60 * 60 * 1000;

/** Menghasilkan timestamp UTC dari tanggal WIB + jam + menit */
function wibToUtc(
  year: number,
  month: number, // 1-based
  day: number,
  hour: number,
  minute: number,
  second: number = 0
): Date {
  const wibMs = Date.UTC(year, month - 1, day, hour, minute, second, 0);
  return new Date(wibMs - WIB_OFFSET_MS);
}

/** Mendapatkan tanggal WIB dari Date UTC */
function getWibDate(utcDate: Date): { year: number; month: number; day: number } {
  const wibMs = utcDate.getTime() + WIB_OFFSET_MS;
  const d = new Date(wibMs);
  return {
    year: d.getUTCFullYear(),
    month: d.getUTCMonth() + 1,
    day: d.getUTCDate(),
  };
}

/** Pilih item acak dari array */
function pick<T>(arr: T[]): T {
  return arr[Math.floor(Math.random() * arr.length)];
}

/** Angka integer random [min, max] inklusif */
function randInt(min: number, max: number): number {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

// ============================================================================
// MAIN SEED FUNCTION
// ============================================================================
export async function seed() {
  console.log("=".repeat(70));
  console.log("🌱 SEED DEMO DATA — Kedai Kopi Senja (DEMO01)");
  console.log("=".repeat(70));
  console.log();

  // ==========================================================================
  // STEP 0: IDEMPOTENCY — Hapus data lama jika DEMO01 sudah ada
  // ==========================================================================
  console.log("🔍 Checking existing DEMO01 data...");

  const existingStore = await db.query.storeSettings.findFirst({
    where: eq(storeSettings.kodeToko, KODE_TOKO),
  });

  if (existingStore) {
    console.log("⚠️  DEMO01 sudah ada — menghapus data lama sebelum regenerate...");

    await db.delete(expenses).where(eq(expenses.kodeToko, KODE_TOKO));
    console.log("   ✓ Expenses dihapus");

    await db.delete(stockMovements).where(eq(stockMovements.kodeToko, KODE_TOKO));
    console.log("   ✓ Stock movements dihapus");

    const existingTrxIds = await db
      .select({ id: transactions.id })
      .from(transactions)
      .where(eq(transactions.kodeToko, KODE_TOKO));

    if (existingTrxIds.length > 0) {
      await db.delete(transactions).where(eq(transactions.kodeToko, KODE_TOKO));
      console.log(`   ✓ ${existingTrxIds.length} transaksi + items dihapus`);
    }

    await db.delete(products).where(eq(products.kodeToko, KODE_TOKO));
    console.log("   ✓ Products dihapus");

    await db.delete(categories).where(eq(categories.kodeToko, KODE_TOKO));
    console.log("   ✓ Categories dihapus");

    await db.delete(users).where(eq(users.kodeToko, KODE_TOKO));
    console.log("   ✓ Users dihapus");

    await db
      .update(storeSettings)
      .set({ namaToko: NAMA_TOKO, updatedAt: new Date() })
      .where(eq(storeSettings.kodeToko, KODE_TOKO));
    console.log("   ✓ Store settings diperbarui");
  } else {
    console.log("   ℹ️  DEMO01 belum ada — membuat data baru dari awal");

    await db.insert(storeSettings).values({
      kodeToko: KODE_TOKO,
      namaToko: NAMA_TOKO,
      alamat: "Jl. Pahlawan No. 88, Kelurahan Senja, Bandung 40123",
      telepon: "0812-9900-5566",
      printerWidth: "58mm",
      themeColor: "primary",
    });
    console.log("✅ Store settings dibuat");
  }

  // ==========================================================================
  // STEP 2: USERS
  // ==========================================================================
  console.log("\n👤 Membuat akun demo...");
  const adminPasswordHash = await bcrypt.hash("Demo1234", 10);
  const kasirPasswordHash = await bcrypt.hash("Demo1234", 10);

  const insertedUsers = await db
    .insert(users)
    .values([
      {
        kodeToko: KODE_TOKO,
        namaLengkap: "Budi Santoso",
        email: "demo.admin@posdemo.app",
        passwordHash: adminPasswordHash,
        role: "ADMIN" as const,
        isActive: true,
        tokenVersion: 1,
      },
      {
        kodeToko: KODE_TOKO,
        namaLengkap: "Sari Dewi",
        email: "demo.kasir@posdemo.app",
        passwordHash: kasirPasswordHash,
        role: "CASHIER" as const,
        isActive: true,
        tokenVersion: 1,
      },
    ])
    .returning();

  const adminUser = insertedUsers[0];
  const kasirUser = insertedUsers[1];
  console.log(`   ✓ Admin: demo.admin@posdemo.app`);
  console.log(`   ✓ Kasir: demo.kasir@posdemo.app`);

  // ==========================================================================
  // STEP 3: CATEGORIES
  // ==========================================================================
  console.log("\n📂 Membuat kategori...");
  const insertedCategories = await db
    .insert(categories)
    .values([
      { kodeToko: KODE_TOKO, nama: "Makanan Berat", deskripsi: "Nasi, mie, dan makanan utama", urutan: 1 },
      { kodeToko: KODE_TOKO, nama: "Minuman Kopi", deskripsi: "Espresso, kopi susu, dan varian kopi", urutan: 2 },
      { kodeToko: KODE_TOKO, nama: "Minuman Non-Kopi", deskripsi: "Teh, jus, minuman segar lainnya", urutan: 3 },
      { kodeToko: KODE_TOKO, nama: "Snack & Dessert", deskripsi: "Camilan, kue, dan makanan penutup", urutan: 4 },
      { kodeToko: KODE_TOKO, nama: "Paket Hemat", deskripsi: "Bundel makanan + minuman", urutan: 5 },
    ])
    .returning();

  const [catMakanan, catKopi, catNonKopi, catSnack, catPaket] = insertedCategories;
  console.log(`   ✓ ${insertedCategories.length} kategori dibuat`);

  // ==========================================================================
  // STEP 4: PRODUCTS (18 produk)
  // ==========================================================================
  console.log("\n🛍️  Membuat produk...");
  const insertedProducts = await db
    .insert(products)
    .values([
      // --- Makanan Berat (5 produk) ---
      {
        kodeToko: KODE_TOKO, categoryId: catMakanan.id,
        nama: "Nasi Goreng Kampung", barcode: "DEMO-001", sku: "MKN-001",
        hargaBeli: "18000", hargaJual: "28000", stok: 200, stokMinimum: 10,
        gambar: "https://images.unsplash.com/photo-1512058564366-18510be2db19?auto=format&fit=crop&w=600&q=80",
        isActive: true,
      },
      {
        kodeToko: KODE_TOKO, categoryId: catMakanan.id,
        nama: "Mie Goreng Jawa", barcode: "DEMO-002", sku: "MKN-002",
        hargaBeli: "14000", hargaJual: "24000", stok: 200, stokMinimum: 10,
        gambar: "https://images.unsplash.com/photo-1563379926898-05f4575a45d8?auto=format&fit=crop&w=600&q=80",
        isActive: true,
      },
      {
        kodeToko: KODE_TOKO, categoryId: catMakanan.id,
        nama: "Ayam Geprek Sambal Matah", barcode: "DEMO-003", sku: "MKN-003",
        hargaBeli: "22000", hargaJual: "35000", stok: 200, stokMinimum: 8,
        gambar: "https://images.unsplash.com/photo-1604908176997-125f25cc6f3d?auto=format&fit=crop&w=600&q=80",
        isActive: true,
      },
      {
        kodeToko: KODE_TOKO, categoryId: catMakanan.id,
        nama: "Nasi Uduk Komplit", barcode: "DEMO-004", sku: "MKN-004",
        hargaBeli: "16000", hargaJual: "27000", stok: 200, stokMinimum: 8,
        gambar: "https://images.unsplash.com/photo-1516714435131-44d6b64dc6a2?auto=format&fit=crop&w=600&q=80",
        isActive: true,
      },
      {
        kodeToko: KODE_TOKO, categoryId: catMakanan.id,
        nama: "Sandwich Telur & Keju", barcode: "DEMO-005", sku: "MKN-005",
        hargaBeli: "12000", hargaJual: "20000", stok: 200, stokMinimum: 10,
        gambar: "https://images.unsplash.com/photo-1528736235302-52922df5c122?auto=format&fit=crop&w=600&q=80",
        isActive: true,
      },
      // --- Minuman Kopi (4 produk) ---
      {
        kodeToko: KODE_TOKO, categoryId: catKopi.id,
        nama: "Kopi Susu Gula Aren", barcode: "DEMO-006", sku: "KPI-001",
        hargaBeli: "8000", hargaJual: "22000", stok: 500, stokMinimum: 20,
        gambar: "https://images.unsplash.com/photo-1541167760496-1628856ab772?auto=format&fit=crop&w=600&q=80",
        isActive: true,
      },
      {
        kodeToko: KODE_TOKO, categoryId: catKopi.id,
        nama: "Americano", barcode: "DEMO-007", sku: "KPI-002",
        hargaBeli: "6000", hargaJual: "18000", stok: 500, stokMinimum: 15,
        gambar: "https://images.unsplash.com/photo-1509042239860-f550ce710b93?auto=format&fit=crop&w=600&q=80",
        isActive: true,
      },
      {
        kodeToko: KODE_TOKO, categoryId: catKopi.id,
        nama: "Cappuccino", barcode: "DEMO-008", sku: "KPI-003",
        hargaBeli: "9000", hargaJual: "25000", stok: 500, stokMinimum: 15,
        gambar: "https://images.unsplash.com/photo-1517256064527-09c73fc73e38?auto=format&fit=crop&w=600&q=80",
        isActive: true,
      },
      {
        kodeToko: KODE_TOKO, categoryId: catKopi.id,
        nama: "Cold Brew Vanilla", barcode: "DEMO-009", sku: "KPI-004",
        hargaBeli: "11000", hargaJual: "28000", stok: 500, stokMinimum: 10,
        gambar: "https://images.unsplash.com/photo-1461023058943-07fcbe16d735?auto=format&fit=crop&w=600&q=80",
        isActive: true,
      },
      // --- Minuman Non-Kopi (4 produk) ---
      {
        kodeToko: KODE_TOKO, categoryId: catNonKopi.id,
        nama: "Matcha Latte", barcode: "DEMO-010", sku: "NKP-001",
        hargaBeli: "10000", hargaJual: "26000", stok: 500, stokMinimum: 15,
        gambar: "https://images.unsplash.com/photo-1536256263959-770b48d82b0a?auto=format&fit=crop&w=600&q=80",
        isActive: true,
      },
      {
        kodeToko: KODE_TOKO, categoryId: catNonKopi.id,
        nama: "Es Teh Manis Spesial", barcode: "DEMO-011", sku: "NKP-002",
        hargaBeli: "2500", hargaJual: "8000", stok: 500, stokMinimum: 25,
        gambar: "https://images.unsplash.com/photo-1499638673689-79a0b5115d87?auto=format&fit=crop&w=600&q=80",
        isActive: true,
      },
      {
        kodeToko: KODE_TOKO, categoryId: catNonKopi.id,
        nama: "Jus Alpukat Kental", barcode: "DEMO-012", sku: "NKP-003",
        hargaBeli: "9000", hargaJual: "20000", stok: 300, stokMinimum: 10,
        gambar: "https://images.unsplash.com/photo-1470158499416-75be9aa0c4db?auto=format&fit=crop&w=600&q=80",
        isActive: true,
      },
      {
        kodeToko: KODE_TOKO, categoryId: catNonKopi.id,
        nama: "Lemon Squash Soda", barcode: "DEMO-013", sku: "NKP-004",
        hargaBeli: "7000", hargaJual: "18000", stok: 300, stokMinimum: 10,
        gambar: "https://images.unsplash.com/photo-1513558161293-cdaf765ed2fd?auto=format&fit=crop&w=600&q=80",
        isActive: true,
      },
      // --- Snack & Dessert (3 produk) ---
      {
        kodeToko: KODE_TOKO, categoryId: catSnack.id,
        nama: "Croissant Butter", barcode: "DEMO-014", sku: "SNK-001",
        hargaBeli: "8000", hargaJual: "18000", stok: 200, stokMinimum: 8,
        gambar: "https://images.unsplash.com/photo-1555507036-ab1f4038808a?auto=format&fit=crop&w=600&q=80",
        isActive: true,
      },
      {
        kodeToko: KODE_TOKO, categoryId: catSnack.id,
        nama: "Brownies Kukus Coklat", barcode: "DEMO-015", sku: "SNK-002",
        hargaBeli: "6000", hargaJual: "15000", stok: 200, stokMinimum: 8,
        gambar: "https://images.unsplash.com/photo-1606312619070-d48b4c652a52?auto=format&fit=crop&w=600&q=80",
        isActive: true,
      },
      {
        kodeToko: KODE_TOKO, categoryId: catSnack.id,
        nama: "Pisang Goreng Crispy", barcode: "DEMO-016", sku: "SNK-003",
        hargaBeli: "5000", hargaJual: "12000", stok: 200, stokMinimum: 10,
        gambar: "https://images.unsplash.com/photo-1571771894821-ce9b6c11b08e?auto=format&fit=crop&w=600&q=80",
        isActive: true,
      },
      // --- Paket Hemat (2 produk) ---
      {
        kodeToko: KODE_TOKO, categoryId: catPaket.id,
        nama: "Paket Sarapan Pagi (Nasi + Kopi)", barcode: "DEMO-017", sku: "PKT-001",
        hargaBeli: "23000", hargaJual: "38000", stok: 200, stokMinimum: 5,
        gambar: "https://images.unsplash.com/photo-1484723091739-30a097e8f929?auto=format&fit=crop&w=600&q=80",
        isActive: true,
      },
      {
        kodeToko: KODE_TOKO, categoryId: catPaket.id,
        nama: "Paket Sore Santai (Snack + Minuman)", barcode: "DEMO-018", sku: "PKT-002",
        hargaBeli: "14000", hargaJual: "28000", stok: 200, stokMinimum: 5,
        gambar: "https://images.unsplash.com/photo-1495214783159-3503fd1b572d?auto=format&fit=crop&w=600&q=80",
        isActive: true,
      },
    ])
    .returning();

  console.log(`   ✓ ${insertedProducts.length} produk dibuat`);

  // Buat lookup map produk untuk tracking stok
  type ProductEntry = {
    id: string;
    hargaBeli: number;
    hargaJual: number;
    nama: string;
    currentStok: number;
  };
  const productMap = new Map<string, ProductEntry>();
  for (const p of insertedProducts) {
    productMap.set(p.id, {
      id: p.id,
      hargaBeli: parseFloat(p.hargaBeli),
      hargaJual: parseFloat(p.hargaJual),
      nama: p.nama,
      currentStok: p.stok,
    });
  }

  // ==========================================================================
  // STEP 5: GENERATE TRANSAKSI 30 HARI
  // ==========================================================================
  console.log("\n💳 Generating transaksi 30 hari...");

  // Tanggal hari ini dalam WIB
  const nowUtc = new Date();
  const nowWibMs = nowUtc.getTime() + WIB_OFFSET_MS;
  const nowWib = new Date(nowWibMs);
  const todayYear = nowWib.getUTCFullYear();
  const todayMonth = nowWib.getUTCMonth() + 1;
  const todayDay = nowWib.getUTCDate();

  // Jadwal jam transaksi per slot waktu (WIB) dengan bobot
  const timeSlots = [
    // Pagi: 07:00-10:30
    { hour: 7, minuteRange: [0, 59] as [number, number], weight: 3 },
    { hour: 8, minuteRange: [0, 59] as [number, number], weight: 5 },
    { hour: 9, minuteRange: [0, 59] as [number, number], weight: 5 },
    { hour: 10, minuteRange: [0, 30] as [number, number], weight: 3 },
    // Siang: 11:30-14:00
    { hour: 11, minuteRange: [30, 59] as [number, number], weight: 4 },
    { hour: 12, minuteRange: [0, 59] as [number, number], weight: 8 },
    { hour: 13, minuteRange: [0, 59] as [number, number], weight: 6 },
    { hour: 14, minuteRange: [0, 0] as [number, number], weight: 2 },
    // Sore: 15:00-18:00
    { hour: 15, minuteRange: [0, 59] as [number, number], weight: 4 },
    { hour: 16, minuteRange: [0, 59] as [number, number], weight: 5 },
    { hour: 17, minuteRange: [0, 59] as [number, number], weight: 4 },
    // Malam: 19:00-21:00
    { hour: 19, minuteRange: [0, 59] as [number, number], weight: 3 },
    { hour: 20, minuteRange: [0, 59] as [number, number], weight: 3 },
    { hour: 21, minuteRange: [0, 0] as [number, number], weight: 1 },
  ];

  const totalSlotWeight = timeSlots.reduce((s, t) => s + t.weight, 0);

  function pickTimeSlot() {
    let r = Math.random() * totalSlotWeight;
    for (const slot of timeSlots) {
      r -= slot.weight;
      if (r <= 0) return slot;
    }
    return timeSlots[0];
  }

  // ~60% Tunai, ~40% QRIS
  const metodePembayaranOptions = ["Tunai", "Tunai", "Tunai", "QRIS", "QRIS"];
  const productList = insertedProducts.filter((p) => p.isActive);

  let totalTrxGenerated = 0;
  let totalOmset = 0;
  let minDate: Date | null = null;
  let maxDate: Date | null = null;

  const trxCounterPerDay = new Map<string, number>();

  function getNextTrxNo(dateStr: string): string {
    const curr = trxCounterPerDay.get(dateStr) ?? 0;
    const next = curr + 1;
    trxCounterPerDay.set(dateStr, next);
    return `TRX-${dateStr.replace(/-/g, "")}-${next.toString().padStart(4, "0")}`;
  }

  // Generate hari-hari mundur 30 hari (termasuk hari ini)
  for (let daysAgo = 29; daysAgo >= 0; daysAgo--) {
    const targetWibMs =
      Date.UTC(todayYear, todayMonth - 1, todayDay, 0, 0, 0, 0) -
      daysAgo * 24 * 60 * 60 * 1000;
    const targetWibDate = new Date(targetWibMs);
    const yr = targetWibDate.getUTCFullYear();
    const mo = targetWibDate.getUTCMonth() + 1;
    const dy = targetWibDate.getUTCDate();
    const dateStr = `${yr}-${mo.toString().padStart(2, "0")}-${dy.toString().padStart(2, "0")}`;

    const dayOfWeek = targetWibDate.getUTCDay(); // 0=Min, 6=Sab
    const isWeekend = dayOfWeek === 0 || dayOfWeek === 6;
    const numTrx = isWeekend ? randInt(30, 42) : randInt(18, 28);

    process.stdout.write(
      `\r   → ${30 - daysAgo}/30: ${dateStr} ${isWeekend ? "(Weekend)" : "(Weekday)"} — +${numTrx} trx   `
    );

    for (let t = 0; t < numTrx; t++) {
      const slot = pickTimeSlot();
      const minute = randInt(slot.minuteRange[0], slot.minuteRange[1]);
      const second = randInt(0, 59);
      const trxUtc = wibToUtc(yr, mo, dy, slot.hour, minute, second);

      // Hari ini: pastikan jam tidak melebihi jam sekarang
      if (daysAgo === 0 && trxUtc > nowUtc) continue;

      const metode = pick(metodePembayaranOptions);
      const noTransaksi = getNextTrxNo(dateStr);

      // Pilih 1-5 produk acak tanpa duplikat
      const shuffled = [...productList].sort(() => Math.random() - 0.5);
      const numItems = randInt(1, Math.min(5, shuffled.length));
      const selectedProducts = shuffled.slice(0, numItems);

      let totalTrx = 0;
      const itemsData: Array<{
        productId: string;
        namaProduk: string;
        hargaBeli: string;
        hargaJual: string;
        qty: number;
        subtotal: string;
      }> = [];

      for (const prod of selectedProducts) {
        const qty = randInt(1, 3);
        const hargaJual = parseFloat(prod.hargaJual);
        const hargaBeli = parseFloat(prod.hargaBeli);
        const subtotal = qty * hargaJual;
        totalTrx += subtotal;

        itemsData.push({
          productId: prod.id,
          namaProduk: prod.nama,
          hargaBeli: hargaBeli.toString(),
          hargaJual: hargaJual.toString(),
          qty,
          subtotal: subtotal.toString(),
        });
      }

      const bayar =
        metode === "Tunai"
          ? Math.ceil(totalTrx / 5000) * 5000
          : totalTrx;
      const kembalian = bayar - totalTrx;

      const idempotencyKey = `seed-${KODE_TOKO}-${noTransaksi}`;
      const [insertedTrx] = await db
        .insert(transactions)
        .values({
          kodeToko: KODE_TOKO,
          noTransaksi,
          userId: kasirUser.id,
          total: totalTrx.toString(),
          bayar: bayar.toString(),
          kembalian: kembalian.toString(),
          metodePembayaran: metode,
          status: "COMPLETED" as const,
          idempotencyKey,
          catatan: null,
          createdAt: trxUtc,
        })
        .returning();

      // Insert transaction items
      await db.insert(transactionItems).values(
        itemsData.map((item) => ({
          transactionId: insertedTrx.id,
          productId: item.productId,
          namaProduk: item.namaProduk,
          hargaBeli: item.hargaBeli,
          hargaJual: item.hargaJual,
          qty: item.qty,
          subtotal: item.subtotal,
        }))
      );

      // Insert stock movements (SALE)
      for (const item of itemsData) {
        const prodEntry = productMap.get(item.productId)!;
        const stokSebelum = prodEntry.currentStok;
        const stokSesudah = Math.max(0, stokSebelum - item.qty);
        prodEntry.currentStok = stokSesudah;

        await db.insert(stockMovements).values({
          kodeToko: KODE_TOKO,
          productId: item.productId,
          tipe: "SALE" as const,
          qty: -item.qty,
          stokSebelum,
          stokSesudah,
          referensiId: insertedTrx.id,
          keterangan: `Penjualan: ${noTransaksi}`,
          createdAt: trxUtc,
        });
      }

      totalTrxGenerated++;
      totalOmset += totalTrx;
      if (!minDate || trxUtc < minDate) minDate = trxUtc;
      if (!maxDate || trxUtc > maxDate) maxDate = trxUtc;
    }
  }

  // Update stok produk berdasarkan saldo akhir
  console.log("\n\n🔄 Updating stok produk...");
  for (const [productId, entry] of productMap) {
    await db
      .update(products)
      .set({ stok: entry.currentStok, updatedAt: new Date() })
      .where(eq(products.id, productId));
  }
  console.log("   ✓ Stok semua produk diperbarui");

  // ==========================================================================
  // STEP 6: EXPENSES (pengeluaran operasional 30 hari)
  // ==========================================================================
  console.log("\n💸 Membuat data expenses...");

  const expenseSchedule = [
    { kategori: "Bahan Baku", range: [800000, 1500000] as [number, number], days: [1, 4] }, // Senin & Kamis
    { kategori: "Listrik", range: [400000, 600000] as [number, number], dayOfMonth: 1 },
    { kategori: "Gaji Staf", range: [2500000, 3000000] as [number, number], dayOfMonth: 1 },
    { kategori: "Sewa Tempat", range: [1800000, 2000000] as [number, number], dayOfMonth: 5 },
    { kategori: "Perlengkapan Kebersihan", range: [150000, 250000] as [number, number], days: [1] }, // Senin
    { kategori: "Gas & Bahan Bakar", range: [200000, 350000] as [number, number], days: [3] }, // Rabu
    { kategori: "Transportasi", range: [50000, 120000] as [number, number], days: [5] }, // Jumat
    { kategori: "Alat Tulis Kantor", range: [80000, 150000] as [number, number], dayOfMonth: 15 },
  ];

  type ExpenseInsert = {
    kodeToko: string;
    kategori: string;
    jumlah: string;
    keterangan: string;
    tanggal: Date;
    createdAt: Date;
  };

  const expensesToInsert: ExpenseInsert[] = [];

  for (let daysAgo = 29; daysAgo >= 0; daysAgo--) {
    const targetWibMs =
      Date.UTC(todayYear, todayMonth - 1, todayDay, 0, 0, 0, 0) -
      daysAgo * 24 * 60 * 60 * 1000;
    const targetWibDate = new Date(targetWibMs);
    const yr = targetWibDate.getUTCFullYear();
    const mo = targetWibDate.getUTCMonth() + 1;
    const dy = targetWibDate.getUTCDate();
    const dayOfWeek = targetWibDate.getUTCDay();

    for (const expDef of expenseSchedule) {
      let shouldAdd = false;

      if ("dayOfMonth" in expDef && expDef.dayOfMonth !== undefined) {
        if (dy === expDef.dayOfMonth) shouldAdd = true;
      } else if ("days" in expDef && expDef.days) {
        if (expDef.days.includes(dayOfWeek)) shouldAdd = true;
      }

      if (shouldAdd) {
        const jumlah = randInt(expDef.range[0], expDef.range[1]);
        const tanggalUtc = wibToUtc(yr, mo, dy, 9, randInt(0, 30));
        expensesToInsert.push({
          kodeToko: KODE_TOKO,
          kategori: expDef.kategori,
          jumlah: jumlah.toString(),
          keterangan: `${expDef.kategori} — ${yr}/${mo.toString().padStart(2, "0")}/${dy.toString().padStart(2, "0")}`,
          tanggal: tanggalUtc,
          createdAt: tanggalUtc,
        });
      }
    }
  }

  if (expensesToInsert.length > 0) {
    await db.insert(expenses).values(expensesToInsert);
  }
  console.log(`   ✓ ${expensesToInsert.length} expenses dibuat`);

  // ==========================================================================
  // STEP 7: VERIFIKASI OTOMATIS
  // ==========================================================================
  console.log("\n" + "=".repeat(70));
  console.log("📊 RINGKASAN HASIL SEED");
  console.log("=".repeat(70));
  console.log();

  const [trxCountResult] = await db
    .select({ count: sql<number>`COUNT(*)::int` })
    .from(transactions)
    .where(eq(transactions.kodeToko, KODE_TOKO));

  const [expCountResult] = await db
    .select({ count: sql<number>`COUNT(*)::int` })
    .from(expenses)
    .where(eq(expenses.kodeToko, KODE_TOKO));

  const [prodCountResult] = await db
    .select({ count: sql<number>`COUNT(*)::int` })
    .from(products)
    .where(eq(products.kodeToko, KODE_TOKO));

  const [omsetResult] = await db
    .select({ total: sql<string>`COALESCE(SUM(total::numeric), 0)::text` })
    .from(transactions)
    .where(eq(transactions.kodeToko, KODE_TOKO));

  const [expTotalResult] = await db
    .select({ total: sql<string>`COALESCE(SUM(jumlah::numeric), 0)::text` })
    .from(expenses)
    .where(eq(expenses.kodeToko, KODE_TOKO));

  const formatRupiah = (num: number) =>
    "Rp " + num.toLocaleString("id-ID");

  const minDateWib = minDate ? getWibDate(minDate) : null;
  const maxDateWib = maxDate ? getWibDate(maxDate) : null;
  const omsetNum = parseFloat(omsetResult?.total ?? "0");
  const expTotal = parseFloat(expTotalResult?.total ?? "0");

  console.log(`🏪 Toko          : ${NAMA_TOKO} (${KODE_TOKO})`);
  console.log(`👤 Admin         : demo.admin@posdemo.app / Demo1234`);
  console.log(`👤 Kasir         : demo.kasir@posdemo.app / Demo1234`);
  console.log(`🔑 Kode Toko     : ${KODE_TOKO}`);
  console.log();
  console.log(`📦 Produk        : ${prodCountResult.count} produk aktif`);
  console.log(`💳 Transaksi     : ${trxCountResult.count} transaksi (DB count)`);
  if (minDateWib && maxDateWib) {
    const pad = (n: number) => n.toString().padStart(2, "0");
    console.log(
      `📅 Rentang       : ${minDateWib.year}-${pad(minDateWib.month)}-${pad(minDateWib.day)} s/d ${maxDateWib.year}-${pad(maxDateWib.month)}-${pad(maxDateWib.day)}`
    );
  }
  console.log(`💰 Total Omset   : ${formatRupiah(omsetNum)}`);
  console.log(`💸 Total Expenses: ${formatRupiah(expTotal)}`);
  console.log(`📈 Est. Net Profit: ${formatRupiah(omsetNum - expTotal)}`);
  console.log(`🧾 Expense Records: ${expCountResult.count} entries`);
  console.log();
  console.log("✅ Seed selesai! Dashboard & Analytics seharusnya tidak kosong.");
  console.log("=".repeat(70));
}

// Jalankan jika dipanggil langsung
if (require.main === module || process.argv[1]?.includes("seed")) {
  seed()
    .then(() => process.exit(0))
    .catch((err) => {
      console.error("❌ Seed error:", err);
      process.exit(1);
    });
}


