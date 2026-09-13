"use server";

import { db } from "@/db";
import { categories, products, auditLogs } from "@/db/schema";
import { eq, and, count } from "drizzle-orm";
import { auth } from "@/lib/auth";
import { normalizeKodeToko } from "@/lib/utils";

// ============================================================================
// TYPES
// ============================================================================
export interface CategoryItem {
  id: string;
  nama: string;
  deskripsi: string | null;
  urutan: number;
  productCount: number;
  createdAt: string;
  updatedAt: string;
}

export interface CategoryListResult {
  success: boolean;
  data?: CategoryItem[];
  error?: string;
}

export interface CategoryActionResult {
  success: boolean;
  message?: string;
  data?: CategoryItem;
}

// ============================================================================
// Helper: get session & validate kode_toko (pola sama dengan staff-actions.ts)
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

// ============================================================================
// LIST KATEGORI (dengan hitungan produk aktif)
// ============================================================================
export async function getCategoriesList(): Promise<CategoryListResult> {
  try {
    const ctx = await getAuthContext();
    if (!ctx)
      return { success: false, error: "Sesi tidak valid. Silakan login kembali." };
    if (ctx.role !== "ADMIN")
      return { success: false, error: "Hanya admin yang dapat melihat daftar kategori." };

    const rows = await db
      .select({
        id: categories.id,
        nama: categories.nama,
        deskripsi: categories.deskripsi,
        urutan: categories.urutan,
        createdAt: categories.createdAt,
        updatedAt: categories.updatedAt,
      })
      .from(categories)
      .where(eq(categories.kodeToko, ctx.kodeToko))
      .orderBy(categories.urutan, categories.nama);

    // Hitung jumlah produk aktif per kategori
    const productCounts = await db
      .select({
        categoryId: products.categoryId,
        cnt: count(),
      })
      .from(products)
      .where(
        and(
          eq(products.kodeToko, ctx.kodeToko),
          eq(products.isActive, true)
        )
      )
      .groupBy(products.categoryId);

    const countMap = new Map<string, number>();
    for (const pc of productCounts) {
      if (pc.categoryId) countMap.set(pc.categoryId, Number(pc.cnt));
    }

    const data: CategoryItem[] = rows.map((r) => ({
      id: r.id,
      nama: r.nama,
      deskripsi: r.deskripsi ?? null,
      urutan: r.urutan,
      productCount: countMap.get(r.id) ?? 0,
      createdAt: r.createdAt.toISOString(),
      updatedAt: r.updatedAt.toISOString(),
    }));

    return { success: true, data };
  } catch (err) {
    console.error("[getCategoriesList]", err);
    return { success: false, error: "Gagal memuat daftar kategori." };
  }
}

// ============================================================================
// CREATE KATEGORI
// ============================================================================
export async function createCategoryAction(input: {
  nama: string;
  deskripsi?: string;
  urutan?: number;
}): Promise<CategoryActionResult> {
  try {
    const ctx = await getAuthContext();
    if (!ctx)
      return { success: false, message: "Sesi tidak valid. Silakan login kembali." };
    if (ctx.role !== "ADMIN")
      return { success: false, message: "Hanya admin yang dapat menambah kategori." };

    const nama = input.nama.trim();
    if (!nama) return { success: false, message: "Nama kategori wajib diisi." };

    // Cek nama duplikat dalam toko yang sama
    const existing = await db
      .select({ id: categories.id })
      .from(categories)
      .where(
        and(eq(categories.nama, nama), eq(categories.kodeToko, ctx.kodeToko))
      )
      .limit(1);

    if (existing.length > 0)
      return {
        success: false,
        message: `Kategori "${nama}" sudah ada di toko ini.`,
      };

    const [newCat] = await db
      .insert(categories)
      .values({
        kodeToko: ctx.kodeToko,
        nama,
        deskripsi: input.deskripsi?.trim() || null,
        urutan: input.urutan ?? 0,
      })
      .returning();

    await db.insert(auditLogs).values({
      kodeToko: ctx.kodeToko,
      userId: ctx.userId,
      aksi: "CATEGORY_CREATED",
      detail: {
        categoryId: newCat.id,
        nama,
        timestamp: new Date().toISOString(),
      },
    });

    return {
      success: true,
      message: `Kategori "${nama}" berhasil ditambahkan.`,
      data: {
        id: newCat.id,
        nama: newCat.nama,
        deskripsi: newCat.deskripsi ?? null,
        urutan: newCat.urutan,
        productCount: 0,
        createdAt: newCat.createdAt.toISOString(),
        updatedAt: newCat.updatedAt.toISOString(),
      },
    };
  } catch (err) {
    console.error("[createCategoryAction]", err);
    return { success: false, message: "Gagal menambahkan kategori." };
  }
}

