import Link from "next/link";
import { notFound } from "next/navigation";
import { getSession } from "@/lib/session";
import { getArtworkDetail, listComments } from "@/lib/gallery";
import { formatDate, formatDateTime } from "@/lib/format";
import InteractionButtons from "@/components/artwork/InteractionButtons";
import CommentForm from "@/components/artwork/CommentForm";
import ReportForm from "@/components/artwork/ReportForm";
import { deleteCommentAction } from "./actions";

export default async function ArtworkDetailPage({ params }) {
  const { id } = await params;
  const artworkId = Number(id);
  if (!Number.isInteger(artworkId) || artworkId <= 0) notFound();

  const user = await getSession();
  const isMember = user?.role === "member";

  const artwork = await getArtworkDetail(artworkId, isMember ? user.id : null);
  if (!artwork) notFound();

  const comments = await listComments(artworkId);
  const isOwner = isMember && user.id === artwork.creator_id;
  const mode = !user ? "guest" : isMember ? "member" : "blocked";

  return (
    <div className="space-y-8">
      <Link href="/" className="text-sm font-semibold text-forest hover:underline">
        &larr; Kembali ke galeri
      </Link>

      <div className="grid gap-8 lg:grid-cols-[2fr_1fr]">
        <div className="overflow-hidden rounded-2xl border border-deep-forest/10 bg-white shadow-sm">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={artwork.file_url} alt={artwork.title} className="max-h-[75vh] w-full object-contain" />
        </div>

        <aside className="space-y-5">
          <div>
            <h1 className="text-2xl font-semibold text-deep-forest">{artwork.title}</h1>
            <p className="mt-1 text-sm text-deep-forest/70">
              oleh{" "}
              <Link href={`/creators/${artwork.creator_id}`} className="font-semibold text-forest hover:underline">
                {artwork.creator_name}
              </Link>
            </p>
          </div>

          <dl className="grid grid-cols-2 gap-3 text-sm">
            <div>
              <dt className="text-deep-forest/70">Kategori</dt>
              <dd className="font-medium text-deep-forest">
                <Link href={`/?category=${artwork.category_id}`} className="hover:underline">
                  {artwork.category_name}
                </Link>
              </dd>
            </div>
            <div>
              <dt className="text-deep-forest/70">Diunggah</dt>
              <dd className="font-medium text-deep-forest">{formatDate(artwork.created_at)}</dd>
            </div>
            <div>
              <dt className="text-deep-forest/70">Suka</dt>
              <dd className="font-medium text-deep-forest">{artwork.like_count}</dd>
            </div>
          </dl>

          <p className="whitespace-pre-line text-sm leading-relaxed text-deep-forest">{artwork.description}</p>

          {artwork.tags.length > 0 && (
            <ul className="flex flex-wrap gap-1.5">
              {artwork.tags.map((t) => (
                <li key={t}>
                  <Link
                    href={`/?tag=${encodeURIComponent(t)}`}
                    className="inline-block rounded-full bg-sage/30 px-3 py-1 text-xs font-medium text-deep-forest hover:bg-sage/60"
                  >
                    #{t}
                  </Link>
                </li>
              ))}
            </ul>
          )}

          <InteractionButtons artwork={artwork} mode={mode} />

          {isOwner && (
            <Link
              href={`/member/artworks/${artwork.id}/edit`}
              className="inline-block text-sm font-semibold text-forest hover:underline"
            >
              Edit karya ini
            </Link>
          )}

          {isMember && !isOwner && (
            artwork.reported ? (
              <p className="text-sm text-deep-forest/70">Anda sudah melaporkan karya ini. Terima kasih.</p>
            ) : (
              <ReportForm artworkId={artwork.id} />
            )
          )}
        </aside>
      </div>

      <section aria-labelledby="comments-title" className="max-w-3xl space-y-5">
        <h2 id="comments-title" className="text-xl font-semibold text-deep-forest">
          Komentar ({comments.length})
        </h2>

        {mode === "member" && <CommentForm artworkId={artwork.id} />}
        {mode === "guest" && (
          <p className="text-sm text-deep-forest/70">
            <Link href="/login" className="font-semibold text-forest hover:underline">Masuk</Link> sebagai Member untuk
            berkomentar.
          </p>
        )}

        {comments.length === 0 ? (
          <p className="text-sm text-deep-forest/70">Belum ada komentar.</p>
        ) : (
          <ul className="space-y-4">
            {comments.map((c) => (
              <li key={c.id} className="rounded-2xl border border-deep-forest/10 bg-white p-4">
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <Link href={`/creators/${c.user_id}`} className="text-sm font-semibold text-forest hover:underline">
                      {c.display_name}
                    </Link>
                    <span className="ml-2 text-xs text-deep-forest/70">{formatDateTime(c.created_at)}</span>
                  </div>
                  {isMember && user.id === c.user_id && (
                    <form action={deleteCommentAction}>
                      <input type="hidden" name="commentId" value={c.id} />
                      <button type="submit" className="text-xs font-semibold text-red-700 hover:underline">
                        Hapus
                      </button>
                    </form>
                  )}
                </div>
                <p className="mt-2 whitespace-pre-line text-sm text-deep-forest">{c.content}</p>
              </li>
            ))}
          </ul>
        )}
      </section>
    </div>
  );
}