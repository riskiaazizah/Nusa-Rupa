import Link from "next/link";
import { requireRole } from "@/lib/session";
import { listFavorites } from "@/lib/favorites";
import ArtworkCard from "@/components/ArtworkCard";

export const metadata = { title: "My Favorites · TIGA" };

export default async function MyFavoritesPage() {
  const user = await requireRole("member");
  const favorites = await listFavorites(user.id);

  return (
    <div className="space-y-8">
      <div>
        <h1 className="font-display text-3xl font-semibold text-ink">My Favorites</h1>
        <p className="mt-1 text-sm text-mute">
          Works you have saved for reflection and inspiration.
        </p>
      </div>

      {favorites.length === 0 ? (
        <div className="rounded-2xl border border-line bg-white px-6 py-16 text-center shadow-sm">
          <p className="font-display text-2xl font-semibold text-ink">No favorites yet.</p>
          <p className="mx-auto mt-2 max-w-md text-sm text-mute">
            Explore the collection and bookmark works that speak to you.
          </p>
          <Link
            href="/"
            className="mt-6 inline-block rounded-full bg-forest px-6 py-2.5 text-sm font-semibold text-white transition hover:opacity-90"
          >
            Explore Collection
          </Link>
        </div>
      ) : (
        <ul className="grid grid-cols-1 gap-6 sm:grid-cols-2 xl:grid-cols-3">
          {favorites.map((art) => (
            <li key={art.id}>
              <ArtworkCard artwork={art} userRole={user.role} />
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

