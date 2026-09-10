import { db } from "@/db";
import { transactions } from "@/db/schema";
import { and, eq, sql, gte, lte } from "drizzle-orm";
import { getWibDayRange, getWibDateString } from "@/lib/utils";

export async function generateNoTransaksi(
  tx: Parameters<Parameters<(typeof db)["transaction"]>[0]>[0],
  kodeToko: string,
  tanggal: Date = new Date()
): Promise<string> {
  const { startUtc, endUtc, dateStr } = getWibDayRange(tanggal);
  const dateCompact = dateStr.replace(/-/g, ""); // "YYYYMMDD"

  const lockKey = `${kodeToko}-${dateCompact}`;

  // Konversi string lock key ke bigint yang stabil via hashCode
  // PostgreSQL pg_advisory_xact_lock menerima bigint
  const lockId = stringToAdvisoryLockId(lockKey);

  // Acquire PostgreSQL Advisory Lock (transaction-scoped, auto-release saat commit/rollback)
  // Ini BLOCKING: jika ada kasir lain yang sedang buat nomor transaksi untuk
  // toko yang sama hari yang sama, query ini akan menunggu sampai lock dilepas.
  await tx.execute(sql`SELECT pg_advisory_xact_lock(${lockId})`);

  // Setelah lock diperoleh, baca jumlah transaksi hari ini untuk toko ini (rentang 00:00-23:59 WIB dalam UTC)
  const [result] = await tx
    .select({ count: sql<number>`COUNT(*)::int` })
    .from(transactions)
    .where(
      and(
        eq(transactions.kodeToko, kodeToko),
        gte(transactions.createdAt, startUtc),
        lte(transactions.createdAt, endUtc)
      )
    );

  const nextSeq = ((result?.count ?? 0) + 1).toString().padStart(4, "0");
  return `TRX-${dateCompact}-${nextSeq}`;
}

/**
 * Konversi string ke bigint yang stabil untuk pg_advisory_xact_lock.
 * Menggunakan DJB2 hash yang sederhana dan deterministik.
 */
function stringToAdvisoryLockId(str: string): bigint {
  let hash = BigInt(5381);
  for (let i = 0; i < str.length; i++) {
    hash = ((hash << BigInt(5)) + hash + BigInt(str.charCodeAt(i))) & BigInt("0x7FFFFFFFFFFFFFFF");
  }
  return hash;
}
