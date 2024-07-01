import { Module } from '@nestjs/common';
import { BullModule } from '@nestjs/bull';
import { MongooseModule } from '@nestjs/mongoose';
import { WorkerModule } from './worker/worker.module';

@Module({
  imports: [
    BullModule.forRoot({
      redis: {
        host: process.env.REDIS_HOST || 'localhost',
        port: parseInt(process.env.REDIS_PORT, 10) || 6379,
      },
    }),
    MongooseModule.forRoot(process.env.MONGO_URI || 'mongodb://localhost/code-exec'),
    BullModule.registerQueue({
      name: 'code-save',
    }),
    BullModule.registerQueue({
      name: 'code-exec',
    }),
    WorkerModule,
  ],
})
export class AppModule { }
