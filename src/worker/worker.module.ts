import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { MongooseModule } from '@nestjs/mongoose';
import { BullModule } from '@nestjs/bull';
import { WorkerService } from './worker.service';
import { CodeSaveProcessor } from './code-save.processor';
import { CodeExecProcessor } from './code-exec.processor';
import { Job as SqlJob } from './job.entity';
import { JobSchema } from './job.schema';
import { typeOrmConfig } from './typeorm.config';
import { mongooseConfig } from './mongoose.config';

@Module({
  imports: [
    TypeOrmModule.forRoot(typeOrmConfig),
    TypeOrmModule.forFeature([SqlJob]),
    MongooseModule.forRoot(mongooseConfig.uri),
    MongooseModule.forFeature([{ name: 'Job', schema: JobSchema }]),
    BullModule.forRoot({
      redis: {
        host: 'localhost',
        port: 6379,
      },
    }),
    BullModule.registerQueue({
      name: 'codeSaveQueue',
    }),
    BullModule.registerQueue({
      name: 'codeExecQueue',
    }),
  ],
  providers: [WorkerService, CodeSaveProcessor, CodeExecProcessor],
})
export class WorkerModule {
  constructor() {
    console.log('WorkerModule initialized');
  }
}
