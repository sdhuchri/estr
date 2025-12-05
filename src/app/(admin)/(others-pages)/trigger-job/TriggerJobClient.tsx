"use client";
import { useState, useRef, useEffect } from "react";
import FadeInWrapper from "@/components/common/FadeInWrapper";
import FormField, { CustomListbox } from "@/components/common/FormField";
import TailwindDatePicker from "@/components/common/TailwindDatePicker";
import { Toast } from "primereact/toast";
import { triggerSingleJob, triggerAllJobs, getJobLogs, getJobLogContent, deleteAllJobLogs } from "@/services/triggerJob";
import { Play, PlayCircle, FileText, RefreshCw, Trash2 } from "lucide-react";
import Modal from "@/components/common/Modal";
import ConfirmDialog from "@/components/common/ConfirmDialog";

const JOB_LIST = [
  { value: "Job1_PASSBY", label: "Job1 - PASSBY" },
  { value: "Job2_PEP", label: "Job2 - PEP" },
  { value: "Job3_NRT", label: "Job3 - NRT" },
  { value: "Job4_ET", label: "Job4 - ET" },
  { value: "Job5_DORMAN", label: "Job5 - DORMAN" },
  { value: "Job6_MTM", label: "Job6 - MTM" },
  { value: "Job7_BOP", label: "Job7 - BOP" },
  { value: "Job8_RBU", label: "Job8 - RBU" },
  { value: "Job9_RBU2", label: "Job9 - RBU2" },
  { value: "Job10_RDS", label: "Job10 - RDS" },
  { value: "Job11_TUN", label: "Job11 - TUN" },
  { value: "Job12_DOR", label: "Job12 - DOR" },
  { value: "Job13_ExceedIncome", label: "Job13 - Exceed Income" },
  { value: "Job14_TarikSetor", label: "Job14 - Tarik Setor" },
  { value: "Job15_JUDOL", label: "Job15 - JUDOL" },
  { value: "Job16_DB_SUSPECT", label: "Job16 - DB SUSPECT" },
  { value: "Job17_DB_TERORSIS", label: "Job17 - DB TERORSIS" },
  { value: "Job18_TRF_SUSPECT", label: "Job18 - TRF SUSPECT" }
];

