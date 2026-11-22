import Link from "next/link";
import { getSession } from "@/lib/session";
import { listArtworks, countArtworks, listFeaturedArtworks } from "@/lib/gallery";
import { listCategories } from "@/lib/categories";
import { listChallenges } from "@/lib/challenges";
import { buildQuery } from "@/lib/url";
import { cleanText } from "@/lib/text";
import ArtworkCard from "@/components/ArtworkCard";
import ChallengeCard from "@/components/ChallengeCard";
import Pagination from "@/components/Pagination";

const PAGE_SIZE = 12;

function ArtworkGrid({ artworks }) {
  return (
    <ul className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
      {artworks.map((a) => (
        <li key={a.id}>
          <ArtworkCard artwork={a} />
        </li>
      ))}
    </ul>
  );
}

function Section({ title, hint, children }) {
  return (
    <section className="space-y-4">
      <div>
        <h2 className="text-xl font-semibold text-deep-forest">{title}</h2>
        {hint && <p className="text-sm text-deep-forest/70">{hint}</p>}
      </div>
      {children}
    </section>
  );
}

function Empty({ children }) {
  return (
    <p className="rounded-2xl border border-dashed border-deep-forest/25 bg-white px-6 py-10 text-center text-sm text-deep-forest/70">
      {children}
    </p>
  );
}

