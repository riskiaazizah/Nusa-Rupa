"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";

// Color per role according to Blueprint v2: Member = forest, Curator = animals, Admin = people
const ROLE_COLORS = {
  member: "bg-forest text-white hover:bg-forest/90",
  curator: "bg-animals text-white hover:bg-animals/90",
  admin: "bg-people text-white hover:bg-people/90",
};

export default function DashboardSidebar({ links, subtitle, displayName, role = "member" }) {
  const pathname = usePathname();
  const [drawerOpen, setDrawerOpen] = useState(false);

  // Close drawer on Escape key or route change
  useEffect(() => {
    function handleKeyDown(e) {
      if (e.key === "Escape") setDrawerOpen(false);
    }
    if (drawerOpen) {
      document.body.style.overflow = "hidden";
      window.addEventListener("keydown", handleKeyDown);
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [drawerOpen]);

  const isActive = (link) =>
    link.exact ? pathname === link.href : pathname.startsWith(link.href);

  const activeColor = ROLE_COLORS[role] || ROLE_COLORS.member;

  // Active page title for mobile topbar
  const activeLink = links.find(isActive);
  const currentTitle = activeLink ? activeLink.label : subtitle;

  return (
    <>
      {/* Topbar on mobile & tablet (< 1000px) */}
      <header className="sticky top-0 z-30 flex items-center justify-between border-b border-line bg-white px-4 py-3 min-[1000px]:hidden">
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={() => setDrawerOpen(true)}
            aria-expanded={drawerOpen}
            aria-controls="dashboard-drawer"
            aria-label="Open menu"
            className="flex h-10 w-10 items-center justify-center rounded-lg border border-line text-ink hover:bg-soft transition cursor-pointer"
          >
            <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.75} d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          </button>
          <span className="font-display text-lg font-semibold text-ink truncate">
            {currentTitle}
          </span>
        </div>

        <Link href="/" aria-label="TIGA Home">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src="/logo/tiga-logo-red.svg" alt="TIGA" className="h-6 w-auto" />
        </Link>
      </header>

      {/* Backdrop for drawer (< 1000px) */}
      {drawerOpen && (
        <div
          onClick={() => setDrawerOpen(false)}
          className="fixed inset-0 z-40 bg-black/50 backdrop-blur-xs min-[1000px]:hidden transition-opacity"
          aria-hidden="true"
        />
      )}

      {/* Sidebar (Desktop >= 1000px) & Sliding Drawer (< 1000px) */}
      <aside
        id="dashboard-drawer"
        role="navigation"
        aria-label={subtitle}
        className={`fixed top-0 bottom-0 left-0 z-50 flex w-[230px] flex-col border-r border-line bg-soft text-ink transition-transform duration-300 ease-out min-[1000px]:sticky min-[1000px]:top-0 min-[1000px]:z-20 min-[1000px]:h-screen min-[1000px]:translate-x-0 ${
          drawerOpen ? "translate-x-0 shadow-2xl" : "-translate-x-full min-[1000px]:translate-x-0"
        }`}
      >
        <div className="flex h-full flex-col p-5">
          {/* Drawer Top Header */}
          <div className="mb-6 flex items-center justify-between border-b border-line pb-4">
            <Link href="/" onClick={() => setDrawerOpen(false)} className="flex items-center gap-2">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src="/logo/tiga-logo-red.svg" alt="TIGA" className="h-6 w-auto" />
            </Link>

            <button
              type="button"
              onClick={() => setDrawerOpen(false)}
              aria-label="Close menu"
              className="flex h-8 w-8 items-center justify-center rounded-lg text-mute hover:text-ink hover:bg-line/50 transition min-[1000px]:hidden cursor-pointer"
            >
              ✕
            </button>
          </div>

          <div className="mb-4">
            <span className="text-[11px] font-semibold uppercase tracking-wider text-mute">
              {subtitle}
            </span>
          </div>

          {/* Nav links */}
          <nav className="flex-1 space-y-1 overflow-y-auto">
            {links.map((link) => {
              const active = isActive(link);
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  onClick={() => setDrawerOpen(false)}
                  aria-current={active ? "page" : undefined}
                  className={`block rounded-xl px-3.5 py-2.5 text-xs font-semibold tracking-wide transition ${
                    active
                      ? activeColor
                      : "text-ink/80 hover:bg-white hover:text-ink"
                  }`}
                >
                  {link.label}
                </Link>
              );
            })}
          </nav>

          {/* Footer User & Logout */}
          <div className="mt-auto border-t border-line pt-4 space-y-3">
            <Link
              href="/"
              onClick={() => setDrawerOpen(false)}
              className="block rounded-lg px-2 py-1.5 text-xs font-medium text-mute hover:text-ink transition"
            >
              Back to site
            </Link>

            <div className="flex items-center justify-between pt-1">
              <span className="text-xs font-medium text-ink truncate max-w-[120px]">
                {displayName}
              </span>
              <form action="/api/auth/logout" method="post">
                <button
                  type="submit"
                  className="rounded-lg border border-line bg-white px-2.5 py-1 text-[11px] font-semibold text-mute hover:text-people hover:border-people transition cursor-pointer"
                >
                  Log out
                </button>
              </form>
            </div>
          </div>
        </div>
      </aside>
    </>
  );
}
