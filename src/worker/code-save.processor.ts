import { Processor, Process } from '@nestjs/bull';
import { Job } from 'bull';
import { WorkerService } from './worker.service';
import * as fs from 'fs';
import * as path from 'path';

@Processor('codeSaveQueue')
export class CodeSaveProcessor {
    constructor(private readonly workerService: WorkerService) { }

    @Process('saveCode')
    async handleSaveCode(job: Job) {
        this.workerService.log(`Saving code for job ID: ${job.data.jobId}`);
        const { jobId, code } = job.data;
        const dirPath = path.join(__dirname, `../../codes/python`);
        const filePath = path.join(dirPath, `${jobId}.py`);

        // 检查目录是否存在，如果不存在则创建
        if (!fs.existsSync(dirPath)) {
            fs.mkdirSync(dirPath, { recursive: true });
        }

        fs.writeFileSync(filePath, code);

        await this.workerService.updateJobCodePath(jobId, filePath);
        await this.workerService.addJobToExecQueue(jobId);
    }
}
