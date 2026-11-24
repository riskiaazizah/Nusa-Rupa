import { query } from "./db";

export async function listFavorites(userId) {
  return query(
    `SELECT a.id, a.title, a.file_url, a.created_at,
            c.id AS category_id, c.name AS category_name,
            a.user_id AS creator_id, p.display_name AS creator_name,
            (SELECT COUNT(*)::int FROM likes l WHERE l.artwork_id = a.id) AS like_count
       FROM favorites f
       JOIN artworks a ON a.id = f.artwork_id
       JOIN categories c ON c.id = a.category_id
       JOIN profiles p ON p.user_id = a.user_id
      WHERE f.user_id = $1
      ORDER BY f.created_at DESC, a.id DESC`,
    [userId]
  );
}
