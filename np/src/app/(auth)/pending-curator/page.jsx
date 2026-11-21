import { requirePendingCurator } from "@/lib/session";
import DeleteAccountForm from "@/components/DeleteAccountForm";

export const metadata = { title: "Status Akun Curator" };

export default async function PendingCuratorPage() {
  const user = await requirePendingCurator();
  const rejected = user.curator_status === "rejected";

  return (
    <div className="space-y-5">
      <div>
        <h1 className="text-xl font-semibold text-deep-forest">
          {rejected ? "Pendaftaran Anda ditolak" : "Akun Anda sedang ditinjau."}
        </h1>
        <p className="mt-1 text-sm text-deep-forest/70">{user.display_name}</p>
      </div>

      {rejected ? (
        <>
          <p className="rounded-xl bg-red-50 px-4 py-3 text-sm text-red-700">
            Admin menolak pendaftaran Curator ini, sehingga dashboard tidak dapat diakses. Anda
            masih dapat menghapus akun ini.
          </p>
          <DeleteAccountForm />
        </>
      ) : (
        <p className="rounded-xl bg-sage/30 px-4 py-3 text-sm text-deep-forest">
          Admin sedang memeriksa pendaftaran Anda. Dashboard Curator dapat dipakai setelah akun
          disetujui. Silakan cek kembali nanti.
        </p>
      )}

      <form action="/api/auth/logout" method="post">
        <button
          type="submit"
          className="w-full rounded-xl border border-deep-forest/25 px-4 py-2.5 text-sm font-semibold text-deep-forest transition hover:bg-ivory"
        >
          Keluar
        </button>
      </form>
    </div>
  );
}