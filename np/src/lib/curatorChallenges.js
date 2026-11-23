import { pool, query } from "./db";

const STATUS_SQL = `CASE WHEN NOW() < c.start_date THEN 'upcoming'
                         WHEN NOW() > c.end_date THEN 'ended'
                         ELSE 'active' END`;

const OWN_SELECT = `
  SELECT c.id, c.title, c.description, c.rules, c.prize, c.banner_url,
         c.start_date, c.end_date, c.created_at,
         ${STATUS_SQL} AS status,
         (SELECT COUNT(*)::int FROM submissions s WHERE s.challenge_id = c.id) AS submission_count,
         (SELECT COUNT(*)::int FROM submissions s WHERE s.challenge_id = c.id AND s.rank IS NOT NULL) AS winner_count
    FROM challenges c`;

// Semua query di bawah memakai curator_id: Curator hanya bisa mengelola challenge miliknya
export async function listOwnChallenges(curatorId) {
  return query(`${OWN_SELECT} WHERE c.curator_id = $1 ORDER BY c.created_at DESC, c.id DESC`, [curatorId]);
}

export async function getOwnChallenge(id, curatorId) {
  const rows = await query(`${OWN_SELECT} WHERE c.id = $1 AND c.curator_id = $2`, [id, curatorId]);
  return rows[0] ?? null;
}

export async function createChallenge(curatorId, data, bannerUrl) {
  const rows = await query(
    `INSERT INTO challenges (curator_id, title, description, rules, prize, start_date, end_date, banner_url)
     VALUES ($1, $2, $3, $4, $5, $6, $7, $8) RETURNING id`,
    [curatorId, data.title, data.description, data.rules, data.prize, data.startDate, data.endDate, bannerUrl]
  );
  return rows[0];
}

// newBannerUrl boleh null (banner lama dipertahankan).
// Hasil: { status: "updated", oldBannerUrl } | { status: "not_found" } | { status: "dates_locked" }
// Setelah pemenang dipilih, tanggal dikunci agar challenge tidak "hidup kembali".
export async function updateChallenge(id, curatorId, data, newBannerUrl) {
  const client = await pool.connect();
  try {
    await client.query("BEGIN");
    const { rows } = await client.query(
      `SELECT c.start_date, c.end_date, c.banner_url,
              (SELECT COUNT(*)::int FROM submissions s WHERE s.challenge_id = c.id AND s.rank IS NOT NULL) AS winners
         FROM challenges c WHERE c.id = $1 AND c.curator_id = $2 FOR UPDATE`,
      [id, curatorId]
    );
    const current = rows[0];
    if (!current) {
      await client.query("ROLLBACK");
      return { status: "not_found" };
    }

    // Form hanya mengirim tanggal sampai menit, sedangkan data lama bisa memuat detik.
    // Karena itu dibandingkan per menit, dan timestamp asli dipertahankan bila tidak berubah.
    const minute = (value) => Math.floor(new Date(value).getTime() / 60000);
    const sameStart = minute(current.start_date) === minute(data.startDate);
    const sameEnd = minute(current.end_date) === minute(data.endDate);
    if (current.winners > 0 && (!sameStart || !sameEnd)) {
      await client.query("ROLLBACK");
      return { status: "dates_locked" };
    }
    // null = tanggal tidak berubah: kolom tidak ditulis ulang (JavaScript Date hanya
    // setajam milidetik, sedangkan PostgreSQL menyimpan mikrodetik)
    const startDate = sameStart ? null : data.startDate;
    const endDate = sameEnd ? null : data.endDate;

    await client.query(
      `UPDATE challenges
          SET title = $3, description = $4, rules = $5, prize = $6,
              start_date = COALESCE($7::timestamptz, start_date),
              end_date = COALESCE($8::timestamptz, end_date),
              banner_url = COALESCE($9, banner_url)
        WHERE id = $1 AND curator_id = $2`,
      [id, curatorId, data.title, data.description, data.rules, data.prize, startDate, endDate, newBannerUrl]
    );
    await client.query("COMMIT");
    return { status: "updated", oldBannerUrl: newBannerUrl ? current.banner_url : null };
  } catch (err) {
    await client.query("ROLLBACK");
    throw err;
  } finally {
    client.release();
  }
}

// Mengembalikan { bannerUrl } jika terhapus (submisi ikut terhapus lewat CASCADE), atau null
export async function deleteChallenge(id, curatorId) {
  const rows = await query(
    `DELETE FROM challenges WHERE id = $1 AND curator_id = $2 RETURNING banner_url`,
    [id, curatorId]
  );
  return rows[0] ? { bannerUrl: rows[0].banner_url } : null;
}

// Menetapkan pemenang sekaligus (atomik). picks = [id submisi Juara 1, Juara 2, Juara 3],
// entri kosong = null. Waktu dicek di DATABASE (NOW() > end_date), bukan di browser.
// Hasil: { status: "ok" | "not_found" | "not_ended" | "invalid_submission" }
export async function setWinners(challengeId, curatorId, picks) {
  const client = await pool.connect();
  try {
    await client.query("BEGIN");
    const { rows } = await client.query(
      `SELECT NOW() > end_date AS ended FROM challenges WHERE id = $1 AND curator_id = $2 FOR UPDATE`,
      [challengeId, curatorId]
    );
    if (!rows[0]) {
      await client.query("ROLLBACK");
      return { status: "not_found" };
    }
    if (!rows[0].ended) {
      await client.query("ROLLBACK");
      return { status: "not_ended" };
    }

    const chosen = picks.filter((p) => p !== null);
    const valid = await client.query(
      `SELECT id FROM submissions WHERE challenge_id = $1 AND id = ANY($2::int[])`,
      [challengeId, chosen]
    );
    if (valid.rowCount !== chosen.length) {
      await client.query("ROLLBACK");
      return { status: "invalid_submission" };
    }

    // Kosongkan dulu lalu isi ulang, supaya menukar peringkat tidak bentrok dengan unique index
    await client.query(`UPDATE submissions SET rank = NULL WHERE challenge_id = $1`, [challengeId]);
    for (let i = 0; i < picks.length; i++) {
      if (picks[i] === null) continue;
      await client.query(`UPDATE submissions SET rank = $1 WHERE id = $2 AND challenge_id = $3`, [
        i + 1,
        picks[i],
        challengeId,
      ]);
    }
    await client.query("COMMIT");
    return { status: "ok" };
  } catch (err) {
    await client.query("ROLLBACK");
    throw err;
  } finally {
    client.release();
  }
}