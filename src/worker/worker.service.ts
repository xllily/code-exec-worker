import { Injectable, Logger } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { PythonShell } from 'python-shell';
import { Job } from './job.interface';

@Injectable()
export class WorkerService {
  private readonly logger = new Logger(WorkerService.name);

  constructor(
    @InjectModel('Job') private jobModel: Model<Job>,
  ) { }

  async processJob(jobId: string) {
    this.logger.log(`Processing job with ID: ${jobId}`);
    const job = await this.jobModel.findById(jobId).exec();
    if (!job) {
      this.logger.error(`Job not found: ${jobId}`);
      throw new Error('Job not found');
    }

    const pythonShell = new PythonShell(job.code, { mode: 'text' });

    pythonShell.on('message', async (message) => {
      this.logger.log(`Python script output: ${message}`);
      job.result = message;
      job.status = 'completed';
      await job.save();
    });

    pythonShell.end(async (err) => {
      if (err) {
        this.logger.error(`Python script error: ${err.message}`);
        job.status = 'failed';
        job.result = err.message;
        await job.save();
      }
    });
  }
}
