import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { config as loadEnv } from 'dotenv';
import { join, resolve } from 'path';
import { initDb } from './db';

async function bootstrap() {
  loadEnv({ path: join(process.cwd(), '.env') });
  loadEnv({ path: join(process.cwd(), '..', '.env') });
  loadEnv({ path: join(process.cwd(), '..', '..', '.env') });
  loadEnv({ path: resolve(__dirname, '..', '..', '..', '.env') });

  await initDb();

  const app = await NestFactory.create(AppModule);
  const webUrl = process.env.WEB_URL ?? 'http://localhost:3000';
  const extraOrigins =
    process.env.CORS_ORIGINS?.split(',').map((v) => v.trim()) ?? [];
  app.enableCors({
    origin: ['http://localhost:3000', 'http://127.0.0.1:3000', webUrl, ...extraOrigins],
    credentials: true,
  });
  const port = Number(process.env.API_PORT ?? process.env.PORT ?? 4000);
  await app.listen(port);
}
bootstrap();
