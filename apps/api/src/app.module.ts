import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { TtsController } from './tts/tts.controller';
import { TtsService } from './tts/tts.service';
import { AuthModule } from './auth/auth.module';
import { VoicesController } from './voices/voices.controller';
import { VoicesService } from './voices/voices.service';

@Module({
  imports: [AuthModule],
  controllers: [AppController, TtsController, VoicesController],
  providers: [AppService, TtsService, VoicesService],
})
export class AppModule {}
