"use client";

import * as React from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { X, ExternalLink, Heart } from "lucide-react";

const spring = {
  type: "spring",
  stiffness: 350,
  damping: 35,
  mass: 1,
};

const PILLARS = {
  forest: {
    key: "forest",
    label: "For the Forest",
    subtitle: "Flora & Environment",
    color: "#1f6b45",
    categories: ["flora", "environment"],
  },
  animals: {
    key: "animals",
    label: "For the Animals",
    subtitle: "Fauna & Conservation",
    color: "#2f3fa8",
    categories: ["fauna", "conservation & hope"],
  },
  people: {
    key: "people",
    label: "For the People",
    subtitle: "Impact & Heritage",
    color: "#d92e1c",
    categories: ["social impact", "culture & heritage"],
  },
};

const PILLAR_KEYS = ["forest", "animals", "people"];

function getArtworkPillar(artwork) {
  const cat = (artwork.category_name || "").toLowerCase();
  for (const key of PILLAR_KEYS) {
    if (PILLARS[key].categories.includes(cat)) return key;
  }
  return "forest";
}

export default function TigaBloomGallery({
  artworks = [],
  aspect = "4 / 5",
  gap = 20,
}) {
  const [selectedArtwork, setSelectedArtwork] = React.useState(null);
  const [selectedPillar, setSelectedPillar] = React.useState("all");
  const chipRefs = React.useRef([]);

  // Handle escape key for expanded view
  React.useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === "Escape") setSelectedArtwork(null);
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  // Lock body scroll when modal is open
  React.useEffect(() => {
    if (selectedArtwork) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "auto";
    }
    return () => {
      document.body.style.overflow = "auto";
    };
  }, [selectedArtwork]);

  // Pillar counts
  const counts = React.useMemo(() => {
    const map = { all: artworks.length, forest: 0, animals: 0, people: 0 };
    for (const art of artworks) {
      const p = getArtworkPillar(art);
      map[p] = (map[p] || 0) + 1;
    }
    return map;
  }, [artworks]);

  const choices = ["all", "forest", "animals", "people"];

  // Keyboard navigation for chips
  const onChipKey = (event) => {
    if (event.key !== "ArrowRight" && event.key !== "ArrowLeft") return;
    event.preventDefault();
    const at = Math.max(0, choices.indexOf(selectedPillar));
    const next = (at + (event.key === "ArrowRight" ? 1 : -1) + choices.length) % choices.length;
    setSelectedPillar(choices[next]);
    chipRefs.current[next]?.focus();
  };

  // Filter artworks strictly by selected pillar (always full color, zero grayscale)
  const visibleArtworks = React.useMemo(() => {
    if (selectedPillar === "all") return artworks;
    return artworks.filter((art) => getArtworkPillar(art) === selectedPillar);
  }, [artworks, selectedPillar]);

  const activeLabel =
    selectedPillar === "all"
      ? "All Artworks"
      : PILLARS[selectedPillar]?.label;

  return (
    <div className="w-full space-y-6">
      {/* Interactive Pillar Selector Tabs */}
      <div className="flex flex-wrap items-center justify-between gap-4 border-b border-line pb-4">
        <div
          role="radiogroup"
          aria-label="Filter artworks by issue pillar"
          className="flex flex-wrap items-center gap-2"
          onKeyDown={onChipKey}
        >
          {choices.map((choice, i) => {
            const selected = selectedPillar === choice;
            const count = counts[choice] || 0;
            const pillar = PILLARS[choice];

            return (
              <button
                key={choice}
                ref={(node) => {
                  chipRefs.current[i] = node;
                }}
                type="button"
                role="radio"
                aria-checked={selected}
                tabIndex={selected ? 0 : -1}
                onClick={() => setSelectedPillar(choice)}
                className={`group inline-flex items-center gap-2 rounded-full border px-4 py-2 text-xs font-semibold tracking-wide transition-all duration-200 cursor-pointer ${
                  selected
                    ? "border-ink bg-ink text-white shadow-xs"
                    : "border-line bg-white text-ink hover:border-ink hover:bg-soft"
                }`}
              >
                <span
                  aria-hidden="true"
                  className="h-2.5 w-2.5 rounded-full ring-1 ring-black/10 shrink-0"
                  style={{
                    background:
                      choice === "all"
                        ? "conic-gradient(#1f6b45, #2f3fa8, #d92e1c, #1f6b45)"
                        : pillar.color,
                  }}
                />
                <span>{choice === "all" ? "All Works" : pillar.label}</span>
                <span className={`text-[11px] tabular-nums ${selected ? "text-white/70" : "text-mute"}`}>
                  {count}
                </span>
              </button>
            );
          })}
        </div>

        <p aria-live="polite" className="text-xs text-mute font-medium">
          Showing <span className="text-ink font-semibold">{counts[selectedPillar] || 0}</span> works in{" "}
          <span className="text-ink font-semibold">{activeLabel}</span>
        </p>
      </div>

      {/* Grid of Artworks (Always Vibrant Full Color, Shared Element Transition) */}
      <div
        role="list"
        className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4"
        style={{ gap }}
      >
        {visibleArtworks.map((art) => {
          const pillarKey = getArtworkPillar(art);
          const pillar = PILLARS[pillarKey];

          return (
            <div key={art.id} role="listitem" className="min-w-0">
              <motion.div
                data-artwork-id={art.id}
                whileHover={{ y: -4 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => setSelectedArtwork(art)}
                className="group relative block w-full overflow-hidden rounded-2xl bg-soft border border-line outline-none cursor-zoom-in transition-all duration-300 hover:border-ink/40 hover:shadow-xl"
                style={{ aspectRatio: aspect }}
              >
                {/* 100% Vibrant Full-Color Image with Shared Element Layout ID */}
                <motion.img
                  layoutId={`image-${art.id}`}
                  src={art.file_url}
                  alt={art.title}
                  draggable={false}
                  className="absolute inset-0 h-full w-full object-cover transition-transform duration-500 ease-out group-hover:scale-105"
                  transition={spring}
                />

                {/* Top-Left Pillar Badge */}
                <div className="absolute left-3 top-3 z-10 flex items-center gap-1.5 rounded-full bg-black/60 backdrop-blur-xs px-2.5 py-1 text-[10px] font-semibold tracking-wider uppercase text-white shadow-xs">
                  <span
                    aria-hidden="true"
                    className="h-2 w-2 rounded-full"
                    style={{ backgroundColor: pillar.color }}
                  />
                  <span>{pillar.label}</span>
                </div>

                {/* Top-Right Quick Link to Details */}
                <Link
                  href={`/artworks/${art.id}`}
                  onClick={(e) => e.stopPropagation()}
                  aria-label={`View story for ${art.title}`}
                  className="absolute top-3 right-3 z-20 flex h-7 w-7 items-center justify-center rounded-full bg-black/60 backdrop-blur-xs text-white opacity-0 group-hover:opacity-100 hover:bg-white hover:text-ink transition shadow-xs"
                >
                  <ExternalLink className="h-3.5 w-3.5" />
                </Link>

                {/* Bottom Editorial Caption */}
                <div className="pointer-events-none absolute inset-x-0 bottom-0 z-10 bg-gradient-to-t from-black/85 via-black/40 to-transparent p-4 pt-10 text-white">
                  <p className="text-[11px] uppercase tracking-wider text-white/70">
                    {art.category_name}
                  </p>
                  <h3 className="font-display text-xl font-semibold leading-tight text-white group-hover:text-cream transition line-clamp-1">
                    {art.title}
                  </h3>
                  <div className="flex items-center justify-between pt-1 text-xs text-white/80">
                    <span className="truncate">by {art.creator_name}</span>
                    <span className="text-[11px] font-medium text-white/90 shrink-0">
                      {art.like_count || 0} likes
                    </span>
                  </div>
                </div>
              </motion.div>
            </div>
          );
        })}
      </div>

      {/* Expanded Shared-Element View Modal with Drag-to-Dismiss */}
      <AnimatePresence>
        {selectedArtwork && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-8">
            {/* Frosted glass backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.3 }}
              className="absolute inset-0 bg-black/85 backdrop-blur-2xl"
              onClick={() => setSelectedArtwork(null)}
            />

            {/* Interactive container for drag gesture */}
            <motion.div
              className="relative z-10 w-full h-full flex flex-col items-center justify-center cursor-zoom-out select-none"
              drag="y"
              dragConstraints={{ top: 0, bottom: 0 }}
              dragElastic={0.8}
              onDragEnd={(e, info) => {
                if (
                  Math.abs(info.offset.y) > 100 ||
                  Math.abs(info.velocity.y) > 300
                ) {
                  setSelectedArtwork(null);
                }
              }}
              onClick={() => setSelectedArtwork(null)}
            >
              {/* The Shared Element (Full Color High-Res) */}
              <motion.img
                layoutId={`image-${selectedArtwork.id}`}
                src={selectedArtwork.file_url}
                alt={selectedArtwork.title}
                className="w-auto h-auto max-w-[92vw] max-h-[74vh] sm:max-h-[78vh] rounded-2xl shadow-2xl object-contain will-change-transform"
                draggable={false}
                transition={spring}
              />

              {/* Editorial TIGA Artwork Info Overlay Card */}
              <motion.div
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 15 }}
                transition={{ delay: 0.15, duration: 0.25 }}
                className="mt-4 flex flex-wrap items-center justify-between gap-4 max-w-2xl w-full bg-white/10 backdrop-blur-md border border-white/15 rounded-2xl px-5 py-3.5 text-white pointer-events-auto shadow-2xl"
                onClick={(e) => e.stopPropagation()}
              >
                <div className="min-w-0 space-y-0.5">
                  <div className="flex items-center gap-2">
                    <span
                      className="inline-block h-2 w-2 rounded-full"
                      style={{
                        backgroundColor:
                          PILLARS[getArtworkPillar(selectedArtwork)]?.color || "#1f6b45",
                      }}
                    />
                    <span className="text-[11px] font-semibold uppercase tracking-widest text-white/70">
                      {selectedArtwork.category_name}
                    </span>
                  </div>
                  <h3 className="font-display text-xl sm:text-2xl font-semibold truncate text-white">
                    {selectedArtwork.title}
                  </h3>
                  <p className="text-xs text-white/80 truncate">
                    by <span className="font-medium text-white">{selectedArtwork.creator_name}</span>
                    {typeof selectedArtwork.like_count === "number" && (
                      <span className="ml-3 inline-flex items-center gap-1 text-[11px] text-white/70">
                        <Heart className="h-3 w-3 fill-current text-white/60" /> {selectedArtwork.like_count}
                      </span>
                    )}
                  </p>
                </div>

                <Link
                  href={`/artworks/${selectedArtwork.id}`}
                  className="shrink-0 flex items-center gap-1.5 rounded-full bg-white px-4 py-2 text-xs font-semibold text-ink hover:bg-cream transition shadow-xs"
                >
                  <span>View Full Story</span>
                  <ExternalLink className="h-3.5 w-3.5" />
                </Link>
              </motion.div>
            </motion.div>

            {/* Close Button */}
            <motion.button
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ delay: 0.1, duration: 0.2 }}
              className="absolute top-6 right-6 z-50 p-3 bg-white/10 text-white rounded-full backdrop-blur-md hover:bg-white/20 transition-colors cursor-pointer"
              onClick={() => setSelectedArtwork(null)}
              aria-label="Close gallery"
            >
              <X className="w-5 h-5" />
            </motion.button>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
