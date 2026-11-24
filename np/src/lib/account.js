import bcrypt from "bcryptjs";
import { query } from "./db";

// Ganti email dan/atau password milik userId (dari sesi). Password saat ini diverifikasi dulu.
// Hasil: { status: "ok" | "wrong_password" | "no_change" | "email_taken" | "not_found" }
export async function changeAccount(userId, { currentPassword, newEmail, newPassword }) {
  const rows = await query(`SELECT email, password_hash FROM users WHERE id = $1`, [userId]);
  if (!rows[0]) return { status: "not_found" };

  const match = await bcrypt.compare(currentPassword, rows[0].password_hash);
  if (!match) return { status: "wrong_password" };

  const email = newEmail && newEmail !== rows[0].email ? newEmail : null;
  const hash = newPassword ? await bcrypt.hash(newPassword, 10) : null;
  if (!email && !hash) return { status: "no_change" };

  try {
    await query(
      `UPDATE users SET email = COALESCE($2, email), password_hash = COALESCE($3, password_hash)
        WHERE id = $1`,
      [userId, email, hash]
    );
  } catch (err) {
    if (err.code === "23505") return { status: "email_taken" }; // email sudah dipakai akun lain
    throw err;
  }
  return { status: "ok" };
}
