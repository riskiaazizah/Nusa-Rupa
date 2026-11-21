import { requireRole } from "@/lib/session";
import DashboardSidebar from "@/components/DashboardSidebar";

export const metadata = { title: { default: "Admin", template: "%s | Admin TIGA" } };

const ADMIN_LINKS = [
  { href: "/admin", label: "Statistik", exact: true },
  { href: "/admin/users", label: "Pengguna" },
  { href: "/admin/curators", label: "Verifikasi Curator" },
  { href: "/admin/categories", label: "Kategori" },
  { href: "/admin/moderation", label: "Moderasi" },
];

export default async function AdminLayout({ children }) {
  const user = await requireRole("admin"); // cek ulang di server (Flowchart #3)

  return (
    <div className="min-h-screen lg:flex">
      <DashboardSidebar links={ADMIN_LINKS} subtitle="Admin Dashboard" displayName={user.display_name} />
      <main className="min-w-0 flex-1 px-4 py-6 sm:px-8 lg:py-10">{children}</main>
    </div>
  );
}