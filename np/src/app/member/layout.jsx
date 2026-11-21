import { requireRole } from "@/lib/session";
import DashboardSidebar from "@/components/DashboardSidebar";

export const metadata = { title: { default: "Member", template: "%s | TIGA" } };

const MEMBER_LINKS = [
  { href: "/", label: "Jelajahi Galeri", exact: true },
  { href: "/member/artworks", label: "Karya Saya" },
  { href: "/member/favorites", label: "Favorit" },
  { href: "/member/submissions", label: "Submisi Challenge" },
  { href: "/member/profile", label: "Profil" },
];

export default async function MemberLayout({ children }) {
  const user = await requireRole("member");

  return (
    <div className="min-h-screen lg:flex">
      <DashboardSidebar links={MEMBER_LINKS} subtitle="Member Dashboard" displayName={user.display_name} />
      <main className="min-w-0 flex-1 px-4 py-6 sm:px-8 lg:py-10">{children}</main>
    </div>
  );
}