import Link from "next/link";
import { requireRole } from "@/lib/session";
import { getOwnProfile } from "@/lib/profile";
import ProfileForm from "@/components/member/ProfileForm";
import AccountForm from "@/components/member/AccountForm";

export const metadata = { title: "Profile & Account" };

export default async function ProfilePage() {
  const user = await requireRole("member");
  const profile = await getOwnProfile(user.id);

  return (
    <div className="space-y-10 max-w-4xl">
      <div>
        <div className="flex flex-wrap items-center justify-between gap-4 pb-4 border-b border-line">
          <div>
            <h1 className="font-display text-3xl font-semibold text-ink">Profile & Account</h1>
            <p className="mt-1 text-sm text-mute">
              Manage your public artist profile and private security credentials.
            </p>
          </div>
          <Link
            href={`/creators/${user.id}`}
            className="rounded-full border border-line px-4 py-1.5 text-xs font-semibold text-ink hover:border-ink hover:bg-soft transition"
          >
            View public profile
          </Link>
        </div>
      </div>

      {/* Card 1: Public Profile */}
      <section className="rounded-2xl border border-line bg-white p-6 sm:p-8 space-y-6 shadow-xs">
        <div>
          <h2 className="font-display text-2xl font-semibold text-ink">Public Profile</h2>
          <p className="mt-1 text-xs text-mute">
            This information is displayed publicly on your creator profile page.
          </p>
        </div>
        <ProfileForm
          profile={{
            displayName: profile?.display_name ?? user.display_name,
            bio: profile?.bio ?? "",
            avatarUrl: profile?.avatar_url,
            links: profile?.links ?? [],
          }}
        />
      </section>

      {/* Card 2: Account Security */}
      <section className="rounded-2xl border border-line bg-white p-6 sm:p-8 space-y-6 shadow-xs">
        <div>
          <h2 className="font-display text-2xl font-semibold text-ink">Account & Security</h2>
          <p className="mt-1 text-xs text-mute">
            Private credentials for accessing your TIGA account.
          </p>
        </div>
        <AccountForm currentEmail={user.email} />
      </section>
    </div>
  );
}