export default async function HomePage({ searchParams }) {
  const sp = await searchParams;
  const user = await getSession();

  // Baca dan bersihkan parameter URL
  const q = cleanText(sp.q, 100);
  const tag = cleanText(sp.tag, 50).toLowerCase();
  const categoryParam = Number.parseInt(sp.category, 10);
  const categoryId = Number.isInteger(categoryParam) && categoryParam > 0 ? categoryParam : null;
  const sort = sp.sort === "popular" ? "popular" : "latest";
  const page = Math.max(1, Number.parseInt(sp.page, 10) || 1);
  const filtering = Boolean(q || tag || categoryId);

  const categories = await listCategories();
  const baseParams = { q, tag, sort: filtering && sort === "popular" ? "popular" : null };

  const chip = (active) =>
    `whitespace-nowrap rounded-full border px-4 py-1.5 text-sm font-medium transition ${
      active
        ? "border-forest bg-forest text-ivory"
        : "border-deep-forest/25 bg-white text-deep-forest hover:border-forest"
    }`;

  const categoryNav = (
    <nav
      aria-label="Filter kategori"
      className="-mx-4 flex gap-2 overflow-x-auto px-4 pb-1 sm:mx-0 sm:flex-wrap sm:px-0"
    >
      <Link href={`/${buildQuery(baseParams, { category: null })}`} className={chip(!categoryId)}>
        Semua
      </Link>
      {categories.map((c) => (
        <Link
          key={c.id}
          href={`/${buildQuery(baseParams, { category: c.id })}`}
          aria-current={categoryId === c.id ? "true" : undefined}
          className={chip(categoryId === c.id)}
        >
          {c.name}
        </Link>
      ))}
    </nav>
  );

  // ---------- Mode pencarian / filter ----------
  if (filtering) {
    const filters = { q, tag, categoryId };
    const [artworks, total, challenges] = await Promise.all([
      listArtworks({ ...filters, sort, limit: PAGE_SIZE, offset: (page - 1) * PAGE_SIZE }),
      countArtworks(filters),
      q ? listChallenges({ q, limit: 6 }) : Promise.resolve([]),
    ]);
    const totalPages = Math.max(1, Math.ceil(total / PAGE_SIZE));
    const urlParams = { q, tag, category: categoryId, sort: sort === "popular" ? "popular" : null };

    return (
      <div className="space-y-8">
        <div className="space-y-3">
          <h1 className="text-2xl font-semibold text-deep-forest">Hasil pencarian</h1>
          <p className="text-sm text-deep-forest/70">
            {total} karya ditemukan
            {q && <> untuk &ldquo;{q}&rdquo;</>}
            {tag && <> dengan tag #{tag}</>}.{" "}
            <Link href="/" className="font-semibold text-forest hover:underline">Hapus semua filter</Link>
          </p>
          {categoryNav}
          <p className="text-sm text-deep-forest/70">
            Urutkan:{" "}
            <Link
              href={`/${buildQuery(urlParams, { sort: null, page: null })}`}
              className={sort === "latest" ? "font-semibold text-forest" : "hover:underline"}
            >
              Terbaru
            </Link>
            {" · "}
            <Link
              href={`/${buildQuery(urlParams, { sort: "popular", page: null })}`}
              className={sort === "popular" ? "font-semibold text-forest" : "hover:underline"}
            >
              Terpopuler
            </Link>
          </p>
        </div>

        {artworks.length === 0 ? (
          <Empty>Tidak ada karya yang cocok. Coba kata kunci atau kategori lain.</Empty>
        ) : (
          <>
            <ArtworkGrid artworks={artworks} />
            <Pagination page={page} totalPages={totalPages} params={urlParams} />
          </>
        )}

        {q && (
          <Section title="Challenge yang cocok">
            {challenges.length === 0 ? (
              <Empty>Tidak ada challenge dengan judul tersebut.</Empty>
            ) : (
              <ul className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
                {challenges.map((c) => (
                  <li key={c.id}>
                    <ChallengeCard challenge={c} />
                  </li>
                ))}
              </ul>
            )}
          </Section>
        )}
      </div>
    );
  }

  // ---------- Mode beranda ----------
  const [featured, activeChallenges, popular, latest, total] = await Promise.all([
    listFeaturedArtworks(3),
    listChallenges({ status: "active", limit: 3 }),
    listArtworks({ sort: "popular", limit: 8 }),
    listArtworks({ sort: "latest", limit: PAGE_SIZE, offset: (page - 1) * PAGE_SIZE }),
    countArtworks(),
  ]);
  const totalPages = Math.max(1, Math.ceil(total / PAGE_SIZE));

  return (
    <div className="space-y-12">
      <section className="rounded-3xl bg-deep-forest px-6 py-12 text-center text-ivory sm:px-12 sm:py-16">
        <p className="text-sm font-semibold tracking-[0.3em] text-sage">TIGA · ART FOR EARTH</p>
        <h1 className="mx-auto mt-4 max-w-2xl text-3xl font-bold leading-tight sm:text-4xl">
          When nature loses its voice, let art speak.
        </h1>
        <p className="mx-auto mt-4 max-w-xl text-sm text-ivory/80 sm:text-base">
          Galeri karya seni digital tentang alam Indonesia dan isu lingkungan: dari hutan yang menyusut
          sampai harapan yang tumbuh kembali.
        </p>
        {!user && (
          <div className="mt-8 flex flex-wrap justify-center gap-3">
            <Link
              href="/register"
              className="rounded-xl bg-ivory px-6 py-2.5 text-sm font-semibold text-deep-forest transition hover:bg-white"
            >
              Gabung sekarang
            </Link>
            <Link
              href="/challenges"
              className="rounded-xl border border-ivory/50 px-6 py-2.5 text-sm font-semibold text-ivory transition hover:bg-forest"
            >
              Lihat challenge
            </Link>
          </div>
        )}
      </section>

      {categoryNav}

      {featured.length > 0 && (
        <Section title="Pilihan TIGA" hint="Karya dengan interaksi terbanyak dari komunitas.">
          <ArtworkGrid artworks={featured} />
        </Section>
      )}

      <Section title="Challenge sedang berlangsung">
        {activeChallenges.length === 0 ? (
          <Empty>Belum ada challenge yang aktif saat ini.</Empty>
        ) : (
          <ul className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {activeChallenges.map((c) => (
              <li key={c.id}>
                <ChallengeCard challenge={c} />
              </li>
            ))}
          </ul>
        )}
        <p>
          <Link href="/challenges" className="text-sm font-semibold text-forest hover:underline">
            Lihat semua challenge
          </Link>
        </p>
      </Section>

      <Section title="Karya populer" hint="Diurutkan berdasarkan jumlah suka.">
        {popular.length === 0 ? <Empty>Belum ada karya.</Empty> : <ArtworkGrid artworks={popular} />}
      </Section>

      <Section title="Karya terbaru">
        {latest.length === 0 ? (
          <Empty>Belum ada karya pada halaman ini.</Empty>
        ) : (
          <>
            <ArtworkGrid artworks={latest} />
            <Pagination page={page} totalPages={totalPages} params={{}} />
          </>
        )}
      </Section>
    </div>
  );
}