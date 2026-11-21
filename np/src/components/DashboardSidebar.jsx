"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";

// Sidebar dipakai bersama oleh dashboard Admin, Member, dan Curator.
// links: [{ href, label, exact? }]
export default function DashboardSidebar({ links, subtitle, displayName }) {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);

  const isActive = (link) =>
    link.exact ? pathname === link.href : pathname.startsWith(link.href);

  return (
    <>
      {/* Top bar khusus mobile */}
      <header className="flex items-center justify-between bg-deep-forest px-4 py-3 text-ivory lg:hidden">
        <span className="text-lg font-bold tracking-[0.25em]">TIGA</span>
        <button
          type="button"
          onClick={() => setOpen((o) => !o)}
          aria-expanded={open}
          aria-controls="dashboard-nav"
          className="rounded-lg border border-ivory/40 px-3 py-1.5 text-sm font-medium"
        >
          {open ? "Tutup" : "Menu"}
        </button>
      </header>

      <aside
        id="dashboard-nav"
        className={`${open ? "block" : "hidden"} bg-deep-forest text-ivory lg:sticky lg:top-0 lg:block lg:h-screen lg:w-64 lg:shrink-0`}
      >
        <div className="flex h-full flex-col px-4 py-6">
          <div className="mb-8 hidden lg:block">
            <p className="text-2xl font-bold tracking-[0.3em]">TIGA</p>
            <p className="mt-1 text-xs text-sage">{subtitle}</p>
          </div>

          <nav aria-label={subtitle} className="space-y-1">
            {links.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setOpen(false)}
                aria-current={isActive(link) ? "page" : undefined}
                className={`block rounded-xl px-4 py-2.5 text-sm font-medium transition ${
                  isActive(link)
                    ? "bg-forest text-ivory"
                    : "text-ivory/80 hover:bg-forest/60 hover:text-ivory"
                }`}
              >
                {link.label}
              </Link>
            ))}
          </nav>

          <div className="mt-auto border-t border-ivory/15 pt-5">
            <p className="mb-3 truncate text-sm text-ivory/80">{displayName}</p>
            <form action="/api/auth/logout" method="post">
              <button
                type="submit"
                className="w-full rounded-xl border border-ivory/40 px-4 py-2 text-sm font-semibold transition hover:bg-forest/60"
              >
                Keluar
              </button>
            </form>
          </div>
        </div>
      </aside>
    </>
  );
}