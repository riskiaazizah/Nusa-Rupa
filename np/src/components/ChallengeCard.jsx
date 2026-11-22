import Link from "next/link";
import { formatDate } from "@/lib/format";

const BADGES = {
  active: { label: "Aktif", className: "bg-forest text-ivory" },
  upcoming: { label: "Segera dimulai", className: "bg-sage/50 text-deep-forest" },
  ended: { label: "Berakhir", className: "bg-deep-forest/10 text-deep-forest" },
};

export function StatusBadge({ status }) {
  const badge = BADGES[status] ?? BADGES.ended;
  return (
    <span className={`inline-block rounded-full px-3 py-1 text-xs font-semibold ${badge.className}`}>
      {badge.label}
    </span>
  );
}

export default function ChallengeCard({ challenge }) {
  return (
    <article className="overflow-hidden rounded-2xl border border-deep-forest/10 bg-white shadow-sm transition hover:shadow-md">
      <Link href={`/challenges/${challenge.id}`} className="block">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={challenge.banner_url}
          alt={`Banner ${challenge.title}`}
          loading="lazy"
          className="aspect-[3/1] w-full object-cover"
        />
      </Link>
      <div className="space-y-2 p-4">
        <div className="flex items-start justify-between gap-3">
          <h3 className="font-semibold leading-snug text-deep-forest">
            <Link href={`/challenges/${challenge.id}`} className="hover:underline">
              {challenge.title}
            </Link>
          </h3>
          <StatusBadge status={challenge.status} />
        </div>
        <p className="text-xs text-deep-forest/70">
          oleh {challenge.curator_name} · sampai {formatDate(challenge.end_date)}
        </p>
        <p className="text-sm text-deep-forest">Hadiah: {challenge.prize}</p>
      </div>
    </article>
  );
}