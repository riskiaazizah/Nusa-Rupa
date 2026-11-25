import Link from "next/link";
import { notFound } from "next/navigation";
import { requireRole } from "@/lib/session";
import { getOwnChallenge } from "@/lib/curatorChallenges";
import { listChallengeSubmissions } from "@/lib/challenges";
import { formatDateTime } from "@/lib/format";
import { StatusBadge } from "@/components/ChallengeCard";
import ArtworkCard from "@/components/ArtworkCard";
import WinnerForm from "@/components/curator/WinnerForm";

export const metadata = { title: "Manage Submissions · TIGA" };

export default async function ManageSubmissionsPage({ params }) {
  const user = await requireRole("curator");

  const { id } = await params;
  const challengeId = Number(id);
  if (!Number.isInteger(challengeId) || challengeId <= 0) notFound();

  const challenge = await getOwnChallenge(challengeId, user.id);
  if (!challenge) notFound();

  const submissions = await listChallengeSubmissions(challengeId);
  const current = { 1: null, 2: null, 3: null };
  for (const s of submissions) if (s.rank) current[s.rank] = s.submission_id;

  return (
    <div className="space-y-8">
      <Link href="/curator/challenges" className="text-xs font-semibold uppercase tracking-wider text-mute hover:text-ink">
        Back to my challenges
      </Link>

      <div className="space-y-2">
        <div className="flex flex-wrap items-center gap-3">
          <h1 className="font-display text-3xl font-semibold text-ink">{challenge.title}</h1>
          <StatusBadge status={challenge.status} />
        </div>
        <p className="text-sm text-mute">
          Deadline: {formatDateTime(challenge.end_date)} WITA · {submissions.length} submissions
        </p>
      </div>

      {challenge.status === "ended" ? (
        submissions.length === 0 ? (
          <div className="rounded-2xl border border-line bg-white px-6 py-10 text-center text-sm text-mute shadow-sm">
            Challenge ended without any submissions, so no winners can be selected.
          </div>
        ) : (
          <WinnerForm challengeId={challenge.id} submissions={submissions} current={current} />
        )
      ) : (
        <div className="rounded-2xl border border-animals/30 bg-animals/5 p-5 text-sm text-ink">
          Winners can be selected after the challenge ends ({formatDateTime(challenge.end_date)} WITA).
        </div>
      )}

      <section className="space-y-4">
        <h2 className="font-display text-2xl font-semibold text-ink">Submitted Artworks</h2>
        {submissions.length === 0 ? (
          <div className="rounded-2xl border border-line bg-white px-6 py-10 text-center text-sm text-mute shadow-sm">
            No submissions yet.
          </div>
        ) : (
          <ul className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {submissions.map((s) => (
              <li key={s.submission_id} className="space-y-2">
                {s.rank && (
                  <span className="inline-block rounded-full bg-ink px-3 py-1 text-xs font-semibold text-white">
                    {s.rank === 1 ? "1st Place" : s.rank === 2 ? "2nd Place" : s.rank === 3 ? "3rd Place" : `Rank ${s.rank}`}
                  </span>
                )}
                <ArtworkCard artwork={s} />
                <p className="text-xs text-mute">Submitted {formatDateTime(s.submitted_at)}</p>
              </li>
            ))}
          </ul>
        )}
      </section>
    </div>
  );
}