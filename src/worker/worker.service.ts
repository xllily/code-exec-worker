import { Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { PythonShell } from 'python-shell';
import { Job as SqlJob } from './job.entity';
import { Job as MongoJob } from './job.interface';
import { InjectQueue } from '@nestjs/bull';
import { Queue } from 'bull';

@Injectable()
export class WorkerService {
  private readonly logger = new Logger(WorkerService.name);

  constructor(
    @InjectRepository(SqlJob) private jobRepository: Repository<SqlJob>,
    @InjectModel('Job') private mongoJobModel: Model<MongoJob>,
    @InjectQueue('codeExecQueue') private codeExecQueue: Queue,
  ) {
    this.logger.log('WorkerService initialized');
  }

  log(message: string) {
    this.logger.log(message);
  }

  async updateJobCodePath(jobId: string, filePath: string) {
    this.log(`Updating job code path for job ID: ${jobId}`);
    const job = await this.jobRepository.findOne({ where: { id: jobId } });
    if (job) {
      job.codeFilePath = filePath;
      await this.jobRepository.save(job);
    }
  }

  async addJobToExecQueue(jobId: string) {
    this.log(`Adding job ID: ${jobId} to execution queue`);
    await this.codeExecQueue.add('executeCode', { jobId });
  }

  async processJob(jobId: string) {
    this.log(`Processing job with ID: ${jobId}`);

    const job = await this.jobRepository.findOne({ where: { id: jobId } });
    if (!job) {
      this.logger.error(`Job not found: ${jobId}`);
      throw new Error('Job not found');
    }

    const filePath = job.codeFilePath;
    try {
      const results = await PythonShell.run(filePath, null);

      this.log(`Python script output: ${results}`);

      const mongoJob = new this.mongoJobModel({
        _id: job.id,
        code: job.codeFilePath,
        result: results.join('\n'),
        status: 'completed',
      });
      await mongoJob.save();
    } catch (err) {
      this.logger.error(`Python script error: ${err.message}`);

      const mongoJob = new this.mongoJobModel({
        _id: job.id,
        code: job.codeFilePath,
        result: err.message,
        status: 'failed',
      });
      await mongoJob.save();
    }
  }
}
