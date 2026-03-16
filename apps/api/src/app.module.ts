import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { TtsController } from './tts/tts.controller';
import { TtsService } from './tts/tts.service';
import { AuthModule } from './auth/auth.module';

@Module({
  imports: [AuthModule],
  controllers: [AppController, TtsController],
  providers: [AppService, TtsService],
})
export class AppModule {}
