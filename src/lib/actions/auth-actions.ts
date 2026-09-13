"use server";

import { signIn, signOut, auth } from "@/lib/auth";
import { AuthError } from "next-auth";
import { db } from "@/db";
import { auditLogs, users, categories, storeSettings } from "@/db/schema";
import { normalizeEmail, normalizeKodeToko } from "@/lib/utils";
import { and, eq, gte, inArray, sql } from "drizzle-orm";
import { headers } from "next/headers";
import bcrypt from "bcryptjs";

export interface LoginResult {
  success: boolean;
  message?: string;
  role?: "ADMIN" | "CASHIER";
  namaLengkap?: string;
}

export async function loginAction(data: {
  email: string;
  password: string;
  kodeToko: string;
}): Promise<LoginResult> {
  const email = normalizeEmail(data.email);
  const password = data.password;
  const kodeToko = normalizeKodeToko(data.kodeToko);

  if (!email || !password || !kodeToko) {
    return {
      success: false,
      message: "Semua kolom wajib diisi.",
    };
  }

  try {
    // 0. Rate Limiting Check: Cek percobaan login gagal dalam 5 menit terakhir
    const FIVE_MINUTES_MS = 5 * 60 * 1000;
    const fiveMinutesAgo = new Date(Date.now() - FIVE_MINUTES_MS);

    const recentFailedAttempts = await db
      .select({ count: sql<number>`count(*)` })
      .from(auditLogs)
      .where(
        and(
          eq(auditLogs.kodeToko, kodeToko),
          gte(auditLogs.createdAt, fiveMinutesAgo),
          inArray(auditLogs.aksi, [
            "LOGIN_FAILED_USER_NOT_FOUND",
            "LOGIN_FAILED_WRONG_STORE_CODE",
            "LOGIN_FAILED_WRONG_PASSWORD",
            "LOGIN_FAILED_RATE_LIMITED",
          ]),
          sql`(${auditLogs.detail}->>'inputEmail' = ${email} OR ${auditLogs.detail}->>'email' = ${email})`
        )
      );

    const failedCount = Number(recentFailedAttempts[0]?.count ?? 0);
    if (failedCount >= 5) {
      try {
        await db.insert(auditLogs).values({
          kodeToko,
          aksi: "LOGIN_FAILED_RATE_LIMITED",
          detail: {
            inputEmail: email,
            inputKodeToko: kodeToko,
            failedAttempts: failedCount,
            reason: "Terlalu banyak percobaan login gagal dalam 5 menit",
            timestamp: new Date().toISOString(),
          },
        });
      } catch (logErr) {
        console.warn("[RateLimit Audit Log Error]:", logErr);
      }

      return {
        success: false,
        message:
          "Terlalu banyak percobaan login gagal. Demi keamanan sistem, akses dibatasi selama 5 menit. Silakan coba beberapa saat lagi.",
      };
    }

    // 1. Cari user berdasarkan email terlebih dahulu untuk validasi spesifik
    const user = await db.query.users.findFirst({
      where: eq(users.email, email),
    });

    // Skenario A: User dengan email tersebut tidak ditemukan
    if (!user) {
      await db.insert(auditLogs).values({
        kodeToko,
        aksi: "LOGIN_FAILED_USER_NOT_FOUND",
        detail: {
          inputEmail: email,
          inputKodeToko: kodeToko,
          reason: "Email akun tidak terdaftar di sistem",
          timestamp: new Date().toISOString(),
        },
      });

      return {
        success: false,
        message: "Akun dengan alamat email ini tidak ditemukan.",
      };
    }

    // Skenario B: Email terdaftar, tetapi Kode Toko tidak cocok
    if (user.kodeToko !== kodeToko) {
      await db.insert(auditLogs).values({
        kodeToko,
        userId: user.id,
        aksi: "LOGIN_FAILED_WRONG_STORE_CODE",
        detail: {
          email: user.email,
          inputKodeToko: kodeToko,
          actualKodeToko: user.kodeToko,
          reason: "Kode Toko yang diinput tidak sesuai dengan toko akun",
          timestamp: new Date().toISOString(),
        },
      });

      return {
        success: false,
        message: "Kode Toko tidak cocok dengan akun ini. Pastikan Kode Toko sudah benar.",
      };
    }

    // Skenario C: Akun dinonaktifkan
    if (!user.isActive) {
      await db.insert(auditLogs).values({
        kodeToko: user.kodeToko,
        userId: user.id,
        aksi: "LOGIN_FAILED_INACTIVE_USER",
        detail: {
          email: user.email,
          reason: "Akun dalam status nonaktif",
          timestamp: new Date().toISOString(),
        },
      });

      return {
        success: false,
        message: "Akun ini telah dinonaktifkan. Silakan hubungi admin toko.",
      };
    }

    // Skenario D: Validasi kata sandi
    const isPasswordValid = await bcrypt.compare(password, user.passwordHash);
    if (!isPasswordValid) {
      await db.insert(auditLogs).values({
        kodeToko: user.kodeToko,
        userId: user.id,
        aksi: "LOGIN_FAILED_WRONG_PASSWORD",
        detail: {
          email: user.email,
          reason: "Kata sandi salah",
          timestamp: new Date().toISOString(),
        },
      });

      return {
        success: false,
        message: "Kata sandi yang Anda masukkan salah.",
      };
    }

    // 2. NextAuth Sign In
    await signIn("credentials", {
      email,
      password,
      kodeToko,
      redirect: false,
    });

    // 3. Catat audit log login sukses
    try {
      await db.insert(auditLogs).values({
        kodeToko,
        userId: user.id,
        aksi: "LOGIN_SUCCESS",
        detail: {
          email: user.email,
          role: user.role,
          namaLengkap: user.namaLengkap,
          timestamp: new Date().toISOString(),
        },
      });
    } catch (auditErr) {
      console.warn("[Audit] Failed to log success event:", auditErr);
    }

    return {
      success: true,
      role: user.role,
      namaLengkap: user.namaLengkap,
    };
  } catch (error) {
    if (error instanceof AuthError) {
      switch (error.type) {
        case "CredentialsSignin":
          return {
            success: false,
            message: "Autentikasi gagal. Periksa kembali kredensial Anda.",
          };
        default:
          return {
            success: false,
            message: "Gagal memproses autentikasi.",
          };
      }
    }
    if ((error as Error).message?.includes("NEXT_REDIRECT")) {
      throw error;
    }
    console.error("[Login Action Error]:", error);
    return {
      success: false,
      message: "Terjadi kesalahan server saat login.",
    };
  }
}

