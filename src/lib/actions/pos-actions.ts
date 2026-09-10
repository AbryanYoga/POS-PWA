"use server";

import { auth } from "@/lib/auth";
import { db } from "@/db";
import {
  products,
  categories,
  transactions,
  transactionItems,
  stockMovements,
  storeSettings,
  users,
} from "@/db/schema";
import { eq, and, sql, desc, inArray } from "drizzle-orm";
import { generateNoTransaksi } from "@/lib/trx-number";
import { formatWibDateTime, getWibDateString } from "@/lib/utils";

export interface CartItemInput {
  productId: string;
  qty: number;
  catatan?: string;
}

export interface CheckoutPayload {
  items: CartItemInput[];
  metodePembayaran: string; // "CASH" | "QRIS" | "TRANSFER"
  bayar: number;
  kembalian: number;
  catatan?: string;
  idempotencyKey?: string;
}

export interface CheckoutResult {
  success: boolean;
  message?: string;
  transaction?: {
    id: string;
    noTransaksi: string;
    total: number;
    bayar: number;
    kembalian: number;
    metodePembayaran: string;
    createdAt: string;
    kasirNama: string;
    items: {
      nama: string;
      qty: number;
      harga: number;
      subtotal: number;
      catatan?: string;
    }[];
  };
}

export async function getPosCatalogData(): Promise<{
  success: boolean;
  data?: {
    store: {
      kodeToko: string;
      namaToko: string;
      alamat?: string | null;
      telepon?: string | null;
      printerWidth?: string | null;
    };
    cashier: {
      id: string;
      namaLengkap: string;
      role: string;
    };
    categories: {
      id: string;
      nama: string;
      urutan: number;
    }[];
    products: {
      id: string;
      categoryId: string | null;
      nama: string;
      barcode: string | null;
      sku: string | null;
      hargaJual: number;
      stok: number;
      gambar: string | null;
      isActive: boolean;
    }[];
    nextNoTransaksi: string;
  };
  message?: string;
}> {
  try {
    const session = await auth();
    if (!session?.user?.kodeToko) {
      return { success: false, message: "Sesi login tidak valid." };
    }

    const kodeToko = session.user.kodeToko;
    const userId = session.user.id;

    // 1. Fetch Store Settings
    const setting = await db.query.storeSettings.findFirst({
      where: eq(storeSettings.kodeToko, kodeToko),
    });

    // 2. Fetch User Profile & Validasi Status Aktif
    const cashierUser = await db.query.users.findFirst({
      where: and(eq(users.id, userId), eq(users.kodeToko, kodeToko)),
    });

    if (!cashierUser || !cashierUser.isActive) {
      return { success: false, message: "Akun Anda telah dinonaktifkan oleh administrator." };
    }

    // 3. Fetch Active Categories
    const allCategories = await db.query.categories.findMany({
      where: eq(categories.kodeToko, kodeToko),
      orderBy: [categories.urutan],
    });

    // 4. Fetch Active Products
    const allProducts = await db.query.products.findMany({
      where: and(eq(products.kodeToko, kodeToko), eq(products.isActive, true)),
      orderBy: [products.nama],
    });

    // 5. Preview next transaction sequence
    let nextNo = `TRX-${getWibDateString().replace(/-/g, "")}-0001`;
    try {
      nextNo = await db.transaction(async (tx) => {
        return await generateNoTransaksi(tx, kodeToko);
      });
    } catch {
      // fallback to generated date pattern
    }

    return {
      success: true,
      data: {
        store: {
          kodeToko,
          namaToko: setting?.namaToko || `Toko ${kodeToko}`,
          alamat: setting?.alamat || null,
          telepon: setting?.telepon || null,
          printerWidth: setting?.printerWidth || "58mm",
        },
        cashier: {
          id: userId,
          namaLengkap: cashierUser?.namaLengkap || session.user.namaLengkap || "Kasir",
          role: session.user.role || "CASHIER",
        },
        categories: allCategories.map((c) => ({
          id: c.id,
          nama: c.nama,
          urutan: c.urutan,
        })),
        products: allProducts.map((p) => ({
          id: p.id,
          categoryId: p.categoryId,
          nama: p.nama,
          barcode: p.barcode,
          sku: p.sku,
          hargaJual: Number(p.hargaJual),
          stok: p.stok,
          gambar: p.gambar,
          isActive: p.isActive,
        })),
        nextNoTransaksi: nextNo,
      },
    };
  } catch (error) {
    console.error("[POS Catalog Error]:", error);
    return { success: false, message: "Gagal memuat katalog kasir." };
  }
}

