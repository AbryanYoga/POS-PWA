/**
 * migrate-token-version.ts
 * Menambahkan kolom token_version ke tabel users yang sudah ada.
 * Jalankan: npx tsx src/db/migrate-token-version.ts
 */
import { sql } from "drizzle-orm";
import { db } from "./index";

async function migrate() {
  console.log("[migrate-token-version] Menambahkan kolom token_version...");

  try {
    // ADD COLUMN IF NOT EXISTS — aman dijalankan berkali-kali
    await db.execute(sql`
      ALTER TABLE users
      ADD COLUMN IF NOT EXISTS token_version integer NOT NULL DEFAULT 1;
    `);
    console.log("[migrate-token-version] ✅ Selesai. Kolom token_version sudah ada.");
  } catch (err) {
    console.error("[migrate-token-version] ❌ Error:", err);
    throw err;
  }
}

migrate().then(() => process.exit(0)).catch(() => process.exit(1));
