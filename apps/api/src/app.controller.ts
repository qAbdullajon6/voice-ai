import { Controller, Get } from '@nestjs/common';
import { AppService } from './app.service';
import { pool } from './db';
import Redis from 'ioredis';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get()
  getHello(): string {
    return this.appService.getHello();
  }

  /** Server va xizmatlar holati (DB, Redis). Debug uchun. */
  @Get('health')
  async health(): Promise<{
    ok: boolean;
    db: 'ok' | 'error';
    redis: 'ok' | 'error';
    error?: string;
  }> {
    let db: 'ok' | 'error' = 'error';
    let redis: 'ok' | 'error' = 'error';
    let error: string | undefined;

    try {
      await pool.query('SELECT 1');
      db = 'ok';
    } catch (e) {
      error = (e instanceof Error ? e.message : String(e)) || 'DB connection failed';
    }

    const redisUrl = process.env.REDIS_URL ?? 'redis://127.0.0.1:6379/0';
    try {
      const client = new Redis(redisUrl, { maxRetriesPerRequest: 1, lazyConnect: true });
      await client.connect();
      await client.ping();
      await client.quit();
      redis = 'ok';
    } catch (e) {
      if (!error) error = (e instanceof Error ? e.message : String(e)) || 'Redis connection failed';
    }

    return {
      ok: db === 'ok' && redis === 'ok',
      db,
      redis,
      ...(error && { error }),
    };
  }
}
