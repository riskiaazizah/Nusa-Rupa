import Link from "next/link";
import { notFound } from "next/navigation";
import { getSession } from "@/lib/session";
import { getChallenge, listChallengeSubmissions } from "@/lib/challenges";
import { formatDateTime } from "@/lib/format";
import ArtworkCard from "@/components/ArtworkCard";
import { StatusBadge } from "@/components/ChallengeCard";
import ParticipationPanel from "@/components/challenge/ParticipationPanel";

export default async function ChallengeDetailPage({ params }) {
  const { id } = await params;
  const challengeId = Number(id);
  if (!Number.isInteger(challengeId) || challengeId <= 0) notFound();

  const challenge = await getChallenge(challengeId);
  if (!challenge) notFound();

  const [submissions, user] = await Promise.all([listChallengeSubmissions(challengeId), getSession()]);
  const winners = submissions.filter((s) => s.rank !== null);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-28 pb-12 sm:pt-32 sm:pb-16 space-y-10">
      <div>
        <Link
          href="/challenges"
          className="text-xs font-semibold uppercase tracking-wider text-mute hover:text-ink transition"
        >
          Back to all challenges
        </Link>
      </div>

      {/* Main Banner and Header Card */}
      <div className="overflow-hidden rounded-2xl border border-line bg-white shadow-xs">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={challenge.banner_url}
          alt={challenge.title}
          className="aspect-[3/1] w-full object-cover bg-soft"
        />
        <div className="space-y-4 p-6 sm:p-8">
          <div className="flex flex-wrap items-center gap-3">
            <StatusBadge status={challenge.status} />
            <span className="text-xs text-mute uppercase tracking-wider">
              Curated by {challenge.curator_name}
            </span>
          </div>

          <h1 className="font-display text-3xl sm:text-4xl md:text-5xl font-semibold text-ink leading-tight">
            {challenge.title}
          </h1>

          <dl className="grid gap-6 text-sm border-t border-line pt-6 sm:grid-cols-3">
            <div className="space-y-1">
              <dt className="text-xs uppercase tracking-wider text-mute">Start Date</dt>
              <dd className="font-medium text-ink">{formatDateTime(challenge.start_date)} WITA</dd>
            </div>
            <div className="space-y-1">
              <dt className="text-xs uppercase tracking-wider text-mute">Deadline</dt>
              <dd className="font-medium text-ink">{formatDateTime(challenge.end_date)} WITA</dd>
            </div>
            <div className="space-y-1">
              <dt className="text-xs uppercase tracking-wider text-mute">Prize</dt>
              <dd className="font-medium text-ink">{challenge.prize}</dd>
            </div>
          </dl>
        </div>
      </div>

      {/* Participation Panel (Submit Work / Withdraw / Login CTA) */}
      <ParticipationPanel challenge={challenge} user={user} />

      {/* Description & Rules Grid */}
      <div className="grid gap-6 md:grid-cols-2">
        <section className="rounded-2xl border border-line bg-white p-6 sm:p-8 space-y-3">
          <h2 className="font-display text-2xl font-semibold text-ink">Description</h2>
          <p className="whitespace-pre-line text-sm leading-relaxed text-ink/80">{challenge.description}</p>
        </section>
        <section className="rounded-2xl border border-line bg-white p-6 sm:p-8 space-y-3">
          <h2 className="font-display text-2xl font-semibold text-ink">Rules & Guidelines</h2>
          <p className="whitespace-pre-line text-sm leading-relaxed text-ink/80">{challenge.rules}</p>
        </section>
      </div>

      {/* Winners Section */}
      <section className="space-y-6 pt-4">
        <div className="border-b border-line pb-3">
          <h2 className="font-display text-2xl sm:text-3xl font-semibold text-ink">Winners</h2>
        </div>

        {winners.length === 0 ? (
          <div className="rounded-2xl border border-dashed border-line bg-soft/30 px-6 py-12 text-center text-sm text-mute">
            Winners have not been announced yet.
          </div>
        ) : (
          <ul className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {winners.map((w) => (
              <li key={w.submission_id} className="space-y-3">
                <span className="inline-block rounded-full bg-people px-3 py-1 text-xs font-bold text-white uppercase tracking-wider">
                  Juara {w.rank}
                </span>
                <ArtworkCard artwork={w} />
              </li>
            ))}
          </ul>
        )}
      </section>

      {/* Submissions Gallery */}
      <section className="space-y-6 pt-4">
        <div className="flex items-baseline justify-between border-b border-line pb-3">
          <h2 className="font-display text-2xl sm:text-3xl font-semibold text-ink">
            Submissions ({submissions.length})
          </h2>
          <span className="text-xs text-mute">Community entries</span>
        </div>

        {submissions.length === 0 ? (
          <div className="rounded-2xl border border-dashed border-line bg-soft/30 px-6 py-14 text-center text-sm text-mute">
            No submissions have been registered yet.
          </div>
        ) : (
          <ul className="grid grid-cols-1 gap-6 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
            {submissions.map((s) => (
              <li key={s.submission_id}>
                <ArtworkCard artwork={s} />
              </li>
            ))}
          </ul>
        )}
      </section>
    </div>
  );
}
