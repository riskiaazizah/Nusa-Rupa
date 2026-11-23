import Link from "next/link";
import { requireRole } from "@/lib/session";
import { listOwnChallenges } from "@/lib/curatorChallenges";
import { formatDateTime } from "@/lib/format";
import { StatusBadge } from "@/components/ChallengeCard";
import ActionButton from "@/components/admin/ActionButton";
import { deleteChallengeAction } from "./actions";

export const metadata = { title: "Challenge Saya" };

export default async function CuratorChallengesPage() {
  const user = await requireRole("curator");
  const challenges = await listOwnChallenges(user.id);

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl font-semibold text-deep-forest">Challenge Saya</h1>
          <p className="mt-1 text-sm text-deep-forest/70">{challenges.length} challenge dibuat.</p>
        </div>
        <Link
          href="/curator/challenges/new"
          className="rounded-xl bg-forest px-5 py-2.5 text-sm font-semibold text-ivory transition hover:bg-deep-forest"
        >
          Buat Challenge
        </Link>
      </div>

      {challenges.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-deep-forest/25 bg-white px-6 py-14 text-center">
          <p className="font-medium text-deep-forest">Belum ada challenge.</p>
          <p className="mt-1 text-sm text-deep-forest/70">
            Buat challenge pertama untuk mengajak komunitas berkarya.
          </p>
          <Link
            href="/curator/challenges/new"
            className="mt-5 inline-block rounded-xl bg-forest px-5 py-2.5 text-sm font-semibold text-ivory hover:bg-deep-forest"
          >
            Buat challenge pertama
          </Link>
        </div>
      ) : (
        <ul className="space-y-4">
          {challenges.map((c) => (
            <li
              key={c.id}
              className="flex flex-col gap-4 overflow-hidden rounded-2xl border border-deep-forest/10 bg-white p-4 shadow-sm sm:flex-row"
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={c.banner_url}
                alt={`Banner ${c.title}`}
                loading="lazy"
                className="aspect-[3/1] w-full rounded-xl object-cover sm:w-56"
              />
              <div className="min-w-0 flex-1 space-y-2">
                <div className="flex flex-wrap items-center gap-3">
                  <h2 className="text-lg font-semibold text-deep-forest">{c.title}</h2>
                  <StatusBadge status={c.status} />
                </div>
                <p className="text-sm text-deep-forest/70">
                  {formatDateTime(c.start_date)} &ndash; {formatDateTime(c.end_date)} WITA
                </p>
                <p className="text-sm text-deep-forest">
                  {c.submission_count} submisi
                  {c.winner_count > 0 && <> · {c.winner_count} pemenang dipilih</>}
                </p>
                <div className="flex flex-wrap items-start gap-x-5 gap-y-2 pt-1 text-sm font-semibold">
                  <Link href={`/curator/challenges/${c.id}/submissions`} className="text-forest hover:underline">
                    Kelola submisi
                  </Link>
                  <Link href={`/curator/challenges/${c.id}/edit`} className="text-forest hover:underline">
                    Edit
                  </Link>
                  <Link href={`/challenges/${c.id}`} className="text-forest hover:underline">
                    Lihat halaman publik
                  </Link>
                  <ActionButton
                    action={deleteChallengeAction}
                    fields={{ challengeId: c.id }}
                    label="Hapus"
                    pendingLabel="Menghapus..."
                    tone="danger"
                    confirmMessage={`Hapus challenge ini beserta ${c.submission_count} submisinya? Tindakan ini permanen.`}
                    confirmLabel="Ya, hapus"
                  />
                </div>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}