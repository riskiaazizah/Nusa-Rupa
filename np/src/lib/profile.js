import { pool, query } from "./db";

export async function getOwnProfile(userId) {
  const rows = await query(
    `SELECT display_name, avatar_url, bio FROM profiles WHERE user_id = $1`,
    [userId]
  );
  if (!rows[0]) return null;
  const links = await query(`SELECT label, url FROM profile_links WHERE user_id = $1 ORDER BY id`, [userId]);
  return { ...rows[0], links };
}

// Selalu memakai userId dari sesi (bukan dari form), jadi hanya bisa mengubah profil sendiri.
// newAvatarUrl: foto baru (atau null). removeAvatar: hapus foto lama tanpa mengganti.
// Mengembalikan { oldAvatarUrl } = foto lama yang harus dihapus dari disk (atau null).
export async function updateProfile(userId, { displayName, bio, links }, { newAvatarUrl, removeAvatar }) {
  const client = await pool.connect();
  try {
    await client.query("BEGIN");
    const { rows } = await client.query(
      `SELECT avatar_url FROM profiles WHERE user_id = $1 FOR UPDATE`,
      [userId]
    );
    if (!rows[0]) {
      await client.query("ROLLBACK");
      return null;
    }
    const oldAvatar = rows[0].avatar_url;
    const avatar = newAvatarUrl ?? (removeAvatar ? null : oldAvatar);

    await client.query(
      `UPDATE profiles SET display_name = $2, bio = $3, avatar_url = $4 WHERE user_id = $1`,
      [userId, displayName, bio, avatar]
    );
    await client.query(`DELETE FROM profile_links WHERE user_id = $1`, [userId]);
    for (const link of links) {
      await client.query(`INSERT INTO profile_links (user_id, label, url) VALUES ($1, $2, $3)`, [
        userId,
        link.label,
        link.url,
      ]);
    }
    await client.query("COMMIT");
    return { oldAvatarUrl: newAvatarUrl || removeAvatar ? oldAvatar : null };
  } catch (err) {
    await client.query("ROLLBACK");
    throw err;
  } finally {
    client.release();
  }
}
