import { requireRole } from "@/lib/session";
import DashboardSidebar from "@/components/DashboardSidebar";

export const metadata = { title: { default: "Curator", template: "%s | Curator TIGA" } };

const CURATOR_LINKS = [
  { href: "/", label: "Jelajahi Galeri", exact: true },
  { href: "/curator/challenges", label: "Challenge Saya", exact: true },
  { href: "/curator/challenges/new", label: "Buat Challenge" },
];

export default async function CuratorLayout({ children }) {
  // Hanya Curator berstatus "approved". Yang pending/rejected dialihkan ke /pending-curator.
  const user = await requireRole("curator");

  return (
    <div className="min-h-screen lg:flex">
      <DashboardSidebar links={CURATOR_LINKS} subtitle="Curator Dashboard" displayName={user.display_name} />
      <main className="min-w-0 flex-1 px-4 py-6 sm:px-8 lg:py-10">{children}</main>
    </div>
  );
}