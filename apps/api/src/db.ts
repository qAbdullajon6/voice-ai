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
    CREATE TABLE IF NOT EXISTS user_devices (
      id UUID PRIMARY KEY,
      user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
      name TEXT,
      platform TEXT,
      user_agent TEXT,
      ip TEXT,
      refresh_token_hash TEXT,
      created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
      last_used_at TIMESTAMPTZ NOT NULL DEFAULT now(),
      revoked_at TIMESTAMPTZ
    );
  `);

  await pool.query(
    `CREATE INDEX IF NOT EXISTS idx_user_devices_user_created ON user_devices(user_id, created_at DESC);`,
  );

  await pool.query(
    `CREATE UNIQUE INDEX IF NOT EXISTS idx_user_devices_refresh_hash_unique ON user_devices(refresh_token_hash) WHERE refresh_token_hash IS NOT NULL;`,
  );

  await pool.query(`
    CREATE TABLE IF NOT EXISTS library_voice_previews (
      id TEXT PRIMARY KEY,
      title TEXT NOT NULL,
      subtitle TEXT NOT NULL,
      audio_url TEXT NOT NULL,
      hue INTEGER NOT NULL DEFAULT 0,
      rotate INTEGER NOT NULL DEFAULT 0,
      created_at TIMESTAMPTZ NOT NULL DEFAULT now()
    );
  `);

  await pool.query(
    `CREATE INDEX IF NOT EXISTS idx_library_voice_previews_created ON library_voice_previews(created_at DESC);`,
  );

  // Seed a few “Latest from the library” previews (only if empty)
  const seedCount = await pool.query(`SELECT COUNT(*)::int AS c FROM library_voice_previews;`);
  if ((seedCount.rows?.[0]?.c ?? 0) === 0) {
    await pool.query(
      `
      INSERT INTO library_voice_previews (id, title, subtitle, audio_url, hue, rotate)
      VALUES
        ('nichalia', 'Nichalia Schwartz - Bright and Friendly', 'Friendly · intelligent · engaging 20s-30s female voice', 'https://storage.googleapis.com/eleven-public-prod/database/workspace/f0453fa76e4e4a1e973d87b70665a591/voices/oTQK6KgOJHp8UGGZjwUu/9eL1qqR6cA7foybjcdH5.mp3', 116, 116),
        ('matt', 'Matt', 'A 24-year-old American male with a voice perfect for faceless videos.', 'https://storage.googleapis.com/eleven-public-prod/database/workspace/f0453fa76e4e4a1e973d87b70665a591/voices/oTQK6KgOJHp8UGGZjwUu/9eL1qqR6cA7foybjcdH5.mp3', 28, 28),
        ('mark-natural', 'Mark - Natural Conversations', 'A casual, young-adult speaking in a natural manner. Perfect for...', 'https://storage.googleapis.com/eleven-public-prod/database/workspace/f0453fa76e4e4a1e973d87b70665a591/voices/oTQK6KgOJHp8UGGZjwUu/9eL1qqR6cA7foybjcdH5.mp3', 210, 210),
        ('adam-direct', 'Adam - Confident, Clear and Direct', 'Adam · A New Englander.', 'https://storage.googleapis.com/eleven-public-prod/database/workspace/f0453fa76e4e4a1e973d87b70665a591/voices/oTQK6KgOJHp8UGGZjwUu/9eL1qqR6cA7foybjcdH5.mp3', 265, 265),
        ('claire-narrator', 'Claire - Rhythmic and Clear Narrator', 'Claire · Classic British RP, soft, warm and confident storyteller.', 'https://storage.googleapis.com/eleven-public-prod/database/workspace/f0453fa76e4e4a1e973d87b70665a591/voices/oTQK6KgOJHp8UGGZjwUu/9eL1qqR6cA7foybjcdH5.mp3', 320, 320)
      ON CONFLICT (id) DO NOTHING;
      `,
    );
  }

  // Normalize blocked third-party preview links to a known playable URL (idempotent).
  const fallbackLibraryPreviewUrl =
    'https://storage.googleapis.com/eleven-public-prod/database/workspace/f0453fa76e4e4a1e973d87b70665a591/voices/oTQK6KgOJHp8UGGZjwUu/9eL1qqR6cA7foybjcdH5.mp3';
  await pool.query(
    `
    UPDATE library_voice_previews
    SET audio_url = $1
    WHERE id IN ('nichalia','matt','mark-natural','adam-direct','claire-narrator')
      AND (
        audio_url IS NULL
        OR audio_url = ''
        OR audio_url ILIKE '%learnoutloud.com%'
      );
    `,
    [fallbackLibraryPreviewUrl],
  );

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
