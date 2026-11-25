import Link from "next/link";
import { requireRole } from "@/lib/session";
import { listOwnChallenges } from "@/lib/curatorChallenges";
import { formatDateTime } from "@/lib/format";
import { StatusBadge } from "@/components/ChallengeCard";
import ActionButton from "@/components/admin/ActionButton";
import { deleteChallengeAction } from "./actions";

export const metadata = { title: "My Challenges · TIGA" };

export default async function CuratorChallengesPage() {
  const user = await requireRole("curator");
  const challenges = await listOwnChallenges(user.id);

  return (
    <div className="space-y-8">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="font-display text-3xl font-semibold text-ink">My Challenges</h1>
          <p className="mt-1 text-sm text-mute">{challenges.length} challenges created.</p>
        </div>
        <Link
          href="/curator/challenges/new"
          className="rounded-full bg-animals px-6 py-2.5 text-sm font-semibold text-white transition hover:opacity-90"
        >
          New challenge
        </Link>
      </div>

      {challenges.length === 0 ? (
        <div className="rounded-2xl border border-line bg-white px-6 py-16 text-center shadow-sm">
          <p className="font-display text-2xl font-semibold text-ink">No challenges yet.</p>
          <p className="mx-auto mt-2 max-w-md text-sm text-mute">
            Create your first community challenge to invite creators to voice nature through art.
          </p>
          <Link
            href="/curator/challenges/new"
            className="mt-6 inline-block rounded-full bg-animals px-6 py-2.5 text-sm font-semibold text-white transition hover:opacity-90"
          >
            Create first challenge
          </Link>
        </div>
      ) : (
        <ul className="space-y-4">
          {challenges.map((c) => (
            <li
              key={c.id}
              className="flex flex-col gap-5 overflow-hidden rounded-2xl border border-line bg-white p-5 shadow-sm transition hover:border-ink/20 sm:flex-row"
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={c.banner_url}
                alt={`Banner ${c.title}`}
                loading="lazy"
                className="aspect-[3/1] w-full rounded-xl object-cover sm:w-60"
              />
              <div className="min-w-0 flex-1 space-y-2">
                <div className="flex flex-wrap items-center gap-2.5">
                  <h2 className="font-display text-xl font-semibold text-ink">{c.title}</h2>
                  <StatusBadge status={c.status} />
                </div>
                <p className="text-xs text-mute">
                  {formatDateTime(c.start_date)} &ndash; {formatDateTime(c.end_date)} WITA
                </p>
                <p className="text-xs text-ink">
                  {c.submission_count} submissions
                  {c.winner_count > 0 && <> · {c.winner_count} winners announced</>}
                </p>
                <div className="flex flex-wrap items-center gap-x-5 gap-y-2 border-t border-line/60 pt-3 text-xs font-semibold">
                  <Link href={`/curator/challenges/${c.id}/submissions`} className="text-animals hover:underline">
                    Manage submissions
                  </Link>
                  <Link href={`/curator/challenges/${c.id}/edit`} className="text-animals hover:underline">
                    Edit
                  </Link>
                  <Link href={`/challenges/${c.id}`} className="text-mute hover:text-ink hover:underline">
                    View public page
                  </Link>
                  <ActionButton
                    action={deleteChallengeAction}
                    fields={{ challengeId: c.id }}
                    label="Delete"
                    pendingLabel="Deleting..."
                    tone="danger"
                    confirmMessage={`Delete this challenge along with its ${c.submission_count} submissions? This action is permanent.`}
                    confirmLabel="Yes, delete"
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
