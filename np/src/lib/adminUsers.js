import { query } from "./db";
import { removeUploadedFile } from "./uploads";

const ROLES = ["admin", "member", "curator"];
const escapeLike = (text) => text.replace(/[\\%_]/g, "\\$&");

function buildUserFilters({ role, q }) {
  const where = [];
  const params = [];
  if (ROLES.includes(role)) {
    params.push(role);
    where.push(`u.role = $${params.length}`);
  }
  if (q) {
    params.push(`%${escapeLike(q)}%`);
    where.push(`(p.display_name ILIKE $${params.length} OR u.email ILIKE $${params.length})`);
  }
  return { clause: where.length ? `WHERE ${where.join(" AND ")}` : "", params };
}

// Daftar semua pengguna (Admin, Member, Curator) dengan filter peran dan pencarian
export async function listUsers({ role, q, limit = 20, offset = 0 } = {}) {
  const { clause, params } = buildUserFilters({ role, q });
  params.push(limit, offset);
  return query(
    `SELECT u.id, u.email, u.role, u.curator_status, u.created_at, p.display_name,
            (SELECT COUNT(*)::int FROM artworks a WHERE a.user_id = u.id) AS artwork_count
       FROM users u JOIN profiles p ON p.user_id = u.id
       ${clause}
      ORDER BY u.created_at DESC, u.id DESC
      LIMIT $${params.length - 1} OFFSET $${params.length}`,
    params
  );
}

export async function countUsers(filters = {}) {
  const { clause, params } = buildUserFilters(filters);
  const rows = await query(
    `SELECT COUNT(*)::int AS total FROM users u JOIN profiles p ON p.user_id = u.id ${clause}`,
    params
  );
  return rows[0].total;
}

export async function listCuratorsByStatus(status) {
  return query(
    `SELECT u.id, u.email, u.curator_status, u.created_at, p.display_name,
            (SELECT COUNT(*)::int FROM challenges c WHERE c.curator_id = u.id) AS challenge_count
       FROM users u JOIN profiles p ON p.user_id = u.id
      WHERE u.role = 'curator' AND u.curator_status = $1
      ORDER BY u.created_at ASC, u.id ASC`,
    [status]
  );
}

export async function countCuratorsByStatus() {
  const rows = await query(
    `SELECT curator_status, COUNT(*)::int AS total FROM users WHERE role = 'curator' GROUP BY curator_status`
  );
  const counts = { pending: 0, approved: 0, rejected: 0 };
  for (const row of rows) counts[row.curator_status] = row.total;
  return counts;
}

// Hanya Curator berstatus "pending" yang bisa diputuskan. Mengembalikan true jika berubah.
export async function updateCuratorStatus(userId, status) {
  if (!["approved", "rejected"].includes(status)) throw new Error("Status tidak valid.");
  const rows = await query(
    `UPDATE users SET curator_status = $2
      WHERE id = $1 AND role = 'curator' AND curator_status = 'pending'
      RETURNING id`,
    [userId, status]
  );
  return rows.length === 1;
}

// Admin hanya boleh menghapus Member dan Curator; bukan Admin lain dan bukan dirinya sendiri.
// Hasil: { status: "deleted" | "forbidden" | "not_found" }
export async function deleteUserAsAdmin(adminId, targetId) {
  const target = await query(`SELECT id, role FROM users WHERE id = $1`, [targetId]);
  if (!target[0]) return { status: "not_found" };
  if (target[0].role === "admin" || target[0].id === adminId) return { status: "forbidden" };

  // Catat file karya dulu: baris artworks ikut terhapus (CASCADE), file di disk tidak
  const files = await query(`SELECT file_url FROM artworks WHERE user_id = $1`, [targetId]);

  const deleted = await query(
    `DELETE FROM users WHERE id = $1 AND role IN ('member', 'curator') AND id <> $2 RETURNING id`,
    [targetId, adminId]
  );
  if (deleted.length === 0) return { status: "forbidden" };

  for (const file of files) await removeUploadedFile(file.file_url);
  return { status: "deleted" };
}