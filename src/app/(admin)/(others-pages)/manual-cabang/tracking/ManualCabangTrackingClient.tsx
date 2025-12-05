"use client";
import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import { useSession } from "@/hooks/useSession";
import { CustomListbox } from "@/components/common/FormField";
import TailwindDatePicker from "@/components/common/TailwindDatePicker";
import DataTable from "@/components/common/DataTable";
import { Toast } from "primereact/toast";
import { getManualCabangTracking } from "@/services/manualCabang";
import { Download } from "lucide-react";
import { generatePDF, downloadPDF, formatDateToDDMMYYYY, PDFColumn } from "@/utils/pdfGenerator";
import FadeInWrapper from "@/components/common/FadeInWrapper";

interface TrackingData {
  NO: number;
  CABANG: string;
  CABANG_INDUK: string;
  INPUT_BY_CBG: string;
  NAMA_NASABAH: string;
  NO_CIF: string;
  OTOR_BY_CBG: string | null;
  OTOR_BY_KEP_OPR: string | null;
  OTOR_BY_KEP_SPV: string | null;
  STATUS: string;
  STATUS_TEXT: string;
  TANGGAL_INPUT: string;
  TANGGAL_LAPORAN: string;
  TANGGAL_OTOR_CSO: string | null;
  TANGGAL_OTOR_OPR_KEP: string | null;
  TANGGAL_OTOR_SPV_KEP: string | null;
}

