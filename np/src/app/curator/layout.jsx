import { requireRole } from "@/lib/session";
import DashboardSidebar from "@/components/DashboardSidebar";

export const metadata = { title: { default: "Curator", template: "%s | Curator TIGA" } };

const CURATOR_LINKS = [
  { href: "/curator/challenges", label: "Challenges", exact: true },
  { href: "/curator/challenges/new", label: "New Challenge" },
];

export default async function CuratorLayout({ children }) {
  const user = await requireRole("curator");

  return (
    <div className="min-h-screen min-[1000px]:flex bg-white">
      <DashboardSidebar
        links={CURATOR_LINKS}
        subtitle="Curator Dashboard"
        displayName={user.display_name}
        role="curator"
      />
      <main className="min-w-0 flex-1 px-4 py-8 sm:px-8 min-[1000px]:py-10">{children}</main>
    </div>
  );
}