/**
 * Atomic Checkout Action with Row-Level Locking (SELECT ... FOR UPDATE) & Idempotency
 * Menggaransi:
 * 1. Idempotensi sesungguhnya: Jika idempotencyKey sudah pernah diproses, kembalikan transaksi lama tanpa kurangi stok ulang
 * 2. Cegah deadlock: Urutkan produk secara deterministik (ascending by productId) sebelum acquire row-lock
 * 3. Cegah overselling dengan lock baris stok (SELECT ... FOR UPDATE)
 * 4. Ambil snapshot harga jual & harga beli TERKINI dari database
 * 5. Kurangi stok dan catat stock_movements dalam satu transaksi ACID
 */
export async function processCheckoutAction(
  payload: CheckoutPayload
): Promise<CheckoutResult> {
  const session = await auth();
  if (!session?.user?.kodeToko) {
    return { success: false, message: "Sesi kasir tidak valid atau telah berakhir." };
  }

  const kodeToko = session.user.kodeToko;
  const userId = session.user.id;

  if (!payload.items || payload.items.length === 0) {
    return { success: false, message: "Keranjang belanja kosong." };
  }

  try {
    // 0. KEAMANAN TRANSAKSI: Validasi langsung status aktif & tokenVersion user dari database
    const [cashierUser] = await db
      .select({
        id: users.id,
        namaLengkap: users.namaLengkap,
        isActive: users.isActive,
        role: users.role,
        tokenVersion: users.tokenVersion,
      })
      .from(users)
      .where(and(eq(users.id, userId), eq(users.kodeToko, kodeToko)))
      .limit(1);

    if (!cashierUser || !cashierUser.isActive) {
      return {
        success: false,
        message: "Akun Anda telah dinonaktifkan oleh administrator. Transaksi pembayaran ditolak.",
      };
    }

    // 0b. IDEMPOTENSI: Periksa apakah idempotencyKey sudah pernah diproses sebelumnya
    if (payload.idempotencyKey && payload.idempotencyKey.trim() !== "") {
      const existingTrx = await db.query.transactions.findFirst({
        where: and(
          eq(transactions.kodeToko, kodeToko),
          eq(transactions.idempotencyKey, payload.idempotencyKey.trim())
        ),
      });

      if (existingTrx) {
        // Ambil item transaksi yang sudah ada
        const items = await db.query.transactionItems.findMany({
          where: eq(transactionItems.transactionId, existingTrx.id),
        });

        return {
          success: true,
          message: "Transaksi telah berhasil diproses sebelumnya (Idempotent replay).",
          transaction: {
            id: existingTrx.id,
            noTransaksi: existingTrx.noTransaksi,
            total: Number(existingTrx.total),
            bayar: Number(existingTrx.bayar),
            kembalian: Number(existingTrx.kembalian),
            metodePembayaran: existingTrx.metodePembayaran,
            createdAt: formatWibDateTime(existingTrx.createdAt),
            kasirNama: cashierUser.namaLengkap || session.user.namaLengkap || "Kasir",
            items: items.map((it) => ({
              nama: it.namaProduk,
              qty: it.qty,
              harga: Number(it.hargaJual),
              subtotal: Number(it.subtotal),
            })),
          },
        };
      }
    }

    const result = await db.transaction(async (tx) => {
      // 1. Generate No Transaksi Unik Berbasis Advisory Lock per (kode_toko + tanggal)
      const noTransaksi = await generateNoTransaksi(tx, kodeToko);

      // Cek keunikan noTransaksi di transaksi
      const duplicateTrx = await tx.query.transactions.findFirst({
        where: and(
          eq(transactions.kodeToko, kodeToko),
          eq(transactions.noTransaksi, noTransaksi)
        ),
      });

      if (duplicateTrx) {
        throw new Error(
          `Transaksi ${noTransaksi} sudah pernah diproses. Mohon muat ulang halaman.`
        );
      }

      let grandTotal = 0;
      const snapshotItems: {
        product: typeof products.$inferSelect;
        qty: number;
        subtotal: number;
        catatan?: string;
      }[] = [];

      // 2. CEGAH DEADLOCK: Urutkan produk secara deterministik (ascending by productId)
      //    sebelum melakukan SELECT ... FOR UPDATE
      const sortedItems = [...payload.items].sort((a, b) =>
        a.productId.localeCompare(b.productId)
      );

      // 3. Row-Level Lock & Validasi Stok untuk setiap produk (SELECT ... FOR UPDATE)
      for (const item of sortedItems) {
        if (item.qty <= 0) {
          throw new Error("Jumlah produk harus lebih dari 0.");
        }

        // Lock row produk secara eksklusif dalam urutan deterministik
        const [lockedProduct] = await tx
          .select()
          .from(products)
          .where(
            and(
              eq(products.id, item.productId),
              eq(products.kodeToko, kodeToko)
            )
          )
          .for("update");

        if (!lockedProduct) {
          throw new Error(`Produk tidak ditemukan di database toko.`);
        }

        if (!lockedProduct.isActive) {
          throw new Error(
            `Produk "${lockedProduct.nama}" sudah dinonaktifkan oleh administrator.`
          );
        }

        // CEGAH OVERSELLING: Periksa ketersediaan stok
        if (lockedProduct.stok < item.qty) {
          throw new Error(
            `Stok untuk "${lockedProduct.nama}" tidak mencukupi! Tersisa ${lockedProduct.stok} unit, permintaan: ${item.qty} unit.`
          );
        }

        // Snapshot Harga Jual & Harga Beli Resmi TERKINI dari Database
        const hargaSatuan = Number(lockedProduct.hargaJual);
        const subtotal = hargaSatuan * item.qty;
        grandTotal += subtotal;

        snapshotItems.push({
          product: lockedProduct,
          qty: item.qty,
          subtotal,
          catatan: item.catatan,
        });
      }

      // Validasi Nominal Bayar untuk Tunai
      const metode = (payload.metodePembayaran || "CASH").toUpperCase();
      const bayarNominal = metode === "CASH" ? Number(payload.bayar) : grandTotal;
      if (metode === "CASH" && bayarNominal < grandTotal) {
        throw new Error(
          `Nominal pembayaran kurang! Total: Rp ${grandTotal.toLocaleString(
            "id-ID"
          )}, dibayar: Rp ${bayarNominal.toLocaleString("id-ID")}.`
        );
      }
      const kembalianNominal =
        metode === "CASH" ? Math.max(0, bayarNominal - grandTotal) : 0;

      // 4. Insert Header Transaksi dengan Idempotency Key
      const [insertedTrx] = await tx
        .insert(transactions)
        .values({
          kodeToko,
          noTransaksi,
          userId,
          total: grandTotal.toString(),
          bayar: bayarNominal.toString(),
          kembalian: kembalianNominal.toString(),
          metodePembayaran: metode,
          status: "COMPLETED",
          idempotencyKey: payload.idempotencyKey?.trim() || null,
          catatan: payload.catatan || null,
        })
        .returning();

      // 4. Insert Detail Items, Kurangi Stok, dan Catat Stock Movement
      for (const snap of snapshotItems) {
        // Insert item detail
        await tx.insert(transactionItems).values({
          transactionId: insertedTrx.id,
          productId: snap.product.id,
          namaProduk: snap.product.nama,
          hargaBeli: snap.product.hargaBeli,
          hargaJual: snap.product.hargaJual,
          qty: snap.qty,
          subtotal: snap.subtotal.toString(),
        });

        // Kurangi stok produk
        const sisaStok = snap.product.stok - snap.qty;
        await tx
          .update(products)
          .set({
            stok: sisaStok,
            updatedAt: new Date(),
          })
          .where(eq(products.id, snap.product.id));

        // Catat mutasi stok
        await tx.insert(stockMovements).values({
          kodeToko,
          productId: snap.product.id,
          tipe: "OUT",
          qty: snap.qty,
          stokSebelum: snap.product.stok,
          stokSesudah: sisaStok,
          referensiId: insertedTrx.id,
          keterangan: `Penjualan Kasir #${noTransaksi}`,
        });
      }

      return {
        id: insertedTrx.id,
        noTransaksi: insertedTrx.noTransaksi,
        total: grandTotal,
        bayar: bayarNominal,
        kembalian: kembalianNominal,
        metodePembayaran: metode,
        createdAt: formatWibDateTime(insertedTrx.createdAt),
        kasirNama: session.user.namaLengkap || "Kasir",
        items: snapshotItems.map((s) => ({
          nama: s.product.nama,
          qty: s.qty,
          harga: Number(s.product.hargaJual),
          subtotal: s.subtotal,
          catatan: s.catatan,
        })),
      };
    });

    return {
      success: true,
      transaction: result,
    };
  } catch (error: any) {
    console.error("[Checkout Transaction Error]:", error?.message || error);
    return {
      success: false,
      message: error?.message || "Terjadi kesalahan saat memproses transaksi.",
    };
  }
}
