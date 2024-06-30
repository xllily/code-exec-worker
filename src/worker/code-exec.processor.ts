import { Processor, Process } from '@nestjs/bull';
import { Job } from 'bull';
import { WorkerService } from './worker.service';

@Processor('codeExecQueue')
export class CodeExecProcessor {
    constructor(private readonly workerService: WorkerService) { }

    @Process('executeCode')
    async handleExecuteCode(job: Job) {
        this.workerService.log(`Executing code for job ID: ${job.data.jobId}`);
        await this.workerService.processJob(job.data.jobId);
    }
}
