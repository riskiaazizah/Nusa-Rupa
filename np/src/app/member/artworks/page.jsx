import Link from "next/link";
import { requireRole } from "@/lib/session";
import { listArtworksByUser } from "@/lib/artworks";
import DeleteArtworkButton from "@/components/member/DeleteArtworkButton";

export const metadata = { title: "My Artworks · TIGA" };

const dateFormat = new Intl.DateTimeFormat("en-US", { dateStyle: "medium" });

export default async function MyArtworksPage() {
  const user = await requireRole("member");
  const artworks = await listArtworksByUser(user.id);

  return (
    <div className="space-y-8">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="font-display text-3xl sm:text-4xl font-semibold text-ink">My Artworks</h1>
          <p className="mt-1.5 text-base text-mute">{artworks.length} artworks uploaded.</p>
        </div>
        <Link
          href="/member/artworks/new"
          className="rounded-full bg-forest px-6 py-2.5 text-sm sm:text-base font-semibold text-white transition hover:opacity-90"
        >
          Add artwork
        </Link>
      </div>

      {artworks.length === 0 ? (
        <div className="rounded-2xl border border-line bg-white px-6 py-16 text-center shadow-sm">
          <p className="font-display text-2xl font-semibold text-ink">No artworks yet.</p>
          <p className="mx-auto mt-2 max-w-md text-base text-mute">
            Share your first artwork to let nature speak through your artistic vision.
          </p>
          <Link
            href="/member/artworks/new"
            className="mt-6 inline-block rounded-full bg-forest px-6 py-2.5 text-sm sm:text-base font-semibold text-white transition hover:opacity-90"
          >
            Upload your first work
          </Link>
        </div>
      ) : (
        <ul className="grid gap-6 sm:grid-cols-2 xl:grid-cols-3">
          {artworks.map((a) => (
            <li
              key={a.id}
              className="flex flex-col overflow-hidden rounded-2xl border border-line bg-white shadow-sm transition hover:border-ink/30"
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={a.file_url} alt={a.title} loading="lazy" className="aspect-[4/5] w-full object-cover" />
              <div className="flex flex-1 flex-col gap-3 p-5 sm:p-6">
                <Link href={`/artworks/${a.id}`} className="font-display text-xl sm:text-2xl font-semibold text-ink hover:text-people">
                  {a.title}
                </Link>
                <p className="text-sm text-mute">
                  {a.category_name} · {dateFormat.format(a.created_at)} · {a.like_count} likes
                </p>
                <ul className="flex flex-wrap gap-1.5">
                  {a.tags.map((t) => (
                    <li key={t} className="rounded-full bg-soft px-3 py-1 text-xs sm:text-sm text-mute font-medium">
                      #{t}
                    </li>
                  ))}
                </ul>
                <div className="mt-auto flex items-center justify-between border-t border-line/60 pt-4 text-sm font-semibold">
                  <Link href={`/member/artworks/${a.id}/edit`} className="text-forest hover:underline">
                    Edit
                  </Link>
                  <DeleteArtworkButton id={a.id} />
                </div>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
