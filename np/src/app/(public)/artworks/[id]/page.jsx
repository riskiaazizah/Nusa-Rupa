import Link from "next/link";
import { notFound } from "next/navigation";
import { getSession } from "@/lib/session";
import { getArtworkDetail, listComments } from "@/lib/gallery";
import { formatDate, formatDateTime } from "@/lib/format";
import InteractionButtons from "@/components/artwork/InteractionButtons";
import CommentForm from "@/components/artwork/CommentForm";
import ReportForm from "@/components/artwork/ReportForm";
import { deleteCommentAction } from "./actions";

const CATEGORY_COLORS = {
  flora: "#1f6b45",
  environment: "#1f6b45",
  fauna: "#2f3fa8",
  "conservation & hope": "#2f3fa8",
  "social impact": "#d92e1c",
  "culture & heritage": "#d92e1c",
};

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
  const catColor = CATEGORY_COLORS[(artwork.category_name || "").toLowerCase()] || "#0f0f0f";

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-28 pb-12 sm:pt-32 sm:pb-16 space-y-10">
      <div>
        <Link
          href="/#collection"
          className="text-xs font-semibold uppercase tracking-wider text-mute hover:text-ink transition"
        >
          Back to collection
        </Link>
      </div>

      <div className="grid gap-10 lg:grid-cols-[1.2fr_1fr] items-start">
        {/* Full Image Preview with ink hairline border */}
        <div className="overflow-hidden rounded-xl border border-ink bg-soft flex items-center justify-center">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={artwork.file_url}
            alt={artwork.title}
            className="max-h-[80vh] w-full object-contain"
          />
        </div>

        {/* Artwork Metadata & Actions */}
        <aside className="space-y-6">
          <div className="space-y-2 border-b border-line pb-6">
            <div className="flex items-center gap-2 text-xs uppercase tracking-wider text-mute font-medium">
              <span
                className="inline-block h-2.5 w-2.5 rounded-full"
                style={{ backgroundColor: catColor }}
                aria-hidden="true"
              />
              <span>{artwork.category_name}</span>
              <span>·</span>
              <span>{formatDate(artwork.created_at)}</span>
            </div>

            <h1 className="font-display text-3xl sm:text-4xl md:text-5xl font-semibold text-ink leading-tight">
              {artwork.title}
            </h1>

            <p className="text-sm text-mute">
              by{" "}
              <Link href={`/creators/${artwork.creator_id}`} className="font-semibold text-ink hover:text-people transition underline underline-offset-2">
                {artwork.creator_name}
              </Link>
            </p>
          </div>

          <div className="space-y-4 text-sm leading-relaxed text-ink/90 whitespace-pre-line">
            <p>{artwork.description}</p>
          </div>

          {artwork.tags.length > 0 && (
            <div className="space-y-2 pt-2">
              <span className="text-[11px] font-semibold uppercase tracking-widest text-mute block">
                Issue Tags
              </span>
              <ul className="flex flex-wrap gap-2">
                {artwork.tags.map((t) => (
                  <li key={t}>
                    <span className="inline-block rounded-full border border-line bg-soft px-3 py-1 text-xs text-ink">
                      #{t}
                    </span>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Role Interactions (Like / Favorite) */}
          <div className="pt-2">
            <InteractionButtons artwork={artwork} mode={mode} />
          </div>

          {isOwner && (
            <div className="pt-3 border-t border-line">
              <Link
                href={`/member/artworks/${artwork.id}/edit`}
                className="rounded-full border border-line px-4 py-2 text-xs font-semibold uppercase tracking-wider text-ink hover:border-ink hover:bg-soft transition inline-block"
              >
                Edit this artwork
              </Link>
            </div>
          )}

          {isMember && !isOwner && (
            <div className="pt-4 border-t border-line">
              {artwork.reported ? (
                <p className="text-xs font-medium text-mute">
                  Report sent. Thank you.
                </p>
              ) : (
                <ReportForm artworkId={artwork.id} />
              )}
            </div>
          )}
        </aside>
      </div>

      {/* Comments Section */}
      <section aria-labelledby="comments-title" className="max-w-3xl space-y-6 pt-10 border-t border-line">
        <h2 id="comments-title" className="font-display text-2xl sm:text-3xl font-semibold text-ink">
          Comments ({comments.length})
        </h2>

        {mode === "member" && <CommentForm artworkId={artwork.id} />}
        {mode === "guest" && (
          <p className="rounded-xl border border-line bg-soft p-4 text-xs text-mute">
            <Link href="/login" className="font-semibold text-ink underline">Log in</Link> as a Member to join the conversation.
          </p>
        )}

        {comments.length === 0 ? (
          <p className="text-xs text-mute py-4">No comments yet.</p>
        ) : (
          <ul className="space-y-4">
            {comments.map((c) => (
              <li key={c.id} className="rounded-xl border border-line bg-white p-4 space-y-2">
                <div className="flex items-start justify-between gap-3 text-xs">
                  <div>
                    <Link href={`/creators/${c.user_id}`} className="font-semibold text-ink hover:text-people transition">
                      {c.display_name}
                    </Link>
                    <span className="ml-2 text-mute">{formatDateTime(c.created_at)}</span>
                  </div>
                  {isMember && user.id === c.user_id && (
                    <form action={deleteCommentAction}>
                      <input type="hidden" name="commentId" value={c.id} />
                      <button type="submit" className="text-people hover:underline text-xs font-semibold cursor-pointer">
                        Delete
                      </button>
                    </form>
                  )}
                </div>
                <p className="whitespace-pre-line text-sm text-ink leading-relaxed">{c.content}</p>
              </li>
            ))}
          </ul>
        )}
      </section>
    </div>
  );
}
