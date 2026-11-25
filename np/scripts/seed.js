const fs = require('fs');
const path = require('path');
const { Pool } = require('pg');

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

async function runSeed() {
  const sqlPath = path.join(process.cwd(), 'database', 'seed.sql');
  console.log('Menjalankan full seed dari:', sqlPath);

  const sql = fs.readFileSync(sqlPath, 'utf8');
  const client = await pool.connect();

  try {
    await client.query('BEGIN');
    await client.query(sql);
    await client.query('COMMIT');
    console.log('\nBerhasil menjalankan full seed database!');
  } catch (err) {
    await client.query('ROLLBACK');
    console.error('Gagal menjalankan seed:', err.message);
    process.exitCode = 1;
  } finally {
    client.release();
    await pool.end();
  }
}

runSeed();
