const fs = require("fs").promises;
const path = require("path");
const { Pool } = require("pg");
require("dotenv").config();

// Konfigurasi database dari environment variables
const pool = new Pool({
  user: process.env.DB_USER,
  host: process.env.DB_HOST,
  database: process.env.DB_NAME,
  password: process.env.DB_PASSWORD,
  port: process.env.DB_PORT,
});

async function runMigration() {
  const client = await pool.connect();

  try {
    // Buat tabel migrations jika belum ada
    await client.query(`
      CREATE TABLE IF NOT EXISTS migrations (
        id SERIAL PRIMARY KEY,
        name VARCHAR(255) NOT NULL UNIQUE,
        executed_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    `);

    // Baca semua file migrasi
    const migrationsDir = path.join(__dirname, "migrations");
    const files = await fs.readdir(migrationsDir);

    // Filter file SQL dan urutkan berdasarkan nama
    const migrationFiles = files.filter((f) => f.endsWith(".sql")).sort();

    // Mulai transaksi
    await client.query("BEGIN");

    for (const file of migrationFiles) {
      // Cek apakah migrasi sudah dijalankan
      const { rows } = await client.query("SELECT name FROM migrations WHERE name = $1", [file]);

      if (rows.length === 0) {
        console.log(`Running migration: ${file}`);

        // Baca dan jalankan file migrasi
        const sql = await fs.readFile(path.join(migrationsDir, file), "utf-8");

        await client.query(sql);

        // Catat migrasi yang sudah dijalankan
        await client.query("INSERT INTO migrations (name) VALUES ($1)", [file]);

        console.log(`Migration completed: ${file}`);
      } else {
        console.log(`Skipping migration ${file} - already executed`);
      }
    }

    // Commit transaksi
    await client.query("COMMIT");
    console.log("All migrations completed successfully!");
  } catch (error) {
    // Rollback jika terjadi error
    await client.query("ROLLBACK");
    console.error("Error running migrations:", error);
    throw error;
  } finally {
    client.release();
    await pool.end();
  }
}

// Jalankan migrasi
runMigration().catch(console.error);
