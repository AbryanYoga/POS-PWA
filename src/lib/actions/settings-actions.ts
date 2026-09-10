"use server";

import { db } from "@/db";
import { storeSettings, users, auditLogs } from "@/db/schema";
import { eq, and } from "drizzle-orm";
import { auth } from "@/lib/auth";
import { normalizeKodeToko } from "@/lib/utils";
import bcrypt from "bcryptjs";

// ============================================================================
// TYPES
// ============================================================================
export interface StoreSettingsData {
  kodeToko: string;
  namaToko: string;
  alamat: string | null;
  telepon: string | null;
  printerWidth: string;
  themeColor: string;
}

export interface SettingsActionResult {
  success: boolean;
  message?: string;
  data?: StoreSettingsData;
}

// ============================================================================
// Helper: get session & validate
// ============================================================================
async function getAdminContext(): Promise<{
  kodeToko: string;
  userId: string;
} | null> {
  const session = await auth();
  if (!session?.user?.kodeToko || !session.user.id) return null;
  if (session.user.role !== "ADMIN") return null;
  return {
    kodeToko: normalizeKodeToko(session.user.kodeToko),
    userId: session.user.id,
  };
}

// ============================================================================
// GET STORE SETTINGS
// ============================================================================
export async function getStoreSettings(): Promise<{
  success: boolean;
  data?: StoreSettingsData;
  error?: string;
}> {
  try {
    const session = await auth();
    if (!session?.user?.kodeToko)
      return { success: false, error: "Sesi tidak valid." };

    const kodeToko = normalizeKodeToko(session.user.kodeToko);

    const [row] = await db
      .select()
      .from(storeSettings)
      .where(eq(storeSettings.kodeToko, kodeToko))
      .limit(1);

    if (!row)
      return {
        success: false,
        error: "Pengaturan toko belum ditemukan. Hubungi administrator.",
      };

    return {
      success: true,
      data: {
        kodeToko: row.kodeToko,
        namaToko: row.namaToko,
        alamat: row.alamat,
        telepon: row.telepon,
        printerWidth: row.printerWidth,
        themeColor: row.themeColor,
      },
    };
  } catch (err) {
    console.error("[getStoreSettings]", err);
    return { success: false, error: "Gagal memuat pengaturan toko." };
  }
}

// ============================================================================
// UPDATE STORE INFO (namaToko, alamat, telepon)
// ============================================================================
export async function updateStoreInfoAction(input: {
  namaToko: string;
  alamat?: string;
  telepon?: string;
}): Promise<SettingsActionResult> {
  try {
    const ctx = await getAdminContext();
    if (!ctx)
      return { success: false, message: "Sesi tidak valid atau bukan admin." };

    const namaToko = input.namaToko.trim();
    if (!namaToko)
      return { success: false, message: "Nama toko tidak boleh kosong." };

    const [updated] = await db
      .update(storeSettings)
      .set({
        namaToko,
        alamat: input.alamat?.trim() ?? null,
        telepon: input.telepon?.trim() ?? null,
        updatedAt: new Date(),
      })
      .where(eq(storeSettings.kodeToko, ctx.kodeToko))
      .returning();

    if (!updated)
      return { success: false, message: "Pengaturan toko tidak ditemukan." };

    // Audit log
    await db.insert(auditLogs).values({
      kodeToko: ctx.kodeToko,
      userId: ctx.userId,
      aksi: "STORE_INFO_UPDATED",
      detail: {
        namaToko,
        alamat: input.alamat,
        telepon: input.telepon,
        timestamp: new Date().toISOString(),
      },
    });

    return {
      success: true,
      message: "Informasi toko berhasil diperbarui.",
      data: {
        kodeToko: updated.kodeToko,
        namaToko: updated.namaToko,
        alamat: updated.alamat,
        telepon: updated.telepon,
        printerWidth: updated.printerWidth,
        themeColor: updated.themeColor,
      },
    };
  } catch (err) {
    console.error("[updateStoreInfoAction]", err);
    return { success: false, message: "Gagal menyimpan informasi toko." };
  }
}

