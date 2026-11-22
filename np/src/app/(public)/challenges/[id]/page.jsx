import Link from "next/link";
import { notFound } from "next/navigation";
import { getChallenge, listChallengeSubmissions } from "@/lib/challenges";
import { formatDateTime } from "@/lib/format";
import ArtworkCard from "@/components/ArtworkCard";
import { StatusBadge } from "@/components/ChallengeCard";

export default async function ChallengeDetailPage({ params }) {
  const { id } = await params;
  const challengeId = Number(id);
  if (!Number.isInteger(challengeId) || challengeId <= 0) notFound();

  const challenge = await getChallenge(challengeId);
  if (!challenge) notFound();

  const submissions = await listChallengeSubmissions(challengeId);
  const winners = submissions.filter((s) => s.rank !== null);

  return (
    <div className="space-y-8">
      <Link href="/challenges" className="text-sm font-semibold text-forest hover:underline">
        &larr; Semua challenge
      </Link>

      <div className="overflow-hidden rounded-2xl border border-deep-forest/10 bg-white shadow-sm">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={challenge.banner_url} alt={`Banner ${challenge.title}`} className="aspect-[3/1] w-full object-cover" />
        <div className="space-y-3 p-6">
          <div className="flex flex-wrap items-center gap-3">
            <h1 className="text-2xl font-semibold text-deep-forest">{challenge.title}</h1>
            <StatusBadge status={challenge.status} />
          </div>
          <p className="text-sm text-deep-forest/70">Diselenggarakan oleh {challenge.curator_name}</p>
          <dl className="grid gap-4 text-sm sm:grid-cols-3">
            <div>
              <dt className="text-deep-forest/70">Mulai</dt>
              <dd className="font-medium text-deep-forest">{formatDateTime(challenge.start_date)}</dd>
            </div>
            <div>
              <dt className="text-deep-forest/70">Deadline</dt>
              <dd className="font-medium text-deep-forest">{formatDateTime(challenge.end_date)}</dd>
            </div>
            <div>
              <dt className="text-deep-forest/70">Hadiah</dt>
              <dd className="font-medium text-deep-forest">{challenge.prize}</dd>
            </div>
          </dl>
        </div>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <section className="rounded-2xl border border-deep-forest/10 bg-white p-6">
          <h2 className="text-lg font-semibold text-deep-forest">Deskripsi</h2>
          <p className="mt-2 whitespace-pre-line text-sm leading-relaxed text-deep-forest">{challenge.description}</p>
        </section>
        <section className="rounded-2xl border border-deep-forest/10 bg-white p-6">
          <h2 className="text-lg font-semibold text-deep-forest">Aturan</h2>
          <p className="mt-2 whitespace-pre-line text-sm leading-relaxed text-deep-forest">{challenge.rules}</p>
        </section>
      </div>

      <section className="space-y-4">
        <h2 className="text-xl font-semibold text-deep-forest">Pemenang</h2>
        {winners.length === 0 ? (
          <p className="rounded-2xl border border-dashed border-deep-forest/25 bg-white px-6 py-8 text-center text-sm text-deep-forest/70">
            Pemenang belum diumumkan.
          </p>
        ) : (
          <ul className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {winners.map((w) => (
              <li key={w.submission_id} className="space-y-2">
                <p className="inline-block rounded-full bg-earth px-3 py-1 text-sm font-bold text-white">
                  Juara {w.rank}
                </p>
                <ArtworkCard artwork={w} />
              </li>
            ))}
          </ul>
        )}
      </section>

      <section className="space-y-4">
        <h2 className="text-xl font-semibold text-deep-forest">Galeri submisi ({submissions.length})</h2>
        {submissions.length === 0 ? (
          <p className="rounded-2xl border border-dashed border-deep-forest/25 bg-white px-6 py-8 text-center text-sm text-deep-forest/70">
            Belum ada karya yang disubmit.
          </p>
        ) : (
          <ul className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
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