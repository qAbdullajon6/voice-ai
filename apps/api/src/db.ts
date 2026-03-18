import { Pool } from 'pg';
import { config as loadEnv } from 'dotenv';
import { resolve } from 'path';

loadEnv({ path: resolve(__dirname, '..', '..', '..', '.env') });

function resolveConnectionString(): string | null {
  const direct = process.env.DATABASE_URL?.trim();
  if (direct) return direct;

  const host = process.env.POSTGRES_HOST?.trim();
  const user = process.env.POSTGRES_USER?.trim();
  const password = process.env.POSTGRES_PASSWORD ?? '';
  const port = process.env.POSTGRES_PORT ?? '5432';
  const database = process.env.POSTGRES_DB?.trim();
  if (host && user && database) {
    const u = encodeURIComponent(user);
    const p = encodeURIComponent(String(password));
    return `postgresql://${u}:${p}@${host}:${port}/${database}?sslmode=require`;
  }
  return null;
}

const isProduction =
  process.env.NODE_ENV === 'production' ||
  process.env.RENDER === 'true' ||
  process.env.PGSSLMODE === 'require';

const connectionString = resolveConnectionString();

const pool = connectionString
  ? new Pool({
      connectionString,
      max: 10,
      idleTimeoutMillis: 30000,
      connectionTimeoutMillis: 15000,
      ssl: isProduction ? { rejectUnauthorized: false } : undefined,
    })
  : new Pool({
      host: process.env.POSTGRES_HOST ?? '127.0.0.1',
      port: Number(process.env.POSTGRES_PORT ?? 5432),
      user: process.env.POSTGRES_USER ?? 'postgres',
      password: process.env.POSTGRES_PASSWORD ?? 'password',
      database: process.env.POSTGRES_DB ?? 'voiceai',
      max: 10,
      ssl: isProduction ? { rejectUnauthorized: false } : undefined,
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
