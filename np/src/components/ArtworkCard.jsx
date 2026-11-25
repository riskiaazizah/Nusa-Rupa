import Link from "next/link";

const CATEGORY_COLORS = {
  flora: "#1f6b45",
  environment: "#1f6b45",
  fauna: "#2f3fa8",
  "conservation & hope": "#2f3fa8",
  "social impact": "#d92e1c",
  "culture & heritage": "#d92e1c",
};

export default function ArtworkCard({ artwork }) {
  const dotColor = CATEGORY_COLORS[(artwork.category_name || "").toLowerCase()] || "#0f0f0f";

  return (
    <article className="group flex flex-col overflow-hidden rounded-xl border border-line bg-white transition-all duration-300 hover:border-ink hover:shadow-md">
      {/* 4:5 Aspect Ratio Thumbnail with subtle hover zoom */}
      <Link href={`/artworks/${artwork.id}`} className="block relative aspect-[4/5] w-full overflow-hidden bg-soft">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={artwork.file_url}
          alt={artwork.title}
          loading="lazy"
          className="h-full w-full object-cover transition-transform duration-500 ease-out group-hover:scale-105"
        />
      </Link>

      <div className="flex flex-1 flex-col justify-between p-4 space-y-3">
        <div className="space-y-1.5">
          {/* Category Dot + Category Name */}
          <div className="flex items-center gap-2 text-[11px] uppercase tracking-wider text-mute">
            <span
              className="inline-block h-2 w-2 rounded-full shrink-0"
              style={{ backgroundColor: dotColor }}
              aria-hidden="true"
            />
            <span className="truncate">{artwork.category_name}</span>
          </div>

          {/* Title in Cormorant Garamond (22px) */}
          <h3 className="font-display text-[22px] font-semibold leading-snug text-ink line-clamp-2">
            <Link href={`/artworks/${artwork.id}`} className="hover:text-people transition">
              {artwork.title}
            </Link>
          </h3>

          {/* Artist link */}
          <p className="text-xs text-mute truncate">
            by{" "}
            <Link href={`/creators/${artwork.creator_id}`} className="text-ink font-medium hover:underline">
              {artwork.creator_name}
            </Link>
          </p>
        </div>

        {/* Action Row */}
        <div className="flex items-center justify-between border-t border-line/75 pt-3 text-xs text-mute">
          <span className="font-medium text-ink">{artwork.like_count || 0} likes</span>
          <Link
            href={`/artworks/${artwork.id}`}
            className="rounded-full border border-line px-3 py-1 text-[11px] font-semibold text-ink hover:border-ink hover:bg-soft transition"
          >
            View
          </Link>
        </div>
      </div>
    </article>
  );
}
