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
    <div className="space-y-8">
      <header className="flex flex-col gap-4 rounded-2xl border border-deep-forest/10 bg-white p-6 shadow-sm sm:flex-row sm:items-center">
        {creator.avatar_url ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={creator.avatar_url} alt="" className="h-20 w-20 rounded-full object-cover" />
        ) : (
          <div
            aria-hidden="true"
            className="flex h-20 w-20 shrink-0 items-center justify-center rounded-full bg-forest text-3xl font-bold text-ivory"
          >
            {creator.display_name.charAt(0).toUpperCase()}
          </div>
        )}
        <div className="space-y-2">
          <h1 className="text-2xl font-semibold text-deep-forest">{creator.display_name}</h1>
          {creator.bio && <p className="max-w-2xl text-sm text-deep-forest/80">{creator.bio}</p>}
          {links.length > 0 && (
            <ul className="flex flex-wrap gap-3 text-sm font-semibold">
              {links.map((l) => (
                <li key={l.id}>
                  <a
                    href={l.url}
                    target="_blank"
                    rel="noopener noreferrer nofollow"
                    className="text-forest hover:underline"
                  >
                    {l.label}
                  </a>
                </li>
              ))}
            </ul>
          )}
        </div>
      </header>

      <section className="space-y-4">
        <h2 className="text-xl font-semibold text-deep-forest">Karya ({total})</h2>
        {artworks.length === 0 ? (
          <p className="rounded-2xl border border-dashed border-deep-forest/25 bg-white px-6 py-10 text-center text-sm text-deep-forest/70">
            Kreator ini belum mengunggah karya.
          </p>
        ) : (
          <ul className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
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