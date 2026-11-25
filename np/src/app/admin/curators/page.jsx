import Link from "next/link";
import { requireRole } from "@/lib/session";
import { listCuratorsByStatus, countCuratorsByStatus } from "@/lib/adminUsers";
import { formatDate } from "@/lib/format";
import ActionButton from "@/components/admin/ActionButton";
import { approveCuratorAction, rejectCuratorAction } from "./actions";

export const metadata = { title: "Curator Verification · TIGA" };

const STATUSES = [
  { value: "pending", label: "Pending" },
  { value: "approved", label: "Approved" },
  { value: "rejected", label: "Rejected" },
];

const EMPTY_TEXT = {
  pending: "No curators pending verification.",
  approved: "No approved curators yet.",
  rejected: "No rejected curators.",
};

const BADGE = {
  pending: "bg-animals/10 text-animals",
  approved: "bg-forest/10 text-forest",
  rejected: "bg-people/10 text-people",
};

export default async function CuratorVerificationPage({ searchParams }) {
  await requireRole("admin");

  const sp = await searchParams;
  const status = STATUSES.some((s) => s.value === sp.status) ? sp.status : "pending";
  const [curators, counts] = await Promise.all([listCuratorsByStatus(status), countCuratorsByStatus()]);

  return (
    <div className="space-y-8">
      <div>
        <h1 className="font-display text-3xl font-semibold text-ink">Curator Verification</h1>
        <p className="mt-1 text-sm text-mute">
          New curators must be verified by an admin before accessing the dashboard and launching challenges.
        </p>
      </div>

      <nav aria-label="Status filter" className="flex flex-wrap gap-2">
        {STATUSES.map((s) => {
          const active = status === s.value;
          return (
            <Link
              key={s.value}
              href={`/admin/curators?status=${s.value}`}
              aria-current={active ? "true" : undefined}
              className={`rounded-full border px-4 py-1.5 text-xs font-semibold transition ${
                active
                  ? "border-ink bg-ink text-white"
                  : "border-line bg-white text-ink hover:border-ink/50"
              }`}
            >
              {s.label} ({counts[s.value]})
            </Link>
          );
        })}
      </nav>

      {curators.length === 0 ? (
        <div className="rounded-2xl border border-line bg-white px-6 py-14 text-center shadow-sm">
          <p className="font-display text-xl font-semibold text-ink">{EMPTY_TEXT[status]}</p>
        </div>
      ) : (
        <div className="overflow-x-auto rounded-2xl border border-line bg-white shadow-sm">
          <table className="w-full min-w-[40rem] text-left">
            <thead className="border-b border-line bg-soft text-[11px] uppercase tracking-wider text-mute">
              <tr>
                <th scope="col" className="px-5 py-3.5 font-semibold">Organization / Community</th>
                <th scope="col" className="px-5 py-3.5 font-semibold">Email</th>
                <th scope="col" className="px-5 py-3.5 font-semibold">Registered</th>
                <th scope="col" className="px-5 py-3.5 font-semibold">Status</th>
                <th scope="col" className="px-5 py-3.5 font-semibold">Action</th>
              </tr>
            </thead>
            <tbody>
              {curators.map((c) => (
                <tr key={c.id} className="border-t border-line/60 align-top transition hover:bg-soft/40">
                  <td className="px-5 py-3.5 text-sm font-medium text-ink">{c.display_name}</td>
                  <td className="px-5 py-3.5 text-sm text-mute">{c.email}</td>
                  <td className="px-5 py-3.5 text-xs text-mute">{formatDate(c.created_at)}</td>
                  <td className="px-5 py-3.5">
                    <span className={`inline-block rounded-full px-3 py-1 text-xs font-semibold ${BADGE[c.curator_status]}`}>
                      {STATUSES.find((s) => s.value === c.curator_status)?.label}
                    </span>
                  </td>
                  <td className="px-5 py-3.5">
                    {c.curator_status === "pending" ? (
                      <div className="flex flex-wrap items-center gap-2">
                        <ActionButton
                          action={approveCuratorAction}
                          fields={{ userId: c.id }}
                          label="Approve"
                          pendingLabel="Approving..."
                        />
                        <ActionButton
                          action={rejectCuratorAction}
                          fields={{ userId: c.id }}
                          label="Reject"
                          pendingLabel="Rejecting..."
                          tone="danger"
                          confirmMessage="Reject this curator registration?"
                          confirmLabel="Yes, reject"
                        />
                      </div>
                    ) : (
                      <span className="text-xs text-mute">Processed</span>
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
