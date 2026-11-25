import Link from "next/link";
import { requireRole } from "@/lib/session";
import { listUsers, countUsers } from "@/lib/adminUsers";
import { formatDate } from "@/lib/format";
import { buildQuery } from "@/lib/url";
import { cleanText } from "@/lib/text";
import ActionButton from "@/components/admin/ActionButton";
import Pagination from "@/components/Pagination";
import { deleteUserAction } from "./actions";

export const metadata = { title: "User Management · TIGA" };

const PAGE_SIZE = 20;

const ROLE_FILTERS = [
  { value: "", label: "All" },
  { value: "admin", label: "Admin" },
  { value: "member", label: "Member" },
  { value: "curator", label: "Curator" },
];
const ROLE_LABEL = { admin: "Admin", member: "Member", curator: "Curator" };
const STATUS_LABEL = { pending: "Pending", approved: "Approved", rejected: "Rejected" };

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
    <div className="space-y-8">
      <div>
        <h1 className="font-display text-3xl font-semibold text-ink">User Management</h1>
        <p className="mt-1 text-sm text-mute">
          {total} users registered. Admins can manage and remove Member or Curator accounts.
        </p>
      </div>

      <div className="flex flex-wrap items-center justify-between gap-4">
        <nav aria-label="Role filter" className="flex flex-wrap gap-2">
          {ROLE_FILTERS.map((f) => {
            const active = role === f.value;
            return (
              <Link
                key={f.value || "all"}
                href={`/admin/users${buildQuery({ q }, { role: f.value || null })}`}
                aria-current={active ? "true" : undefined}
                className={`rounded-full border px-4 py-1.5 text-xs font-semibold transition ${
                  active
                    ? "border-ink bg-ink text-white"
                    : "border-line bg-white text-ink hover:border-ink/50"
                }`}
              >
                {f.label}
              </Link>
            );
          })}
        </nav>

        <form action="/admin/users" method="get" role="search" className="flex gap-2">
          {role && <input type="hidden" name="role" value={role} />}
          <label htmlFor="user-search" className="sr-only">Search by name or email</label>
          <input
            id="user-search"
            name="q"
            defaultValue={q}
            maxLength={100}
            placeholder="Search by name or email"
            className="w-64 rounded-full border border-line bg-white px-4 py-2 text-xs text-ink outline-none transition focus:border-ink focus:ring-1 focus:ring-ink"
          />
          <button
            type="submit"
            className="rounded-full bg-ink px-5 py-2 text-xs font-semibold text-white transition hover:bg-people"
          >
            Search
          </button>
        </form>
      </div>

      {users.length === 0 ? (
        <div className="rounded-2xl border border-line bg-white px-6 py-14 text-center shadow-sm">
          <p className="font-display text-xl font-semibold text-ink">No users match your filters.</p>
        </div>
      ) : (
        <div className="overflow-x-auto rounded-2xl border border-line bg-white shadow-sm">
          <table className="w-full min-w-[44rem] text-left">
            <thead className="border-b border-line bg-soft text-[11px] uppercase tracking-wider text-mute">
              <tr>
                <th scope="col" className="px-5 py-3.5 font-semibold">Name</th>
                <th scope="col" className="px-5 py-3.5 font-semibold">Email</th>
                <th scope="col" className="px-5 py-3.5 font-semibold">Role</th>
                <th scope="col" className="px-5 py-3.5 font-semibold">Artworks</th>
                <th scope="col" className="px-5 py-3.5 font-semibold">Registered</th>
                <th scope="col" className="px-5 py-3.5 font-semibold">Action</th>
              </tr>
            </thead>
            <tbody>
              {users.map((u) => {
                const deletable = u.role !== "admin" && u.id !== admin.id;
                return (
                  <tr key={u.id} className="border-t border-line/60 align-top transition hover:bg-soft/40">
                    <td className="px-5 py-3.5 text-sm font-medium text-ink">
                      {u.display_name}
                      {u.id === admin.id && <span className="ml-2 text-xs text-mute">(You)</span>}
                    </td>
                    <td className="px-5 py-3.5 text-sm text-mute">{u.email}</td>
                    <td className="px-5 py-3.5 text-sm text-ink">
                      <span className="font-medium">{ROLE_LABEL[u.role]}</span>
                      {u.role === "curator" && (
                        <span className="block text-xs text-mute">{STATUS_LABEL[u.curator_status]}</span>
                      )}
                    </td>
                    <td className="px-5 py-3.5 text-sm text-ink">{u.artwork_count}</td>
                    <td className="px-5 py-3.5 text-xs text-mute">{formatDate(u.created_at)}</td>
                    <td className="px-5 py-3.5">
                      {deletable ? (
                        <ActionButton
                          action={deleteUserAction}
                          fields={{ userId: u.id }}
                          label="Delete"
                          pendingLabel="Deleting..."
                          tone="danger"
                          confirmMessage={`Permanently delete user ${u.display_name} and their artworks?`}
                          confirmLabel="Yes, delete"
                        />
                      ) : (
                        <span className="text-xs text-mute">Protected</span>
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
