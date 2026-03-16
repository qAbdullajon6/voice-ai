import Redis from 'ioredis';

export type TtsJob = {
  id: string;
  text: string;
  voice?: string;
  output_format?: string;
  status: 'queued' | 'processing' | 'done' | 'failed';
  url?: string;
  error?: string;
  created_at: string;
  updated_at: string;
};

export class TtsQueue {
  private readonly redis = new Redis(
    process.env.REDIS_URL ?? 'redis://127.0.0.1:6379/0',
  );
  private readonly queueKey = 'tts:queue';

  async enqueue(job: TtsJob) {
    const key = this.jobKey(job.id);
    const mapping: Record<string, string> = {};
    for (const [k, v] of Object.entries(job)) {
      if (v === undefined) continue;
      mapping[k] = String(v);
    }
    await this.redis.hset(key, mapping);
    await this.redis.rpush(this.queueKey, job.id);
  }

  async getJob(id: string) {
    const key = this.jobKey(id);
    const data = await this.redis.hgetall(key);
    if (!data || Object.keys(data).length === 0) {
      return null;
    }
    return data as unknown as TtsJob;
  }

  private jobKey(id: string) {
    return `tts:job:${id}`;
  }
}
