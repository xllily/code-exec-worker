import { Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { PythonShell } from 'python-shell';
import { Job as SqlJob } from './job.entity'; // TypeORM 的 Job 实体
import { Job as MongoJob } from './job.interface'; // Mongoose 的 Job 接口

@Injectable()
export class WorkerService {
  private readonly logger = new Logger(WorkerService.name);

  constructor(
    @InjectRepository(SqlJob) private jobRepository: Repository<SqlJob>,
    @InjectModel('Job') private mongoJobModel: Model<MongoJob>,
  ) { }

  async processJob(jobId: string) {
    this.logger.log(`Processing job with ID: ${jobId}`);

    // 从 SQLite 读取任务
    const job = await this.jobRepository.findOne({ where: { id: jobId } });

    if (!job) {
      this.logger.error(`Job not found: ${jobId}`);
      throw new Error('Job not found');
    }

    try {
      const results = await PythonShell.runString(job.code, {
        mode: 'text',
      });

      this.logger.log(`Python script output: ${results}`);

      // 在 MongoDB 中保存结果
      const mongoJob = new this.mongoJobModel({
        _id: job.id,
        code: job.code,
        result: results.join('\n'),
        status: 'completed',
      });
      await mongoJob.save();
    } catch (err) {
      this.logger.error(`Python script error: ${err.message}`);

      // 在 MongoDB 中保存错误信息
      const mongoJob = new this.mongoJobModel({
        _id: job.id,
        code: job.code,
        result: err.message,
        status: 'failed',
      });
      await mongoJob.save();
    }
  }
}
