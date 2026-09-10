
    // ==========================================================================
    // MULTI-LANGUAGE TRANSLATION DICTIONARY (i18n - Bahasa Indonesia & English)
    // ==========================================================================
    const TRANSLATIONS = {
      id: {
        // Brand & Sidebar
        brand_title: 'BrightPOS',
        brand_sub: 'Sistem Manajemen Toko',
        sidebar_toggle_title: 'Kecilkan / Perbesar Menu',
        group_main: 'Main Menu',
        nav_overview: 'Overview',
        nav_orders: 'Orders / Transaksi',
        nav_categories: 'Kategori Produk',
        group_inventory: 'Inventory',
        nav_products: 'Katalog Produk',
        group_report: 'Report & Analytics',
        nav_reporting: 'Laporan Penjualan',
        nav_analytics: 'Analytics & Insights',
        group_settings: 'Settings',
        nav_users: 'User Management',
        nav_settings: 'Settings / Pengaturan',
        btn_logout_title: 'Keluar dari Sistem',

        // Topbar
        search_placeholder: 'Cari menu, transaksi, atau kasir...',
        btn_export_title: 'Export Laporan',
        btn_export: 'Export',
        btn_notif_title: 'Notifikasi Toko',
        btn_notification: 'Notification',
        btn_lang_toggle_title: 'Ganti Bahasa / Switch Language',

        // Tab 1: Overview
        welcome_greeting: 'Selamat Datang di',
        dash_overview_sub: 'Ringkasan komprehensif performa dan kesehatan toko Anda',
        total_income: 'Total Income',
        total_expense: 'Total Expense',
        net_profit: 'Net Profit',
        total_orders: 'Total Orders',
        this_week: 'minggu ini',
        daily_orders: 'Daily Orders',
        track_order_volume: 'Track order volume trends',
        auto_update: 'Auto Update',
        loading_chart: 'Memuat grafik penjualan harian...',
        top_selling_title: 'Top Selling Products',
        top_selling_sub: 'Kategori paling diminati',
        no_cat_sales: 'Belum ada data penjualan kategori.',
        item_unit: 'item',
        recent_trx_title: 'Recent Transactions',
        recent_trx_sub: 'Aktivitas penjualan langsung',
        loading_trx: 'Memuat transaksi...',
        no_today_trx: 'Belum ada transaksi hari ini.',
        active_staff: 'Staff',
        currently_on_duty: 'Sedang bertugas',
        total_items: 'Items',
        across_categories: 'Di semua kategori',
        payment_methods_title: 'Payment Methods',
        how_customers_pay: 'Cara pelanggan membayar',
        low_stock_title: 'Low Stock Alert',
        restock_soon: 'Perlu segera restock',
        safe_stock: 'Semua persediaan stok dalam batas aman.',
        left_unit: 'tersisa',
        status_success: 'Sukses',

        // Tab 2: Orders / Riwayat
        orders_title: 'Riwayat Transaksi Penjualan',
        orders_subtitle: 'Daftar seluruh transaksi yang tercatat dari kasir secara realtime',
        btn_refresh: 'Muat Ulang',
        col_trx_id: 'ID TRANSAKSI',
        col_date_time: 'TANGGAL & WAKTU',
        col_cashier: 'KASIR',
        col_total: 'TOTAL',
        col_method: 'METODE',
        col_status: 'STATUS',
        status_completed: 'SELESAI',
        no_transactions: 'Belum ada transaksi.',
        loading_riwayat: 'Memuat riwayat transaksi...',

        // Tab 3: Produk
        products_title: 'Katalog & Stok Produk',
        products_subtitle: 'Kelola menu, harga jual, status aktif di kasir, dan persediaan barang',
        btn_add_menu: 'Tambah Menu Baru',
        col_id: 'ID',
        col_prod_title: 'Nama Menu / Produk',
        col_category: 'Kategori',
        col_cost_price: 'Harga Modal',
        col_sell_price: 'Harga Jual',
        col_stock: 'Stok',
        col_barcode: 'SKU / Barcode',
        col_pos_status: 'Status Kasir',
        col_action: 'Aksi',
        loading_products: 'Memuat katalog produk...',
        no_products_hint: 'Belum ada produk. Klik "Tambah Menu Baru" untuk mulai.',
        status_active: 'Aktif',
        status_inactive: 'Nonaktif',
        btn_edit: 'Edit',
        btn_delete: 'Hapus',
        unit_label: 'unit',

        // Tab 4: Kategori
        categories_title: 'Kategori Menu & Produk',
        categories_subtitle: 'Kelompokkan menu agar rapi di kasir (Makanan, Minuman, Snack, dsb)',
        btn_add_category: 'Tambah Kategori',
        col_cat_id: 'ID Kategori',
        col_cat_name: 'Nama Kategori',
        loading_categories: 'Memuat kategori...',
        no_categories: 'Belum ada kategori.',

        // Tab 5: Laporan Penjualan
        report_title: 'Laporan Penjualan & Omset',
        report_subtitle: 'Analisis transaksi berdasarkan rentang tanggal dan metode pembayaran',
        label_start_date: 'Dari Tanggal',
        label_end_date: 'Sampai Tanggal',
        label_payment_method: 'Metode Pembayaran',
        opt_all_methods: 'Semua Metode',
        opt_cash: 'Tunai (Cash)',
        opt_qris: 'Non-Cash (QRIS)',
        btn_filter_data: 'Filter Data',
        btn_export_csv: 'Export CSV',
        col_total_rev: 'Total Omset',
        col_paid: 'Bayar',
        col_change: 'Kembalian',
        report_prompt_filter: 'Tentukan tanggal dan klik "Filter Data".',
        report_no_data: 'Tidak ada transaksi pada periode ini.',
        loading_report: 'Memfilter laporan...',

        // Tab 6: Kasir / User Management
        cashiers_title: 'Kelola Kasir & Tim',
        cashiers_subtitle: 'Tambah atau kelola akun kasir untuk toko ini',
        btn_add_cashier: 'Tambah Kasir',
        new_cashier_header: 'Data Kasir Baru',
        label_fullname: 'Nama Lengkap *',
        placeholder_fullname: 'Contoh: Budi Santoso',
        label_email: 'Alamat Email *',
        placeholder_email: 'kasir@toko.com',
        label_password: 'Kata Sandi *',
        placeholder_password: 'Min. 6 karakter',
        label_store_code: 'Kode Toko',
        btn_cancel: 'Batal',
        btn_save_cashier: 'Simpan Kasir',
        col_fullname: 'Nama Lengkap',
        col_email: 'Email',
        col_store_code: 'Kode Toko',
        col_role: 'Role',
        loading_cashiers: 'Memuat data kasir...',
        no_cashiers: 'Belum ada data kasir.',
        btn_edit_reset: 'Edit / Reset',
        saving_cashier: 'Menyimpan...',

        // Tab 7: Analytics & Insights
        analytics_title: 'Business Analytics & Insights',
        analytics_subtitle: 'Analisis performa mendalam, kesehatan finansial, dan rekomendasi strategis usaha Anda',
        period_all: 'Semua Waktu',
        period_month: '30 Hari Terakhir',
        period_7days: '7 Hari Terakhir',
        period_today: 'Hari Ini',
        health_score_title: 'Skor Kesehatan Bisnis',
        health_status_optimal: 'Kondisi operasional dan profitabilitas toko berada pada tren positif.',
        health_status_fair: 'Terdapat potensi perbaikan pada perputaran stok dan optimalisasi biaya modal.',
        health_status_critical: 'Perlu tindakan cepat untuk mengatasi margin rendah dan stok produk lambat laku.',
        gross_margin_title: 'Profit Margin %',
        net_profit_label: 'Laba Bersih',
        aov_title: 'Average Order Value (AOV)',
        total_orders_label: 'total transaksi',
        peak_velocity_title: 'Jam Puncak (Peak Hour)',
        orders_in_peak: 'order di jam ini',
        basket_depth_title: 'Kedalaman Keranjang',
        items_per_receipt: 'item / struk transaksi',
        total_items_sold: 'total item',
        plus_title: 'Kekuatan & Keunggulan Usaha (Plus)',
        minus_title: 'Kekurangan & Titik Kritis Risiko (Minus)',
        loading_plus: 'Memuat kekuatan bisnis...',
        loading_minus: 'Memuat kekurangan bisnis...',
        no_plus_data: 'Belum ada data kekuatan untuk periode ini.',
        no_minus_data: 'Semua metrik operasional berada dalam batas prima.',
        recommendations_title: 'Rekomendasi Strategis Usaha',
        recommendations_subtitle: 'Langkah aksi praktis untuk memaksimalkan omset dan mencegah kebocoran modal',
        loading_rec: 'Memuat rekomendasi strategis...',
        no_rec_data: 'Pertahankan strategi saat ini!',
        prio_urgent: 'Mendesak',
        prio_high: 'Tinggi',
        prio_medium: 'Sedang',
        prio_low: 'Rendah',
        hourly_chart_title: 'Distribusi Penjualan 24 Jam',
        hourly_chart_subtitle: 'Kerapatan transaksi berdasarkan jam operasional gerai',
        product_matrix_title: 'Matriks Kinerja Produk (BCG Matrix)',
        product_matrix_subtitle: 'Klasifikasi produk berdasarkan volume penjualan, kontribusi laba, dan status stok',
        col_prod_name: 'Nama Produk',
        col_prod_cat: 'Kategori',
        col_prod_sold: 'Terjual (Qty)',
        col_prod_rev: 'Total Omset',
        col_prod_margin: 'Margin %',
        col_prod_stock: 'Sisa Stok',
        col_prod_matrix: 'Status Matriks',
        loading_matrix: 'Memuat matriks produk...',
        no_matrix_data: 'Belum ada data matriks produk.',

        // Tab 8: Settings
        settings_title: 'Pengaturan Toko & Tampilan',
        settings_subtitle: 'Kustomisasi identitas toko, tema warna tampilan dashboard, dan preferensi bahasa',
        store_profile_title: 'Identitas & Nama Tampilan',
        store_profile_desc: 'Atur nama toko dan nama admin yang tampil di seluruh sistem',
        label_store_name: 'Nama Toko / Outlet *',
        placeholder_store_name: 'Contoh: Cafe & Resto',
        label_admin_name: 'Nama Admin / Tampilan Akun *',
        placeholder_admin_name: 'Contoh: Admin Toko',
        label_outlet_code: 'Kode Toko (Unik)',
        btn_save_settings: 'Simpan Perubahan Tampilan',
        lang_settings_title: 'Pilihan Bahasa (Language)',
        lang_settings_desc: 'Pilih bahasa pengantar antarmuka dashboard',
        lang_note_title: 'Sinkronisasi Otomatis',
        lang_note_desc: 'Seluruh menu navigasi, metrik analitik, grafik, tabel riwayat, dan laporan akan langsung berubah saat bahasa dipilih.',
        theme_settings_title: 'Warna Tema Tampilan (Theme Customizer)',
        theme_settings_desc: 'Sesuaikan palet warna visual dashboard sesuai identitas brand usaha Anda',

        // Modals
        modal_prod_title_add: 'Tambah Menu Baru',
        modal_prod_sub_add: 'Tambahkan menu baru ke Toko / Kafe Anda',
        modal_prod_title_edit: 'Edit Menu',
        modal_prod_sub_edit: 'Ubah data menu',
        card_name_desc: 'Nama & Deskripsi',
        label_menu_name: 'Nama Menu *',
        placeholder_menu_name: 'Contoh: Matcha Latte',
        label_menu_desc: 'Deskripsi Menu',
        placeholder_menu_desc: 'Deskripsi rasa, bahan racikan, atau catatan penyajian menu...',
        card_menu_image: 'Foto Menu',
        label_prod_img_url: 'URL Gambar / Foto Produk',
        upload_local_photo: 'Upload Foto dari Perangkat (Lokal)',
        upload_photo_hint: 'Klik di sini untuk memilih file gambar (PNG, JPG, WebP)',
        card_category: 'Kategori',
        label_menu_category: 'Kategori Menu *',
        select_category: '-- Pilih Kategori --',
        label_menu_subcategory: 'Sub-Kategori / Tag Menu',
        placeholder_subcategory: 'Contoh: Coffee / Signature / Ice',
        card_manage_stock: 'Kelola Stok',
        label_sku_barcode: 'SKU / Barcode Produk',
        placeholder_sku: 'Contoh: CFFE-MM-01-A9',
        label_menu_stock: 'Stok Menu *',
        label_min_stock_alert: 'Batas Minimal Peringatan Stok',
        card_menu_pricing: 'Penetapan Harga',
        label_cost_price: 'Harga Modal (HPP) *',
        label_sell_price: 'Harga Jual *',
        btn_save_menu: 'Simpan Menu',

        modal_cat_title_add: 'Tambah Kategori Baru',
        label_cat_name: 'Nama Kategori *',
        placeholder_cat_name: 'Contoh: Makanan Berat',
        btn_save_category: 'Simpan Kategori',

        modal_edit_kasir_title: 'Edit Akun Kasir',
        modal_edit_kasir_sub: 'Perbarui profil kasir atau atur kata sandi baru',
        placeholder_edit_kasir_nama: 'Nama lengkap kasir',
        label_new_password_optional: 'Kata Sandi Baru (Opsional)',
        placeholder_new_password: 'Kosongkan jika tidak ingin mengganti sandi',
        password_encryption_hint: 'Kata sandi tersimpan aman menggunakan enkripsi SHA-256. Isi minimal 6 karakter hanya jika ingin mereset kata sandi kasir.',
        btn_save_changes: 'Simpan Perubahan',

        modal_confirm_title_default: 'Konfirmasi Tindakan',
        modal_confirm_desc_default: 'Apakah Anda yakin ingin melanjutkan tindakan ini?',
        modal_confirm_btn_yes: 'Ya, Lanjutkan',
        modal_confirm_del_prod_title: 'Hapus Menu Produk?',
        modal_confirm_del_prod_desc: 'Apakah Anda yakin ingin menghapus "{name}" secara permanen dari katalog produk?',
        modal_confirm_del_prod_warn: 'Menu ini memiliki riwayat transaksi penjualan. Disarankan untuk menonaktifkan status di kasir saja agar laporan penjualan lama tidak kehilangan referensi.',
        modal_confirm_del_prod_btn: 'Ya, Hapus Menu',
        modal_confirm_del_cat_title: 'Hapus Kategori?',
        modal_confirm_del_cat_desc: 'Apakah Anda yakin ingin menghapus kategori "{name}"?',
        modal_confirm_del_cat_btn: 'Ya, Hapus Kategori',
        modal_confirm_del_kasir_title: 'Hapus Akun Kasir?',
        modal_confirm_del_kasir_desc: 'Apakah Anda yakin ingin menghapus akun kasir "{name}"? Akun ini tidak akan dapat login lagi.',
        modal_confirm_del_kasir_btn: 'Ya, Hapus Kasir',
        modal_confirm_logout_title: 'Keluar dari Administrator?',
        modal_confirm_logout_desc: 'Sesi login Anda akan diakhiri dan dialihkan kembali ke halaman login.',
        modal_confirm_logout_btn: 'Ya, Keluar',

        // Toasts & Loading Messages
        loading_process: 'Memproses data...',
        loading_dashboard: 'Memuat metrik dashboard...',
        loading_analytics: 'Memproses analitik & wawasan bisnis...',
        loading_saving_menu: 'Menyimpan menu...',
        loading_saving_cat: 'Menyimpan kategori...',
        loading_saving_kasir: 'Mendaftarkan kasir baru...',
        loading_updating_kasir: 'Memperbarui data kasir...',
        loading_deleting_prod: 'Menghapus produk...',
        loading_deleting_cat: 'Menghapus kategori...',
        loading_deleting_kasir: 'Menghapus akun kasir...',
        loading_saving_settings: 'Menyimpan preferensi toko & profil...',
        loading_logout: 'Keluar...',
        toast_lang_switched: 'Bahasa diubah ke Bahasa Indonesia',
        toast_theme_updated: 'Tema tampilan berhasil diubah!',
        toast_session_expired: 'Sesi login Anda telah berakhir. Mengalihkan ke login...',
        toast_photo_loaded: 'Foto berhasil dimuat!',
        toast_fill_required: 'Semua field wajib diisi.',
        toast_pass_min: 'Kata sandi minimal 6 karakter.',
        toast_server_error: 'Kesalahan server: '
      },
      en: {
        // Brand & Sidebar
        brand_title: 'BrightPOS',
        brand_sub: 'Store Management System',
        sidebar_toggle_title: 'Collapse / Expand Menu',
        group_main: 'Main Menu',
        nav_overview: 'Overview',
        nav_orders: 'Orders / Transactions',
        nav_categories: 'Categories',
        group_inventory: 'Inventory',
        nav_products: 'Products Catalog',
        group_report: 'Report & Analytics',
        nav_reporting: 'Reporting',
        nav_analytics: 'Analytics & Insights',
        group_settings: 'Settings',
        nav_users: 'User Management',
        nav_settings: 'Settings',
        btn_logout_title: 'Logout from System',

        // Topbar
        search_placeholder: 'Search menu, transactions, or cashier...',
        btn_export_title: 'Export Report',
        btn_export: 'Export',
        btn_notif_title: 'Store Notifications',
        btn_notification: 'Notification',
        btn_lang_toggle_title: 'Switch Language',

        // Tab 1: Overview
        welcome_greeting: 'Welcome to',
        dash_overview_sub: 'Clear overview of your store performance and business health',
        total_income: 'Total Income',
        total_expense: 'Total Expense',
        net_profit: 'Net Profit',
        total_orders: 'Total Orders',
        this_week: 'this week',
        daily_orders: 'Daily Orders',
        track_order_volume: 'Track order volume trends',
        auto_update: 'Auto Update',
        loading_chart: 'Loading daily sales chart...',
        top_selling_title: 'Top Selling Products',
        top_selling_sub: 'Most popular customer categories',
        no_cat_sales: 'No category sales data yet.',
        item_unit: 'items',
        recent_trx_title: 'Recent Transactions',
        recent_trx_sub: 'Live direct sales activity',
        loading_trx: 'Loading transactions...',
        no_today_trx: 'No transactions recorded today.',
        active_staff: 'Staff',
        currently_on_duty: 'Currently on duty',
        total_items: 'Items',
        across_categories: 'Across all categories',
        payment_methods_title: 'Payment Methods',
        how_customers_pay: 'How customers pay',
        low_stock_title: 'Low Stock Alert',
        restock_soon: 'Need immediate restock',
        safe_stock: 'All stock levels are currently safe.',
        left_unit: 'left',
        status_success: 'Success',

        // Tab 2: Orders / Transactions
        orders_title: 'Sales Transaction History',
        orders_subtitle: 'Complete list of all realtime recorded transactions from cashiers',
        btn_refresh: 'Refresh',
        col_trx_id: 'TRANSACTION ID',
        col_date_time: 'DATE & TIME',
        col_cashier: 'CASHIER',
        col_total: 'TOTAL',
        col_method: 'METHOD',
        col_status: 'STATUS',
        status_completed: 'COMPLETED',
        no_transactions: 'No transactions recorded yet.',
        loading_riwayat: 'Loading transaction history...',

        // Tab 3: Products
        products_title: 'Product Catalog & Stock',
        products_subtitle: 'Manage menu items, selling price, cashier status, and stock inventory',
        btn_add_menu: 'Add New Menu',
        col_id: 'ID',
        col_prod_title: 'Product Name',
        col_category: 'Category',
        col_cost_price: 'Cost Price',
        col_sell_price: 'Selling Price',
        col_stock: 'Stock',
        col_barcode: 'SKU / Barcode',
        col_pos_status: 'POS Status',
        col_action: 'Action',
        loading_products: 'Loading product catalog...',
        no_products_hint: 'No products yet. Click "Add New Menu" to start.',
        status_active: 'Active',
        status_inactive: 'Inactive',
        btn_edit: 'Edit',
        btn_delete: 'Delete',
        unit_label: 'units',

        // Tab 4: Categories
        categories_title: 'Product Categories',
        categories_subtitle: 'Group items logically for easy checkout (Food, Drinks, Snacks, etc.)',
        btn_add_category: 'Add Category',
        col_cat_id: 'Category ID',
        col_cat_name: 'Category Name',
        loading_categories: 'Loading categories...',
        no_categories: 'No categories yet.',

        // Tab 5: Sales Report
        report_title: 'Sales & Revenue Report',
        report_subtitle: 'Analyze transactions by date range and payment method',
        label_start_date: 'Start Date',
        label_end_date: 'End Date',
        label_payment_method: 'Payment Method',
        opt_all_methods: 'All Methods',
        opt_cash: 'Cash',
        opt_qris: 'QRIS',
        btn_filter_data: 'Filter Data',
        btn_export_csv: 'Export CSV',
        col_total_rev: 'Total Revenue',
        col_paid: 'Paid',
        col_change: 'Change',
        report_prompt_filter: 'Select dates and click "Filter Data".',
        report_no_data: 'No transactions found for this period.',
        loading_report: 'Filtering report data...',

        // Tab 6: Cashiers / User Management
        cashiers_title: 'Cashier & Staff Management',
        cashiers_subtitle: 'Add or manage cashier accounts for this store',
        btn_add_cashier: 'Add Cashier',
        new_cashier_header: 'New Cashier Data',
        label_fullname: 'Full Name *',
        placeholder_fullname: 'e.g. John Doe',
        label_email: 'Email Address *',
        placeholder_email: 'cashier@store.com',
        label_password: 'Password *',
        placeholder_password: 'Min. 6 characters',
        label_store_code: 'Outlet Code',
        btn_cancel: 'Cancel',
        btn_save_cashier: 'Save Cashier',
        col_fullname: 'Full Name',
        col_email: 'Email',
        col_store_code: 'Outlet Code',
        col_role: 'Role',
        loading_cashiers: 'Loading cashier accounts...',
        no_cashiers: 'No cashier accounts yet.',
        btn_edit_reset: 'Edit / Reset',
        saving_cashier: 'Saving...',

        // Tab 7: Analytics & Insights
        analytics_title: 'Business Analytics & Insights',
        analytics_subtitle: 'In-depth performance analysis, financial health, and strategic business recommendations',
        period_all: 'All Time',
        period_month: 'Last 30 Days',
        period_7days: 'Last 7 Days',
        period_today: 'Today',
        health_score_title: 'Business Health Score',
        health_status_optimal: 'Operations, profit margins, and sales velocity are performing at optimal levels.',
        health_status_fair: 'Operational bottlenecks and slow-moving items need attention.',
        health_status_critical: 'Critical inventory and margin issues detected. Immediate action recommended.',
        gross_margin_title: 'Profit Margin %',
        net_profit_label: 'Net Profit',
        aov_title: 'Average Order Value (AOV)',
        total_orders_label: 'total orders',
        peak_velocity_title: 'Peak Sales Hour',
        orders_in_peak: 'orders during this hour',
        basket_depth_title: 'Basket Depth',
        items_per_receipt: 'items / receipt',
        total_items_sold: 'total items',
        plus_title: 'Business Strengths & Advantages (Plus)',
        minus_title: 'Weaknesses & Critical Risks (Minus)',
        loading_plus: 'Loading business strengths...',
        loading_minus: 'Loading business weaknesses...',
        no_plus_data: 'No strength data yet for this period.',
        no_minus_data: 'All operational metrics are optimal with no critical risks.',
        recommendations_title: 'Strategic Action Plan',
        recommendations_subtitle: 'Practical action steps to maximize revenue and prevent profit leakages',
        loading_rec: 'Loading recommendations...',
        no_rec_data: 'Maintain current strategy!',
        prio_urgent: 'Urgent',
        prio_high: 'High',
        prio_medium: 'Medium',
        prio_low: 'Low',
        hourly_chart_title: '24-Hour Sales Distribution',
        hourly_chart_subtitle: 'Transaction density based on operational store hours',
        product_matrix_title: 'Product Performance Matrix (BCG Matrix)',
        product_matrix_subtitle: 'Product classification by sales volume, profit contribution, and inventory status',
        col_prod_name: 'Product Name',
        col_prod_cat: 'Category',
        col_prod_sold: 'Sold (Qty)',
        col_prod_rev: 'Total Revenue',
        col_prod_margin: 'Margin %',
        col_prod_stock: 'Stock Left',
        col_prod_matrix: 'Matrix Status',
        loading_matrix: 'Loading product matrix...',
        no_matrix_data: 'No product matrix data available.',

        // Tab 8: Settings
        settings_title: 'Store Settings & Customizer',
        settings_subtitle: 'Customize store identity, dashboard theme color palette, and language preferences',
        store_profile_title: 'Identity & Display Name',
        store_profile_desc: 'Set store name and admin display name shown across the system',
        label_store_name: 'Store / Outlet Name *',
        placeholder_store_name: 'e.g. Cafe & Bakery',
        label_admin_name: 'Admin Display Name *',
        placeholder_admin_name: 'e.g. Store Admin',
        label_outlet_code: 'Outlet Code (Unique)',
        btn_save_settings: 'Save Display Changes',
        lang_settings_title: 'Language Selection',
        lang_settings_desc: 'Choose your preferred dashboard language interface',
        lang_note_title: 'Instant Sync',
        lang_note_desc: 'All navigation menus, analytic metrics, charts, transaction tables, and reports will adapt immediately when language is selected.',
        theme_settings_title: 'Theme Color Customizer',
        theme_settings_desc: 'Customize dashboard color palette to match your brand identity',

        // Modals
        modal_prod_title_add: 'Add New Menu',
        modal_prod_sub_add: 'Add new menu to your Cafe / Store',
        modal_prod_title_edit: 'Edit Menu',
        modal_prod_sub_edit: 'Update menu details for',
        card_name_desc: 'Name & Description',
        label_menu_name: 'Menu Name *',
        placeholder_menu_name: 'e.g. Matcha Latte',
        label_menu_desc: 'Menu Description',
        placeholder_menu_desc: 'Flavor profile, ingredients, or serving notes...',
        card_menu_image: 'Menu Image',
        label_prod_img_url: 'Image URL / Product Photo',
        upload_local_photo: 'Upload Photo from Device (Local)',
        upload_photo_hint: 'Click here to choose an image file (PNG, JPG, WebP)',
        card_category: 'Category',
        label_menu_category: 'Menu Category *',
        select_category: '-- Select Category --',
        label_menu_subcategory: 'Menu Sub-Category / Tag',
        placeholder_subcategory: 'e.g. Coffee / Signature / Ice',
        card_manage_stock: 'Manage Stock',
        label_sku_barcode: 'Stock Keeping Item (SKU / Barcode)',
        placeholder_sku: 'e.g. CFFE-MM-01-A9',
        label_menu_stock: 'Menu Stock *',
        label_min_stock_alert: 'Minimum Stock Alert',
        card_menu_pricing: 'Menu Pricing',
        label_cost_price: 'Cost Price (COGS) *',
        label_sell_price: 'Selling Price *',
        btn_save_menu: 'Save Menu',

        modal_cat_title_add: 'Add New Category',
        label_cat_name: 'Category Name *',
        placeholder_cat_name: 'e.g. Main Course',
        btn_save_category: 'Save Category',

        modal_edit_kasir_title: 'Edit Cashier Account',
        modal_edit_kasir_sub: 'Update cashier profile or set a new password',
        placeholder_edit_kasir_nama: 'Cashier full name',
        label_new_password_optional: 'New Password (Optional)',
        placeholder_new_password: 'Leave blank to keep current password',
        password_encryption_hint: 'Password is securely stored with SHA-256 encryption. Fill minimum 6 characters only if resetting password.',
        btn_save_changes: 'Save Changes',

        modal_confirm_title_default: 'Confirm Action',
        modal_confirm_desc_default: 'Are you sure you want to proceed with this action?',
        modal_confirm_btn_yes: 'Yes, Proceed',
        modal_confirm_del_prod_title: 'Delete Product Menu?',
        modal_confirm_del_prod_desc: 'Are you sure you want to permanently delete "{name}" from the product catalog?',
        modal_confirm_del_prod_warn: 'This menu has past sales transactions. Disabling status in POS is recommended to preserve historical sales records.',
        modal_confirm_del_prod_btn: 'Yes, Delete Menu',
        modal_confirm_del_cat_title: 'Delete Category?',
        modal_confirm_del_cat_desc: 'Are you sure you want to delete category "{name}"?',
        modal_confirm_del_cat_btn: 'Yes, Delete Category',
        modal_confirm_del_kasir_title: 'Delete Cashier Account?',
        modal_confirm_del_kasir_desc: 'Are you sure you want to delete cashier "{name}"? This account will no longer be able to log in.',
        modal_confirm_del_kasir_btn: 'Yes, Delete Cashier',
        modal_confirm_logout_title: 'Log out from Administrator?',
        modal_confirm_logout_desc: 'Your active session will be ended and you will be redirected to the login page.',
        modal_confirm_logout_btn: 'Yes, Logout',

        // Toasts & Loading Messages
        loading_process: 'Processing data...',
        loading_dashboard: 'Loading dashboard metrics...',
        loading_analytics: 'Processing business analytics & insights...',
        loading_saving_menu: 'Saving menu...',
        loading_saving_cat: 'Saving category...',
        loading_saving_kasir: 'Registering new cashier...',
        loading_updating_kasir: 'Updating cashier details...',
        loading_deleting_prod: 'Deleting product...',
        loading_deleting_cat: 'Deleting category...',
        loading_deleting_kasir: 'Deleting cashier account...',
        loading_saving_settings: 'Saving store preferences & profile...',
        loading_logout: 'Logging out...',
        toast_lang_switched: 'Language switched to English',
        toast_theme_updated: 'Theme updated!',
        toast_session_expired: 'Your login session has expired. Redirecting to login...',
        toast_photo_loaded: 'Photo loaded successfully!',
        toast_fill_required: 'All required fields must be filled.',
        toast_pass_min: 'Password must be at least 6 characters.',
        toast_server_error: 'Server error: '
      }
    };

    // Helper translation accessor
    function t(key, defaultVal = '') {
      const dict = TRANSLATIONS[currentLang] || TRANSLATIONS.id;
      return dict[key] || defaultVal || key;
    }

    // Token Bootstrapping (Multi-Tier)
    const _serverToken = '<?= initialToken ?>';
    const _localToken = localStorage.getItem('pos_token') || '';
    const _sessionToken = sessionStorage.getItem('pos_token') || '';
    let authToken = (_serverToken && _serverToken.trim() !== '') ? _serverToken : (_localToken || _sessionToken);

    if (authToken) {
      localStorage.setItem('pos_token', authToken);
      sessionStorage.setItem('pos_token', authToken);
    }

    let categoryList = [];
    let productList = [];
    let activeKodeToko = '';
    let currentConfirmCallback = null;
    let currentUserData = null;
    let currentLang = localStorage.getItem('pos_lang') || 'id';
    let currentTheme = localStorage.getItem('pos_theme') || 'pine';
    let currentAnalyticsPeriod = 'all';
    let _cachedDashboardData = null;
    let _cachedAnalyticsData = null;

    /**
     * Sanitasi string untuk mencegah Stored Cross-Site Scripting (XSS)
     */
    function escapeHtml(str) {
      if (str === null || str === undefined) return '';
      return String(str)
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;')
        .replace(/'/g, '&#039;');
    }

    document.addEventListener('DOMContentLoaded', () => {
      checkAuth();
      applyTheme(currentTheme);
      applyLanguage(currentLang);
      initDateDisplays();
      setupTabs();
      setupEventListeners();
      loadDashboard();
    });

    function checkAuth() {
      if (!authToken) {
        redirectToLogin();
        return;
      }
      const exp = localStorage.getItem('pos_session_expiry');
      if (exp && new Date(exp).getTime() < Date.now()) {
        showToast(t('toast_session_expired'), 'warning');
        setTimeout(() => redirectToLogin(), 1500);
      }
    }

    function redirectToLogin() {
      window.top.location.href = '<?= getScriptUrl() ?>?page=login';
    }

    function initDateDisplays() {
      const now = new Date();
      const locale = (currentLang === 'en') ? 'en-US' : 'id-ID';
      const options = { day: 'numeric', month: 'long', year: 'numeric' };
      const dateStr = now.toLocaleDateString(locale, options);
      const topDate = document.getElementById('topbarLiveDate');
      if (topDate) topDate.textContent = dateStr;

      const year = now.getFullYear();
      const month = String(now.getMonth() + 1).padStart(2, '0');
      const day = String(now.getDate()).padStart(2, '0');
      const todayIso = `${year}-${month}-${day}`;

      const m1 = document.getElementById('lapTanggalMulai');
      const m2 = document.getElementById('lapTanggalAkhir');
      if (m1 && !m1.value) m1.value = todayIso;
      if (m2 && !m2.value) m2.value = todayIso;
    }

    // ==========================================================================
    // LANGUAGE & THEME ENGINES
    // ==========================================================================
    function applyLanguage(lang) {
      currentLang = (lang === 'en') ? 'en' : 'id';
      localStorage.setItem('pos_lang', currentLang);
      const dict = TRANSLATIONS[currentLang] || TRANSLATIONS.id;

      // Translate text nodes
      document.querySelectorAll('[data-i18n]').forEach(el => {
        const key = el.getAttribute('data-i18n');
        if (!dict[key]) return;
        // Special case: sync-note-title has an SVG + span child — only update the span
        if (el.classList.contains('sync-note-title')) {
          const spanEl = el.querySelector('span');
          if (spanEl) spanEl.textContent = dict[key];
        } else {
          el.textContent = dict[key];
        }
      });

      // Translate placeholders
      document.querySelectorAll('[data-i18n-placeholder]').forEach(el => {
        const key = el.getAttribute('data-i18n-placeholder');
        if (dict[key]) el.setAttribute('placeholder', dict[key]);
      });

      // Translate titles & tooltips
      document.querySelectorAll('[data-i18n-title]').forEach(el => {
        const key = el.getAttribute('data-i18n-title');
        if (dict[key]) el.setAttribute('title', dict[key]);
      });
      document.querySelectorAll('[data-i18n-tooltip]').forEach(el => {
        const key = el.getAttribute('data-i18n-tooltip');
        if (dict[key]) el.setAttribute('data-tooltip', dict[key]);
      });

      // Quick Lang Toggle in Topbar
      const qBadge = document.getElementById('quickLangBadge');
      if (qBadge) qBadge.textContent = currentLang.toUpperCase();

      // Active state in Settings
      document.querySelectorAll('.lang-card-pill').forEach(pill => {
        if (pill.getAttribute('data-lang') === currentLang) {
          pill.classList.add('active');
        } else {
          pill.classList.remove('active');
        }
      });

      initDateDisplays();

      // Refresh greeting if user loaded
      if (currentUserData) {
        const storeTitle = currentUserData.namaToko || 'BrightPOS';
        const prefix = t('welcome_greeting');
        const greetingEl = document.getElementById('dashGreetingTitle');
        if (greetingEl) greetingEl.textContent = `${prefix} ${storeTitle}`;
      }

      // Re-render UI components to reflect new language
      if (typeof renderDailyOrdersChart === 'function') {
        renderDailyOrdersChart();
      }
      if (productList && productList.length > 0) {
        renderProdukTable();
      }
      if (categoryList && categoryList.length > 0) {
        renderKategoriTable();
      }
      if (_cachedDashboardData) {
        if (_cachedDashboardData.topCategories) renderTopSelling(_cachedDashboardData.topCategories);
        if (_cachedDashboardData.recentTransactions) renderRecentTransactions(_cachedDashboardData.recentTransactions);
        if (_cachedDashboardData.lowStockProducts) renderLowStock(_cachedDashboardData.lowStockProducts);
        if (_cachedDashboardData.activeStaff) renderStaffTable(_cachedDashboardData.activeStaff);
      }
      if (_cachedAnalyticsData) {
        renderAnalytics(_cachedAnalyticsData);
      }
    }

    function setLanguage(lang) {
      applyLanguage(lang);
      showToast(t('toast_lang_switched'), 'info');
    }

    function toggleQuickLang() {
      const nextLang = (currentLang === 'id') ? 'en' : 'id';
      setLanguage(nextLang);
    }

    function applyTheme(themeKey) {
      currentTheme = themeKey || 'pine';
      document.body.setAttribute('data-theme', currentTheme);
      localStorage.setItem('pos_theme', currentTheme);

      document.querySelectorAll('.theme-swatch-card').forEach(card => {
        if (card.getAttribute('data-theme') === currentTheme) {
          card.classList.add('active');
        } else {
          card.classList.remove('active');
        }
      });

      // Update soft chart to active theme palette immediately
      if (typeof renderDailyOrdersChart === 'function') {
        renderDailyOrdersChart();
      }
    }

    function setTheme(themeKey) {
      applyTheme(themeKey);
      showToast(t('toast_theme_updated'), 'info');
    }

    function formatRupiah(num) {
      return 'Rp ' + Number(num || 0).toLocaleString('id-ID');
    }

    function showToast(msg, type = 'info') {
      const c = document.getElementById('toastContainer');
      if (!c) return;
      const el = document.createElement('div');
      el.className = `toast ${type}`;
      el.textContent = msg;
      c.appendChild(el);
      setTimeout(() => el.remove(), 3500);
    }

    function showLoading(show, message = null) {
      const el = document.getElementById('loadingOverlay');
      if (!el) return;
      document.getElementById('loadingText').textContent = message || t('loading_process');
      if (show) el.classList.add('active');
      else el.classList.remove('active');
    }

    // Custom Confirmation Dialog Helper (Replaces native browser confirm)
    function showConfirmModal(options) {
      const modal = document.getElementById('modalConfirmDialog');
      const title = document.getElementById('confirmDialogTitle');
      const desc = document.getElementById('confirmDialogDesc');
      const warning = document.getElementById('confirmDialogWarning');
      const acceptBtn = document.getElementById('btnAcceptConfirm');
      const cancelBtn = document.getElementById('btnCancelConfirm');
      const iconWrap = document.getElementById('confirmIconWrap');

      title.textContent = options.title || t('modal_confirm_title_default');
      desc.textContent = options.message || t('modal_confirm_desc_default');

      if (cancelBtn) cancelBtn.textContent = t('btn_cancel');

      if (options.warning && options.warning.trim() !== '') {
        const warningTextEl = document.getElementById('confirmDialogWarningText');
        if (warningTextEl) warningTextEl.textContent = options.warning;
        warning.style.display = 'flex';
      } else {
        warning.style.display = 'none';
      }

      acceptBtn.textContent = options.confirmText || t('modal_confirm_btn_yes');
      if (options.isDanger !== false) {
        acceptBtn.className = 'btn-danger-solid';
        iconWrap.className = 'confirm-icon-pill danger';
      } else {
        acceptBtn.className = 'btn-primary';
        iconWrap.className = 'confirm-icon-pill info';
      }

      currentConfirmCallback = options.onConfirm;
      modal.classList.add('active');
    }

    function closeConfirmModal() {
      const modal = document.getElementById('modalConfirmDialog');
      if (modal) modal.classList.remove('active');
      currentConfirmCallback = null;
    }

    // Sidebar tab navigation
    function setupTabs() {
      const navButtons = document.querySelectorAll('.nav-item-btn[data-tab]');
      navButtons.forEach(btn => {
        btn.addEventListener('click', () => {
          navButtons.forEach(b => b.classList.remove('active'));
          document.querySelectorAll('.tab-pane').forEach(p => p.classList.remove('active'));

          btn.classList.add('active');
          const targetId = btn.dataset.tab;
          const targetPane = document.getElementById(targetId);
          if (targetPane) targetPane.classList.add('active');

          if (targetId === 'tabDashboard') loadDashboard();
          else if (targetId === 'tabRiwayat') loadRiwayatTrx();
          else if (targetId === 'tabProduk') loadProduk();
          else if (targetId === 'tabKategori') loadKategori();
          else if (targetId === 'tabLaporan') loadLaporan();
          else if (targetId === 'tabAnalytics') loadAnalytics(currentAnalyticsPeriod);
          else if (targetId === 'tabPengaturan') loadSettingsTab();
          else if (targetId === 'tabKasirStaff') loadStaff();
        });
      });
    }

    function loadStaff() {
      loadDashboard();
    }

    // ==========================================================================
    // 1. DASHBOARD LOAD & RENDER
    // ==========================================================================
    function loadDashboard() {
      showLoading(true, t('loading_dashboard'));
      google.script.run
        .withSuccessHandler(res => {
          showLoading(false);
          if (res && res.success) {
            const d = res.data;
            _cachedDashboardData = d;

            // User & Store Info
            if (d.user) {
              currentUserData = d.user;
              const storeTitle = d.user.namaToko || 'BrightPOS';
              document.getElementById('navStoreName').textContent = storeTitle;
              const prefix = t('welcome_greeting');
              document.getElementById('dashGreetingTitle').textContent = `${prefix} ${storeTitle}`;
              activeKodeToko = d.user.kodeToko || 'DEMO01';
              document.getElementById('dashKodeTokoBadge').textContent = `Outlet: ${activeKodeToko}`;

              const userName = d.user.namaLengkap || d.user.email || 'Admin';
              document.getElementById('userProfileName').textContent = userName;
              document.getElementById('userProfileEmail').textContent = d.user.email || '';
              const initials = userName.substring(0, 2).toUpperCase();
              document.getElementById('userAvatarText').textContent = initials;
            }

            // 4 Top KPI Cards
            const m = d.metrics || {};
            document.getElementById('dashTotalIncome').textContent = formatRupiah(m.totalIncome || m.totalPenjualanHariIni || 0);
            
            const expEl = document.getElementById('dashTotalExpense');
            const profEl = document.getElementById('dashNetProfit');
            expEl.textContent = formatRupiah(m.totalExpense || 0);
            profEl.textContent = formatRupiah(m.netProfit || 0);
            if (m.isEstimatedHpp) {
              const hppTip = currentLang === 'en' ? 'Calculation based on estimated COGS margin' : 'Perhitungan berdasarkan estimasi margin HPP';
              expEl.title = hppTip;
              profEl.title = hppTip;
            }

            const totalOrdersCount = m.totalOrders || m.totalTransaksiHariIni || 0;
            document.getElementById('dashTotalOrders').textContent = totalOrdersCount;

            // Render Daily Orders Trend Chart
            renderDailyOrdersChart(d.dailyTrend, totalOrdersCount);

            // Right KPI stats
            document.getElementById('dashActiveStaffText').textContent = `${m.activeStaffCount || 1} ${t('active_staff')}`;
            document.getElementById('dashTotalItemsText').textContent = `${m.totalProduk || 0} ${t('total_items')}`;

            // Payment Breakdown (QRIS vs Cash)
            const p = d.paymentBreakdown || {};
            const qCount = p.countQris || p.countNonCash || 0;
            const cCount = p.countCash || 0;
            document.getElementById('dashQrisCountBadge').textContent = qCount;
            document.getElementById('dashCashCountBadge').textContent = cCount;

            const maxCount = Math.max(qCount, cCount, 1);
            document.getElementById('dashQrisBarVisual').style.height = `${Math.round((qCount / maxCount) * 80) + 15}%`;
            document.getElementById('dashCashBarVisual').style.height = `${Math.round((cCount / maxCount) * 80) + 15}%`;

            // Top Selling Categories
            renderTopSelling(d.topCategories);

            // Recent Transactions List
            renderRecentTransactions(d.recentTransactions);

            // Low Stock Alert List
            renderLowStock(d.lowStockProducts);

            // Staff Table in User Management
            renderStaffTable(d.activeStaff);

          } else {
            showToast(res.message || 'Gagal memuat data dashboard.', 'error');
            if (res.message && res.message.includes('Sesi')) redirectToLogin();
          }
        })
        .withFailureHandler(err => {
          showLoading(false);
          showToast(t('toast_server_error') + err.message, 'error');
        })
        .getDashboardData(authToken);
    }

    // Cached chart data for instant re-rendering on theme/language switch
    let _cachedDailyTrend = [];
    let _cachedTodayOrders = 0;

    function renderDailyOrdersChart(dailyTrend, todayCount) {
      const container = document.getElementById('dashboardDailyChartBox');
      if (!container) return;

      if (dailyTrend && Array.isArray(dailyTrend)) _cachedDailyTrend = dailyTrend;
      if (todayCount !== undefined && todayCount !== null) _cachedTodayOrders = todayCount;

      const dayNamesID = ['Sen', 'Sel', 'Rab', 'Kam', 'Jum', 'Sab', 'Min'];
      const dayNamesEN = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
      const dayNames = currentLang === 'en' ? dayNamesEN : dayNamesID;

      const defaultDays = dayNames.map((name, i) => ({
        label: name,
        count: [4, 8, 6, 12, 18, 24, _cachedTodayOrders || 15][i],
        total: 100000 * (i + 1)
      }));

      let data = (_cachedDailyTrend && _cachedDailyTrend.length >= 7) ? _cachedDailyTrend : defaultDays;
      
      // Translate day labels if standard
      data = data.map((d, i) => {
        let label = d.label || '';
        const dayIdx = dayNamesID.indexOf(label);
        if (dayIdx !== -1) {
          label = dayNames[dayIdx];
        } else {
          const enIdx = dayNamesEN.indexOf(label);
          if (enIdx !== -1) label = dayNames[enIdx];
        }
        return { ...d, label };
      });

      const counts = data.map(d => Number(d.count) || 0);
      const maxCount = Math.max(10, Math.ceil(Math.max(...counts, _cachedTodayOrders || 0) * 1.3));

      const svgWidth = 600;
      const svgHeight = 185;
      const padLeft = 44;
      const padRight = 32;
      const padTop = 32;
      const padBottom = 38;
      const plotWidth = svgWidth - padLeft - padRight;
      const plotHeight = svgHeight - padTop - padBottom;

      const points = data.map((d, i) => {
        const x = padLeft + (i * (plotWidth / (data.length - 1)));
        const val = Number(d.count) || 0;
        const y = (padTop + plotHeight) - ((val / maxCount) * plotHeight);
        return { x, y, val, label: d.label || '', dateStr: d.dateStr || '', total: d.total || 0 };
      });

      // Smooth Cubic Bezier Spline
      function getSmoothSpline(pts) {
        if (!pts || pts.length === 0) return '';
        let d = `M ${pts[0].x.toFixed(1)} ${pts[0].y.toFixed(1)}`;
        for (let i = 0; i < pts.length - 1; i++) {
          const p0 = pts[i === 0 ? i : i - 1];
          const p1 = pts[i];
          const p2 = pts[i + 1];
          const p3 = pts[i + 2 < pts.length ? i + 2 : i + 1];

          const cp1x = p1.x + (p2.x - p0.x) / 5.5;
          const cp1y = p1.y + (p2.y - p0.y) / 5.5;
          const cp2x = p2.x - (p3.x - p1.x) / 5.5;
          const cp2y = p2.y - (p3.y - p1.y) / 5.5;

          d += ` C ${cp1x.toFixed(1)} ${cp1y.toFixed(1)}, ${cp2x.toFixed(1)} ${cp2y.toFixed(1)}, ${p2.x.toFixed(1)} ${p2.y.toFixed(1)}`;
        }
        return d;
      }

      const linePath = getSmoothSpline(points);
      const areaBottomY = padTop + plotHeight;
      const areaPath = `${linePath} L ${points[points.length - 1].x.toFixed(1)} ${areaBottomY} L ${points[0].x.toFixed(1)} ${areaBottomY} Z`;

      // 4 Soft Horizontal Gridlines
      const yTiers = [
        { val: maxCount, y: padTop },
        { val: Math.round(maxCount * 0.66), y: padTop + (plotHeight * 0.34) },
        { val: Math.round(maxCount * 0.33), y: padTop + (plotHeight * 0.67) },
        { val: 0, y: areaBottomY }
      ];

      let gridlinesHtml = '';
      yTiers.forEach(t => {
        gridlinesHtml += `
          <text x="${padLeft - 10}" y="${(t.y + 3.5).toFixed(1)}" font-family="var(--font-mono)" font-size="9.5" fill="var(--text-muted)" text-anchor="end" opacity="0.75">${t.val}</text>
        `;
      });

      // X Day labels & Point Markers
      let xLabelsHtml = '';
      let pointsHtml = '';
      const lastIdx = points.length - 1;

      points.forEach((pt, idx) => {
        const isToday = (idx === lastIdx);
        const dayName = pt.label || '';
        const textWeight = isToday ? '700' : '500';
        const textColor = isToday ? 'var(--primary)' : 'var(--text-muted)';

        xLabelsHtml += `
          <text x="${pt.x.toFixed(1)}" y="${svgHeight - 12}" font-family="var(--font-body)" font-size="11" font-weight="${textWeight}" fill="${textColor}" text-anchor="middle">${dayName}</text>
        `;

        if (isToday) {
          const displayCount = (pt.val > 0) ? pt.val : (_cachedTodayOrders || 0);
          const tipText = `${displayCount} ${currentLang === 'en' ? 'Orders' : 'Pesanan'}`;
          const tipW = 82;
          const tipH = 28;
          const tipX = Math.min(Math.max(pt.x - (tipW / 2), padLeft), svgWidth - padRight - tipW);
          const tipY = Math.max(4, pt.y - tipH - 10);

          pointsHtml += `
            <circle cx="${pt.x.toFixed(1)}" cy="${pt.y.toFixed(1)}" r="10" fill="var(--primary)" fill-opacity="0.18" class="chart-pulse-ring" />
            <circle cx="${pt.x.toFixed(1)}" cy="${pt.y.toFixed(1)}" r="5" fill="var(--primary)" stroke="var(--bg-surface)" stroke-width="2.5" />
            <g class="chart-active-tooltip">
              <rect x="${tipX}" y="${tipY}" width="${tipW}" height="${tipH}" rx="6" fill="var(--bg-surface)" stroke="var(--border)" stroke-width="1" filter="drop-shadow(0 2px 6px rgba(0,0,0,0.08))" />
              <text x="${tipX + (tipW / 2)}" y="${tipY + 12}" font-family="var(--font-body)" font-size="8.5" font-weight="600" fill="var(--text-muted)" text-anchor="middle">${currentLang === 'en' ? 'Today' : 'Hari Ini'}</text>
              <text x="${tipX + (tipW / 2)}" y="${tipY + 23}" font-family="var(--font-mono)" font-size="10" font-weight="700" fill="var(--primary)" text-anchor="middle">${tipText}</text>
            </g>
          `;
        } else {
          pointsHtml += `
            <circle class="chart-dot-point" cx="${pt.x.toFixed(1)}" cy="${pt.y.toFixed(1)}" r="3" fill="var(--primary)" stroke="var(--bg-surface)" stroke-width="1.5" opacity="0.8" />
          `;
        }
      });

      container.innerHTML = `
        <svg viewBox="0 0 ${svgWidth} ${svgHeight}" width="100%" height="100%" xmlns="http://www.w3.org/2000/svg" preserveAspectRatio="none">
          <defs>
            <linearGradient id="softChartGradient" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stop-color="var(--primary)" stop-opacity="0.22" />
              <stop offset="55%" stop-color="var(--primary)" stop-opacity="0.06" />
              <stop offset="100%" stop-color="var(--primary)" stop-opacity="0.0" />
            </linearGradient>
            <filter id="softChartGlow" x="-10%" y="-10%" width="120%" height="140%">
              <feDropShadow dx="0" dy="3" stdDeviation="3.5" flood-color="var(--primary)" flood-opacity="0.18" />
            </filter>
          </defs>
          ${gridlinesHtml}
          <path class="chart-area-fill" d="${areaPath}" fill="url(#softChartGradient)" />
          <path class="chart-line-spline" d="${linePath}" fill="none" stroke="var(--primary)" stroke-width="2.75" stroke-linecap="round" stroke-linejoin="round" filter="url(#softChartGlow)" />
          ${pointsHtml}
          ${xLabelsHtml}
        </svg>
      `;
    }

    function renderTopSelling(categories) {
      const container = document.getElementById('topSellingContainer');
      if (!container) return;

      if (!categories || categories.length === 0) {
        container.innerHTML = `<div style="text-align: center; color: var(--text-muted); font-size: 12px; padding: 20px 0;">${t('no_cat_sales')}</div>`;
        return;
      }

      container.innerHTML = '';
      const styles = ['pine', 'orange', 'teal'];
      const max = Math.max(...categories.map(c => c.count), 1);

      categories.slice(0, 4).forEach((cat, idx) => {
        const theme = styles[idx % styles.length];
        const pct = Math.min(100, Math.round((cat.count / max) * 95));
        const row = document.createElement('div');
        row.className = 'selling-bar-row';
        row.innerHTML = `
          <div class="selling-bar-label">
            <span>${escapeHtml(cat.name)}</span>
            <span class="selling-bar-badge ${theme}">${Number(cat.count) || 0} ${t('item_unit')}</span>
          </div>
          <div class="selling-bar-track">
            <div class="selling-bar-fill ${theme}" style="width: ${pct}%;"></div>
          </div>
        `;
        container.appendChild(row);
      });
    }

    function renderRecentTransactions(list) {
      const container = document.getElementById('dashRecentTrxList');
      if (!container) return;

      if (!list || list.length === 0) {
        container.innerHTML = `<div style="text-align: center; color: var(--text-muted); font-size: 12px; padding: 20px 0;">${t('no_today_trx')}</div>`;
        return;
      }

      container.innerHTML = '';
      list.slice(0, 5).forEach(tx => {
        const item = document.createElement('div');
        item.className = 'recent-trx-item';
        item.innerHTML = `
          <div class="recent-trx-info">
            <div class="trx-name">${escapeHtml(tx.id)}</div>
            <div class="trx-meta">${escapeHtml(tx.kasir)} • ${escapeHtml(tx.metode)}</div>
          </div>
          <div class="recent-trx-amount">
            <div class="trx-price">${formatRupiah(tx.total)}</div>
            <div class="trx-status-pill">${t('status_success')}</div>
          </div>
        `;
        container.appendChild(item);
      });
    }

    function renderLowStock(list) {
      const container = document.getElementById('dashLowStockList');
      if (!container) return;

      if (!list || list.length === 0) {
        container.innerHTML = `<div style="text-align: center; color: var(--text-muted); font-size: 12px; padding: 10px 0;">${t('safe_stock')}</div>`;
        return;
      }

      container.innerHTML = '';
      list.slice(0, 5).forEach(it => {
        const row = document.createElement('div');
        row.className = 'low-stock-item';
        row.innerHTML = `
          <span class="low-stock-name">${escapeHtml(it.nama)}</span>
          <span class="low-stock-qty">${Number(it.stok) || 0} ${t('left_unit')}</span>
        `;
        container.appendChild(row);
      });
    }

    function renderStaffTable(staffList) {
      const tbody = document.getElementById('staffTableBody');
      if (!tbody) return;

      if (!staffList || staffList.length === 0) {
        tbody.innerHTML = `<tr><td colspan="7" style="text-align: center;">${t('no_cashiers')}</td></tr>`;
        return;
      }

      tbody.innerHTML = '';
      staffList.forEach(s => {
        const isAdmin = s.role && s.role.toLowerCase() === 'admin';
        const tr = document.createElement('tr');
        const activeText = currentLang === 'en' ? '● Active' : '● Aktif';
        tr.innerHTML = `
          <td><code>${escapeHtml(s.id)}</code></td>
          <td><strong>${escapeHtml(s.nama)}</strong></td>
          <td>${escapeHtml(s.email)}</td>
          <td><code style="font-size:11px; background: var(--bg-muted); padding: 2px 6px; border-radius: 4px;">${escapeHtml(s.kodeToko || activeKodeToko || '—')}</code></td>
          <td><span style="text-transform: uppercase; font-weight: 700; color: ${isAdmin ? 'var(--secondary)' : 'var(--primary)'}; font-size: 11px;">${escapeHtml(s.role)}</span></td>
          <td><span style="color: var(--primary); font-weight: 600;">${activeText}</span></td>
          <td>${isAdmin ? '<span style="color:var(--text-subtle);font-size:11px;">—</span>' : `
            <div style="display:flex; gap:6px; align-items:center;">
              <button class="btn-action-sm secondary btn-edit-kasir" data-id="${escapeHtml(s.id)}" title="${t('btn_edit_reset')}">${t('btn_edit_reset')}</button>
              <button class="btn-action-sm danger btn-del-kasir" data-id="${escapeHtml(s.id)}" data-nama="${escapeHtml(s.nama)}" title="${t('btn_delete')}">${t('btn_delete')}</button>
            </div>
          `}</td>
        `;
        if (!isAdmin) {
          tr.querySelector('.btn-edit-kasir').addEventListener('click', () => openEditKasirModal(s));
          tr.querySelector('.btn-del-kasir').addEventListener('click', () => hapusKasir(s.id, s.nama));
        }
        tbody.appendChild(tr);
      });
    }

    function openEditKasirModal(s) {
      document.getElementById('editKasirId').value = s.id;
      document.getElementById('editKasirNama').value = s.nama;
      document.getElementById('editKasirEmail').value = s.email;
      document.getElementById('editKasirPass').value = '';
      document.getElementById('editKasirKodeToko').value = s.kodeToko || activeKodeToko || '';
      document.getElementById('modalEditKasir').classList.add('active');
    }

    function hapusKasir(id, nama) {
      const msg = t('modal_confirm_del_kasir_desc').replace('{name}', escapeHtml(nama));
      showConfirmModal({
        title: t('modal_confirm_del_kasir_title'),
        message: msg,
        confirmText: t('modal_confirm_del_kasir_btn'),
        isDanger: true,
        onConfirm: () => {
          showLoading(true, t('loading_deleting_kasir'));
          google.script.run
            .withSuccessHandler(res => {
              showLoading(false);
              if (res && res.success) {
                showToast(res.message || 'Kasir berhasil dihapus.', 'success');
                loadDashboard();
              } else {
                showToast(res.message || 'Gagal menghapus kasir.', 'error');
              }
            })
            .withFailureHandler(err => {
              showLoading(false);
              showToast(t('toast_server_error') + err.message, 'error');
            })
            .hapusKasir(authToken, id);
        }
      });
    }

    // ==========================================================================
    // 2. RIWAYAT TRANSAKSI (Orders)
    // ==========================================================================
    function loadRiwayatTrx() {
      showLoading(true, t('loading_riwayat'));
      google.script.run
        .withSuccessHandler(res => {
          showLoading(false);
          const tbody = document.getElementById('riwayatTableBody');
          if (res && res.success && res.data && res.data.recentTransactions) {
            const list = res.data.recentTransactions;
            if (list.length === 0) {
              tbody.innerHTML = `<tr><td colspan="6" style="text-align: center;">${t('no_transactions')}</td></tr>`;
              return;
            }
            tbody.innerHTML = '';
            list.forEach(tx => {
              const tr = document.createElement('tr');
              tr.innerHTML = `
                <td><code>${escapeHtml(tx.id)}</code></td>
                <td>${escapeHtml(tx.tanggal)}</td>
                <td>${escapeHtml(tx.kasir)}</td>
                <td style="font-family: var(--font-mono); font-weight: 700; color: var(--primary);">${formatRupiah(tx.total)}</td>
                <td>${escapeHtml(tx.metode)}</td>
                <td><span style="font-size: 11px; font-weight: 700; color: var(--primary); background: var(--primary-light); padding: 2px 8px; border-radius: 4px;">${t('status_completed')}</span></td>
              `;
              tbody.appendChild(tr);
            });
          }
        })
        .withFailureHandler(err => {
          showLoading(false);
          showToast(t('toast_server_error') + err.message, 'error');
        })
        .getDashboardData(authToken);
    }

    // ==========================================================================
    // 3. KELOLA PRODUK (Katalog & Status Toggle)
    // ==========================================================================
    function loadProduk() {
      showLoading(true, t('loading_products'));
      google.script.run
        .withSuccessHandler(res => {
          showLoading(false);
          if (res && res.success) {
            productList = res.data || [];
            if (res.categories) categoryList = res.categories;
            renderProdukTable();
            populateKategoriSelect();
          } else {
            showToast(res.message || 'Gagal memuat produk.', 'error');
          }
        })
        .withFailureHandler(err => {
          showLoading(false);
          showToast(t('toast_server_error') + err.message, 'error');
        })
        .getProdukList(authToken);
    }

    function renderProdukTable() {
      const tbody = document.getElementById('produkTableBody');
      tbody.innerHTML = '';
      if (!productList || productList.length === 0) {
        tbody.innerHTML = `<tr><td colspan="9" style="text-align: center;">${t('no_products_hint')}</td></tr>`;
        return;
      }

      productList.forEach(p => {
        const tr = document.createElement('tr');
        const isInactive = (p.status === 'Nonaktif');
        if (isInactive) tr.classList.add('product-inactive');

        const stockBadge = p.stok <= 5 ? 'color: var(--danger); font-weight: 700;' : 'font-weight: 600;';
        const activeLabel = isInactive ? t('status_inactive') : t('status_active');

        tr.innerHTML = `
          <td><code>${escapeHtml(p.id)}</code></td>
          <td><strong>${escapeHtml(p.nama)}</strong></td>
          <td>${escapeHtml(p.namaKategori)}</td>
          <td style="font-family: var(--font-mono);">${formatRupiah(p.hargaBeli)}</td>
          <td style="font-family: var(--font-mono); font-weight: 700; color: var(--primary);">${formatRupiah(p.hargaJual)}</td>
          <td style="font-family: var(--font-mono); ${stockBadge}">${Number(p.stok) || 0} ${t('unit_label')}</td>
          <td>${escapeHtml(p.barcode || '-')}</td>
          <td>
            <div class="status-toggle-wrapper">
              <label class="switch-toggle" title="${currentLang === 'en' ? 'Click to toggle active status in POS' : 'Klik untuk mengaktifkan / menonaktifkan produk di kasir'}">
                <input type="checkbox" class="toggle-status-input" data-id="${escapeHtml(p.id)}" ${!isInactive ? 'checked' : ''}>
                <span class="slider-toggle"></span>
              </label>
              <span class="status-label-badge ${!isInactive ? 'active' : 'inactive'}" id="statusLabel_${escapeHtml(p.id)}">
                ${activeLabel}
              </span>
            </div>
          </td>
          <td>
            <button class="btn-action-sm btn-edit-p" data-id="${escapeHtml(p.id)}">${t('btn_edit')}</button>
            <button class="btn-action-sm danger btn-del-p" data-id="${escapeHtml(p.id)}">${t('btn_delete')}</button>
          </td>
        `;

        // Event Toggle Status (Optimistic UI Update)
        const toggleInput = tr.querySelector('.toggle-status-input');
        toggleInput.addEventListener('change', () => {
          const willBeActive = toggleInput.checked;
          const newStatusStr = willBeActive ? 'Aktif' : 'Nonaktif';
          const labelEl = document.getElementById(`statusLabel_${p.id}`);

          p.status = newStatusStr;
          if (willBeActive) {
            tr.classList.remove('product-inactive');
            if (labelEl) { labelEl.className = 'status-label-badge active'; labelEl.textContent = t('status_active'); }
          } else {
            tr.classList.add('product-inactive');
            if (labelEl) { labelEl.className = 'status-label-badge inactive'; labelEl.textContent = t('status_inactive'); }
          }

          google.script.run
            .withSuccessHandler(res => {
              if (res && res.success) showToast(res.message, 'success');
              else {
                showToast(res.message || 'Gagal mengubah status.', 'error');
                toggleInput.checked = !willBeActive;
                p.status = !willBeActive ? 'Aktif' : 'Nonaktif';
                if (!willBeActive) { tr.classList.remove('product-inactive'); if (labelEl) { labelEl.className = 'status-label-badge active'; labelEl.textContent = t('status_active'); } }
                else { tr.classList.add('product-inactive'); if (labelEl) { labelEl.className = 'status-label-badge inactive'; labelEl.textContent = t('status_inactive'); } }
              }
            })
            .toggleStatusProduk(authToken, p.id);
        });

        tr.querySelector('.btn-edit-p').addEventListener('click', () => editProduk(p));
        tr.querySelector('.btn-del-p').addEventListener('click', () => deleteProduk(p.id, p.nama, p.hasTransaksi));
        tbody.appendChild(tr);
      });
    }

    function populateKategoriSelect() {
      const sel = document.getElementById('prodKategoriId');
      if (!sel) return;
      sel.innerHTML = `<option value="">${t('select_category')}</option>`;
      categoryList.forEach(k => {
        const opt = document.createElement('option');
        opt.value = k.id;
        opt.textContent = k.nama;
        sel.appendChild(opt);
      });
    }

    function editProduk(p) {
      document.getElementById('modalProdukTitle').textContent = t('modal_prod_title_edit');
      document.getElementById('modalProdukSub').textContent = `${t('modal_prod_sub_edit')} "${escapeHtml(p.nama)}"`;
      document.getElementById('prodId').value = p.id;
      document.getElementById('prodNama').value = p.nama;
      document.getElementById('prodDesc').value = p.deskripsi || '';
      document.getElementById('prodKategoriId').value = p.kategoriId;
      document.getElementById('prodSubCategory').value = p.subKategori || '';
      document.getElementById('prodHargaBeli').value = p.hargaBeli;
      document.getElementById('prodHargaJual').value = p.hargaJual;
      document.getElementById('prodStok').value = p.stok;
      document.getElementById('prodMinStok').value = p.minStok || 5;
      document.getElementById('prodBarcode').value = p.barcode || '';
      document.getElementById('prodGambar').value = p.gambar || '';

      const thumb = document.getElementById('imgPreviewThumb');
      if (p.gambar && (p.gambar.startsWith('http') || p.gambar.startsWith('data:image'))) {
        thumb.src = p.gambar;
        thumb.classList.add('show');
      } else {
        thumb.classList.remove('show');
      }

      document.getElementById('modalProduk').classList.add('active');
    }

    function deleteProduk(id, name, hasTransaksi) {
      let warningText = hasTransaksi ? t('modal_confirm_del_prod_warn') : '';
      const msg = t('modal_confirm_del_prod_desc').replace('{name}', escapeHtml(name));

      showConfirmModal({
        title: t('modal_confirm_del_prod_title'),
        message: msg,
        warning: warningText,
        confirmText: t('modal_confirm_del_prod_btn'),
        isDanger: true,
        onConfirm: () => {
          showLoading(true, t('loading_deleting_prod'));
          google.script.run
            .withSuccessHandler(res => {
              showLoading(false);
              if (res && res.success) {
                showToast(res.message, 'success');
                loadProduk();
              } else {
                showToast(res.message || 'Gagal menghapus produk.', 'error');
              }
            })
            .withFailureHandler(err => {
              showLoading(false);
              showToast(t('toast_server_error') + err.message, 'error');
            })
            .deleteProduk(authToken, id);
        }
      });
    }

    // ==========================================================================
    // 4. KATEGORI CRUD
    // ==========================================================================
    function loadKategori() {
      showLoading(true, t('loading_categories'));
      google.script.run
        .withSuccessHandler(res => {
          showLoading(false);
          if (res && res.success) {
            categoryList = res.data || [];
            renderKategoriTable();
            populateKategoriSelect();
          } else {
            showToast(res.message || 'Gagal memuat kategori.', 'error');
          }
        })
        .withFailureHandler(err => {
          showLoading(false);
          showToast(t('toast_server_error') + err.message, 'error');
        })
        .getKategoriList(authToken);
    }

    function renderKategoriTable() {
      const tbody = document.getElementById('kategoriTableBody');
      tbody.innerHTML = '';
      if (!categoryList || categoryList.length === 0) {
        tbody.innerHTML = `<tr><td colspan="3" style="text-align: center;">${t('no_categories')}</td></tr>`;
        return;
      }

      categoryList.forEach(k => {
        const tr = document.createElement('tr');
        tr.innerHTML = `
          <td><code>${escapeHtml(k.id)}</code></td>
          <td><strong>${escapeHtml(k.nama)}</strong></td>
          <td>
            <button class="btn-action-sm danger btn-del-k" data-id="${escapeHtml(k.id)}">${t('btn_delete')}</button>
          </td>
        `;
        tr.querySelector('.btn-del-k').addEventListener('click', () => deleteKategori(k.id, k.nama));
        tbody.appendChild(tr);
      });
    }

    function deleteKategori(id, name) {
      const msg = t('modal_confirm_del_cat_desc').replace('{name}', escapeHtml(name));
      showConfirmModal({
        title: t('modal_confirm_del_cat_title'),
        message: msg,
        confirmText: t('modal_confirm_del_cat_btn'),
        isDanger: true,
        onConfirm: () => {
          showLoading(true, t('loading_deleting_cat'));
          google.script.run
            .withSuccessHandler(res => {
              showLoading(false);
              if (res && res.success) {
                showToast(res.message, 'success');
                loadKategori();
              } else {
                showToast(res.message || 'Gagal menghapus kategori.', 'error');
              }
            })
            .withFailureHandler(err => {
              showLoading(false);
              showToast(t('toast_server_error') + err.message, 'error');
            })
            .deleteKategori(authToken, id);
        }
      });
    }

    // ==========================================================================
    // 5. LAPORAN PENJUALAN
    // ==========================================================================
    function loadLaporan() {
      const form = document.getElementById('reportFilterForm');
      form.dispatchEvent(new Event('submit'));
    }

    // ==========================================================================
    // 6. EVENT LISTENERS SETUP
    // ==========================================================================
    function safeListen(idOrEl, event, handler) {
      const el = (typeof idOrEl === 'string') ? document.getElementById(idOrEl) : idOrEl;
      if (el) el.addEventListener(event, handler);
    }

    function setupEventListeners() {
      // 1. Refresh Buttons
      safeListen('btnRefreshChart', 'click', loadDashboard);
      safeListen('btnRefreshTrx', 'click', loadRiwayatTrx);

      // 2. Tambah Kasir Toggle
      safeListen('btnTambahKasir', 'click', () => {
        const wrap = document.getElementById('formTambahKasirWrap');
        if (!wrap) return;
        wrap.style.display = wrap.style.display === 'none' ? 'block' : 'none';
        if (wrap.style.display === 'block') {
          const kt = document.getElementById('kasirKodeToko');
          if (kt) kt.value = activeKodeToko || '';
          const fk = document.getElementById('formKasirBaru');
          if (fk) fk.reset();
          if (kt) kt.value = activeKodeToko || '';
        }
      });

      safeListen('btnBatalTambahKasir', 'click', () => {
        const wrap = document.getElementById('formTambahKasirWrap');
        if (wrap) wrap.style.display = 'none';
        const fk = document.getElementById('formKasirBaru');
        if (fk) fk.reset();
      });

      // 3. Form Kasir Baru Submit
      safeListen('formKasirBaru', 'submit', (e) => {
        e.preventDefault();
        const nama = document.getElementById('kasirNamaBaru')?.value.trim();
        const email = document.getElementById('kasirEmailBaru')?.value.trim().toLowerCase();
        const pass = document.getElementById('kasirPassBaru')?.value;
        const kode = activeKodeToko || '';

        if (!nama || !email || !pass) {
          showToast(t('toast_fill_required'), 'error');
          return;
        }
        if (pass.length < 6) {
          showToast(t('toast_pass_min'), 'error');
          return;
        }

        const btn = document.getElementById('btnSimpanKasir');
        if (btn) { btn.disabled = true; btn.textContent = t('saving_cashier'); }
        showLoading(true, t('loading_saving_kasir'));

        google.script.run
          .withSuccessHandler(res => {
            showLoading(false);
            if (btn) { btn.disabled = false; btn.textContent = t('btn_save_cashier'); }
            if (res && res.success) {
              showToast(res.message || 'Kasir berhasil ditambahkan!', 'success');
              const wrap = document.getElementById('formTambahKasirWrap');
              if (wrap) wrap.style.display = 'none';
              const fk = document.getElementById('formKasirBaru');
              if (fk) fk.reset();
              loadStaff();
            } else {
              showToast(res.message || 'Gagal mendaftarkan kasir.', 'error');
            }
          })
          .withFailureHandler(err => {
            showLoading(false);
            if (btn) { btn.disabled = false; btn.textContent = t('btn_save_cashier'); }
            showToast(t('toast_server_error') + err.message, 'error');
          })
          .daftarKasirBaru(kode, email, pass, nama);
      });

      // 4. Modal Confirm Dialog
      safeListen('btnCancelConfirm', 'click', closeConfirmModal);
      safeListen('btnAcceptConfirm', 'click', () => {
        const cb = currentConfirmCallback;
        closeConfirmModal();
        if (typeof cb === 'function') cb();
      });

      // 5. Global Search Input
      const searchInput = document.getElementById('globalSearchInput');
      if (searchInput) {
        searchInput.addEventListener('keydown', (e) => {
          if (e.key === 'Enter') {
            const q = searchInput.value.trim();
            if (q) {
              const tabProdBtn = document.querySelector('.nav-item-btn[data-tab="tabProduk"]');
              if (tabProdBtn) tabProdBtn.click();
            }
          }
        });
      }

      // 6. Export Helper & Handlers — Live Spreadsheet Download
      function exportTransactionsToCsv(rows, customFilename) {
        if (!rows || !rows.length) {
          showToast(currentLang === 'en' ? 'No transaction data in spreadsheet to export.' : 'Belum ada data transaksi di spreadsheet untuk diexport.', 'info');
          return;
        }

        // Build CSV Headers
        const headers = currentLang === 'en'
          ? ['Transaction ID', 'Date & Time', 'Cashier', 'Payment Method', 'Total (IDR)', 'Paid (IDR)', 'Change (IDR)', 'Notes']
          : ['ID Transaksi', 'Tanggal & Waktu', 'Kasir', 'Metode Pembayaran', 'Total (Rp)', 'Bayar (Rp)', 'Kembalian (Rp)', 'Catatan'];

        const csvRows = [headers.join(',')];
        rows.forEach(tx => {
          const id = `"${String(tx.id || tx.trxId || '').replace(/"/g, '""')}"`;
          const tgl = `"${String(tx.tanggal || tx.date || '').replace(/"/g, '""')}"`;
          const kasir = `"${String(tx.kasir || tx.cashier || '').replace(/"/g, '""')}"`;
          const metode = `"${String(tx.metode || tx.metodePembayaran || tx.method || 'Cash').replace(/"/g, '""')}"`;
          const total = Number(tx.total) || 0;
          const bayar = Number(tx.bayar || tx.paid) || 0;
          const kembalian = Number(tx.kembalian || tx.change) || 0;
          const catatan = `"${String(tx.catatan || tx.notes || '').replace(/"/g, '""')}"`;

          csvRows.push([id, tgl, kasir, metode, total, bayar, kembalian, catatan].join(','));
        });

        const csvContent = '\uFEFF' + csvRows.join('\r\n'); // UTF-8 BOM for Excel
        const now = new Date();
        const stamp = `${now.getFullYear()}${String(now.getMonth()+1).padStart(2,'0')}${String(now.getDate()).padStart(2,'0')}_${String(now.getHours()).padStart(2,'0')}${String(now.getMinutes()).padStart(2,'0')}`;
        const fileName = customFilename || `laporan_penjualan_${activeKodeToko || 'pos'}_${stamp}.csv`;

        try {
          const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
          const url = URL.createObjectURL(blob);
          const link = document.createElement('a');
          link.href = url;
          link.download = fileName;
          link.target = '_blank';
          document.body.appendChild(link);
          link.click();
          setTimeout(() => {
            document.body.removeChild(link);
            URL.revokeObjectURL(url);
          }, 1500);
        } catch (blobErr) {
          const encodedUri = 'data:text/csv;charset=utf-8,' + encodeURIComponent(csvContent);
          const link = document.createElement('a');
          link.href = encodedUri;
          link.download = fileName;
          link.target = '_blank';
          document.body.appendChild(link);
          link.click();
          setTimeout(() => document.body.removeChild(link), 1500);
        }

        showToast(
          currentLang === 'en' ? `Exported ${rows.length} transactions to CSV.` : `Berhasil mengekspor ${rows.length} transaksi ke CSV.`,
          'success'
        );
      }

      // 6a. Topbar Export Button — Live download of all transactions from spreadsheet
      safeListen('btnExportTop', 'click', () => {
        showToast(currentLang === 'en' ? 'Preparing export from spreadsheet...' : 'Menyiapkan file export dari spreadsheet...', 'info');
        showLoading(true, currentLang === 'en' ? 'Exporting transactions...' : 'Mengekspor data transaksi...');

        google.script.run
          .withSuccessHandler(res => {
            showLoading(false);
            if (res && res.success) {
              const rows = res.transactions || (res.data && res.data.transactions) || [];
              exportTransactionsToCsv(rows, `laporan_penjualan_semua_${activeKodeToko || 'pos'}.csv`);
            } else {
              showToast(res.message || (currentLang === 'en' ? 'Failed to fetch export data.' : 'Gagal mengambil data export.'), 'error');
            }
          })
          .withFailureHandler(err => {
            showLoading(false);
            showToast(t('toast_server_error') + err.message, 'error');
          })
          .getLaporanPenjualan(authToken, '', '', 'Semua');
      });

      // 6b. Tab Laporan Export Button — Live download of filtered transactions
      safeListen('btnExportLaporan', 'click', () => {
        const tglMulai = document.getElementById('lapTanggalMulai')?.value || '';
        const tglAkhir = document.getElementById('lapTanggalAkhir')?.value || '';
        const metode = document.getElementById('lapMetode')?.value || 'Semua';

        showToast(currentLang === 'en' ? 'Preparing export from spreadsheet...' : 'Menyiapkan file export dari spreadsheet...', 'info');
        showLoading(true, currentLang === 'en' ? 'Exporting filtered transactions...' : 'Mengekspor data transaksi filter...');

        google.script.run
          .withSuccessHandler(res => {
            showLoading(false);
            if (res && res.success) {
              const rows = res.transactions || (res.data && res.data.transactions) || [];
              const rangeTag = (tglMulai || tglAkhir) ? `_${tglMulai}_to_${tglAkhir}` : '';
              exportTransactionsToCsv(rows, `laporan_penjualan_${activeKodeToko || 'pos'}${rangeTag}.csv`);
            } else {
              showToast(res.message || (currentLang === 'en' ? 'Failed to fetch export data.' : 'Gagal mengambil data export.'), 'error');
            }
          })
          .withFailureHandler(err => {
            showLoading(false);
            showToast(t('toast_server_error') + err.message, 'error');
          })
          .getLaporanPenjualan(authToken, tglMulai, tglAkhir, metode);
      });

      // 6b. Notification Panel
      (function initNotifPanel() {
        const btnNotif    = document.getElementById('btnNotifToggle');
        const notifPanel  = document.getElementById('notifPanel');
        const notifBody   = document.getElementById('notifPanelBody');
        const notifEmpty  = document.getElementById('notifEmptyMsg');
        const notifBadge  = document.getElementById('notifBadgeDot');
        const notifTitle  = document.getElementById('notifPanelTitle');
        const btnClear    = document.getElementById('btnClearNotif');
        const notifFooter = document.getElementById('notifPanelFooter');

        let notifItems = [];
        let panelOpen = false;

        function buildNotifItems() {
          notifItems = [];

          // Low stock alerts from allProducts
          const products = allProducts || [];
          const lowStock = products.filter(p => {
            const stok = Number(p.stok || p.stock || 0);
            const min  = Number(p.stokMin || p.minStock || 5);
            return stok <= min;
          });
          lowStock.forEach(p => {
            const stok = Number(p.stok || p.stock || 0);
            const nama = p.nama || p.name || '?';
            notifItems.push({
              type: stok === 0 ? 'danger' : 'warning',
              title: stok === 0
                ? (currentLang === 'en' ? `${nama} — Out of Stock` : `${nama} — Stok Habis`)
                : (currentLang === 'en' ? `${nama} — Low Stock` : `${nama} — Stok Rendah`),
              sub: currentLang === 'en'
                ? `Only ${stok} unit(s) remaining`
                : `Tersisa ${stok} unit`,
              icon: stok === 0
                ? `<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>`
                : `<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"/><line x1="12" y1="9" x2="12" y2="13"/><line x1="12" y1="17" x2="12.01" y2="17"/></svg>`
            });
          });

          // Recent transaction summary
          const txns = allTransactions || [];
          if (txns.length > 0) {
            const today = new Date().toISOString().slice(0, 10);
            const todayTxns = txns.filter(tx => (tx.tanggal || tx.date || '').startsWith(today));
            const todayTotal = todayTxns.reduce((s, tx) => s + Number(tx.total || 0), 0);
            if (todayTxns.length > 0) {
              notifItems.push({
                type: 'info',
                title: currentLang === 'en' ? `Today: ${todayTxns.length} transactions` : `Hari ini: ${todayTxns.length} transaksi`,
                sub: currentLang === 'en'
                  ? `Total revenue: ${formatRupiah(todayTotal)}`
                  : `Total pendapatan: ${formatRupiah(todayTotal)}`,
                icon: `<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="12" y1="1" x2="12" y2="23"/><path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"/></svg>`
              });
            }
          }
        }

        function renderNotifPanel() {
          buildNotifItems();

          if (notifTitle) notifTitle.textContent = currentLang === 'en' ? 'Notifications' : 'Notifikasi';
          if (btnClear)   btnClear.textContent   = currentLang === 'en' ? 'Clear All' : 'Hapus Semua';
          if (notifFooter) notifFooter.textContent = currentLang === 'en' ? 'Just updated' : 'Diperbarui baru saja';

          if (!notifItems.length) {
            if (notifEmpty) { notifEmpty.style.display = 'block'; notifEmpty.textContent = currentLang === 'en' ? 'No new notifications.' : 'Tidak ada notifikasi baru.'; }
            if (notifBadge) notifBadge.classList.add('hidden');
            return;
          }

          if (notifEmpty) notifEmpty.style.display = 'none';
          if (notifBadge) notifBadge.classList.remove('hidden');

          // Remove existing items (keep empty msg)
          Array.from(notifBody.querySelectorAll('.notif-item')).forEach(el => el.remove());

          notifItems.forEach(item => {
            const div = document.createElement('div');
            div.className = 'notif-item';
            div.innerHTML = `
              <div class="notif-icon-wrap ${item.type}">${item.icon}</div>
              <div class="notif-text-group">
                <div class="notif-text-title">${item.title}</div>
                <div class="notif-text-sub">${item.sub}</div>
              </div>`;
            notifBody.appendChild(div);
          });
        }

        function openPanel() {
          renderNotifPanel();
          if (notifPanel) notifPanel.classList.add('open');
          panelOpen = true;
        }

        function closePanel() {
          if (notifPanel) notifPanel.classList.remove('open');
          panelOpen = false;
        }

        if (btnNotif) {
          btnNotif.addEventListener('click', (e) => {
            e.stopPropagation();
            panelOpen ? closePanel() : openPanel();
          });
        }

        document.addEventListener('click', (e) => {
          if (panelOpen && notifPanel && !notifPanel.contains(e.target) && e.target !== btnNotif) {
            closePanel();
          }
        });

        if (btnClear) {
          btnClear.addEventListener('click', () => {
            notifItems = [];
            Array.from(notifBody.querySelectorAll('.notif-item')).forEach(el => el.remove());
            if (notifEmpty) { notifEmpty.style.display = 'block'; notifEmpty.textContent = currentLang === 'en' ? 'No new notifications.' : 'Tidak ada notifikasi baru.'; }
            if (notifBadge) notifBadge.classList.add('hidden');
          });
        }

        // Initial badge check after data loads
        setTimeout(renderNotifPanel, 3000);
      })();

      // 7. Logout Button
      safeListen('btnLogout', 'click', () => {
        showConfirmModal({
          title: t('modal_confirm_logout_title'),
          message: t('modal_confirm_logout_desc'),
          confirmText: t('modal_confirm_logout_btn'),
          isDanger: true,
          onConfirm: () => {
            showLoading(true, t('loading_logout'));
            google.script.run
              .withSuccessHandler(() => {
                sessionStorage.removeItem('pos_token');
                localStorage.removeItem('pos_token');
                redirectToLogin();
              })
              .logoutUser(authToken);
          }
        });
      });

      // 8. Modal Produk Handlers
      safeListen('btnOpenAddProduk', 'click', () => {
        const fp = document.getElementById('formProduk');
        if (fp) fp.reset();
        const pid = document.getElementById('prodId');
        if (pid) pid.value = '';
        const title = document.getElementById('modalProdukTitle');
        if (title) title.textContent = t('modal_prod_title_add');
        const sub = document.getElementById('modalProdukSub');
        if (sub) sub.textContent = t('modal_prod_sub_add');
        const thumbEl = document.getElementById('imgPreviewThumb');
        if (thumbEl) thumbEl.classList.remove('show');
        populateKategoriSelect();
        const modalP = document.getElementById('modalProduk');
        if (modalP) modalP.classList.add('active');
      });

      safeListen('btnCloseModalProduk', 'click', () => {
        const modalP = document.getElementById('modalProduk');
        if (modalP) modalP.classList.remove('active');
      });

      safeListen('btnCancelModalProduk', 'click', () => {
        const modalP = document.getElementById('modalProduk');
        if (modalP) modalP.classList.remove('active');
      });

      // 9. Image Upload Handlers
      const inputImg = document.getElementById('prodGambar');
      const thumb = document.getElementById('imgPreviewThumb');
      const fileInput = document.getElementById('prodFileInput');
      const dropBox = document.getElementById('imageDropBox');

      if (inputImg && thumb) {
        inputImg.addEventListener('input', () => {
          const val = inputImg.value.trim();
          if (val.startsWith('http') || val.startsWith('data:image')) {
            thumb.src = val;
            thumb.classList.add('show');
          } else {
            thumb.classList.remove('show');
          }
        });
      }

      if (dropBox && fileInput) {
        dropBox.addEventListener('click', () => fileInput.click());
      }

      if (fileInput && inputImg && thumb) {
        fileInput.addEventListener('change', (e) => {
          const file = e.target.files[0];
          if (!file) return;
          if (!file.type.startsWith('image/')) {
            showToast(currentLang === 'en' ? 'Selected file must be an image.' : 'File yang dipilih harus berupa gambar.', 'error');
            return;
          }
          const reader = new FileReader();
          reader.onload = (event) => {
            const img = new Image();
            img.onload = () => {
              const canvas = document.createElement('canvas');
              const maxDim = 400;
              let w = img.width, h = img.height;
              if (w > h) {
                if (w > maxDim) { h = Math.round((h * maxDim) / w); w = maxDim; }
              } else {
                if (h > maxDim) { w = Math.round((w * maxDim) / h); h = maxDim; }
              }
              canvas.width = w; canvas.height = h;
              const ctx = canvas.getContext('2d');
              ctx.drawImage(img, 0, 0, w, h);
              const compressed = canvas.toDataURL('image/jpeg', 0.82);
              inputImg.value = compressed;
              thumb.src = compressed;
              thumb.classList.add('show');
              showToast(t('toast_photo_loaded'), 'success');
            };
            img.src = event.target.result;
          };
          reader.readAsDataURL(file);
        });
      }

      // 10. Form Edit Kasir
      safeListen('formEditKasir', 'submit', (e) => {
        e.preventDefault();
        const id = document.getElementById('editKasirId')?.value;
        const nama = document.getElementById('editKasirNama')?.value.trim();
        const email = document.getElementById('editKasirEmail')?.value.trim().toLowerCase();
        const password = document.getElementById('editKasirPass')?.value.trim();

        if (!id || !nama || !email) {
          showToast(t('toast_fill_required'), 'error');
          return;
        }
        if (password && password.length < 6) {
          showToast(t('toast_pass_min'), 'error');
          return;
        }

        const btn = document.getElementById('btnSaveEditKasir');
        if (btn) { btn.disabled = true; btn.textContent = t('saving_cashier'); }
        showLoading(true, t('loading_updating_kasir'));

        google.script.run
          .withSuccessHandler(res => {
            showLoading(false);
            if (btn) { btn.disabled = false; btn.textContent = t('btn_save_changes'); }
            if (res && res.success) {
              showToast(res.message || 'Data kasir berhasil diperbarui!', 'success');
              const modalK = document.getElementById('modalEditKasir');
              if (modalK) modalK.classList.remove('active');
              loadDashboard();
            } else {
              showToast(res.message || 'Gagal memperbarui data kasir.', 'error');
            }
          })
          .withFailureHandler(err => {
            showLoading(false);
            if (btn) { btn.disabled = false; btn.textContent = t('btn_save_changes'); }
            showToast(t('toast_server_error') + err.message, 'error');
          })
          .updateKasir(authToken, { id, nama, email, password });
      });

      safeListen('btnCloseModalEditKasir', 'click', () => {
        const modal = document.getElementById('modalEditKasir');
        if (modal) modal.classList.remove('active');
      });

      safeListen('btnCancelModalEditKasir', 'click', () => {
        const modal = document.getElementById('modalEditKasir');
        if (modal) modal.classList.remove('active');
      });

      // 11. Form Produk Submit
      safeListen('formProduk', 'submit', (e) => {
        e.preventDefault();
        const payload = {
          id: document.getElementById('prodId')?.value || '',
          nama: document.getElementById('prodNama')?.value.trim() || '',
          deskripsi: document.getElementById('prodDesc')?.value.trim() || '',
          kategoriId: document.getElementById('prodKategoriId')?.value || '',
          subKategori: document.getElementById('prodSubCategory')?.value.trim() || '',
          hargaBeli: Number(document.getElementById('prodHargaBeli')?.value) || 0,
          hargaJual: Number(document.getElementById('prodHargaJual')?.value) || 0,
          stok: parseInt(document.getElementById('prodStok')?.value, 10) || 0,
          minStok: parseInt(document.getElementById('prodMinStok')?.value, 10) || 5,
          barcode: document.getElementById('prodBarcode')?.value.trim() || '',
          gambar: document.getElementById('prodGambar')?.value.trim() || ''
        };

        if (!payload.nama) { showToast(currentLang === 'en' ? 'Product name is required.' : 'Nama menu wajib diisi.', 'error'); return; }
        if (!payload.kategoriId) { showToast(currentLang === 'en' ? 'Product category is required.' : 'Kategori menu wajib dipilih.', 'error'); return; }
        if (payload.hargaJual <= 0) { showToast(currentLang === 'en' ? 'Selling price must be greater than 0.' : 'Harga jual harus lebih dari 0.', 'error'); return; }

        showLoading(true, t('loading_saving_menu'));
        google.script.run
          .withSuccessHandler(res => {
            showLoading(false);
            if (res && res.success) {
              showToast(res.message, 'success');
              const modal = document.getElementById('modalProduk');
              if (modal) modal.classList.remove('active');
              loadProduk();
            } else {
              showToast(res.message || 'Gagal menyimpan menu.', 'error');
            }
          })
          .withFailureHandler(err => {
            showLoading(false);
            showToast(t('toast_server_error') + err.message, 'error');
          })
          .saveProduk(authToken, payload);
      });

      // 12. Modal Kategori Handlers
      safeListen('btnOpenAddKategori', 'click', () => {
        const formK = document.getElementById('formKategori');
        if (formK) formK.reset();
        const kid = document.getElementById('katId');
        if (kid) kid.value = '';
        const modal = document.getElementById('modalKategori');
        if (modal) modal.classList.add('active');
      });

      safeListen('btnCloseModalKategori', 'click', () => {
        const modal = document.getElementById('modalKategori');
        if (modal) modal.classList.remove('active');
      });

      safeListen('btnCancelModalKategori', 'click', () => {
        const modal = document.getElementById('modalKategori');
        if (modal) modal.classList.remove('active');
      });

      safeListen('formKategori', 'submit', (e) => {
        e.preventDefault();
        const nama = document.getElementById('katNama')?.value.trim();
        const id = document.getElementById('katId')?.value || '';

        if (!nama) { showToast(currentLang === 'en' ? 'Category name is required.' : 'Nama kategori wajib diisi.', 'error'); return; }

        showLoading(true, t('loading_saving_cat'));
        google.script.run
          .withSuccessHandler(res => {
            showLoading(false);
            if (res && res.success) {
              showToast(res.message, 'success');
              const modal = document.getElementById('modalKategori');
              if (modal) modal.classList.remove('active');
              loadKategori();
            } else {
              showToast(res.message || 'Gagal menyimpan kategori.', 'error');
            }
          })
          .withFailureHandler(err => {
            showLoading(false);
            showToast(t('toast_server_error') + err.message, 'error');
          })
          .saveKategori(authToken, { id: id, nama: nama });
      });

      // 13. Laporan Filter Submit
      safeListen('reportFilterForm', 'submit', (e) => {
        e.preventDefault();
        const tglMulai = document.getElementById('lapTanggalMulai')?.value;
        const tglAkhir = document.getElementById('lapTanggalAkhir')?.value;
        const metode = document.getElementById('lapMetode')?.value;

        showLoading(true, t('loading_report'));
        google.script.run
          .withSuccessHandler(res => {
            showLoading(false);
            const tbody = document.getElementById('laporanTableBody');
            if (!tbody) return;
            if (res && res.success) {
              const list = res.data.transactions || [];
              if (list.length === 0) {
                tbody.innerHTML = `<tr><td colspan="7" style="text-align: center;">${t('report_no_data')}</td></tr>`;
                return;
              }
              tbody.innerHTML = '';
              list.forEach(tx => {
                const tr = document.createElement('tr');
                tr.innerHTML = `
                  <td><code>${escapeHtml(tx.id)}</code></td>
                  <td>${escapeHtml(tx.tanggal)}</td>
                  <td>${escapeHtml(tx.kasir)}</td>
                  <td style="font-family: var(--font-mono); font-weight: 700; color: var(--primary);">${formatRupiah(tx.total)}</td>
                  <td style="font-family: var(--font-mono);">${formatRupiah(tx.bayar)}</td>
                  <td style="font-family: var(--font-mono);">${formatRupiah(tx.kembalian)}</td>
                  <td>${escapeHtml(tx.metode)}</td>
                `;
                tbody.appendChild(tr);
              });
            } else {
              showToast(res.message || 'Gagal memuat laporan.', 'error');
            }
          })
          .withFailureHandler(err => {
            showLoading(false);
            showToast(t('toast_server_error') + err.message, 'error');
          })
          .getLaporanPenjualan(authToken, tglMulai, tglAkhir, metode);
      });

      // 14. Theme Swatches Click
      document.querySelectorAll('.theme-swatch-card').forEach(card => {
        card.addEventListener('click', () => {
          const themeKey = card.getAttribute('data-theme');
          if (themeKey) setTheme(themeKey);
        });
      });

      // 15. Language Cards Click
      document.querySelectorAll('.lang-card-pill').forEach(pill => {
        pill.addEventListener('click', () => {
          const lang = pill.getAttribute('data-lang');
          if (lang) setLanguage(lang);
        });
      });

      // 16. Settings Save Form
      safeListen('formPengaturanProfil', 'submit', (e) => {
        e.preventDefault();
        const namaToko = document.getElementById('setNamaToko')?.value.trim();
        const namaLengkap = document.getElementById('setNamaAdmin')?.value.trim();

        if (!namaToko || !namaLengkap) {
          showToast(currentLang === 'en' ? 'Store name and admin display name are required.' : 'Nama toko dan nama administrator tidak boleh kosong.', 'error');
          return;
        }

        const btn = document.getElementById('btnSaveStoreSettings');
        if (btn) btn.disabled = true;
        showLoading(true, t('loading_saving_settings'));

        google.script.run
          .withSuccessHandler(res => {
            showLoading(false);
            if (btn) btn.disabled = false;
            if (res && res.success) {
              showToast(res.message || 'Pengaturan berhasil diperbarui!', 'success');
              if (currentUserData) {
                currentUserData.namaToko = namaToko;
                currentUserData.namaLengkap = namaLengkap;
              }
              const topStoreName = document.getElementById('navStoreName');
              if (topStoreName) topStoreName.textContent = namaToko;
              const topAdminName = document.getElementById('userProfileName');
              if (topAdminName) topAdminName.textContent = namaLengkap;
              const initials = namaLengkap.substring(0, 2).toUpperCase();
              const avatarEl = document.getElementById('userAvatarText');
              if (avatarEl) avatarEl.textContent = initials;
              const prefix = t('welcome_greeting');
              const greetingEl = document.getElementById('dashGreetingTitle');
              if (greetingEl) greetingEl.textContent = `${prefix} ${namaToko}`;
            } else {
              showToast(res.message || 'Gagal menyimpan pengaturan.', 'error');
            }
          })
          .withFailureHandler(err => {
            showLoading(false);
            if (btn) btn.disabled = false;
            showToast(t('toast_server_error') + err.message, 'error');
          })
          .updateAdminSettings(authToken, { namaLengkap, namaToko });
      });

      // 17. Topbar Quick Lang Switcher
      safeListen('btnQuickLangToggle', 'click', toggleQuickLang);

      // 18. Analytics Period Pills & Refresh
      document.querySelectorAll('#analyticsPeriodPills .period-pill-btn').forEach(btn => {
        btn.addEventListener('click', () => {
          const period = btn.getAttribute('data-period');
          loadAnalytics(period);
        });
      });

      safeListen('btnRefreshAnalytics', 'click', () => {
        loadAnalytics(currentAnalyticsPeriod);
      });
    }

    // ==========================================================================
    // 6. SETTINGS TAB LOADER
    // ==========================================================================
    function loadSettingsTab() {
      if (currentUserData) {
        const elToko = document.getElementById('setNamaToko');
        const elAdmin = document.getElementById('setNamaAdmin');
        const elKode = document.getElementById('setKodeTokoDisplay');
        if (elToko) elToko.value = currentUserData.namaToko || '';
        if (elAdmin) elAdmin.value = currentUserData.namaLengkap || '';
        if (elKode) elKode.value = currentUserData.kodeToko || activeKodeToko || '';
      }

      // Sync active state for language & theme cards
      document.querySelectorAll('#langOptionsGrid .lang-card-pill').forEach(pill => {
        if (pill.getAttribute('data-lang') === currentLang) pill.classList.add('active');
        else pill.classList.remove('active');
      });

      document.querySelectorAll('#themeSwatchesContainer .theme-swatch-card').forEach(card => {
        if (card.getAttribute('data-theme') === currentTheme) card.classList.add('active');
        else card.classList.remove('active');
      });
    }

    // ==========================================================================
    // 7. ANALYTICS & BUSINESS INSIGHTS
    // ==========================================================================
    function loadAnalytics(period) {
      currentAnalyticsPeriod = period || 'all';
      showLoading(true, t('loading_analytics'));
      
      // Update active period pill
      document.querySelectorAll('#analyticsPeriodPills .period-pill-btn').forEach(btn => {
        if (btn.getAttribute('data-period') === currentAnalyticsPeriod) {
          btn.classList.add('active');
        } else {
          btn.classList.remove('active');
        }
      });

      google.script.run
        .withSuccessHandler(res => {
          showLoading(false);
          if (res && res.success && res.data) {
            _cachedAnalyticsData = res.data;
            renderAnalytics(res.data);
          } else {
            showToast(res.message || 'Gagal memuat analitik.', 'error');
          }
        })
        .withFailureHandler(err => {
          showLoading(false);
          showToast(t('toast_server_error') + err.message, 'error');
        })
        .getAnalyticsData(authToken, currentAnalyticsPeriod);
    }

    function renderAnalytics(d) {
      if (!d) return;
      const s = d.summary || {};

      // 1. Health Score Banner
      const scoreVal = s.healthScore || 85;
      document.getElementById('analyticsHealthScoreVal').textContent = scoreVal;
      
      const gradeLetter = s.healthGrade || 'A';
      let statusLabel = s.healthStatus || (scoreVal >= 80 ? 'Prima' : (scoreVal >= 55 ? 'Cukup' : 'Kritis'));
      if (currentLang === 'en') {
        if (scoreVal >= 80) statusLabel = 'Optimal';
        else if (scoreVal >= 55) statusLabel = 'Fair';
        else statusLabel = 'Critical';
      }
      document.getElementById('analyticsHealthGradeBadge').textContent = `Grade ${gradeLetter} • ${statusLabel}`;
      
      const gradeTitle = (currentLang === 'en') ? `Business Health Score: Grade ${gradeLetter}` : `Skor Kesehatan Bisnis: Grade ${gradeLetter}`;
      document.getElementById('analyticsHealthGradeText').textContent = gradeTitle;
      
      let statusDesc = '';
      if (scoreVal >= 80) statusDesc = t('health_status_optimal');
      else if (scoreVal >= 55) statusDesc = t('health_status_fair');
      else statusDesc = t('health_status_critical');
      document.getElementById('analyticsHealthStatus').textContent = statusDesc;

      // Filter date range label
      const rangeEl = document.getElementById('analyticsDateRangeLabel');
      if (rangeEl) {
        if (d.period === 'today') {
          rangeEl.textContent = (currentLang === 'en') ? `Period: Today (${d.filterStart})` : `Periode: Hari Ini (${d.filterStart})`;
        } else if (d.period === '7days') {
          rangeEl.textContent = (currentLang === 'en') ? `Period: Last 7 Days (${d.filterStart} - ${d.filterEnd})` : `Periode: 7 Hari Terakhir (${d.filterStart} - ${d.filterEnd})`;
        } else if (d.period === 'month') {
          rangeEl.textContent = (currentLang === 'en') ? `Period: Last 30 Days (${d.filterStart} - ${d.filterEnd})` : `Periode: 30 Hari Terakhir (${d.filterStart} - ${d.filterEnd})`;
        } else {
          rangeEl.textContent = (currentLang === 'en') ? 'Period: All Recorded Transactions' : 'Periode: Semua transaksi tercatat';
        }
      }

      // 2. 4 Strategic KPI Cards
      document.getElementById('analyticsGrossMargin').textContent = `${s.profitMarginPct || 0}%`;
      document.getElementById('analyticsGrossProfitSub').innerHTML = `<span>${t('net_profit_label')}: ${formatRupiah(s.grossProfit || 0)}</span>`;

      document.getElementById('analyticsAOV').textContent = formatRupiah(s.aov || 0);
      document.getElementById('analyticsTotalOrdersSub').textContent = `${s.totalOrders || 0} ${t('total_orders_label')}`;

      document.getElementById('analyticsPeakHour').textContent = s.peakHour || '12:00';
      document.getElementById('analyticsPeakHourSub').textContent = `${s.peakHourOrders || 0} ${t('orders_in_peak')}`;

      document.getElementById('analyticsBasketDepth').textContent = `${s.avgItemsPerOrder || 0}`;
      document.getElementById('analyticsTotalItemsSub').textContent = `${t('items_per_receipt')} (${s.totalItemsSold || 0} ${t('total_items_sold')})`;

      // 3. SWOT Plus (Kekuatan)
      const plusContainer = document.getElementById('analyticsPlusList');
      plusContainer.innerHTML = '';
      const plusList = (d.swot && d.swot.plus) ? d.swot.plus : [];
      if (plusList.length === 0) {
        plusContainer.innerHTML = `<div style="text-align: center; color: var(--text-muted); padding: 20px;">${t('no_plus_data')}</div>`;
      } else {
        plusList.forEach(item => {
          const card = document.createElement('div');
          card.className = 'swot-card plus';
          card.innerHTML = `
            <div class="swot-card-top">
              <span class="swot-card-title">${escapeHtml(item.title)}</span>
              <span class="swot-card-metric green">${escapeHtml(item.metric)}</span>
            </div>
            <div class="swot-card-desc">${escapeHtml(item.desc)}</div>
          `;
          plusContainer.appendChild(card);
        });
      }

      // 4. SWOT Minus (Kekurangan & Risiko)
      const minusContainer = document.getElementById('analyticsMinusList');
      minusContainer.innerHTML = '';
      const minusList = (d.swot && d.swot.minus) ? d.swot.minus : [];
      if (minusList.length === 0) {
        minusContainer.innerHTML = `<div style="text-align: center; color: var(--text-muted); padding: 20px;">${t('no_minus_data')}</div>`;
      } else {
        minusList.forEach(item => {
          const card = document.createElement('div');
          card.className = 'swot-card minus';
          const metricClass = (item.severity === 'danger') ? 'red' : 'orange';
          card.innerHTML = `
            <div class="swot-card-top">
              <span class="swot-card-title">${escapeHtml(item.title)}</span>
              <span class="swot-card-metric ${metricClass}">${escapeHtml(item.metric)}</span>
            </div>
            <div class="swot-card-desc">${escapeHtml(item.desc)}</div>
          `;
          minusContainer.appendChild(card);
        });
      }

      // 5. AI Recommendations
      const recContainer = document.getElementById('analyticsRecList');
      recContainer.innerHTML = '';
      const recList = d.recommendations || [];
      if (recList.length === 0) {
        recContainer.innerHTML = `<div style="text-align: center; color: var(--text-muted); padding: 10px;">${t('no_rec_data')}</div>`;
      } else {
        recList.forEach(rec => {
          const item = document.createElement('div');
          item.className = 'rec-item-card';
          let priorityClass = 'sedang';
          let priorityLabel = rec.priority;
          const prioLower = String(rec.priority).toLowerCase();
          if (prioLower.includes('mendesak') || prioLower.includes('urgent')) {
            priorityClass = 'mendesak';
            priorityLabel = t('prio_urgent');
          } else if (prioLower.includes('tinggi') || prioLower.includes('high')) {
            priorityClass = 'tinggi';
            priorityLabel = t('prio_high');
          } else if (prioLower.includes('sedang') || prioLower.includes('medium')) {
            priorityClass = 'sedang';
            priorityLabel = t('prio_medium');
          } else {
            priorityLabel = t('prio_low');
          }

          item.innerHTML = `
            <span class="rec-priority-pill ${priorityClass}">${escapeHtml(priorityLabel)}</span>
            <div style="flex: 1;">
              <div style="font-weight: 700; font-size: 13.5px; color: var(--text-heading); margin-bottom: 4px;">${escapeHtml(rec.title)}</div>
              <div style="font-size: 12.5px; color: var(--text-body); line-height: 1.45;">${escapeHtml(rec.action)}</div>
            </div>
          `;
          recContainer.appendChild(item);
        });
      }

      // 6. 24-Hour Distribution Bars
      const hourlyContainer = document.getElementById('analyticsHourlyBars');
      hourlyContainer.innerHTML = '';
      const hourlyData = d.hourlyDistribution || [];
      const maxHourlyOrders = Math.max(...hourlyData.map(h => h.orders), 1);

      hourlyData.forEach(h => {
        const col = document.createElement('div');
        col.className = 'hourly-bar-col';
        const heightPct = Math.max(6, Math.round((h.orders / maxHourlyOrders) * 100));
        const isPeak = (h.orders > 0 && h.orders === maxHourlyOrders);
        const peakClass = isPeak ? 'peak' : '';
        const titleTip = `${h.label}: ${h.orders} ${t('orders_in_peak')} (${formatRupiah(h.revenue)})`;

        col.innerHTML = `
          <div class="hourly-bar-fill ${peakClass}" style="height: ${heightPct}%;" title="${escapeHtml(titleTip)}"></div>
          <span class="hourly-bar-label">${escapeHtml(h.hour)}</span>
        `;
        hourlyContainer.appendChild(col);
      });

      // 7. Product Performance Matrix Table
      const matrixBody = document.getElementById('analyticsMatrixBody');
      matrixBody.innerHTML = '';
      const matrixList = d.productMatrix || [];
      if (matrixList.length === 0) {
        matrixBody.innerHTML = `<tr><td colspan="7" style="text-align: center; color: var(--text-muted);">${t('no_matrix_data')}</td></tr>`;
      } else {
        matrixList.forEach(p => {
          const tr = document.createElement('tr');
          let badgeClass = 'cow';
          if (p.matrixType === 'STAR') badgeClass = 'star';
          else if (p.matrixType === 'POTENTIAL') badgeClass = 'potential';
          else if (p.matrixType === 'DEAD_STOCK') badgeClass = 'dead';
          else if (p.matrixType === 'STOCKOUT_RISK') badgeClass = 'risk';

          let badgeLabel = p.matrixBadge;
          let badgeIconHtml = '';
          if (currentLang === 'en') {
            if (p.matrixType === 'STAR') { badgeLabel = 'Hero Star'; }
            else if (p.matrixType === 'POTENTIAL') { badgeLabel = 'High Margin'; }
            else if (p.matrixType === 'DEAD_STOCK') { badgeLabel = 'Zero Sales'; }
            else if (p.matrixType === 'STOCKOUT_RISK') { badgeLabel = 'Critical Stock'; }
            else { badgeLabel = 'Core Volume'; }
          } else {
            if (p.matrixType === 'STAR') { badgeLabel = 'Produk Bintang'; }
            else if (p.matrixType === 'POTENTIAL') { badgeLabel = 'Margin Tinggi'; }
            else if (p.matrixType === 'DEAD_STOCK') { badgeLabel = 'Stok Mati'; }
            else if (p.matrixType === 'STOCKOUT_RISK') { badgeLabel = 'Risiko Habis'; }
            else { badgeLabel = 'Volume Inti'; }
          }

          if (p.matrixType === 'STAR') {
            badgeIconHtml = `<svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.75" stroke-linecap="round" stroke-linejoin="round"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"></polygon></svg>`;
          } else if (p.matrixType === 'POTENTIAL') {
            badgeIconHtml = `<svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.75" stroke-linecap="round" stroke-linejoin="round"><polyline points="23 6 13.5 15.5 8.5 10.5 1 18"></polyline><polyline points="17 6 23 6 23 12"></polyline></svg>`;
          } else if (p.matrixType === 'DEAD_STOCK') {
            badgeIconHtml = `<svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.75" stroke-linecap="round" stroke-linejoin="round"><path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"></path><line x1="12" y1="9" x2="12" y2="13"></line><line x1="12" y1="17" x2="12.01" y2="17"></line></svg>`;
          } else if (p.matrixType === 'STOCKOUT_RISK') {
            badgeIconHtml = `<svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.75" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"></circle><line x1="12" y1="8" x2="12" y2="12"></line><line x1="12" y1="16" x2="12.01" y2="16"></line></svg>`;
          } else {
            badgeIconHtml = `<svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.75" stroke-linecap="round" stroke-linejoin="round"><path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"></path></svg>`;
          }

          tr.innerHTML = `
            <td><strong>${escapeHtml(p.nama)}</strong></td>
            <td>${escapeHtml(p.kategori)}</td>
            <td style="font-family: var(--font-mono); font-weight: 700;">${Number(p.qtySold) || 0}</td>
            <td style="font-family: var(--font-mono); color: var(--primary); font-weight: 700;">${formatRupiah(p.revenue)}</td>
            <td style="font-family: var(--font-mono); font-weight: 600;">${Number(p.marginPct) || 0}%</td>
            <td style="font-family: var(--font-mono); ${p.stok <= 5 ? 'color: var(--danger); font-weight: 700;' : ''}">${Number(p.stok) || 0} ${t('unit_label')}</td>
            <td><span class="matrix-badge ${badgeClass}">${badgeIconHtml}${escapeHtml(badgeLabel)}</span></td>
          `;
          matrixBody.appendChild(tr);
        });
      }
    }

    // ==========================================================================
    // SCROLL REVEAL SYSTEM (VARIED PER COMPONENT TYPE)
    // ==========================================================================
    const _prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    let _scrollObserver = null;

    function initScrollReveal() {
      if (_prefersReducedMotion) return;

      // Disconnect observer lama sebelum observasi ulang untuk mencegah penumpukan
      if (_scrollObserver) {
        _scrollObserver.disconnect();
      }

      _scrollObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            entry.target.classList.add('visible');
          } else {
            entry.target.classList.remove('visible');
          }
        });
      }, { threshold: 0.15 });

      // Group 1: KPI Statistic Cards (fade-in + pop scale 0.95 -> 1)
      document.querySelectorAll('#tabDashboard .kpi-card, #tabAnalytics .kpi-card').forEach((el, idx) => {
        el.classList.add('scroll-reveal-kpi');
        el.style.transitionDelay = `${Math.min(idx * 60, 300)}ms`;
        _scrollObserver.observe(el);
      });

      // Group 2: Table Rows (slide-in from left: translateX -20px -> 0 with 40ms stagger)
      const tableRowSelectors = [
        '#riwayatTableBody tr',
        '#produkTableBody tr',
        '#kategoriTableBody tr',
        '#laporanTableBody tr',
        '#analyticsMatrixBody tr',
        '#staffTableBody tr'
      ];
      tableRowSelectors.forEach(selector => {
        document.querySelectorAll(selector).forEach((el, idx) => {
          el.classList.add('scroll-reveal-row');
          el.style.transitionDelay = `${Math.min(idx * 40, 400)}ms`;
          _scrollObserver.observe(el);
        });
      });

      // Group 3: Charts & Graphs (fade container + progressive spline line draw)
      const chartSelectors = [
        '#dashboardDailyChartBox',
        '#analyticsHourlyBars',
        '#topSellingContainer'
      ];
      chartSelectors.forEach(selector => {
        document.querySelectorAll(selector).forEach((el, idx) => {
          el.classList.add('scroll-reveal-chart');
          el.style.transitionDelay = `${Math.min(idx * 80, 240)}ms`;
          _scrollObserver.observe(el);
        });
      });

      // Group 4: Analytics Cards (fade + translateY 16px + glow highlight 400ms)
      const insightSelectors = [
        '#analyticsPlusList .swot-card',
        '#analyticsMinusList .swot-card',
        '#analyticsRecList .rec-item-card',
        '#tabAnalytics .health-score-banner'
      ];
      insightSelectors.forEach(selector => {
        document.querySelectorAll(selector).forEach((el, idx) => {
          el.classList.add('scroll-reveal-insight');
          el.style.transitionDelay = `${Math.min(idx * 60, 360)}ms`;
          _scrollObserver.observe(el);
        });
      });

      // Group 5: General Dashboard Cards & Items
      const generalCardSelectors = [
        '#tabDashboard .ui-card:not(#dashboardDailyChartBox)',
        '#dashRecentTrxList .trx-item-row',
        '#dashLowStockList .low-stock-item',
        '#tabPengaturan .settings-card'
      ];
      generalCardSelectors.forEach(selector => {
        document.querySelectorAll(selector).forEach((el, idx) => {
          el.classList.add('scroll-reveal-card');
          el.style.transitionDelay = `${Math.min(idx * 50, 300)}ms`;
          _scrollObserver.observe(el);
        });
      });
    }

    // Auto-hook renderers to refresh scroll-reveal observers without collision
    function _wrapWithScrollReveal(fnName) {
      if (typeof window[fnName] === 'function') {
        const orig = window[fnName];
        window[fnName] = function(...args) {
          const res = orig.apply(this, args);
          setTimeout(initScrollReveal, 40);
          return res;
        };
      }
    }

    ['_origRenderAnalytics', 'renderAnalytics', 'renderProdukTable', 'renderKategoriTable', 'renderStaffTable', 'renderDailyOrdersChart', 'renderRecentTransactions', 'renderLowStock'].forEach(fn => {
      _wrapWithScrollReveal(fn);
    });

    document.addEventListener('DOMContentLoaded', () => {
      setTimeout(initScrollReveal, 300);
    });

    document.addEventListener('click', (e) => {
      const btn = e.target.closest('.nav-item-btn[data-tab]');
      if (btn) setTimeout(initScrollReveal, 400);
    });

    // =========================================================
    // SIDEBAR COLLAPSE / EXPAND TOGGLE
    // =========================================================
    (function initSidebarToggle() {
      const sidebar = document.getElementById('mainSidebar');
      const toggleBtn = document.getElementById('sidebarToggleBtn');
      if (!sidebar || !toggleBtn) return;

      const saved = localStorage.getItem('pos_sidebar_collapsed');
      if (saved === '1') {
        sidebar.classList.add('collapsed');
      }

      toggleBtn.addEventListener('click', () => {
        sidebar.classList.toggle('collapsed');
        const isCollapsed = sidebar.classList.contains('collapsed');
        localStorage.setItem('pos_sidebar_collapsed', isCollapsed ? '1' : '0');
      });
    })();

  