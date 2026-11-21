import Link from "next/link";
import { requireRole } from "@/lib/session";
import { listArtworksByUser } from "@/lib/artworks";
import DeleteArtworkButton from "@/components/member/DeleteArtworkButton";

export const metadata = { title: "Karya Saya" };

const dateFormat = new Intl.DateTimeFormat("id-ID", { dateStyle: "medium" });

export default async function MyArtworksPage() {
  const user = await requireRole("member");
  const artworks = await listArtworksByUser(user.id);

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl font-semibold text-deep-forest">Karya Saya</h1>
          <p className="mt-1 text-sm text-deep-forest/70">{artworks.length} karya diunggah.</p>
        </div>
        <Link
          href="/member/artworks/new"
          className="rounded-xl bg-forest px-5 py-2.5 text-sm font-semibold text-ivory transition hover:bg-deep-forest"
        >
          Unggah Karya
        </Link>
      </div>

      {artworks.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-deep-forest/25 bg-white px-6 py-14 text-center">
          <p className="font-medium text-deep-forest">Belum ada karya.</p>
          <p className="mt-1 text-sm text-deep-forest/70">
            Bagikan karya pertama Anda untuk menyuarakan alam lewat seni.
          </p>
          <Link
            href="/member/artworks/new"
            className="mt-5 inline-block rounded-xl bg-forest px-5 py-2.5 text-sm font-semibold text-ivory hover:bg-deep-forest"
          >
            Unggah karya pertama
          </Link>
        </div>
      ) : (
        <ul className="grid gap-5 sm:grid-cols-2 xl:grid-cols-3">
          {artworks.map((a) => (
            <li
              key={a.id}
              className="flex flex-col overflow-hidden rounded-2xl border border-deep-forest/10 bg-white shadow-sm"
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={a.file_url} alt={a.title} loading="lazy" className="aspect-[4/3] w-full object-cover" />
              <div className="flex flex-1 flex-col gap-2 p-4">
                <h2 className="font-semibold text-deep-forest">{a.title}</h2>
                <p className="text-xs text-deep-forest/70">
                  {a.category_name} · {dateFormat.format(a.created_at)} · {a.like_count} suka
                </p>
                <ul className="flex flex-wrap gap-1.5">
                  {a.tags.map((t) => (
                    <li key={t} className="rounded-full bg-sage/30 px-2.5 py-0.5 text-xs text-deep-forest">
                      #{t}
                    </li>
                  ))}
                </ul>
                <div className="mt-auto flex items-start gap-4 pt-3 text-sm font-semibold">
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