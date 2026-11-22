import { query } from "./db";

const STATUS_SQL = `CASE WHEN NOW() < c.start_date THEN 'upcoming'
                         WHEN NOW() > c.end_date THEN 'ended'
                         ELSE 'active' END`;

const CHALLENGE_SELECT = `
  SELECT c.id, c.title, c.description, c.rules, c.prize, c.banner_url,
         c.start_date, c.end_date, c.curator_id,
         ${STATUS_SQL} AS status,
         p.display_name AS curator_name,
         (SELECT COUNT(*)::int FROM submissions s WHERE s.challenge_id = c.id) AS submission_count
    FROM challenges c
    JOIN profiles p ON p.user_id = c.curator_id`;

// status: "active" | "upcoming" | "ended" | undefined (semua). Aktif tampil lebih dulu.
export async function listChallenges({ q, status, limit = 50 } = {}) {
  const where = [];
  const params = [];
  if (q) {
    params.push(`%${q.replace(/[\\%_]/g, "\\$&")}%`);
    where.push(`c.title ILIKE $${params.length}`);
  }
  if (["active", "upcoming", "ended"].includes(status)) {
    params.push(status);
    where.push(`(${STATUS_SQL}) = $${params.length}`);
  }
  params.push(limit);
  return query(
    `${CHALLENGE_SELECT}
     ${where.length ? `WHERE ${where.join(" AND ")}` : ""}
     ORDER BY CASE WHEN NOW() BETWEEN c.start_date AND c.end_date THEN 0
                   WHEN NOW() < c.start_date THEN 1 ELSE 2 END,
              c.end_date DESC
     LIMIT $${params.length}`,
    params
  );
}

export async function getChallenge(id) {
  const rows = await query(`${CHALLENGE_SELECT} WHERE c.id = $1`, [id]);
  return rows[0] ?? null;
}

// Karya yang disubmit ke challenge. Pemenang (rank 1-3) tampil lebih dulu.
export async function listChallengeSubmissions(challengeId) {
  return query(
    `SELECT s.id AS submission_id, s.rank, s.submitted_at,
            a.id, a.title, a.file_url,
            c.id AS category_id, c.name AS category_name,
            a.user_id AS creator_id, p.display_name AS creator_name,
            (SELECT COUNT(*)::int FROM likes l WHERE l.artwork_id = a.id) AS like_count
       FROM submissions s
       JOIN artworks a ON a.id = s.artwork_id
       JOIN categories c ON c.id = a.category_id
       JOIN profiles p ON p.user_id = a.user_id
      WHERE s.challenge_id = $1
      ORDER BY s.rank ASC NULLS LAST, s.submitted_at ASC`,
    [challengeId]
  );
}