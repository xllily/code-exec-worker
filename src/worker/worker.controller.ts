import { Controller } from '@nestjs/common';
import { EventPattern } from '@nestjs/microservices';
import { WorkerService } from './worker.service';

@Controller()
export class WorkerController {
  constructor(private readonly workerService: WorkerService) { }

  @EventPattern('job_created')
  async handleJobCreated(jobId: string) {
    await this.workerService.processJob(jobId);
  }
}
