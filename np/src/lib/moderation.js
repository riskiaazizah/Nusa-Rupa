import { query } from "./db";
import { removeUploadedFile } from "./uploads";

// Antrian moderasi: karya yang punya laporan "pending", urut dari laporan terbanyak
export async function listModerationQueue() {
  const artworks = await query(
    `SELECT a.id, a.title, a.file_url, a.user_id AS creator_id,
            p.display_name AS creator_name,
            COUNT(r.id)::int AS report_count,
            MAX(r.created_at) AS last_reported_at
       FROM reports r
       JOIN artworks a ON a.id = r.artwork_id
       JOIN profiles p ON p.user_id = a.user_id
      WHERE r.status = 'pending'
      GROUP BY a.id, p.display_name
      ORDER BY report_count DESC, last_reported_at DESC`
  );
  if (artworks.length === 0) return [];

  const reports = await query(
    `SELECT r.id, r.artwork_id, r.reason, r.details, r.created_at,
            p.display_name AS reporter_name
       FROM reports r JOIN profiles p ON p.user_id = r.reporter_id
      WHERE r.status = 'pending' AND r.artwork_id = ANY($1::int[])
      ORDER BY r.created_at ASC`,
    [artworks.map((a) => a.id)]
  );

  return artworks.map((a) => ({ ...a, reports: reports.filter((r) => r.artwork_id === a.id) }));
}

// "Dismiss Report": laporan ditolak, karya tetap tayang. Mengembalikan jumlah laporan yang diproses.
export async function dismissReports(artworkId) {
  const rows = await query(
    `UPDATE reports SET status = 'dismissed'
      WHERE artwork_id = $1 AND status = 'pending' RETURNING id`,
    [artworkId]
  );
  return rows.length;
}

// "Take Down": laporan diterima, karya dihapus (beserta like, komentar, favorit, submisi,
// dan laporan lewat CASCADE) dan file di disk ikut dihapus. Hanya karya yang memang
// sedang dilaporkan yang bisa di-take down. Mengembalikan true jika karya terhapus.
export async function takeDownArtwork(artworkId) {
  const rows = await query(
    `DELETE FROM artworks a
      WHERE a.id = $1
        AND EXISTS (SELECT 1 FROM reports r WHERE r.artwork_id = a.id AND r.status = 'pending')
      RETURNING a.file_url`,
    [artworkId]
  );
  if (!rows[0]) return false;
  await removeUploadedFile(rows[0].file_url);
  return true;
}