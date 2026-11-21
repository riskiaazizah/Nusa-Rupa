import { requireRole } from "@/lib/session";
import AdminSidebar from "@/components/admin/AdminSidebar";

export const metadata = { title: { default: "Admin", template: "%s | Admin TIGA" } };

export default async function AdminLayout({ children }) {
  const user = await requireRole("admin"); // cek ulang di server (Flowchart #3)

  return (
    <div className="min-h-screen lg:flex">
      <AdminSidebar displayName={user.display_name} />
      <main className="min-w-0 flex-1 px-4 py-6 sm:px-8 lg:py-10">{children}</main>
    </div>
  );
}