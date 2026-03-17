import { Controller, Get, Query } from '@nestjs/common';
import { VoicesService } from './voices.service';

@Controller('voices')
export class VoicesController {
  constructor(private readonly voicesService: VoicesService) {}

  @Get()
  async list(
    @Query('locale') locale: string | undefined,
    @Query('gender') gender: string | undefined,
    @Query('q') q: string | undefined,
    @Query('voiceType') voiceType: string | undefined,
    @Query('style') style: string | undefined,
  ) {
    return this.voicesService.list({ locale, gender, q, voiceType, style });
  }
}
