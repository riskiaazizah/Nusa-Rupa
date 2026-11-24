import { query } from "./db";

export async function getMemberSubmission(challengeId, userId) {
  const rows = await query(
    `SELECT s.id, s.rank, s.submitted_at, a.id AS artwork_id, a.title, a.file_url
       FROM submissions s JOIN artworks a ON a.id = s.artwork_id
      WHERE s.challenge_id = $1 AND s.user_id = $2`,
    [challengeId, userId]
  );
  return rows[0] ?? null;
}

// Portofolio Member untuk dipilih saat submit
export async function listOwnArtworksBrief(userId) {
  return query(
    `SELECT id, title, file_url FROM artworks WHERE user_id = $1 ORDER BY created_at DESC, id DESC`,
    [userId]
  );
}

// Riwayat submisi Member. can_withdraw dihitung oleh database (NOW() <= end_date).
export async function listMemberSubmissions(userId) {
  return query(
    `SELECT s.id, s.rank, s.submitted_at,
            c.id AS challenge_id, c.title AS challenge_title, c.end_date,
            CASE WHEN NOW() < c.start_date THEN 'upcoming'
                 WHEN NOW() > c.end_date THEN 'ended' ELSE 'active' END AS status,
            (NOW() <= c.end_date) AS can_withdraw,
            a.id AS artwork_id, a.title AS artwork_title, a.file_url
       FROM submissions s
       JOIN challenges c ON c.id = s.challenge_id
       JOIN artworks a ON a.id = s.artwork_id
      WHERE s.user_id = $1
      ORDER BY s.submitted_at DESC, s.id DESC`,
    [userId]
  );
}

// Submit hanya saat challenge AKTIF (NOW() di antara start_date dan end_date), dengan karya
// milik sendiri. Waktu dicek di database, bukan di browser.
// Hasil: { status: "created" | "already_submitted" | "challenge_not_found" |
//          "artwork_not_owned" | "not_started" | "ended" }
export async function submitArtwork(userId, challengeId, artworkId) {
  try {
    const rows = await query(
      `INSERT INTO submissions (challenge_id, artwork_id, user_id)
       SELECT c.id, a.id, $3
         FROM challenges c, artworks a
        WHERE c.id = $1 AND a.id = $2 AND a.user_id = $3
          AND NOW() BETWEEN c.start_date AND c.end_date
       RETURNING id`,
      [challengeId, artworkId, userId]
    );
    if (rows.length === 1) return { status: "created" };
  } catch (err) {
    // uq_sub_user: 1 Member hanya 1 submisi per challenge
    if (err.code === "23505") return { status: "already_submitted" };
    throw err;
  }

  // Tidak ada baris yang masuk: cari tahu alasannya untuk pesan yang jelas
  const challenge = await query(
    `SELECT NOW() < start_date AS not_started FROM challenges WHERE id = $1`,
    [challengeId]
  );
  if (!challenge[0]) return { status: "challenge_not_found" };
  const owned = await query(`SELECT 1 FROM artworks WHERE id = $1 AND user_id = $2`, [artworkId, userId]);
  if (owned.length === 0) return { status: "artwork_not_owned" };
  return { status: challenge[0].not_started ? "not_started" : "ended" };
}

// Withdraw hanya selama challenge belum berakhir (NOW() <= end_date), dan hanya submisi sendiri.
// Hasil: { status: "withdrawn" | "ended" | "not_submitted" }
export async function withdrawSubmission(userId, challengeId) {
  const rows = await query(
    `DELETE FROM submissions s USING challenges c
      WHERE s.challenge_id = c.id AND s.challenge_id = $1 AND s.user_id = $2
        AND NOW() <= c.end_date
      RETURNING s.id`,
    [challengeId, userId]
  );
  if (rows.length === 1) return { status: "withdrawn" };

  const exists = await query(`SELECT 1 FROM submissions WHERE challenge_id = $1 AND user_id = $2`, [
    challengeId,
    userId,
  ]);
  return { status: exists.length > 0 ? "ended" : "not_submitted" };
}
