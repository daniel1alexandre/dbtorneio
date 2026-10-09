require('dotenv').config();
const fs = require('fs');
const path = require('path');
const { Pool } = require('pg');

async function run() {
  const pool = new Pool({
    connectionString: process.env.DATABASE_URL,
    ssl: { rejectUnauthorized: false } // Required for Supabase
  });

  try {
    const sqlPath = path.join(__dirname, 'src', 'database', 'migrations', '001_initial_schema.sql');
    const sql = fs.readFileSync(sqlPath, 'utf8');

    console.log('Connecting to Supabase...');
    const client = await pool.connect();
    
    console.log('Running migration script...');
    await client.query(sql);

    console.log('Migration completed successfully!');
    client.release();
  } catch (error) {
    console.error('Error running migration:', error.message);
  } finally {
    await pool.end();
  }
}

run();
