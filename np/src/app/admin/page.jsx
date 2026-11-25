import Link from "next/link";
import { requireRole } from "@/lib/session";
import { getPlatformStats } from "@/lib/stats";

export const metadata = { title: "Platform Statistics · TIGA" };

export default async function AdminDashboardPage() {
  const user = await requireRole("admin");
  const s = await getPlatformStats();

  const cards = [
    { label: "Members", value: s.member, color: "border-t-forest" },
    { label: "Curators", value: s.curator, color: "border-t-animals" },
    { label: "Admins", value: s.admin, color: "border-t-people" },
    { label: "Artworks", value: s.artworks, color: "border-t-forest" },
    { label: "Active Challenges", value: s.active_challenges, color: "border-t-animals", href: "/challenges?status=active" },
    {
      label: "Pending Curators",
      value: s.pending_curators,
      color: "border-t-animals",
      alert: s.pending_curators > 0,
      href: "/admin/curators",
      actionText: "Review applications",
    },
    {
      label: "Pending Reports",
      value: s.pending_reports,
      color: "border-t-people",
      alert: s.pending_reports > 0,
      href: "/admin/moderation",
      actionText: "Review reports",
    },
  ];

  return (
    <div className="space-y-8">
      <div>
        <h1 className="font-display text-3xl font-semibold text-ink">Platform Statistics</h1>
        <p className="mt-1 text-sm text-mute">Welcome back, {user.display_name}. Overview of platform activity.</p>
      </div>

      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 xl:grid-cols-3">
        {cards.map((c) => {
          const content = (
            <div className="flex h-full flex-col justify-between">
              <div>
                <p className="text-xs font-semibold uppercase tracking-wider text-mute">{c.label}</p>
                <p className="font-display mt-2 text-4xl font-semibold text-ink">
                  {c.value}
                </p>
              </div>
              {c.href && (
                <div className="mt-4 border-t border-line/60 pt-3 text-xs font-semibold text-ink">
                  {c.actionText ?? "View details"}
                </div>
              )}
            </div>
          );
          const className = `rounded-2xl border border-line bg-white p-5 shadow-sm border-t-4 ${c.color}`;
          return c.href ? (
            <Link key={c.label} href={c.href} className={`${className} block transition hover:border-ink/30 hover:shadow-md`}>
              {content}
            </Link>
          ) : (
            <div key={c.label} className={className}>
              {content}
            </div>
          );
        })}
      </div>
    </div>
  );
}
