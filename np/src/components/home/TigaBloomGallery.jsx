"use client";

import * as React from "react";
import Link from "next/link";

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
const IDLE_MS = 7000;
const READY_FALLBACK_MS = 1200;

function getArtworkPillar(artwork) {
  const cat = (artwork.category_name || "").toLowerCase();
  for (const key of PILLAR_KEYS) {
    if (PILLARS[key].categories.includes(cat)) return key;
  }
  return "forest"; // default fallback
}

export default function TigaBloomGallery({
  artworks = [],
  columns = 4,
  aspect = "4 / 5",
  gap = 20,
  autoplay = true,
  interval = 3200,
  bloomDuration = 700,
}) {
  const [selectedPillar, setSelectedPillar] = React.useState("all");
  const [ready, setReady] = React.useState(false);
  const [hovered, setHovered] = React.useState(null);
  const [reducedMotion, setReducedMotion] = React.useState(false);
  const pausedUntil = React.useRef(0);
  const valueRef = React.useRef(selectedPillar);
  valueRef.current = selectedPillar;
  const chipRefs = React.useRef([]);

  // Check reduced motion preference
  React.useEffect(() => {
    const motion = window.matchMedia("(prefers-reduced-motion: reduce)");
    const onMotion = () => setReducedMotion(motion.matches);
    onMotion();
    motion.addEventListener("change", onMotion);
    return () => motion.removeEventListener("change", onMotion);
  }, []);

  // Preload visible images
  React.useEffect(() => {
    let done = false;
    const markReady = () => {
      if (!done) setReady(true);
      done = true;
    };

    let loaded = 0;
    const targets = artworks.slice(0, 16);
    if (targets.length === 0) {
      markReady();
      return;
    }

    const imgs = targets.map((art) => {
      const img = new Image();
      img.decoding = "async";
      img.onload = img.onerror = () => {
        loaded += 1;
        if (loaded >= targets.length) markReady();
      };
      img.src = art.file_url;
      return img;
    });

    const fallback = window.setTimeout(markReady, READY_FALLBACK_MS);
    return () => {
      done = true;
      window.clearTimeout(fallback);
      for (const img of imgs) img.onload = img.onerror = null;
    };
  }, [artworks]);

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

  const choose = React.useCallback((next, fromUser) => {
    if (fromUser) pausedUntil.current = Date.now() + IDLE_MS;
    setSelectedPillar(next);
  }, []);

  // Gentle autoplay through the 3 pillars when idle
  React.useEffect(() => {
    if (!autoplay || reducedMotion || !ready || artworks.length === 0) return;
    const sequence = ["forest", "animals", "people", "all"];
    const timer = window.setInterval(() => {
      if (Date.now() < pausedUntil.current) return;
      const at = sequence.indexOf(valueRef.current);
      choose(sequence[(at + 1) % sequence.length], false);
    }, interval);
    return () => window.clearInterval(timer);
  }, [autoplay, reducedMotion, ready, artworks.length, interval, choose]);

  // Keyboard navigation for chips
  const onChipKey = (event) => {
    if (event.key !== "ArrowRight" && event.key !== "ArrowLeft") return;
    event.preventDefault();
    const at = Math.max(0, choices.indexOf(selectedPillar));
    const next = (at + (event.key === "ArrowRight" ? 1 : -1) + choices.length) % choices.length;
    choose(choices[next], true);
    chipRefs.current[next]?.focus();
  };

  const matchRank = new Map();
  artworks.forEach((art, index) => {
    const p = getArtworkPillar(art);
    if (selectedPillar === "all" || p === selectedPillar) {
      matchRank.set(index, matchRank.size);
    }
  });

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
                onClick={() => choose(choice, true)}
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

      {/* Grid of Blooming Artworks */}
      <div
        role="list"
        className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4"
        style={{ gap }}
      >
        {artworks.map((art, index) => {
          const pillarKey = getArtworkPillar(art);
          const pillar = PILLARS[pillarKey];
          const rank = matchRank.get(index);
          const matches = rank !== undefined;
          const isHovered = hovered?.index === index;
          const colored = ready && (matches || isHovered);
          const dimmed = ready && !matches && !isHovered;
          const originX = isHovered ? hovered.x : 50;
          const originY = isHovered ? hovered.y : 50;
          const delay = colored && !isHovered && rank !== undefined ? Math.min(rank * 60, 420) : 0;

          return (
            <div key={art.id} role="listitem" className="min-w-0">
              <Link
                href={`/artworks/${art.id}`}
                data-artwork-id={art.id}
                onPointerEnter={(event) => {
                  if (event.pointerType === "touch") return;
                  const rect = event.currentTarget.getBoundingClientRect();
                  setHovered({
                    index,
                    x: ((event.clientX - rect.left) / rect.width) * 100,
                    y: ((event.clientY - rect.top) / rect.height) * 100,
                  });
                }}
                onPointerLeave={() => setHovered((cur) => (cur?.index === index ? null : cur))}
                onFocus={() => setHovered({ index, x: 50, y: 50 })}
                onBlur={() => setHovered((cur) => (cur?.index === index ? null : cur))}
                className="group relative block w-full overflow-hidden rounded-2xl bg-soft border border-line outline-none transition-[opacity,transform,box-shadow] duration-500 ease-out hover:border-ink hover:shadow-lg"
                style={{
                  aspectRatio: aspect,
                  opacity: dimmed ? 0.38 : 1,
                  transform: dimmed ? "scale(0.97)" : "scale(1)",
                }}
              >
                {/* 1. Grayscale Base Image (symbol of smoke & ash) */}
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={art.file_url}
                  alt={art.title}
                  draggable={false}
                  className="absolute inset-0 h-full w-full object-cover transition-transform duration-700 ease-out group-hover:scale-105"
                  style={{ filter: "grayscale(1) contrast(1.1) brightness(0.94)" }}
                />

                {/* 2. Full-Color Blooming Overlay (art speaking into life) */}
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={art.file_url}
                  alt=""
                  aria-hidden="true"
                  draggable={false}
                  className="absolute inset-0 h-full w-full object-cover transition-transform duration-700 ease-out group-hover:scale-105"
                  style={{
                    clipPath: `circle(${colored ? 150 : 0}% at ${originX}% ${originY}%)`,
                    transition: reducedMotion
                      ? "none"
                      : colored
                      ? `clip-path ${bloomDuration}ms cubic-bezier(0.22, 0.8, 0.2, 1) ${delay}ms, transform 700ms ease-out`
                      : `clip-path ${Math.round(bloomDuration * 0.55)}ms cubic-bezier(0.4, 0, 1, 1), transform 700ms ease-out`,
                  }}
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

                {/* Bottom Editorial Caption */}
                <div
                  className="pointer-events-none absolute inset-x-0 bottom-0 z-10 bg-gradient-to-t from-black/85 via-black/50 to-transparent p-4 pt-10 text-white transition-opacity duration-300"
                  style={{ opacity: colored ? 1 : 0.8 }}
                >
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
              </Link>
            </div>
          );
        })}
      </div>
    </div>
  );
}
