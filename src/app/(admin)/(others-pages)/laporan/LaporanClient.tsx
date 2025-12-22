"use client";
import { useEffect, useState, useRef } from "react";
import { useRouter } from "next/navigation";
import { useSession } from "@/hooks/useSession";
import { CustomListbox } from "@/components/common/FormField";
import TailwindDatePicker from "@/components/common/TailwindDatePicker";
import { FileText, Search, FileSpreadsheet } from "lucide-react";
import { Toast } from "primereact/toast";
import DataTable from "@/components/common/DataTable";
import { getLaporanCabang, getLaporanOprKepatuhan, getLaporanSpvKepatuhan, getLaporanReject, getLaporanAll, getLaporanKeterlambatan } from "@/services/laporan";
import { generatePDF, downloadPDF, PDFColumn } from "@/utils/pdfGenerator";
import { generateExcel, downloadExcel, ExcelColumn } from "@/utils/excelGenerator";
import JSZip from "jszip";

interface LaporanOption {
  value: string;
  label: string;
}

export default function LaporanClient() {
  const router = useRouter();
  const toast = useRef<Toast>(null);
  const [isGenerating, setIsGenerating] = useState(false);

  const [formData, setFormData] = useState({
    jenisLaporan: "",
    tanggalMulai: null as Date | null,
    tanggalSelesai: null as Date | null
  });

  const [tableData, setTableData] = useState<any[]>([]);
  const [showTable, setShowTable] = useState(false);
  const [currentReportType, setCurrentReportType] = useState("");
  const [isLoadingTable, setIsLoadingTable] = useState(false);
  const [isExportingPDF, setIsExportingPDF] = useState(false);
  const [isExportingExcel, setIsExportingExcel] = useState(false);
  
  // Pagination state for laporan-all and laporan-reject
  const [pagination, setPagination] = useState({
    current_page: 1,
    total_pages: 0,
    total_records: 0,
    records_per_page: 10,
    has_next_page: false,
    has_prev_page: false
  });

  const { session, loading } = useSession();

  // Dynamic laporan options based on user profile
  const laporanOptions: LaporanOption[] = 
    session?.userProfile === "estr_spv_cab" || session?.userProfile === "estr_spv_kp"
      ? [
          { value: "", label: "Pilih Laporan" },
          { value: "laporan-cabang", label: "Laporan Cabang" }
        ]
      : [
          { value: "", label: "Pilih Laporan" },
          { value: "laporan-cabang", label: "Laporan Cabang" },
          { value: "laporan-opr-kepatuhan", label: "Laporan OPR Kepatuhan" },
          { value: "laporan-spv-kepatuhan", label: "Laporan SPV Kepatuhan" },
          { value: "laporan-reject", label: "Laporan Reject" },
          { value: "laporan-all", label: "Laporan All" },
          { value: "laporan-keterlambatan", label: "Laporan Keterlambatan" }
        ];

  useEffect(() => {
    if (!loading && !session) {
      router.push("/signin");
    }
  }, [session, loading, router]);

  const handleInputChange = (field: string, value: string | Date | null) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  // Function to fetch laporan-all with pagination
  const fetchLaporanAllWithPagination = async (page: number, limit: number) => {
    if (!formData.tanggalMulai || !formData.tanggalSelesai) return;

    setIsLoadingTable(true);

    try {
      const formatDateToYYYYMMDD = (date: Date) => {
        const year = date.getFullYear();
        const month = String(date.getMonth() + 1).padStart(2, '0');
        const day = String(date.getDate()).padStart(2, '0');
        return `${year}-${month}-${day}`;
      };

      const tanggalAwal = formatDateToYYYYMMDD(formData.tanggalMulai);
      const tanggalAkhir = formatDateToYYYYMMDD(formData.tanggalSelesai);

      const response = await getLaporanAll({
        tanggal_awal: tanggalAwal,
        tanggal_akhir: tanggalAkhir,
        page: page,
        limit: limit
      });

      if (response.status === "success" || response.status === "empty") {
        if (response.data && typeof response.data === 'object' && 'data' in response.data) {
          const dataArray = response.data.data || [];
          const paginationInfo = response.data.pagination || {};
          setTableData(dataArray);
          setPagination({
            current_page: paginationInfo.current_page || 1,
            total_pages: paginationInfo.total_pages || 0,
            total_records: paginationInfo.total_records || 0,
            records_per_page: paginationInfo.records_per_page || 50,
            has_next_page: paginationInfo.has_next_page || false,
            has_prev_page: paginationInfo.has_prev_page || false
          });
        } else {
          const dataArray = response.data || [];
          setTableData(dataArray);
        }
      } else {
        throw new Error(response.message || "Gagal mengambil data");
      }
    } catch (error) {
      console.error("Error fetching laporan all:", error);
      toast.current?.show({
        severity: "error",
        summary: "Gagal!",
        detail: error instanceof Error ? error.message : "Gagal mengambil data",
        life: 3000
      });
    } finally {
      setIsLoadingTable(false);
    }
  };

  // Function to fetch laporan-reject with pagination
  const fetchLaporanRejectWithPagination = async (page: number, limit: number) => {
    if (!formData.tanggalMulai || !formData.tanggalSelesai) return;

    setIsLoadingTable(true);

    try {
      const formatDateToYYYYMMDD = (date: Date) => {
        const year = date.getFullYear();
        const month = String(date.getMonth() + 1).padStart(2, '0');
        const day = String(date.getDate()).padStart(2, '0');
        return `${year}-${month}-${day}`;
      };

      const tanggalAwal = formatDateToYYYYMMDD(formData.tanggalMulai);
      const tanggalAkhir = formatDateToYYYYMMDD(formData.tanggalSelesai);

      const response = await getLaporanReject({
        tanggal_awal: tanggalAwal,
        tanggal_akhir: tanggalAkhir,
        page: page,
        limit: limit
      });

      if (response.status === "success" || response.status === "empty") {
        if (response.data && typeof response.data === 'object' && 'data' in response.data) {
          const dataArray = response.data.data || [];
          const paginationInfo = response.data.pagination || {};
          setTableData(dataArray);
          setPagination({
            current_page: paginationInfo.current_page || 1,
            total_pages: paginationInfo.total_pages || 0,
            total_records: paginationInfo.total_records || 0,
            records_per_page: paginationInfo.records_per_page || 50,
            has_next_page: paginationInfo.has_next_page || false,
            has_prev_page: paginationInfo.has_prev_page || false
          });
        } else {
          const dataArray = response.data || [];
          setTableData(dataArray);
        }
      } else {
        throw new Error(response.message || "Gagal mengambil data");
      }
    } catch (error) {
      console.error("Error fetching laporan reject:", error);
      toast.current?.show({
        severity: "error",
        summary: "Gagal!",
        detail: error instanceof Error ? error.message : "Gagal mengambil data",
        life: 3000
      });
    } finally {
      setIsLoadingTable(false);
    }
  };

  // Pagination handlers
  const handlePageChange = (newPage: number) => {
    if (currentReportType === "laporan-all") {
      fetchLaporanAllWithPagination(newPage, pagination.records_per_page);
    } else if (currentReportType === "laporan-reject") {
      fetchLaporanRejectWithPagination(newPage, pagination.records_per_page);
    }
  };

  const handleLimitChange = (newLimit: number) => {
    if (currentReportType === "laporan-all") {
      setPagination(prev => ({
        ...prev,
        records_per_page: newLimit
      }));
      fetchLaporanAllWithPagination(1, newLimit);
    } else if (currentReportType === "laporan-reject") {
      setPagination(prev => ({
        ...prev,
        records_per_page: newLimit
      }));
      fetchLaporanRejectWithPagination(1, newLimit);
    }
  };

  // Function to fetch all data for export (laporan-all only)
  const fetchAllDataForExport = async () => {
    if (!formData.tanggalMulai || !formData.tanggalSelesai) return [];

    try {
      const formatDateToYYYYMMDD = (date: Date) => {
        const year = date.getFullYear();
        const month = String(date.getMonth() + 1).padStart(2, '0');
        const day = String(date.getDate()).padStart(2, '0');
        return `${year}-${month}-${day}`;
      };

      const tanggalAwal = formatDateToYYYYMMDD(formData.tanggalMulai);
      const tanggalAkhir = formatDateToYYYYMMDD(formData.tanggalSelesai);

      // Fetch first page to get total records
      const firstResponse = await getLaporanAll({
        tanggal_awal: tanggalAwal,
        tanggal_akhir: tanggalAkhir,
        page: 1,
        limit: 5000
      });

      if (firstResponse.status !== "success" && firstResponse.status !== "empty") {
        throw new Error(firstResponse.message || "Gagal mengambil data");
      }

      let allData: any[] = [];
      
      if (firstResponse.data && typeof firstResponse.data === 'object' && 'data' in firstResponse.data) {
        const paginationInfo = firstResponse.data.pagination;
        const totalRecords = paginationInfo?.total_records || 0;
        const totalPages = Math.ceil(totalRecords / 5000);

        // Add first page data
        allData = [...(firstResponse.data.data || [])];

        // Fetch remaining pages
        for (let page = 2; page <= totalPages; page++) {
          const response = await getLaporanAll({
            tanggal_awal: tanggalAwal,
            tanggal_akhir: tanggalAkhir,
            page: page,
            limit: 5000
          });

          if (response.status === "success" || response.status === "empty") {
            if (response.data && typeof response.data === 'object' && 'data' in response.data) {
              allData = [...allData, ...(response.data.data || [])];
            }
          }
        }
      } else {
        allData = firstResponse.data || [];
      }

      return allData;
    } catch (error) {
      console.error("Error fetching all data:", error);
      throw error;
    }
  };

  // Function to fetch all reject data for export
  const fetchAllRejectDataForExport = async () => {
    if (!formData.tanggalMulai || !formData.tanggalSelesai) return [];

    try {
      const formatDateToYYYYMMDD = (date: Date) => {
        const year = date.getFullYear();
        const month = String(date.getMonth() + 1).padStart(2, '0');
        const day = String(date.getDate()).padStart(2, '0');
        return `${year}-${month}-${day}`;
      };

      const tanggalAwal = formatDateToYYYYMMDD(formData.tanggalMulai);
      const tanggalAkhir = formatDateToYYYYMMDD(formData.tanggalSelesai);

      // Fetch first page to get total records
      const firstResponse = await getLaporanReject({
        tanggal_awal: tanggalAwal,
        tanggal_akhir: tanggalAkhir,
        page: 1,
        limit: 5000
      });

      if (firstResponse.status !== "success" && firstResponse.status !== "empty") {
        throw new Error(firstResponse.message || "Gagal mengambil data");
      }

      let allData: any[] = [];
      
      if (firstResponse.data && typeof firstResponse.data === 'object' && 'data' in firstResponse.data) {
        const paginationInfo = firstResponse.data.pagination;
        const totalRecords = paginationInfo?.total_records || 0;
        const totalPages = Math.ceil(totalRecords / 5000);

        // Add first page data
        allData = [...(firstResponse.data.data || [])];

        // Fetch remaining pages
        for (let page = 2; page <= totalPages; page++) {
          const response = await getLaporanReject({
            tanggal_awal: tanggalAwal,
            tanggal_akhir: tanggalAkhir,
            page: page,
            limit: 5000
          });

          if (response.status === "success" || response.status === "empty") {
            if (response.data && typeof response.data === 'object' && 'data' in response.data) {
              allData = [...allData, ...(response.data.data || [])];
            }
          }
        }
      } else {
        allData = firstResponse.data || [];
      }

      return allData;
    } catch (error) {
      console.error("Error fetching all reject data:", error);
      throw error;
    }
  };

  const formatDate = (dateString: string) => {
    if (!dateString || dateString === "1970-01-01T00:00:00Z") return "-";
    const date = new Date(dateString);
    const day = date.getDate().toString().padStart(2, '0');
    const month = date.toLocaleDateString("en-US", { month: "short" });
    const year = date.getFullYear();
    return `${day}-${month}-${year}`;
  };

  const getFormattedTimestamp = () => {
    const now = new Date();
    const year = now.getFullYear();
    const month = String(now.getMonth() + 1).padStart(2, '0');
    const day = String(now.getDate()).padStart(2, '0');
    const hours = String(now.getHours()).padStart(2, '0');
    const minutes = String(now.getMinutes()).padStart(2, '0');
    const seconds = String(now.getSeconds()).padStart(2, '0');
    return `${year}${month}${day}${hours}${minutes}${seconds}`;
  };

  const getPDFColumns = (): PDFColumn[] => {
    switch (currentReportType) {
      case "laporan-cabang":
        return [
          { header: "No", key: "MANUAL_INDEX", width: 35 },
          { header: "No CIF", key: "NO_CIF", width: 75 },
          { header: "No Rekening", key: "NO_REK", width: 100 },
          { header: "Nama Nasabah", key: "NAMA_NASABAH", width: 130 },
          { header: "Kode Cabang", key: "CABANG", width: 55 },
          { header: "Tanggal Transaksi", key: "TANGGAL_LAPORAN", width: 80, render: (value: any) => formatDate(value) },
          { header: "Indikator STR", key: "INDIKATOR", width: 65 },
          { header: "Keterangan Indikator", key: "KETERANGAN", width: 130 },
          { header: "Keterangan OPR", key: "KET_CABANG_OPR", width: 100, render: (value: any) => value || "-" },
          { header: "Keterangan SPV", key: "KET_CABANG_SPV", width: 100, render: (value: any) => value || "-" },
          { header: "Input By", key: "INPUT_BY_CBG", width: 65 },
          { header: "Approved By Cabang", key: "OTOR_BY_CBG", width: 90, render: (value: any) => value || "-" },
          { header: "Status", key: "DESKRIPSI_STATUS", width: 100 }
        ];

      case "laporan-opr-kepatuhan":
        return [
          { header: "No", key: "MANUAL_INDEX", width: 35 },
          { header: "No CIF", key: "NO_CIF", width: 75 },
          { header: "No Rekening", key: "NO_REK", width: 100 },
          { header: "Nama Nasabah", key: "NAMA_NASABAH", width: 130 },
          { header: "Kode Cabang", key: "CABANG", width: 55 },
          { header: "Tanggal Transaksi", key: "TANGGAL_LAPORAN", width: 80, render: (value: any) => formatDate(value) },
          { header: "Indikator STR", key: "INDIKATOR", width: 65 },
          { header: "Keterangan Indikator", key: "KETERANGAN", width: 130 },
          { header: "Keterangan OPR Cabang", key: "KET_CABANG_OPR", width: 100, render: (value: any) => value || "-" },
          { header: "Keterangan SPV Cabang", key: "KET_CABANG_SPV", width: 100, render: (value: any) => value || "-" },
          { header: "Keterangan OPR Kepatuhan", key: "KET_KEPATUHAN", width: 110, render: (value: any) => value || "-" },
          { header: "Input By Cabang", key: "INPUT_BY_CBG", width: 75 },
          { header: "Approved By Cabang", key: "OTOR_BY_CBG", width: 90, render: (value: any) => value || "-" },
          { header: "Approved By OPR Kepatuhan", key: "OTOR_BY_KEP_OPR", width: 110, render: (value: any) => value || "-" },
          { header: "Status", key: "DESKRIPSI_STATUS", width: 100 }
        ];

      case "laporan-spv-kepatuhan":
        return [
          { header: "No", key: "MANUAL_INDEX", width: 35 },
          { header: "No CIF", key: "NO_CIF", width: 75 },
          { header: "No Rekening", key: "NO_REK", width: 100 },
          { header: "Nama Nasabah", key: "NAMA_NASABAH", width: 130 },
          { header: "Kode Cabang", key: "CABANG", width: 55 },
          { header: "Tanggal Transaksi", key: "TANGGAL_LAPORAN", width: 80, render: (value: any) => formatDate(value) },
          { header: "Indikator STR", key: "INDIKATOR", width: 65 },
          { header: "Keterangan Indikator", key: "KETERANGAN", width: 130 },
          { header: "Keterangan OPR Cabang", key: "KET_CABANG_OPR", width: 100, render: (value: any) => value || "-" },
          { header: "Keterangan SPV Cabang", key: "KET_CABANG_SPV", width: 100, render: (value: any) => value || "-" },
          { header: "Keterangan OPR Kepatuhan", key: "KET_KEPATUHAN", width: 110, render: (value: any) => value || "-" },
          { header: "Input By Cabang", key: "INPUT_BY_CBG", width: 75 },
          { header: "Approved By Cabang", key: "OTOR_BY_CBG", width: 90, render: (value: any) => value || "-" },
          { header: "Approved By OPR Kepatuhan", key: "OTOR_BY_KEP_OPR", width: 110, render: (value: any) => value || "-" },
          { header: "Approved By SPV Kepatuhan", key: "OTOR_BY_KEP_SPV", width: 110, render: (value: any) => value || "-" },
          { header: "Status", key: "DESKRIPSI_STATUS", width: 100 }
        ];

      case "laporan-reject":
        return [
          { header: "No", key: "MANUAL_INDEX", width: 35 },
          { header: "No CIF", key: "NO_CIF", width: 75 },
          { header: "No Rekening", key: "NO_REK", width: 100 },
          { header: "Nama Nasabah", key: "NAMA_NASABAH", width: 130 },
          { header: "Kode Cabang", key: "CABANG", width: 55 },
          { header: "Tanggal Transaksi", key: "TANGGAL_LAPORAN", width: 80, render: (value: any) => formatDate(value) },
          { header: "Indikator STR", key: "INDIKATOR", width: 65 },
          { header: "Keterangan Indikator", key: "KETERANGAN", width: 130 },
          { header: "Keterangan OPR Cabang", key: "KET_CABANG_OPR", width: 100, render: (value: any) => value || "-" },
          { header: "Keterangan SPV Cabang", key: "KET_CABANG_SPV", width: 100, render: (value: any) => value || "-" },
          { header: "Keterangan OPR Kepatuhan", key: "KET_KEPATUHAN", width: 110, render: (value: any) => value || "-" },
          { header: "Alasan Reject", key: "ALASAN_REJECT", width: 120 },
          { header: "Input By Cabang", key: "INPUT_BY_CBG", width: 75 },
          { header: "Status", key: "DESKRIPSI_STATUS", width: 100 }
        ];

      case "laporan-all":
        return [
          { header: "No", key: "MANUAL_INDEX", width: 35 },
          { header: "No CIF", key: "NO_CIF", width: 75 },
          { header: "No Rekening", key: "NO_REK", width: 100 },
          { header: "Nama Nasabah", key: "NAMA_NASABAH", width: 130 },
          { header: "Kode Cabang", key: "CABANG", width: 55 },
          { header: "Tanggal Transaksi", key: "TANGGAL_LAPORAN", width: 80, render: (value: any) => formatDate(value) },
          { header: "Indikator STR", key: "INDIKATOR", width: 65 },
          { header: "Keterangan Indikator", key: "KETERANGAN", width: 130 },
          { header: "Keterangan OPR Cabang", key: "KET_CABANG_OPR", width: 100, render: (value: any) => value || "-" },
          { header: "Keterangan SPV Cabang", key: "KET_CABANG_SPV", width: 100, render: (value: any) => value || "-" },
          { header: "Keterangan OPR Kepatuhan", key: "KET_KEPATUHAN", width: 110, render: (value: any) => value || "-" },
          { header: "Input By Cabang", key: "INPUT_BY_CBG", width: 75 },
          { header: "Approved By Cabang", key: "OTOR_BY_CBG", width: 90, render: (value: any) => value || "-" },
          { header: "Approved By OPR Kepatuhan", key: "OTOR_BY_KEP_OPR", width: 110, render: (value: any) => value || "-" },
          { header: "Approved By SPV Kepatuhan", key: "OTOR_BY_KEP_SPV", width: 110, render: (value: any) => value || "-" },
          { header: "Alasan Reject", key: "ALASAN_REJECT", width: 120, render: (value: any) => value || "-" },
          { header: "Transaksi Mencurigakan", key: "TRANSAKSI_MENCURIGAKAN", width: 90, render: (value: any) => value === "T" ? "Tidak" : value === "Y" ? "Ya" : "-" },
          { header: "Status", key: "DESKRIPSI_STATUS", width: 100 }
        ];

      case "laporan-keterlambatan":
        return [
          { header: "No", key: "MANUAL_INDEX", width: 40 },
          { header: "Tanggal", key: "tanggal_laporan", width: 100, render: (value: any) => formatDate(value) },
          { header: "Cabang", key: "daftar_cabang", width: 400 },
          { header: "Keterangan", key: "keterlambatan", width: 150, render: (value: number) => `Pernah terlambat ${value} kali` }
        ];

      default:
        return [
          { header: "No", key: "MANUAL_INDEX", width: 40 },
          { header: "Tanggal", key: "TANGGAL_LAPORAN", width: 100 },
          { header: "No CIF", key: "NO_CIF", width: 85 },
          { header: "Nama Nasabah", key: "NAMA_NASABAH", width: 150 },
          { header: "No Rekening", key: "NO_REK", width: 110 },
          { header: "Keterangan", key: "KETERANGAN", width: 150 }
        ];
    }
  };

  const handleExportPDF = async () => {
    if ((currentReportType === "laporan-all" || currentReportType === "laporan-reject") && pagination.total_records === 0) {
      toast.current?.show({
        severity: "warn",
        summary: "Peringatan!",
        detail: "Tidak ada data untuk di-export",
        life: 3000
      });
      return;
    }

    if (currentReportType !== "laporan-all" && currentReportType !== "laporan-reject" && tableData.length === 0) {
      toast.current?.show({
        severity: "warn",
        summary: "Peringatan!",
        detail: "Tidak ada data untuk di-export",
        life: 3000
      });
      return;
    }

    setIsExportingPDF(true);

    try {
      let allData: any[] = [];

      // For laporan-all or laporan-reject, fetch all data
      if (currentReportType === "laporan-all") {
        toast.current?.show({
          severity: "info",
          summary: "Memproses...",
          detail: "Mengambil semua data untuk export. Mohon tunggu...",
          life: 5000
        });
        allData = await fetchAllDataForExport();
      } else if (currentReportType === "laporan-reject") {
        toast.current?.show({
          severity: "info",
          summary: "Memproses...",
          detail: "Mengambil semua data untuk export. Mohon tunggu...",
          life: 5000
        });
        allData = await fetchAllRejectDataForExport();
      } else {
        allData = tableData;
      }

      if (allData.length === 0) {
        toast.current?.show({
          severity: "warn",
          summary: "Peringatan!",
          detail: "Tidak ada data untuk di-export",
          life: 3000
        });
        return;
      }

      const pdfColumns = getPDFColumns();
      const timestamp = getFormattedTimestamp();
      const maxRecordsPerFile = 5000;
      const totalFiles = Math.ceil(allData.length / maxRecordsPerFile);

      // For laporan-all or laporan-reject with data > 5000 (multiple files), create ZIP
      // For data ≤ 5000 (single file), download directly without ZIP
      if ((currentReportType === "laporan-all" || currentReportType === "laporan-reject") && totalFiles > 1) {
        const zip = new JSZip();

        // Generate all PDF files and add to ZIP
        for (let fileIndex = 0; fileIndex < totalFiles; fileIndex++) {
          const startIndex = fileIndex * maxRecordsPerFile;
          const endIndex = Math.min(startIndex + maxRecordsPerFile, allData.length);
          const fileData = allData.slice(startIndex, endIndex);

          // Add manual index to data
          const dataWithIndex = fileData.map((item, index) => ({
            ...item,
            MANUAL_INDEX: startIndex + index + 1
          }));

          const fileName = `${getReportFileName()}_Part${fileIndex + 1}of${totalFiles}.pdf`;

          // Calculate total width of all columns + margins
          const totalColumnsWidth = pdfColumns.reduce((sum, col) => sum + col.width, 0);
          const leftMargin = 40;
          const rightMargin = 40;
          const pageWidth = totalColumnsWidth + leftMargin + rightMargin;
          const pageHeight = 595.28; // Standard A4 height in landscape

          const pdfBlob = await generatePDF({
            title: getReportTitle(),
            data: dataWithIndex,
            columns: pdfColumns,
            headerInfo: {
              left: [
                { label: "Periode: ", value: `${formatDate(formData.tanggalMulai?.toISOString() || "")} s/d ${formatDate(formData.tanggalSelesai?.toISOString() || "")}` }
              ],
              right: [
                { label: "Total Data: ", value: `${fileData.length} (File ${fileIndex + 1}/${totalFiles})` }
              ]
            },
            orientation: "landscape",
            fileName: fileName,
            customPageSize: [pageWidth, pageHeight]
          });

          // Add file to ZIP
          zip.file(fileName, pdfBlob);
        }

        // Generate ZIP file
        const zipBlob = await zip.generateAsync({ type: "blob" });
        const zipFileName = `${getReportFileName()}_${timestamp}.zip`;

        // Download ZIP
        const url = URL.createObjectURL(zipBlob);
        const link = document.createElement("a");
        link.href = url;
        link.download = zipFileName;
        link.click();
        URL.revokeObjectURL(url);

        toast.current?.show({
          severity: "success",
          summary: "Berhasil!",
          detail: `ZIP berisi ${totalFiles} file PDF berhasil di-download`,
          life: 3000
        });
      } else {
        // Single file or non-laporan-all: download directly
        const startIndex = 0;
        const fileData = allData;

        // Add manual index to data
        const dataWithIndex = fileData.map((item, index) => ({
          ...item,
          MANUAL_INDEX: startIndex + index + 1
        }));

        const fileName = `${getReportFileName()}_${timestamp}.pdf`;

        // Calculate total width of all columns + margins
        const totalColumnsWidth = pdfColumns.reduce((sum, col) => sum + col.width, 0);
        const leftMargin = 40;
        const rightMargin = 40;
        const pageWidth = totalColumnsWidth + leftMargin + rightMargin;
        const pageHeight = 595.28; // Standard A4 height in landscape

        const pdfBlob = await generatePDF({
          title: getReportTitle(),
          data: dataWithIndex,
          columns: pdfColumns,
          headerInfo: {
            left: [
              { label: "Periode: ", value: `${formatDate(formData.tanggalMulai?.toISOString() || "")} s/d ${formatDate(formData.tanggalSelesai?.toISOString() || "")}` }
            ],
            right: [
              { label: "Total Data: ", value: String(allData.length) }
            ]
          },
          orientation: "landscape",
          fileName: fileName,
          customPageSize: [pageWidth, pageHeight]
        });

        downloadPDF(pdfBlob, fileName);

        toast.current?.show({
          severity: "success",
          summary: "Berhasil!",
          detail: "PDF berhasil di-download",
          life: 3000
        });
      }
    } catch (error) {
      console.error("Error generating PDF:", error);
      toast.current?.show({
        severity: "error",
        summary: "Gagal!",
        detail: "Gagal membuat PDF. Silakan coba lagi",
        life: 3000
      });
    } finally {
      setIsExportingPDF(false);
    }
  };

  const getExcelColumns = (): ExcelColumn[] => {
    switch (currentReportType) {
      case "laporan-cabang":
        return [
          { header: "No", key: "MANUAL_INDEX", width: 8 },
          { header: "No CIF", key: "NO_CIF", width: 15 },
          { header: "No Rekening", key: "NO_REK", width: 18 },
          { header: "Nama Nasabah", key: "NAMA_NASABAH", width: 30 },
          { header: "Kode Cabang", key: "CABANG", width: 12 },
          { header: "Tanggal Transaksi", key: "TANGGAL_LAPORAN", width: 18, render: (value: any) => formatDate(value) },
          { header: "Indikator STR", key: "INDIKATOR", width: 15 },
          { header: "Keterangan Indikator", key: "KETERANGAN", width: 35 },
          { header: "Keterangan OPR", key: "KET_CABANG_OPR", width: 25, render: (value: any) => value || "-" },
          { header: "Keterangan SPV", key: "KET_CABANG_SPV", width: 25, render: (value: any) => value || "-" },
          { header: "Input By", key: "INPUT_BY_CBG", width: 15 },
          { header: "Approved By Cabang", key: "OTOR_BY_CBG", width: 20, render: (value: any) => value || "-" },
          { header: "Status", key: "DESKRIPSI_STATUS", width: 25 }
        ];

      case "laporan-opr-kepatuhan":
        return [
          { header: "No", key: "MANUAL_INDEX", width: 8 },
          { header: "No CIF", key: "NO_CIF", width: 15 },
          { header: "No Rekening", key: "NO_REK", width: 18 },
          { header: "Nama Nasabah", key: "NAMA_NASABAH", width: 30 },
          { header: "Kode Cabang", key: "CABANG", width: 12 },
          { header: "Tanggal Transaksi", key: "TANGGAL_LAPORAN", width: 18, render: (value: any) => formatDate(value) },
          { header: "Indikator STR", key: "INDIKATOR", width: 15 },
          { header: "Keterangan Indikator", key: "KETERANGAN", width: 35 },
          { header: "Keterangan OPR Cabang", key: "KET_CABANG_OPR", width: 25, render: (value: any) => value || "-" },
          { header: "Keterangan SPV Cabang", key: "KET_CABANG_SPV", width: 25, render: (value: any) => value || "-" },
          { header: "Keterangan OPR Kepatuhan", key: "KET_KEPATUHAN", width: 30, render: (value: any) => value || "-" },
          { header: "Input By Cabang", key: "INPUT_BY_CBG", width: 18 },
          { header: "Approved By Cabang", key: "OTOR_BY_CBG", width: 20, render: (value: any) => value || "-" },
          { header: "Approved By OPR Kepatuhan", key: "OTOR_BY_KEP_OPR", width: 28, render: (value: any) => value || "-" },
          { header: "Status", key: "DESKRIPSI_STATUS", width: 25 }
        ];

      case "laporan-spv-kepatuhan":
        return [
          { header: "No", key: "MANUAL_INDEX", width: 8 },
          { header: "No CIF", key: "NO_CIF", width: 15 },
          { header: "No Rekening", key: "NO_REK", width: 18 },
          { header: "Nama Nasabah", key: "NAMA_NASABAH", width: 30 },
          { header: "Kode Cabang", key: "CABANG", width: 12 },
          { header: "Tanggal Transaksi", key: "TANGGAL_LAPORAN", width: 18, render: (value: any) => formatDate(value) },
          { header: "Indikator STR", key: "INDIKATOR", width: 15 },
          { header: "Keterangan Indikator", key: "KETERANGAN", width: 35 },
          { header: "Keterangan OPR Cabang", key: "KET_CABANG_OPR", width: 25, render: (value: any) => value || "-" },
          { header: "Keterangan SPV Cabang", key: "KET_CABANG_SPV", width: 25, render: (value: any) => value || "-" },
          { header: "Keterangan OPR Kepatuhan", key: "KET_KEPATUHAN", width: 30, render: (value: any) => value || "-" },
          { header: "Input By Cabang", key: "INPUT_BY_CBG", width: 18 },
          { header: "Approved By Cabang", key: "OTOR_BY_CBG", width: 20, render: (value: any) => value || "-" },
          { header: "Approved By OPR Kepatuhan", key: "OTOR_BY_KEP_OPR", width: 28, render: (value: any) => value || "-" },
          { header: "Approved By SPV Kepatuhan", key: "OTOR_BY_KEP_SPV", width: 28, render: (value: any) => value || "-" },
          { header: "Status", key: "DESKRIPSI_STATUS", width: 25 }
        ];

      case "laporan-reject":
        return [
          { header: "No", key: "MANUAL_INDEX", width: 8 },
          { header: "No CIF", key: "NO_CIF", width: 15 },
          { header: "No Rekening", key: "NO_REK", width: 18 },
          { header: "Nama Nasabah", key: "NAMA_NASABAH", width: 30 },
          { header: "Kode Cabang", key: "CABANG", width: 12 },
          { header: "Tanggal Transaksi", key: "TANGGAL_LAPORAN", width: 18, render: (value: any) => formatDate(value) },
          { header: "Indikator STR", key: "INDIKATOR", width: 15 },
          { header: "Keterangan Indikator", key: "KETERANGAN", width: 35 },
          { header: "Keterangan OPR Cabang", key: "KET_CABANG_OPR", width: 25, render: (value: any) => value || "-" },
          { header: "Keterangan SPV Cabang", key: "KET_CABANG_SPV", width: 25, render: (value: any) => value || "-" },
          { header: "Keterangan OPR Kepatuhan", key: "KET_KEPATUHAN", width: 30, render: (value: any) => value || "-" },
          { header: "Alasan Reject", key: "ALASAN_REJECT", width: 30 },
          { header: "Input By Cabang", key: "INPUT_BY_CBG", width: 18 },
          { header: "Status", key: "DESKRIPSI_STATUS", width: 25 }
        ];

      case "laporan-all":
        return [
          { header: "No", key: "MANUAL_INDEX", width: 8 },
          { header: "No CIF", key: "NO_CIF", width: 15 },
          { header: "No Rekening", key: "NO_REK", width: 18 },
          { header: "Nama Nasabah", key: "NAMA_NASABAH", width: 30 },
          { header: "Kode Cabang", key: "CABANG", width: 12 },
          { header: "Tanggal Transaksi", key: "TANGGAL_LAPORAN", width: 18, render: (value: any) => formatDate(value) },
          { header: "Indikator STR", key: "INDIKATOR", width: 15 },
          { header: "Keterangan Indikator", key: "KETERANGAN", width: 35 },
          { header: "Keterangan OPR Cabang", key: "KET_CABANG_OPR", width: 25, render: (value: any) => value || "-" },
          { header: "Keterangan SPV Cabang", key: "KET_CABANG_SPV", width: 25, render: (value: any) => value || "-" },
          { header: "Keterangan OPR Kepatuhan", key: "KET_KEPATUHAN", width: 30, render: (value: any) => value || "-" },
          { header: "Input By Cabang", key: "INPUT_BY_CBG", width: 18 },
          { header: "Approved By Cabang", key: "OTOR_BY_CBG", width: 20, render: (value: any) => value || "-" },
          { header: "Approved By OPR Kepatuhan", key: "OTOR_BY_KEP_OPR", width: 28, render: (value: any) => value || "-" },
          { header: "Approved By SPV Kepatuhan", key: "OTOR_BY_KEP_SPV", width: 28, render: (value: any) => value || "-" },
          { header: "Alasan Reject", key: "ALASAN_REJECT", width: 30, render: (value: any) => value || "-" },
          { header: "Transaksi Mencurigakan", key: "TRANSAKSI_MENCURIGAKAN", width: 25, render: (value: any) => value === "T" ? "Tidak" : value === "Y" ? "Ya" : "-" },
          { header: "Status", key: "DESKRIPSI_STATUS", width: 25 }
        ];

      case "laporan-keterlambatan":
        return [
          { header: "No", key: "MANUAL_INDEX", width: 8 },
          { header: "Tanggal", key: "tanggal_laporan", width: 18, render: (value: any) => formatDate(value) },
          { header: "Cabang", key: "daftar_cabang", width: 60 },
          { header: "Keterangan", key: "keterlambatan", width: 30, render: (value: number) => `Pernah terlambat ${value} kali` }
        ];

      default:
        return [
          { header: "No", key: "MANUAL_INDEX", width: 8 },
          { header: "Tanggal", key: "TANGGAL_LAPORAN", width: 18 },
          { header: "No CIF", key: "NO_CIF", width: 15 },
          { header: "Nama Nasabah", key: "NAMA_NASABAH", width: 30 },
          { header: "No Rekening", key: "NO_REK", width: 18 },
          { header: "Keterangan", key: "KETERANGAN", width: 35 }
        ];
    }
  };

  const handleExportExcel = async () => {
    if ((currentReportType === "laporan-all" || currentReportType === "laporan-reject") && pagination.total_records === 0) {
      toast.current?.show({
        severity: "warn",
        summary: "Peringatan!",
        detail: "Tidak ada data untuk di-export",
        life: 3000
      });
      return;
    }

    if (currentReportType !== "laporan-all" && currentReportType !== "laporan-reject" && tableData.length === 0) {
      toast.current?.show({
        severity: "warn",
        summary: "Peringatan!",
        detail: "Tidak ada data untuk di-export",
        life: 3000
      });
      return;
    }

    setIsExportingExcel(true);

    try {
      let allData: any[] = [];

      // For laporan-all or laporan-reject, fetch all data
      if (currentReportType === "laporan-all") {
        toast.current?.show({
          severity: "info",
          summary: "Memproses...",
          detail: "Mengambil semua data untuk export. Mohon tunggu...",
          life: 5000
        });
        allData = await fetchAllDataForExport();
      } else if (currentReportType === "laporan-reject") {
        toast.current?.show({
          severity: "info",
          summary: "Memproses...",
          detail: "Mengambil semua data untuk export. Mohon tunggu...",
          life: 5000
        });
        allData = await fetchAllRejectDataForExport();
      } else {
        allData = tableData;
      }

      if (allData.length === 0) {
        toast.current?.show({
          severity: "warn",
          summary: "Peringatan!",
          detail: "Tidak ada data untuk di-export",
          life: 3000
        });
        return;
      }

      const excelColumns = getExcelColumns();
      const timestamp = getFormattedTimestamp();
      const maxRecordsPerFile = 5000;
      const totalFiles = Math.ceil(allData.length / maxRecordsPerFile);

      // For laporan-all or laporan-reject with data > 5000 (multiple files), create ZIP
      // For data ≤ 5000 (single file), download directly without ZIP
      if ((currentReportType === "laporan-all" || currentReportType === "laporan-reject") && totalFiles > 1) {
        const zip = new JSZip();

        // Generate all Excel files and add to ZIP
        for (let fileIndex = 0; fileIndex < totalFiles; fileIndex++) {
          const startIndex = fileIndex * maxRecordsPerFile;
          const endIndex = Math.min(startIndex + maxRecordsPerFile, allData.length);
          const fileData = allData.slice(startIndex, endIndex);

          // Add manual index to data
          const dataWithIndex = fileData.map((item, index) => ({
            ...item,
            MANUAL_INDEX: startIndex + index + 1
          }));

          const fileName = `${getReportFileName()}_Part${fileIndex + 1}of${totalFiles}.xlsx`;

          const excelBlob = await generateExcel({
            title: getReportTitle(),
            data: dataWithIndex,
            columns: excelColumns,
            headerInfo: {
              left: [
                { label: "Periode: ", value: `${formatDate(formData.tanggalMulai?.toISOString() || "")} s/d ${formatDate(formData.tanggalSelesai?.toISOString() || "")}` }
              ],
              right: [
                { label: "Total Data: ", value: `${fileData.length} (File ${fileIndex + 1}/${totalFiles})` }
              ]
            },
            fileName: fileName,
            sheetName: getReportTitle()
          });

          // Add file to ZIP
          zip.file(fileName, excelBlob);
        }

        // Generate ZIP file
        const zipBlob = await zip.generateAsync({ type: "blob" });
        const zipFileName = `${getReportFileName()}_${timestamp}.zip`;

        // Download ZIP
        const url = URL.createObjectURL(zipBlob);
        const link = document.createElement("a");
        link.href = url;
        link.download = zipFileName;
        link.click();
        URL.revokeObjectURL(url);

        toast.current?.show({
          severity: "success",
          summary: "Berhasil!",
          detail: `ZIP berisi ${totalFiles} file Excel berhasil di-download`,
          life: 3000
        });
      } else {
        // Single file or non-laporan-all: download directly
        const startIndex = 0;
        const fileData = allData;

        // Add manual index to data
        const dataWithIndex = fileData.map((item, index) => ({
          ...item,
          MANUAL_INDEX: startIndex + index + 1
        }));

        const fileName = `${getReportFileName()}_${timestamp}.xlsx`;

        const excelBlob = await generateExcel({
          title: getReportTitle(),
          data: dataWithIndex,
          columns: excelColumns,
          headerInfo: {
            left: [
              { label: "Periode: ", value: `${formatDate(formData.tanggalMulai?.toISOString() || "")} s/d ${formatDate(formData.tanggalSelesai?.toISOString() || "")}` }
            ],
            right: [
              { label: "Total Data: ", value: String(allData.length) }
            ]
          },
          fileName: fileName,
          sheetName: getReportTitle()
        });

        downloadExcel(excelBlob, fileName);

        toast.current?.show({
          severity: "success",
          summary: "Berhasil!",
          detail: "Excel berhasil di-download",
          life: 3000
        });
      }
    } catch (error) {
      console.error("Error generating Excel:", error);
      toast.current?.show({
        severity: "error",
        summary: "Gagal!",
        detail: "Gagal membuat Excel. Silakan coba lagi",
        life: 3000
      });
    } finally {
      setIsExportingExcel(false);
    }
  };

  const handleGenerateReport = async () => {
    if (!formData.jenisLaporan) {
      toast.current?.show({
        severity: "warn",
        summary: "Peringatan!",
        detail: "Silakan pilih jenis laporan terlebih dahulu",
        life: 3000
      });
      return;
    }

    if (!formData.tanggalMulai || !formData.tanggalSelesai) {
      toast.current?.show({
        severity: "warn",
        summary: "Peringatan!",
        detail: "Silakan pilih periode tanggal terlebih dahulu",
        life: 3000
      });
      return;
    }

    if (formData.jenisLaporan === "laporan-cabang" && !session?.branchCode) {
      toast.current?.show({
        severity: "error",
        summary: "Error!",
        detail: "Kode cabang tidak ditemukan. Silakan login ulang",
        life: 3000
      });
      return;
    }

    setIsGenerating(true);
    setIsLoadingTable(true);
    setCurrentReportType(formData.jenisLaporan);
    setShowTable(true); // Show table immediately with skeleton
    
    // Reset pagination for new report
    setPagination({
      current_page: 1,
      total_pages: 0,
      total_records: 0,
      records_per_page: 10,
      has_next_page: false,
      has_prev_page: false
    });

    try {
      // Format dates to YYYY-MM-DD in local timezone
      const formatDateToYYYYMMDD = (date: Date) => {
        const year = date.getFullYear();
        const month = String(date.getMonth() + 1).padStart(2, '0');
        const day = String(date.getDate()).padStart(2, '0');
        return `${year}-${month}-${day}`;
      };

      const tanggalAwal = formatDateToYYYYMMDD(formData.tanggalMulai);
      const tanggalAkhir = formatDateToYYYYMMDD(formData.tanggalSelesai);

      if (formData.jenisLaporan === "laporan-cabang") {
        // Call API for Laporan Cabang
        // Use kode_cabang 888 for estr_spv_kp or estr_opr_kp profiles
        const kodeCabang = 
          session?.userProfile === "estr_spv_kp" || session?.userProfile === "estr_opr_kp"
            ? "888"
            : session?.branchCode || "";
        
        const response = await getLaporanCabang({
          tanggal_awal: tanggalAwal,
          tanggal_akhir: tanggalAkhir,
          kode_cabang: kodeCabang
        });

        if (response.status === "success" || response.status === "empty") {
          setTableData(response.data || []);
          setIsLoadingTable(false);
        } else {
          throw new Error(response.message || "Gagal mengambil data");
        }
      } else if (formData.jenisLaporan === "laporan-opr-kepatuhan") {
        // Call API for Laporan OPR Kepatuhan
        const response = await getLaporanOprKepatuhan({
          tanggal_awal: tanggalAwal,
          tanggal_akhir: tanggalAkhir
        });

        if (response.status === "success" || response.status === "empty") {
          setTableData(response.data || []);
          setIsLoadingTable(false);
        } else {
          throw new Error(response.message || "Gagal mengambil data");
        }
      } else if (formData.jenisLaporan === "laporan-spv-kepatuhan") {
        // Call API for Laporan SPV Kepatuhan
        const response = await getLaporanSpvKepatuhan({
          tanggal_awal: tanggalAwal,
          tanggal_akhir: tanggalAkhir
        });

        if (response.status === "success" || response.status === "empty") {
          setTableData(response.data || []);
          setIsLoadingTable(false);
        } else {
          throw new Error(response.message || "Gagal mengambil data");
        }
      } else if (formData.jenisLaporan === "laporan-reject") {
        // Call API for Laporan Reject with pagination
        await fetchLaporanRejectWithPagination(1, 50);
      } else if (formData.jenisLaporan === "laporan-all") {
        // Call API for Laporan All with pagination
        await fetchLaporanAllWithPagination(1, 50);
      } else if (formData.jenisLaporan === "laporan-keterlambatan") {
        // Call API for Laporan Keterlambatan
        const response = await getLaporanKeterlambatan({
          tanggal_awal: tanggalAwal,
          tanggal_akhir: tanggalAkhir
        });

        if (response.status === "success" || response.status === "empty") {
          setTableData(response.data || []);
          setIsLoadingTable(false);
        } else {
          throw new Error(response.message || "Gagal mengambil data");
        }
      } else {
        // For other report types, show message
        toast.current?.show({
          severity: "info",
          summary: "Info",
          detail: "Jenis laporan ini belum tersedia",
          life: 3000
        });
        setIsLoadingTable(false);
        setShowTable(false);
      }
    } catch (error) {
      console.error("Error generating report:", error);
      setIsLoadingTable(false);
      setShowTable(false);
      toast.current?.show({
        severity: "error",
        summary: "Gagal!",
        detail: error instanceof Error ? error.message : "Gagal membuat laporan. Silakan coba lagi",
        life: 3000
      });
    } finally {
      setIsGenerating(false);
    }
  };

  const getReportTitle = () => {
    switch (currentReportType) {
      case "laporan-cabang":
        return "Laporan Cabang";
      case "laporan-opr-kepatuhan":
        return "Laporan OPR Kepatuhan";
      case "laporan-spv-kepatuhan":
        return "Laporan SPV Kepatuhan";
      case "laporan-reject":
        return "Laporan Reject";
      case "laporan-all":
        return "Laporan All";
      case "laporan-keterlambatan":
        return "Laporan Keterlambatan";
      default:
        return "Laporan Data";
    }
  };

  const getReportFileName = () => {
    switch (currentReportType) {
      case "laporan-cabang":
        return "Laporan_Cabang";
      case "laporan-opr-kepatuhan":
        return "Laporan_OPR_Kepatuhan";
      case "laporan-spv-kepatuhan":
        return "Laporan_SPV_Kepatuhan";
      case "laporan-reject":
        return "Laporan_Reject";
      case "laporan-all":
        return "Laporan_All";
      case "laporan-keterlambatan":
        return "Laporan_Keterlambatan";
      default:
        return "Laporan_Data";
    }
  };

  const getTableColumns = () => {
    switch (currentReportType) {
      case "laporan-cabang":
        return [
          { 
            key: "NO", 
            label: "No", 
            className: "text-center w-16",
            render: (_: any, __: any, index: number) => index
          },
          { key: "NO_CIF", label: "No CIF" },
          { key: "NO_REK", label: "No Rekening" },
          { key: "NAMA_NASABAH", label: "Nama Nasabah", className: "font-medium" },
          { key: "CABANG", label: "Kode Cabang" },
          { 
            key: "TANGGAL_LAPORAN", 
            label: "Tanggal Transaksi",
            render: (value: string) => formatDate(value)
          },
          { key: "INDIKATOR", label: "Indikator STR" },
          { key: "KETERANGAN", label: "Keterangan Indikator" },
          { key: "KET_CABANG_OPR", label: "Keterangan OPR", render: (value: string | null) => value || "-" },
          { key: "KET_CABANG_SPV", label: "Keterangan SPV", render: (value: string | null) => value || "-" },
          { key: "INPUT_BY_CBG", label: "Input By" },
          { key: "OTOR_BY_CBG", label: "Approved By Cabang", render: (value: string | null) => value || "-" },
          {
            key: "DESKRIPSI_STATUS", 
            label: "Status",
            className: "text-center",
            render: (value: string, row: any) => {
              const statusColorMap: { [key: string]: string } = {
                "1": "text-blue-600",      // Input Cabang
                "2": "text-yellow-600",    // Belum Otorisasi Cabang
                "3": "text-green-600",     // Sudah Otorisasi Cabang
                "4": "text-green-600",     // Sudah Otorisasi OPR Kepatuhan
                "5": "text-blue-600",      // Simpan Data OPR Kepatuhan
                "6": "text-green-600",     // Sudah Otorisasi SPV Kepatuhan
                "9": "text-red-600",       // Reject SPV Cabang
                "99": "text-red-600",      // Reject OPR Kepatuhan
                "999": "text-red-600",     // Reject SPV Kepatuhan
                "10": "text-red-600"       // Reject System
              };
              const color = statusColorMap[row.STATUS] || "text-gray-600";
              return (
                <span className={`font-medium ${color}`}>
                  {value}
                </span>
              );
            }
          }
        ];

      case "laporan-opr-kepatuhan":
        return [
          { 
            key: "NO", 
            label: "No", 
            className: "text-center w-16",
            render: (_: any, __: any, index: number) => index
          },
          { key: "NO_CIF", label: "No CIF" },
          { key: "NO_REK", label: "No Rekening" },
          { key: "NAMA_NASABAH", label: "Nama Nasabah", className: "font-medium" },
          { key: "CABANG", label: "Kode Cabang" },
          { 
            key: "TANGGAL_LAPORAN", 
            label: "Tanggal Transaksi",
            render: (value: string) => formatDate(value)
          },
          { key: "INDIKATOR", label: "Indikator STR" },
          { key: "KETERANGAN", label: "Keterangan Indikator" },
          { key: "KET_CABANG_OPR", label: "Keterangan OPR Cabang", render: (value: string | null) => value || "-" },
          { key: "KET_CABANG_SPV", label: "Keterangan SPV Cabang", render: (value: string | null) => value || "-" },
          { key: "KET_KEPATUHAN", label: "Keterangan OPR Kepatuhan", render: (value: string | null) => value || "-" },
          { key: "INPUT_BY_CBG", label: "Input By Cabang" },
          { key: "OTOR_BY_CBG", label: "Approved By Cabang", render: (value: string | null) => value || "-" },
          { key: "OTOR_BY_KEP_OPR", label: "Approved By OPR Kepatuhan", render: (value: string | null) => value || "-" },
          {
            key: "DESKRIPSI_STATUS", 
            label: "Status",
            className: "text-center",
            render: (value: string, row: any) => {
              const statusColorMap: { [key: string]: string } = {
                "1": "text-blue-600",      // Input Cabang
                "2": "text-yellow-600",    // Belum Otorisasi Cabang
                "3": "text-green-600",     // Sudah Otorisasi Cabang
                "4": "text-green-600",     // Sudah Otorisasi OPR Kepatuhan
                "5": "text-blue-600",      // Simpan Data OPR Kepatuhan
                "6": "text-green-600",     // Sudah Otorisasi SPV Kepatuhan
                "9": "text-red-600",       // Reject SPV Cabang
                "99": "text-red-600",      // Reject OPR Kepatuhan
                "999": "text-red-600",     // Reject SPV Kepatuhan
                "10": "text-red-600"       // Reject System
              };
              const color = statusColorMap[row.STATUS] || "text-gray-600";
              return (
                <span className={`font-medium ${color}`}>
                  {value}
                </span>
              );
            }
          }
        ];

      case "laporan-spv-kepatuhan":
        return [
          { 
            key: "NO", 
            label: "No", 
            className: "text-center w-16",
            render: (_: any, __: any, index: number) => index
          },
          { key: "NO_CIF", label: "No CIF" },
          { key: "NO_REK", label: "No Rekening" },
          { key: "NAMA_NASABAH", label: "Nama Nasabah", className: "font-medium" },
          { key: "CABANG", label: "Kode Cabang" },
          { 
            key: "TANGGAL_LAPORAN", 
            label: "Tanggal Transaksi",
            render: (value: string) => formatDate(value)
          },
          { key: "INDIKATOR", label: "Indikator STR" },
          { key: "KETERANGAN", label: "Keterangan Indikator" },
          { key: "KET_CABANG_OPR", label: "Keterangan OPR Cabang", render: (value: string | null) => value || "-" },
          { key: "KET_CABANG_SPV", label: "Keterangan SPV Cabang", render: (value: string | null) => value || "-" },
          { key: "KET_KEPATUHAN", label: "Keterangan OPR Kepatuhan", render: (value: string | null) => value || "-" },
          { key: "INPUT_BY_CBG", label: "Input By Cabang" },
          { key: "OTOR_BY_CBG", label: "Approved By Cabang", render: (value: string | null) => value || "-" },
          { key: "OTOR_BY_KEP_OPR", label: "Approved By OPR Kepatuhan", render: (value: string | null) => value || "-" },
          { key: "OTOR_BY_KEP_SPV", label: "Approved By SPV Kepatuhan", render: (value: string | null) => value || "-" },
          {
            key: "DESKRIPSI_STATUS", 
            label: "Status",
            className: "text-center",
            render: (value: string, row: any) => {
              const statusColorMap: { [key: string]: string } = {
                "1": "text-blue-600",      // Input Cabang
                "2": "text-yellow-600",    // Belum Otorisasi Cabang
                "3": "text-green-600",     // Sudah Otorisasi Cabang
                "4": "text-green-600",     // Sudah Otorisasi OPR Kepatuhan
                "5": "text-blue-600",      // Simpan Data OPR Kepatuhan
                "6": "text-green-600",     // Sudah Otorisasi SPV Kepatuhan
                "9": "text-red-600",       // Reject SPV Cabang
                "99": "text-red-600",      // Reject OPR Kepatuhan
                "999": "text-red-600",     // Reject SPV Kepatuhan
                "10": "text-red-600"       // Reject System
              };
              const color = statusColorMap[row.STATUS] || "text-gray-600";
              return (
                <span className={`font-medium ${color}`}>
                  {value}
                </span>
              );
            }
          }
        ];

      case "laporan-reject":
        return [
          { 
            key: "NO", 
            label: "No", 
            className: "text-center w-16",
            render: (_: any, __: any, index: number) => index
          },
          { key: "NO_CIF", label: "No CIF" },
          { key: "NO_REK", label: "No Rekening" },
          { key: "NAMA_NASABAH", label: "Nama Nasabah", className: "font-medium" },
          { key: "CABANG", label: "Kode Cabang" },
          { 
            key: "TANGGAL_LAPORAN", 
            label: "Tanggal Transaksi",
            render: (value: string) => formatDate(value)
          },
          { key: "INDIKATOR", label: "Indikator STR" },
          { key: "KETERANGAN", label: "Keterangan Indikator" },
          { key: "KET_CABANG_OPR", label: "Keterangan OPR Cabang", render: (value: string | null) => value || "-" },
          { key: "KET_CABANG_SPV", label: "Keterangan SPV Cabang", render: (value: string | null) => value || "-" },
          { key: "KET_KEPATUHAN", label: "Keterangan OPR Kepatuhan", render: (value: string | null) => value || "-" },
          { key: "ALASAN_REJECT", label: "Alasan Reject", className: "font-medium text-red-600" },
          { key: "INPUT_BY_CBG", label: "Input By Cabang" },
          {
            key: "DESKRIPSI_STATUS", 
            label: "Status",
            className: "text-center",
            render: (value: string, row: any) => {
              const statusColorMap: { [key: string]: string } = {
                "1": "text-blue-600",      // Input Cabang
                "2": "text-yellow-600",    // Belum Otorisasi Cabang
                "3": "text-green-600",     // Sudah Otorisasi Cabang
                "4": "text-green-600",     // Sudah Otorisasi OPR Kepatuhan
                "5": "text-blue-600",      // Simpan Data OPR Kepatuhan
                "6": "text-green-600",     // Sudah Otorisasi SPV Kepatuhan
                "9": "text-red-600",       // Reject SPV Cabang
                "99": "text-red-600",      // Reject OPR Kepatuhan
                "999": "text-red-600",     // Reject SPV Kepatuhan
                "10": "text-red-600"       // Reject System
              };
              const color = statusColorMap[row.STATUS] || "text-gray-600";
              return (
                <span className={`font-medium ${color}`}>
                  {value}
                </span>
              );
            }
          }
        ];

      case "laporan-all":
        return [
          { 
            key: "NO", 
            label: "No", 
            className: "text-center w-16",
            render: (_: any, __: any, index: number) => index
          },
          { key: "NO_CIF", label: "No CIF" },
          { key: "NO_REK", label: "No Rekening" },
          { key: "NAMA_NASABAH", label: "Nama Nasabah", className: "font-medium" },
          { key: "CABANG", label: "Kode Cabang" },
          { 
            key: "TANGGAL_LAPORAN", 
            label: "Tanggal Transaksi",
            render: (value: string) => formatDate(value)
          },
          { key: "INDIKATOR", label: "Indikator STR" },
          { key: "KETERANGAN", label: "Keterangan Indikator" },
          { key: "KET_CABANG_OPR", label: "Keterangan OPR Cabang", render: (value: string | null) => value || "-" },
          { key: "KET_CABANG_SPV", label: "Keterangan SPV Cabang", render: (value: string | null) => value || "-" },
          { key: "KET_KEPATUHAN", label: "Keterangan OPR Kepatuhan", render: (value: string | null) => value || "-" },
          { key: "INPUT_BY_CBG", label: "Input By Cabang" },
          { key: "OTOR_BY_CBG", label: "Approved By Cabang", render: (value: string | null) => value || "-" },
          { key: "OTOR_BY_KEP_OPR", label: "Approved By OPR Kepatuhan", render: (value: string | null) => value || "-" },
          { key: "OTOR_BY_KEP_SPV", label: "Approved By SPV Kepatuhan", render: (value: string | null) => value || "-" },
          { key: "ALASAN_REJECT", label: "Alasan Reject", className: "font-medium text-red-600", render: (value: string | null) => value || "-" },
          { 
            key: "TRANSAKSI_MENCURIGAKAN", 
            label: "Transaksi Mencurigakan",
            className: "text-center",
            render: (value: string | null) => {
              if (value === "T") {
                return <span className="font-medium text-red-600">Tidak</span>;
              }
              if (value === "Y") {
                return <span className="font-medium text-orange-600">Ya</span>;
              }
              return <span className="text-gray-500">-</span>;
            }
          },
          {
            key: "DESKRIPSI_STATUS", 
            label: "Status",
            className: "text-center",
            render: (value: string, row: any) => {
              const statusColorMap: { [key: string]: string } = { 
                "1": "text-blue-600",      // Input Cabang
                "2": "text-yellow-600",    // Belum Otorisasi Cabang
                "3": "text-green-600",     // Sudah Otorisasi Cabang
                "4": "text-green-600",     // Sudah Otorisasi OPR Kepatuhan
                "5": "text-blue-600",      // Simpan Data OPR Kepatuhan
                "6": "text-green-600",     // Sudah Otorisasi SPV Kepatuhan
                "9": "text-red-600",       // Reject SPV Cabang
                "99": "text-red-600",      // Reject OPR Kepatuhan
                "999": "text-red-600",     // Reject SPV Kepatuhan
                "10": "text-red-600"       // Reject System
              };
              const color = statusColorMap[row.STATUS] || "text-gray-600";
              return (
                <span className={`font-medium ${color}`}>
                  {value}
                </span>
              );
            }
          }
        ];

      case "laporan-keterlambatan":
        return [
          { 
            key: "NO", 
            label: "No", 
            className: "text-center w-16",
            render: (_: any, __: any, index: number) => index
          },
          { 
            key: "tanggal_laporan", 
            label: "Tanggal",
            render: (value: string) => formatDate(value)
          },
          { 
            key: "daftar_cabang", 
            label: "Cabang",
            className: "min-w-[300px] max-w-[600px]",
            render: (value: string) => (
              <div className="text-sm text-gray-700 break-all whitespace-normal">
                {value}
              </div>
            )
          },
          { 
            key: "keterlambatan", 
            label: "Keterangan",
            render: (value: number) => {
              // Define color mapping for different keterlambatan values
              const colorMap: { [key: number]: string } = {
                0: "text-green-600 font-medium",
                1: "text-yellow-600 font-medium",
                2: "text-orange-600 font-medium",
                3: "text-red-600 font-medium",
                4: "text-purple-600 font-medium",
                5: "text-pink-600 font-medium"
              };
              
              // Default color for values > 5
              const color = colorMap[value] || "text-red-800 font-bold";
              
              return (
                <span className={color}>
                  Pernah terlambat {value} kali
                </span>
              );
            }
          }
        ];

      default:
        return [
          { key: "NO", label: "No", className: "text-center w-16" },
          { key: "TANGGAL_LAPORAN", label: "Tanggal" },
          { key: "NO_CIF", label: "No CIF" },
          { key: "NAMA_NASABAH", label: "Nama Nasabah", className: "font-medium" },
          { key: "NO_REK", label: "No Rekening" },
          { key: "KETERANGAN", label: "Keterangan" }
        ];
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Toast ref={toast} />

      <div className="p-6">
        {/* Main Card Container */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-visible">
          {/* Header */}
          <div className="p-6 border-b border-gray-200">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div>
                  <h1 className="text-3xl font-bold text-gray-900">Laporan Data Nasabah</h1>
                  <p className="text-gray-600 mt-1">Generate dan unduh laporan data nasabah</p>
                </div>
              </div>
            </div>
          </div>

          {/* Content */}
          <div className="p-6">
            {/* Form Controls Row */}
            <div className="flex items-end gap-4 mb-10">
              {/* Periode Section */}
              <div className="flex items-end gap-3">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Periode</label>
                  <div className="w-40">
                    <TailwindDatePicker
                      value={formData.tanggalMulai}
                      onChange={(date) => handleInputChange('tanggalMulai', date)}
                      placeholder="Periode Awal"
                      roundedClass="rounded-lg"
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">&nbsp;</label>
                  <div className="w-40">
                    <TailwindDatePicker
                      value={formData.tanggalSelesai}
                      onChange={(date) => handleInputChange('tanggalSelesai', date)}
                      placeholder="Periode Akhir"
                      roundedClass="rounded-lg"
                    />
                  </div>
                </div>
              </div>

              {/* Jenis Laporan Section */}
              <div className="flex items-end gap-3">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Jenis Laporan</label>
                  <div className="w-[300px] h-10">
                    <CustomListbox
                      value={formData.jenisLaporan}
                      onChange={(value) => handleInputChange("jenisLaporan", value)}
                      options={laporanOptions}
                      placeholder="Pilih jenis laporan"
                      className="h-10 !rounded-lg"
                    />
                  </div>
                </div>
              </div>

              {/* Inquiry Button */}
              <div>
                <button
                  onClick={handleGenerateReport}
                  disabled={isGenerating}
                  className="flex items-center gap-3 px-6 py-2 bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white rounded-lg font-medium transition-colors shadow-lg h-10"
                >
                  {isGenerating ? (
                    <>
                      <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                      Loading...
                    </>
                  ) : (
                    <>
                      <Search className="w-4 h-4" />
                      Inquiry
                    </>
                  )}
                </button>
              </div>
            </div>

            {/* Content Table Area */}
            <div className="rounded bg-white">
              {showTable ? (
                isLoadingTable ? (
                  // Skeleton Table
                  <div className="bg-white rounded-lg shadow-sm border border-gray-200">
                    {/* Header with real title */}
                    <div className="p-6 border-b border-gray-200">
                      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                        <div>
                          <h2 className="text-2xl font-bold text-gray-900 mb-2">{getReportTitle()}</h2>
                          <p className="text-gray-600">Memuat data laporan...</p>
                        </div>
                        <div className="flex gap-2">
                          <div className="h-10 bg-gray-200 rounded-lg w-64 animate-pulse"></div>
                        </div>
                      </div>
                    </div>

                    {/* Skeleton Table */}
                    <div className="p-6">
                      <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
                        <div className="overflow-x-auto">
                          <table className="w-full border-collapse">
                            <thead>
                              <tr style={{ backgroundColor: '#161950' }}>
                                {getTableColumns().map((column, index) => (
                                  <th key={index} className="border border-gray-300 px-4 py-3 text-left text-sm font-medium text-white">
                                    {column.label}
                                  </th>
                                ))}
                              </tr>
                            </thead>
                            <tbody>
                              {Array.from({ length: 8 }, (_, rowIndex) => (
                                <tr
                                  key={rowIndex}
                                  className={rowIndex % 2 === 0 ? 'bg-white' : 'bg-gray-50'}
                                >
                                  {getTableColumns().map((column, colIndex) => (
                                    <td key={colIndex} className="border border-gray-300 px-4 py-3">
                                      <div className={`h-4 bg-gray-200 rounded animate-pulse ${colIndex === 0 ? 'w-6 mx-auto' :
                                          colIndex === 1 ? (rowIndex % 3 === 0 ? 'w-20' : rowIndex % 3 === 1 ? 'w-16' : 'w-18') :
                                            colIndex === 2 ? (rowIndex % 2 === 0 ? 'w-24' : 'w-20') :
                                              colIndex === 3 ? (rowIndex % 4 === 0 ? 'w-32' : rowIndex % 4 === 1 ? 'w-28' : rowIndex % 4 === 2 ? 'w-36' : 'w-40') :
                                                'w-24'
                                        }`} style={{ animationDelay: `${rowIndex * 100 + colIndex * 50}ms` }}></div>
                                    </td>
                                  ))}
                                </tr>
                              ))}
                            </tbody>
                          </table>
                        </div>
                      </div>

                      {/* Pagination Skeleton */}
                      <div className="p-4 border-t border-gray-200">
                        <div className="flex flex-col md:flex-row md:justify-between md:items-center gap-4">
                          <div className="flex items-center gap-2">
                            <span className="text-sm text-gray-700">Tampilkan</span>
                            <div className="h-8 bg-gray-200 rounded w-16 animate-pulse"></div>
                            <span className="text-sm text-gray-700">data per halaman</span>
                          </div>
                          <div className="flex-1 text-center">
                            <div className="h-4 bg-gray-200 rounded w-32 mx-auto animate-pulse"></div>
                          </div>
                          <div className="flex gap-2">
                            {Array.from({ length: 5 }, (_, i) => (
                              <div key={i} className="h-8 w-8 bg-gray-200 rounded animate-pulse"></div>
                            ))}
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                ) : (
                  <>
                    {/* Real Data Table */}
                    <DataTable
                      data={tableData}
                      columns={getTableColumns()}
                      title={getReportTitle()}
                      searchFields={["NAMA_NASABAH", "NO_CIF", "NO_REK", "KETERANGAN", "INDIKATOR", "CABANG"]}
                      emptyMessage="Data tidak ditemukan."
                      tableMinWidth={currentReportType === "laporan-all" ? "2000px" : undefined}
                      fixedCardWidth={currentReportType === "laporan-all"}
                      loading={isLoadingTable}
                      itemsPerPageOptions={[10, 25, 50]}
                      defaultItemsPerPage={(currentReportType === "laporan-all" || currentReportType === "laporan-reject") ? 50 : 10}
                      serverSidePagination={currentReportType === "laporan-all" || currentReportType === "laporan-reject"}
                      totalRecords={(currentReportType === "laporan-all" || currentReportType === "laporan-reject") ? pagination.total_records : undefined}
                      currentPage={(currentReportType === "laporan-all" || currentReportType === "laporan-reject") ? pagination.current_page : undefined}
                      onPageChange={(currentReportType === "laporan-all" || currentReportType === "laporan-reject") ? handlePageChange : undefined}
                      onItemsPerPageChange={(currentReportType === "laporan-all" || currentReportType === "laporan-reject") ? handleLimitChange : undefined}
                      itemsPerPageValue={(currentReportType === "laporan-all" || currentReportType === "laporan-reject") ? pagination.records_per_page : undefined}
                      searchRightActions={
                        <div className="flex gap-2">
                          <button
                            onClick={handleExportPDF}
                            disabled={isGenerating || tableData.length === 0 || isExportingPDF || isExportingExcel}
                            className="flex items-center gap-2 px-4 py-2 bg-red-600 hover:bg-red-700 disabled:bg-red-400 text-white rounded-lg font-medium transition-colors text-sm min-w-[160px]"
                          >
                            {isExportingPDF ? (
                              <>
                                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                                Exporting...
                              </>
                            ) : (
                              <>
                                <i className="pi pi-file-pdf text-base" />
                                Export to PDF
                              </>
                            )}
                          </button>
                          <button
                            onClick={handleExportExcel}
                            disabled={isGenerating || tableData.length === 0 || isExportingPDF || isExportingExcel}
                            className="flex items-center gap-2 px-4 py-2 bg-green-600 hover:bg-green-700 disabled:bg-green-400 text-white rounded-lg font-medium transition-colors text-sm min-w-[170px]"
                          >
                            {isExportingExcel ? (
                              <>
                                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                                Exporting...
                              </>
                            ) : (
                              <>
                                <i className="pi pi-file-excel text-base" />
                                Export to Excel
                              </>
                            )}
                          </button>
                        </div>
                      }
                    />
                  </>
                )
              ) : (
                <div className="p-4">
                  {/* <p className="text-gray-500 text-center">Pilih jenis laporan dan periode</p> */}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}