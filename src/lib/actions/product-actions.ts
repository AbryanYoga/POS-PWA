"use server";

import { db } from "@/db";
import {
  products,
  categories,
  transactionItems,
  stockMovements,
  auditLogs,
} from "@/db/schema";
import { eq, and, count, sql, isNull, or } from "drizzle-orm";
import { auth } from "@/lib/auth";
import { normalizeKodeToko } from "@/lib/utils";

// ============================================================================
// TYPES
// ============================================================================
export interface ProductItem {
  id: string;
  categoryId: string | null;
  categoryNama: string | null;
  nama: string;
  barcode: string | null;
  sku: string | null;
  hargaBeli: string;
  hargaJual: string;
  stok: number;
  stokMinimum: number;
  gambar: string | null;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface ProductListResult {
  success: boolean;
  data?: ProductItem[];
  error?: string;
}

export interface ProductActionResult {
  success: boolean;
  message?: string;
  data?: ProductItem;
}

export interface AdjustStockInput {
  productId: string;
  tipe: "IN" | "ADJUSTMENT";
  qty: number;
  keterangan: string;
}

export interface AdjustStockResult {
  success: boolean;
  message?: string;
  newStok?: number;
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
// LIST PRODUK
// ============================================================================
export async function getProductsList(params?: {
  categoryId?: string;
  isActive?: boolean;
}): Promise<ProductListResult> {
  try {
    const ctx = await getAuthContext();
    if (!ctx)
      return { success: false, error: "Sesi tidak valid. Silakan login kembali." };
    if (ctx.role !== "ADMIN")
      return { success: false, error: "Hanya admin yang dapat melihat daftar produk." };

    const rows = await db
      .select({
        id: products.id,
        categoryId: products.categoryId,
        categoryNama: categories.nama,
        nama: products.nama,
        barcode: products.barcode,
        sku: products.sku,
        hargaBeli: products.hargaBeli,
        hargaJual: products.hargaJual,
        stok: products.stok,
        stokMinimum: products.stokMinimum,
        gambar: products.gambar,
        isActive: products.isActive,
        createdAt: products.createdAt,
        updatedAt: products.updatedAt,
      })
      .from(products)
      .leftJoin(categories, eq(products.categoryId, categories.id))
      .where(
        and(
          eq(products.kodeToko, ctx.kodeToko),
          params?.categoryId
            ? eq(products.categoryId, params.categoryId)
            : undefined,
          params?.isActive !== undefined
            ? eq(products.isActive, params.isActive)
            : undefined
        )
      )
      .orderBy(products.nama);

    const data: ProductItem[] = rows.map((r) => ({
      id: r.id,
      categoryId: r.categoryId ?? null,
      categoryNama: r.categoryNama ?? null,
      nama: r.nama,
      barcode: r.barcode ?? null,
      sku: r.sku ?? null,
      hargaBeli: r.hargaBeli,
      hargaJual: r.hargaJual,
      stok: r.stok,
      stokMinimum: r.stokMinimum,
      gambar: r.gambar ?? null,
      isActive: r.isActive,
      createdAt: r.createdAt.toISOString(),
      updatedAt: r.updatedAt.toISOString(),
    }));

    return { success: true, data };
  } catch (err) {
    console.error("[getProductsList]", err);
    return { success: false, error: "Gagal memuat daftar produk." };
  }
}

// ============================================================================
// CREATE PRODUK
// ============================================================================
export async function createProductAction(input: {
  nama: string;
  categoryId?: string;
  barcode?: string;
  sku?: string;
  hargaBeli: number;
  hargaJual: number;
  stok: number;
  stokMinimum: number;
  gambar?: string;
}): Promise<ProductActionResult> {
  try {
    const ctx = await getAuthContext();
    if (!ctx)
      return { success: false, message: "Sesi tidak valid. Silakan login kembali." };
    if (ctx.role !== "ADMIN")
      return { success: false, message: "Hanya admin yang dapat menambah produk." };

    const nama = input.nama.trim();
    if (!nama) return { success: false, message: "Nama produk wajib diisi." };
    if (input.hargaJual <= 0)
      return { success: false, message: "Harga jual harus lebih dari 0." };

    // Cek barcode duplikat (jika diisi)
    if (input.barcode?.trim()) {
      const existing = await db
        .select({ id: products.id })
        .from(products)
        .where(
          and(
            eq(products.barcode, input.barcode.trim()),
            eq(products.kodeToko, ctx.kodeToko)
          )
        )
        .limit(1);
      if (existing.length > 0)
        return {
          success: false,
          message: `Barcode "${input.barcode.trim()}" sudah dipakai produk lain di toko ini.`,
        };
    }

    const [newProduct] = await db
      .insert(products)
      .values({
        kodeToko: ctx.kodeToko,
        categoryId: input.categoryId || null,
        nama,
        barcode: input.barcode?.trim() || null,
        sku: input.sku?.trim() || null,
        hargaBeli: input.hargaBeli.toString(),
        hargaJual: input.hargaJual.toString(),
        stok: input.stok,
        stokMinimum: input.stokMinimum,
        gambar: input.gambar || null,
        isActive: true,
      })
      .returning();

    // Catat stok awal ke stock_movements jika stok > 0
    if (input.stok > 0) {
      await db.insert(stockMovements).values({
        kodeToko: ctx.kodeToko,
        productId: newProduct.id,
        tipe: "IN",
        qty: input.stok,
        stokSebelum: 0,
        stokSesudah: input.stok,
        keterangan: "Stok awal produk baru",
      });
    }

    // Audit log
    await db.insert(auditLogs).values({
      kodeToko: ctx.kodeToko,
      userId: ctx.userId,
      aksi: "PRODUCT_CREATED",
      detail: {
        productId: newProduct.id,
        nama,
        hargaJual: input.hargaJual,
        stokAwal: input.stok,
        timestamp: new Date().toISOString(),
      },
    });

    return {
      success: true,
      message: `Produk "${nama}" berhasil ditambahkan.`,
      data: {
        id: newProduct.id,
        categoryId: newProduct.categoryId ?? null,
        categoryNama: null,
        nama: newProduct.nama,
        barcode: newProduct.barcode ?? null,
        sku: newProduct.sku ?? null,
        hargaBeli: newProduct.hargaBeli,
        hargaJual: newProduct.hargaJual,
        stok: newProduct.stok,
        stokMinimum: newProduct.stokMinimum,
        gambar: newProduct.gambar ?? null,
        isActive: newProduct.isActive,
        createdAt: newProduct.createdAt.toISOString(),
        updatedAt: newProduct.updatedAt.toISOString(),
      },
    };
  } catch (err) {
    console.error("[createProductAction]", err);
    return { success: false, message: "Gagal menambahkan produk." };
  }
}

// ============================================================================
// UPDATE PRODUK
// ============================================================================
export async function updateProductAction(input: {
  productId: string;
  nama?: string;
  categoryId?: string | null;
  barcode?: string | null;
  sku?: string | null;
  hargaBeli?: number;
  hargaJual?: number;
  stokMinimum?: number;
  gambar?: string | null;
}): Promise<ProductActionResult> {
  try {
    const ctx = await getAuthContext();
    if (!ctx)
      return { success: false, message: "Sesi tidak valid. Silakan login kembali." };
    if (ctx.role !== "ADMIN")
      return { success: false, message: "Hanya admin yang dapat mengubah produk." };

    // Validasi produk ada di toko ini
    const [target] = await db
      .select()
      .from(products)
      .where(
        and(eq(products.id, input.productId), eq(products.kodeToko, ctx.kodeToko))
      )
      .limit(1);

    if (!target)
      return { success: false, message: "Produk tidak ditemukan di toko ini." };

    // Cek barcode duplikat jika diubah
    if (input.barcode?.trim() && input.barcode.trim() !== target.barcode) {
      const existing = await db
        .select({ id: products.id })
        .from(products)
        .where(
          and(
            eq(products.barcode, input.barcode.trim()),
            eq(products.kodeToko, ctx.kodeToko)
          )
        )
        .limit(1);
      if (existing.length > 0)
        return {
          success: false,
          message: `Barcode "${input.barcode.trim()}" sudah dipakai produk lain.`,
        };
    }

    const prevHargaBeli = parseFloat(target.hargaBeli);

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const updateValues: Record<string, any> = { updatedAt: new Date() };
    if (input.nama !== undefined) updateValues.nama = input.nama.trim();
    if ("categoryId" in input) updateValues.categoryId = input.categoryId ?? null;
    if ("barcode" in input)
      updateValues.barcode = input.barcode?.trim() || null;
    if ("sku" in input) updateValues.sku = input.sku?.trim() || null;
    if (input.hargaBeli !== undefined)
      updateValues.hargaBeli = input.hargaBeli.toString();
    if (input.hargaJual !== undefined)
      updateValues.hargaJual = input.hargaJual.toString();
    if (input.stokMinimum !== undefined) updateValues.stokMinimum = input.stokMinimum;
    if ("gambar" in input) updateValues.gambar = input.gambar ?? null;

    const [updated] = await db
      .update(products)
      .set(updateValues)
      .where(eq(products.id, input.productId))
      .returning();

    // Audit log — catat perubahan harga_beli untuk transparansi
    const hargaBeliChanged =
      input.hargaBeli !== undefined && input.hargaBeli !== prevHargaBeli;
    await db.insert(auditLogs).values({
      kodeToko: ctx.kodeToko,
      userId: ctx.userId,
      aksi: "PRODUCT_UPDATED",
      detail: {
        productId: input.productId,
        nama: updated.nama,
        hargaBeliChanged,
        prevHargaBeli: hargaBeliChanged ? prevHargaBeli : undefined,
        newHargaBeli: hargaBeliChanged ? input.hargaBeli : undefined,
        // Catatan: perubahan harga_beli TIDAK mempengaruhi data historis —
        // transaction_items sudah menyimpan snapshot harga pada saat transaksi terjadi.
        timestamp: new Date().toISOString(),
      },
    });

    return {
      success: true,
      message: `Produk "${updated.nama}" berhasil diperbarui.`,
      data: {
        id: updated.id,
        categoryId: updated.categoryId ?? null,
        categoryNama: null,
        nama: updated.nama,
        barcode: updated.barcode ?? null,
        sku: updated.sku ?? null,
        hargaBeli: updated.hargaBeli,
        hargaJual: updated.hargaJual,
        stok: updated.stok,
        stokMinimum: updated.stokMinimum,
        gambar: updated.gambar ?? null,
        isActive: updated.isActive,
        createdAt: updated.createdAt.toISOString(),
        updatedAt: updated.updatedAt.toISOString(),
      },
    };
  } catch (err) {
    console.error("[updateProductAction]", err);
    return { success: false, message: "Gagal memperbarui produk." };
  }
}

// ============================================================================
// TOGGLE STATUS AKTIF/NONAKTIF
// ============================================================================
export async function toggleProductStatusAction(
  productId: string
): Promise<ProductActionResult> {
  try {
    const ctx = await getAuthContext();
    if (!ctx)
      return { success: false, message: "Sesi tidak valid. Silakan login kembali." };
    if (ctx.role !== "ADMIN")
      return { success: false, message: "Hanya admin yang dapat mengubah status produk." };

    const [target] = await db
      .select()
      .from(products)
      .where(
        and(eq(products.id, productId), eq(products.kodeToko, ctx.kodeToko))
      )
      .limit(1);

    if (!target)
      return { success: false, message: "Produk tidak ditemukan di toko ini." };

    const newStatus = !target.isActive;

    const [updated] = await db
      .update(products)
      .set({ isActive: newStatus, updatedAt: new Date() })
      .where(eq(products.id, productId))
      .returning();

    await db.insert(auditLogs).values({
      kodeToko: ctx.kodeToko,
      userId: ctx.userId,
      aksi: newStatus ? "PRODUCT_ACTIVATED" : "PRODUCT_DEACTIVATED",
      detail: {
        productId,
        nama: target.nama,
        newStatus,
        timestamp: new Date().toISOString(),
      },
    });

    return {
      success: true,
      message: `Produk "${target.nama}" ${newStatus ? "diaktifkan" : "dinonaktifkan"}.`,
      data: {
        id: updated.id,
        categoryId: updated.categoryId ?? null,
        categoryNama: null,
        nama: updated.nama,
        barcode: updated.barcode ?? null,
        sku: updated.sku ?? null,
        hargaBeli: updated.hargaBeli,
        hargaJual: updated.hargaJual,
        stok: updated.stok,
        stokMinimum: updated.stokMinimum,
        gambar: updated.gambar ?? null,
        isActive: updated.isActive,
        createdAt: updated.createdAt.toISOString(),
        updatedAt: updated.updatedAt.toISOString(),
      },
    };
  } catch (err) {
    console.error("[toggleProductStatusAction]", err);
    return { success: false, message: "Gagal mengubah status produk." };
  }
}

// ============================================================================
// DELETE PRODUK
// Soft delete jika pernah ada di transaction_items, hard delete jika belum.
// ============================================================================
export async function deleteProductAction(
  productId: string
): Promise<ProductActionResult> {
  try {
    const ctx = await getAuthContext();
    if (!ctx)
      return { success: false, message: "Sesi tidak valid. Silakan login kembali." };
    if (ctx.role !== "ADMIN")
      return { success: false, message: "Hanya admin yang dapat menghapus produk." };

    const [target] = await db
      .select()
      .from(products)
      .where(
        and(eq(products.id, productId), eq(products.kodeToko, ctx.kodeToko))
      )
      .limit(1);

    if (!target)
      return { success: false, message: "Produk tidak ditemukan di toko ini." };

    // Cek apakah produk pernah dipakai di transaksi
    const usedInTransactions = await db
      .select({ cnt: count() })
      .from(transactionItems)
      .where(eq(transactionItems.productId, productId));

    const hasTransactions = (usedInTransactions[0]?.cnt ?? 0) > 0;

    if (hasTransactions) {
      // Soft delete: nonaktifkan saja, jaga integritas data historis
      await db
        .update(products)
        .set({ isActive: false, updatedAt: new Date() })
        .where(eq(products.id, productId));

      await db.insert(auditLogs).values({
        kodeToko: ctx.kodeToko,
        userId: ctx.userId,
        aksi: "PRODUCT_SOFT_DELETED",
        detail: {
          productId,
          nama: target.nama,
          reason: "Produk pernah dipakai dalam transaksi — soft delete",
          timestamp: new Date().toISOString(),
        },
      });

      return {
        success: true,
        message: `Produk "${target.nama}" dinonaktifkan (tidak bisa dihapus permanen karena pernah ada di riwayat transaksi).`,
      };
    } else {
      // Hard delete: belum pernah transaksi, aman dihapus permanen
      await db.delete(products).where(eq(products.id, productId));

      await db.insert(auditLogs).values({
        kodeToko: ctx.kodeToko,
        userId: ctx.userId,
        aksi: "PRODUCT_HARD_DELETED",
        detail: {
          productId,
          nama: target.nama,
          reason: "Produk belum pernah dipakai dalam transaksi",
          timestamp: new Date().toISOString(),
        },
      });

      return {
        success: true,
        message: `Produk "${target.nama}" berhasil dihapus permanen.`,
      };
    }
  } catch (err) {
    console.error("[deleteProductAction]", err);
    return { success: false, message: "Gagal menghapus produk." };
  }
}

// ============================================================================
// ADJUST STOCK — Stok IN atau ADJUSTMENT manual
// Mencatat ke stock_movements dengan jejak audit, TIDAK overwrite tanpa log.
// ============================================================================
export async function adjustStockAction(
  input: AdjustStockInput
): Promise<AdjustStockResult> {
  try {
    const ctx = await getAuthContext();
    if (!ctx)
      return { success: false, message: "Sesi tidak valid. Silakan login kembali." };
    if (ctx.role !== "ADMIN")
      return { success: false, message: "Hanya admin yang dapat menyesuaikan stok." };

    if (!input.keterangan?.trim())
      return { success: false, message: "Keterangan wajib diisi untuk penyesuaian stok." };

    if (input.tipe === "IN" && input.qty <= 0)
      return { success: false, message: "Jumlah stok masuk harus lebih dari 0." };

    const [target] = await db
      .select()
      .from(products)
      .where(
        and(
          eq(products.id, input.productId),
          eq(products.kodeToko, ctx.kodeToko)
        )
      )
      .limit(1);

    if (!target)
      return { success: false, message: "Produk tidak ditemukan di toko ini." };

    const stokSebelum = target.stok;
    let stokSesudah: number;

    if (input.tipe === "IN") {
      stokSesudah = stokSebelum + input.qty;
    } else {
      // ADJUSTMENT: qty bisa positif (tambah) atau negatif (koreksi kurang)
      stokSesudah = stokSebelum + input.qty;
      if (stokSesudah < 0) {
        return {
          success: false,
          message: `Stok tidak mencukupi. Stok saat ini: ${stokSebelum}, koreksi: ${input.qty}.`,
        };
      }
    }

    // Update stok produk
    await db
      .update(products)
      .set({ stok: stokSesudah, updatedAt: new Date() })
      .where(eq(products.id, input.productId));

    // Catat ke stock_movements untuk audit trail
    await db.insert(stockMovements).values({
      kodeToko: ctx.kodeToko,
      productId: input.productId,
      tipe: input.tipe,
      qty: Math.abs(input.qty),
      stokSebelum,
      stokSesudah,
      keterangan: input.keterangan.trim(),
    });

    await db.insert(auditLogs).values({
      kodeToko: ctx.kodeToko,
      userId: ctx.userId,
      aksi: "STOCK_ADJUSTED",
      detail: {
        productId: input.productId,
        nama: target.nama,
        tipe: input.tipe,
        qty: input.qty,
        stokSebelum,
        stokSesudah,
        keterangan: input.keterangan.trim(),
        timestamp: new Date().toISOString(),
      },
    });

    return {
      success: true,
      message: `Stok "${target.nama}" berhasil diperbarui: ${stokSebelum} → ${stokSesudah}.`,
      newStok: stokSesudah,
    };
  } catch (err) {
    console.error("[adjustStockAction]", err);
    return { success: false, message: "Gagal menyesuaikan stok." };
  }
}
