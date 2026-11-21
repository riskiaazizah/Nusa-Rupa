import { query } from "./db";

// Statistik platform untuk Admin Dashboard (query agregasi)
export async function getPlatformStats() {
  const rows = await query(
    `SELECT
       (SELECT COUNT(*)::int FROM users WHERE role = 'member')  AS member,
       (SELECT COUNT(*)::int FROM users WHERE role = 'curator') AS curator,
       (SELECT COUNT(*)::int FROM users WHERE role = 'admin')   AS admin,
       (SELECT COUNT(*)::int FROM users
         WHERE role = 'curator' AND curator_status = 'pending') AS pending_curators,
       (SELECT COUNT(*)::int FROM artworks)                      AS artworks,
       (SELECT COUNT(*)::int FROM reports WHERE status = 'pending') AS pending_reports,
       (SELECT COUNT(*)::int FROM challenges
         WHERE NOW() BETWEEN start_date AND end_date)            AS active_challenges`
  );
  return rows[0];
}