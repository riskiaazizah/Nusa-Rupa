import Link from "next/link";

export default function ArtworkCard({ artwork }) {
  return (
    <article className="group overflow-hidden rounded-2xl border border-deep-forest/10 bg-white shadow-sm transition hover:shadow-md">
      <Link href={`/artworks/${artwork.id}`} className="block overflow-hidden">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={artwork.file_url}
          alt={artwork.title}
          loading="lazy"
          className="aspect-[4/3] w-full object-cover transition duration-300 group-hover:scale-[1.03]"
        />
      </Link>
      <div className="space-y-1 p-4">
        <h3 className="font-semibold leading-snug text-deep-forest">
          <Link href={`/artworks/${artwork.id}`} className="hover:underline">
            {artwork.title}
          </Link>
        </h3>
        <p className="text-sm text-deep-forest/70">
          oleh{" "}
          <Link href={`/creators/${artwork.creator_id}`} className="font-medium text-forest hover:underline">
            {artwork.creator_name}
          </Link>
        </p>
        <p className="flex items-center justify-between text-xs text-deep-forest/70">
          <span>{artwork.category_name}</span>
          <span>{artwork.like_count} suka</span>
        </p>
      </div>
    </article>
  );
}