export async function logoutAction() {
  await signOut({ redirectTo: "/login" });
}

export async function getSessionUser() {
  const session = await auth();
  return session?.user ?? null;
}

export interface RegisterStoreInput {
  namaToko: string;
  kodeToko: string;
  namaAdmin: string;
  email: string;
  password: string;
}

export interface RegisterResult {
  success: boolean;
  isDemoMode?: boolean;
  message: string;
  kodeToko?: string;
  email?: string;
}

export async function registerStoreAction(
  data: RegisterStoreInput
): Promise<RegisterResult> {
  const namaToko = data.namaToko?.trim() || "";
  let baseKodeToko = normalizeKodeToko(data.kodeToko || "");
  const namaAdmin = data.namaAdmin?.trim() || "";
  const email = normalizeEmail(data.email || "");
  const password = data.password || "";

  // 1. Validasi input
  if (!namaToko) {
    return { success: false, message: "Nama toko wajib diisi." };
  }
  if (!baseKodeToko) {
    return { success: false, message: "Kode toko wajib diisi." };
  }
  if (!/^[A-Z0-9_-]{3,20}$/.test(baseKodeToko)) {
    return {
      success: false,
      message:
        "Kode toko hanya boleh berisi huruf kapital, angka, garis bawah, dan panjang 3-20 karakter.",
    };
  }
  if (!namaAdmin) {
    return { success: false, message: "Nama lengkap admin wajib diisi." };
  }
  if (!email || !email.includes("@") || !email.includes(".")) {
    return { success: false, message: "Format email tidak valid." };
  }
  if (password.length < 6) {
    return { success: false, message: "Kata sandi minimal 6 karakter." };
  }

  // 2. Rate Limiting: Maksimal 3 percobaan pendaftaran per IP per 1 jam
  let clientIp = "127.0.0.1";
  try {
    const headerList = await headers();
    const forwarded = headerList.get("x-forwarded-for");
    if (forwarded) {
      clientIp = (forwarded as string).split(",")[0]?.trim() || "127.0.0.1";
    } else {
      const realIp = headerList.get("x-real-ip");
      clientIp = (realIp as string) || "127.0.0.1";
    }
  } catch (hdrErr) {
    console.warn("[Register] Tidak dapat membaca IP client:", hdrErr);
  }

  const ONE_HOUR_MS = 60 * 60 * 1000;
  const oneHourAgo = new Date(Date.now() - ONE_HOUR_MS);

  try {
    const recentRegAttempts = await db
      .select({ count: sql<number>`count(*)` })
      .from(auditLogs)
      .where(
        and(
          gte(auditLogs.createdAt, oneHourAgo),
          inArray(auditLogs.aksi, [
            "STORE_REGISTERED",
            "STORE_REGISTER_FAILED",
            "STORE_REGISTER_RATE_LIMITED",
          ]),
          sql`(${auditLogs.detail}->>'clientIp' = ${clientIp})`
        )
      );

    const attemptCount = Number(recentRegAttempts[0]?.count ?? 0);
    if (attemptCount >= 3) {
      try {
        await db.insert(auditLogs).values({
          kodeToko: baseKodeToko,
          aksi: "STORE_REGISTER_RATE_LIMITED",
          detail: {
            clientIp,
            email,
            namaToko,
            attemptCount,
            reason: "Maksimal 3 registrasi per jam dari IP ini telah terlampaui",
            timestamp: new Date().toISOString(),
          },
        });
      } catch (logErr) {
        console.warn("[RateLimit Audit Log Error]:", logErr);
      }

      return {
        success: false,
        message:
          "Terlalu banyak permintaan pendaftaran dari jaringan/perangkat ini. Batas maksimal 3 kali pendaftaran per jam demi keamanan. Silakan coba lagi nanti.",
      };
    }
  } catch (rateErr) {
    console.warn("[Register RateLimit Check Error]:", rateErr);
  }

  // 3. Hash kata sandi
  const passwordHash = await bcrypt.hash(password, 10);

  // 4. Mekanisme Retry dengan Jaring Pengaman DB Constraint (store_settings.kode_toko UNIQUE)
  // Menghindari race condition saat dua pendaftar secara bersamaan memilih kode toko yang sama
  const MAX_RETRIES = 5;
  let attempt = 0;
  let currentKodeToko = baseKodeToko;

  while (attempt < MAX_RETRIES) {
    attempt++;
    try {
      // Jalankan transaksi pendaftaran:
      // a. Insert ke store_settings (terproteksi unique constraint uq_store_settings_kode_toko)
      // b. Insert ke users (ADMIN)
      // c. Inisialisasi kategori "Umum"
      // d. Catat audit log
      const registerResult = await db.transaction(async (tx) => {
        // Cek cepat apakah sudah dipakai di users / store_settings
        const existingUser = await tx.query.users.findFirst({
          where: eq(users.kodeToko, currentKodeToko),
        });
        if (existingUser) {
          throw new Error("KODE_TOKO_TAKEN");
        }

        // a. Jaring pengaman DB: Insert store_settings (jika kode_toko sudah ada, Postgres melempar unique violation 23505)
        await tx.insert(storeSettings).values({
          kodeToko: currentKodeToko,
          namaToko: namaToko,
          printerWidth: "58mm",
          themeColor: "primary",
        });

        // b. Insert user ADMIN toko baru
        const [newUser] = await tx
          .insert(users)
          .values({
            kodeToko: currentKodeToko,
            namaLengkap: namaAdmin,
            email,
            passwordHash,
            role: "ADMIN",
            isActive: true,
            tokenVersion: 1,
          })
          .returning();

        // c. Inisialisasi kategori awal "Umum"
        await tx.insert(categories).values({
          kodeToko: currentKodeToko,
          nama: "Umum",
          deskripsi: "Kategori bawaan toko",
          urutan: 1,
        });

        // d. Audit log pendaftaran berhasil
        await tx.insert(auditLogs).values({
          kodeToko: currentKodeToko,
          userId: newUser.id,
          aksi: "STORE_REGISTERED",
          detail: {
            namaToko,
            email,
            namaAdmin,
            clientIp,
            retryAttempts: attempt,
            timestamp: new Date().toISOString(),
          },
        });

        return {
          success: true,
          kodeToko: currentKodeToko,
          email,
        };
      });

      return {
        success: true,
        message:
          attempt > 1
            ? `Kode toko sebelumnya sudah terpakai. Toko Anda berhasil didaftarkan dengan kode alternatif "${currentKodeToko}".`
            : "Toko dan akun admin berhasil didaftarkan!",
        kodeToko: registerResult.kodeToko,
        email: registerResult.email,
      };
    } catch (err: any) {
      const isUniqueViolation =
        err?.code === "23505" ||
        err?.message === "KODE_TOKO_TAKEN" ||
        err?.message?.includes("uq_store_settings_kode_toko") ||
        err?.message?.includes("store_settings_kode_toko_unique");

      if (isUniqueViolation && attempt < MAX_RETRIES) {
        // Generate kode alternatif dengan suffix angka acak 2 digit baru
        const randomSuffix = Math.floor(10 + Math.random() * 90);
        const prefix = baseKodeToko.replace(/\d+$/, "");
        currentKodeToko = `${prefix.slice(0, 10)}${randomSuffix}`.toUpperCase();
        console.warn(
          `[Register] Terjadi konflik kode_toko (race condition). Mencoba ulang (attempt ${attempt}/${MAX_RETRIES}) dengan kode: ${currentKodeToko}`
        );
        continue;
      }

      // Jika error lain atau percobaan habis
      console.error("[Register Action Error]:", err);
      try {
        await db.insert(auditLogs).values({
          kodeToko: currentKodeToko,
          aksi: "STORE_REGISTER_FAILED",
          detail: {
            clientIp,
            email,
            namaToko,
            error: err?.message || String(err),
            timestamp: new Date().toISOString(),
          },
        });
      } catch (logErr) {
        console.warn("[Register Log Error]:", logErr);
      }

      if (isUniqueViolation) {
        return {
          success: false,
          message: `Kode toko "${baseKodeToko}" sudah digunakan. Silakan gunakan kode toko lain.`,
        };
      }

      return {
        success: false,
        message:
          err?.message || "Terjadi kesalahan server saat mendaftarkan toko.",
      };
    }
  }

  return {
    success: false,
    message: "Gagal menemukan kode toko unik yang tersedia. Silakan coba lagi.",
  };
}

