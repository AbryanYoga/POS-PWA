"use server";

import { signIn, signOut, auth } from "@/lib/auth";
import { AuthError } from "next-auth";
import { db } from "@/db";
import { auditLogs, users } from "@/db/schema";
import { normalizeEmail, normalizeKodeToko } from "@/lib/utils";
import { eq } from "drizzle-orm";
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
