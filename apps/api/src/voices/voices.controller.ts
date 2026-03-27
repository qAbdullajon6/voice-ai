import { Controller, Get, Query } from '@nestjs/common';
import { VoicesService } from './voices.service';

@Controller('voices')
export class VoicesController {
  constructor(private readonly voicesService: VoicesService) {}

  @Get('library/latest')
  async latestLibrary(@Query('limit') limit?: string) {
    const n = limit ? Number(limit) : 5;
    return this.voicesService.latestLibraryPreviews(n);
  }

  @Get()
  async list(
    @Query('locale') locale: string | undefined,
    @Query('language') language: string | undefined,
    @Query('accent') accent: string | undefined,
    @Query('gender') gender: string | undefined,
    @Query('q') q: string | undefined,
    @Query('voiceType') voiceType: string | undefined,
    @Query('style') style: string | undefined,
    @Query('category') category: string | undefined,
    @Query('provider') provider: string | undefined,
  ) {
    return this.voicesService.list({
      locale,
      language,
      accent,
      gender,
      q,
      voiceType,
      style,
      category,
      provider,
    });
  }
}