export default function TriggerJobClient() {
  const toast = useRef<Toast>(null);
  const [selectedJob, setSelectedJob] = useState<string>("");
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [isTriggeringSingle, setIsTriggeringSingle] = useState(false);
  const [isTriggeringAll, setIsTriggeringAll] = useState(false);
  
  // Log viewer state
  interface LogFile {
    filename: string;
    job_name: string;
    modified_at: string;
    size: number;
    size_kb: string;
  }
  
  const [logFiles, setLogFiles] = useState<LogFile[]>([]);
  const [isLoadingLogs, setIsLoadingLogs] = useState(false);
  const [isLogModalOpen, setIsLogModalOpen] = useState(false);
  const [selectedLogFile, setSelectedLogFile] = useState<LogFile | null>(null);
  const [logContent, setLogContent] = useState<string>("");
  const [isLoadingLogContent, setIsLoadingLogContent] = useState(false);
  const [isDeleteConfirmOpen, setIsDeleteConfirmOpen] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  const formatDateForAPI = (date: Date | null): string => {
    if (!date) return "";
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  };

  // Fetch log files on component mount - disabled by default to avoid error on page load
  // User can click refresh button to load logs
  // useEffect(() => {
  //   fetchLogFiles();
  // }, []);

  const logSectionRef = useRef<HTMLDivElement>(null);

  const sortLogFiles = (files: LogFile[]) => {
    return files.sort((a, b) => {
      // Extract job number from job_name (e.g., "Job1_PASSBY" -> 1)
      const getJobNumber = (jobName: string) => {
        const match = jobName.match(/Job(\d+)/);
        return match ? parseInt(match[1]) : 999;
      };
      
      return getJobNumber(a.job_name) - getJobNumber(b.job_name);
    });
  };

  const fetchLogFiles = async () => {
    setIsLoadingLogs(true);
    
    // Scroll to log section
    if (logSectionRef.current) {
      logSectionRef.current.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
    
    try {
      const response = await getJobLogs();
      
      if (response.status === "success" && response.data && response.data.log_files) {
        const sortedFiles = sortLogFiles(response.data.log_files);
        setLogFiles(sortedFiles);
        toast.current?.show({
          severity: "success",
          summary: "Berhasil!",
          detail: response.message || `Ditemukan ${response.data.log_files.length} file log`,
          life: 3000
        });
      } else {
        setLogFiles([]);
        toast.current?.show({
          severity: "info",
          summary: "Info",
          detail: response.message || "Tidak ada file log ditemukan",
          life: 3000
        });
      }
    } catch (error) {
      console.error("Error fetching log files:", error);
      setLogFiles([]);
      toast.current?.show({
        severity: "error",
        summary: "Gagal!",
        detail: "Gagal mengambil daftar log files. Pastikan API endpoint tersedia.",
        life: 3000
      });
    } finally {
      setIsLoadingLogs(false);
    }
  };

  const handleViewLog = async (logFile: LogFile) => {
    setSelectedLogFile(logFile);
    setIsLogModalOpen(true);
    setIsLoadingLogContent(true);
    
    try {
      const response = await getJobLogContent(logFile.filename);
      if (response.status === "success" && response.data) {
        setLogContent(response.data.content || "");
      } else {
        setLogContent("Error loading log content");
        toast.current?.show({
          severity: "error",
          summary: "Gagal!",
          detail: response.message || "Gagal membaca isi log file",
          life: 3000
        });
      }
    } catch (error) {
      console.error("Error fetching log content:", error);
      setLogContent("Error loading log content");
    } finally {
      setIsLoadingLogContent(false);
    }
  };

  const handleCloseLogModal = () => {
    setIsLogModalOpen(false);
    setSelectedLogFile(null);
    setLogContent("");
  };

  const handleDeleteClick = () => {
    setIsDeleteConfirmOpen(true);
  };

  const handleDeleteConfirm = async () => {
    setIsDeleteConfirmOpen(false);
    setIsDeleting(true);

    try {
      const response = await deleteAllJobLogs();
      
      if (response.status === "success") {
        toast.current?.show({
          severity: "success",
          summary: "Berhasil!",
          detail: response.message || "Semua log files berhasil dihapus!",
          life: 3000
        });
        
        // Clear log files and refresh
        setLogFiles([]);
        setTimeout(() => {
          fetchLogFiles();
        }, 1000);
      } else {
        toast.current?.show({
          severity: "error",
          summary: "Gagal!",
          detail: response.message || "Gagal menghapus log files!",
          life: 3000
        });
      }
    } catch (error) {
      console.error("Error deleting log files:", error);
      toast.current?.show({
        severity: "error",
        summary: "Gagal!",
        detail: "Terjadi kesalahan saat menghapus log files!",
        life: 3000
      });
    } finally {
      setIsDeleting(false);
    }
  };

  const handleTriggerSingle = async () => {
    if (!selectedJob) {
      toast.current?.show({
        severity: "warn",
        summary: "Peringatan!",
        detail: "Pilih job terlebih dahulu!",
        life: 3000
      });
      return;
    }

    if (!selectedDate) {
      toast.current?.show({
        severity: "warn",
        summary: "Peringatan!",
        detail: "Pilih tanggal terlebih dahulu!",
        life: 3000
      });
      return;
    }

    setIsTriggeringSingle(true);
    
    // Dispatch event untuk start timer di JobProgressTracker
    window.dispatchEvent(new CustomEvent('jobTriggered'));
    
    try {
      const formattedDate = formatDateForAPI(selectedDate);
      const response = await triggerSingleJob(selectedJob, formattedDate);

      if (response.status === "success") {
        toast.current?.show({
          severity: "success",
          summary: "Berhasil!",
          detail: response.message || "Job berhasil dijalankan!",
          life: 5000
        });
      } else {
        toast.current?.show({
          severity: "error",
          summary: "Gagal!",
          detail: response.message || "Gagal menjalankan job!",
          life: 5000
        });
      }
    } catch (error) {
      toast.current?.show({
        severity: "error",
        summary: "Gagal!",
        detail: "Terjadi kesalahan saat menjalankan job!",
        life: 3000
      });
    } finally {
      setIsTriggeringSingle(false);
    }
  };

  const handleTriggerAll = async () => {
    if (!selectedDate) {
      toast.current?.show({
        severity: "warn",
        summary: "Peringatan!",
        detail: "Pilih tanggal terlebih dahulu!",
        life: 3000
      });
      return;
    }

    setIsTriggeringAll(true);
    
    // Dispatch event untuk start timer di JobProgressTracker
    window.dispatchEvent(new CustomEvent('jobTriggered'));
    
    try {
      const formattedDate = formatDateForAPI(selectedDate);
      const response = await triggerAllJobs(formattedDate);

      if (response.status === "success") {
        toast.current?.show({
          severity: "success",
          summary: "Berhasil!",
          detail: response.message || "Semua job berhasil dijalankan!",
          life: 5000
        });
      } else {
        toast.current?.show({
          severity: "error",
          summary: "Gagal!",
          detail: response.message || "Gagal menjalankan semua job!",
          life: 5000
        });
      }
    } catch (error) {
      console.error("Error triggering all jobs:", error);
      toast.current?.show({
        severity: "error",
        summary: "Gagal!",
        detail: "Terjadi kesalahan saat menjalankan semua job!",
        life: 3000
      });
    } finally {
      setIsTriggeringAll(false);
    }
  };

  return (
    <FadeInWrapper>
      <style jsx global>{`
        .p-toast {
          position: fixed !important;
          z-index: 9999 !important;
        }
        .p-toast-top-right {
          top: 20px !important;
          right: 20px !important;
        }
      `}</style>
      <Toast ref={toast} position="top-right" />
      
      {/* Delete Confirmation Dialog */}
      <ConfirmDialog
        isOpen={isDeleteConfirmOpen}
        onClose={() => setIsDeleteConfirmOpen(false)}
        onConfirm={handleDeleteConfirm}
        title="Konfirmasi Hapus"
        message={`Apakah Anda yakin ingin menghapus semua ${logFiles.length} log files hari ini? Tindakan ini tidak dapat dibatalkan.`}
        confirmLabel="Ya, Hapus Semua"
        cancelLabel="Batal"
        variant="danger"
      />
      
      <div className="min-h-screen bg-gray-50">
        <div className="p-6">
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
            {/* Header */}
            <div className="p-6 border-b border-gray-200">
              <h1 className="text-3xl font-bold text-gray-900">Trigger Manual Job</h1>
              <p className="text-gray-600 mt-1">Jalankan job indikator ESTR secara manual</p>
            </div>

            {/* Content */}
            <div className="p-6">
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Left Column - Form */}
                <div className="lg:col-span-2 space-y-6">
                  {/* Date Picker */}
                  <FormField label="Tanggal">
                    <TailwindDatePicker
                      value={selectedDate}
                      onChange={setSelectedDate}
                      placeholder="Pilih tanggal"
                    />
                    {/* <p className="text-xs text-gray-500 mt-1">Format: YYYY-MM-DD</p> */}
                  </FormField>

                  {/* Job Selection */}
                  <FormField label="Pilih Job">
                    <CustomListbox
                      value={selectedJob}
                      onChange={setSelectedJob}
                      options={JOB_LIST}
                      placeholder="Pilih job yang akan dijalankan"
                    />
                  </FormField>

                  {/* Action Buttons */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-4">
                    {/* Trigger Single Job */}
                    <button
                      onClick={handleTriggerSingle}
                      disabled={isTriggeringSingle || !selectedJob || !selectedDate}
                      className="flex items-center justify-center gap-2 px-6 py-3 bg-blue-600 hover:bg-blue-700 disabled:bg-blue-300 text-white rounded-lg font-medium transition-colors shadow-lg"
                    >
                      {isTriggeringSingle ? (
                        <>
                          <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                          Menjalankan Job...
                        </>
                      ) : (
                        <>
                          <Play className="w-5 h-5" />
                          Jalankan Job Terpilih
                        </>
                      )}
                    </button>

                    {/* Trigger All Jobs */}
                    <button
                      onClick={handleTriggerAll}
                      disabled={isTriggeringAll || !selectedDate}
                      className="flex items-center justify-center gap-2 px-6 py-3 bg-green-600 hover:bg-green-700 disabled:bg-green-300 text-white rounded-lg font-medium transition-colors shadow-lg"
                    >
                      {isTriggeringAll ? (
                        <>
                          <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                          Menjalankan Semua Job...
                        </>
                      ) : (
                        <>
                          <PlayCircle className="w-5 h-5" />
                          Jalankan Semua Job
                        </>
                      )}
                    </button>
                  </div>

                  {/* Info Box */}
                  <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                    <h3 className="text-sm font-semibold text-blue-900 mb-2">ℹ️ Informasi:</h3>
                    <ul className="text-sm text-blue-800 space-y-1.5 list-disc list-inside">
                      <li>Job ESTR berjalan otomatis setiap hari pada jam yang sudah ditentukan</li>
                      <li>Menu ini digunakan untuk trigger manual job dengan memilih tanggal tertentu</li>
                      <li>Klik "Jalankan Job Terpilih" untuk menjalankan satu job</li>
                      <li>Klik "Jalankan Semua Job" untuk menjalankan semua 18 job secara bersamaan</li>
                      <li>Proses mungkin memakan waktu beberapa saat tergantung volume data</li>
                      <li>Log hasil eksekusi dapat dilihat di bagian "Log Files Hari Ini"</li>
                      <li><strong>Job Progress Tracker</strong> akan muncul di pojok kanan bawah untuk menampilkan progress real-time</li>
                    </ul>
                  </div>
                </div>

                {/* Right Column - Job List */}
                <div className="lg:col-span-1">
                  <div className="bg-gray-50 border border-gray-200 rounded-lg p-4 sticky top-6">
                    <h3 className="text-sm font-semibold text-gray-900 mb-3">Daftar Job:</h3>
                    <div className="grid grid-cols-2 gap-2">
                      {JOB_LIST.map((job) => (
                        <div 
                          key={job.value} 
                          className={`flex items-center gap-2 p-2 rounded transition-colors ${
                            selectedJob === job.value ? 'bg-blue-100 text-blue-900' : 'hover:bg-gray-100'
                          }`}
                        >
                          <div className={`w-2 h-2 rounded-full flex-shrink-0 ${
                            selectedJob === job.value ? 'bg-blue-600' : 'bg-gray-400'
                          }`}></div>
                          <span className="font-medium text-sm text-gray-700">{job.label}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>

              {/* Log Files Section */}
              <div ref={logSectionRef} className="mt-8 pt-6 border-t border-gray-200">
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <h2 className="text-xl font-bold text-gray-900">Log Files Hari Ini</h2>
                    <p className="text-sm text-gray-600 mt-1">Daftar file log yang dihasilkan hari ini</p>
                  </div>
                  <div className="flex gap-2">
                    <button
                      onClick={handleDeleteClick}
                      disabled={isDeleting || logFiles.length === 0}
                      className="flex items-center gap-2 px-4 py-2 bg-red-600 hover:bg-red-700 disabled:bg-red-300 text-white rounded-lg font-medium transition-colors"
                    >
                      {isDeleting ? (
                        <>
                          <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                          Menghapus...
                        </>
                      ) : (
                        <>
                          <Trash2 className="w-4 h-4" />
                          Hapus Semua
                        </>
                      )}
                    </button>
                    <button
                      onClick={fetchLogFiles}
                      disabled={isLoadingLogs}
                      className="flex items-center gap-2 px-4 py-2 bg-gray-600 hover:bg-gray-700 disabled:bg-gray-400 text-white rounded-lg font-medium transition-colors"
                    >
                      <RefreshCw className={`w-4 h-4 ${isLoadingLogs ? 'animate-spin' : ''}`} />
                      Refresh
                    </button>
                  </div>
                  
                  {/* Demo Progress Tracker - Remove this after testing */}
                  {/* <button
                    onClick={() => {
                      // Trigger custom event to show demo progress
                      window.dispatchEvent(new CustomEvent('showDemoProgress'));
                    }}
                    className="flex items-center gap-2 px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-lg font-medium transition-colors text-sm"
                  >
                    Demo Progress
                  </button> */}
                </div>



                {isLoadingLogs ? (
                  <div className="flex justify-center items-center py-12">
                    <div className="w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
                  </div>
                ) : logFiles.length === 0 ? (
                  <div className="text-center py-12 bg-gray-50 rounded-lg border border-gray-200">
                    <FileText className="w-12 h-12 text-gray-400 mx-auto mb-3" />
                    <p className="text-gray-600">Belum ada file log hari ini</p>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {logFiles.map((logFile) => (
                      <button
                        key={logFile.filename}
                        onClick={() => handleViewLog(logFile)}
                        className="flex items-start gap-3 p-4 bg-white border border-gray-200 rounded-lg hover:border-blue-500 hover:shadow-md transition-all text-left group"
                      >
                        <FileText className="w-8 h-8 text-blue-500 flex-shrink-0 mt-1" />
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-semibold text-gray-900 truncate group-hover:text-blue-600">
                            {logFile.job_name}
                          </p>
                          <p className="text-xs text-gray-600 mt-1 truncate">
                            {logFile.filename}
                          </p>
                          <div className="flex items-center gap-3 mt-2 text-xs text-gray-500">
                            <span>{logFile.size_kb}</span>
                            <span>•</span>
                            <span>{new Date(logFile.modified_at).toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' })}</span>
                          </div>
                        </div>
                      </button>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Log Content Modal */}
      <Modal
        isOpen={isLogModalOpen}
        onClose={handleCloseLogModal}
        title={selectedLogFile ? `Log: ${selectedLogFile.job_name}` : "Log"}
        size="2xl"
        footer={
          <div className="flex justify-between items-center w-full">
            <div className="text-sm text-gray-600">
              {selectedLogFile && (
                <>
                  <span>{selectedLogFile.filename}</span>
                  <span className="mx-2">•</span>
                  <span>{selectedLogFile.size_kb}</span>
                  <span className="mx-2">•</span>
                  <span>{new Date(selectedLogFile.modified_at).toLocaleString('id-ID')}</span>
                </>
              )}
            </div>
            <button
              onClick={handleCloseLogModal}
              className="px-6 py-2 bg-gray-600 hover:bg-gray-700 text-white rounded-lg font-medium"
            >
              Tutup
            </button>
          </div>
        }
      >
        {isLoadingLogContent ? (
          <div className="flex justify-center items-center py-12">
            <div className="w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
          </div>
        ) : (
          <div className="bg-gray-900 text-gray-100 p-4 rounded-lg overflow-auto max-h-[600px] font-mono text-sm">
            <pre className="whitespace-pre-wrap break-words">{logContent}</pre>
          </div>
        )}
      </Modal>
    </FadeInWrapper>
  );
}
