import { query } from "./db";

export async function listCategoriesWithCount() {
  const rows = await query(
    `SELECT c.id, c.name, COUNT(a.id)::int AS artwork_count
       FROM categories c
       LEFT JOIN artworks a ON a.category_id = c.id
      GROUP BY c.id
      ORDER BY LOWER(c.name)`
  );
  return rows;
}

// Melempar error kode 23505 jika nama sudah ada (case-insensitive)
export async function createCategory(name) {
  const rows = await query(
    `INSERT INTO categories (name) VALUES ($1) RETURNING id, name`,
    [name]
  );
  return rows[0];
}

// Mengembalikan null jika id tidak ditemukan. Error 23505 jika nama bentrok.
export async function renameCategory(id, name) {
  const rows = await query(
    `UPDATE categories SET name = $2 WHERE id = $1 RETURNING id, name`,
    [id, name]
  );
  return rows[0] ?? null;
}

// Kategori yang masih dipakai karya tidak boleh dihapus.
// Hasil: { status: "deleted" | "in_use" | "not_found", count? }
export async function deleteCategory(id) {
  try {
    const deletedRows = await query(
      `DELETE FROM categories c
        WHERE c.id = $1
          AND NOT EXISTS (SELECT 1 FROM artworks a WHERE a.category_id = c.id)
          RETURNING c.id`,
      [id]
    );
    if (deletedRows.length === 1) return { status: "deleted" };
  } catch (err) {
    if (err.code !== "23503") throw err; // 23503 = masih direferensikan (RESTRICT)
  }

  const rows= await query(
    `SELECT COUNT(*)::int AS count FROM artworks WHERE category_id = $1`,
    [id]
  );
  return rows[0].count > 0
    ? { status: "in_use", count: rows[0].count }
    : { status: "not_found" };
}


// Untuk dropdown kategori di form karya
export async function listCategories() {
  const rows = await query(`SELECT id, name FROM categories ORDER BY LOWER(name)`);
  return rows;
}