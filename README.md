## Overview
The Worker Service is responsible for processing job IDs from the queue, executing the submitted Python code, and storing the results in MongoDB. This service listens to job queues and executes the corresponding code.

## Features
- Listens to job queues for new job IDs.
- Executes Python code based on the job ID.
- Stores execution results in MongoDB.

## Worker Processors
- **Code Save Processor**
  - **File**: `src/worker/code-save.processor.ts`
  - **Description**: Handles saving the submitted Python code to a file.

- **Code Exec Processor**
  - **File**: `src/worker/code-exec.processor.ts`
  - **Description**: Handles executing the saved Python code and storing the result in MongoDB.

## Logging and Monitoring
Ensure proper logging and monitoring to keep track of job statuses and any errors that may occur during processing. You can use tools like Prometheus, Grafana, or ELK stack for monitoring and logging purposes.