// ============================================================================
// UPDATE PREFERENCES (printerWidth, themeColor)
// ============================================================================
export async function updateStorePreferencesAction(input: {
  printerWidth?: string;
  themeColor?: string;
}): Promise<SettingsActionResult> {
  try {
    const ctx = await getAdminContext();
    if (!ctx)
      return { success: false, message: "Sesi tidak valid atau bukan admin." };

    const validPrinterWidths = ["58mm", "80mm"];
    const validThemes = ["primary", "green", "purple", "orange", "teal"];

    if (input.printerWidth && !validPrinterWidths.includes(input.printerWidth))
      return { success: false, message: "Lebar printer tidak valid." };

    if (input.themeColor && !validThemes.includes(input.themeColor))
      return { success: false, message: "Tema warna tidak valid." };

    const [updated] = await db
      .update(storeSettings)
      .set({
        ...(input.printerWidth ? { printerWidth: input.printerWidth } : {}),
        ...(input.themeColor ? { themeColor: input.themeColor } : {}),
        updatedAt: new Date(),
      })
      .where(eq(storeSettings.kodeToko, ctx.kodeToko))
      .returning();

    if (!updated)
      return { success: false, message: "Pengaturan toko tidak ditemukan." };

    await db.insert(auditLogs).values({
      kodeToko: ctx.kodeToko,
      userId: ctx.userId,
      aksi: "STORE_PREFERENCES_UPDATED",
      detail: {
        printerWidth: input.printerWidth,
        themeColor: input.themeColor,
        timestamp: new Date().toISOString(),
      },
    });

    return {
      success: true,
      message: "Preferensi toko berhasil disimpan.",
      data: {
        kodeToko: updated.kodeToko,
        namaToko: updated.namaToko,
        alamat: updated.alamat,
        telepon: updated.telepon,
        printerWidth: updated.printerWidth,
        themeColor: updated.themeColor,
      },
    };
  } catch (err) {
    console.error("[updateStorePreferencesAction]", err);
    return { success: false, message: "Gagal menyimpan preferensi toko." };
  }
}

// ============================================================================
// CHANGE OWN PASSWORD (admin mengubah password dirinya sendiri)
// ============================================================================
export async function changeOwnPasswordAction(input: {
  currentPassword: string;
  newPassword: string;
  confirmPassword: string;
}): Promise<{ success: boolean; message: string }> {
  try {
    const session = await auth();
    if (!session?.user?.id || !session.user.kodeToko)
      return { success: false, message: "Sesi tidak valid. Silakan login kembali." };

    if (input.newPassword !== input.confirmPassword)
      return { success: false, message: "Konfirmasi kata sandi tidak cocok." };

    if (input.newPassword.length < 6)
      return { success: false, message: "Kata sandi baru minimal 6 karakter." };

    const kodeToko = normalizeKodeToko(session.user.kodeToko);

    // Fetch current user record
    const [user] = await db
      .select()
      .from(users)
      .where(
        and(eq(users.id, session.user.id), eq(users.kodeToko, kodeToko))
      )
      .limit(1);

    if (!user)
      return { success: false, message: "Akun tidak ditemukan." };

    const isCurrentValid = await bcrypt.compare(
      input.currentPassword,
      user.passwordHash
    );
    if (!isCurrentValid)
      return { success: false, message: "Kata sandi lama tidak sesuai." };

    const newHash = await bcrypt.hash(input.newPassword, 12);

    await db
      .update(users)
      .set({ passwordHash: newHash, updatedAt: new Date() })
      .where(eq(users.id, user.id));

    await db.insert(auditLogs).values({
      kodeToko,
      userId: user.id,
      aksi: "OWN_PASSWORD_CHANGED",
      detail: { timestamp: new Date().toISOString() },
    });

    return { success: true, message: "Kata sandi berhasil diubah." };
  } catch (err) {
    console.error("[changeOwnPasswordAction]", err);
    return { success: false, message: "Gagal mengubah kata sandi." };
  }
}
