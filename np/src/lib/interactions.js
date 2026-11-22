import { query } from "./db";

// Mengembalikan { liked } = status SETELAH toggle. Error 23503 jika karya tidak ada.
export async function toggleLike(userId, artworkId) {
  const removed = await query(
    `DELETE FROM likes WHERE user_id = $1 AND artwork_id = $2 RETURNING user_id`,
    [userId, artworkId]
  );
  if (removed.length > 0) return { liked: false };
  await query(
    `INSERT INTO likes (user_id, artwork_id) VALUES ($1, $2) ON CONFLICT DO NOTHING`,
    [userId, artworkId]
  );
  return { liked: true };
}

export async function toggleFavorite(userId, artworkId) {
  const removed = await query(
    `DELETE FROM favorites WHERE user_id = $1 AND artwork_id = $2 RETURNING user_id`,
    [userId, artworkId]
  );
  if (removed.length > 0) return { favorited: false };
  await query(
    `INSERT INTO favorites (user_id, artwork_id) VALUES ($1, $2) ON CONFLICT DO NOTHING`,
    [userId, artworkId]
  );
  return { favorited: true };
}

export async function addComment(userId, artworkId, content) {
  const rows = await query(
    `INSERT INTO comments (artwork_id, user_id, content) VALUES ($1, $2, $3) RETURNING id`,
    [artworkId, userId, content]
  );
  return rows[0];
}

// Hanya penulis yang bisa menghapus. Mengembalikan { artwork_id } atau null.
export async function deleteComment(userId, commentId) {
  const rows = await query(
    `DELETE FROM comments WHERE id = $1 AND user_id = $2 RETURNING artwork_id`,
    [commentId, userId]
  );
  return rows[0] ?? null;
}

// Tidak boleh melaporkan karya sendiri atau karya yang tidak ada.
// Laporan ganda (artwork + reporter sama) melempar error 23505 (uq_report_once).
export async function createReport(userId, artworkId, { reason, details }) {
  const rows = await query(
    `INSERT INTO reports (artwork_id, reporter_id, reason, details)
     SELECT a.id, $2, $3, $4 FROM artworks a WHERE a.id = $1 AND a.user_id <> $2
     RETURNING id`,
    [artworkId, userId, reason, details]
  );
  return rows.length === 1 ? { status: "created" } : { status: "not_allowed" };
}