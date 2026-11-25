"use client";

import { useState, useTransition } from "react";
import { Heart, Bookmark } from "lucide-react";
import { useRouter } from "next/navigation";
import { toggleLikeAction, toggleFavoriteAction } from "@/app/(public)/artworks/[id]/actions";

export default function CardInteractionButtons({ artwork, userRole, variant = "row" }) {
  const router = useRouter();
  const [liked, setLiked] = useState(Boolean(artwork.liked));
  const [likeCount, setLikeCount] = useState(Number(artwork.like_count || 0));
  const [favorited, setFavorited] = useState(Boolean(artwork.favorited));
  const [isPending, startTransition] = useTransition();
  const [notice, setNotice] = useState("");

  const showNotice = (text) => {
    setNotice(text);
    setTimeout(() => setNotice(""), 3000);
  };

  const handleLike = (e) => {
    e.preventDefault();
    e.stopPropagation();

    if (!userRole) {
      router.push("/login");
      return;
    }

    if (userRole !== "member") {
      showNotice("Only Members can like artworks.");
      return;
    }

    const prevLiked = liked;
    const prevCount = likeCount;
    const nextLiked = !prevLiked;
    const nextCount = nextLiked ? prevCount + 1 : Math.max(0, prevCount - 1);

    setLiked(nextLiked);
    setLikeCount(nextCount);

    startTransition(async () => {
      const formData = new FormData();
      formData.set("artworkId", String(artwork.id));
      try {
        await toggleLikeAction(formData);
      } catch (err) {
        setLiked(prevLiked);
        setLikeCount(prevCount);
      }
    });
  };

  const handleFavorite = (e) => {
    e.preventDefault();
    e.stopPropagation();

    if (!userRole) {
      router.push("/login");
      return;
    }

    if (userRole !== "member") {
      showNotice("Only Members can save favorites.");
      return;
    }

    const prevFavorited = favorited;
    const nextFavorited = !prevFavorited;

    setFavorited(nextFavorited);

    startTransition(async () => {
      const formData = new FormData();
      formData.set("artworkId", String(artwork.id));
      try {
        await toggleFavoriteAction(formData);
      } catch (err) {
        setFavorited(prevFavorited);
      }
    });
  };

  // Floating thumbnail favorite button
  if (variant === "floating-favorite") {
    return (
      <div className="relative">
        <button
          type="button"
          onClick={handleFavorite}
          disabled={isPending}
          aria-label={favorited ? "Remove from favorites" : "Save to favorites"}
          aria-pressed={favorited}
          className={`flex h-9 w-9 items-center justify-center rounded-full backdrop-blur-md transition-all duration-200 cursor-pointer shadow-md ${
            favorited
              ? "bg-amber-500 text-white hover:bg-amber-600 scale-105"
              : "bg-black/45 text-white hover:bg-white hover:text-ink hover:scale-105"
          }`}
        >
          <Bookmark className={`h-4 w-4 ${favorited ? "fill-current" : ""}`} />
        </button>
        {notice && (
          <div className="absolute right-0 top-11 z-30 whitespace-nowrap rounded-lg bg-ink/90 px-2.5 py-1 text-[11px] font-medium text-white shadow-lg">
            {notice}
          </div>
        )}
      </div>
    );
  }

  // Action row (Heart Like Button + Bookmark Favorite Button)
  return (
    <div className="relative flex items-center gap-2">
      {/* Like Button */}
      <button
        type="button"
        onClick={handleLike}
        disabled={isPending}
        aria-label={liked ? "Unlike artwork" : "Like artwork"}
        aria-pressed={liked}
        className={`group/like flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-semibold transition cursor-pointer ${
          liked
            ? "bg-people/10 text-people hover:bg-people/15"
            : "text-mute hover:bg-soft hover:text-ink"
        }`}
      >
        <Heart
          className={`h-4 w-4 transition-transform group-hover/like:scale-110 ${
            liked ? "fill-people text-people" : "text-mute group-hover/like:text-ink"
          }`}
        />
        <span>{likeCount}</span>
      </button>

      {/* Favorite Button */}
      <button
        type="button"
        onClick={handleFavorite}
        disabled={isPending}
        aria-label={favorited ? "Remove from favorites" : "Save to favorites"}
        aria-pressed={favorited}
        className={`group/fav flex items-center gap-1 rounded-full p-1.5 text-xs font-semibold transition cursor-pointer ${
          favorited
            ? "bg-amber-50 text-amber-600 hover:bg-amber-100"
            : "text-mute hover:bg-soft hover:text-ink"
        }`}
      >
        <Bookmark
          className={`h-4 w-4 transition-transform group-hover/fav:scale-110 ${
            favorited ? "fill-current text-amber-600" : "text-mute group-hover/fav:text-ink"
          }`}
        />
      </button>

      {notice && (
        <div className="absolute left-0 bottom-8 z-30 whitespace-nowrap rounded-lg bg-ink/90 px-2.5 py-1 text-[11px] font-medium text-white shadow-lg">
          {notice}
        </div>
      )}
    </div>
  );
}
