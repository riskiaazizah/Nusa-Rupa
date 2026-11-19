import { Pool } from "pg";

const globalForPg = globalThis;

export const pool =
  globalForPg.pgPool ?? new Pool({ connectionString: process.env.DATABASE_URL });

if (process.env.NODE_ENV !== "production") globalForPg.pgPool = pool;

// Cara pakai: await query("SELECT * FROM users WHERE id = $1", [id])
export async function query(text, params = []) {
  const res = await pool.query(text, params);
  return res.rows;
}