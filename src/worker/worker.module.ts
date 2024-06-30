import { Module } from '@nestjs/common';
import { BullModule } from '@nestjs/bull';
import { MongooseModule } from '@nestjs/mongoose';
import { WorkerService } from './worker.service';
import { JobSchema } from './job.schema';
import { CodeSaveProcessor } from './processors/code-save.processor';
import { CodeExecProcessor } from './processors/code-exec.processor';

@Module({
  imports: [
    BullModule.registerQueue({
      name: 'code-save',
    }),
    BullModule.registerQueue({
      name: 'code-exec',
    }),
    MongooseModule.forFeature([{ name: 'Job', schema: JobSchema }]),
  ],
  providers: [WorkerService, CodeSaveProcessor, CodeExecProcessor],
})
export class WorkerModule { }
