import Link from "next/link";
import { listChallenges } from "@/lib/challenges";
import ChallengeCard from "@/components/ChallengeCard";

export const metadata = { title: "Challenges" };

const FILTERS = [
  { value: "", label: "All Challenges" },
  { value: "active", label: "Active" },
  { value: "upcoming", label: "Upcoming" },
  { value: "ended", label: "Ended" },
];

export default async function ChallengesPage({ searchParams }) {
  const sp = await searchParams;
  const status = FILTERS.some((f) => f.value && f.value === sp.status) ? sp.status : "";
  const challenges = await listChallenges({ status: status || undefined });

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-28 pb-16 sm:pt-32 sm:pb-20 space-y-10">
      <div className="space-y-3 max-w-2xl">
        <h1 className="font-display text-4xl sm:text-5xl font-semibold text-ink tracking-tight">
          Challenges & Open Calls
        </h1>
        <p className="text-base text-mute leading-relaxed">
          Participate in curated challenges to amplify the voices of Indonesia's forests, wildlife, and communities.
        </p>
      </div>

      <nav aria-label="Filter status" className="flex flex-wrap gap-2 pt-2">
        {FILTERS.map((f) => {
          const active = status === f.value;
          return (
            <Link
              key={f.value || "all"}
              href={f.value ? `/challenges?status=${f.value}` : "/challenges"}
              aria-current={active ? "page" : undefined}
              className={`rounded-full px-4 py-2 text-xs font-semibold uppercase tracking-wider transition ${
                active
                  ? "bg-ink text-white"
                  : "border border-line bg-white text-ink hover:border-ink hover:bg-soft"
              }`}
            >
              {f.label}
            </Link>
          );
        })}
      </nav>

      {challenges.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-line bg-soft/30 px-6 py-16 text-center">
          <p className="text-sm text-mute">No challenges found in this section.</p>
        </div>
      ) : (
        <ul className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {challenges.map((c) => (
            <li key={c.id}>
              <ChallengeCard challenge={c} />
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
