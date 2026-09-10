import Link from "next/link";

export default function RegisterPage() {
  return (
    <div className="min-h-screen bg-[#F6F5F1] flex items-center justify-center p-6">
      <div className="max-w-md w-full bg-white rounded-lg border border-[#E4E1D8] shadow-sm p-8 text-center">
        <div className="w-12 h-12 bg-[#2B5D4F] text-white rounded-lg flex items-center justify-center font-heading font-extrabold text-lg mx-auto mb-4 shadow-sm">
          POS
        </div>
        <h1 className="text-xl font-bold font-heading text-[#141A17] mb-2">
          Pendaftaran Toko Baru
        </h1>
        <p className="text-xs text-[#737D78] mb-6 leading-relaxed">
          Fitur pendaftaran mandiri toko baru sedang dipersiapkan. Untuk mendaftarkan cabang/toko baru atau mendapatkan Kode Toko demo, silakan hubungi administrator sistem.
        </p>

        <div className="bg-[#EBF2EE] border border-[#2B5D4F]/20 rounded-md p-4 mb-6 text-left">
          <div className="text-xs font-bold text-[#2B5D4F] mb-1">
            💡 Menggunakan Akun Demo:
          </div>
          <div className="text-[11px] text-[#343D39] space-y-1">
            <div>• Kode Toko: <code className="font-mono font-bold">DEMO01</code></div>
            <div>• Admin: <code className="font-mono">admin@tokosaya.com</code> (pass: <code className="font-mono">admin123</code>)</div>
            <div>• Kasir: <code className="font-mono">kasir@tokosaya.com</code> (pass: <code className="font-mono">kasir123</code>)</div>
          </div>
        </div>

        <Link
          href="/login"
          className="inline-flex items-center justify-center w-full h-11 bg-[#2B5D4F] text-white font-heading font-semibold text-sm rounded-md hover:bg-[#224A3F] transition"
        >
          Kembali ke Halaman Masuk
        </Link>
      </div>
    </div>
  );
}
