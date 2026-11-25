"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

export default function HeroVideo({ user }) {
  const [canAutoplay, setCanAutoplay] = useState(true);

  useEffect(() => {
    // Respect reduced motion
    const mediaQuery = window.matchMedia("(prefers-reduced-motion: reduce)");
    if (mediaQuery.matches) {
      setCanAutoplay(false);
    }
  }, []);

  const scrollToCollection = (group) => {
    const el = document.getElementById("collection");
    if (el) {
      el.scrollIntoView({ behavior: "smooth" });
    }
  };

  // Determine role-specific CTA
  let primaryCta = (
    <Link
      href="/challenges"
      className="inline-flex items-center justify-center rounded-full bg-cream px-7 py-3 text-sm font-semibold tracking-wide text-ink transition duration-200 hover:bg-white hover:scale-[1.02]"
    >
      Join a Challenge
    </Link>
  );

  if (user) {
    if (user.role === "member") {
      primaryCta = (
        <Link
          href="/member/artworks/new"
          className="inline-flex items-center justify-center rounded-full bg-cream px-7 py-3 text-sm font-semibold tracking-wide text-ink transition duration-200 hover:bg-white hover:scale-[1.02]"
        >
          Upload your work
        </Link>
      );
    } else if (user.role === "curator") {
      if (user.curator_status === "approved") {
        primaryCta = (
          <Link
            href="/curator/challenges"
            className="inline-flex items-center justify-center rounded-full bg-cream px-7 py-3 text-sm font-semibold tracking-wide text-ink transition duration-200 hover:bg-white hover:scale-[1.02]"
          >
            Open your dashboard
          </Link>
        );
      } else {
        primaryCta = (
          <Link
            href="/pending-curator"
            className="inline-flex items-center justify-center rounded-full bg-cream px-7 py-3 text-sm font-semibold tracking-wide text-ink transition duration-200 hover:bg-white hover:scale-[1.02]"
          >
            Check account status
          </Link>
        );
      }
    } else if (user.role === "admin") {
      primaryCta = (
        <Link
          href="/admin"
          className="inline-flex items-center justify-center rounded-full bg-cream px-7 py-3 text-sm font-semibold tracking-wide text-ink transition duration-200 hover:bg-white hover:scale-[1.02]"
        >
          Open admin dashboard
        </Link>
      );
    }
  }

  return (
    <section className="relative h-[100svh] min-h-[640px] w-full overflow-hidden bg-ink text-white flex flex-col justify-between">
      {/* Background Video / Atmospheric Poster */}
      <div className="absolute inset-0 z-0">
        {canAutoplay ? (
          <video
            src="/hero/karhutla.mp4"
            poster="/hero/karhutla-poster.svg"
            autoPlay
            muted
            loop
            playsInline
            preload="auto"
            aria-hidden="true"
            className="h-full w-full object-cover"
          />
        ) : (
          /* eslint-disable-next-line @next/next/no-img-element */
          <img
            src="/hero/karhutla-poster.svg"
            alt="Forest under smoke"
            className="h-full w-full object-cover"
            aria-hidden="true"
          />
        )}
        {/* Editorial dark vignette overlay for readability */}
        <div className="absolute inset-0 bg-gradient-to-r from-ink/90 via-ink/65 to-ink/40 pointer-events-none" />
        <div className="absolute inset-0 bg-gradient-to-t from-ink via-transparent to-black/30 pointer-events-none" />
      </div>

      {/* Main Center Content */}
      <div className="relative z-10 mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8 pt-28 sm:pt-36 pb-12 flex-1 flex flex-col justify-center">
        <div className="max-w-3xl space-y-6">
          <h1 className="font-display text-4xl sm:text-6xl md:text-7xl lg:text-8xl leading-[0.92] tracking-tight font-semibold text-white drop-shadow-sm">
            When <span className="italic text-[#8fe3ae]">nature</span> loses its{" "}
            <span className="italic text-[#a8b8ff]">voice</span>, let art{" "}
            <span className="italic text-[#ff8466]">speak</span>.
          </h1>

          <p className="text-sm sm:text-base md:text-lg text-cream/90 max-w-2xl font-light leading-relaxed">
            A digital gallery for the forests, animals, and people living under the smoke of Indonesia&apos;s wildfires.
          </p>

          <div className="flex flex-wrap items-center gap-4 pt-3">
            {primaryCta}
            <button
              type="button"
              onClick={() => scrollToCollection("all")}
              className="inline-flex items-center justify-center rounded-full border border-cream/40 bg-white/5 backdrop-blur-xs px-6 py-3 text-sm font-medium text-cream transition hover:bg-white/15 hover:border-cream"
            >
              Enter the exhibition
            </button>
          </div>
        </div>
      </div>

      {/* Three Colored Group Tabs at Bottom */}
      <div className="relative z-10 grid grid-cols-1 md:grid-cols-3 w-full border-t border-white/15">
        <button
          type="button"
          onClick={() => scrollToCollection("forest")}
          className="group flex items-center justify-center bg-forest/90 hover:bg-forest px-6 py-4 sm:py-5 text-center text-white transition-all duration-200 border-b md:border-b-0 md:border-r border-white/15 cursor-pointer"
        >
          <span className="font-display text-lg sm:text-xl font-semibold tracking-wide group-hover:scale-105 transition-transform duration-200">
            For the Forest
          </span>
        </button>

        <button
          type="button"
          onClick={() => scrollToCollection("animals")}
          className="group flex items-center justify-center bg-animals/90 hover:bg-animals px-6 py-4 sm:py-5 text-center text-white transition-all duration-200 border-b md:border-b-0 md:border-r border-white/15 cursor-pointer"
        >
          <span className="font-display text-lg sm:text-xl font-semibold tracking-wide group-hover:scale-105 transition-transform duration-200">
            For the Animals
          </span>
        </button>

        <button
          type="button"
          onClick={() => scrollToCollection("people")}
          className="group flex items-center justify-center bg-people/90 hover:bg-people px-6 py-4 sm:py-5 text-center text-white transition-all duration-200 cursor-pointer"
        >
          <span className="font-display text-lg sm:text-xl font-semibold tracking-wide group-hover:scale-105 transition-transform duration-200">
            For the People
          </span>
        </button>
      </div>
    </section>
  );
}
