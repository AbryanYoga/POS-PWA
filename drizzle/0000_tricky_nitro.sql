CREATE TYPE "public"."stock_movement_type" AS ENUM('SALE', 'IN', 'OUT', 'ADJUSTMENT');--> statement-breakpoint
CREATE TYPE "public"."transaction_status" AS ENUM('COMPLETED', 'VOID', 'PENDING');--> statement-breakpoint
CREATE TYPE "public"."user_role" AS ENUM('ADMIN', 'CASHIER');--> statement-breakpoint
CREATE TABLE "audit_logs" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"kode_toko" varchar(50) NOT NULL,
	"user_id" uuid,
	"aksi" varchar(100) NOT NULL,
	"detail" jsonb,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "categories" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"kode_toko" varchar(50) NOT NULL,
	"nama" varchar(100) NOT NULL,
	"deskripsi" text,
	"urutan" integer DEFAULT 0 NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "expenses" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"kode_toko" varchar(50) NOT NULL,
	"kategori" varchar(100) NOT NULL,
	"jumlah" numeric(12, 2) NOT NULL,
	"keterangan" text,
	"tanggal" timestamp with time zone NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "products" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"kode_toko" varchar(50) NOT NULL,
	"category_id" uuid,
	"nama" varchar(150) NOT NULL,
	"barcode" varchar(50),
	"sku" varchar(50),
	"harga_beli" numeric(12, 2) DEFAULT '0' NOT NULL,
	"harga_jual" numeric(12, 2) NOT NULL,
	"stok" integer DEFAULT 0 NOT NULL,
	"stok_minimum" integer DEFAULT 5 NOT NULL,
	"gambar" text,
	"is_active" boolean DEFAULT true NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "stock_movements" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"kode_toko" varchar(50) NOT NULL,
	"product_id" uuid NOT NULL,
	"tipe" "stock_movement_type" NOT NULL,
	"qty" integer NOT NULL,
	"stok_sebelum" integer NOT NULL,
	"stok_sesudah" integer NOT NULL,
	"referensi_id" uuid,
	"keterangan" text,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "store_settings" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"kode_toko" varchar(50) NOT NULL,
	"nama_toko" varchar(100) NOT NULL,
	"alamat" text,
	"telepon" varchar(30),
	"printer_width" varchar(10) DEFAULT '58mm' NOT NULL,
	"theme_color" varchar(30) DEFAULT 'primary' NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "store_settings_kode_toko_unique" UNIQUE("kode_toko")
);
--> statement-breakpoint
CREATE TABLE "transaction_items" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"transaction_id" uuid NOT NULL,
	"product_id" uuid,
	"nama_produk" varchar(150) NOT NULL,
	"harga_beli" numeric(12, 2) DEFAULT '0' NOT NULL,
	"harga_jual" numeric(12, 2) NOT NULL,
	"qty" integer NOT NULL,
	"subtotal" numeric(12, 2) NOT NULL
);
--> statement-breakpoint
CREATE TABLE "transactions" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"kode_toko" varchar(50) NOT NULL,
	"no_transaksi" varchar(50) NOT NULL,
	"user_id" uuid,
	"total" numeric(12, 2) NOT NULL,
	"bayar" numeric(12, 2) NOT NULL,
	"kembalian" numeric(12, 2) DEFAULT '0' NOT NULL,
	"metode_pembayaran" varchar(50) NOT NULL,
	"status" "transaction_status" DEFAULT 'COMPLETED' NOT NULL,
	"catatan" text,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "uq_transaksi_toko_no" UNIQUE("kode_toko","no_transaksi")
);
--> statement-breakpoint
CREATE TABLE "users" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"kode_toko" varchar(50) NOT NULL,
	"nama_lengkap" varchar(100) NOT NULL,
	"email" varchar(100) NOT NULL,
	"password_hash" text NOT NULL,
	"role" "user_role" DEFAULT 'CASHIER' NOT NULL,
	"is_active" boolean DEFAULT true NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
ALTER TABLE "audit_logs" ADD CONSTRAINT "audit_logs_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "products" ADD CONSTRAINT "products_category_id_categories_id_fk" FOREIGN KEY ("category_id") REFERENCES "public"."categories"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "stock_movements" ADD CONSTRAINT "stock_movements_product_id_products_id_fk" FOREIGN KEY ("product_id") REFERENCES "public"."products"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "transaction_items" ADD CONSTRAINT "transaction_items_transaction_id_transactions_id_fk" FOREIGN KEY ("transaction_id") REFERENCES "public"."transactions"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "transaction_items" ADD CONSTRAINT "transaction_items_product_id_products_id_fk" FOREIGN KEY ("product_id") REFERENCES "public"."products"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "transactions" ADD CONSTRAINT "transactions_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE restrict ON UPDATE no action;--> statement-breakpoint
CREATE INDEX "idx_audit_logs_kode_toko" ON "audit_logs" USING btree ("kode_toko");--> statement-breakpoint
CREATE INDEX "idx_audit_logs_created_at" ON "audit_logs" USING btree ("created_at");--> statement-breakpoint
CREATE INDEX "idx_categories_kode_toko" ON "categories" USING btree ("kode_toko");--> statement-breakpoint
CREATE UNIQUE INDEX "uq_categories_nama_kode_toko" ON "categories" USING btree ("nama","kode_toko");--> statement-breakpoint
CREATE INDEX "idx_expenses_kode_toko" ON "expenses" USING btree ("kode_toko");--> statement-breakpoint
CREATE INDEX "idx_expenses_tanggal" ON "expenses" USING btree ("tanggal");--> statement-breakpoint
CREATE INDEX "idx_products_kode_toko" ON "products" USING btree ("kode_toko");--> statement-breakpoint
CREATE INDEX "idx_products_category" ON "products" USING btree ("category_id");--> statement-breakpoint
CREATE UNIQUE INDEX "uq_products_barcode_kode_toko" ON "products" USING btree ("barcode","kode_toko");--> statement-breakpoint
CREATE INDEX "idx_stock_mov_kode_toko" ON "stock_movements" USING btree ("kode_toko");--> statement-breakpoint
CREATE INDEX "idx_stock_mov_product" ON "stock_movements" USING btree ("product_id");--> statement-breakpoint
CREATE INDEX "idx_stock_mov_created_at" ON "stock_movements" USING btree ("created_at");--> statement-breakpoint
CREATE UNIQUE INDEX "uq_store_settings_kode_toko" ON "store_settings" USING btree ("kode_toko");--> statement-breakpoint
CREATE INDEX "idx_trx_items_transaction" ON "transaction_items" USING btree ("transaction_id");--> statement-breakpoint
CREATE INDEX "idx_trx_items_product" ON "transaction_items" USING btree ("product_id");--> statement-breakpoint
CREATE INDEX "idx_transactions_kode_toko" ON "transactions" USING btree ("kode_toko");--> statement-breakpoint
CREATE INDEX "idx_transactions_user" ON "transactions" USING btree ("user_id");--> statement-breakpoint
CREATE INDEX "idx_transactions_created_at" ON "transactions" USING btree ("created_at");--> statement-breakpoint
CREATE INDEX "idx_users_kode_toko" ON "users" USING btree ("kode_toko");--> statement-breakpoint
CREATE UNIQUE INDEX "uq_users_email_kode_toko" ON "users" USING btree ("email","kode_toko");