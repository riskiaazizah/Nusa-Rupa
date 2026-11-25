import { requireRole } from "@/lib/session";
import ChallengeForm from "@/components/curator/ChallengeForm";

export const metadata = { title: "Create Challenge · TIGA" };

export default async function NewChallengePage() {
  await requireRole("curator");

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-display text-3xl font-semibold text-ink">Create Challenge</h1>
        <p className="mt-1 text-sm text-mute">
          All fields are required. The end date must be after the start date.
        </p>
      </div>
      <ChallengeForm mode="create" />
    </div>
  );
}
