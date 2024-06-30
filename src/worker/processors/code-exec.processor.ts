import { Process, Processor } from '@nestjs/bull';
import { Job } from 'bull';
import { Logger } from '@nestjs/common';
import { WorkerService } from '../worker.service';

@Processor('code-exec')
export class CodeExecProcessor {
    private readonly logger = new Logger(CodeExecProcessor.name);

    constructor(private readonly workerService: WorkerService) { }

    @Process('execCode')
    async handleExecCode(job: Job<{ jobId: string; filePath: string }>) {
        this.logger.log(`Handling execCode job ${job.id}`);
        const { jobId, filePath } = job.data;
        await this.workerService.execCode(jobId, filePath);
        this.logger.log(`Completed execCode job ${job.id}`);
    }
}
