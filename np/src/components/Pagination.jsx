import Link from "next/link";
import { buildQuery } from "@/lib/url";

export default function Pagination({ basePath = "/", page, totalPages, params }) {
  if (totalPages <= 1) return null;

  const hrefFor = (target) => `${basePath}${buildQuery(params, { page: target > 1 ? target : null })}`;
  const linkClass = "rounded-xl border border-deep-forest/25 px-4 py-2 transition hover:bg-white";
  const disabledClass = "rounded-xl border border-deep-forest/10 px-4 py-2 text-deep-forest/40";

  return (
    <nav aria-label="Halaman" className="mt-8 flex items-center justify-center gap-3 text-sm font-medium">
      {page > 1 ? (
        <Link href={hrefFor(page - 1)} className={linkClass}>Sebelumnya</Link>
      ) : (
        <span className={disabledClass}>Sebelumnya</span>
      )}
      <span className="text-deep-forest/70">
        Halaman {page} dari {totalPages}
      </span>
      {page < totalPages ? (
        <Link href={hrefFor(page + 1)} className={linkClass}>Berikutnya</Link>
      ) : (
        <span className={disabledClass}>Berikutnya</span>
      )}
    </nav>
  );
}