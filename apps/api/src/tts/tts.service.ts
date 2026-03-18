import {
  BadRequestException,
  Injectable,
  Logger,
  ServiceUnavailableException,
} from '@nestjs/common';
import { randomUUID } from 'crypto';
import { TtsQueue, TtsJob } from './tts.queue';
import { pool } from '../db';

type TtsRequest = {
  text: string;
  voice?: string;
  output_format?: string;
  model_id?: string;
  settings?: Record<string, unknown>;
};

@Injectable()
export class TtsService {
  private readonly logger = new Logger(TtsService.name);
  private readonly queue = new TtsQueue();

  async preview(userId: string, payload: TtsRequest) {
    return this.generate(userId, {
      ...payload,
      settings: { ...(payload.settings ?? {}), preview: true },
    });
  }

  async generate(userId: string, payload: TtsRequest) {
    if (!payload?.text || !payload.text.trim()) {
      throw new BadRequestException('text is required');
    }
    const now = new Date().toISOString();
    const job: TtsJob = {
      id: randomUUID(),
      text: payload.text,
      voice: payload.voice,
      output_format: payload.output_format,
      status: 'queued',
      created_at: now,
      updated_at: now,
    };

    try {
      await pool.query(
        `
      INSERT INTO tts_generations
        (id, user_id, text, voice_id, model_id, output_format, settings, status, created_at, updated_at)
      VALUES
        ($1, $2, $3, $4, $5, $6, $7::jsonb, $8, $9::timestamptz, $9::timestamptz)
      `,
        [
          job.id,
          userId,
          payload.text,
          payload.voice ?? null,
          payload.model_id ?? null,
          payload.output_format ?? null,
          JSON.stringify(payload.settings ?? {}),
          job.status,
          now,
        ],
      );
    } catch (err) {
      this.logger.error('Database error in TTS generate', err);
      const code =
        err && typeof err === 'object' && 'code' in err
          ? String((err as { code: string }).code)
          : '';
      if (code === '23503') {
        throw new BadRequestException(
          'Foydalanuvchi bazada topilmadi. Qayta tizimga kiring (logout / login).',
        );
      }
      throw new ServiceUnavailableException(
        'Database unavailable. Render da DATABASE_URL (Internal Database URL) qo‘shing yoki POSTGRES_* va SSL ni tekshiring.',
      );
    }

    try {
      await this.queue.enqueue(job);
    } catch (err) {
      this.logger.error('Redis/queue error in TTS generate', err);
      throw new ServiceUnavailableException(
        'Queue unavailable. Check REDIS_URL and that Redis is running.',
      );
    }

    return { id: job.id, status: job.status };
  }

  async getJob(userId: string, id: string) {
    const redisJob = await this.queue.getJob(id);
    const dbRes = await pool.query<{
      id: string;
      user_id: string;
      text: string;
      voice_id: string | null;
      model_id: string | null;
      output_format: string | null;
      settings: unknown;
      status: string;
      audio_url: string | null;
      error: string | null;
      created_at: string;
      updated_at: string;
    }>('SELECT * FROM tts_generations WHERE id = $1 AND user_id = $2', [
      id,
      userId,
    ]);
    const dbRow = dbRes.rowCount ? dbRes.rows[0] : null;

    if (!redisJob && !dbRow) return null;

    // If worker has updated Redis to a final state, persist it in DB.
    if (redisJob && dbRow) {
      const final =
        redisJob.status === 'done' ||
        redisJob.status === 'failed' ||
        redisJob.status === 'processing';
      if (final && dbRow.status !== redisJob.status) {
        await pool.query(
          'UPDATE tts_generations SET status = $1, audio_url = $2, error = $3, updated_at = now() WHERE id = $4 AND user_id = $5',
          [
            redisJob.status,
            redisJob.url ?? null,
            redisJob.error ?? null,
            id,
            userId,
          ],
        );
      }
    }

    return {
      id,
      text: dbRow?.text ?? redisJob?.text,
      voice: dbRow?.voice_id ?? redisJob?.voice,
      model_id: dbRow?.model_id ?? null,
      output_format: dbRow?.output_format ?? redisJob?.output_format,
      settings: dbRow?.settings ?? {},
      status: (redisJob?.status ?? dbRow?.status) as
        | 'queued'
        | 'processing'
        | 'done'
        | 'failed',
      url: redisJob?.url ?? dbRow?.audio_url ?? undefined,
      error: redisJob?.error ?? dbRow?.error ?? undefined,
      created_at: redisJob?.created_at ?? dbRow?.created_at,
      updated_at: redisJob?.updated_at ?? dbRow?.updated_at,
    };
  }

  async history(userId: string, limit: number, cursor?: string) {
    const safeLimit = Math.max(1, Math.min(50, limit || 20));
    let after: { created_at: string; id: string } | null = null;
    if (cursor) {
      try {
        const parsed: unknown = JSON.parse(
          Buffer.from(cursor, 'base64url').toString(),
        );
        if (
          parsed &&
          typeof parsed === 'object' &&
          'created_at' in parsed &&
          'id' in parsed &&
          typeof (parsed as Record<string, unknown>).created_at === 'string' &&
          typeof (parsed as Record<string, unknown>).id === 'string'
        ) {
          after = parsed as { created_at: string; id: string };
        } else {
          after = null;
        }
      } catch {
        after = null;
      }
    }

    const params: Array<string | number> = [userId, safeLimit];
    let where =
      "WHERE user_id = $1 AND COALESCE((settings->>'preview')::boolean, false) = false";
    if (after?.created_at && after?.id) {
      params.push(after.created_at, after.id);
      where += ' AND (created_at, id) < ($3::timestamptz, $4::uuid)';
    }

    const res = await pool.query<{
      id: string;
      text: string;
      voice_id: string | null;
      model_id: string | null;
      output_format: string | null;
      settings: unknown;
      status: string;
      audio_url: string | null;
      error: string | null;
      created_at: string;
      updated_at: string;
    }>(
      `
      SELECT id, text, voice_id, model_id, output_format, settings, status, audio_url, error, created_at, updated_at
      FROM tts_generations
      ${where}
      ORDER BY created_at DESC, id DESC
      LIMIT $2
      `,
      params,
    );

    const items = res.rows;
    const next =
      items.length === safeLimit
        ? (() => {
            const last = items[items.length - 1];
            return Buffer.from(
              JSON.stringify({
                created_at: last.created_at,
                id: last.id,
              }),
            ).toString('base64url');
          })()
        : null;

    return { items, nextCursor: next };
  }
}
