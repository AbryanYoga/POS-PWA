
    // =====================================================================
    // MULTI-LANGUAGE TRANSLATION DICTIONARY (i18n)
    // =====================================================================
    const TRANSLATIONS = {
      id: {
        pos_trx_label: 'Transaksi',
        pos_cashier_label: 'Kasir:',
        search_placeholder: 'Cari produk atau scan barcode...',
        view_grid_title: 'Tampilan Grid',
        view_list_title: 'Tampilan List',
        btn_logout_title: 'Keluar dari Kasir',
        btn_logout: 'Keluar',
        all_menus: 'Semua Menu',
        showing_label: 'Menampilkan',
        products_label: 'produk',
        all_categories: 'Semua Kategori',
        cart_title: 'Pesanan Saat Ini',
        cart_count_suffix: 'item',
        btn_clear_cart_title: 'Kosongkan Keranjang',
        btn_clear_cart: 'Kosongkan',
        cart_empty_title: 'Keranjang Masih Kosong',
        cart_empty_desc: 'Klik produk pada katalog sebelah kiri untuk menambahkan pesanan.',
        cart_subtotal: 'Subtotal',
        cart_total: 'Total',
        pay_cash: 'Tunai (Cash)',
        pay_qris: 'QRIS',
        placeholder_cash: 'Nominal Diterima',
        change_label: 'Kembalian:',
        qris_badge: 'QRIS Dinamis POS',
        qris_instruction: 'Scan melalui BCA, Mandiri, GoPay, OVO, DANA, ShopeePay',
        btn_pay_now: 'Lanjut Pembayaran',
        btn_proceed_payment: 'Lanjut Pembayaran',
        pay_modal_title: 'Pilih Metode Pembayaran',
        pay_step_1: 'Langkah 1 dari 2',
        pay_step_2_cash: 'Langkah 2 dari 2: Tunai',
        pay_step_2_noncash: 'Langkah 2 dari 2: Non-Tunai',
        pay_btn_process: 'Proses Pembayaran',
        pay_btn_confirm_noncash: 'Konfirmasi Pembayaran Diterima',
        pay_btn_back: 'Kembali',
        mobile_in_cart: 'item di keranjang',
        btn_open_cart: 'Buka Pesanan',
        receipt_success_title: 'Transaksi Berhasil',
        receipt_paid_tag: 'LUNAS',
        receipt_brand_sub: 'Sistem Kasir Digital',
        btn_print_receipt: 'Cetak Struk',
        btn_new_transaction: 'Transaksi Baru',
        stock_unit: 'Stok',
        stock_empty: 'Habis',
        stock_low: 'Tersisa',
        toast_session_expired: 'Sesi kasir telah berakhir. Mengalihkan ke login...',
        toast_item_added: 'ditambahkan ke keranjang',
        toast_cart_cleared: 'Keranjang pesanan dikosongkan.',
        toast_payment_success: 'Pembayaran berhasil diproses!',
        toast_cash_less: 'Nominal uang yang diterima kurang dari total belanja.',
        toast_cart_empty_warn: 'Keranjang belanja masih kosong.',
        toast_lang_switched: 'Bahasa diubah ke Bahasa Indonesia',
        loading_data: 'Memuat katalog produk toko...',
        loading_process: 'Memproses transaksi...',
        receipt_foot_1: 'Terima kasih atas kunjungan Anda!',
        receipt_foot_2: 'Barang yang sudah dibeli tidak dapat ditukar/dikembalikan.',
        receipt_lbl_trx: 'No. Trx',
        receipt_lbl_time: 'Waktu',
        receipt_lbl_cashier: 'Kasir',
        receipt_lbl_method: 'Metode',
        receipt_lbl_total: 'TOTAL',
        receipt_lbl_paid: 'BAYAR',
        receipt_lbl_change: 'KEMBALIAN',
        confirm_logout_title: 'Keluar dari Kasir?',
        confirm_logout_desc: 'Pastikan seluruh transaksi aktif telah selesai sebelum keluar.',
        confirm_logout_btn: 'Ya, Keluar',
        btn_cancel: 'Batal'
      },
      en: {
        pos_trx_label: 'Transaction',
        pos_cashier_label: 'Cashier:',
        search_placeholder: 'Search product or scan barcode...',
        view_grid_title: 'Grid View',
        view_list_title: 'List View',
        btn_logout_title: 'Logout from POS',
        btn_logout: 'Logout',
        all_menus: 'All Menus',
        showing_label: 'Showing',
        products_label: 'products',
        all_categories: 'All Categories',
        cart_title: 'Current Order',
        cart_count_suffix: 'items',
        btn_clear_cart_title: 'Clear Cart',
        btn_clear_cart: 'Clear',
        cart_empty_title: 'Cart is Currently Empty',
        cart_empty_desc: 'Click on any product in the left catalog to add it to order.',
        cart_subtotal: 'Subtotal',
        cart_total: 'Total',
        pay_cash: 'Cash',
        pay_qris: 'QRIS',
        placeholder_cash: 'Cash Received',
        change_label: 'Change:',
        qris_badge: 'Dynamic QRIS POS',
        qris_instruction: 'Scan with BCA, Mandiri, GoPay, OVO, DANA, ShopeePay',
        btn_pay_now: 'Proceed to Payment',
        btn_proceed_payment: 'Proceed to Payment',
        pay_modal_title: 'Select Payment Method',
        pay_step_1: 'Step 1 of 2',
        pay_step_2_cash: 'Step 2 of 2: Cash',
        pay_step_2_noncash: 'Step 2 of 2: Non-Cash',
        pay_btn_process: 'Process Payment',
        pay_btn_confirm_noncash: 'Confirm Payment Received',
        pay_btn_back: 'Back',
        mobile_in_cart: 'items in cart',
        btn_open_cart: 'Open Order',
        receipt_success_title: 'Transaction Successful',
        receipt_paid_tag: 'PAID',
        receipt_brand_sub: 'Digital POS System',
        btn_print_receipt: 'Print Receipt',
        btn_new_transaction: 'New Transaction',
        stock_unit: 'Stock',
        stock_empty: 'Out of stock',
        stock_low: 'Left',
        toast_session_expired: 'Your cashier session has expired. Redirecting to login...',
        toast_item_added: 'added to cart',
        toast_cart_cleared: 'Shopping cart cleared.',
        toast_payment_success: 'Payment processed successfully!',
        toast_cash_less: 'Cash received is less than total amount.',
        toast_cart_empty_warn: 'Shopping cart is empty.',
        toast_lang_switched: 'Language switched to English',
        loading_data: 'Loading product catalog...',
        loading_process: 'Processing transaction...',
        receipt_foot_1: 'Thank you for your visit!',
        receipt_foot_2: 'Purchased items cannot be exchanged or returned.',
        receipt_lbl_trx: 'Trx No.',
        receipt_lbl_time: 'Time',
        receipt_lbl_cashier: 'Cashier',
        receipt_lbl_method: 'Method',
        receipt_lbl_total: 'TOTAL',
        receipt_lbl_paid: 'PAID',
        receipt_lbl_change: 'CHANGE',
        confirm_logout_title: 'Logout from POS?',
        confirm_logout_desc: 'Make sure all active customer transactions are completed before logging out.',
        confirm_logout_btn: 'Yes, Logout',
        btn_cancel: 'Cancel'
      }
    };

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

    let currentUser = null;
    let rawCategories = [];
    let rawProducts = [];
    let activeCategory = 'ALL';
    let searchQuery = '';
    let isListView = false;
    let cart = [];
    let paymentMethod = 'Cash';
    let currentTrxSequence = 1;
    let currentLang = localStorage.getItem('pos_lang') || 'id';

    const CATEGORY_IMAGE_FALLBACKS = {
      food: [
        'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?auto=format&fit=crop&w=600&q=80',
        'https://images.unsplash.com/photo-1555396273-367ea4eb4db5?auto=format&fit=crop&w=600&q=80',
        'https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?auto=format&fit=crop&w=600&q=80'
      ],
      beverage: [
        'https://images.unsplash.com/photo-1541167760496-1628856ab772?auto=format&fit=crop&w=600&q=80',
        'https://images.unsplash.com/photo-1517701604599-bb29b565090c?auto=format&fit=crop&w=600&q=80',
        'https://images.unsplash.com/photo-1572490122747-3968b75cc699?auto=format&fit=crop&w=600&q=80'
      ],
      snack: [
        'https://images.unsplash.com/photo-1525351484163-7529414344d8?auto=format&fit=crop&w=600&q=80',
        'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?auto=format&fit=crop&w=600&q=80',
        'https://images.unsplash.com/photo-1578985545062-69928b1d9587?auto=format&fit=crop&w=600&q=80'
      ]
    };

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
      applyLanguage(currentLang);
      initClock();
      generateNextTrxNumber();
      setupEventListeners();
      loadKasirData();
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

    function redirectToAdmin() {
      const tkn = authToken || localStorage.getItem('pos_token') || sessionStorage.getItem('pos_token') || '';
      window.top.location.href = '<?= getScriptUrl() ?>?page=admin' + (tkn ? '&token=' + encodeURIComponent(tkn) : '');
    }

    function generateNextTrxNumber() {
      const now = new Date();
      const code = String(now.getHours()).padStart(2, '0') + String(now.getMinutes()).padStart(2, '0');
      const seq = String(currentTrxSequence).padStart(3, '0');
      document.getElementById('headerTrxNumber').textContent = `#TRX-${code}-${seq}`;
    }

    function initClock() {
      const clockEl = document.getElementById('liveClock');
      function update() {
        const now = new Date();
        clockEl.textContent = now.toLocaleTimeString(currentLang === 'en' ? 'en-US' : 'id-ID', { hour: '2-digit', minute: '2-digit', second: '2-digit' });
      }
      update();
      setInterval(update, 1000);
    }

    function applyLanguage(lang) {
      currentLang = (lang === 'en') ? 'en' : 'id';
      localStorage.setItem('pos_lang', currentLang);
      const dict = TRANSLATIONS[currentLang] || TRANSLATIONS.id;

      document.querySelectorAll('[data-i18n]').forEach(el => {
        const key = el.getAttribute('data-i18n');
        if (dict[key]) el.textContent = dict[key];
      });

      document.querySelectorAll('[data-i18n-placeholder]').forEach(el => {
        const key = el.getAttribute('data-i18n-placeholder');
        if (dict[key]) el.setAttribute('placeholder', dict[key]);
      });

      document.querySelectorAll('[data-i18n-title]').forEach(el => {
        const key = el.getAttribute('data-i18n-title');
        if (dict[key]) el.setAttribute('title', dict[key]);
      });

      const qBadge = document.getElementById('quickLangBadge');
      if (qBadge) qBadge.textContent = currentLang.toUpperCase();

      renderCategories();
      renderProducts();
      renderCart();
    }

    function setLanguage(lang) {
      applyLanguage(lang);
      showToast(t('toast_lang_switched'), 'info');
    }

    function toggleQuickLang() {
      const next = (currentLang === 'id') ? 'en' : 'id';
      setLanguage(next);
    }

    function showToast(message, type = 'info') {
      const tray = document.getElementById('toastTray');
      if (!tray) return;
      const toast = document.createElement('div');
      toast.className = `toast-card ${type}`;
      toast.textContent = message;
      tray.appendChild(toast);
      setTimeout(() => {
        toast.style.opacity = '0';
        toast.style.transform = 'translateY(-10px)';
        toast.style.transition = 'all 0.2s ease';
        setTimeout(() => toast.remove(), 200);
      }, 2800);
    }

    function showLoading(show, message = null) {
      const overlay = document.getElementById('loadingOverlay');
      if (!overlay) return;
      document.getElementById('loadingText').textContent = message || t('loading_data');
      if (show) overlay.classList.add('active');
      else overlay.classList.remove('active');
    }

    function formatRupiah(num) {
      return 'Rp ' + Number(num || 0).toLocaleString('id-ID');
    }

    function getProductImage(prod, index) {
      if (prod && prod.gambar && (prod.gambar.trim().startsWith('http') || prod.gambar.trim().startsWith('data:image'))) {
        return prod.gambar.trim();
      }
      const catName = (prod && prod.namaKategori ? prod.namaKategori : '').toLowerCase();
      const prodName = (prod && prod.nama ? prod.nama : '').toLowerCase();
      const fullText = catName + ' ' + prodName;

      let pool = CATEGORY_IMAGE_FALLBACKS.food;
      if (fullText.includes('minum') || fullText.includes('drink') || fullText.includes('kopi') || fullText.includes('coffee') || fullText.includes('tea') || fullText.includes('jus') || fullText.includes('latte') || fullText.includes('boba') || fullText.includes('beverage')) {
        pool = CATEGORY_IMAGE_FALLBACKS.beverage;
      } else if (fullText.includes('snack') || fullText.includes('cemil') || fullText.includes('roti') || fullText.includes('kue') || fullText.includes('cake') || fullText.includes('dessert') || fullText.includes('gorengan')) {
        pool = CATEGORY_IMAGE_FALLBACKS.snack;
      }

      const i = typeof index === 'number' ? index : 0;
      return pool[i % pool.length];
    }

    function getCategorySvgIcon(catName) {
      const name = (catName || '').toLowerCase();
      if (name.includes('makan') || name.includes('meal') || name.includes('food') || name.includes('nasi') || name.includes('dish')) {
        return `<svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M18 8h1a4 4 0 0 1 0 8h-1"></path><path d="M2 8h16v9a4 4 0 0 1-4 4H6a4 4 0 0 1-4-4V8z"></path><line x1="6" y1="1" x2="6" y2="4"></line><line x1="10" y1="1" x2="10" y2="4"></line><line x1="14" y1="1" x2="14" y2="4"></line></svg>`;
      } else if (name.includes('minum') || name.includes('drink') || name.includes('kopi') || name.includes('coffee') || name.includes('tea') || name.includes('beverage')) {
        return `<svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M17 8h1a4 4 0 1 1 0 8h-1"></path><path d="M3 8h14v9a4 4 0 0 1-4 4H7a4 4 0 0 1-4-4Z"></path><line x1="6" y1="2" x2="6" y2="4"></line><line x1="10" y1="2" x2="10" y2="4"></line><line x1="14" y1="2" x2="14" y2="4"></line></svg>`;
      } else if (name.includes('snack') || name.includes('cemil') || name.includes('roti') || name.includes('kue') || name.includes('pastry') || name.includes('dessert')) {
        return `<svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"></circle><path d="M8 12h.01M12 16h.01M16 12h.01M12 8h.01"></path></svg>`;
      }
      return `<svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polygon points="12 2 2 7 12 12 22 7 12 2"></polygon><polyline points="2 17 12 22 22 17"></polyline><polyline points="2 12 12 17 22 12"></polyline></svg>`;
    }

    function loadKasirData() {
      showLoading(true, t('loading_data'));
      google.script.run
        .withSuccessHandler(res => {
          showLoading(false);
          if (res && res.success) {
            currentUser = res.user;
            document.getElementById('headerCashierName').textContent = res.user.namaLengkap || res.user.email;
            if (res.user.namaToko) {
              document.getElementById('headerStoreBadge').textContent = res.user.namaToko;
            } else if (res.user.kodeToko) {
              document.getElementById('headerStoreBadge').textContent = `Outlet ${res.user.kodeToko}`;
            }

            rawCategories = res.categories || [];
            rawProducts = res.products || [];
            renderCategories();
            renderProducts();
          } else {
            const errMsg = res ? (res.message || 'Gagal memuat data kasir.') : 'Respons server tidak valid.';
            showGridError(errMsg);
            showToast(errMsg, 'error');
            if (errMsg.includes('Sesi') || errMsg.includes('berakhir') || errMsg.includes('login')) {
              setTimeout(() => redirectToLogin(), 2500);
            }
          }
        })
        .withFailureHandler(err => {
          showLoading(false);
          const errMsg = 'Koneksi terputus: ' + (err.message || 'Tidak dapat menghubungi server.');
          showGridError(errMsg);
          showToast(errMsg, 'error');
        })
        .getKasirData(authToken);
    }

    function showGridError(message) {
      const grid = document.getElementById('productGrid');
      if (!grid) return;
      grid.innerHTML = `
        <div class="empty-catalog-box" style="grid-column: 1/-1;">
          <div class="empty-catalog-icon" style="color: var(--danger);">
            <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round">
              <circle cx="12" cy="12" r="10"></circle>
              <line x1="12" y1="8" x2="12" y2="12"></line>
              <line x1="12" y1="16" x2="12.01" y2="16"></line>
            </svg>
          </div>
          <div style="font-family: var(--font-heading); font-size: 15px; font-weight: 600; color: var(--danger); margin-bottom: 6px;">${currentLang === 'en' ? 'Failed to Load Products' : 'Gagal Memuat Produk'}</div>
          <div style="font-size: 12.5px; color: var(--text-muted); max-width: 320px; text-align: center; margin-bottom: 16px;">${escapeHtml(message)}</div>
          <button type="button" onclick="loadKasirData()" style="background: var(--primary); color: #fff; border: none; border-radius: var(--radius); padding: 8px 20px; font-size: 13px; font-weight: 600; cursor: pointer;">
            ↺ ${currentLang === 'en' ? 'Try Again' : 'Coba Lagi'}
          </button>
        </div>
      `;
    }

    function renderCategories() {
      const container = document.getElementById('categoryChips');
      if (!container) return;
      container.innerHTML = '';

      // All Menus Chip
      const allBtn = document.createElement('button');
      allBtn.type = 'button';
      allBtn.className = `cat-pill ${activeCategory === 'ALL' ? 'active' : ''}`;
      allBtn.dataset.id = 'ALL';
      allBtn.innerHTML = `
        <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
          <rect x="3" y="3" width="7" height="7"></rect>
          <rect x="14" y="3" width="7" height="7"></rect>
          <rect x="14" y="14" width="7" height="7"></rect>
          <rect x="3" y="14" width="7" height="7"></rect>
        </svg>
        <span>${t('all_menus')}</span>
      `;
      allBtn.addEventListener('click', () => selectCategory('ALL', t('all_categories')));
      container.appendChild(allBtn);

      rawCategories.forEach(cat => {
        const btn = document.createElement('button');
        btn.type = 'button';
        btn.className = `cat-pill ${activeCategory === cat.id ? 'active' : ''}`;
        btn.dataset.id = cat.id;
        btn.innerHTML = `${getCategorySvgIcon(cat.nama)} <span>${escapeHtml(cat.nama)}</span>`;
        btn.addEventListener('click', () => selectCategory(cat.id, cat.nama));
        container.appendChild(btn);
      });
    }

    function selectCategory(catId, catName) {
      activeCategory = catId;
      document.querySelectorAll('.cat-pill').forEach(btn => {
        if (btn.dataset.id === catId) btn.classList.add('active');
        else btn.classList.remove('active');
      });
      const lbl = document.getElementById('filterCategoryLabel');
      if (lbl) lbl.textContent = catName;
      renderProducts();
    }

    function renderProducts() {
      const grid = document.getElementById('productGrid');
      if (!grid) return;

      const filtered = rawProducts.filter(p => {
        if (p.status === 'Nonaktif') return false;
        const matchCategory = (activeCategory === 'ALL' || p.kategoriId === activeCategory);
        const matchSearch = !searchQuery || 
          p.nama.toLowerCase().includes(searchQuery.toLowerCase()) || 
          (p.barcode && p.barcode.toLowerCase().includes(searchQuery.toLowerCase())) ||
          (p.namaKategori && p.namaKategori.toLowerCase().includes(searchQuery.toLowerCase()));
        return matchCategory && matchSearch;
      });

      const countEl = document.getElementById('productCountLabel');
      if (countEl) countEl.textContent = filtered.length;

      if (filtered.length === 0) {
        grid.innerHTML = `
          <div class="empty-catalog-box">
            <div class="empty-catalog-icon">
              <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round">
                <circle cx="11" cy="11" r="8"></circle>
                <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
              </svg>
            </div>
            <div style="font-family: var(--font-heading); font-size: 15px; font-weight: 600; color: var(--text-heading);">${currentLang === 'en' ? 'No Products Found' : 'Produk Tidak Ditemukan'}</div>
            <div style="font-size: 12.5px; color: var(--text-muted); max-width: 260px;">${currentLang === 'en' ? 'Try adjusting your search query or selecting a different category.' : 'Coba ubah kata kunci pencarian atau pilih kategori menu yang lain.'}</div>
          </div>
        `;
        return;
      }

      grid.innerHTML = '';
      filtered.forEach((p, idx) => {
        const isOutOfStock = (Number(p.stok) <= 0);
        const isLowStock = (Number(p.stok) <= (p.minStok || 5) && !isOutOfStock);

        let stockBadgeClass = 'normal';
        let stockText = `${p.stok} ${t('stock_unit')}`;
        if (isOutOfStock) {
          stockBadgeClass = 'danger';
          stockText = t('stock_empty');
        } else if (isLowStock) {
          stockBadgeClass = 'warning';
          stockText = `${t('stock_low')} ${p.stok}`;
        }

        const card = document.createElement('div');
        card.className = `product-card ${isOutOfStock ? 'dimmed-out' : ''}`;
        card.innerHTML = `
          <div class="product-image-box">
            <img src="${getProductImage(p, idx)}" alt="${escapeHtml(p.nama)}" class="product-img" loading="lazy">
            <span class="stock-badge-corner ${stockBadgeClass}">${stockText}</span>
          </div>
          <div class="product-body">
            <div>
              <div class="product-category-lbl">${escapeHtml(p.namaKategori || 'MENU')}</div>
              <div class="product-title-txt" title="${escapeHtml(p.nama)}">${escapeHtml(p.nama)}</div>
            </div>
            <div class="product-price-row">
              <div class="product-price-txt">${formatRupiah(p.hargaJual)}</div>
              <div class="product-add-indicator">+</div>
            </div>
          </div>
        `;

        if (!isOutOfStock) {
          card.addEventListener('click', () => addToCart(p));
        }

        grid.appendChild(card);
      });
    }

    function addToCart(product) {
      const existing = cart.find(item => item.id === product.id);
      if (existing) {
        if (existing.qty >= product.stok) {
          showToast(currentLang === 'en' ? `Stock limit reached for "${product.nama}"` : `Stok "${product.nama}" tersisa ${product.stok}.`, 'warning');
          return;
        }
        existing.qty += 1;
      } else {
        cart.push({
          id: product.id,
          nama: product.nama,
          hargaJual: product.hargaJual,
          hargaBeli: product.hargaBeli || 0,
          stok: product.stok,
          qty: 1,
          gambar: product.gambar || ''
        });
      }
      renderCart();
      showToast(`"${product.nama}" ${t('toast_item_added')}`, 'info');
    }

    function updateQty(productId, delta) {
      const item = cart.find(i => i.id === productId);
      if (!item) return;

      const newQty = item.qty + delta;
      if (newQty <= 0) {
        removeFromCart(productId);
        return;
      }
      if (newQty > item.stok) {
        showToast(currentLang === 'en' ? `Stock limit reached for "${item.nama}"` : `Maksimal stok tercapai (${item.stok}).`, 'warning');
        return;
      }
      item.qty = newQty;
      renderCart();
    }

    function removeFromCart(productId) {
      cart = cart.filter(i => i.id !== productId);
      renderCart();
    }

    function clearCart() {
      if (cart.length === 0) return;
      cart = [];
      renderCart();
      showToast(t('toast_cart_cleared'), 'info');
    }

    function calculateTotals() {
      const totalQty = cart.reduce((sum, item) => sum + item.qty, 0);
      const subtotal = cart.reduce((sum, item) => sum + (item.qty * item.hargaJual), 0);
      const grandTotal = subtotal;
      return { totalQty, subtotal, grandTotal };
    }

    function renderCart() {
      const container = document.getElementById('cartItemsContainer');
      const countBadge = document.getElementById('cartCountBadge');
      const mobileBadge = document.getElementById('mobileCountBadge');
      const subtotalText = document.getElementById('cartSubtotalText');
      const grandTotalText = document.getElementById('cartGrandTotalText');
      const mobileGrandTotalText = document.getElementById('mobileGrandTotalText');
      const btnCheckout = document.getElementById('btnCheckout');

      const { totalQty, subtotal, grandTotal } = calculateTotals();

      if (countBadge) countBadge.textContent = `${totalQty} ${t('cart_count_suffix')}`;
      if (mobileBadge) mobileBadge.textContent = totalQty;
      if (subtotalText) subtotalText.textContent = formatRupiah(subtotal);
      if (grandTotalText) grandTotalText.textContent = formatRupiah(grandTotal);
      if (mobileGrandTotalText) mobileGrandTotalText.textContent = formatRupiah(grandTotal);

      if (cart.length === 0) {
        if (container) {
          container.innerHTML = `
            <div class="cart-empty-view">
              <div class="cart-empty-icon-wrap">
                <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.75" stroke-linecap="round" stroke-linejoin="round">
                  <circle cx="9" cy="21" r="1"></circle>
                  <circle cx="20" cy="21" r="1"></circle>
                  <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"></path>
                </svg>
              </div>
              <div class="cart-empty-title">${t('cart_empty_title')}</div>
              <div class="cart-empty-desc">${t('cart_empty_desc')}</div>
            </div>
          `;
        }
        if (btnCheckout) btnCheckout.disabled = true;
        return;
      }

      if (container) {
        container.innerHTML = '';
        cart.forEach((item, idx) => {
          const row = document.createElement('div');
          row.className = 'cart-item-card';
          row.innerHTML = `
            <div class="cart-item-main">
              <img src="${getProductImage(item, idx)}" alt="${escapeHtml(item.nama)}" class="cart-item-thumb">
              <div class="cart-item-meta">
                <div class="cart-item-name" title="${escapeHtml(item.nama)}">${escapeHtml(item.nama)}</div>
                <div class="cart-item-unit-price">${formatRupiah(item.hargaJual)}</div>
              </div>
              <button type="button" class="btn-delete-cart-item" data-id="${item.id}" title="${currentLang === 'en' ? 'Remove item' : 'Hapus item'}">
                <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                  <polyline points="3 6 5 6 21 6"></polyline>
                  <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path>
                </svg>
              </button>
            </div>
            <div class="cart-item-controls-row">
              <div class="qty-stepper-box">
                <button type="button" class="stepper-btn btn-qty-minus" data-id="${item.id}">−</button>
                <span class="stepper-qty-val">${item.qty}</span>
                <button type="button" class="stepper-btn btn-qty-plus" data-id="${item.id}">+</button>
              </div>
              <div class="cart-item-subtotal-val">${formatRupiah(item.qty * item.hargaJual)}</div>
            </div>
          `;

          row.querySelector('.btn-qty-minus').addEventListener('click', () => updateQty(item.id, -1));
          row.querySelector('.btn-qty-plus').addEventListener('click', () => updateQty(item.id, 1));
          row.querySelector('.btn-delete-cart-item').addEventListener('click', () => removeFromCart(item.id));

          container.appendChild(row);
        });
      }

      if (btnCheckout) btnCheckout.disabled = false;
    }

    // =========================================================================
    // PAYMENT WIZARD POPUP CONTROLLER (MULTI-STEP)
    // =========================================================================
    let selectedNonCashChannel = 'QRIS';

    function openPaymentModal() {
      if (cart.length === 0) {
        showToast(t('toast_cart_empty_warn'), 'warning');
        return;
      }

      const cartPanel = document.getElementById('cartPanel');
      if (cartPanel) cartPanel.classList.remove('open-drawer');

      const { grandTotal } = calculateTotals();
      const billEl = document.getElementById('modalBillAmount');
      if (billEl) billEl.textContent = formatRupiah(grandTotal);

      goToStep1();

      const modal = document.getElementById('paymentModal');
      if (modal) modal.classList.add('active');
    }

    function closePaymentModal() {
      const modal = document.getElementById('paymentModal');
      if (modal) modal.classList.remove('active');
    }

    function goToStep1() {
      const view1 = document.getElementById('payStep1View');
      const view2a = document.getElementById('payStep2CashView');
      const view2b = document.getElementById('payStep2NonCashView');
      if (view1) view1.classList.add('active');
      if (view2a) view2a.classList.remove('active');
      if (view2b) view2b.classList.remove('active');

      const titleEl = document.getElementById('paymentModalTitle');
      const stepPill = document.getElementById('paymentStepPill');
      if (titleEl) titleEl.textContent = t('pay_modal_title', 'Pilih Metode Pembayaran');
      if (stepPill) stepPill.textContent = t('pay_step_1', 'Langkah 1 dari 2');
    }

    function goToStep2Cash() {
      const view1 = document.getElementById('payStep1View');
      const view2a = document.getElementById('payStep2CashView');
      const view2b = document.getElementById('payStep2NonCashView');
      if (view1) view1.classList.remove('active');
      if (view2a) view2a.classList.add('active');
      if (view2b) view2b.classList.remove('active');

      const titleEl = document.getElementById('paymentModalTitle');
      const stepPill = document.getElementById('paymentStepPill');
      if (titleEl) titleEl.textContent = (currentLang === 'en') ? 'Cash Payment' : 'Pembayaran Tunai (Cash)';
      if (stepPill) stepPill.textContent = t('pay_step_2_cash', 'Langkah 2 dari 2: Tunai');

      const inputCash = document.getElementById('modalInputCash');
      const changeCard = document.getElementById('modalChangeCard');
      const changeAmount = document.getElementById('modalChangeAmount');
      const btnSubmit = document.getElementById('btnSubmitCashPayment');

      if (inputCash) {
        inputCash.value = '';
        setTimeout(() => inputCash.focus(), 150);
      }
      if (changeCard) changeCard.className = 'modal-change-card';
      if (changeAmount) changeAmount.textContent = 'Rp 0';
      if (btnSubmit) btnSubmit.disabled = true;
    }

    function handleCashInput() {
      const inputCash = document.getElementById('modalInputCash');
      const changeCard = document.getElementById('modalChangeCard');
      const changeAmount = document.getElementById('modalChangeAmount');
      const btnSubmit = document.getElementById('btnSubmitCashPayment');
      if (!inputCash) return;

      const raw = inputCash.value.replace(/[^0-9]/g, '');
      const cashGiven = parseInt(raw, 10) || 0;
      inputCash.value = raw ? Number(raw).toLocaleString('id-ID') : '';

      const { grandTotal } = calculateTotals();

      if (cashGiven === 0) {
        if (changeCard) changeCard.className = 'modal-change-card';
        if (changeAmount) changeAmount.textContent = 'Rp 0';
        if (btnSubmit) btnSubmit.disabled = true;
        return;
      }

      const change = cashGiven - grandTotal;
      if (change >= 0) {
        if (changeCard) changeCard.className = 'modal-change-card valid';
        if (changeAmount) changeAmount.textContent = formatRupiah(change);
        if (btnSubmit) btnSubmit.disabled = false;
      } else {
        if (changeCard) changeCard.className = 'modal-change-card underpaid';
        if (changeAmount) changeAmount.textContent = `-${formatRupiah(Math.abs(change))}`;
        if (btnSubmit) btnSubmit.disabled = true;
      }
    }

    function applyCashPreset(preset) {
      const { grandTotal } = calculateTotals();
      let val = 0;
      if (preset === 'pas') {
        val = grandTotal;
      } else {
        val = parseInt(preset, 10) || 0;
      }

      const inputCash = document.getElementById('modalInputCash');
      if (inputCash) {
        inputCash.value = Number(val).toLocaleString('id-ID');
        handleCashInput();
      }
    }

    function goToStep2NonCash() {
      const view1 = document.getElementById('payStep1View');
      const view2a = document.getElementById('payStep2CashView');
      const view2b = document.getElementById('payStep2NonCashView');
      if (view1) view1.classList.remove('active');
      if (view2a) view2a.classList.remove('active');
      if (view2b) view2b.classList.add('active');

      const titleEl = document.getElementById('paymentModalTitle');
      const stepPill = document.getElementById('paymentStepPill');
      if (titleEl) titleEl.textContent = (currentLang === 'en') ? 'Non-Cash Payment' : 'Pembayaran Non-Tunai';
      if (stepPill) stepPill.textContent = t('pay_step_2_noncash', 'Langkah 2 dari 2: Non-Tunai');

      selectNonCashChannel(selectedNonCashChannel || 'QRIS');
    }

    function selectNonCashChannel(channelName) {
      selectedNonCashChannel = channelName;

      document.querySelectorAll('#nonCashChannelList .noncash-channel-card').forEach(card => {
        card.classList.toggle('active', card.dataset.channel === channelName);
      });

      const instBox = document.getElementById('nonCashInstructionBox');
      if (!instBox) return;

      const storeName = (currentUser && currentUser.namaToko) ? currentUser.namaToko : 'POINT OF SALES';

      if (channelName === 'QRIS') {
        instBox.innerHTML = `
          <div class="noncash-qr-frame">
            <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="var(--primary)" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round">
              <rect x="3" y="3" width="7" height="7"></rect>
              <rect x="14" y="3" width="7" height="7"></rect>
              <rect x="3" y="14" width="7" height="7"></rect>
              <rect x="14" y="14" width="3" height="3"></rect>
              <rect x="18" y="18" width="3" height="3"></rect>
              <rect x="14" y="18" width="3" height="3"></rect>
              <rect x="18" y="14" width="3" height="3"></rect>
            </svg>
          </div>
          <div class="noncash-guide-text">
            <div class="guide-title">QRIS Dinamis POS (${escapeHtml(storeName)})</div>
            <div class="guide-desc">Scan melalui BCA, Mandiri, GoPay, OVO, DANA, ShopeePay. Pastikan notifikasi berhasil muncul pada aplikasi pelanggan.</div>
          </div>
        `;
      } else {
        instBox.innerHTML = `
          <div class="noncash-qr-frame">
            <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="var(--primary)" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <line x1="3" y1="21" x2="21" y2="21"></line>
              <line x1="3" y1="10" x2="21" y2="10"></line>
              <polyline points="5 6 12 3 19 6"></polyline>
              <line x1="6" y1="10" x2="6" y2="21"></line>
              <line x1="10" y1="10" x2="10" y2="21"></line>
              <line x1="14" y1="10" x2="14" y2="21"></line>
              <line x1="18" y1="10" x2="18" y2="21"></line>
            </svg>
          </div>
          <div class="noncash-guide-text">
            <div class="guide-title">${escapeHtml(channelName)} - Virtual Account / Transfer</div>
            <div class="guide-desc">Rekening Outlet: <strong>8801-0812-9981</strong> a/n <strong>${escapeHtml(storeName)}</strong>. Pastikan mutasi dana telah masuk sebelum menekan konfirmasi.</div>
          </div>
        `;
      }
    }

    function executePayment(metode, bayar, kembalian) {
      const { grandTotal } = calculateTotals();
      if (cart.length === 0) {
        showToast(t('toast_cart_empty_warn'), 'warning');
        return;
      }

      closePaymentModal();

      const trxNumber = document.getElementById('headerTrxNumber').textContent;
      const payload = {
        id: trxNumber,
        items: cart.map(i => ({ id: i.id, nama: i.nama, qty: i.qty, hargaJual: i.hargaJual, hargaBeli: i.hargaBeli, subtotal: i.qty * i.hargaJual })),
        total: grandTotal,
        bayar: bayar,
        kembalian: kembalian,
        metode: metode,
        kasir: (currentUser ? (currentUser.namaLengkap || currentUser.email) : 'Kasir')
      };

      showLoading(true, t('loading_process'));
      google.script.run
        .withSuccessHandler(res => {
          showLoading(false);
          if (res && res.success) {
            showToast(t('toast_payment_success'), 'success');
            showReceiptModal(payload);
            currentTrxSequence += 1;
            generateNextTrxNumber();
            cart = [];
            renderCart();
            loadKasirData();
          } else {
            showToast(res ? (res.message || 'Gagal memproses transaksi.') : 'Gagal memproses transaksi.', 'error');
          }
        })
        .withFailureHandler(err => {
          showLoading(false);
          showToast('Kesalahan server: ' + err.message, 'error');
        })
        .prosesTransaksi(authToken, cart, bayar, metode);
    }

    function showReceiptModal(tx) {
      const modal = document.getElementById('receiptModal');
      if (!modal) return;

      const storeTitle = (currentUser && currentUser.namaToko) ? currentUser.namaToko : 'POINT OF SALES';
      document.getElementById('recStoreTitle').textContent = storeTitle;
      document.getElementById('recStoreSub').textContent = t('receipt_brand_sub');

      document.getElementById('recTrxId').textContent = tx.id;
      document.getElementById('recTime').textContent = new Date().toLocaleString(currentLang === 'en' ? 'en-US' : 'id-ID');
      document.getElementById('recCashier').textContent = tx.kasir;
      document.getElementById('recPaymentMethod').textContent = tx.metode;

      const itemsTable = document.getElementById('recItemsTable');
      itemsTable.innerHTML = '';
      tx.items.forEach(it => {
        const row = document.createElement('tr');
        row.innerHTML = `
          <td colspan="2" style="font-weight: 600;">${escapeHtml(it.nama)}</td>
        `;
        const rowPrice = document.createElement('tr');
        rowPrice.innerHTML = `
          <td style="color: #666; font-size: 11px;">${it.qty} x ${formatRupiah(it.hargaJual)}</td>
          <td style="text-align: right; font-weight: 600;">${formatRupiah(it.subtotal)}</td>
        `;
        itemsTable.appendChild(row);
        itemsTable.appendChild(rowPrice);
      });

      document.getElementById('recTotal').textContent = formatRupiah(tx.total);
      document.getElementById('recPayLabel').textContent = tx.metode.toUpperCase();
      document.getElementById('recPay').textContent = formatRupiah(tx.bayar);
      document.getElementById('recChange').textContent = formatRupiah(tx.kembalian);

      const footEl = document.querySelector('.receipt-footnote');
      if (footEl) {
        footEl.innerHTML = `${t('receipt_foot_1')}<br>${t('receipt_foot_2')}`;
      }

      modal.classList.add('active');
    }

    function setupEventListeners() {
      // Search Box
      const searchInput = document.getElementById('searchInput');
      const btnSearchClear = document.getElementById('btnSearchClear');
      if (searchInput) {
        searchInput.addEventListener('input', (e) => {
          searchQuery = e.target.value.trim();
          if (btnSearchClear) {
            btnSearchClear.classList.toggle('active', searchQuery.length > 0);
          }
          renderProducts();
        });
      }

      if (btnSearchClear && searchInput) {
        btnSearchClear.addEventListener('click', () => {
          searchInput.value = '';
          searchQuery = '';
          btnSearchClear.classList.remove('active');
          renderProducts();
        });
      }

      // View switcher
      const btnGrid = document.getElementById('btnViewGrid');
      const btnList = document.getElementById('btnViewList');
      const prodGrid = document.getElementById('productGrid');

      if (btnGrid && btnList && prodGrid) {
        btnGrid.addEventListener('click', () => {
          btnGrid.classList.add('active');
          btnList.classList.remove('active');
          prodGrid.classList.remove('list-view');
        });
        btnList.addEventListener('click', () => {
          btnList.classList.add('active');
          btnGrid.classList.remove('active');
          prodGrid.classList.add('list-view');
        });
      }

      // Clear Cart Button
      const btnClearCart = document.getElementById('btnClearCart');
      if (btnClearCart) btnClearCart.addEventListener('click', clearCart);

      // Main Proceed Payment Button
      const btnCheckout = document.getElementById('btnCheckout');
      if (btnCheckout) btnCheckout.addEventListener('click', openPaymentModal);

      // Payment Modal Navigation & Controls
      const btnClosePaymentModal = document.getElementById('btnClosePaymentModal');
      const btnCancelStep1 = document.getElementById('btnCancelStep1');
      const paymentModal = document.getElementById('paymentModal');

      if (btnClosePaymentModal) btnClosePaymentModal.addEventListener('click', closePaymentModal);
      if (btnCancelStep1) btnCancelStep1.addEventListener('click', closePaymentModal);
      if (paymentModal) {
        paymentModal.addEventListener('click', (e) => {
          if (e.target === paymentModal) closePaymentModal();
        });
      }

      // Step 1 Choice Buttons
      const btnSelectTypeCash = document.getElementById('btnSelectTypeCash');
      const btnSelectTypeNonCash = document.getElementById('btnSelectTypeNonCash');
      if (btnSelectTypeCash) btnSelectTypeCash.addEventListener('click', goToStep2Cash);
      if (btnSelectTypeNonCash) btnSelectTypeNonCash.addEventListener('click', goToStep2NonCash);

      // Step 2A Cash Controls
      const btnBackFromCash = document.getElementById('btnBackFromCash');
      if (btnBackFromCash) btnBackFromCash.addEventListener('click', goToStep1);

      const modalInputCash = document.getElementById('modalInputCash');
      if (modalInputCash) {
        modalInputCash.addEventListener('input', handleCashInput);
      }

      document.querySelectorAll('#cashPresetChips .btn-quick-preset').forEach(btn => {
        btn.addEventListener('click', () => applyCashPreset(btn.dataset.preset));
      });

      const btnSubmitCashPayment = document.getElementById('btnSubmitCashPayment');
      if (btnSubmitCashPayment) {
        btnSubmitCashPayment.addEventListener('click', () => {
          const raw = (document.getElementById('modalInputCash')?.value || '').replace(/[^0-9]/g, '');
          const cashGiven = parseInt(raw, 10) || 0;
          const { grandTotal } = calculateTotals();
          if (cashGiven < grandTotal) {
            showToast(t('toast_cash_less'), 'error');
            return;
          }
          executePayment('Cash', cashGiven, cashGiven - grandTotal);
        });
      }

      // Step 2B Non-Cash Controls
      const btnBackFromNonCash = document.getElementById('btnBackFromNonCash');
      if (btnBackFromNonCash) btnBackFromNonCash.addEventListener('click', goToStep1);

      document.querySelectorAll('#nonCashChannelList .noncash-channel-card').forEach(card => {
        card.addEventListener('click', () => selectNonCashChannel(card.dataset.channel));
      });

      const btnSubmitNonCashPayment = document.getElementById('btnSubmitNonCashPayment');
      if (btnSubmitNonCashPayment) {
        btnSubmitNonCashPayment.addEventListener('click', () => {
          const { grandTotal } = calculateTotals();
          executePayment(selectedNonCashChannel || 'QRIS', grandTotal, 0);
        });
      }

      // Mobile Drawer Controls
      const btnOpenMobile = document.getElementById('btnOpenMobileCart');
      const btnCloseDrawer = document.getElementById('btnCloseDrawer');
      const cartPanel = document.getElementById('cartPanel');

      if (btnOpenMobile && cartPanel) {
        btnOpenMobile.addEventListener('click', () => cartPanel.classList.add('open-drawer'));
      }
      if (btnCloseDrawer && cartPanel) {
        btnCloseDrawer.addEventListener('click', () => cartPanel.classList.remove('open-drawer'));
      }

      // Receipt Print & New Trx Buttons
      const btnPrint = document.getElementById('btnPrintReceipt');
      const btnNewTx = document.getElementById('btnNewTransaction');
      const receiptModal = document.getElementById('receiptModal');

      if (btnPrint) {
        btnPrint.addEventListener('click', () => window.print());
      }
      if (btnNewTx && receiptModal) {
        btnNewTx.addEventListener('click', () => receiptModal.classList.remove('active'));
      }

      // Custom Confirmation Modal for Logout
      const btnLogout = document.getElementById('btnLogout');
      const modalConfirm = document.getElementById('modalConfirmDialog');
      const btnCancelConfirm = document.getElementById('btnCancelConfirm');
      const btnAcceptConfirm = document.getElementById('btnAcceptConfirm');

      if (btnLogout && modalConfirm) {
        btnLogout.addEventListener('click', () => {
          modalConfirm.classList.add('active');
        });
      }

      if (btnCancelConfirm && modalConfirm) {
        btnCancelConfirm.addEventListener('click', () => {
          modalConfirm.classList.remove('active');
        });
      }

      if (modalConfirm) {
        modalConfirm.addEventListener('click', (e) => {
          if (e.target === modalConfirm) modalConfirm.classList.remove('active');
        });
      }

      if (btnAcceptConfirm) {
        btnAcceptConfirm.addEventListener('click', () => {
          modalConfirm.classList.remove('active');
          showLoading(true, currentLang === 'en' ? 'Logging out...' : 'Keluar dari kasir...');
          sessionStorage.removeItem('pos_token');
          localStorage.removeItem('pos_token');
          setTimeout(() => redirectToLogin(), 300);
        });
      }

      // Quick Lang Toggle
      const btnLang = document.getElementById('btnQuickLangToggle');
      if (btnLang) {
        btnLang.addEventListener('click', toggleQuickLang);
      }
    }
  