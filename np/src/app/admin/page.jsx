import Link from "next/link";
import { requireRole } from "@/lib/session";
import { getPlatformStats } from "@/lib/stats";

export const metadata = { title: "Statistik" };

export default async function AdminDashboardPage() {
  const user = await requireRole("admin");
  const s = await getPlatformStats();

  const cards = [
    { label: "Total Member", value: s.member },
    { label: "Total Curator", value: s.curator },
    { label: "Total Admin", value: s.admin },
    { label: "Total karya", value: s.artworks },
    { label: "Challenge aktif", value: s.active_challenges },
    {
      label: "Curator menunggu persetujuan",
      value: s.pending_curators,
      alert: s.pending_curators > 0,
      href: "/admin/curators",
    },
    {
      label: "Laporan belum diproses",
      value: s.pending_reports,
      alert: s.pending_reports > 0,
      href: "/admin/moderation",
    },
  ];

  return (
    <div>
      <h1 className="text-2xl font-semibold text-deep-forest">Statistik Platform</h1>
      <p className="mt-1 text-sm text-deep-forest/70">Halo, {user.display_name}.</p>

      <div className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-3">
        {cards.map((c) => {
          const content = (
            <>
              <p className="text-sm text-deep-forest/70">{c.label}</p>
              <p className={`mt-2 text-3xl font-bold ${c.alert ? "text-earth" : "text-deep-forest"}`}>
                {c.value}
              </p>
              {c.href && <p className="mt-2 text-xs font-semibold text-forest">Buka &rarr;</p>}
            </>
          );
          const className = `rounded-2xl border bg-white p-5 shadow-sm ${
            c.alert ? "border-earth" : "border-deep-forest/10"
          }`;
          return c.href ? (
            <Link key={c.label} href={c.href} className={`${className} block transition hover:shadow-md`}>
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