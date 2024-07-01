import { Injectable, Logger } from '@nestjs/common';
import { InjectQueue } from '@nestjs/bull';
import { Queue } from 'bull';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Job } from './job.interface';
import * as fs from 'fs';
import * as path from 'path';

@Injectable()
export class WorkerService {
  private readonly logger = new Logger(WorkerService.name);

  constructor(
    @InjectQueue('code-save') private readonly codeSaveQueue: Queue,
    @InjectQueue('code-exec') private readonly codeExecQueue: Queue,
    @InjectModel('Job') private readonly jobModel: Model<Job>,
  ) { }

  async saveCode(jobId: string, code: string): Promise<void> {
    const dirPath = path.join(__dirname, 'codes/python');
    const filePath = path.join(dirPath, `${jobId}.py`);

    // 检查目录是否存在，如果不存在则创建
    if (!fs.existsSync(dirPath)) {
      fs.mkdirSync(dirPath, { recursive: true });
      this.logger.log(`Directory created: ${dirPath}`);
    } else {
      this.logger.log(`Directory already exists: ${dirPath}`);
    }

    try {
      fs.writeFileSync(filePath, code);
      this.logger.log(`Saved code to ${filePath}`);

      const job = await this.codeExecQueue.add('execCode', { jobId, filePath });
      this.logger.log(`Added execCode job to code-exec queue for jobId: ${jobId}, job.id: ${job.id}`);
    } catch (error) {
      this.logger.error(`Failed to save code or add execCode job for jobId: ${jobId} - ${error.message}`);
    }
  }

  async execCode(jobId: string, filePath: string): Promise<void> {
    this.logger.log(`Executing code from ${filePath}`);

    const { PythonShell } = require('python-shell');
    const options = {
      pythonPath: 'python3', // 确保使用正确的 Python 解释器
    };

    try {
      if (!fs.existsSync(filePath)) {
        this.logger.error(`File not found: ${filePath}`);
        throw new Error(`File not found: ${filePath}`);
      }

      const results = await PythonShell.run(filePath, options);
      // this.logger.log(`Execution results: ${results}`);

      const job = await this.jobModel.findById(jobId).exec();
      if (!job) {
        this.logger.error(`Job not found: ${jobId}`);
        throw new Error('Job not found');
      }

      job.status = 'completed';
      job.result = results.join('\n');
      await job.save();
      this.logger.log(`Updated job ${jobId} with execution results`);
    } catch (err) {
      this.logger.error(`Error executing Python script: ${err.message}`);
      const job = await this.jobModel.findById(jobId).exec();
      if (job) {
        job.status = 'failed';
        job.result = err.message;
        await job.save();
        this.logger.log(`Updated job ${jobId} with error status`);
      }
    }
  }
}
