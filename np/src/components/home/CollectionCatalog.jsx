"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import ArtworkCard from "@/components/ArtworkCard";
import TigaBloomGallery from "./TigaBloomGallery";

const ISSUE_TAGS = [
  "palm oil expansion",
  "forest fire",
  "peatland",
  "habitat loss",
  "endangered species",
  "indigenous rights",
  "climate change",
  "reforestation",
  "sustainable living",
];

// Map category to color group & background image
const CATEGORY_GROUPS = {
  flora: {
    group: "Forest",
    color: "#1f6b45",
    bgImage: "/categories/forest.jpg",
  },
  environment: {
    group: "Forest",
    color: "#1f6b45",
    bgImage: "/categories/forest.jpg",
  },
  fauna: {
    group: "Animals",
    color: "#2f3fa8",
    bgImage: "/categories/animals.jpg",
  },
  "conservation & hope": {
    group: "Animals",
    color: "#2f3fa8",
    bgImage: "/categories/animals.jpg",
  },
  "social impact": {
    group: "People",
    color: "#d92e1c",
    bgImage: "/categories/people.png",
  },
  "culture & heritage": {
    group: "People",
    color: "#d92e1c",
    bgImage: "/categories/people.png",
  },
};

export default function CollectionCatalog({ initialArtworks = [], categories = [], user }) {
  const [search, setSearch] = useState("");
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [selectedTag, setSelectedTag] = useState("");
  const [sort, setSort] = useState("newest"); // "newest" | "popular" | "az"
  const [viewMode, setViewMode] = useState("bloom"); // "bloom" | "grid" | "list"

  // Count per category
  const categoryCounts = useMemo(() => {
    const map = {};
    initialArtworks.forEach((art) => {
      const catId = art.category_id;
      map[catId] = (map[catId] || 0) + 1;
    });
    return map;
  }, [initialArtworks]);

  // Sort categories according to the 3-pillar blueprint order
  const sortedCategories = useMemo(() => {
    const PREFERRED_ORDER = [
      "flora",
      "fauna",
      "social impact",
      "environment",
      "culture & heritage",
      "conservation & hope",
    ];
    return [...categories].sort((a, b) => {
      const ia = PREFERRED_ORDER.indexOf(a.name.toLowerCase());
      const ib = PREFERRED_ORDER.indexOf(b.name.toLowerCase());
      if (ia !== -1 && ib !== -1) return ia - ib;
      if (ia !== -1) return -1;
      if (ib !== -1) return 1;
      return a.name.localeCompare(b.name);
    });
  }, [categories]);

  // Unique artists for artist filter
  const artists = useMemo(() => {
    const map = new Map();
    initialArtworks.forEach((art) => {
      if (art.creator_id && art.creator_name) {
        map.set(art.creator_id, art.creator_name);
      }
    });
    return Array.from(map.entries()).map(([id, name]) => ({ id, name }));
  }, [initialArtworks]);

  const [selectedArtist, setSelectedArtist] = useState("");

  // Filtered artworks
  const filtered = useMemo(() => {
    return initialArtworks
      .filter((art) => {
        // Search text
        if (search.trim()) {
          const q = search.toLowerCase();
          const matchTitle = art.title.toLowerCase().includes(q);
          const matchArtist = (art.creator_name || "").toLowerCase().includes(q);
          if (!matchTitle && !matchArtist) return false;
        }
        // Category
        if (selectedCategory !== null && art.category_id !== selectedCategory) {
          return false;
        }
        // Issue tag
        if (selectedTag) {
          const tags = (art.tags || []).map((t) => t.toLowerCase());
          if (!tags.includes(selectedTag.toLowerCase())) return false;
        }
        // Artist
        if (selectedArtist) {
          if (String(art.creator_id) !== String(selectedArtist)) return false;
        }
        return true;
      })
      .sort((a, b) => {
        if (sort === "popular") {
          return (b.like_count || 0) - (a.like_count || 0);
        }
        if (sort === "az") {
          return a.title.localeCompare(b.title);
        }
        // newest default
        return new Date(b.created_at || 0) - new Date(a.created_at || 0);
      });
  }, [initialArtworks, search, selectedCategory, selectedTag, selectedArtist, sort]);

  const clearFilters = () => {
    setSearch("");
    setSelectedCategory(null);
    setSelectedTag("");
    setSelectedArtist("");
    setSort("newest");
  };

  const hasActiveFilters = Boolean(
    search || selectedCategory !== null || selectedTag || selectedArtist || sort !== "newest"
  );

  return (
    <section id="collection" className="scroll-mt-24 py-16 sm:py-24 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
      {/* Section Header */}
      <div className="space-y-3 max-w-2xl">
        <h2 className="font-display text-4xl sm:text-5xl font-semibold text-ink tracking-tight">
          The Collection
        </h2>
        <p className="text-base sm:text-lg text-mute">
          Works on forests, wildlife, and the people living under the smoke.
        </p>
      </div>

      {/* Category Tiles (Blueprint style with issue background images) */}
      <div className="space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-2">
          <div className="space-y-1">
            <h3 className="font-display text-3xl sm:text-4xl font-semibold text-ink tracking-tight">
              Browse by Category
            </h3>
            <p className="text-sm text-mute">
              Explore artworks across Indonesia&apos;s forests, wildlife, and frontline communities.
            </p>
          </div>
          {selectedCategory !== null && (
            <button
              type="button"
              onClick={() => setSelectedCategory(null)}
              className="text-xs font-semibold text-people hover:underline cursor-pointer"
            >
              Reset category filter
            </button>
          )}
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 sm:gap-6">
          {sortedCategories.map((cat) => {
            const groupInfo = CATEGORY_GROUPS[cat.name.toLowerCase()] || {
              group: "General",
              color: "#0f0f0f",
              bgImage: "/categories/forest.jpg",
            };
            const isSelected = selectedCategory === cat.id;
            const count = categoryCounts[cat.id] || 0;

            return (
              <button
                key={cat.id}
                type="button"
                onClick={() => setSelectedCategory(isSelected ? null : cat.id)}
                aria-pressed={isSelected}
                className={`group relative overflow-hidden rounded-2xl aspect-[16/11] p-6 text-left transition-all duration-300 cursor-pointer flex flex-col justify-end ${
                  isSelected
                    ? "ring-4 ring-ink ring-offset-2 scale-[1.02] shadow-xl"
                    : "hover:scale-[1.02] hover:shadow-lg"
                }`}
              >
                {/* Background Image */}
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={groupInfo.bgImage}
                  alt=""
                  aria-hidden="true"
                  className="absolute inset-0 h-full w-full object-cover transition-transform duration-700 ease-out group-hover:scale-108"
                />

                {/* Brand Color Tint Layer (Multiply blend for rich duotone look) */}
                <div
                  className="absolute inset-0 transition-opacity duration-300"
                  style={{
                    backgroundColor: groupInfo.color,
                    opacity: 0.72,
                    mixBlendMode: "multiply",
                  }}
                />

                {/* Solid Color Tint Wash (for vibrant color presence) */}
                <div
                  className="absolute inset-0 transition-opacity duration-300 opacity-40"
                  style={{
                    backgroundColor: groupInfo.color,
                  }}
                />

                {/* Bottom-to-Top Dark Gradient for High Legibility */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/25 to-transparent" />

                {/* Selected Indicator Badge (Top Right) */}
                {isSelected && (
                  <div className="absolute top-4 right-4 z-10 flex items-center gap-1.5 rounded-full bg-white/95 backdrop-blur-xs px-3 py-1 text-[11px] font-semibold text-ink shadow-md">
                    <span className="h-1.5 w-1.5 rounded-full bg-ink" />
                    <span>Active</span>
                  </div>
                )}

                {/* Bottom-left Content */}
                <div className="relative z-10">
                  <h4 className="font-display text-2xl sm:text-3xl font-semibold text-white tracking-tight leading-tight drop-shadow-sm group-hover:text-cream transition-colors">
                    {cat.name}
                  </h4>
                  <p className="text-xs font-semibold uppercase tracking-widest text-white/80 mt-1">
                    {count} {count === 1 ? "WORK" : "WORKS"}
                  </p>
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* Search and Filters Bar */}
      <div className="space-y-4 rounded-2xl border border-line bg-soft/60 p-4 sm:p-6">
        {/* Full width Search */}
        <div className="relative">
          <input
            type="search"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by title or artist..."
            aria-label="Search artworks"
            className="w-full rounded-xl border border-line bg-white px-4 py-3 text-sm text-ink outline-none placeholder:text-mute focus:border-ink focus:ring-1 focus:ring-ink"
          />
          {search && (
            <button
              type="button"
              onClick={() => setSearch("")}
              className="absolute right-3 top-3 text-xs text-mute hover:text-ink font-bold"
            >
              Clear
            </button>
          )}
        </div>

        {/* Filter dropdowns + Clear button */}
        <div className="flex flex-wrap items-center gap-3">
          {/* Category Dropdown */}
          <select
            value={selectedCategory ?? ""}
            onChange={(e) => setSelectedCategory(e.target.value ? Number(e.target.value) : null)}
            aria-label="Filter by category"
            className="rounded-xl border border-line bg-white px-3 py-2 text-xs font-medium text-ink outline-none focus:border-ink"
          >
            <option value="">All Categories</option>
            {categories.map((c) => (
              <option key={c.id} value={c.id}>
                {c.name}
              </option>
            ))}
          </select>

          {/* Issue Tag Dropdown */}
          <select
            value={selectedTag}
            onChange={(e) => setSelectedTag(e.target.value)}
            aria-label="Filter by issue tag"
            className="rounded-xl border border-line bg-white px-3 py-2 text-xs font-medium text-ink outline-none focus:border-ink capitalize"
          >
            <option value="">All Issue Tags</option>
            {ISSUE_TAGS.map((t) => (
              <option key={t} value={t}>
                {t}
              </option>
            ))}
          </select>

          {/* Artist Dropdown */}
          <select
            value={selectedArtist}
            onChange={(e) => setSelectedArtist(e.target.value)}
            aria-label="Filter by artist"
            className="rounded-xl border border-line bg-white px-3 py-2 text-xs font-medium text-ink outline-none focus:border-ink"
          >
            <option value="">All Artists</option>
            {artists.map((art) => (
              <option key={art.id} value={art.id}>
                {art.name}
              </option>
            ))}
          </select>

          {/* Sort Dropdown */}
          <select
            value={sort}
            onChange={(e) => setSort(e.target.value)}
            aria-label="Sort artworks"
            className="rounded-xl border border-line bg-white px-3 py-2 text-xs font-medium text-ink outline-none focus:border-ink"
          >
            <option value="newest">Sort: Newest</option>
            <option value="popular">Sort: Most Liked</option>
            <option value="az">Sort: Title A–Z</option>
          </select>

          {hasActiveFilters && (
            <button
              type="button"
              onClick={clearFilters}
              className="text-xs font-semibold text-people hover:underline ml-auto"
            >
              Clear filters
            </button>
          )}
        </div>
      </div>

      {/* Results Bar + View Toggle */}
      <div className="flex items-center justify-between border-b border-line pb-4 text-xs font-medium text-mute">
        <p>
          Showing {filtered.length === 0 ? "0" : `1 to ${filtered.length}`} of total {filtered.length} results
        </p>

        {/* View Toggle */}
        <div className="flex items-center gap-1 rounded-lg border border-line bg-soft p-0.5">
          <button
            type="button"
            onClick={() => setViewMode("bloom")}
            aria-label="Interactive Bloom view"
            className={`px-3 py-1 rounded text-xs transition ${
              viewMode === "bloom" ? "bg-white text-ink font-semibold shadow-xs" : "text-mute hover:text-ink"
            }`}
          >
            Bloom
          </button>
          <button
            type="button"
            onClick={() => setViewMode("grid")}
            aria-label="Grid view"
            className={`px-3 py-1 rounded text-xs transition ${
              viewMode === "grid" ? "bg-white text-ink font-semibold shadow-xs" : "text-mute hover:text-ink"
            }`}
          >
            Grid
          </button>
          <button
            type="button"
            onClick={() => setViewMode("list")}
            aria-label="List view"
            className={`px-3 py-1 rounded text-xs transition ${
              viewMode === "list" ? "bg-white text-ink font-semibold shadow-xs" : "text-mute hover:text-ink"
            }`}
          >
            List
          </button>
        </div>
      </div>

      {/* Catalog Display: Bloom, Grid, or List */}
      {filtered.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-line bg-soft/50 px-6 py-16 text-center space-y-3">
          <p className="font-display text-2xl font-semibold text-ink">
            No works match your filters.
          </p>
          <p className="text-sm text-mute">
            Try adjusting your search terms or clearing your category and tag filters.
          </p>
          <button
            type="button"
            onClick={clearFilters}
            className="inline-block rounded-full bg-ink px-6 py-2.5 text-xs font-semibold uppercase tracking-wider text-white hover:bg-people transition"
          >
            Clear filters
          </button>
        </div>
      ) : viewMode === "bloom" ? (
        <TigaBloomGallery artworks={filtered} />
      ) : viewMode === "grid" ? (
        <ul className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {filtered.map((art) => (
            <li key={art.id}>
              <ArtworkCard artwork={art} userRole={user?.role} />
            </li>
          ))}
        </ul>
      ) : (
        /* List View (rows with 90px thumbnails as specified in Blueprint v2) */
        <ul className="divide-y divide-line border-y border-line">
          {filtered.map((art) => (
            <li
              key={art.id}
              className="group flex items-center justify-between gap-4 py-4 px-2 hover:bg-soft/50 transition"
            >
              <div className="flex items-center gap-4 min-w-0">
                <Link href={`/artworks/${art.id}`} className="shrink-0 overflow-hidden rounded-lg border border-line">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={art.file_url}
                    alt={art.title}
                    className="h-[90px] w-[90px] object-cover transition-transform duration-300 group-hover:scale-105"
                  />
                </Link>
                <div className="min-w-0 space-y-1">
                  <h3 className="font-display text-xl font-semibold text-ink group-hover:text-people transition truncate">
                    <Link href={`/artworks/${art.id}`}>{art.title}</Link>
                  </h3>
                  <p className="text-xs text-mute">
                    by{" "}
                    <Link href={`/creators/${art.creator_id}`} className="text-ink font-medium hover:underline">
                      {art.creator_name}
                    </Link>
                  </p>
                  <p className="text-[11px] text-mute uppercase tracking-wider">
                    {art.category_name}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-6 shrink-0 text-xs text-mute">
                <span className="font-medium text-ink">{art.like_count || 0} likes</span>
                <Link
                  href={`/artworks/${art.id}`}
                  className="rounded-full border border-line px-4 py-1.5 text-xs font-semibold text-ink hover:border-ink hover:bg-white transition"
                >
                  View Detail
                </Link>
              </div>
            </li>
          ))}
        </ul>
      )}
    </section>
  );
}
