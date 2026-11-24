import { requireRole } from "@/lib/session";
import DashboardSidebar from "@/components/DashboardSidebar";

export const metadata = { title: { default: "Member", template: "%s | TIGA" } };

const MEMBER_LINKS = [
  { href: "/member/artworks", label: "My Artworks" },
  { href: "/member/favorites", label: "My Favorites" },
  { href: "/member/submissions", label: "My Submissions" },
  { href: "/member/profile", label: "Profile & Account" },
];

export default async function MemberLayout({ children }) {
  const user = await requireRole("member");

  return (
    <div className="min-h-screen min-[1000px]:flex bg-white">
      <DashboardSidebar
        links={MEMBER_LINKS}
        subtitle="Member Dashboard"
        displayName={user.display_name}
        role="member"
      />
      <main className="min-w-0 flex-1 px-4 py-8 sm:px-8 min-[1000px]:py-10">{children}</main>
    </div>
  );
}
