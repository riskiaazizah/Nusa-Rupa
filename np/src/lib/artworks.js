import { pool, query } from "./db";

// Ganti seluruh tag sebuah karya (dipanggil di dalam transaksi)
async function syncTags(client, artworkId, tags) {
  await client.query(`DELETE FROM artwork_tags WHERE artwork_id = $1`, [artworkId]);
  await client.query(
    `INSERT INTO tags (name) SELECT UNNEST($1::text[]) ON CONFLICT (name) DO NOTHING`,
    [tags]
  );
  await client.query(
    `INSERT INTO artwork_tags (artwork_id, tag_id)
     SELECT $1, id FROM tags WHERE name = ANY($2::text[])`,
    [artworkId, tags]
  );
}

const ARTWORK_SELECT = `
  SELECT a.id, a.title, a.description, a.file_url, a.created_at, a.category_id,
         c.name AS category_name,
         COALESCE(ARRAY_AGG(t.name ORDER BY t.name) FILTER (WHERE t.name IS NOT NULL), '{}') AS tags,
         (SELECT COUNT(*)::int FROM likes l WHERE l.artwork_id = a.id) AS like_count
    FROM artworks a
    JOIN categories c ON c.id = a.category_id
    LEFT JOIN artwork_tags atg ON atg.artwork_id = a.id
    LEFT JOIN tags t ON t.id = atg.tag_id`;

export async function createArtwork({ userId, categoryId, title, description, fileUrl, tags }) {
  const client = await pool.connect();
  try {
    await client.query("BEGIN");
    const rows = await client.query(
      `INSERT INTO artworks (user_id, category_id, title, description, file_url)
       VALUES ($1, $2, $3, $4, $5) RETURNING id`,
      [userId, categoryId, title, description, fileUrl]
    );
    await syncTags(client, rows[0].id, tags);
    await client.query("COMMIT");
    return rows[0];
  } catch (err) {
    await client.query("ROLLBACK");
    throw err; // 23503 = kategori tidak ada
  } finally {
    client.release();
  }
}

export async function listArtworksByUser(userId) {
  const rows = await query(
    `${ARTWORK_SELECT} WHERE a.user_id = $1 GROUP BY a.id, c.name ORDER BY a.created_at DESC`,
    [userId]
  );
  return rows;
}

// Hanya mengembalikan karya jika milik userId (kalau bukan: null)
export async function getOwnedArtwork(id, userId) {
  const rows = await query(
    `${ARTWORK_SELECT} WHERE a.id = $1 AND a.user_id = $2 GROUP BY a.id, c.name`,
    [id, userId]
  );
  return rows[0] ?? null;
}

// File karya TIDAK bisa diganti. Hanya judul, deskripsi, kategori, tags.
export async function updateArtwork(id, userId, { categoryId, title, description, tags }) {
  const client = await pool.connect();
  try {
    await client.query("BEGIN");
    const { rowCount } = await client.query(
      `UPDATE artworks SET category_id = $3, title = $4, description = $5
        WHERE id = $1 AND user_id = $2`,
      [id, userId, categoryId, title, description]
    );
    if (rowCount === 0) {
      await client.query("ROLLBACK");
      return null; // tidak ada / bukan milik user
    }
    await syncTags(client, id, tags);
    await client.query("COMMIT");
    return { id };
  } catch (err) {
    await client.query("ROLLBACK");
    throw err;
  } finally {
    client.release();
  }
}

// Mengembalikan file_url karya yang dihapus (untuk menghapus file fisik), atau null
export async function deleteArtwork(id, userId) {
  const rows = await query(
    `DELETE FROM artworks WHERE id = $1 AND user_id = $2 RETURNING file_url`,
    [id, userId]
  );
  return rows[0]?.file_url ?? null;
}