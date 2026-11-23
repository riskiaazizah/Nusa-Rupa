import Link from "next/link";
import { notFound } from "next/navigation";
import { requireRole } from "@/lib/session";
import { getOwnChallenge } from "@/lib/curatorChallenges";
import { listChallengeSubmissions } from "@/lib/challenges";
import { formatDateTime } from "@/lib/format";
import { StatusBadge } from "@/components/ChallengeCard";
import ArtworkCard from "@/components/ArtworkCard";
import WinnerForm from "@/components/curator/WinnerForm";

export const metadata = { title: "Kelola Submisi" };

export default async function ManageSubmissionsPage({ params }) {
  const user = await requireRole("curator");

  const { id } = await params;
  const challengeId = Number(id);
  if (!Number.isInteger(challengeId) || challengeId <= 0) notFound();

  const challenge = await getOwnChallenge(challengeId, user.id); // hanya challenge milik sendiri
  if (!challenge) notFound();

  const submissions = await listChallengeSubmissions(challengeId);
  const current = { 1: null, 2: null, 3: null };
  for (const s of submissions) if (s.rank) current[s.rank] = s.submission_id;

  return (
    <div className="space-y-8">
      <Link href="/curator/challenges" className="text-sm font-semibold text-forest hover:underline">
        &larr; Challenge saya
      </Link>

      <div className="space-y-2">
        <div className="flex flex-wrap items-center gap-3">
          <h1 className="text-2xl font-semibold text-deep-forest">{challenge.title}</h1>
          <StatusBadge status={challenge.status} />
        </div>
        <p className="text-sm text-deep-forest/70">
          Deadline: {formatDateTime(challenge.end_date)} WITA · {submissions.length} submisi
        </p>
      </div>

      {challenge.status === "ended" ? (
        submissions.length === 0 ? (
          <p className="rounded-2xl border border-dashed border-deep-forest/25 bg-white px-6 py-8 text-center text-sm text-deep-forest/70">
            Challenge berakhir tanpa submisi, jadi belum ada pemenang yang bisa dipilih.
          </p>
        ) : (
          <WinnerForm challengeId={challenge.id} submissions={submissions} current={current} />
        )
      ) : (
        <p className="rounded-2xl border border-sage bg-sage/20 px-6 py-4 text-sm text-deep-forest">
          Pemenang dapat dipilih setelah challenge berakhir ({formatDateTime(challenge.end_date)} WITA).
        </p>
      )}

      <section className="space-y-4">
        <h2 className="text-xl font-semibold text-deep-forest">Galeri submisi</h2>
        {submissions.length === 0 ? (
          <p className="rounded-2xl border border-dashed border-deep-forest/25 bg-white px-6 py-8 text-center text-sm text-deep-forest/70">
            Belum ada karya yang disubmit.
          </p>
        ) : (
          <ul className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {submissions.map((s) => (
              <li key={s.submission_id} className="space-y-2">
                {s.rank && (
                  <p className="inline-block rounded-full bg-earth px-3 py-1 text-sm font-bold text-white">
                    Juara {s.rank}
                  </p>
                )}
                <ArtworkCard artwork={s} />
                <p className="text-xs text-deep-forest/70">Disubmit {formatDateTime(s.submitted_at)}</p>
              </li>
            ))}
          </ul>
        )}
      </section>
    </div>
  );
}