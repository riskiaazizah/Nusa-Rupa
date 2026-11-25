import Link from "next/link";
import { requireRole } from "@/lib/session";
import { listModerationQueue } from "@/lib/moderation";
import { REPORT_REASONS } from "@/lib/constants";
import { formatDateTime } from "@/lib/format";
import ActionButton from "@/components/admin/ActionButton";
import { dismissReportAction, takeDownAction } from "./actions";

export const metadata = { title: "Content Moderation · TIGA" };

const REASON_LABEL = Object.fromEntries(REPORT_REASONS.map((r) => [r.value, r.label]));

function reasonSummary(reports) {
  const counts = {};
  for (const r of reports) counts[r.reason] = (counts[r.reason] ?? 0) + 1;
  return Object.entries(counts).map(([reason, total]) => ({ label: REASON_LABEL[reason] ?? reason, total }));
}

export default async function ModerationPage() {
  await requireRole("admin");
  const queue = await listModerationQueue();

  return (
    <div className="space-y-8">
      <div>
        <h1 className="font-display text-3xl font-semibold text-ink">Content Moderation</h1>
        <p className="mt-1 text-sm text-mute">
          {queue.length} reported artworks pending review. <strong>Dismiss Report</strong> keeps the artwork online,
          while <strong>Take Down</strong> removes the artwork permanently.
        </p>
      </div>

      {queue.length === 0 ? (
        <div className="rounded-2xl border border-line bg-white px-6 py-14 text-center shadow-sm">
          <p className="font-display text-xl font-semibold text-ink">No reports to review. Nice.</p>
        </div>
      ) : (
        <ul className="space-y-6">
          {queue.map((a) => (
            <li key={a.id} className="overflow-hidden rounded-2xl border border-line bg-white p-6 shadow-sm transition hover:border-ink/20">
              <div className="flex flex-col gap-6 md:flex-row">
                <Link href={`/artworks/${a.id}`} className="block shrink-0 md:w-56">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={a.file_url} alt={a.title} className="aspect-[4/5] w-full rounded-xl object-cover" />
                </Link>

                <div className="min-w-0 flex-1 space-y-3.5">
                  <div>
                    <h2 className="font-display text-2xl font-semibold text-ink">{a.title}</h2>
                    <p className="text-sm text-mute">
                      by{" "}
                      <Link href={`/creators/${a.creator_id}`} className="font-medium text-ink hover:text-people hover:underline">
                        {a.creator_name}
                      </Link>
                    </p>
                  </div>

                  <div className="flex flex-wrap items-center gap-2">
                    <span className="rounded-full bg-people/10 px-3 py-1 text-xs font-bold text-people">
                      {a.report_count} reports
                    </span>
                    {reasonSummary(a.reports).map((r) => (
                      <span key={r.label} className="rounded-full bg-soft px-3 py-1 text-xs font-medium text-mute">
                        {r.label} ({r.total})
                      </span>
                    ))}
                  </div>

                  <details className="rounded-xl border border-line bg-soft/50">
                    <summary className="cursor-pointer px-4 py-2.5 text-xs font-semibold uppercase tracking-wider text-mute hover:text-ink">
                      View report details
                    </summary>
                    <ul className="space-y-2 border-t border-line/60 px-4 py-3 text-xs text-ink">
                      {a.reports.map((r) => (
                        <li key={r.id}>
                          <span className="font-semibold">{REASON_LABEL[r.reason] ?? r.reason}</span> by {r.reporter_name}{" "}
                          <span className="text-mute">({formatDateTime(r.created_at)})</span>
                          {r.details && <p className="mt-1 text-mute">{r.details}</p>}
                        </li>
                      ))}
                    </ul>
                  </details>

                  <div className="flex flex-wrap items-center gap-3 pt-2">
                    <Link
                      href={`/artworks/${a.id}`}
                      className="rounded-full border border-line bg-white px-5 py-2 text-xs font-semibold text-ink transition hover:border-ink hover:bg-soft"
                    >
                      View artwork
                    </Link>
                    <ActionButton
                      action={dismissReportAction}
                      fields={{ artworkId: a.id }}
                      label="Dismiss Report"
                      pendingLabel="Dismissing..."
                    />
                    <ActionButton
                      action={takeDownAction}
                      fields={{ artworkId: a.id }}
                      label="Take Down"
                      pendingLabel="Taking down..."
                      tone="danger"
                      confirmMessage="Take down and permanently delete this artwork? Associated likes, comments, and challenge submissions will also be deleted."
                      confirmLabel="Yes, take down"
                    />
                  </div>
                </div>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
