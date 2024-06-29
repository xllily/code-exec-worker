import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { MongooseModule } from '@nestjs/mongoose';
import { BullModule } from '@nestjs/bull';
import { WorkerService } from './worker.service';
import { WorkerProcessor } from './worker.processor';
import { Job as SqlJob } from './job.entity';
import { JobSchema } from './job.schema';
import { typeOrmConfig } from './typeorm.config'; // 导入 TypeORM 配置
import { mongooseConfig } from './mongoose.config'; // 导入 Mongoose 配置

@Module({
  imports: [
    TypeOrmModule.forRoot(typeOrmConfig), // 使用 TypeORM 配置
    TypeOrmModule.forFeature([SqlJob]),
    MongooseModule.forRoot(mongooseConfig.uri), // 使用 Mongoose 配置
    MongooseModule.forFeature([{ name: 'Job', schema: JobSchema }]),
    BullModule.forRoot({
      redis: {
        host: 'localhost',
        port: 6379,
      },
    }),
    BullModule.registerQueue({
      name: 'jobQueue',
    }),
  ],
  providers: [WorkerService, WorkerProcessor],
})
export class WorkerModule { }