// ============================================================================
// UPDATE KATEGORI
// ============================================================================
export async function updateCategoryAction(input: {
  categoryId: string;
  nama?: string;
  deskripsi?: string | null;
  urutan?: number;
}): Promise<CategoryActionResult> {
  try {
    const ctx = await getAuthContext();
    if (!ctx)
      return { success: false, message: "Sesi tidak valid. Silakan login kembali." };
    if (ctx.role !== "ADMIN")
      return { success: false, message: "Hanya admin yang dapat mengubah kategori." };

    const [target] = await db
      .select()
      .from(categories)
      .where(
        and(
          eq(categories.id, input.categoryId),
          eq(categories.kodeToko, ctx.kodeToko)
        )
      )
      .limit(1);

    if (!target)
      return { success: false, message: "Kategori tidak ditemukan di toko ini." };

    // Cek nama duplikat jika nama diubah
    if (input.nama?.trim() && input.nama.trim() !== target.nama) {
      const existing = await db
        .select({ id: categories.id })
        .from(categories)
        .where(
          and(
            eq(categories.nama, input.nama.trim()),
            eq(categories.kodeToko, ctx.kodeToko)
          )
        )
        .limit(1);
      if (existing.length > 0)
        return {
          success: false,
          message: `Kategori "${input.nama.trim()}" sudah ada di toko ini.`,
        };
    }

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const updateValues: Record<string, any> = { updatedAt: new Date() };
    if (input.nama?.trim()) updateValues.nama = input.nama.trim();
    if ("deskripsi" in input) updateValues.deskripsi = input.deskripsi?.trim() || null;
    if (input.urutan !== undefined) updateValues.urutan = input.urutan;

    const [updated] = await db
      .update(categories)
      .set(updateValues)
      .where(eq(categories.id, input.categoryId))
      .returning();

    await db.insert(auditLogs).values({
      kodeToko: ctx.kodeToko,
      userId: ctx.userId,
      aksi: "CATEGORY_UPDATED",
      detail: {
        categoryId: input.categoryId,
        nama: updated.nama,
        timestamp: new Date().toISOString(),
      },
    });

    return {
      success: true,
      message: `Kategori "${updated.nama}" berhasil diperbarui.`,
      data: {
        id: updated.id,
        nama: updated.nama,
        deskripsi: updated.deskripsi ?? null,
        urutan: updated.urutan,
        productCount: 0,
        createdAt: updated.createdAt.toISOString(),
        updatedAt: updated.updatedAt.toISOString(),
      },
    };
  } catch (err) {
    console.error("[updateCategoryAction]", err);
    return { success: false, message: "Gagal memperbarui kategori." };
  }
}

// ============================================================================
// DELETE KATEGORI
// WAJIB cegah penghapusan jika masih ada produk aktif terkait.
// ============================================================================
export async function deleteCategoryAction(
  categoryId: string
): Promise<CategoryActionResult> {
  try {
    const ctx = await getAuthContext();
    if (!ctx)
      return { success: false, message: "Sesi tidak valid. Silakan login kembali." };
    if (ctx.role !== "ADMIN")
      return { success: false, message: "Hanya admin yang dapat menghapus kategori." };

    const [target] = await db
      .select()
      .from(categories)
      .where(
        and(
          eq(categories.id, categoryId),
          eq(categories.kodeToko, ctx.kodeToko)
        )
      )
      .limit(1);

    if (!target)
      return { success: false, message: "Kategori tidak ditemukan di toko ini." };

    // Cegah hapus jika masih ada produk AKTIF yang memakai kategori ini
    const activeProductCount = await db
      .select({ cnt: count() })
      .from(products)
      .where(
        and(
          eq(products.categoryId, categoryId),
          eq(products.isActive, true)
        )
      );

    const n = Number(activeProductCount[0]?.cnt ?? 0);
    if (n > 0) {
      return {
        success: false,
        message: `Kategori masih memiliki ${n} produk aktif, pindahkan atau nonaktifkan produk tersebut dulu sebelum menghapus kategori ini.`,
      };
    }

    // Aman dihapus
    await db.delete(categories).where(eq(categories.id, categoryId));

    await db.insert(auditLogs).values({
      kodeToko: ctx.kodeToko,
      userId: ctx.userId,
      aksi: "CATEGORY_DELETED",
      detail: {
        categoryId,
        nama: target.nama,
        timestamp: new Date().toISOString(),
      },
    });

    return {
      success: true,
      message: `Kategori "${target.nama}" berhasil dihapus.`,
    };
  } catch (err) {
    console.error("[deleteCategoryAction]", err);
    return { success: false, message: "Gagal menghapus kategori." };
  }
}
