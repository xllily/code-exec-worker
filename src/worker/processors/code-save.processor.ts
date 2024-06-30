import { Process, Processor } from '@nestjs/bull';
import { Job } from 'bull';
import { Logger } from '@nestjs/common';
import { WorkerService } from '../worker.service';

@Processor('code-save')
export class CodeSaveProcessor {
    private readonly logger = new Logger(CodeSaveProcessor.name);

    constructor(private readonly workerService: WorkerService) { }

    @Process('saveCode')
    async handleSaveCode(job: Job<{ jobId: string; code: string }>) {
        this.logger.log(`Handling saveCode job ${job.id}`);
        const { jobId, code } = job.data;
        await this.workerService.saveCode(jobId, code);
        this.logger.log(`Completed saveCode job ${job.id}`);
    }
}
