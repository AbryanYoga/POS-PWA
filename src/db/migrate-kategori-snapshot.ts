import { db } from "./index";
import { sql } from "drizzle-orm";

async function migrateKategoriSnapshot() {
  console.log("Starting migration: Add kategori_nama to transaction_items and backfill...");

  // 1. Add column if not exists
  await db.execute(sql`
    ALTER TABLE transaction_items 
    ADD COLUMN IF NOT EXISTS kategori_nama VARCHAR(100);
  `);
  console.log("Column kategori_nama checked/added.");

  // 2. Add index on kategori_nama
  await db.execute(sql`
    CREATE INDEX IF NOT EXISTS idx_trx_items_kategori 
    ON transaction_items (kategori_nama);
  `);
  console.log("Index idx_trx_items_kategori created.");

  // 3. Backfill from products -> categories
  const res: any = await db.execute(sql`
    UPDATE transaction_items ti
    SET kategori_nama = c.nama
    FROM products p
    JOIN categories c ON p.category_id = c.id
    WHERE ti.product_id = p.id
      AND ti.kategori_nama IS NULL;
  `);
  console.log("Backfilled kategori_nama from current product categories.");

  // 4. Default remaining nulls to 'Tanpa Kategori'
  await db.execute(sql`
    UPDATE transaction_items
    SET kategori_nama = 'Tanpa Kategori'
    WHERE kategori_nama IS NULL;
  `);
  console.log("Fallback 'Tanpa Kategori' applied to any remaining null items.");

  console.log("Migration complete!");
  process.exit(0);
}

migrateKategoriSnapshot().catch((err) => {
  console.error("Migration error:", err);
  process.exit(1);
});
