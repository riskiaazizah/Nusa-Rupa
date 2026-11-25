const fs = require('fs');
const path = require('path');
const { Pool } = require('pg');

// 1. Muat environment variable dari .env.local atau .env
const envLocal = path.join(process.cwd(), '.env.local');
const envDefault = path.join(process.cwd(), '.env');

if (fs.existsSync(envLocal)) {
  process.loadEnvFile(envLocal);
} else if (fs.existsSync(envDefault)) {
  process.loadEnvFile(envDefault);
}

if (!process.env.DATABASE_URL) {
  console.error('Error: DATABASE_URL tidak ditemukan di .env.local atau .env');
  process.exit(1);
}

const pool = new Pool({ connectionString: process.env.DATABASE_URL });

async function runSeedArtworks() {
  const sqlPath = path.join(process.cwd(), 'database', 'seed_artworks.sql');
  console.log('Menjalankan seed artworks dari:', sqlPath);

  const sql = fs.readFileSync(sqlPath, 'utf8');
  const client = await pool.connect();

  try {
    await client.query('BEGIN');
    await client.query(sql);
    await client.query('COMMIT');

    const res = await client.query('SELECT id, title, file_url FROM artworks ORDER BY id ASC');
    console.log('\nBerhasil melakukan seed artworks! Total:', res.rows.length, 'karya.');
    console.table(res.rows);
  } catch (err) {
    await client.query('ROLLBACK');
    console.error('Gagal menjalankan seed artworks:', err.message);
    process.exitCode = 1;
  } finally {
    client.release();
    await pool.end();
  }
}

runSeedArtworks();
