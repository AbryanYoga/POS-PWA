import { db } from "./index";
import { sql } from "drizzle-orm";

async function migrateAndClean() {
  console.log("Adding idempotency_key to transactions and creating unique index...");
  
  await db.execute(sql`
    ALTER TABLE transactions 
    ADD COLUMN IF NOT EXISTS idempotency_key VARCHAR(100);
  `);

  await db.execute(sql`
    CREATE UNIQUE INDEX IF NOT EXISTS uq_transactions_idempotency 
    ON transactions (kode_toko, idempotency_key)
    WHERE idempotency_key IS NOT NULL;
  `);

  await db.execute(sql`
    ALTER TABLE expenses 
    ADD COLUMN IF NOT EXISTS deleted_at TIMESTAMP WITH TIME ZONE;
  `);

  console.log("Expenses soft-delete column added successfully.");

  // Clean test transactions from DEMO01 and restore stock
  console.log("Cleaning test transaction TRX-20260910-0001 from DEMO01...");
  
  // Find transactions with test catatan or noTransaksi TRX-20260910-0001
  const testTrxs: any = await db.execute(sql`
    SELECT id, no_transaksi FROM transactions 
    WHERE kode_toko = 'DEMO01' 
      AND (no_transaksi = 'TRX-20260910-0001' OR catatan LIKE '%Automated E2E Test%');
  `);

  for (const trx of testTrxs) {
    console.log(`Deleting test transaction: ${trx.no_transaksi} (ID: ${trx.id})`);
    await db.execute(sql`DELETE FROM stock_movements WHERE referensi_id = ${trx.id}`);
    await db.execute(sql`DELETE FROM transaction_items WHERE transaction_id = ${trx.id}`);
    await db.execute(sql`DELETE FROM transactions WHERE id = ${trx.id}`);
  }

  // Restore stock of Nasi Goreng Spesial back to 45
  await db.execute(sql`
    UPDATE products 
    SET stok = 45 
    WHERE kode_toko = 'DEMO01' AND nama = 'Nasi Goreng Spesial';
  `);

  console.log("DEMO01 test data cleaned and product stock restored to 45.");
  process.exit(0);
}

migrateAndClean().catch((err) => {
  console.error("Migration error:", err);
  process.exit(1);
});
