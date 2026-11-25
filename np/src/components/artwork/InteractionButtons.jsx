import Link from "next/link";
import { toggleLikeAction, toggleFavoriteAction } from "@/app/(public)/artworks/[id]/actions";

const PILL =
  "inline-flex items-center justify-center rounded-full px-5 py-2 text-xs font-semibold uppercase tracking-wider transition cursor-pointer";
const IDLE = "border border-line bg-white text-ink hover:border-ink hover:bg-soft";
const ACTIVE = "bg-ink text-white hover:bg-people";
const DISABLED = "cursor-not-allowed border border-line bg-soft text-mute";

// mode: "guest" | "member" | "blocked" (Admin / Curator)
export default function InteractionButtons({ artwork, mode }) {
  if (mode === "guest") {
    return (
      <div className="space-y-2 pt-2">
        <div className="flex flex-wrap gap-2.5">
          <Link href="/login" className={`${PILL} ${IDLE}`}>
            Like ({artwork.like_count})
          </Link>
          <Link href="/login" className={`${PILL} ${IDLE}`}>
            Favorite
          </Link>
        </div>
        <p className="text-xs text-mute">
          Log in as a Member to like, favorite, or comment.
        </p>
      </div>
    );
  }

  if (mode === "blocked") {
    return (
      <div className="space-y-2 pt-2">
        <div className="flex flex-wrap gap-2.5">
          <span aria-disabled="true" className={`${PILL} ${DISABLED}`}>
            {artwork.like_count} likes
          </span>
        </div>
        <p className="text-xs text-mute">
          Curators can browse, but only Members can interact.
        </p>
      </div>
    );
  }

  return (
    <div className="flex flex-wrap items-center gap-3 pt-2">
      <form action={toggleLikeAction}>
        <input type="hidden" name="artworkId" value={artwork.id} />
        <button type="submit" aria-pressed={artwork.liked} className={`${PILL} ${artwork.liked ? ACTIVE : IDLE}`}>
          {artwork.liked ? "Liked" : "Like"} ({artwork.like_count})
        </button>
      </form>
      <form action={toggleFavoriteAction}>
        <input type="hidden" name="artworkId" value={artwork.id} />
        <button type="submit" aria-pressed={artwork.favorited} className={`${PILL} ${artwork.favorited ? ACTIVE : IDLE}`}>
          {artwork.favorited ? "Favorited" : "Save to Favorites"}
        </button>
      </form>
    </div>
  );
}
