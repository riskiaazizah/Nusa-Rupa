"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import ProfileDropdown from "./ProfileDropdown";

export default function NavbarClient({ user, dashboardHref }) {
  const pathname = usePathname();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  // Overlay variant is active ONLY on homepage hero
  const isOverlayPage = pathname === "/";
  const isChallengesActive = pathname.startsWith("/challenges");
  const isCollectionActive = pathname === "/" && !isChallengesActive;
  const isDashboardActive =
    pathname.startsWith("/member") ||
    pathname.startsWith("/curator") ||
    pathname.startsWith("/admin");

  useEffect(() => {
    function handleScroll() {
      setScrolled(window.scrollY > 40);
    }
    handleScroll();
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Close mobile menu on Escape key
  useEffect(() => {
    function handleKeyDown(e) {
      if (e.key === "Escape") setMobileMenuOpen(false);
    }
    if (mobileMenuOpen) {
      document.body.style.overflow = "hidden";
      window.addEventListener("keydown", handleKeyDown);
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [mobileMenuOpen]);

  const isTransparent = isOverlayPage && !scrolled;

  return (
    <>
      <header
        className={`fixed top-0 left-0 right-0 z-40 transition-colors duration-300 ${
          isTransparent
            ? "bg-transparent text-white"
            : "bg-white/95 text-ink backdrop-blur-md border-b border-line shadow-xs"
        }`}
      >
        <div className="mx-auto flex h-20 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2 group" aria-label="TIGA Homepage">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={isTransparent ? "/logo/tiga-logo-white.svg" : "/logo/tiga-logo-red.svg"}
              alt="TIGA"
              className="h-9 w-auto transition-transform duration-200 group-hover:scale-105"
            />
          </Link>

          {/* Desktop Navigation */}
          <nav aria-label="Main menu" className="hidden md:flex items-center gap-8 text-sm font-medium tracking-wide">
            <Link
              href="/#collection"
              className={`group relative py-1 transition-colors ${
                isTransparent
                  ? isCollectionActive
                    ? "text-white font-semibold"
                    : "text-white/80 hover:text-white"
                  : isCollectionActive
                  ? "text-people font-semibold"
                  : "text-ink hover:text-people"
              }`}
            >
              <span>Collection</span>
              <span
                aria-hidden="true"
                className={`absolute -bottom-1 left-0 h-[2px] w-full transition-all duration-200 ${
                  isTransparent ? "bg-white" : "bg-people"
                } ${
                  isCollectionActive ? "scale-x-100" : "scale-x-0 group-hover:scale-x-100"
                }`}
              />
            </Link>
            <Link
              href="/challenges"
              className={`group relative py-1 transition-colors ${
                isTransparent
                  ? isChallengesActive
                    ? "text-white font-semibold"
                    : "text-white/80 hover:text-white"
                  : isChallengesActive
                  ? "text-people font-semibold"
                  : "text-ink hover:text-people"
              }`}
            >
              <span>Challenges</span>
              <span
                aria-hidden="true"
                className={`absolute -bottom-1 left-0 h-[2px] w-full transition-all duration-200 ${
                  isTransparent ? "bg-white" : "bg-people"
                } ${
                  isChallengesActive ? "scale-x-100" : "scale-x-0 group-hover:scale-x-100"
                }`}
              />
            </Link>
          </nav>

          {/* Right User Actions */}
          <div className="hidden md:flex items-center gap-4">
            {user ? (
              <div className="flex items-center">
                <ProfileDropdown
                  user={user}
                  role={user?.role}
                  transparent={isTransparent}
                />
              </div>
            ) : (
              <div className="flex items-center gap-4">
                <Link
                  href="/login"
                  className={`group relative py-1 text-sm font-medium transition-colors ${
                    isTransparent ? "text-white/80 hover:text-white" : "text-ink hover:text-people"
                  }`}
                >
                  <span>Log in</span>
                  <span
                    aria-hidden="true"
                    className={`absolute -bottom-1 left-0 h-[2px] w-full transition-all duration-200 ${
                      isTransparent ? "bg-white" : "bg-people"
                    } scale-x-0 group-hover:scale-x-100`}
                  />
                </Link>
                <Link
                  href="/register"
                  className={`rounded-full px-5 py-2 text-xs font-semibold tracking-wider uppercase transition shadow-sm ${
                    isTransparent
                      ? "bg-white text-ink hover:bg-white/90"
                      : "bg-ink text-white hover:bg-people"
                  }`}
                >
                  Sign up
                </Link>
              </div>
            )}
          </div>

          {/* Mobile Hamburger Button */}
          <button
            type="button"
            onClick={() => setMobileMenuOpen(true)}
            aria-expanded={mobileMenuOpen}
            aria-controls="mobile-nav"
            aria-label="Open navigation menu"
            className={`flex md:hidden items-center justify-center p-2 rounded-lg transition ${
              isTransparent ? "text-white hover:bg-white/10" : "text-ink hover:bg-soft"
            }`}
          >
            <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.75} d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          </button>
        </div>
      </header>

      {/* Fullscreen Mobile Menu Drawer */}
      {mobileMenuOpen && (
        <div
          id="mobile-nav"
          role="dialog"
          aria-modal="true"
          aria-label="Mobile navigation menu"
          className="fixed inset-0 z-50 flex flex-col bg-ink text-white p-6 sm:p-10 animate-fade-in"
        >
          <div className="flex items-center justify-between pb-6 border-b border-white/10">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src="/logo/tiga-logo-white.svg" alt="TIGA" className="h-7 w-auto" />
            <button
              type="button"
              onClick={() => setMobileMenuOpen(false)}
              aria-label="Close navigation menu"
              className="p-2 text-white/70 hover:text-white text-xl"
            >
              ✕
            </button>
          </div>

          <nav className="flex flex-col gap-6 pt-10 text-2xl font-display">
            <Link
              href="/#collection"
              onClick={() => setMobileMenuOpen(false)}
              className={`transition ${isCollectionActive ? "text-people font-semibold" : "hover:text-white"}`}
            >
              Collection
            </Link>
            <Link
              href="/challenges"
              onClick={() => setMobileMenuOpen(false)}
              className={`transition ${isChallengesActive ? "text-people font-semibold" : "hover:text-white"}`}
            >
              Challenges
            </Link>
          </nav>

          <div className="mt-auto border-t border-white/10 pt-8 flex flex-col gap-3 font-sans">
            {user ? (
              <>
                <Link
                  href={dashboardHref}
                  onClick={() => setMobileMenuOpen(false)}
                  className="rounded-full bg-white text-ink text-center py-3 text-sm font-semibold tracking-wide uppercase hover:bg-white/90"
                >
                  Open Dashboard
                </Link>
                <form action="/api/auth/logout" method="post">
                  <button
                    type="submit"
                    className="w-full rounded-full border border-white/20 text-white text-center py-3 text-sm font-semibold tracking-wide uppercase hover:bg-white/10"
                  >
                    Log out
                  </button>
                </form>
              </>
            ) : (
              <>
                <Link
                  href="/login"
                  onClick={() => setMobileMenuOpen(false)}
                  className="rounded-full border border-white/25 text-white text-center py-3 text-sm font-semibold tracking-wide uppercase hover:bg-white/10"
                >
                  Log in
                </Link>
                <Link
                  href="/register"
                  onClick={() => setMobileMenuOpen(false)}
                  className="rounded-full bg-people text-white text-center py-3 text-sm font-semibold tracking-wide uppercase hover:bg-red-700"
                >
                  Sign up
                </Link>
              </>
            )}
          </div>
        </div>
      )}
    </>
  );
}
