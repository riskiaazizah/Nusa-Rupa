import Link from "next/link";
import { buildQuery } from "@/lib/url";

export default function Pagination({ basePath = "/", page, totalPages, params }) {
  if (totalPages <= 1) return null;

  const hrefFor = (target) => `${basePath}${buildQuery(params, { page: target > 1 ? target : null })}`;
  const linkClass = "rounded-full border border-line bg-white px-4 py-2 text-xs font-semibold text-ink transition hover:border-ink hover:bg-soft";
  const disabledClass = "rounded-full border border-line/50 bg-soft px-4 py-2 text-xs font-semibold text-mute/40 cursor-not-allowed";

  return (
    <nav aria-label="Pagination" className="mt-8 flex items-center justify-center gap-3 text-xs font-medium">
      {page > 1 ? (
        <Link href={hrefFor(page - 1)} className={linkClass}>Previous</Link>
      ) : (
        <span className={disabledClass}>Previous</span>
      )}
      <span className="text-mute">
        Page {page} of {totalPages}
      </span>
      {page < totalPages ? (
        <Link href={hrefFor(page + 1)} className={linkClass}>Next</Link>
      ) : (
        <span className={disabledClass}>Next</span>
      )}
    </nav>
  );
}
