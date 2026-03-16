import { BadRequestException, Injectable } from '@nestjs/common';
import { randomUUID } from 'crypto';
import { TtsQueue, TtsJob } from './tts.queue';

type TtsRequest = {
  text: string;
  voice?: string;
  output_format?: string;
};

@Injectable()
export class TtsService {
  private readonly queue = new TtsQueue();

  async generate(payload: TtsRequest) {
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
    await this.queue.enqueue(job);
    return { id: job.id, status: job.status };
  }

  async getJob(id: string) {
    return this.queue.getJob(id);
  }
}
