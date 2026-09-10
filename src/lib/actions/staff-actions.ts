"use server";

import { db } from "@/db";
import { users, auditLogs } from "@/db/schema";
import { eq, and, count, sql } from "drizzle-orm";
import { auth } from "@/lib/auth";
import { normalizeEmail, normalizeKodeToko } from "@/lib/utils";
import bcrypt from "bcryptjs";

// ============================================================================
// TYPES
// ============================================================================
export interface StaffMember {
  id: string;
  namaLengkap: string;
  email: string;
  role: "ADMIN" | "CASHIER";
  isActive: boolean;
  createdAt: string;
}

export interface StaffListResult {
  success: boolean;
  data?: StaffMember[];
  error?: string;
}

export interface StaffActionResult {
  success: boolean;
  message?: string;
  data?: StaffMember;
}

// ============================================================================
// Helper: get session & validate kode_toko
// ============================================================================
async function getAuthContext(): Promise<{
  kodeToko: string;
  userId: string;
  role: string;
} | null> {
  const session = await auth();
  if (!session?.user?.kodeToko || !session.user.id) return null;
  return {
    kodeToko: normalizeKodeToko(session.user.kodeToko),
    userId: session.user.id,
    role: session.user.role ?? "",
  };
}

/**
 * Menghitung jumlah admin aktif di kode_toko.
 * Dipakai untuk proteksi "last admin standing".
 */
async function countActiveAdmins(kodeToko: string): Promise<number> {
  const result = await db
    .select({ cnt: count() })
    .from(users)
    .where(
      and(
        eq(users.kodeToko, kodeToko),
        eq(users.role, "ADMIN"),
        eq(users.isActive, true)
      )
    );
  return result[0]?.cnt ?? 0;
}

// ============================================================================
// LIST STAFF
// ============================================================================
export async function getStaffList(): Promise<StaffListResult> {
  try {
    const ctx = await getAuthContext();
    if (!ctx)
      return { success: false, error: "Sesi tidak valid. Silakan login kembali." };
    if (ctx.role !== "ADMIN")
      return { success: false, error: "Hanya admin yang dapat melihat daftar staff." };

    const rows = await db
      .select({
        id: users.id,
        namaLengkap: users.namaLengkap,
        email: users.email,
        role: users.role,
        isActive: users.isActive,
        createdAt: users.createdAt,
      })
      .from(users)
      .where(eq(users.kodeToko, ctx.kodeToko))
      .orderBy(users.createdAt);

    const data: StaffMember[] = rows.map((r) => ({
      id: r.id,
      namaLengkap: r.namaLengkap,
      email: r.email,
      role: r.role,
      isActive: r.isActive,
      createdAt: r.createdAt.toISOString(),
    }));

    return { success: true, data };
  } catch (err) {
    console.error("[getStaffList]", err);
    return { success: false, error: "Gagal memuat daftar staff." };
  }
}

// ============================================================================
// CREATE STAFF
// ============================================================================
export async function createStaffAction(input: {
  namaLengkap: string;
  email: string;
  password: string;
  role: "ADMIN" | "CASHIER";
}): Promise<StaffActionResult> {
  try {
    const ctx = await getAuthContext();
    if (!ctx)
      return { success: false, message: "Sesi tidak valid. Silakan login kembali." };
    if (ctx.role !== "ADMIN")
      return { success: false, message: "Hanya admin yang dapat menambah staff." };

    const namaLengkap = input.namaLengkap.trim();
    const email = normalizeEmail(input.email);
    const { password, role } = input;

    if (!namaLengkap || !email || !password)
      return { success: false, message: "Nama, email, dan kata sandi wajib diisi." };

    if (password.length < 6)
      return { success: false, message: "Kata sandi minimal 6 karakter." };

    // Cek duplikat email dalam toko yang sama
    const existing = await db
      .select({ id: users.id })
      .from(users)
      .where(and(eq(users.email, email), eq(users.kodeToko, ctx.kodeToko)))
      .limit(1);

    if (existing.length > 0)
      return {
        success: false,
        message: `Email "${email}" sudah terdaftar di toko ini.`,
      };

    const passwordHash = await bcrypt.hash(password, 12);

    const [newUser] = await db
      .insert(users)
      .values({
        kodeToko: ctx.kodeToko,
        namaLengkap,
        email,
        passwordHash,
        role,
        isActive: true,
        tokenVersion: 1,
      })
      .returning();

    // Audit log
    await db.insert(auditLogs).values({
      kodeToko: ctx.kodeToko,
      userId: ctx.userId,
      aksi: "STAFF_CREATED",
      detail: {
        targetEmail: email,
        targetNama: namaLengkap,
        targetRole: role,
        timestamp: new Date().toISOString(),
      },
    });

    return {
      success: true,
      message: `Staff "${namaLengkap}" berhasil ditambahkan.`,
      data: {
        id: newUser.id,
        namaLengkap: newUser.namaLengkap,
        email: newUser.email,
        role: newUser.role,
        isActive: newUser.isActive,
        createdAt: newUser.createdAt.toISOString(),
      },
    };
  } catch (err) {
    console.error("[createStaffAction]", err);
    return { success: false, message: "Gagal menambahkan staff." };
  }
}

