import Link from "next/link";
import { requireRole } from "@/lib/session";
import { listModerationQueue } from "@/lib/moderation";
import { REPORT_REASONS } from "@/lib/constants";
import { formatDateTime } from "@/lib/format";
import ActionButton from "@/components/admin/ActionButton";
import { dismissReportAction, takeDownAction } from "./actions";

export const metadata = { title: "Moderasi Konten" };

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
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold text-deep-forest">Moderasi Konten</h1>
        <p className="mt-1 text-sm text-deep-forest/70">
          {queue.length} karya menunggu ditinjau. <strong>Dismiss Report</strong> menolak laporan (karya tetap tayang),
          <strong> Take Down</strong> menerima laporan dan menghapus karya.
        </p>
      </div>

      {queue.length === 0 ? (
        <p className="rounded-2xl border border-dashed border-deep-forest/25 bg-white px-6 py-12 text-center text-sm text-deep-forest/70">
          Tidak ada laporan yang menunggu. Semua bersih.
        </p>
      ) : (
        <ul className="space-y-5">
          {queue.map((a) => (
            <li key={a.id} className="overflow-hidden rounded-2xl border border-deep-forest/10 bg-white shadow-sm">
              <div className="flex flex-col gap-5 p-5 md:flex-row">
                <Link href={`/artworks/${a.id}`} className="block shrink-0 md:w-56">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={a.file_url} alt={a.title} className="aspect-[4/3] w-full rounded-xl object-cover" />
                </Link>

                <div className="min-w-0 flex-1 space-y-3">
                  <div>
                    <h2 className="text-lg font-semibold text-deep-forest">{a.title}</h2>
                    <p className="text-sm text-deep-forest/70">
                      oleh{" "}
                      <Link href={`/creators/${a.creator_id}`} className="font-medium text-forest hover:underline">
                        {a.creator_name}
                      </Link>
                    </p>
                  </div>

                  <div className="flex flex-wrap items-center gap-2">
                    <span className="rounded-full bg-red-100 px-3 py-1 text-xs font-bold text-red-800">
                      {a.report_count} laporan
                    </span>
                    {reasonSummary(a.reports).map((r) => (
                      <span key={r.label} className="rounded-full bg-sage/40 px-3 py-1 text-xs font-medium text-deep-forest">
                        {r.label} ({r.total})
                      </span>
                    ))}
                  </div>

                  <details className="rounded-xl border border-deep-forest/10 bg-ivory/60">
                    <summary className="cursor-pointer px-4 py-2 text-sm font-semibold text-deep-forest">
                      Lihat detail laporan
                    </summary>
                    <ul className="space-y-2 border-t border-deep-forest/10 px-4 py-3 text-sm text-deep-forest">
                      {a.reports.map((r) => (
                        <li key={r.id}>
                          <span className="font-semibold">{REASON_LABEL[r.reason] ?? r.reason}</span> oleh {r.reporter_name}{" "}
                          <span className="text-xs text-deep-forest/60">({formatDateTime(r.created_at)})</span>
                          {r.details && <p className="mt-0.5 text-deep-forest/80">{r.details}</p>}
                        </li>
                      ))}
                    </ul>
                  </details>

                  <div className="flex flex-wrap items-start gap-3">
                    <Link
                      href={`/artworks/${a.id}`}
                      className="rounded-xl border border-deep-forest/25 px-4 py-2 text-sm font-semibold text-deep-forest transition hover:bg-ivory"
                    >
                      Lihat karya
                    </Link>
                    <ActionButton
                      action={dismissReportAction}
                      fields={{ artworkId: a.id }}
                      label="Dismiss Report"
                      pendingLabel="Memproses..."
                    />
                    <ActionButton
                      action={takeDownAction}
                      fields={{ artworkId: a.id }}
                      label="Take Down"
                      pendingLabel="Menghapus..."
                      tone="danger"
                      confirmMessage="Hapus karya ini secara permanen? Like, komentar, dan submisi challenge terkait ikut terhapus."
                      confirmLabel="Ya, take down"
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