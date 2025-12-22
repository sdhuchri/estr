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
import Modal from "@/components/common/Modal";
import FormField, { Input, Textarea, TimeInput24 } from "@/components/common/FormField";

interface TrackingData {
  NO: number;
  CABANG: string;
  CABANG_INDUK: string;
  INDIKATOR: string;
  INPUT_BY_CBG: string;
  NAMA_NASABAH: string;
  NO_CIF: string;
  NO_REK: string;
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
  JAM_HUB_NASABAH: string | null;
  ALASAN_REJECT: string | null;
  KETERANGAN: string;
  KETERANGAN_STATUS: string;
  KET_CABANG_OPR: string | null;
  KET_CABANG_SPV: string | null;
  KET_KEPATUHAN: string | null;
  TGL_HUB_NASABAH: string | null;
  TRANSAKSI_MENCURIGAKAN: string | null;
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

  // Modal state
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedData, setSelectedData] = useState<TrackingData | null>(null);

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
    { value: "Approval SPV Cabang", label: "Approval SPV Cabang" },
    { value: "Approval OPR Kepatuhan", label: "Approval OPR Kepatuhan" },
    { value: "Approval SPV Kepatuhan", label: "Approval SPV Kepatuhan" },
    { value: "Selesai SPV Cabang", label: "Selesai SPV Cabang" },
    { value: "Selesai OPR Kepatuhan", label: "Selesai OPR Kepatuhan" },
    { value: "Selesai SPV Kepatuhan", label: "Selesai SPV Kepatuhan" },
    { value: "Sendback SPV Cabang", label: "Sendback SPV Cabang" },
    { value: "Sendback OPR Kepatuhan", label: "Sendback OPR Kepatuhan" },
    { value: "Reject SPV Kepatuhan", label: "Reject SPV Kepatuhan" },
    { value: "Reject 3 hari", label: "Reject 3 hari" }
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

  const handleRowAction = (action: string, item: TrackingData) => {
    if (action === "view") {
      setSelectedData(item);
      setIsModalOpen(true);
    }
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedData(null);
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
        { header: "Indikator", key: "INDIKATOR", width: 60 },
        { header: "No CIF", key: "NO_CIF", width: 75 },
        { header: "Nama Nasabah", key: "NAMA_NASABAH", width: 100 },
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
    { key: "INDIKATOR", label: "Indikator" },
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
          "Approval SPV Cabang": "bg-purple-100 text-purple-800",
          "Approval OPR Kepatuhan": "bg-yellow-100 text-yellow-800",
          "Approval SPV Kepatuhan": "bg-orange-100 text-orange-800",
          "Selesai SPV Cabang": "bg-green-100 text-green-800",
          "Selesai OPR Kepatuhan": "bg-green-100 text-green-800",
          "Selesai SPV Kepatuhan": "bg-green-100 text-green-800",
          "Sendback SPV Cabang": "bg-amber-100 text-amber-800",
          "Sendback OPR Kepatuhan": "bg-amber-100 text-amber-800",
          "Reject SPV Kepatuhan": "bg-red-100 text-red-800",
          "Reject 3 hari": "bg-red-100 text-red-800"
        };
        return (
          <span className={`px-2 py-1 rounded-full text-xs font-medium ${statusColors[value] || "bg-gray-100 text-gray-800"}`}>
            {value}
          </span>
        );
      }
    }
  ];

  // Define table actions
  const actions = [
    {
      label: "Detail",
      action: "view",
      className: "bg-blue-500 hover:bg-blue-600 text-white"
    }
  ];

  const searchFields = [
    "INDIKATOR",
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

  const modalFooter = (
    <div className="flex justify-start items-center w-full">
      <button
        onClick={handleCloseModal}
        className="px-6 py-2 bg-gray-400 hover:bg-gray-500 text-white rounded-full font-medium"
      >
        Close
      </button>
    </div>
  );

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
        .tracking-status-dropdown ul {
          min-width: max-content !important;
          width: auto !important;
        }
        .tracking-status-dropdown ul li span {
          white-space: nowrap !important;
        }
      `}</style>

        <div className="p-6">
          <DataTable
            data={filteredData}
            columns={columns}
            actions={actions}
            searchFields={searchFields}
            onRowAction={handleRowAction}
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
                <div className="tracking-status-dropdown">
                  <CustomListbox
                    value={filterStatus}
                    onChange={(value) => setFilterStatus(value)}
                    options={statusOptions}
                    placeholder="Pilih status"
                    className="w-96"
                  />
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

        {/* Detail Modal */}
        <Modal
          isOpen={isModalOpen}
          onClose={handleCloseModal}
          title="Detail Transaksi"
          footer={modalFooter}
          size="xl"
        >
          {selectedData && (
            <>
              {/* Green Info Box */}
              <div className="bg-green-600 text-white p-4 rounded-lg mb-6">
                <h3 className="text-lg font-semibold mb-3">Transaksi Tidak Mencurigakan!</h3>
                <ol className="text-m space-y-1">
                  <li>1. Nasabah dengan Produk Simpanan Pelajar (Simpel)</li>
                  <li>2. Transaksi Pencairan dan Penempatan Deposito</li>
                  <li>3. Transaksi Pencairan dan Pembayaran Pembiayaan</li>
                  <li>4. Transaksi untuk Pengeluaran Rutin Pribadi</li>
                  <li>5. Transaksi untuk Warisan</li>
                  <li>6. Transaksi dengan Rekening <em>Payroll</em> Karyawan BCA Syariah</li>
                  <li>7. Transaksi untuk Penjualan / Pembelian Rumah dan Kendaraan</li>
                  <li>8. Lainnya</li>
                </ol>
              </div>

              {/* Form Fields */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                <FormField label="No CIF">
                  <Input value={selectedData.NO_CIF} disabled />
                </FormField>
                <FormField label="No Rekening">
                  <Input value={selectedData.NO_REK} disabled />
                </FormField>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                <FormField label="Indikator">
                  <Input value={selectedData.INDIKATOR} disabled />
                </FormField>
                <FormField label="Cabang">
                  <Input value={selectedData.CABANG} disabled />
                </FormField>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                <FormField label="Nama Nasabah">
                  <Input value={selectedData.NAMA_NASABAH} disabled />
                </FormField>
                <FormField label="Tanggal Transaksi">
                  <Input value={formatDate(selectedData.TANGGAL_LAPORAN)} disabled />
                </FormField>
              </div>

              <FormField label="Keterangan Indikator" className="mb-4">
                <Input value={selectedData.KETERANGAN || "-"} disabled />
              </FormField>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                <FormField label="Tgl Menghubungi Nasabah">
                  <Input 
                    value={selectedData.TGL_HUB_NASABAH ? formatDate(selectedData.TGL_HUB_NASABAH) : "-"} 
                    disabled 
                  />
                </FormField>
                <FormField label="Jam Menghubungi Nasabah">
                  <TimeInput24
                    value={selectedData.JAM_HUB_NASABAH || "00:00:00"}
                    onChange={() => {}}
                    disabled
                  />
                </FormField>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                <FormField label="Transaksi Mencurigakan">
                  <Input 
                    value={selectedData.TRANSAKSI_MENCURIGAKAN === "Y" ? "Ya" : selectedData.TRANSAKSI_MENCURIGAKAN === "T" ? "Tidak" : "-"} 
                    disabled 
                  />
                </FormField>
              </div>

              <FormField label="Penjelasan CSO" className="mb-4">
                <Textarea
                  value={selectedData.KET_CABANG_OPR || "-"}
                  onChange={() => {}}
                  rows={4}
                  disabled
                />
              </FormField>

              <FormField label="Penjelasan SPV" className="mb-4">
                <Textarea
                  value={selectedData.KET_CABANG_SPV || "-"}
                  onChange={() => {}}
                  rows={4}
                  disabled
                />
              </FormField>

              <FormField label="Penjelasan Kepatuhan" className="mb-4">
                <Textarea
                  value={selectedData.KET_KEPATUHAN || "-"}
                  onChange={() => {}}
                  rows={4}
                  disabled
                />
              </FormField>
              {selectedData.KETERANGAN_STATUS == "Send Back" &&
              <FormField label="Penjelasan Send Back" className="mb-4">
                <Textarea
                  value={selectedData.ALASAN_REJECT || "-"}
                  onChange={() => {}}
                  rows={4}
                  disabled
                />
              </FormField> 
              }
            </>
          )}
        </Modal>
      </div>
    </FadeInWrapper>
  );
}
