import Link from "next/link";
import { getMemberSubmission, listOwnArtworksBrief } from "@/lib/submissions";
import { formatDateTime } from "@/lib/format";
import ActionButton from "@/components/admin/ActionButton";
import SubmitWorkForm from "./SubmitWorkForm";
import { withdrawSubmissionAction } from "@/app/(public)/challenges/[id]/actions";

const BOX = "rounded-2xl border border-deep-forest/10 bg-white p-6 shadow-sm";

// Panel "ikut challenge" di halaman detail challenge. Status challenge (active/upcoming/ended)
// dihitung database; server action tetap memvalidasi ulang waktu saat submit/withdraw.
export default async function ParticipationPanel({ challenge, user }) {
  if (!user) {
    return (
      <section className={BOX}>
        <h2 className="text-lg font-semibold text-deep-forest">Ikuti challenge ini</h2>
        <p className="mt-1 text-sm text-deep-forest/70">
          <Link href="/login" className="font-semibold text-forest hover:underline">Masuk</Link> sebagai Member untuk
          mengirim karya.
        </p>
      </section>
    );
  }

  if (user.role !== "member") {
    return (
      <section className={BOX}>
        <h2 className="text-lg font-semibold text-deep-forest">Ikuti challenge ini</h2>
        <p className="mt-1 text-sm text-deep-forest/70">Hanya akun Member yang dapat mengirim karya ke challenge.</p>
      </section>
    );
  }

  const submission = await getMemberSubmission(challenge.id, user.id);

  if (submission) {
    return (
      <section className={BOX}>
        <h2 className="text-lg font-semibold text-deep-forest">Submisi Anda</h2>
        <div className="mt-3 flex flex-wrap items-center gap-4">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={submission.file_url} alt={submission.title} className="h-20 w-28 rounded-xl object-cover" />
          <div className="space-y-1">
            <Link href={`/artworks/${submission.artwork_id}`} className="font-semibold text-forest hover:underline">
              {submission.title}
            </Link>
            <p className="text-xs text-deep-forest/70">Dikirim {formatDateTime(submission.submitted_at)}</p>
            {submission.rank && (
              <p className="inline-block rounded-full bg-earth px-3 py-1 text-xs font-bold text-white">
                Juara {submission.rank}
              </p>
            )}
          </div>
        </div>
        <div className="mt-4">
          {challenge.status === "ended" ? (
            <p className="text-sm text-deep-forest/70">Challenge telah berakhir, submisi tidak dapat ditarik.</p>
          ) : (
            <ActionButton
              action={withdrawSubmissionAction}
              fields={{ challengeId: challenge.id }}
              label="Withdraw"
              pendingLabel="Menarik..."
              tone="danger"
              confirmMessage="Tarik submisi ini dari challenge?"
              confirmLabel="Ya, tarik"
            />
          )}
        </div>
      </section>
    );
  }

  if (challenge.status === "upcoming") {
    return (
      <section className={BOX}>
        <h2 className="text-lg font-semibold text-deep-forest">Ikuti challenge ini</h2>
        <p className="mt-1 text-sm text-deep-forest/70">
          Challenge belum dimulai. Pengiriman karya dibuka {formatDateTime(challenge.start_date)} WITA.
        </p>
      </section>
    );
  }

  if (challenge.status === "ended") {
    return (
      <section className={BOX}>
        <h2 className="text-lg font-semibold text-deep-forest">Ikuti challenge ini</h2>
        <p className="mt-1 text-sm text-deep-forest/70">Challenge telah berakhir.</p>
      </section>
    );
  }

  const artworks = await listOwnArtworksBrief(user.id);

  return (
    <section className={BOX}>
      <h2 className="text-lg font-semibold text-deep-forest">Ikuti challenge ini</h2>
      <p className="mb-4 mt-1 text-sm text-deep-forest/70">
        Satu Member hanya dapat mengirim satu karya. Anda bisa menariknya kembali selama challenge berlangsung.
      </p>
      {artworks.length === 0 ? (
        <p className="text-sm text-deep-forest">
          Anda belum punya karya.{" "}
          <Link href="/member/artworks/new" className="font-semibold text-forest hover:underline">
            Unggah karya dulu
          </Link>
          , lalu kembali ke sini.
        </p>
      ) : (
        <SubmitWorkForm challengeId={challenge.id} artworks={artworks} />
      )}
    </section>
  );
}
