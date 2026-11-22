import Link from "next/link";
import { requireRole } from "@/lib/session";
import { listUsers, countUsers } from "@/lib/adminUsers";
import { formatDate } from "@/lib/format";
import { buildQuery } from "@/lib/url";
import { cleanText } from "@/lib/text";
import ActionButton from "@/components/admin/ActionButton";
import Pagination from "@/components/Pagination";
import { deleteUserAction } from "./actions";

export const metadata = { title: "Pengguna" };

const PAGE_SIZE = 20;

const ROLE_FILTERS = [
  { value: "", label: "Semua" },
  { value: "admin", label: "Admin" },
  { value: "member", label: "Member" },
  { value: "curator", label: "Curator" },
];
const ROLE_LABEL = { admin: "Admin", member: "Member", curator: "Curator" };
const STATUS_LABEL = { pending: "Menunggu", approved: "Disetujui", rejected: "Ditolak" };

export default async function UsersPage({ searchParams }) {
  const admin = await requireRole("admin");

  const sp = await searchParams;
  const role = ROLE_FILTERS.some((f) => f.value && f.value === sp.role) ? sp.role : "";
  const q = cleanText(sp.q, 100);
  const page = Math.max(1, Number.parseInt(sp.page, 10) || 1);

  const [users, total] = await Promise.all([
    listUsers({ role, q, limit: PAGE_SIZE, offset: (page - 1) * PAGE_SIZE }),
    countUsers({ role, q }),
  ]);
  const totalPages = Math.max(1, Math.ceil(total / PAGE_SIZE));
  const params = { role, q };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold text-deep-forest">Manajemen Pengguna</h1>
        <p className="mt-1 text-sm text-deep-forest/70">
          {total} pengguna. Admin hanya dapat menghapus akun Member dan Curator.
        </p>
      </div>

      <div className="flex flex-wrap items-center justify-between gap-4">
        <nav aria-label="Filter peran" className="flex flex-wrap gap-2">
          {ROLE_FILTERS.map((f) => {
            const active = role === f.value;
            return (
              <Link
                key={f.value || "all"}
                href={`/admin/users${buildQuery({ q }, { role: f.value || null })}`}
                aria-current={active ? "true" : undefined}
                className={`rounded-full border px-4 py-1.5 text-sm font-medium transition ${
                  active
                    ? "border-forest bg-forest text-ivory"
                    : "border-deep-forest/25 bg-white text-deep-forest hover:border-forest"
                }`}
              >
                {f.label}
              </Link>
            );
          })}
        </nav>

        <form action="/admin/users" method="get" role="search" className="flex gap-2">
          {role && <input type="hidden" name="role" value={role} />}
          <label htmlFor="user-search" className="sr-only">Cari nama atau email</label>
          <input
            id="user-search"
            name="q"
            defaultValue={q}
            maxLength={100}
            placeholder="Cari nama atau email"
            className="w-56 rounded-xl border border-deep-forest/25 bg-white px-4 py-2 text-sm outline-none focus:ring-2 focus:ring-forest"
          />
          <button
            type="submit"
            className="rounded-xl bg-forest px-4 py-2 text-sm font-semibold text-ivory transition hover:bg-deep-forest"
          >
            Cari
          </button>
        </form>
      </div>

      {users.length === 0 ? (
        <p className="rounded-2xl border border-dashed border-deep-forest/25 bg-white px-6 py-12 text-center text-sm text-deep-forest/70">
          Tidak ada pengguna yang cocok.
        </p>
      ) : (
        <div className="overflow-x-auto rounded-2xl border border-deep-forest/10 bg-white shadow-sm">
          <table className="w-full min-w-[44rem] text-left">
            <thead className="bg-sage/30 text-xs uppercase tracking-wide text-deep-forest">
              <tr>
                <th scope="col" className="px-4 py-3 font-semibold">Nama</th>
                <th scope="col" className="px-4 py-3 font-semibold">Email</th>
                <th scope="col" className="px-4 py-3 font-semibold">Peran</th>
                <th scope="col" className="px-4 py-3 font-semibold">Karya</th>
                <th scope="col" className="px-4 py-3 font-semibold">Terdaftar</th>
                <th scope="col" className="px-4 py-3 font-semibold">Aksi</th>
              </tr>
            </thead>
            <tbody>
              {users.map((u) => {
                const deletable = u.role !== "admin" && u.id !== admin.id;
                return (
                  <tr key={u.id} className="border-t border-deep-forest/10 align-top">
                    <td className="px-4 py-3 text-sm font-medium text-deep-forest">
                      {u.display_name}
                      {u.id === admin.id && <span className="ml-2 text-xs text-deep-forest/60">(Anda)</span>}
                    </td>
                    <td className="px-4 py-3 text-sm text-deep-forest">{u.email}</td>
                    <td className="px-4 py-3 text-sm text-deep-forest">
                      {ROLE_LABEL[u.role]}
                      {u.role === "curator" && (
                        <span className="block text-xs text-deep-forest/70">{STATUS_LABEL[u.curator_status]}</span>
                      )}
                    </td>
                    <td className="px-4 py-3 text-sm text-deep-forest">{u.artwork_count}</td>
                    <td className="px-4 py-3 text-sm text-deep-forest">{formatDate(u.created_at)}</td>
                    <td className="px-4 py-3">
                      {deletable ? (
                        <ActionButton
                          action={deleteUserAction}
                          fields={{ userId: u.id }}
                          label="Hapus"
                          pendingLabel="Menghapus..."
                          tone="danger"
                          confirmMessage={`Hapus akun ${u.display_name} beserta seluruh karyanya? Tindakan ini permanen.`}
                          confirmLabel="Ya, hapus"
                        />
                      ) : (
                        <span className="text-sm text-deep-forest/50">Tidak dapat dihapus</span>
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}

      <Pagination basePath="/admin/users" page={page} totalPages={totalPages} params={params} />
    </div>
  );
}