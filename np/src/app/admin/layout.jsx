import { requireRole } from "@/lib/session";
import DashboardSidebar from "@/components/DashboardSidebar";

export const metadata = { title: { default: "Admin", template: "%s | Admin TIGA" } };

const ADMIN_LINKS = [
  { href: "/admin", label: "Statistics", icon: "BarChart3", exact: true },
  { href: "/admin/users", label: "Users Directory", icon: "Users" },
  { href: "/admin/curators", label: "Curator Requests", icon: "UserCheck" },
  { href: "/admin/categories", label: "Categories", icon: "Tag" },
  { href: "/admin/moderation", label: "Moderation Queue", icon: "Flag" },
];

const ADMIN_GENERAL_LINKS = [
  { href: "/challenges", label: "Challenges", icon: "Compass" },
  { href: "/#collection", label: "Public Exhibition", icon: "ExternalLink" },
];

export default async function AdminLayout({ children }) {
  const user = await requireRole("admin");

  return (
    <DashboardSidebar
      menuLinks={ADMIN_LINKS}
      generalLinks={ADMIN_GENERAL_LINKS}
      subtitle="Admin Dashboard"
      user={user}
      role="admin"
    >
      {children}
    </DashboardSidebar>
  );
}
