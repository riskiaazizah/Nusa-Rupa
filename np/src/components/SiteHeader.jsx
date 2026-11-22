import Link from "next/link";
import { getSession } from "@/lib/session";
import { dashboardPathFor } from "@/lib/roles";

export default async function SiteHeader() {
  const user = await getSession();

  return (
    <header className="sticky top-0 z-20 border-b border-deep-forest/10 bg-ivory/95 backdrop-blur">
      <div className="mx-auto flex max-w-7xl flex-wrap items-center gap-x-6 gap-y-3 px-4 py-3 sm:px-6">
        <Link href="/" className="text-xl font-bold tracking-[0.3em] text-deep-forest">
          TIGA
        </Link>

        <nav aria-label="Menu utama" className="flex items-center gap-5 text-sm font-medium text-deep-forest">
          <Link href="/" className="hover:text-forest">Jelajahi</Link>
          <Link href="/challenges" className="hover:text-forest">Challenge</Link>
        </nav>

        <form
          action="/"
          method="get"
          role="search"
          className="order-last flex w-full gap-2 sm:order-none sm:ml-auto sm:max-w-md sm:flex-1"
        >
          <label htmlFor="site-search" className="sr-only">Cari karya, kreator, atau challenge</label>
          <input
            id="site-search"
            name="q"
            type="search"
            placeholder="Cari karya, kreator, atau challenge"
            maxLength={100}
            className="w-full rounded-xl border border-deep-forest/25 bg-white px-4 py-2 text-sm text-deep-forest outline-none focus:ring-2 focus:ring-forest"
          />
          <button
            type="submit"
            className="rounded-xl bg-forest px-4 py-2 text-sm font-semibold text-ivory transition hover:bg-deep-forest"
          >
            Cari
          </button>
        </form>

        <div className="ml-auto flex items-center gap-3 text-sm font-medium sm:ml-0">
          {user ? (
            <>
              <Link href={dashboardPathFor(user)} className="text-forest hover:underline">
                Dashboard
              </Link>
              <form action="/api/auth/logout" method="post">
                <button
                  type="submit"
                  className="rounded-xl border border-deep-forest/25 px-3 py-1.5 text-deep-forest transition hover:bg-white"
                >
                  Keluar
                </button>
              </form>
            </>
          ) : (
            <>
              <Link href="/login" className="text-deep-forest hover:text-forest">Masuk</Link>
              <Link
                href="/register"
                className="rounded-xl bg-forest px-4 py-1.5 text-ivory transition hover:bg-deep-forest"
              >
                Daftar
              </Link>
            </>
          )}
        </div>
      </div>
    </header>
  );
}