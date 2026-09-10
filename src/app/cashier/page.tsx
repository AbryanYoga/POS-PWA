import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";
import { getPosCatalogData } from "@/lib/actions/pos-actions";
import { CashierPosView } from "@/components/cashier/CashierPosView";

export default async function CashierPage() {
  const session = await auth();

  if (!session?.user) {
    redirect("/login");
  }

  const res = await getPosCatalogData();

  if (!res.success || !res.data) {
    return (
      <div className="min-h-screen bg-[#F6F5F1] flex items-center justify-center p-6">
        <div className="bg-white p-8 rounded-lg border border-[#E4E1D8] shadow-sm text-center max-w-md">
          <h2 className="text-base font-bold text-[#B23A2E] mb-2 font-heading">
            Gagal Memuat Terminal Kasir
          </h2>
          <p className="text-xs text-[#737D78] mb-4">
            {res.message || "Terjadi kesalahan saat memproses data katalog kasir."}
          </p>
          <a
            href="/login"
            className="px-4 py-2 bg-[#2B5D4F] text-white text-xs font-semibold rounded-md inline-block"
          >
            Kembali ke Login
          </a>
        </div>
      </div>
    );
  }

  return <CashierPosView initialData={res.data} />;
}
