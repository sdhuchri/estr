"use client";
import { useEffect, useState, useRef } from "react";
import { useRouter } from "next/navigation";
import { useSession } from "@/hooks/useSession";
import { CustomListbox } from "@/components/common/FormField";
import TailwindDatePicker from "@/components/common/TailwindDatePicker";
import { FileText, Search, FileSpreadsheet } from "lucide-react";
import { Toast } from "primereact/toast";
import DataTable from "@/components/common/DataTable";
import { getLaporanCabang, getLaporanOprKepatuhan, getLaporanSpvKepatuhan, getLaporanReject, getLaporanAll } from "@/services/laporan";
import { generatePDF, downloadPDF, PDFColumn } from "@/utils/pdfGenerator";
import { generateExcel, downloadExcel, ExcelColumn } from "@/utils/excelGenerator";

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

  const laporanOptions: LaporanOption[] = [
    { value: "", label: "Pilih Laporan" },
    { value: "laporan-cabang", label: "Laporan Cabang" },
    { value: "laporan-opr-kepatuhan", label: "Laporan OPR Kepatuhan" },
    { value: "laporan-spv-kepatuhan", label: "Laporan SPV Kepatuhan" },
    { value: "laporan-reject", label: "Laporan Reject" },
    { value: "laporan-all", label: "Laporan All" },
    { value: "laporan-belum-tarik-data-redflag", label: "Laporan Belum Tarik Data Redflag" }
  ];

  const { session, loading } = useSession();

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

  const handleExportPDF = async () => {
    if (tableData.length === 0) {
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
      // Add manual index to data
      const dataWithIndex = tableData.map((item, index) => ({
        ...item,
        MANUAL_INDEX: index + 1
      }));

      const pdfColumns: PDFColumn[] = [
        { header: "No", key: "MANUAL_INDEX", width: 40 },
        { header: "No CIF", key: "NO_CIF", width: 85 },
        { header: "No Rekening", key: "NO_REK", width: 110 },
        { header: "Nama Nasabah", key: "NAMA_NASABAH", width: 150 },
        { header: "Cabang", key: "CABANG", width: 60 },
        { header: "Tanggal", key: "TANGGAL_LAPORAN", width: 85, render: (value: any) => formatDate(value) },
        { header: "Indikator", key: "INDIKATOR", width: 75 },
        { header: "Keterangan", key: "KETERANGAN", width: 150 },
        { header: "Ket OPR", key: "KET_CABANG_OPR", width: 110, render: (value: any) => value || "-" },
        { header: "Ket SPV", key: "KET_CABANG_SPV", width: 110, render: (value: any) => value || "-" },
        { header: "Input By", key: "INPUT_BY_CBG", width: 75 },
        { header: "Status", key: "DESKRIPSI_STATUS", width: 110 }
      ];

      const fileName = `${getReportFileName()}_${getFormattedTimestamp()}.pdf`;

      const pdfBlob = await generatePDF({
        title: getReportTitle(),
        data: dataWithIndex,
        columns: pdfColumns,
        headerInfo: {
          left: [
            { label: "Periode: ", value: `${formatDate(formData.tanggalMulai?.toISOString() || "")} s/d ${formatDate(formData.tanggalSelesai?.toISOString() || "")}` }
          ],
          right: [
            { label: "Total Data: ", value: String(tableData.length) }
          ]
        },
        orientation: "landscape",
        fileName: fileName,
        customPageSize: [1200, 595.28]
      });

      downloadPDF(pdfBlob, fileName);
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

  const handleExportExcel = async () => {
    if (tableData.length === 0) {
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
      // Add manual index to data
      const dataWithIndex = tableData.map((item, index) => ({
        ...item,
        MANUAL_INDEX: index + 1
      }));

      const excelColumns: ExcelColumn[] = [
        { header: "No", key: "MANUAL_INDEX", width: 8 },
        { header: "No CIF", key: "NO_CIF", width: 15 },
        { header: "No Rekening", key: "NO_REK", width: 18 },
        { header: "Nama Nasabah", key: "NAMA_NASABAH", width: 25 },
        { header: "Cabang", key: "CABANG", width: 10 },
        { header: "Tanggal", key: "TANGGAL_LAPORAN", width: 15, render: (value: any) => formatDate(value) },
        { header: "Indikator", key: "INDIKATOR", width: 12 },
        { header: "Keterangan", key: "KETERANGAN", width: 30 },
        { header: "Ket OPR", key: "KET_CABANG_OPR", width: 20, render: (value: any) => value || "-" },
        { header: "Ket SPV", key: "KET_CABANG_SPV", width: 20, render: (value: any) => value || "-" },
        { header: "Input By", key: "INPUT_BY_CBG", width: 15 },
        { header: "Status", key: "DESKRIPSI_STATUS", width: 25 }
      ];

      const fileName = `${getReportFileName()}_${getFormattedTimestamp()}.xlsx`;

      const excelBlob = await generateExcel({
        title: getReportTitle(),
        data: dataWithIndex,
        columns: excelColumns,
        headerInfo: {
          left: [
            { label: "Periode: ", value: `${formatDate(formData.tanggalMulai?.toISOString() || "")} s/d ${formatDate(formData.tanggalSelesai?.toISOString() || "")}` }
          ],
          right: [
            { label: "Total Data: ", value: String(tableData.length) }
          ]
        },
        fileName: fileName,
        sheetName: getReportTitle()
      });

      downloadExcel(excelBlob, fileName);
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

    setIsGenerating(true);
    setIsLoadingTable(true);
    setCurrentReportType(formData.jenisLaporan);
    setShowTable(true); // Show table immediately with skeleton

    try {
      // Format dates to YYYY-MM-DD
      const tanggalAwal = formData.tanggalMulai.toISOString().split('T')[0];
      const tanggalAkhir = formData.tanggalSelesai.toISOString().split('T')[0];

      if (formData.jenisLaporan === "laporan-cabang") {
        // Call API for Laporan Cabang
        const response = await getLaporanCabang({
          tanggal_awal: tanggalAwal,
          tanggal_akhir: tanggalAkhir
        });

        if (response.status === "success") {
          setTableData(response.data);
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

        if (response.status === "success") {
          setTableData(response.data);
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

        if (response.status === "success") {
          setTableData(response.data);
          setIsLoadingTable(false);
        } else {
          throw new Error(response.message || "Gagal mengambil data");
        }
      } else if (formData.jenisLaporan === "laporan-reject") {
        // Call API for Laporan Reject
        const response = await getLaporanReject({
          tanggal_awal: tanggalAwal,
          tanggal_akhir: tanggalAkhir
        });

        if (response.status === "success") {
          setTableData(response.data);
          setIsLoadingTable(false);
        } else {
          throw new Error(response.message || "Gagal mengambil data");
        }
      } else if (formData.jenisLaporan === "laporan-all") {
        // Call API for Laporan All
        const response = await getLaporanAll({
          tanggal_awal: tanggalAwal,
          tanggal_akhir: tanggalAkhir
        });

        if (response.status === "success") {
          setTableData(response.data);
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
      case "laporan-belum-tarik-data-redflag":
        return "Laporan Belum Tarik Data Redflag";
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
      case "laporan-belum-tarik-data-redflag":
        return "Laporan_Belum_Tarik_Data_Redflag";
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
                  // Real Data Table
                  <DataTable
                    data={tableData}
                    columns={getTableColumns()}
                    title={getReportTitle()}
                    searchFields={["NAMA_NASABAH", "NO_CIF", "NO_REK", "KETERANGAN", "INDIKATOR", "CABANG"]}
                    emptyMessage="Belum ada data laporan. Silakan lakukan inquiry terlebih dahulu."
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