// services/triggerJob.ts
import { simulateDelay } from "@/data/mockData";

export async function triggerSingleJob(jobName: string, date: string) {
  try {
    // Simulate API delay
    await simulateDelay(1000);

    console.log(`Triggering job: ${jobName} for date: ${date}`);

    return { 
      status: "success", 
      message: `Job ${jobName} berhasil dijalankan`, 
      data: null 
    };
  } catch (error) {
    return { status: "error", message: "Failed to trigger job", data: null };
  }
}

export async function triggerAllJobs(date: string) {
  try {
    // Simulate API delay
    await simulateDelay(2000);

    console.log(`Triggering all jobs for date: ${date}`);

    return { 
      status: "success", 
      message: "Semua job berhasil dijalankan", 
      data: null 
    };
  } catch (error) {
    return { status: "error", message: "Failed to trigger all jobs", data: null };
  }
}

export async function getJobLogs() {
  try {
    // Simulate API delay
    await simulateDelay(500);

    // Return mock job logs
    return { 
      status: "success", 
      message: "Success", 
      data: {
        log_files: [
          {
            filename: "job_passby_2025-01-10.log",
            job_name: "Job1_PASSBY",
            modified_at: "2025-01-10 10:30:00",
            size: 2560,
            size_kb: "2.5 KB"
          },
          {
            filename: "job_et_2025-01-10.log",
            job_name: "Job4_ET",
            modified_at: "2025-01-10 10:35:00",
            size: 1843,
            size_kb: "1.8 KB"
          },
          {
            filename: "job_bop_2025-01-10.log",
            job_name: "Job7_BOP",
            modified_at: "2025-01-10 10:40:00",
            size: 3276,
            size_kb: "3.2 KB"
          }
        ]
      }
    };
  } catch (error) {
    return { status: "error", message: "Failed to fetch job logs", data: null };
  }
}

export async function getJobLogContent(filename: string) {
  try {
    // Simulate API delay
    await simulateDelay(500);

    // Return mock log content
    return { 
      status: "success", 
      message: "Success", 
      data: {
        content: `[2025-01-10 10:30:00] Job started: ${filename}
[2025-01-10 10:30:05] Processing data...
[2025-01-10 10:30:10] Found 45 records
[2025-01-10 10:30:15] Processing record 1/45
[2025-01-10 10:30:20] Processing record 2/45
...
[2025-01-10 10:35:00] Job completed successfully
[2025-01-10 10:35:00] Total records processed: 45`
      }
    };
  } catch (error) {
    return { status: "error", message: "Failed to fetch job log content", data: null };
  }
}

export async function deleteAllJobLogs() {
  try {
    // Simulate API delay
    await simulateDelay(500);

    return { 
      status: "success", 
      message: "Semua log berhasil dihapus", 
      data: null 
    };
  } catch (error) {
    return { status: "error", message: "Failed to delete log files", data: null };
  }
}

// Trigger job untuk menonaktifkan task yang direject
export async function triggerUpdateStatusReject() {
  try {
    // Simulate API delay
    await simulateDelay(1000);

    console.log("Triggering JobUpdateStatusReject");

    return { 
      status: "success", 
      message: "Job update status reject berhasil dijalankan", 
      data: null 
    };
  } catch (error) {
    return { status: "error", message: "Failed to trigger job", data: null };
  }
}
