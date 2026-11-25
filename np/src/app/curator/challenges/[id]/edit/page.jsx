import { notFound } from "next/navigation";
import { requireRole } from "@/lib/session";
import { getOwnChallenge } from "@/lib/curatorChallenges";
import { toDateTimeLocalValue } from "@/lib/format";
import ChallengeForm from "@/components/curator/ChallengeForm";

export const metadata = { title: "Edit Challenge · TIGA" };

export default async function EditChallengePage({ params }) {
  const user = await requireRole("curator");

  const { id } = await params;
  const challengeId = Number(id);
  if (!Number.isInteger(challengeId) || challengeId <= 0) notFound();

  const challenge = await getOwnChallenge(challengeId, user.id);
  if (!challenge) notFound();

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-display text-3xl font-semibold text-ink">Edit Challenge</h1>
        {challenge.winner_count > 0 && (
          <p className="mt-1 text-sm text-mute">
            Winners have already been selected, so dates cannot be changed.
          </p>
        )}
      </div>
      <ChallengeForm
        mode="edit"
        challenge={{
          id: challenge.id,
          title: challenge.title,
          description: challenge.description,
          rules: challenge.rules,
          prize: challenge.prize,
          bannerUrl: challenge.banner_url,
          startDate: toDateTimeLocalValue(challenge.start_date),
          endDate: toDateTimeLocalValue(challenge.end_date),
        }}
      />
    </div>
  );
}
