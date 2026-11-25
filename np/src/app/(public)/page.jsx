import Link from "next/link";
import { getSession } from "@/lib/session";
import { listArtworks } from "@/lib/gallery";
import { listCategories } from "@/lib/categories";
import { listChallenges } from "@/lib/challenges";
import HeroVideo from "@/components/home/HeroVideo";
import CollectionCatalog from "@/components/home/CollectionCatalog";
import ChallengeCard from "@/components/ChallengeCard";

export default async function HomePage() {
  const [user, artworks, categories, activeChallenges] = await Promise.all([
    getSession(),
    listArtworks({ limit: 100 }),
    listCategories(),
    listChallenges({ status: "active", limit: 3 }),
  ]);

  return (
    <div className="w-full bg-white">
      {/* 1. Fullscreen Hero Video */}
      <HeroVideo user={user} />

      {/* 2. Collection Section (MAP India style catalog) */}
      <CollectionCatalog initialArtworks={artworks} categories={categories} user={user} />

      {/* 3. Active Challenges Editorial Section */}
      {activeChallenges.length > 0 && (
        <section className="bg-soft/50 border-t border-line py-16 sm:py-24">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
            <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
              <div className="space-y-2">
                <p className="text-xs font-semibold uppercase tracking-widest text-mute">Open Calls</p>
                <h2 className="font-display text-3xl sm:text-4xl font-semibold text-ink">
                  Active Challenges
                </h2>
              </div>
              <Link
                href="/challenges"
                className="inline-block text-sm font-semibold text-ink hover:text-people transition underline underline-offset-4"
              >
                View all challenges
              </Link>
            </div>

            <ul className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {activeChallenges.map((c) => (
                <li key={c.id}>
                  <ChallengeCard challenge={c} />
                </li>
              ))}
            </ul>
          </div>
        </section>
      )}

      {/* 4. Editorial Footnotes Section */}
      <section className="border-t border-line py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="space-y-2 border-l-2 border-forest pl-4">
              <p className="font-display text-3xl sm:text-4xl font-bold text-ink">243,241 ha</p>
              <p className="text-xs text-mute leading-relaxed">
                Peatland burned in Indonesia, releasing decades of stored carbon. Source: Pantau Gambut (2026).
              </p>
            </div>
            <div className="space-y-2 border-l-2 border-animals pl-4">
              <p className="font-display text-3xl sm:text-4xl font-bold text-ink">41.1M</p>
              <p className="text-xs text-mute leading-relaxed">
                People exposed to hazardous haze and smoke in Sumatra and Kalimantan. Source: Greenpeace Indonesia.
              </p>
            </div>
            <div className="space-y-2 border-l-2 border-people pl-4">
              <p className="font-display text-3xl sm:text-4xl font-bold text-ink">31M tons</p>
              <p className="text-xs text-mute leading-relaxed">
                Estimated greenhouse gas emissions from peat and forest fires. Source: WALHI Indonesia.
              </p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
