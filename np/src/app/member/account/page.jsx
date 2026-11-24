import { requireRole } from "@/lib/session";
import AccountForm from "@/components/member/AccountForm";

export const metadata = { title: "Akun" };

export default async function AccountPage() {
  const user = await requireRole("member");

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold text-deep-forest">Akun</h1>
        <p className="mt-1 text-sm text-deep-forest/70">
          Informasi privat untuk masuk ke TIGA. Tidak ditampilkan di profil publik.
        </p>
      </div>
      <AccountForm currentEmail={user.email} />
    </div>
  );
}
