import { Controller, Logger } from '@nestjs/common';
import { EventPattern } from '@nestjs/microservices';
import { WorkerService } from './worker.service';

@Controller()
export class WorkerController {
  private readonly logger = new Logger(WorkerController.name);

  constructor(private readonly workerService: WorkerService) { }

  @EventPattern('job_created')
  async handleJobCreated(jobId: string) {
    this.logger.log(`Received job with ID: ${jobId}`);
    await this.workerService.processJob(jobId);
  }
}
