import { requireRole } from "@/lib/session";
import DashboardSidebar from "@/components/DashboardSidebar";

export const metadata = { title: { default: "Admin", template: "%s | Admin TIGA" } };

const ADMIN_LINKS = [
  { href: "/admin", label: "Statistics", exact: true },
  { href: "/admin/users", label: "Users" },
  { href: "/admin/curators", label: "Curator Verification" },
  { href: "/admin/categories", label: "Categories" },
  { href: "/admin/moderation", label: "Moderation Queue" },
];

export default async function AdminLayout({ children }) {
  const user = await requireRole("admin");

  return (
    <div className="min-h-screen min-[1000px]:flex bg-white">
      <DashboardSidebar
        links={ADMIN_LINKS}
        subtitle="Admin Dashboard"
        displayName={user.display_name}
        role="admin"
      />
      <main className="min-w-0 flex-1 px-4 py-8 sm:px-8 min-[1000px]:py-10">{children}</main>
    </div>
  );
}
