import { requireRole } from "@/lib/session";
import RoleNavbar from "@/components/RoleNavbar";

export const metadata = { title: { default: "Member", template: "%s | TIGA" } };

const NAV_LINKS = [
  { href: "/#collection", label: "Collection" },
  { href: "/challenges", label: "Challenges" },
];

export default async function MemberLayout({ children }) {
  const user = await requireRole("member");

  return (
    <div className="min-h-screen bg-white flex flex-col">
      <RoleNavbar user={user} role="member" links={NAV_LINKS} />
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-10">
        {children}
      </main>
    </div>
  );
}
