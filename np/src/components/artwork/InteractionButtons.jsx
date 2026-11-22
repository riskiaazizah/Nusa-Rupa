import Link from "next/link";
import { toggleLikeAction, toggleFavoriteAction } from "@/app/(public)/artworks/[id]/actions";

const BASE =
  "inline-flex items-center gap-2 rounded-xl border px-4 py-2 text-sm font-semibold transition";
const IDLE = "border-deep-forest/25 bg-white text-deep-forest hover:border-forest";
const ACTIVE = "border-forest bg-forest text-ivory hover:bg-deep-forest";
const DISABLED = "cursor-not-allowed border-deep-forest/15 text-deep-forest/50";

// mode: "guest" | "member" | "blocked" (Admin / Curator)
export default function InteractionButtons({ artwork, mode }) {
  if (mode === "guest") {
    return (
      <div className="flex flex-wrap gap-3">
        <Link href="/login" className={`${BASE} ${IDLE}`}>
          Masuk untuk menyukai ({artwork.like_count})
        </Link>
        <Link href="/login" className={`${BASE} ${IDLE}`}>
          Masuk untuk menyimpan
        </Link>
      </div>
    );
  }

  if (mode === "blocked") {
    return (
      <div>
        <div className="flex flex-wrap gap-3">
          <span aria-disabled="true" className={`${BASE} ${DISABLED}`}>{artwork.like_count} suka</span>
        </div>
        <p className="mt-2 text-xs text-deep-forest/70">
          Hanya akun Member yang dapat menyukai, menyimpan, dan berkomentar.
        </p>
      </div>
    );
  }

  return (
    <div className="flex flex-wrap gap-3">
      <form action={toggleLikeAction}>
        <input type="hidden" name="artworkId" value={artwork.id} />
        <button type="submit" aria-pressed={artwork.liked} className={`${BASE} ${artwork.liked ? ACTIVE : IDLE}`}>
          {artwork.liked ? "Batal suka" : "Suka"} ({artwork.like_count})
        </button>
      </form>
      <form action={toggleFavoriteAction}>
        <input type="hidden" name="artworkId" value={artwork.id} />
        <button type="submit" aria-pressed={artwork.favorited} className={`${BASE} ${artwork.favorited ? ACTIVE : IDLE}`}>
          {artwork.favorited ? "Hapus dari favorit" : "Simpan ke favorit"}
        </button>
      </form>
    </div>
  );
}