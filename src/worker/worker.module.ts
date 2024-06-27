import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { WorkerService } from './worker.service';
import { WorkerController } from './worker.controller';
import { JobSchema } from './job.schema';
import { mongooseConfig } from "./mongoose.config";

@Module({
  imports: [
    MongooseModule.forRoot(mongooseConfig.uri),
    MongooseModule.forFeature([{ name: 'Job', schema: JobSchema }])
  ],
  providers: [WorkerService],
  controllers: [WorkerController],
})
export class WorkerModule { }
