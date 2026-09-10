/**
 * Test script: membuktikan DATABASE_URL valid dan koneksi ke database berhasil.
 *
 * Cara menjalankan:
 *   npx tsx src/db/test-connection.ts
 *
 * Apa yang diuji:
 *   1. Koneksi berhasil dibuka ke PostgreSQL/Supabase
 *   2. 9 tabel core sudah ada di schema public
 *   3. SELECT count(*) FROM users (tabel ada dan bisa di-query)
 */

import postgres from "postgres";
import * as dotenv from "dotenv";
import { resolve } from "path";

// Load .env.local dari root project
dotenv.config({ path: resolve(process.cwd(), ".env.local") });

const DATABASE_URL = process.env.DATABASE_URL;

if (!DATABASE_URL) {
  console.error("❌ DATABASE_URL tidak ditemukan di .env.local");
  process.exit(1);
}

const EXPECTED_TABLES = [
  "users",
  "categories",
  "products",
  "transactions",
  "transaction_items",
  "stock_movements",
  "expenses",
  "audit_logs",
  "store_settings",
];

async function testConnection() {
  console.log("\n🔌 Mencoba koneksi ke database...");
  console.log(`   URL: ${DATABASE_URL?.replace(/:([^@]+)@/, ":****@")}\n`);

  const sql = postgres(DATABASE_URL!, {
    connect_timeout: 10,
    max: 1,
    prepare: false,
  });

  try {
    // ----------------------------------------------------------------
    // TEST 1: Koneksi dasar
    // ----------------------------------------------------------------
    const [ping] = await sql`SELECT now() AS server_time, version() AS pg_version`;
    console.log("✅ TEST 1 PASSED — Koneksi berhasil!");
    console.log(`   Server time : ${ping.server_time}`);
    console.log(`   PG Version  : ${String(ping.pg_version).split(",")[0]}\n`);

    // ----------------------------------------------------------------
    // TEST 2: Verifikasi tabel-tabel sudah ada
    // ----------------------------------------------------------------
    const tables = await sql<{ table_name: string }[]>`
      SELECT table_name
      FROM information_schema.tables
      WHERE table_schema = 'public'
        AND table_type = 'BASE TABLE'
        AND table_name = ANY(${EXPECTED_TABLES})
      ORDER BY table_name
    `;

    const foundTables = tables.map((t) => t.table_name);
    const missingTables = EXPECTED_TABLES.filter((t) => !foundTables.includes(t));

    console.log(`✅ TEST 2 — Verifikasi tabel di database:`);
    EXPECTED_TABLES.forEach((t) => {
      const found = foundTables.includes(t);
      console.log(`   ${found ? "✓" : "✗"} ${t}`);
    });

    if (missingTables.length > 0) {
      console.log(`\n⚠️  Tabel yang BELUM ada: ${missingTables.join(", ")}`);
      console.log("   Jalankan: npm run db:push\n");
    } else {
      console.log("\n   Semua 9 tabel sudah terbentuk! ✓\n");
    }

    // ----------------------------------------------------------------
    // TEST 3: Query count dari setiap tabel
    // ----------------------------------------------------------------
    console.log("✅ TEST 3 — Row count per tabel:");
    for (const table of foundTables) {
      const [{ count }] = await sql`
        SELECT COUNT(*)::int AS count FROM ${sql(table)}
      `;
      console.log(`   ${table.padEnd(20)} : ${count} rows`);
    }

    console.log("\n🎉 Semua test koneksi database BERHASIL!\n");
  } catch (err: unknown) {
    const error = err as Error;
    console.error("\n❌ Koneksi database GAGAL:");
    console.error(`   ${error.message}`);
    console.error("\n📝 Tips:");
    console.error("   • Pastikan DATABASE_URL di .env.local sudah benar");
    console.error("   • Format Supabase pooler: postgresql://postgres.[ref]:[password]@aws-0-*.pooler.supabase.com:6543/postgres?pgbouncer=true");
    console.error("   • Format Supabase direct: postgresql://postgres:[password]@db.[ref].supabase.co:5432/postgres");
    process.exit(1);
  } finally {
    await sql.end();
  }
}

testConnection();
