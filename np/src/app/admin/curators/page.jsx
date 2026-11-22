import Link from "next/link";
import { requireRole } from "@/lib/session";
import { listCuratorsByStatus, countCuratorsByStatus } from "@/lib/adminUsers";
import { formatDate } from "@/lib/format";
import ActionButton from "@/components/admin/ActionButton";
import { approveCuratorAction, rejectCuratorAction } from "./actions";

export const metadata = { title: "Verifikasi Curator" };

const STATUSES = [
  { value: "pending", label: "Menunggu" },
  { value: "approved", label: "Disetujui" },
  { value: "rejected", label: "Ditolak" },
];

const EMPTY_TEXT = {
  pending: "Tidak ada Curator yang menunggu persetujuan.",
  approved: "Belum ada Curator yang disetujui.",
  rejected: "Belum ada Curator yang ditolak.",
};

const BADGE = {
  pending: "bg-sage/50 text-deep-forest",
  approved: "bg-forest text-ivory",
  rejected: "bg-red-100 text-red-800",
};

export default async function CuratorVerificationPage({ searchParams }) {
  await requireRole("admin");

  const sp = await searchParams;
  const status = STATUSES.some((s) => s.value === sp.status) ? sp.status : "pending";
  const [curators, counts] = await Promise.all([listCuratorsByStatus(status), countCuratorsByStatus()]);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold text-deep-forest">Verifikasi Curator</h1>
        <p className="mt-1 text-sm text-deep-forest/70">
          Curator baru harus disetujui sebelum dapat mengakses dashboard dan membuat challenge.
        </p>
      </div>

      <nav aria-label="Filter status" className="flex flex-wrap gap-2">
        {STATUSES.map((s) => {
          const active = status === s.value;
          return (
            <Link
              key={s.value}
              href={`/admin/curators?status=${s.value}`}
              aria-current={active ? "true" : undefined}
              className={`rounded-full border px-4 py-1.5 text-sm font-medium transition ${
                active
                  ? "border-forest bg-forest text-ivory"
                  : "border-deep-forest/25 bg-white text-deep-forest hover:border-forest"
              }`}
            >
              {s.label} ({counts[s.value]})
            </Link>
          );
        })}
      </nav>

      {curators.length === 0 ? (
        <p className="rounded-2xl border border-dashed border-deep-forest/25 bg-white px-6 py-12 text-center text-sm text-deep-forest/70">
          {EMPTY_TEXT[status]}
        </p>
      ) : (
        <div className="overflow-x-auto rounded-2xl border border-deep-forest/10 bg-white shadow-sm">
          <table className="w-full min-w-[40rem] text-left">
            <thead className="bg-sage/30 text-xs uppercase tracking-wide text-deep-forest">
              <tr>
                <th scope="col" className="px-4 py-3 font-semibold">Organisasi / komunitas</th>
                <th scope="col" className="px-4 py-3 font-semibold">Email</th>
                <th scope="col" className="px-4 py-3 font-semibold">Terdaftar</th>
                <th scope="col" className="px-4 py-3 font-semibold">Status</th>
                <th scope="col" className="px-4 py-3 font-semibold">Aksi</th>
              </tr>
            </thead>
            <tbody>
              {curators.map((c) => (
                <tr key={c.id} className="border-t border-deep-forest/10 align-top">
                  <td className="px-4 py-3 text-sm font-medium text-deep-forest">{c.display_name}</td>
                  <td className="px-4 py-3 text-sm text-deep-forest">{c.email}</td>
                  <td className="px-4 py-3 text-sm text-deep-forest">{formatDate(c.created_at)}</td>
                  <td className="px-4 py-3">
                    <span className={`inline-block rounded-full px-3 py-1 text-xs font-semibold ${BADGE[c.curator_status]}`}>
                      {STATUSES.find((s) => s.value === c.curator_status)?.label}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    {c.curator_status === "pending" ? (
                      <div className="flex flex-wrap items-start gap-2">
                        <ActionButton
                          action={approveCuratorAction}
                          fields={{ userId: c.id }}
                          label="Setujui"
                          pendingLabel="Menyetujui..."
                        />
                        <ActionButton
                          action={rejectCuratorAction}
                          fields={{ userId: c.id }}
                          label="Tolak"
                          pendingLabel="Menolak..."
                          tone="danger"
                          confirmMessage="Tolak pendaftaran Curator ini?"
                          confirmLabel="Ya, tolak"
                        />
                      </div>
                    ) : (
                      <span className="text-sm text-deep-forest/50">Sudah diproses</span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}