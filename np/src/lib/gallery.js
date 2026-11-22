import { query } from "./db";

// Urutan dipilih dari daftar tetap (whitelist), bukan dari input user
const SORTS = {
  latest: "a.created_at DESC",
  popular: "like_count DESC, a.created_at DESC",
};

// Karakter khusus LIKE (% _ \) dari input user dianggap teks biasa
const escapeLike = (text) => text.replace(/[\\%_]/g, "\\$&");

const CARD_SELECT = `
  SELECT a.id, a.title, a.file_url, a.created_at,
         c.id AS category_id, c.name AS category_name,
         a.user_id AS creator_id, p.display_name AS creator_name,
         (SELECT COUNT(*)::int FROM likes l WHERE l.artwork_id = a.id) AS like_count
    FROM artworks a
    JOIN categories c ON c.id = a.category_id
    JOIN profiles p ON p.user_id = a.user_id`;

// Hanya placeholder ($1, $2, ...) yang disambung; nilai selalu lewat parameter
function buildFilters({ q, categoryId, tag, creatorId }) {
  const where = [];
  const params = [];
  if (q) {
    params.push(`%${escapeLike(q)}%`);
    where.push(`(a.title ILIKE $${params.length} OR p.display_name ILIKE $${params.length})`);
  }
  if (categoryId) {
    params.push(categoryId);
    where.push(`a.category_id = $${params.length}`);
  }
  if (tag) {
    params.push(tag);
    where.push(
      `EXISTS (SELECT 1 FROM artwork_tags x JOIN tags t ON t.id = x.tag_id
                WHERE x.artwork_id = a.id AND t.name = $${params.length})`
    );
  }
  if (creatorId) {
    params.push(creatorId);
    where.push(`a.user_id = $${params.length}`);
  }
  return { clause: where.length ? `WHERE ${where.join(" AND ")}` : "", params };
}

export async function listArtworks({
  q,
  categoryId,
  tag,
  creatorId,
  sort = "latest",
  limit = 12,
  offset = 0,
} = {}) {
  const { clause, params } = buildFilters({ q, categoryId, tag, creatorId });
  params.push(limit, offset);
  return query(
    `${CARD_SELECT} ${clause}
      ORDER BY ${SORTS[sort] ?? SORTS.latest}
      LIMIT $${params.length - 1} OFFSET $${params.length}`,
    params
  );
}

export async function countArtworks(filters = {}) {
  const { clause, params } = buildFilters(filters);
  const rows = await query(
    `SELECT COUNT(*)::int AS total
       FROM artworks a JOIN profiles p ON p.user_id = a.user_id ${clause}`,
    params
  );
  return rows[0].total;
}

// "Featured": karya dengan interaksi terbanyak (suka + 2 x favorit + komentar)
export async function listFeaturedArtworks(limit = 3) {
  return query(
    `${CARD_SELECT}
      ORDER BY ( (SELECT COUNT(*) FROM likes l WHERE l.artwork_id = a.id)
               + 2 * (SELECT COUNT(*) FROM favorites f WHERE f.artwork_id = a.id)
               + (SELECT COUNT(*) FROM comments m WHERE m.artwork_id = a.id) ) DESC,
               a.created_at DESC
      LIMIT $1`,
    [limit]
  );
}

// viewerId boleh null (Guest). Menghasilkan status liked/favorited/reported milik viewer.
export async function getArtworkDetail(id, viewerId = null) {
  const rows = await query(
    `SELECT a.id, a.title, a.description, a.file_url, a.created_at,
            a.user_id AS creator_id, p.display_name AS creator_name,
            c.id AS category_id, c.name AS category_name,
            COALESCE((SELECT ARRAY_AGG(t.name ORDER BY t.name)
                        FROM artwork_tags x JOIN tags t ON t.id = x.tag_id
                       WHERE x.artwork_id = a.id), '{}') AS tags,
            (SELECT COUNT(*)::int FROM likes l WHERE l.artwork_id = a.id) AS like_count,
            EXISTS (SELECT 1 FROM likes l WHERE l.artwork_id = a.id AND l.user_id = $2::int) AS liked,
            EXISTS (SELECT 1 FROM favorites f WHERE f.artwork_id = a.id AND f.user_id = $2::int) AS favorited,
            EXISTS (SELECT 1 FROM reports r WHERE r.artwork_id = a.id AND r.reporter_id = $2::int) AS reported
       FROM artworks a
       JOIN profiles p ON p.user_id = a.user_id
       JOIN categories c ON c.id = a.category_id
      WHERE a.id = $1`,
    [id, viewerId]
  );
  return rows[0] ?? null;
}

export async function listComments(artworkId) {
  return query(
    `SELECT m.id, m.content, m.created_at, m.user_id, p.display_name
       FROM comments m JOIN profiles p ON p.user_id = m.user_id
      WHERE m.artwork_id = $1
      ORDER BY m.created_at ASC`,
    [artworkId]
  );
}

// Hanya Member yang punya halaman kreator
export async function getCreator(id) {
  const rows = await query(
    `SELECT u.id, p.display_name, p.avatar_url, p.bio
       FROM users u JOIN profiles p ON p.user_id = u.id
      WHERE u.id = $1 AND u.role = 'member'`,
    [id]
  );
  if (!rows[0]) return null;
  const links = await query(
    `SELECT id, label, url FROM profile_links WHERE user_id = $1 ORDER BY id`,
    [id]
  );
  return { ...rows[0], links };
}