// ============================================================================
// UPDATE STAFF (nama, status aktif, role, reset password)
// ============================================================================
export async function updateStaffAction(input: {
  targetUserId: string;
  namaLengkap?: string;
  isActive?: boolean;
  role?: "ADMIN" | "CASHIER";
  newPassword?: string;
}): Promise<StaffActionResult> {
  try {
    const ctx = await getAuthContext();
    if (!ctx)
      return { success: false, message: "Sesi tidak valid. Silakan login kembali." };
    if (ctx.role !== "ADMIN")
      return { success: false, message: "Hanya admin yang dapat mengubah data staff." };

    // Validasi target user ada di toko yang sama
    const [target] = await db
      .select()
      .from(users)
      .where(
        and(eq(users.id, input.targetUserId), eq(users.kodeToko, ctx.kodeToko))
      )
      .limit(1);

    if (!target)
      return { success: false, message: "User tidak ditemukan di toko ini." };

    // ── POIN 1: Last Admin Standing Protection ─────────────────────────────
    // Cegah menonaktifkan admin jika dia adalah satu-satunya admin aktif
    if (input.isActive === false && target.role === "ADMIN") {
      const activeAdminCount = await countActiveAdmins(ctx.kodeToko);
      if (activeAdminCount <= 1) {
        return {
          success: false,
          message:
            "Tidak bisa menonaktifkan admin terakhir di toko ini. Pastikan ada minimal satu admin aktif lain sebelum menonaktifkan akun ini.",
        };
      }
    }

    // Cegah admin menonaktifkan dirinya sendiri
    if (input.targetUserId === ctx.userId && input.isActive === false)
      return {
        success: false,
        message: "Anda tidak dapat menonaktifkan akun Anda sendiri.",
      };

    // Cegah admin men-downgrade role dirinya sendiri
    if (input.targetUserId === ctx.userId && input.role === "CASHIER")
      return {
        success: false,
        message: "Anda tidak dapat mengubah role akun Anda sendiri.",
      };

    // ── POIN 4: Determine if tokenVersion perlu di-increment ───────────────
    // Increment tokenVersion jika: password direset ATAU akun dinonaktifkan
    const shouldIncrementToken =
      !!input.newPassword || input.isActive === false;

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const updateValues: Record<string, any> = {
      updatedAt: new Date(),
    };

    if (input.namaLengkap !== undefined)
      updateValues.namaLengkap = input.namaLengkap.trim();
    if (input.isActive !== undefined) updateValues.isActive = input.isActive;
    if (input.role !== undefined) updateValues.role = input.role;
    if (input.newPassword) {
      if (input.newPassword.length < 6)
        return {
          success: false,
          message: "Kata sandi baru minimal 6 karakter.",
        };
      updateValues.passwordHash = await bcrypt.hash(input.newPassword, 12);
    }

    // Increment tokenVersion — memaksa sesi lama tidak valid
    if (shouldIncrementToken) {
      updateValues.tokenVersion = sql`${users.tokenVersion} + 1`;
    }

    const [updated] = await db
      .update(users)
      .set(updateValues)
      .where(eq(users.id, input.targetUserId))
      .returning();

    // Audit log
    const changedFields = Object.keys(updateValues).filter(
      (k) => k !== "updatedAt" && k !== "passwordHash" && k !== "tokenVersion"
    );
    await db.insert(auditLogs).values({
      kodeToko: ctx.kodeToko,
      userId: ctx.userId,
      aksi: "STAFF_UPDATED",
      detail: {
        targetId: input.targetUserId,
        targetEmail: target.email,
        changes: changedFields,
        passwordChanged: !!input.newPassword,
        sessionInvalidated: shouldIncrementToken,
        timestamp: new Date().toISOString(),
      },
    });

    return {
      success: true,
      message: `Data staff "${updated.namaLengkap}" berhasil diperbarui.${
        shouldIncrementToken
          ? " Sesi aktif staff tersebut telah dinonaktifkan."
          : ""
      }`,
      data: {
        id: updated.id,
        namaLengkap: updated.namaLengkap,
        email: updated.email,
        role: updated.role,
        isActive: updated.isActive,
        createdAt: updated.createdAt.toISOString(),
      },
    };
  } catch (err) {
    console.error("[updateStaffAction]", err);
    return { success: false, message: "Gagal memperbarui data staff." };
  }
}

