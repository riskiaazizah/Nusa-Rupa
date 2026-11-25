import bcrypt from "bcryptjs";
import { pool, query } from "./db";

// Hash palsu untuk menyamakan waktu respons saat email tidak ditemukan
const DUMMY_HASH = "$2b$10$U.iSyxBzXLIKGvcMVio9Ge5wDpIJwLz7SZiz065/6OGA2YIlXFsEy";

export async function findUserByEmail(email) {
  const rows = await query(
    `SELECT u.id, u.email, u.password_hash, u.role, u.curator_status, p.display_name
       FROM users u
       JOIN profiles p ON p.user_id = u.id
      WHERE u.email = $1`,
    [email]
  );
  return rows[0] ?? null;
}

// Mengembalikan user (tanpa password_hash) jika kredensial benar, selain itu null
export async function verifyCredentials(email, password) {
  const user = await findUserByEmail(email);
  if (!user) {
    await bcrypt.compare(password, DUMMY_HASH);
    return null;
  }
  const match = await bcrypt.compare(password, user.password_hash);
  if (!match) return null;
  const { password_hash, ...safeUser } = user;
  return safeUser;
}

// Register hanya untuk member dan curator. Admin dibuat lewat seed.
export async function createUser({ role, displayName, email, password }) {
  if (!["member", "curator"].includes(role)) throw new Error("Role tidak valid.");

  const passwordHash = await bcrypt.hash(password, 10);
  const status = role === "curator" ? "pending" : null;

  const client = await pool.connect();
  try {
    await client.query("BEGIN");
    const { rows } = await client.query(
      `INSERT INTO users (email, password_hash, role, curator_status)
       VALUES ($1, $2, $3, $4)
       RETURNING id, email, role, curator_status`,
      [email, passwordHash, role, status]
    );
    await client.query(
      `INSERT INTO profiles (user_id, display_name) VALUES ($1, $2)`,
      [rows[0].id, displayName]
    );
    await client.query("COMMIT");
    return rows[0];
  } catch (err) {
    await client.query("ROLLBACK");
    throw err; // kode 23505 = email sudah terdaftar
  } finally {
    client.release();
  }
}

// Reset password pengguna berdasarkan userId
export async function resetUserPassword(userId, newPassword) {
  const passwordHash = await bcrypt.hash(newPassword, 10);
  await query(`UPDATE users SET password_hash = $1 WHERE id = $2`, [passwordHash, userId]);
  return true;
}