import { config } from "dotenv";
config({ path: ".env.local" });

import { db } from "./index";
import { users, categories, products, storeSettings } from "./schema";
import bcrypt from "bcryptjs";

export async function seed() {
  console.log("Seeding database...");

  const kodeToko = "DEMO01";

  // 1. Store Settings
  await db
    .insert(storeSettings)
    .values({
      kodeToko,
      namaToko: "BrightPOS Demo Store",
      alamat: "Jl. Sudirman No. 45, Jakarta Pusat",
      telepon: "0812-3456-7890",
      printerWidth: "58mm",
      themeColor: "primary",
    })
    .onConflictDoNothing();

  // 2. Users (Admin & Kasir)
  const adminPasswordHash = await bcrypt.hash("admin123", 10);
  const kasirPasswordHash = await bcrypt.hash("kasir123", 10);

  await db
    .insert(users)
    .values([
      {
        kodeToko,
        namaLengkap: "Administrator Demo",
        email: "admin@tokosaya.com",
        passwordHash: adminPasswordHash,
        role: "ADMIN",
        isActive: true,
      },
      {
        kodeToko,
        namaLengkap: "Kasir 01",
        email: "kasir@tokosaya.com",
        passwordHash: kasirPasswordHash,
        role: "CASHIER",
        isActive: true,
      },
    ])
    .onConflictDoNothing();

  // 3. Categories
  const [catMakanan, catMinuman, catSnack] = await db
    .insert(categories)
    .values([
      { kodeToko, nama: "Makanan", deskripsi: "Menu makanan utama", urutan: 1 },
      { kodeToko, nama: "Minuman", deskripsi: "Menu minuman dingin & hangat", urutan: 2 },
      { kodeToko, nama: "Snack", deskripsi: "Camilan & makanan ringan", urutan: 3 },
    ])
    .onConflictDoNothing()
    .returning();

  // 4. Sample Products
  if (catMakanan && catMinuman && catSnack) {
    await db
      .insert(products)
      .values([
        {
          kodeToko,
          categoryId: catMakanan.id,
          nama: "Nasi Goreng Spesial",
          barcode: "899001",
          sku: "FOOD-001",
          hargaBeli: "18000",
          hargaJual: "28000",
          stok: 45,
          stokMinimum: 10,
          gambar: "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?auto=format&fit=crop&w=600&q=80",
          isActive: true,
        },
        {
          kodeToko,
          categoryId: catMakanan.id,
          nama: "Mie Ayam Pangsit",
          barcode: "899002",
          sku: "FOOD-002",
          hargaBeli: "14000",
          hargaJual: "22000",
          stok: 30,
          stokMinimum: 5,
          gambar: "https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?auto=format&fit=crop&w=600&q=80",
          isActive: true,
        },
        {
          kodeToko,
          categoryId: catMinuman.id,
          nama: "Kopi Susu Gula Aren",
          barcode: "899003",
          sku: "BEV-001",
          hargaBeli: "8000",
          hargaJual: "18000",
          stok: 60,
          stokMinimum: 15,
          gambar: "https://images.unsplash.com/photo-1541167760496-1628856ab772?auto=format&fit=crop&w=600&q=80",
          isActive: true,
        },
        {
          kodeToko,
          categoryId: catMinuman.id,
          nama: "Es Teh Manis",
          barcode: "899004",
          sku: "BEV-002",
          hargaBeli: "2000",
          hargaJual: "6000",
          stok: 100,
          stokMinimum: 20,
          gambar: "https://images.unsplash.com/photo-1517701604599-bb29b565090c?auto=format&fit=crop&w=600&q=80",
          isActive: true,
        },
        {
          kodeToko,
          categoryId: catSnack.id,
          nama: "Kentang Goreng Crispy",
          barcode: "899005",
          sku: "SNK-001",
          hargaBeli: "9000",
          hargaJual: "16000",
          stok: 25,
          stokMinimum: 8,
          gambar: "https://images.unsplash.com/photo-1525351484163-7529414344d8?auto=format&fit=crop&w=600&q=80",
          isActive: true,
        },
      ])
      .onConflictDoNothing();
  }

  console.log("Database seeded successfully!");
}

if (require.main === module || process.argv[1]?.includes("seed")) {
  seed()
    .then(() => process.exit(0))
    .catch((err) => {
      console.error("Seed error:", err);
      process.exit(1);
    });
}
