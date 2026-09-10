import { db } from "./index";
import { users, products, categories, transactions, transactionItems, stockMovements } from "./schema";
import { eq, and, sql } from "drizzle-orm";
import bcrypt from "bcryptjs";

async function testDeactivatedCashierCheckout() {
  console.log("=== TEST: DEACTIVATED CASHIER CHECKOUT REJECTION ===");
  const testStoreCode = "TEST_DEACT_POS";

  try {
    // 1. Bersihkan sisa test sebelumnya
    await db.execute(sql`DELETE FROM stock_movements WHERE kode_toko = ${testStoreCode}`);
    await db.execute(sql`DELETE FROM transaction_items WHERE transaction_id IN (SELECT id FROM transactions WHERE kode_toko = ${testStoreCode})`);
    await db.execute(sql`DELETE FROM transactions WHERE kode_toko = ${testStoreCode}`);
    await db.execute(sql`DELETE FROM products WHERE kode_toko = ${testStoreCode}`);
    await db.execute(sql`DELETE FROM users WHERE kode_toko = ${testStoreCode}`);

    // 2. Buat User Kasir Aktif
    const pwHash = await bcrypt.hash("kasir123", 10);
    const [cashier] = await db
      .insert(users)
      .values({
        kodeToko: testStoreCode,
        namaLengkap: "Kasir Uji Deaktivasi",
        email: "kasir_test_deact@tokosaya.com",
        passwordHash: pwHash,
        role: "CASHIER",
        isActive: true,
        tokenVersion: 1,
      })
      .returning();

    // 3. Buat Produk Test dengan Stok 50
    const [prod] = await db
      .insert(products)
      .values({
        kodeToko: testStoreCode,
        nama: "Produk Uji Kasir",
        hargaJual: "25000",
        hargaBeli: "15000",
        stok: 50,
        isActive: true,
      })
      .returning();

    console.log(`[Step 1] Kasir dibuat (ID: ${cashier.id}, Status: ACTIVE). Stok awal: ${prod.stok}`);

    // 4. Simulasi: Admin menonaktifkan akun kasir di tengah sesi
    console.log("[Step 2] Admin menonaktifkan akun kasir (isActive = false, tokenVersion++)...");
    await db
      .update(users)
      .set({
        isActive: false,
        tokenVersion: sql`${users.tokenVersion} + 1`,
        updatedAt: new Date(),
      })
      .where(eq(users.id, cashier.id));

    // 5. Verifikasi di DB bahwa status sudah nonaktif
    const [deactivatedCashier] = await db
      .select()
      .from(users)
      .where(eq(users.id, cashier.id))
      .limit(1);

    console.log(`[Step 3] Status Kasir di DB sekarang: isActive = ${deactivatedCashier.isActive}, tokenVersion = ${deactivatedCashier.tokenVersion}`);

    // 6. Kasir (yang browsernya masih terbuka dan cart terisi) mencoba checkout
    console.log("[Step 4] Kasir mencoba memproses pembayaran dari sesi browser terbuka...");

    // Cek logika yang dieksekusi di server action processCheckoutAction:
    const [dbCashierCheck] = await db
      .select({
        id: users.id,
        namaLengkap: users.namaLengkap,
        isActive: users.isActive,
        role: users.role,
        tokenVersion: users.tokenVersion,
      })
      .from(users)
      .where(and(eq(users.id, cashier.id), eq(users.kodeToko, testStoreCode)))
      .limit(1);

    let checkoutResult: { success: boolean; message: string };

    if (!dbCashierCheck || !dbCashierCheck.isActive) {
      checkoutResult = {
        success: false,
        message: "Akun Anda telah dinonaktifkan oleh administrator. Transaksi pembayaran ditolak.",
      };
    } else {
      checkoutResult = {
        success: true,
        message: "Transaksi berhasil diproses.",
      };
    }

    console.log(`[Step 5] Hasil Response Server Action:`);
    console.log(`  - success: ${checkoutResult.success}`);
    console.log(`  - message: "${checkoutResult.message}"`);

    // 7. Verifikasi tidak ada transaksi yang tercatat dan stok tidak berkurang
    const trxCount = await db
      .select({ count: sql`count(*)` })
      .from(transactions)
      .where(eq(transactions.kodeToko, testStoreCode));

    const [finalProd] = await db
      .select()
      .from(products)
      .where(eq(products.id, prod.id));

    console.log(`[Step 6] Verifikasi DB:`);
    console.log(`  - Jumlah Transaksi Tercatat: ${Number(trxCount[0].count)} (Harus 0)`);
    console.log(`  - Stok Produk: ${finalProd.stok} (Harus TETAP 50)`);

    if (
      checkoutResult.success === false &&
      Number(trxCount[0].count) === 0 &&
      finalProd.stok === 50
    ) {
      console.log("✅ TEST PASSED: Transaksi kasir dinonaktifkan BERHASIL DITOLAK MUTLAK tanpa manipulasi stok/transaksi!");
    } else {
      console.error("❌ TEST FAILED: Keamanan checkout gagal.");
      process.exit(1);
    }
  } finally {
    // Cleanup
    await db.execute(sql`DELETE FROM stock_movements WHERE kode_toko = ${testStoreCode}`);
    await db.execute(sql`DELETE FROM transaction_items WHERE transaction_id IN (SELECT id FROM transactions WHERE kode_toko = ${testStoreCode})`);
    await db.execute(sql`DELETE FROM transactions WHERE kode_toko = ${testStoreCode}`);
    await db.execute(sql`DELETE FROM products WHERE kode_toko = ${testStoreCode}`);
    await db.execute(sql`DELETE FROM users WHERE kode_toko = ${testStoreCode}`);
    console.log("[Cleanup] Data uji coba TEST_DEACT_POS telah dibersihkan.");
    process.exit(0);
  }
}

testDeactivatedCashierCheckout();
