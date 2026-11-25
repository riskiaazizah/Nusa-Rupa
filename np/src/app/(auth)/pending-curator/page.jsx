import { requirePendingCurator } from "@/lib/session";
import DeleteAccountForm from "@/components/DeleteAccountForm";

export const metadata = { title: "Curator Account Status · TIGA" };

export default async function PendingCuratorPage() {
  const user = await requirePendingCurator();
  const rejected = user.curator_status === "rejected";

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-display text-3xl font-semibold text-ink">
          {rejected ? "Your registration was rejected." : "Your account is under review."}
        </h1>
        <p className="mt-1.5 text-sm text-mute">{user.display_name}</p>
      </div>

      {rejected ? (
        <div className="space-y-4">
          <div className="rounded-xl border border-people/30 bg-people/5 p-4 text-sm text-ink">
            Admin has reviewed and rejected this curator registration. The dashboard cannot be
            accessed. You may delete this account.
          </div>
          <DeleteAccountForm />
        </div>
      ) : (
        <div className="rounded-xl border border-animals/30 bg-animals/5 p-4 text-sm text-ink">
          We will unlock your dashboard once an Admin approves your application. Please check back later.
        </div>
      )}

      <form action="/api/auth/logout" method="post">
        <button
          type="submit"
          className="w-full rounded-full border border-line bg-white px-6 py-2.5 text-sm font-semibold text-ink transition hover:border-ink hover:bg-soft"
        >
          Back
        </button>
      </form>
    </div>
  );
}
