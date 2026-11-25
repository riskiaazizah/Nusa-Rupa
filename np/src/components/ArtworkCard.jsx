import Link from "next/link";
import CardInteractionButtons from "@/components/artwork/CardInteractionButtons";

const CATEGORY_COLORS = {
  flora: "#1f6b45",
  environment: "#1f6b45",
  fauna: "#2f3fa8",
  "conservation & hope": "#2f3fa8",
  "social impact": "#d92e1c",
  "culture & heritage": "#d92e1c",
};

export default function ArtworkCard({ artwork, userRole }) {
  const dotColor = CATEGORY_COLORS[(artwork.category_name || "").toLowerCase()] || "#0f0f0f";

  return (
    <article className="group relative flex flex-col overflow-hidden rounded-2xl border border-line bg-white transition-all duration-300 hover:border-ink/40 hover:shadow-lg">
      {/* Aspect Ratio Thumbnail matching Category cards (16/11) */}
      <div className="relative aspect-[16/11] w-full overflow-hidden bg-soft">
        <Link href={`/artworks/${artwork.id}`} className="block h-full w-full">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={artwork.file_url}
            alt={artwork.title}
            loading="lazy"
            className="h-full w-full object-cover transition-transform duration-500 ease-out group-hover:scale-105"
          />
        </Link>

        {/* Floating Quick Favorite Button */}
        <div className="absolute top-3 right-3 z-10">
          <CardInteractionButtons artwork={artwork} userRole={userRole} variant="floating-favorite" />
        </div>
      </div>

      <div className="flex flex-1 flex-col justify-between p-5 sm:p-6 space-y-3.5">
        <div className="space-y-1.5">
          {/* Category Dot + Category Name */}
          <div className="flex items-center gap-2 text-xs uppercase tracking-wider text-mute">
            <span
              className="inline-block h-2.5 w-2.5 rounded-full shrink-0"
              style={{ backgroundColor: dotColor }}
              aria-hidden="true"
            />
            <span className="font-semibold">{artwork.category_name}</span>
          </div>

          {/* Title in Cormorant Garamond */}
          <h3 className="font-display text-2xl font-semibold leading-snug text-ink line-clamp-2">
            <Link href={`/artworks/${artwork.id}`} className="hover:text-people transition">
              {artwork.title}
            </Link>
          </h3>

          {/* Artist link */}
          <p className="text-sm text-mute truncate">
            by{" "}
            <Link href={`/creators/${artwork.creator_id}`} className="text-ink font-medium hover:underline">
              {artwork.creator_name}
            </Link>
          </p>
        </div>

        {/* Action Row: Interactive Like/Favorite + View Button */}
        <div className="flex items-center justify-between border-t border-line/75 pt-3.5 text-xs text-mute">
          <CardInteractionButtons artwork={artwork} userRole={userRole} variant="row" />

          <Link
            href={`/artworks/${artwork.id}`}
            className="rounded-full border border-line px-4 py-1.5 text-xs font-semibold text-ink hover:border-ink hover:bg-soft transition shrink-0"
          >
            View Details
          </Link>
        </div>
      </div>
    </article>
  );
}
