import Link from "next/link";
import { requireRole } from "@/lib/session";
import { listMemberSubmissions } from "@/lib/submissions";
import { formatDateTime } from "@/lib/format";
import { StatusBadge } from "@/components/ChallengeCard";
import ActionButton from "@/components/admin/ActionButton";
import { withdrawSubmissionAction } from "@/app/(public)/challenges/[id]/actions";

export const metadata = { title: "My Submissions · TIGA" };

export default async function MySubmissionsPage() {
  const user = await requireRole("member");
  const submissions = await listMemberSubmissions(user.id);

  return (
    <div className="space-y-8">
      <div>
        <h1 className="font-display text-3xl font-semibold text-ink">My Submissions</h1>
        <p className="mt-1 text-sm text-mute">History of artworks you have submitted to community challenges.</p>
      </div>

      {submissions.length === 0 ? (
        <div className="rounded-2xl border border-line bg-white px-6 py-16 text-center shadow-sm">
          <p className="font-display text-2xl font-semibold text-ink">No submissions yet.</p>
          <p className="mx-auto mt-2 max-w-md text-sm text-mute">
            Choose an active challenge and submit your work before the deadline.
          </p>
          <Link
            href="/challenges?status=active"
            className="mt-6 inline-block rounded-full bg-forest px-6 py-2.5 text-sm font-semibold text-white transition hover:opacity-90"
          >
            View active challenges
          </Link>
        </div>
      ) : (
        <ul className="space-y-4">
          {submissions.map((s) => (
            <li
              key={s.id}
              className="flex flex-col gap-4 rounded-2xl border border-line bg-white p-5 shadow-sm transition hover:border-ink/20 sm:flex-row sm:items-center"
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={s.file_url} alt={s.artwork_title} className="aspect-[4/5] w-full rounded-xl object-cover sm:w-36" />
              <div className="min-w-0 flex-1 space-y-2">
                <div className="flex flex-wrap items-center gap-2.5">
                  <Link href={`/challenges/${s.challenge_id}`} className="font-display text-xl font-semibold text-ink hover:text-forest">
                    {s.challenge_title}
                  </Link>
                  <StatusBadge status={s.status} />
                </div>
                <p className="text-sm text-ink">
                  Artwork:{" "}
                  <Link href={`/artworks/${s.artwork_id}`} className="font-medium text-forest hover:underline">
                    {s.artwork_title}
                  </Link>
                </p>
                <p className="text-xs text-mute">
                  Submitted {formatDateTime(s.submitted_at)} · Deadline {formatDateTime(s.end_date)} WITA
                </p>
                {s.rank ? (
                  <span className="inline-block rounded-full bg-ink px-3 py-1 text-xs font-semibold text-white">
                    {s.rank === 1 ? "1st Place" : s.rank === 2 ? "2nd Place" : s.rank === 3 ? "3rd Place" : `Rank ${s.rank}`}
                  </span>
                ) : (
                  s.status === "ended" && <p className="text-xs text-mute">Challenge ended.</p>
                )}
              </div>
              <div className="sm:self-center">
                {s.can_withdraw ? (
                  <ActionButton
                    action={withdrawSubmissionAction}
                    fields={{ challengeId: s.challenge_id }}
                    label="Withdraw"
                    pendingLabel="Withdrawing..."
                    tone="danger"
                    confirmMessage="Withdraw this submission from the challenge?"
                    confirmLabel="Yes, withdraw"
                  />
                ) : (
                  <span className="text-xs text-mute">Cannot be withdrawn</span>
                )}
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

