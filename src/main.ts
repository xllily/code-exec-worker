import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import * as dotenv from 'dotenv';
import { join } from 'path';
dotenv.config({ path: join(__dirname, '..', '.env') });
async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  await app.listen(process.env.WORKER_PORT || 3001);
}
bootstrap();
