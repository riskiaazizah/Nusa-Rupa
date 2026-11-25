import { notFound } from "next/navigation";
import { getCreator, listArtworks, countArtworks } from "@/lib/gallery";
import { isSafeHttpUrl } from "@/lib/format";
import ArtworkCard from "@/components/ArtworkCard";

export default async function CreatorPage({ params }) {
  const { id } = await params;
  const creatorId = Number(id);
  if (!Number.isInteger(creatorId) || creatorId <= 0) notFound();

  const creator = await getCreator(creatorId);
  if (!creator) notFound();

  const [artworks, total] = await Promise.all([
    listArtworks({ creatorId, sort: "latest", limit: 48 }),
    countArtworks({ creatorId }),
  ]);
  const links = creator.links.filter((l) => isSafeHttpUrl(l.url));

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-28 pb-16 sm:pt-32 sm:pb-20 space-y-12">
      {/* Creator Profile Header */}
      <header className="flex flex-col sm:flex-row items-start sm:items-center gap-6 rounded-2xl border border-line bg-soft/50 p-6 sm:p-10">
        {creator.avatar_url ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={creator.avatar_url}
            alt={creator.display_name}
            className="h-24 w-24 shrink-0 rounded-full object-cover border border-line"
          />
        ) : (
          <div
            aria-hidden="true"
            className="flex h-24 w-24 shrink-0 items-center justify-center rounded-full bg-ink text-3xl font-display font-bold text-white"
          >
            {creator.display_name.charAt(0).toUpperCase()}
          </div>
        )}

        <div className="space-y-3 min-w-0 flex-1">
          <h1 className="font-display text-3xl sm:text-4xl md:text-5xl font-semibold text-ink leading-tight">
            {creator.display_name}
          </h1>

          {creator.bio && (
            <p className="max-w-2xl text-sm leading-relaxed text-mute">
              {creator.bio}
            </p>
          )}

          {links.length > 0 && (
            <ul className="flex flex-wrap gap-2 pt-1">
              {links.map((l) => (
                <li key={l.id}>
                  <a
                    href={l.url}
                    target="_blank"
                    rel="noopener noreferrer nofollow"
                    className="inline-block rounded-full border border-line bg-white px-4 py-1.5 text-xs font-medium text-ink hover:border-ink hover:bg-soft transition"
                  >
                    {l.label}
                  </a>
                </li>
              ))}
            </ul>
          )}
        </div>
      </header>

      {/* Creator Works Gallery */}
      <section className="space-y-6">
        <div className="flex items-baseline justify-between border-b border-line pb-4">
          <h2 className="font-display text-2xl sm:text-3xl font-semibold text-ink">
            Works ({total})
          </h2>
          <span className="text-xs text-mute">Artist Portfolio</span>
        </div>

        {artworks.length === 0 ? (
          <div className="rounded-2xl border border-dashed border-line bg-soft/30 px-6 py-14 text-center">
            <p className="text-sm text-mute">This creator has not published any artworks yet.</p>
          </div>
        ) : (
          <ul className="grid grid-cols-1 gap-6 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
            {artworks.map((a) => (
              <li key={a.id}>
                <ArtworkCard artwork={a} />
              </li>
            ))}
          </ul>
        )}
      </section>
    </div>
  );
}
