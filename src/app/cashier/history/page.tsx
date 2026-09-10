import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";
import { CashierHistoryView } from "@/components/cashier/CashierHistoryView";

export const metadata = {
  title: "Riwayat Transaksi Saya | BrightPOS",
  description: "Riwayat transaksi yang diproses oleh kasir yang sedang login.",
};

export default async function CashierHistoryPage() {
  const session = await auth();

  // Guard: harus login, role apapun boleh (cashier maupun admin yang ada di kasir)
  if (!session?.user) {
    redirect("/login");
  }

  return (
    <CashierHistoryView
      cashierName={session.user.namaLengkap ?? session.user.name ?? "Kasir"}
      kodeToko={session.user.kodeToko ?? ""}
    />
  );
}
