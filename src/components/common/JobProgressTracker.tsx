"use client";
import { useState, useEffect, useRef } from "react";
import { usePathname } from "next/navigation";
import { X, Minimize2, Maximize2, CheckCircle2, Loader2 } from "lucide-react";

interface JobProgressData {
  job_name: string;
  status: "running" | "completed" | "failed";
  progress: number;
  total_records: number;
  processed_records: number;
  start_time: string;
  message: string;
  skipped?: boolean;
}

interface WebSocketMessage {
  type: string;
  data: JobProgressData;
  user_id?: string; // User ID yang menjalankan job
  session_id?: string; // Session ID yang menjalankan job
  total_jobs?: number; // Total jobs yang akan dijalankan (untuk single job = 1, all jobs = 16)
}

interface JobProgress {
  completed_jobs: string[];
  skipped_jobs?: string[];
  skipped_jobs_details?: Record<string, JobProgressData>;
  running_jobs?: string[];
  running_jobs_details?: Record<string, JobProgressData>;
  pending_jobs?: string[];
  total_jobs: number;
  completed_count: number;
  skipped_count?: number;
  status: string;
  message?: string;
  current_job?: string;
  current_job_details?: JobProgressData;
}

export default function JobProgressTracker() {
  const [isVisible, setIsVisible] = useState(false);
  const [isMinimized, setIsMinimized] = useState(false);
  const [progress, setProgress] = useState<JobProgress | null>(null);
  const [isConnected, setIsConnected] = useState(false);
  const [startTime, setStartTime] = useState<number | null>(null);
  const [elapsedTime, setElapsedTime] = useState<number>(0);
  const [previousStatus, setPreviousStatus] = useState<string | null>(null);
  const wsRef = useRef<WebSocket | null>(null);
  
  // Get current pathname from Next.js router
  const pathname = usePathname();

  // Don't render on login/signin pages
  const isLoginPage = pathname === '/signin' || pathname === '/login';
  const shouldRender = !isLoginPage;

  useEffect(() => {
    if (!shouldRender) {
      return; // Don't connect WebSocket if on login page
    }
    let reconnectTimeout: NodeJS.Timeout;
    let demoInterval: NodeJS.Timeout;
    
    // Demo progress handler - simulates multiple jobs running simultaneously
    const handleDemoProgress = () => {
      let step = 0;
      const allJobs = [
        "Job1_PASSBY", "Job2_PEP", "Job3_NRT", "Job4_ET",
        "Job5_DORMAN", "Job6_MTM", "Job7_BOP", "Job8_RBU",
        "Job9_RBU2", "Job10_RDS", "Job11_TUN", "Job12_DOR",
        "Job13_ExceedIncome", "Job14_TarikSetor", "Job15_JUDOL", "Job16_DB_SUSPECT",
        "Job17_DB_TERORIS", "Job18_TRF_SUSPECT"
      ];
      
      // Simulate some jobs being skipped (OFF)
      const skippedJobsDemo = ["Job4_ET", "Job7_BOP", "Job15_JUDOL"];
      
      // Track progress for each job
      const jobProgress: Record<string, number> = {};
      allJobs.forEach(job => jobProgress[job] = 0);
      
      setIsVisible(true);
      
      demoInterval = setInterval(() => {
        step++;
        
        // Simulate multiple jobs running at different speeds
        const runningJobsDetails: Record<string, JobProgressData> = {};
        const skippedJobsDetails: Record<string, JobProgressData> = {};
        const completed: string[] = [];
        const skipped: string[] = [];
        const running: string[] = [];
        
        allJobs.forEach((job, index) => {
          // Start jobs gradually (3 at a time)
          if (index < step * 3) {
            // Check if job should be skipped
            if (skippedJobsDemo.includes(job)) {
              if (!skipped.includes(job)) {
                skipped.push(job);
                skippedJobsDetails[job] = {
                  job_name: job,
                  status: "completed",
                  progress: 100,
                  total_records: 0,
                  processed_records: 0,
                  start_time: new Date().toISOString(),
                  message: `Job skipped: ${job} is OFF in parameter`,
                  skipped: true
                };
              }
            } else {
              jobProgress[job] = Math.min(100, jobProgress[job] + Math.random() * 15 + 5);
              
              if (jobProgress[job] >= 100) {
                completed.push(job);
              } else {
                running.push(job);
                runningJobsDetails[job] = {
                  job_name: job,
                  status: "running",
                  progress: Math.floor(jobProgress[job]),
                  total_records: 1000,
                  processed_records: Math.floor((jobProgress[job] / 100) * 1000),
                  start_time: new Date().toISOString(),
                  message: `Processing ${job}...`,
                  skipped: false
                };
              }
            }
          }
        });
        
        const pending = allJobs.filter(job => !completed.includes(job) && !running.includes(job) && !skipped.includes(job));
        const processedCount = completed.length + skipped.length;
        const allCompleted = processedCount === 18 && running.length === 0;
        
        setProgress({
          completed_jobs: completed,
          skipped_jobs: skipped,
          skipped_jobs_details: skippedJobsDetails,
          running_jobs: running,
          running_jobs_details: runningJobsDetails,
          pending_jobs: pending,
          current_job: running[0],
          total_jobs: 18,
          completed_count: completed.length,
          skipped_count: skipped.length,
          status: allCompleted ? "completed" : "running",
          message: allCompleted 
            ? `All jobs processed! (${completed.length} completed, ${skipped.length} skipped)` 
            : `${running.length} job(s) running...`
        });
        
        if (allCompleted) {
          clearInterval(demoInterval);
          setTimeout(() => {
            setIsVisible(false);
            setProgress(null);
          }, 5000);
        }
      }, 800);
    };
    
    window.addEventListener('showDemoProgress', handleDemoProgress);
    
    // Connect to WebSocket
    const connectWebSocket = () => {
      try {
        // Mock WebSocket - disabled for demo
        // const ws = new WebSocket("ws://localhost:8080/ws/job-progress");
        
        ws.onopen = () => {
          setIsConnected(true);
        };

        ws.onmessage = (event) => {
          try {
            const message: WebSocketMessage = JSON.parse(event.data);
            
            if (message.type === "progress_update" && message.data) {
              const jobData = message.data;
              
              // Update progress state based on individual job updates
              setProgress(prev => {
                const completed = prev?.completed_jobs || [];
                const skipped = prev?.skipped_jobs || [];
                const skippedDetails = prev?.skipped_jobs_details || {};
                const running = prev?.running_jobs || [];
                const runningDetails = prev?.running_jobs_details || {};
                
                // Update lists based on job status
                let newCompleted = [...completed];
                let newSkipped = [...skipped];
                let newSkippedDetails = { ...skippedDetails };
                let newRunning = [...running];
                let newRunningDetails = { ...runningDetails };
                
                // Check if job is running (termasuk job yang dijalankan ulang)
                if (jobData.status === "running" || (jobData.status === "completed" && jobData.progress < 100)) {
                  // Job sedang berjalan
                  if (!running.includes(jobData.job_name)) {
                    newRunning.push(jobData.job_name);
                  }
                  newRunningDetails[jobData.job_name] = jobData;
                  
                  // Jika job ini sebelumnya sudah completed, pindahkan dari completed ke running
                  // (ini terjadi ketika job yang sama dijalankan ulang)
                  newCompleted = newCompleted.filter(j => j !== jobData.job_name);
                  
                  // Juga remove dari skipped jika ada
                  newSkipped = newSkipped.filter(j => j !== jobData.job_name);
                  delete newSkippedDetails[jobData.job_name];
                }
                // Check if job is skipped
                else if (jobData.skipped === true && jobData.status === "completed") {
                  // Job di-skip (OFF)
                  if (!skipped.includes(jobData.job_name)) {
                    newSkipped.push(jobData.job_name);
                    newSkippedDetails[jobData.job_name] = jobData;
                  }
                  // Remove from running if exists
                  newRunning = newRunning.filter(j => j !== jobData.job_name);
                  delete newRunningDetails[jobData.job_name];
                  // Don't add to completed
                } 
                // Check if job is completed
                else if (jobData.status === "completed" && jobData.progress === 100) {
                  // Job completed normally
                  if (!completed.includes(jobData.job_name)) {
                    newCompleted.push(jobData.job_name);
                  }
                  newRunning = newRunning.filter(j => j !== jobData.job_name);
                  delete newRunningDetails[jobData.job_name];
                }
                
                // Hitung total jobs dinamis:
                // - Jika backend kirim total_jobs = 18 (all jobs), gunakan 18
                // - Jika backend kirim total_jobs = 1 (single job), hitung dinamis dari jumlah job yang ada
                const currentJobCount = newCompleted.length + newSkipped.length + newRunning.length;
                const totalJobs = message.total_jobs === 18 
                  ? 18  // All jobs mode: fixed 18
                  : Math.max(currentJobCount, prev?.total_jobs || 1);  // Single job mode: akumulasi bertambah
                
                // Hitung progress: completed + skipped dari total jobs
                const processedJobs = newCompleted.length + newSkipped.length;
                const allCompleted = processedJobs === totalJobs && newRunning.length === 0;
                
                return {
                  completed_jobs: newCompleted,
                  skipped_jobs: newSkipped,
                  skipped_jobs_details: newSkippedDetails,
                  running_jobs: newRunning,
                  running_jobs_details: newRunningDetails,
                  pending_jobs: prev?.pending_jobs || [],
                  total_jobs: totalJobs,
                  completed_count: newCompleted.length,
                  skipped_count: newSkipped.length,
                  status: allCompleted ? "completed" : "running",
                  message: allCompleted 
                    ? totalJobs === 1 
                      ? `Job completed!` 
                      : `All jobs processed! (${newCompleted.length} completed, ${newSkipped.length} skipped)`
                    : `${newRunning.length} job(s) running...`,
                  current_job: newRunning.length > 0 ? newRunning[0] : undefined,
                  current_job_details: newRunning.length > 0 ? newRunningDetails[newRunning[0]] : undefined
                };
              });
              
              setIsVisible(true);
            }
          } catch (error) {
            // Silent error - ignore parsing errors
          }
        };

        ws.onerror = () => {
          // Silent error - WebSocket connection failed (backend might not be running)
          setIsConnected(false);
        };

        ws.onclose = () => {
          setIsConnected(false);
          
          // Reconnect after 10 seconds (longer interval to reduce spam)
          reconnectTimeout = setTimeout(() => {
            connectWebSocket();
          }, 10000);
        };

        wsRef.current = ws;
      } catch (error) {
        // Silent error - don't spam console
        setIsConnected(false);
      }
    };

    connectWebSocket();

    return () => {
      window.removeEventListener('showDemoProgress', handleDemoProgress);
      if (demoInterval) {
        clearInterval(demoInterval);
      }
      if (reconnectTimeout) {
        clearTimeout(reconnectTimeout);
      }
      if (wsRef.current) {
        wsRef.current.close();
      }
    };
  }, [shouldRender]);

  // Listen untuk event trigger job (start timer dari saat trigger)
  useEffect(() => {
    const handleJobTriggered = () => {
      setStartTime(Date.now());
      setElapsedTime(0);
      setIsVisible(true);
    };
    
    window.addEventListener('jobTriggered', handleJobTriggered);
    
    return () => {
      window.removeEventListener('jobTriggered', handleJobTriggered);
    };
  }, []);

  // Timer untuk menghitung elapsed time
  useEffect(() => {
    let interval: NodeJS.Timeout | undefined;
    
    if (isVisible && progress) {
      // Reset timer jika status berubah dari completed ke running (job baru dimulai)
      if (previousStatus === "completed" && progress.status === "running") {
        setStartTime(Date.now());
        setElapsedTime(0);
      }
      
      // Update elapsed time setiap detik HANYA jika status running
      if (startTime && progress.status === "running") {
        interval = setInterval(() => {
          setElapsedTime(Math.floor((Date.now() - startTime) / 1000));
        }, 1000);
      }
      
      // Stop timer jika completed
      if (progress.status === "completed") {
        if (interval) clearInterval(interval);
      }
      
      // Update previous status
      setPreviousStatus(progress.status);
    }
    
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [isVisible, progress, startTime, previousStatus]);

  const handleClose = () => {
    setIsVisible(false);
    setProgress(null);
    setStartTime(null);
    setElapsedTime(0);
    setPreviousStatus(null);
  };

  const handleToggleMinimize = () => {
    setIsMinimized(!isMinimized);
  };

  // Format elapsed time ke format mm:ss
  const formatElapsedTime = (seconds: number): string => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  // Don't render if not authenticated, on login page, or no progress
  if (!shouldRender || !isVisible || !progress) {
    return null;
  }

  // Hitung persentase: completed + skipped dari total
  const processedCount = progress.completed_count + (progress.skipped_count || 0);
  const progressPercentage = (processedCount / progress.total_jobs) * 100;

  return (
    <div className="fixed bottom-6 right-6 z-[9998] animate-in slide-in-from-bottom-5">
      <div className="bg-gray-900 text-white rounded-lg shadow-2xl border border-gray-700 overflow-hidden w-96">
        {/* Header */}
        <div className="flex items-center justify-between p-4 bg-gray-800 border-b border-gray-700">
          <div className="flex items-center gap-2">
            {progress.status === "completed" && processedCount === progress.total_jobs ? (
              <CheckCircle2 className="w-5 h-5 text-green-500" />
            ) : (
              <Loader2 className="w-5 h-5 text-blue-500 animate-spin" />
            )}
            <div>
              <h3 className="font-semibold text-sm">
                Job Progress ({processedCount}/{progress.total_jobs})
              </h3>
              {(progress.status === "running" || progress.status === "completed") && elapsedTime > 0 && (
                <p className="text-xs text-gray-400 mt-0.5">
                  {progress.status === "completed" ? "Completion Time: " : "Elapsed Time: "}
                  {formatElapsedTime(elapsedTime)}
                </p>
              )}
            </div>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={handleToggleMinimize}
              className="p-1 hover:bg-gray-700 rounded transition-colors"
            >
              {isMinimized ? (
                <Maximize2 className="w-4 h-4" />
              ) : (
                <Minimize2 className="w-4 h-4" />
              )}
            </button>
            <button
              onClick={handleClose}
              className="p-1 hover:bg-gray-700 rounded transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Content */}
        {!isMinimized && (
          <div className="p-4">
            {/* Progress Bar */}
            <div className="mb-4">
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs text-gray-400">Progress</span>
                <span className="text-xs font-semibold text-blue-400">
                  {progressPercentage.toFixed(0)}%
                </span>
              </div>
              <div className="w-full bg-gray-700 rounded-full h-2 overflow-hidden">
                <div
                  className="bg-blue-500 h-full transition-all duration-500 ease-out"
                  style={{ width: `${progressPercentage}%` }}
                />
              </div>
            </div>

            {/* Status Message */}
            {progress.message && (
              <div className="mb-3 p-2 bg-gray-800 rounded text-xs text-gray-300">
                {progress.message}
              </div>
            )}

            {/* Running Jobs with Details */}
            {progress.running_jobs_details && Object.keys(progress.running_jobs_details).length > 0 && (
              <div className="mb-3 space-y-2">
                <p className="text-xs font-semibold text-blue-400 mb-2 flex items-center gap-2">
                  <Loader2 className="w-3 h-3 animate-spin" />
                  Sedang Berjalan ({Object.keys(progress.running_jobs_details).length}):
                </p>
                <div className="space-y-2 max-h-48 overflow-y-auto custom-scrollbar">
                  {Object.values(progress.running_jobs_details).map((jobDetail, index) => (
                    <div key={index} className="p-2 bg-blue-900/20 border border-blue-700/50 rounded space-y-1.5">
                      <div className="flex items-center justify-between">
                        <p className="text-xs font-semibold text-blue-400 flex items-center gap-1">
                          <Loader2 className="w-3 h-3 animate-spin" />
                          {jobDetail.job_name}
                        </p>
                        <span className="text-xs text-blue-300 font-semibold">
                          {jobDetail.progress}%
                        </span>
                      </div>
                      
                      {/* Job Progress Bar */}
                      <div className="w-full bg-gray-700 rounded-full h-1 overflow-hidden">
                        <div
                          className="bg-blue-500 h-full transition-all duration-300"
                          style={{ width: `${jobDetail.progress}%` }}
                        />
                      </div>
                      
                      {/* Records Info */}
                      <div className="text-xs text-gray-400">
                        {jobDetail.processed_records.toLocaleString()} / {jobDetail.total_records.toLocaleString()} records
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Completed Jobs List */}
            {progress.completed_jobs && progress.completed_jobs.length > 0 && (
              <div className="space-y-1">
                <p className="text-xs font-semibold text-gray-400 mb-2">
                  ✅ Selesai ({progress.completed_jobs.length}):
                </p>
                <div className="max-h-32 overflow-y-auto custom-scrollbar">
                  <div className="flex flex-wrap gap-1">
                    {progress.completed_jobs.map((job, index) => (
                      <span
                        key={index}
                        className="inline-flex items-center gap-1 px-2 py-1 bg-green-900/30 text-green-400 text-xs rounded border border-green-700/50"
                      >
                        <CheckCircle2 className="w-3 h-3" />
                        {job}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* Skipped Jobs List */}
            {progress.skipped_jobs && progress.skipped_jobs.length > 0 && (
              <div className="mt-3 pt-3 border-t border-gray-700 space-y-1">
                <p className="text-xs font-semibold text-yellow-400 mb-2">
                  ⏭️ OFF ({progress.skipped_jobs.length}):
                </p>
                <div className="max-h-32 overflow-y-auto custom-scrollbar">
                  <div className="flex flex-wrap gap-1">
                    {progress.skipped_jobs.map((job, index) => {
                      const jobDetail = progress.skipped_jobs_details?.[job];
                      return (
                        <span
                          key={index}
                          className="inline-flex items-center gap-1 px-2 py-1 bg-yellow-900/20 text-yellow-400 text-xs rounded border border-yellow-700/50"
                          title={jobDetail?.message || "Job skipped"}
                        >
                          <span className="text-yellow-500">⏭</span>
                          {job}
                        </span>
                      );
                    })}
                  </div>
                </div>
              </div>
            )}

            {/* Pending Jobs List */}
            {progress.pending_jobs && progress.pending_jobs.length > 0 && (
              <div className="mt-3 pt-3 border-t border-gray-700">
                <p className="text-xs font-semibold text-gray-500 mb-2">
                  Menunggu ({progress.pending_jobs.length}):
                </p>
                <div className="max-h-24 overflow-y-auto custom-scrollbar">
                  <div className="flex flex-wrap gap-1">
                    {progress.pending_jobs.map((job, index) => (
                      <span
                        key={index}
                        className="inline-flex items-center gap-1 px-2 py-1 bg-gray-800 text-gray-500 text-xs rounded border border-gray-700"
                      >
                        {job}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* Connection Status */}
            <div className="mt-3 pt-3 border-t border-gray-700">
              <div className="flex items-center gap-2 text-xs">
                <div className={`w-2 h-2 rounded-full ${isConnected ? 'bg-green-500' : 'bg-red-500'}`} />
                <span className="text-gray-400">
                  {isConnected ? 'Connected' : 'Disconnected'}
                </span>
              </div>
            </div>
          </div>
        )}
      </div>

      <style jsx>{`
        .custom-scrollbar::-webkit-scrollbar {
          width: 6px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: #374151;
          border-radius: 3px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: #6b7280;
          border-radius: 3px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background: #9ca3af;
        }
      `}</style>
    </div>
  );
}
