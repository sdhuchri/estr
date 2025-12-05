"use client";
import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import { useSession } from "@/hooks/useSession";
import DataTable from "@/components/common/DataTable";
import TailwindDatePicker from "@/components/common/TailwindDatePicker";
import { Toast } from "primereact/toast";
import { getBiFastLaporan, formatDateToDDMMYYYY, BiFastLaporanResponse } from "@/services/bifastTransaction";
import { Download } from "lucide-react";
import { generatePDF, downloadPDF, PDFColumn } from "@/utils/pdfGenerator";

interface LaporanAktivitasData {
  id: number;
  namaNasabah: string;
  periodeTransaksi: string;
  kodeCabang: string;
  indikator: string;
  keterangan: string;
  status: string;
  // Store original data
  originalData?: BiFastLaporanResponse;
}

export default function BiFastLaporanAktivitasClient() {
  const router = useRouter();
  const toast = useRef<Toast>(null);
  const { session, loading } = useSession();

  const [tableData, setTableData] = useState<LaporanAktivitasData[]>([]);
  const [filteredData, setFilteredData] = useState<LaporanAktivitasData[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [filterDate, setFilterDate] = useState<Date | null>(null);
  const [isGeneratingPDF, setIsGeneratingPDF] = useState(false);

  useEffect(() => {
    if (!loading && !session) {
      router.push("/signin");
    }
  }, [session, loading, router]);

  // Fetch data from API
  const fetchData = async () => {
    if (!session?.branchCode) {
      setIsLoading(false);
      return;
    }

    try {
      setIsLoading(true);
      const response = await getBiFastLaporan(session.branchCode);

      if (response.status === "success" && response.data) {
        // Transform API data to table format
        const transformedData: LaporanAktivitasData[] = response.data.map((item) => ({
          id: item.id,
          namaNasabah: item.sender_name,
          periodeTransaksi: formatDateToDDMMYYYY(item.created_at),
          kodeCabang: item.cabang,
          indikator: item.additional_info_rc,
          keterangan: item.ket,
          status: item.status,
          originalData: item
        }));

        setTableData(transformedData);
        setFilteredData(transformedData);
      } else {
        toast.current?.show({
          severity: "error",
          summary: "Error",
          detail: response.message || "Gagal mengambil data",
          life: 3000
        });
      }
    } catch (error) {
      console.error("Error fetching BI-Fast laporan:", error);
      toast.current?.show({
        severity: "error",
        summary: "Error",
        detail: "Terjadi kesalahan saat mengambil data",
        life: 3000
      });
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (session?.branchCode) {
      fetchData();
    }
  }, [session?.branchCode]);

  useEffect(() => {
    applyFilters();
  }, [filterDate, tableData]);

  const applyFilters = () => {
    let filtered = [...tableData];

    // Filter by date
    if (filterDate) {
      filtered = filtered.filter(item => {
        const itemDate = parseDate(item.periodeTransaksi);
        return (
          itemDate.getDate() === filterDate.getDate() &&
          itemDate.getMonth() === filterDate.getMonth() &&
          itemDate.getFullYear() === filterDate.getFullYear()
        );
      });
    }

    setFilteredData(filtered);
  };

  const parseDate = (dateStr: string): Date => {
    const [day, month, year] = dateStr.split('-');
    return new Date(parseInt(year), parseInt(month) - 1, parseInt(day));
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
        { header: "No", key: "NO", width: 30, align: "center" },
        { 
          header: "No CIF", 
          key: "noCif", 
          width: 65,
          align: "center",
          render: (_: any, item: LaporanAktivitasData) => item.originalData?.no_cif || "-"
        },
        { 
          header: "No Rekening", 
          key: "noRekening", 
          width: 75,
          align: "center",
          render: (_: any, item: LaporanAktivitasData) => item.originalData?.sender_account_number || "-"
        },
        { header: "Tanggal Transaksi", key: "periodeTransaksi", width: 85, align: "center" },
        { header: "Nama Nasabah", key: "namaNasabah", width: 150, align: "center" },
        { header: "Kode Cabang", key: "kodeCabang", width: 60, align: "center" },
        { header: "Indikator", key: "indikator", width: 60, align: "center" },
        { header: "Keterangan", key: "keterangan", width: 110, align: "center" },
        { header: "Status", key: "status", width: 150, align: "center" }
      ];

      // Calculate table start position to align header with table
      const totalTableWidth = pdfColumns.reduce((sum, col) => sum + col.width, 0);
      const pageWidth = 750; // Same as customPageSize width
      const tableStartX = (pageWidth - totalTableWidth) / 2;
      const headerPadding = Math.max(0, Math.floor((tableStartX - 30) / 5)); // Convert pixels to approximate spaces
      const paddingSpaces = " ".repeat(headerPadding);

      // Prepare header info
      const headerInfo = {
        left: [
          { label: `${paddingSpaces}User ID`, value: ` : ${userId}` },
          { label: `${paddingSpaces}Tanggal Cetak`, value: ` : ${dateStr}` }
        ],
        right: []
      };

      // Prepare data with row numbers
      const pdfData = filteredData.map((item, index) => ({
        ...item,
        NO: index + 1
      }));

      // Generate PDF
      const pdfBlob = await generatePDF({
        title: "LAPORAN TRANSAKSI MENCURIGAKAN VIA BI FAST",
        data: pdfData,
        columns: pdfColumns,
        headerInfo,
        orientation: "landscape",
        customPageSize: [850, 595],  // [width, height] - edit width value to adjust PDF page width
        titleSize: 14  // Smaller title font size (default is 18)
      });

      // Download PDF
      downloadPDF(pdfBlob, `laporan-aktivitas-bifast-${dateStr}.pdf`);

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
      key: "id",
      label: "NO",
      className: "text-center w-16",
      render: (_: any, __: any, index: number) => index
    },
    { key: "namaNasabah", label: "NAMA NASABAH", className: "font-medium" },
    { key: "periodeTransaksi", label: "PERIODE TRANSAKSI" },
    { key: "kodeCabang", label: "KODE CABANG", className: "text-center" },
    { key: "indikator", label: "INDIKATOR" },
    { key: "keterangan", label: "KETERANGAN" },
    {
      key: "status",
      label: "STATUS",
      className: "text-center w-56",
      render: (value: string) => {
        const statusColors: Record<string, string> = {
          "Completed": "bg-green-100 text-green-800",
          "Pending": "bg-yellow-100 text-yellow-800",
          "Rejected": "bg-red-100 text-red-800",
          "Open": "bg-blue-100 text-blue-800",
          "Selesai Cabang": "bg-green-100 text-green-800",
          "Batal": "bg-red-100 text-red-800",
          "Penelaahan Supervisor Cabang": "bg-yellow-100 text-yellow-800",
          "Persetujuan Supervisor Cabang": "bg-yellow-100 text-yellow-800",
          "Persetujuan Operator Kepatuhan": "bg-purple-100 text-purple-800",
          "Persetujuan Supervisor Kepatuhan": "bg-purple-100 text-purple-800"
        };
        return (
          <span className={`px-2 py-1 rounded-full text-xs font-medium whitespace-nowrap ${statusColors[value] || "bg-gray-100 text-gray-800"}`}>
            {value}
          </span>
        );
      }
    }
  ];

  const searchFields = ["namaNasabah", "kodeCabang", "indikator", "keterangan"];

  return (
    <div className="min-h-screen bg-gray-50">
      <Toast ref={toast} />

      <div className="p-6">
        <DataTable
          data={filteredData}
          columns={columns}
          searchFields={searchFields}
          loading={isLoading}
          emptyMessage="Tidak ada data yang ditemukan"
          title="BI-Fast Laporan Aktivitas"
          description="Laporan aktivitas transaksi BI-Fast"
          headerActions={
            <div className="flex gap-2">
              <div className="flex items-center gap-2">
                <TailwindDatePicker
                  value={filterDate}
                  onChange={(date) => setFilterDate(date)}
                  placeholder="Periode"
                  className="w-44"
                  roundedClass="rounded-lg"
                />
                {filterDate && (
                  <button
                    onClick={() => setFilterDate(null)}
                    className="px-3 py-2 text-sm text-gray-600 hover:text-gray-800 border border-gray-300 rounded-lg hover:bg-gray-50"
                  >
                    Reset
                  </button>
                )}
              </div>
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
  );
}
