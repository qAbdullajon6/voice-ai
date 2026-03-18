import { Pool } from 'pg';
import { config as loadEnv } from 'dotenv';
import { resolve } from 'path';

loadEnv({ path: resolve(__dirname, '..', '..', '..', '.env') });

const connectionString = process.env.DATABASE_URL;
const sslRequired =
  process.env.PGSSLMODE === 'require' || process.env.NODE_ENV === 'production';

const pool = connectionString
  ? new Pool({
      connectionString,
      ssl: sslRequired ? { rejectUnauthorized: false } : undefined,
    })
  : new Pool({
      host: process.env.POSTGRES_HOST ?? '127.0.0.1',
      port: Number(process.env.POSTGRES_PORT ?? 5432),
      user: process.env.POSTGRES_USER ?? 'postgres',
      password: process.env.POSTGRES_PASSWORD ?? 'password',
      database: process.env.POSTGRES_DB ?? 'voiceai',
      ssl: sslRequired ? { rejectUnauthorized: false } : undefined,
    });

export async function initDb() {
  await pool.query(`
    CREATE TABLE IF NOT EXISTS users (
      id UUID PRIMARY KEY,
      email TEXT UNIQUE NOT NULL,
      name TEXT,
      password_hash TEXT,
      created_at TIMESTAMPTZ NOT NULL DEFAULT now()
    );
  `);

  await pool.query(`
    CREATE TABLE IF NOT EXISTS tts_generations (
      id UUID PRIMARY KEY,
      user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
      text TEXT NOT NULL,
      voice_id TEXT,
      model_id TEXT,
      output_format TEXT,
      settings JSONB,
      status TEXT NOT NULL,
      audio_url TEXT,
      error TEXT,
      created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
      updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
    );
  `);

  await pool.query(
    `CREATE INDEX IF NOT EXISTS idx_tts_generations_user_created ON tts_generations(user_id, created_at DESC);`,
  );
}

export { pool };
