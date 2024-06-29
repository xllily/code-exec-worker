import { Processor, Process } from '@nestjs/bull';
import { Job } from 'bull';
import { WorkerService } from './worker.service';

@Processor('jobQueue')
export class WorkerProcessor {
  constructor(private readonly workerService: WorkerService) { }

  @Process('processJob')
  async handleJob(job: Job) {
    await this.workerService.processJob(job.data.jobId);
  }
}
