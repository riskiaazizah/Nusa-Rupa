import Link from "next/link";
import { listChallenges } from "@/lib/challenges";
import ChallengeCard from "@/components/ChallengeCard";

export const metadata = { title: "Challenge" };

const FILTERS = [
  { value: "", label: "Semua" },
  { value: "active", label: "Aktif" },
  { value: "upcoming", label: "Segera dimulai" },
  { value: "ended", label: "Berakhir" },
];

export default async function ChallengesPage({ searchParams }) {
  const sp = await searchParams;
  const status = FILTERS.some((f) => f.value && f.value === sp.status) ? sp.status : "";
  const challenges = await listChallenges({ status: status || undefined });

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold text-deep-forest">Challenge</h1>
        <p className="mt-1 text-sm text-deep-forest/70">
          Ikuti challenge dari komunitas dan lembaga untuk menyuarakan alam lewat karya.
        </p>
      </div>

      <nav aria-label="Filter status" className="flex flex-wrap gap-2">
        {FILTERS.map((f) => {
          const active = status === f.value;
          return (
            <Link
              key={f.value || "all"}
              href={f.value ? `/challenges?status=${f.value}` : "/challenges"}
              aria-current={active ? "true" : undefined}
              className={`rounded-full border px-4 py-1.5 text-sm font-medium transition ${
                active
                  ? "border-forest bg-forest text-ivory"
                  : "border-deep-forest/25 bg-white text-deep-forest hover:border-forest"
              }`}
            >
              {f.label}
            </Link>
          );
        })}
      </nav>

      {challenges.length === 0 ? (
        <p className="rounded-2xl border border-dashed border-deep-forest/25 bg-white px-6 py-10 text-center text-sm text-deep-forest/70">
          Tidak ada challenge pada kategori ini.
        </p>
      ) : (
        <ul className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
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