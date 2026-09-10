
  const TRANSLATIONS = {
    id: {
      brand_sub: 'Sistem kasir & manajemen toko',
      heading_login: 'Masuk',
      subhead_login: 'Selamat datang kembali! Masukkan akun Anda untuk melanjutkan.',
      label_email: 'Alamat Email',
      placeholder_email: 'nama@tokosaya.com',
      label_password: 'Kata Sandi',
      placeholder_password: 'Masukkan kata sandi',
      label_kode_toko: 'Kode Toko',
      placeholder_kode_toko: 'Contoh: DEMO01',
      hint_kode_toko: 'Kode Toko diberikan oleh admin toko Anda',
      label_remember_me: 'Ingat saya di perangkat ini',
      btn_login: 'Masuk',
      no_account_text: 'Belum punya akun?',
      link_register_new: 'Daftar toko baru',
      hero_title: 'Kelola transaksi tokomu<br>secepat kasir sungguhan',
      hero_sub: 'Sistem POS berbasis Google Sheets — mudah dikelola, tidak perlu server, data langsung tersimpan aman di akun Google Anda.',
      feat_multi_cashier: 'Multi-kasir',
      feat_auto_report: 'Laporan otomatis',
      feat_digital_receipt: 'Struk digital',
      feat_qris: 'QRIS ready',
      verifying: 'Memverifikasi...',
      err_email_invalid: 'Format email tidak valid.',
      err_email_required: 'Email wajib diisi.',
      err_pass_required: 'Kata sandi wajib diisi.',
      err_kode_required: 'Kode Toko wajib diisi (contoh: DEMO01).',
      toast_login_success: 'Login berhasil! Mengalihkan...',
      toast_login_failed: 'Login gagal. Periksa kembali data Anda.'
    },
    en: {
      brand_sub: 'POS Cashier & Store Management',
      heading_login: 'Login',
      subhead_login: 'Welcome back! Enter your credentials to continue.',
      label_email: 'Email Address',
      placeholder_email: 'name@mystore.com',
      label_password: 'Password',
      placeholder_password: 'Enter your password',
      label_kode_toko: 'Outlet Code',
      placeholder_kode_toko: 'e.g. DEMO01',
      hint_kode_toko: 'Outlet Code provided by your store administrator',
      label_remember_me: 'Remember me on this device',
      btn_login: 'Log In',
      no_account_text: "Don't have an account?",
      link_register_new: 'Register new store',
      hero_title: 'Manage store transactions<br>as fast as a real cashier',
      hero_sub: 'Google Sheets powered POS system — easy to use, serverless, data stored securely in your Google account.',
      feat_multi_cashier: 'Multi-cashier',
      feat_auto_report: 'Auto Reporting',
      feat_digital_receipt: 'Digital Receipts',
      feat_qris: 'QRIS Ready',
      verifying: 'Verifying...',
      err_email_invalid: 'Please enter a valid email format.',
      err_email_required: 'Email address is required.',
      err_pass_required: 'Password is required.',
      err_kode_required: 'Outlet Code is required (e.g. DEMO01).',
      toast_login_success: 'Login successful! Redirecting...',
      toast_login_failed: 'Login failed. Please check your credentials.'
    }
  };

  let currentLang = localStorage.getItem('pos_lang') || 'id';

  function t(key, def = '') {
    const dict = TRANSLATIONS[currentLang] || TRANSLATIONS.id;
    return dict[key] || def || key;
  }

  function applyLanguage(lang) {
    currentLang = (lang === 'en') ? 'en' : 'id';
    localStorage.setItem('pos_lang', currentLang);
    const dict = TRANSLATIONS[currentLang] || TRANSLATIONS.id;

    document.querySelectorAll('[data-i18n]').forEach(el => {
      const key = el.getAttribute('data-i18n');
      if (dict[key]) el.innerHTML = dict[key];
    });

    document.querySelectorAll('[data-i18n-placeholder]').forEach(el => {
      const key = el.getAttribute('data-i18n-placeholder');
      if (dict[key]) el.setAttribute('placeholder', dict[key]);
    });

    const badge = document.getElementById('loginLangBadge');
    if (badge) badge.textContent = currentLang.toUpperCase();
  }

  const form        = document.getElementById('loginForm');
  const btnLogin    = document.getElementById('btnLogin');
  const btnText     = document.getElementById('btnText');
  const inputEmail  = document.getElementById('email');
  const inputPass   = document.getElementById('password');
  const inputKode   = document.getElementById('kodeToko');
  const toggleIngat = document.getElementById('toggleIngat');

  document.addEventListener('DOMContentLoaded', () => {
    applyLanguage(currentLang);

    const btnLang = document.getElementById('btnLoginLangToggle');
    if (btnLang) {
      btnLang.addEventListener('click', () => {
        const next = currentLang === 'id' ? 'en' : 'id';
        applyLanguage(next);
      });
    }

    const initCode = "<?= initialKodeToko ?>";
    if (!initCode || initCode.trim() === '') {
      const saved = localStorage.getItem('pos_last_kode_toko');
      if (saved) inputKode.value = saved;
    }
    if (localStorage.getItem('pos_remember') === '1') {
      toggleIngat.checked = true;
      const savedEmail = localStorage.getItem('pos_rem_email');
      const savedKode  = localStorage.getItem('pos_rem_kode');
      if (savedEmail) inputEmail.value = savedEmail;
      if (savedKode && !inputKode.value) inputKode.value = savedKode;
    }
  });

  function showToast(msg, type = 'info') {
    const stack = document.getElementById('toastStack');
    const el = document.createElement('div');
    el.className = `toast-item ${type}`;
    el.textContent = msg;
    stack.appendChild(el);
    setTimeout(() => { el.style.opacity = '0'; el.style.transition = 'opacity 0.2s'; setTimeout(() => el.remove(), 220); }, 3200);
  }

  function setLoading(v) {
    if (v) {
      btnLogin.disabled = true;
      btnText.className = 'btn-loading-wrap';
      btnText.innerHTML = `<span class="spinner-sm"></span><span>${t('verifying')}</span>`;
    } else {
      btnLogin.disabled = false;
      btnText.className = '';
      btnText.textContent = t('btn_login');
    }
  }

  function clearErrors() {
    ['email', 'password', 'kodeToko'].forEach(id => document.getElementById(id).classList.remove('is-invalid'));
    ['errEmail', 'errPassword', 'errKodeToko'].forEach(id => document.getElementById(id).classList.remove('show'));
  }

  function showFieldError(inputId, errId, msg) {
    document.getElementById(inputId).classList.add('is-invalid');
    const el = document.getElementById(errId);
    el.textContent = msg;
    el.classList.add('show');
  }

  form.addEventListener('submit', (e) => {
    e.preventDefault();
    clearErrors();

    const em   = inputEmail.value.trim().toLowerCase();
    const pass = inputPass.value;
    const kode = inputKode.value.trim().toUpperCase();
    let hasError = false;

    if (!em || !em.includes('@') || !em.includes('.')) {
      showFieldError('email', 'errEmail', em ? t('err_email_invalid') : t('err_email_required'));
      hasError = true;
    }
    if (!pass) { showFieldError('password', 'errPassword', t('err_pass_required')); hasError = true; }
    if (!kode) { showFieldError('kodeToko', 'errKodeToko', t('err_kode_required')); hasError = true; }
    if (hasError) return;

    setLoading(true);

    google.script.run
      .withSuccessHandler(res => {
        setLoading(false);
        if (res && res.success) {
          showToast(t('toast_login_success'), 'success');

          sessionStorage.setItem('pos_token', res.token);
          sessionStorage.setItem('pos_user', JSON.stringify(res.user));
          localStorage.setItem('pos_token', res.token);
          localStorage.setItem('pos_user', JSON.stringify(res.user));

          if (res.user && res.user.kodeToko) {
            localStorage.setItem('pos_last_kode_toko', res.user.kodeToko);
          }
          if (toggleIngat.checked) {
            localStorage.setItem('pos_remember', '1');
            localStorage.setItem('pos_rem_email', em);
            localStorage.setItem('pos_rem_kode', kode);
          } else {
            ['pos_remember','pos_rem_email','pos_rem_kode'].forEach(k => localStorage.removeItem(k));
          }

          const targetPage = res.user.role === 'admin' ? 'admin' : 'kasir';
          const baseUrl = '<?= getScriptUrl() ?>';
          const token   = encodeURIComponent(res.token);

          function doRedirect(fullUrl) {
            // Metode 1: GAS native navigation (paling andal di iframe GAS)
            try {
              if (typeof google !== 'undefined' && google.script && google.script.url) {
                // GAS v2 - navigate langsung
                window.top.location.href = fullUrl;
                return;
              }
            } catch(e1) {}
            // Metode 2: parent frame
            try { window.parent.location.href = fullUrl; return; } catch(e2) {}
            // Metode 3: replace
            try { window.location.replace(fullUrl); return; } catch(e3) {}
            // Metode 4: assign biasa
            window.location.href = fullUrl;
          }

          if (baseUrl && baseUrl.startsWith('http')) {
            const redirectUrl = `${baseUrl}?page=${targetPage}&token=${token}`;
            console.log('[Login] Redirecting to:', redirectUrl);
            setTimeout(() => doRedirect(redirectUrl), 700);
          } else {
            // baseUrl kosong — ambil ulang dari server lalu redirect
            google.script.run
              .withSuccessHandler(function(url) {
                const redirectUrl = `${url}?page=${targetPage}&token=${token}`;
                console.log('[Login] Redirecting (fallback) to:', redirectUrl);
                setTimeout(() => doRedirect(redirectUrl), 700);
              })
              .withFailureHandler(function() {
                setTimeout(() => doRedirect(`?page=${targetPage}&token=${token}`), 700);
              })
              .getScriptUrl();
          }
        } else {
          showToast(res.message || t('toast_login_failed'), 'error');
        }
      })
      .withFailureHandler(err => {
        setLoading(false);
        showToast('Kesalahan server: ' + err.message, 'error');
      })
      .loginUser(em, pass, kode);
  });
