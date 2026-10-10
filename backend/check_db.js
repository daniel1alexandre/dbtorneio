require('dotenv').config({ path: './.env' });
const { Pool } = require('pg');

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: { rejectUnauthorized: false }
});

async function run() {
  try {
    const res = await pool.query(`SELECT id, nome, email, tipo_usuario FROM USUARIOS`);
    console.log('USUARIOS:', res.rows);
    const res2 = await pool.query(`SELECT * FROM ATLETAS`);
    console.log('ATLETAS:', res2.rows);
  } catch (err) {
    console.error('Error:', err);
  } finally {
    pool.end();
  }
}

run();
