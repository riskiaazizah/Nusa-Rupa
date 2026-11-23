import { requireRole } from "@/lib/session";
import ChallengeForm from "@/components/curator/ChallengeForm";

export const metadata = { title: "Buat Challenge" };

export default async function NewChallengePage() {
  await requireRole("curator");

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold text-deep-forest">Buat Challenge</h1>
        <p className="mt-1 text-sm text-deep-forest/70">
          Semua kolom wajib diisi. Tanggal selesai harus setelah tanggal mulai.
        </p>
      </div>
      <ChallengeForm mode="create" />
    </div>
  );
}