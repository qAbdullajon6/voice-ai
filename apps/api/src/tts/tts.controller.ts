import { Body, Controller, Get, NotFoundException, Param, Post } from '@nestjs/common';
import { TtsService } from './tts.service';

@Controller('tts')
export class TtsController {
  constructor(private readonly ttsService: TtsService) {}

  @Post()
  async create(
    @Body() body: { text: string; voice?: string; output_format?: string },
  ) {
    return this.ttsService.generate(body);
  }

  @Get(':id')
  async get(@Param('id') id: string) {
    const job = await this.ttsService.getJob(id);
    if (!job) {
      throw new NotFoundException('job not found');
    }
    return job;
  }
}
