import {
  Body,
  Controller,
  Get,
  NotFoundException,
  Param,
  Post,
  Query,
  Req,
} from '@nestjs/common';
import { TtsService } from './tts.service';
import type { Request } from 'express';
import { AuthService } from '../auth/auth.service';

@Controller('tts')
export class TtsController {
  constructor(
    private readonly ttsService: TtsService,
    private readonly authService: AuthService,
  ) {}

  @Post('preview')
  async preview(
    @Req() req: Request,
    @Body()
    body: {
      text: string;
      voice?: string;
      output_format?: string;
      model_id?: string;
      settings?: Record<string, unknown>;
    },
  ) {
    const auth = req.headers.authorization ?? '';
    const token = auth.startsWith('Bearer ') ? auth.slice(7) : '';
    const user = this.authService.me(token);
    return this.ttsService.preview(user.id, body);
  }

  @Post()
  async create(
    @Req() req: Request,
    @Body()
    body: {
      text: string;
      voice?: string;
      output_format?: string;
      model_id?: string;
      settings?: Record<string, unknown>;
    },
  ) {
    const auth = req.headers.authorization ?? '';
    const token = auth.startsWith('Bearer ') ? auth.slice(7) : '';
    const user = this.authService.me(token);
    return this.ttsService.generate(user.id, body);
  }

  @Get('history')
  async history(
    @Req() req: Request,
    @Query('limit') limit: string | undefined,
    @Query('cursor') cursor: string | undefined,
  ) {
    const auth = req.headers.authorization ?? '';
    const token = auth.startsWith('Bearer ') ? auth.slice(7) : '';
    const user = this.authService.me(token);
    return this.ttsService.history(user.id, Number(limit ?? 20), cursor);
  }

  @Get(':id')
  async get(@Req() req: Request, @Param('id') id: string) {
    const auth = req.headers.authorization ?? '';
    const token = auth.startsWith('Bearer ') ? auth.slice(7) : '';
    const user = this.authService.me(token);
    const job = await this.ttsService.getJob(user.id, id);
    if (!job) {
      throw new NotFoundException('job not found');
    }
    return job;
  }
}
