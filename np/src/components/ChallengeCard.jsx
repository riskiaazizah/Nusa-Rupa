import Link from "next/link";
import { formatDate } from "@/lib/format";

const BADGES = {
  active: { label: "Active", className: "bg-forest text-white" },
  upcoming: { label: "Upcoming", className: "bg-animals text-white" },
  ended: { label: "Ended", className: "bg-soft text-mute border border-line" },
  pending: { label: "Pending", className: "bg-animals text-white" },
  approved: { label: "Approved", className: "bg-forest text-white" },
  rejected: { label: "Rejected", className: "bg-people text-white" },
};

export function StatusBadge({ status }) {
  const badge = BADGES[status] ?? BADGES.ended;
  return (
    <span className={`inline-block rounded-full px-3 py-0.5 text-[11px] font-semibold uppercase tracking-wider ${badge.className}`}>
      {badge.label}
    </span>
  );
}

export default function ChallengeCard({ challenge }) {
  return (
    <article className="group overflow-hidden rounded-xl border border-line bg-white transition hover:border-ink hover:shadow-md flex flex-col justify-between">
      <div>
        <Link href={`/challenges/${challenge.id}`} className="block relative aspect-[3/1] w-full overflow-hidden bg-soft">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={challenge.banner_url}
            alt={challenge.title}
            loading="lazy"
            className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
          />
        </Link>
        <div className="space-y-2 p-5">
          <div className="flex items-start justify-between gap-3">
            <h3 className="font-display text-xl font-semibold text-ink group-hover:text-people transition leading-snug">
              <Link href={`/challenges/${challenge.id}`}>
                {challenge.title}
              </Link>
            </h3>
            <StatusBadge status={challenge.status} />
          </div>
          <p className="text-xs text-mute">
            Curated by <span className="text-ink font-medium">{challenge.curator_name}</span> · Deadline {formatDate(challenge.end_date)}
          </p>
          <p className="text-xs text-ink/80 pt-1">
            <span className="font-semibold text-ink">Prize:</span> {challenge.prize}
          </p>
        </div>
      </div>

      <div className="border-t border-line px-5 py-3 flex items-center justify-between text-xs text-mute bg-soft/30">
        <span>{challenge.submission_count || 0} Submissions</span>
        <Link
          href={`/challenges/${challenge.id}`}
          className="font-semibold text-ink hover:text-people transition"
        >
          View Details
        </Link>
      </div>
    </article>
  );
}