// ============================================================================
// DELETE STAFF (soft delete — nonaktifkan + rename email supaya bisa dipakai ulang)
// Poin 3 terpenuhi: email di-prefix "deleted_<timestamp>_" supaya tidak bentrok unique constraint
// ============================================================================
export async function deleteStaffAction(
  targetUserId: string
): Promise<StaffActionResult> {
  try {
    const ctx = await getAuthContext();
    if (!ctx)
      return { success: false, message: "Sesi tidak valid. Silakan login kembali." };
    if (ctx.role !== "ADMIN")
      return { success: false, message: "Hanya admin yang dapat menghapus staff." };

    if (targetUserId === ctx.userId)
      return { success: false, message: "Anda tidak dapat menghapus akun Anda sendiri." };

    // Validasi target user ada di toko yang sama
    const [target] = await db
      .select()
      .from(users)
      .where(
        and(eq(users.id, targetUserId), eq(users.kodeToko, ctx.kodeToko))
      )
      .limit(1);

    if (!target)
      return { success: false, message: "User tidak ditemukan di toko ini." };

    // ── POIN 3: Proteksi Last Admin Standing saat Soft-Delete Admin ────────
    if (target.role === "ADMIN") {
      const activeAdminCount = await countActiveAdmins(ctx.kodeToko);
      if (activeAdminCount <= 1) {
        return {
          success: false,
          message:
            "Tidak bisa menghapus admin terakhir di toko ini. Harus ada minimal satu admin aktif lain.",
        };
      }
    }

    // Poin 3: soft-delete — nonaktifkan + rename email dengan prefix unik
    // supaya email asli bisa dipakai ulang untuk staff baru tanpa bentrok unique constraint
    await db
      .update(users)
      .set({
        isActive: false,
        namaLengkap: `[Deleted] ${target.namaLengkap}`,
        email: `deleted_${Date.now()}_${target.email}`,
        // Poin 4: increment tokenVersion — paksa invalidasi sesi aktif
        tokenVersion: sql`${users.tokenVersion} + 1`,
        updatedAt: new Date(),
      })
      .where(eq(users.id, targetUserId));

    // Audit log
    await db.insert(auditLogs).values({
      kodeToko: ctx.kodeToko,
      userId: ctx.userId,
      aksi: "STAFF_DELETED",
      detail: {
        targetId: targetUserId,
        targetEmail: target.email,
        targetNama: target.namaLengkap,
        sessionInvalidated: true,
        timestamp: new Date().toISOString(),
      },
    });

    return {
      success: true,
      message: `Staff "${target.namaLengkap}" berhasil dihapus. Sesi aktif staff tersebut telah dinonaktifkan.`,
    };
  } catch (err) {
    console.error("[deleteStaffAction]", err);
    return { success: false, message: "Gagal menghapus staff." };
  }
}