export default function ManualCabangTrackingClient() {
  const router = useRouter();
  const toast = useRef<Toast>(null);
  const { session, loading } = useSession();

  const [tableData, setTableData] = useState<TrackingData[]>([]);
  const [filteredData, setFilteredData] = useState<TrackingData[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Filter states
  const [filterStatus, setFilterStatus] = useState("");
  const [filterTanggalAwal, setFilterTanggalAwal] = useState<Date | null>(null);
  const [filterTanggalAkhir, setFilterTanggalAkhir] = useState<Date | null>(null);
  const [isGeneratingPDF, setIsGeneratingPDF] = useState(false);

  // Fetch tracking data
  useEffect(() => {
    const fetchTrackingData = async () => {
      if (!session?.branchCode) return;

      try {
        setIsLoading(true);
        const response = await getManualCabangTracking(session.branchCode);

        if (response.status === "success" && response.data) {
          // Add formatted fields for search
          const dataWithFormattedFields = response.data.map((item: TrackingData) => ({
            ...item,
            TANGGAL_FORMATTED: formatDate(item.TANGGAL_LAPORAN),
            TGL_PROSES_FORMATTED: formatDateTime(item.INPUT_BY_CBG, item.TANGGAL_INPUT),
            OTOR_SPV_CABANG_FORMATTED: formatDateTime(item.OTOR_BY_CBG, item.TANGGAL_OTOR_CSO),
            OTOR_OPR_KEP_FORMATTED: formatDateTime(item.OTOR_BY_KEP_OPR, item.TANGGAL_OTOR_OPR_KEP),
            OTOR_SPV_KEP_FORMATTED: formatDateTime(item.OTOR_BY_KEP_SPV, item.TANGGAL_OTOR_SPV_KEP)
          }));
          setTableData(dataWithFormattedFields);
          setFilteredData(dataWithFormattedFields);
        } else {
          toast.current?.show({
            severity: "error",
            summary: "Error",
            detail: response.message || "Gagal memuat data tracking",
            life: 3000
          });
        }
      } catch (error) {
        console.error("Error fetching tracking data:", error);
        toast.current?.show({
          severity: "error",
          summary: "Error",
          detail: "Terjadi kesalahan saat memuat data",
          life: 3000
        });
      } finally {
        setIsLoading(false);
      }
    };

    if (session) {
      fetchTrackingData();
    }
  }, [session]);

  // Filter options
  const statusOptions = [
    { value: "", label: "Semua Status" },
    { value: "Inputan Cabang OPR", label: "Inputan Cabang OPR" },
    { value: "Otor Cabang SPV", label: "Otor Cabang SPV" },
    { value: "Otor Kepatuhan OPR", label: "Otor Kepatuhan OPR" },
    { value: "Otor Kepatuhan SPV", label: "Otor Kepatuhan SPV" },
    { value: "Selesai", label: "Selesai" },
    { value: "Reject", label: "Reject" }
  ];

  useEffect(() => {
    if (!loading && !session) {
      router.push("/signin");
    }
  }, [session, loading, router]);



  // Apply filters
  useEffect(() => {
    let filtered = [...tableData];

    // Filter by status
    if (filterStatus) {
      filtered = filtered.filter(item => item.STATUS_TEXT === filterStatus);
    }

    // Filter by date range
    if (filterTanggalAwal && filterTanggalAkhir) {
      filtered = filtered.filter(item => {
        const itemDate = new Date(item.TANGGAL_LAPORAN);
        const startDate = new Date(filterTanggalAwal.getFullYear(), filterTanggalAwal.getMonth(), filterTanggalAwal.getDate());
        const endDate = new Date(filterTanggalAkhir.getFullYear(), filterTanggalAkhir.getMonth(), filterTanggalAkhir.getDate());
        const checkDate = new Date(itemDate.getFullYear(), itemDate.getMonth(), itemDate.getDate());

        return checkDate >= startDate && checkDate <= endDate;
      });
    }

    setFilteredData(filtered);
  }, [filterStatus, filterTanggalAwal, filterTanggalAkhir, tableData]);

  const formatDate = (dateString: string | null) => {
    if (!dateString || dateString === "1970-01-01") return "-";
    const date = new Date(dateString);
    const day = date.getDate().toString().padStart(2, '0');
    const month = date.toLocaleDateString("en-US", { month: "short" });
    const year = date.getFullYear();
    return `${day}-${month}-${year}`;
  };

  const formatDateTime = (user: string | null, date: string | null) => {
    if (!user || !date || date === "1970-01-01") return "-";
    return `${user} - ${formatDate(date)}`;
  };

  const handleDownloadPDF = async () => {
    if (filteredData.length === 0) {
      toast.current?.show({
        severity: "warn",
        summary: "Peringatan",
        detail: "Tidak ada data untuk diexport",
        life: 3000
      });
      return;
    }

    try {
      setIsGeneratingPDF(true);

      const userId = session?.userId || "Unknown User";
      const now = new Date();
      const dateStr = `${String(now.getDate()).padStart(2, "0")}-${String(now.getMonth() + 1).padStart(2, "0")}-${now.getFullYear()}`;
      const timeStr = `${String(now.getHours()).padStart(2, "0")}:${String(now.getMinutes()).padStart(2, "0")}:${String(now.getSeconds()).padStart(2, "0")}`;

      // Define PDF columns
      const pdfColumns: PDFColumn[] = [
        { header: "No", key: "NO", width: 35 },
        { header: "No CIF", key: "NO_CIF", width: 80 },
        { header: "Nama Nasabah", key: "NAMA_NASABAH", width: 110 },
        { header: "Cabang", key: "CABANG", width: 90 },
        {
          header: "Tanggal",
          key: "TANGGAL_LAPORAN",
          width: 70,
          render: (value: string) => formatDate(value)
        },
        {
          header: "Tgl Proses",
          key: "tglProses",
          width: 100,
          render: (_: any, item: TrackingData) => formatDateTime(item.INPUT_BY_CBG, item.TANGGAL_INPUT)
        },
        {
          header: "Otor SPV Cabang",
          key: "otorSPVCabang",
          width: 100,
          render: (_: any, item: TrackingData) => formatDateTime(item.OTOR_BY_CBG, item.TANGGAL_OTOR_CSO)
        },
        {
          header: "Otor OPR Kep",
          key: "otorOPRKep",
          width: 100,
          render: (_: any, item: TrackingData) => formatDateTime(item.OTOR_BY_KEP_OPR, item.TANGGAL_OTOR_OPR_KEP)
        },
        {
          header: "Otor SPV Kep",
          key: "otorSPVKep",
          width: 100,
          render: (_: any, item: TrackingData) => formatDateTime(item.OTOR_BY_KEP_SPV, item.TANGGAL_OTOR_SPV_KEP)
        },
        { header: "Status", key: "STATUS_TEXT", width: 90 }
      ];

      // Prepare header info
      const headerInfo = {
        left: [
          {
            label: "Periode Data",
            value: ` : ${formatDateToDDMMYYYY(filterTanggalAwal) || "Semua"} — ${formatDateToDDMMYYYY(filterTanggalAkhir) || "Semua"}`
          },
          {
            label: "Status",
            value: ` : ${filterStatus || "Semua Status"}`
          }
        ],
        right: [
          { label: "Tanggal Generate", value: ` : ${dateStr} ${timeStr}` },
          { label: "User Generate", value: ` : ${userId}` }
        ]
      };

      // Prepare data with row numbers
      const pdfData = filteredData.map((item, index) => ({
        ...item,
        NO: index + 1
      }));

      // Generate PDF
      const pdfBlob = await generatePDF({
        title: "Tracking Manual Cabang",
        data: pdfData,
        columns: pdfColumns,
        headerInfo,
        orientation: "landscape"
      });

      // Download PDF
      downloadPDF(pdfBlob, `tracking-manual-cabang-${dateStr}.pdf`);

      toast.current?.show({
        severity: "success",
        summary: "Berhasil",
        detail: "PDF berhasil diunduh",
        life: 3000
      });
    } catch (error) {
      console.error("Error generating PDF:", error);
      toast.current?.show({
        severity: "error",
        summary: "Error",
        detail: "Gagal generate PDF",
        life: 3000
      });
    } finally {
      setIsGeneratingPDF(false);
    }
  };

  // Define columns for DataTable
  const columns = [
    {
      key: "rowNumber",
      label: "No",
      className: "text-center w-16",
      render: (_: any, __: any, rowNumber: number) => rowNumber
    },
    { key: "NO_CIF", label: "No CIF" },
    { key: "NAMA_NASABAH", label: "Nama Nasabah", className: "font-medium" },
    { key: "CABANG", label: "Cabang" },
    {
      key: "TANGGAL_LAPORAN",
      label: "Tanggal",
      render: (value: string) => formatDate(value)
    },
    {
      key: "tglProses",
      label: "Tgl Proses",
      render: (_: any, item: TrackingData) => formatDateTime(item.INPUT_BY_CBG, item.TANGGAL_INPUT)
    },
    {
      key: "otorSPVCabang",
      label: "Otor SPV Cabang",
      render: (_: any, item: TrackingData) => formatDateTime(item.OTOR_BY_CBG, item.TANGGAL_OTOR_CSO)
    },
    {
      key: "otorOPRKep",
      label: "Otor OPR Kep",
      render: (_: any, item: TrackingData) => formatDateTime(item.OTOR_BY_KEP_OPR, item.TANGGAL_OTOR_OPR_KEP)
    },
    {
      key: "otorSPVKep",
      label: "Otor SPV Kep",
      render: (_: any, item: TrackingData) => formatDateTime(item.OTOR_BY_KEP_SPV, item.TANGGAL_OTOR_SPV_KEP)
    },
    {
      key: "STATUS_TEXT",
      label: "Status",
      className: "text-center",
      render: (value: string) => {
        const statusColors: Record<string, string> = {
          "Inputan Cabang OPR": "bg-blue-100 text-blue-800",
          "Otor Cabang SPV": "bg-purple-100 text-purple-800",
          "Otor Kepatuhan OPR": "bg-yellow-100 text-yellow-800",
          "Otor Kepatuhan SPV": "bg-orange-100 text-orange-800",
          "Selesai": "bg-green-100 text-green-800",
          "Reject": "bg-red-100 text-red-800"
        };
        return (
          <span className={`px-2 py-1 rounded-full text-xs font-medium ${statusColors[value] || "bg-gray-100 text-gray-800"}`}>
            {value}
          </span>
        );
      }
    }
  ];

  const searchFields = [
    "NO_CIF",
    "NAMA_NASABAH",
    "CABANG",
    "TANGGAL_FORMATTED",
    "TGL_PROSES_FORMATTED",
    "OTOR_SPV_CABANG_FORMATTED",
    "OTOR_OPR_KEP_FORMATTED",
    "OTOR_SPV_KEP_FORMATTED",
    "STATUS_TEXT"
  ];

  return (
    <FadeInWrapper>
      <div className="min-h-screen bg-gray-50">
        <Toast ref={toast} />

        <style jsx global>{`
        .tracking-page-filters input,
        .tracking-page-filters button,
        .tracking-page-filters .listbox-button {
          border-radius: 0.75rem !important;
        }
      `}</style>

        <div className="p-6">
          <DataTable
            data={filteredData}
            columns={columns}
            searchFields={searchFields}
            loading={false}
            emptyMessage="Tidak ada data yang ditemukan"
            title="Tracking Manual Cabang"
            description="Monitor status dan progress data manual cabang"
            headerActions={
              <div className="flex gap-2 tracking-page-filters">
                <div className="flex items-center gap-2">
                  <TailwindDatePicker
                    value={filterTanggalAwal}
                    onChange={(date) => setFilterTanggalAwal(date)}
                    placeholder="Periode Awal"
                    className="w-44"
                  />
                  <TailwindDatePicker
                    value={filterTanggalAkhir}
                    onChange={(date) => setFilterTanggalAkhir(date)}
                    placeholder="Periode Akhir"
                    className="w-44"
                  />
                </div>
                <CustomListbox
                  value={filterStatus}
                  onChange={(value) => setFilterStatus(value)}
                  options={statusOptions}
                  placeholder="Pilih status"
                  className="w-44"
                />
              </div>
            }
            searchRightActions={
              <button
                onClick={handleDownloadPDF}
                disabled={isGeneratingPDF || filteredData.length === 0}
                className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-xl font-medium transition-colors flex items-center gap-2 whitespace-nowrap disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <Download className="w-4 h-4" />
                {isGeneratingPDF ? "Generating..." : "Download PDF"}
              </button>
            }
          />
        </div>
      </div>
    </FadeInWrapper>
  );
}
