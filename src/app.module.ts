import { Module } from '@nestjs/common';
import { BullModule } from '@nestjs/bull';
import { MongooseModule } from '@nestjs/mongoose';
import { WorkerModule } from './worker/worker.module';
import { mongooseConfig } from './mongoose.config';
import { bullConfig } from './bull.config';

@Module({
  imports: [
    BullModule.forRoot(bullConfig),
    MongooseModule.forRoot(mongooseConfig.uri),
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
