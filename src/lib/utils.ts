import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

/**
 * Normalisasi kode_toko: selalu trim dan uppercase.
 * Pakai ini di SETIAP server action atau query yang menerima kodeToko dari input user,
 * supaya "demo01", " Demo01 ", dan "DEMO01" selalu dianggap sama di database.
 */
export function normalizeKodeToko(raw: string): string {
  return raw.trim().toUpperCase();
}

/**
 * Normalisasi email: selalu trim dan lowercase.
 */
export function normalizeEmail(raw: string): string {
  return raw.trim().toLowerCase();
}


export function formatRupiah(amount: number | string | null | undefined): string {
  const num = typeof amount === "string" ? parseFloat(amount) : amount;
  return "Rp " + Number(num || 0).toLocaleString("id-ID");
}

export function formatDateTime(
  date: Date | string | null | undefined,
  locale: string = "id-ID"
): string {
  if (!date) return "-";
  const d = typeof date === "string" ? new Date(date) : date;
  return d.toLocaleString(locale === "en" ? "en-US" : "id-ID", {
    year: "numeric",
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

export function formatDate(
  date: Date | string | null | undefined,
  locale: string = "id-ID"
): string {
  if (!date) return "-";
  const d = typeof date === "string" ? new Date(date) : date;
  return d.toLocaleDateString(locale === "en" ? "en-US" : "id-ID", {
    year: "numeric",
    month: "long",
    day: "numeric",
    timeZone: "Asia/Jakarta",
  });
}

/**
 * Mendapatkan string YYYY-MM-DD dalam zona waktu Indonesia Barat (WIB, UTC+7)
 * Memastikan pengelompokan tanggal transaksi akurat tidak terpengaruh UTC server.
 */
export function getWibDateString(date: Date | string = new Date()): string {
  const d = typeof date === "string" ? new Date(date) : date;
  return new Intl.DateTimeFormat("en-CA", {
    timeZone: "Asia/Jakarta",
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  }).format(d);
}

/**
 * Menghitung batas awal (00:00:00 WIB) dan akhir (23:59:59.999 WIB) dari suatu tanggal,
 * dan mengembalikannya sebagai Date object (UTC) yang siap dipakai pada query SQL
 * `WHERE created_at BETWEEN startUtc AND endUtc`.
 *
 * Contoh: Untuk tanggal 10 Sep 2026:
 * - Start: 2026-09-10 00:00:00 WIB = 2026-09-09 17:00:00.000 UTC
 * - End:   2026-09-10 23:59:59.999 WIB = 2026-09-10 16:59:59.999 UTC
 */
export function getWibDayRange(dateInput: Date | string = new Date()): {
  startUtc: Date;
  endUtc: Date;
  dateStr: string;
} {
  const dateStr = getWibDateString(dateInput); // format "YYYY-MM-DD"
  const [year, month, day] = dateStr.split("-").map(Number);

  // 00:00:00.000 WIB (UTC+7) -> Date.UTC(year, month - 1, day, 0 - 7, 0, 0, 0)
  const startUtc = new Date(Date.UTC(year, month - 1, day, -7, 0, 0, 0));
  // 23:59:59.999 WIB (UTC+7) -> Date.UTC(year, month - 1, day, 23 - 7, 59, 59, 999)
  const endUtc = new Date(Date.UTC(year, month - 1, day, 16, 59, 59, 999));

  return { startUtc, endUtc, dateStr };
}

/**
 * Menghitung batas awal 7 hari yang lalu (00:00:00 WIB) hingga akhir hari ini (23:59:59.999 WIB)
 */
export function getWib7DaysRange(dateInput: Date | string = new Date()): {
  startUtc: Date;
  endUtc: Date;
  days: { label: string; dateStr: string; startUtc: Date; endUtc: Date }[];
} {
  const todayRange = getWibDayRange(dateInput);
  const days: { label: string; dateStr: string; startUtc: Date; endUtc: Date }[] = [];
  const dayNamesID = ["Min", "Sen", "Sel", "Rab", "Kam", "Jum", "Sab"];

  const refDate = new Date(todayRange.startUtc);
  // Geser ke 6 hari sebelumnya (total 7 hari termasuk hari ini)
  for (let i = 6; i >= 0; i--) {
    const targetDate = new Date(refDate.getTime() + (7 * 3600 * 1000) - (i * 24 * 3600 * 1000));
    const range = getWibDayRange(targetDate);
    const dayOfWeek = new Date(range.startUtc.getTime() + 7 * 3600 * 1000).getUTCDay();
    days.push({
      label: dayNamesID[dayOfWeek],
      dateStr: range.dateStr,
      startUtc: range.startUtc,
      endUtc: range.endUtc,
    });
  }

  const startUtc = days[0].startUtc;
  const endUtc = days[days.length - 1].endUtc;

  return { startUtc, endUtc, days };
}

/**
 * Menghitung batas awal 30 hari yang lalu (00:00:00 WIB) hingga akhir hari ini (23:59:59.999 WIB)
 */
export function getWib30DaysRange(dateInput: Date | string = new Date()): {
  startUtc: Date;
  endUtc: Date;
  dateStr: string;
} {
  const todayRange = getWibDayRange(dateInput);
  const thirtyDaysAgoUtc = new Date(todayRange.startUtc.getTime() - 29 * 24 * 3600 * 1000);
  return {
    startUtc: thirtyDaysAgoUtc,
    endUtc: todayRange.endUtc,
    dateStr: todayRange.dateStr,
  };
}

/**
 * Menghitung batas awal bulan ini (tanggal 1 00:00:00 WIB) hingga akhir hari ini (23:59:59.999 WIB)
 */
export function getWibMonthRange(dateInput: Date | string = new Date()): {
  startUtc: Date;
  endUtc: Date;
  dateStr: string;
  monthLabel: string;
} {
  const todayRange = getWibDayRange(dateInput);
  const [year, month] = todayRange.dateStr.split("-").map(Number);
  
  // Tanggal 1 bulan ini jam 00:00:00 WIB (UTC+7 -> 17:00 UTC hari sebelumnya)
  const startUtc = new Date(Date.UTC(year, month - 1, 1, -7, 0, 0, 0));
  
  return {
    startUtc,
    endUtc: todayRange.endUtc,
    dateStr: todayRange.dateStr,
    monthLabel: `${year}-${month.toString().padStart(2, "0")}`,
  };
}

/**
 * Format tanggal dan jam lengkap dalam zona waktu WIB
 */
export function formatWibDateTime(
  date: Date | string | null | undefined,
  locale: string = "id-ID"
): string {
  if (!date) return "-";
  const d = typeof date === "string" ? new Date(date) : date;
  return new Intl.DateTimeFormat(locale === "en" ? "en-US" : "id-ID", {
    timeZone: "Asia/Jakarta",
    year: "numeric",
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
  }).format(d);
}
