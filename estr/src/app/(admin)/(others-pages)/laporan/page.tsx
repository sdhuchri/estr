"use client";
import React, { useEffect, useState, useRef } from "react";
import { useRouter } from "next/navigation";
import Cookies from "js-cookie";
import FormField, { CustomListbox, DatePickerInput } from "@/components/common/FormField";
import { FileText, Search, Calendar } from "lucide-react";
import { Toast } from "primereact/toast";
import DataTable from "@/components/common/DataTable";

interface LaporanOption {
  value: string;
  label: string;
}

export default function LaporanPage() {
  const router = useRouter();
  const toast = useRef<Toast>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isGenerating, setIsGenerating] = useState(false);

  const [formData, setFormData] = useState({
    jenisLaporan: "",
    tanggalMulai: null as Date | null,
    tanggalSelesai: null as Date | null
  });

  const [tableData, setTableData] = useState<any[]>([]);
  const [showTable, setShowTable] = useState(false);
  const [currentReportType, setCurrentReportType] = useState("");

  const laporanOptions: LaporanOption[] = [
    { value: "", label: "Pilih Laporan" },
    { value: "laporan-cabang", label: "Laporan Cabang" },
    { value: "laporan-opr-kepatuhan", label: "Laporan OPR Kepatuhan" },
    { value: "laporan-spv-kepatuhan", label: "Laporan SPV Kepatuhan" },
    { value: "laporan-reject", label: "Laporan Reject" },
    { value: "laporan-all", label: "Laporan All" },
    { value: "laporan-belum-tarik-data-redflag", label: "Laporan Belum Tarik Data Redflag" }
  ];

  useEffect(() => {
    document.title = "ESTR | Laporan";

    const userId = Cookies.get("userId");

    if (!userId) {
      setIsLoading(true);
      router.push("/signin");
      return;
    }

    setIsLoading(false);
  }, [router]);

  const handleInputChange = (field: string, value: string | Date | null) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
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
    try {
      console.log("Generating report:", formData);

      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 2000));

      // Sample data for demonstration
      const sampleData = [
        {
          no: 1,
          tanggal: "2025-01-15",
          noCif: "12345678",
          namanasabah: "John Doe",
          noRekening: "1234567890",
          nominal: "Rp 1.000.000",
          keterangan: "Transfer antar bank",
          status: "Completed"
        },
        {
          no: 2,
          tanggal: "2025-01-14",
          noCif: "87654321",
          namaRasabah: "Jane Smith",
          noRekening: "0987654321",
          nominal: "Rp 2.500.000",
          keterangan: "Setor tunai",
          status: "Pending"
        },
        {
          no: 3,
          tanggal: "2025-01-13",
          noCif: "11223344",
          namaRasabah: "Bob Johnson",
          noRekening: "1122334455",
          nominal: "Rp 750.000",
          keterangan: "Tarik tunai ATM",
          status: "Completed"
        }
      ];

      setTableData(sampleData);
      setCurrentReportType(formData.jenisLaporan);
      setShowTable(true);

      toast.current?.show({
        severity: "success",
        summary: "Berhasil!",
        detail: "Data laporan berhasil dimuat",
        life: 3000
      });
    } catch (error) {
      console.error("Error generating report:", error);
      toast.current?.show({
        severity: "error",
        summary: "Gagal!",
        detail: "Gagal membuat laporan. Silakan coba lagi",
        life: 3000
      });
    } finally {
      setIsGenerating(false);
    }
  };

  const formatDate = (dateString: string) => {
    if (!dateString) return "";
    const date = new Date(dateString);
    return date.toLocaleDateString("id-ID", {
      day: "2-digit",
      month: "short",
      year: "numeric"
    });
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

  const getTableColumns = () => {
    switch (currentReportType) {
      case "laporan-cabang":
        return [
          { key: "no", label: "No", className: "text-center w-16" },
          { key: "noCif", label: "No CIF" },
          { key: "noRekening", label: "No Rekening" },
          { key: "namaRasabah", label: "Nama Nasabah", className: "font-medium" },
          { key: "jenisNasabah", label: "Jenis Nasabah" },
          { key: "kodeCabang", label: "Kode Cabang" },
          { key: "tanggalTransaksi", label: "Tanggal Transaksi" },
          { key: "indikatorSTR", label: "Indikator STR" },
          { key: "keteranganOPR", label: "Keterangan OPR" },
          { key: "keteranganSPV", label: "Keterangan SPV" },
          { key: "inputBy", label: "Input By" },
          { key: "approvedByCabang", label: "Approved By Cabang" },
          {
            key: "status", label: "Status", render: (value: string) => (
              <span className={`px-2 py-1 rounded-full text-xs font-medium ${value === "Completed" ? "bg-green-100 text-green-800" : "bg-yellow-100 text-yellow-800"
                }`}>{value}</span>
            )
          }
        ];

      case "laporan-opr-kepatuhan":
        return [
          { key: "no", label: "No", className: "text-center w-16" },
          { key: "noCif", label: "No CIF" },
          { key: "noRekening", label: "No Rekening" },
          { key: "namaRasabah", label: "Nama Nasabah", className: "font-medium" },
          { key: "jenisNasabah", label: "Jenis Nasabah" },
          { key: "kodeCabang", label: "Kode Cabang" },
          { key: "tanggalTransaksi", label: "Tanggal Transaksi" },
          { key: "indikatorSTR", label: "Indikator STR" },
          { key: "keteranganOPR", label: "Keterangan OPR" },
          { key: "keteranganSPV", label: "Keterangan SPV" },
          { key: "keteranganKepatuhan", label: "Keterangan Kepatuhan" },
          { key: "inputBy", label: "Input By" },
          { key: "approvedByCabang", label: "Approved By Cabang" },
          { key: "approvedByOPRKepatuhan", label: "Approved By OPR Kepatuhan" },
          {
            key: "status", label: "Status", render: (value: string) => (
              <span className={`px-2 py-1 rounded-full text-xs font-medium ${value === "Completed" ? "bg-green-100 text-green-800" : "bg-yellow-100 text-yellow-800"
                }`}>{value}</span>
            )
          }
        ];

      case "laporan-spv-kepatuhan":
        return [
          { key: "no", label: "No", className: "text-center w-16" },
          { key: "noCif", label: "No CIF" },
          { key: "noRekening", label: "No Rekening" },
          { key: "namaRasabah", label: "Nama Nasabah", className: "font-medium" },
          { key: "jenisNasabah", label: "Jenis Nasabah" },
          { key: "kodeCabang", label: "Kode Cabang" },
          { key: "tanggalTransaksi", label: "Tanggal Transaksi" },
          { key: "indikatorSTR", label: "Indikator STR" },
          { key: "keteranganOPR", label: "Keterangan OPR" },
          { key: "keteranganSPV", label: "Keterangan SPV" },
          { key: "keteranganKepatuhan", label: "Keterangan Kepatuhan" },
          { key: "inputBy", label: "Input By" },
          { key: "approvedByCabang", label: "Approved By Cabang" },
          { key: "approvedByOPRKepatuhan", label: "Approved By OPR Kepatuhan" },
          { key: "approvedBySPVKepatuhan", label: "Approved By SPV Kepatuhan" },
          {
            key: "status", label: "Status", render: (value: string) => (
              <span className={`px-2 py-1 rounded-full text-xs font-medium ${value === "Completed" ? "bg-green-100 text-green-800" : "bg-yellow-100 text-yellow-800"
                }`}>{value}</span>
            )
          }
        ];

      case "laporan-reject":
        return [
          { key: "no", label: "No", className: "text-center w-16" },
          { key: "noCif", label: "No CIF" },
          { key: "noRekening", label: "No Rekening" },
          { key: "namaRasabah", label: "Nama Nasabah", className: "font-medium" },
          { key: "jenisNasabah", label: "Jenis Nasabah" },
          { key: "kodeCabang", label: "Kode Cabang" },
          { key: "tanggalTransaksi", label: "Tanggal Transaksi" },
          { key: "indikatorSTR", label: "Indikator STR" },
          { key: "keteranganOPR", label: "Keterangan OPR" },
          { key: "keteranganSPV", label: "Keterangan SPV" },
          { key: "tanggalReject", label: "Tanggal Reject" },
          { key: "rejectBy", label: "Reject By" },
          { key: "alasanReject", label: "Alasan Reject" },
          {
            key: "status", label: "Status", render: (value: string) => (
              <span className={`px-2 py-1 rounded-full text-xs font-medium ${value === "Completed" ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"
                }`}>{value}</span>
            )
          }
        ];

      case "laporan-all":
        return [
          { key: "no", label: "No", className: "text-center w-16" },
          { key: "noCif", label: "No CIF" },
          { key: "noRekening", label: "No Rekening" },
          { key: "namaRasabah", label: "Nama Nasabah", className: "font-medium" },
          { key: "jenisNasabah", label: "Jenis Nasabah" },
          { key: "kodeCabang", label: "Kode Cabang" },
          { key: "tanggalTransaksi", label: "Tanggal Transaksi" },
          { key: "indikatorSTR", label: "Indikator STR" },
          { key: "keteranganOPR", label: "Keterangan OPR" },
          { key: "keteranganSPV", label: "Keterangan SPV" },
          {
            key: "status", label: "Status", render: (value: string) => (
              <span className={`px-2 py-1 rounded-full text-xs font-medium ${value === "Completed" ? "bg-green-100 text-green-800" : "bg-yellow-100 text-yellow-800"
                }`}>{value}</span>
            )
          }
        ];

      case "laporan-belum-tarik-data-redflag":
        return [
          { key: "no", label: "No", className: "text-center w-16" },
          { key: "tanggal", label: "Tanggal", render: (value: string) => new Date(value).toLocaleDateString("id-ID") },
          { key: "kodeCabang", label: "Kode Cabang" },
          { key: "keterangan", label: "Keterangan" }
        ];

      default:
        return [
          { key: "no", label: "No", className: "text-center w-16" },
          { key: "tanggal", label: "Tanggal", render: (value: string) => new Date(value).toLocaleDateString("id-ID") },
          { key: "noCif", label: "No CIF" },
          { key: "namaRasabah", label: "Nama Nasabah", className: "font-medium" },
          { key: "noRekening", label: "No Rekening" },
          { key: "nominal", label: "Nominal", className: "text-right" },
          { key: "keterangan", label: "Keterangan" },
          {
            key: "status", label: "Status", render: (value: string) => (
              <span className={`px-2 py-1 rounded-full text-xs font-medium ${value === "Completed" ? "bg-green-100 text-green-800" : "bg-yellow-100 text-yellow-800"
                }`}>{value}</span>
            )
          }
        ];
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Toast ref={toast} />

      {/* Spinner */}
      {isLoading && (
        <div className="fixed inset-0 z-50 flex items-center justify-center backdrop-blur-sm bg-white/30">
          <div className="w-16 h-16 border-4 border-blue-900 border-t-transparent rounded-full animate-spin"></div>
        </div>
      )}

      <div className="p-6">
        {/* Main Card Container */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-visible">
          {/* Header */}
          <div className="p-6 border-b border-gray-200">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-blue-600 rounded-lg">
                  <FileText className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h1 className="text-3xl font-bold text-gray-900">Laporan Data Nasabah</h1>
                  <p className="text-gray-600 mt-1">Generate dan unduh laporan data nasabah</p>
                </div>
              </div>

              {/* Generate Button - Right Side */}
              {showTable && (
                <div className="flex items-center gap-4">
                  <button
                    onClick={handleGenerateReport}
                    disabled={isGenerating}
                    className="flex items-center gap-3 px-6 py-2 bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white rounded-lg font-medium transition-colors shadow-lg"
                  >
                    {isGenerating ? (
                      <>
                        <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                        Loading...
                      </>
                    ) : (
                      <>
                        <FileText className="w-4 h-4" />
                        Generate Laporan
                      </>
                    )}
                  </button>
                </div>
              )}
            </div>
          </div>

          {/* Content */}
          <div className="p-6">
            {/* Form Controls Row */}
            <div className="flex items-end gap-4 mb-10" style={{ alignItems: 'flex-end' }}>
              {/* Periode Section */}
              <div className="flex items-end gap-3">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Periode</label>
                  <div className="w-40 h-10">
                    <DatePickerInput
                      selected={formData.tanggalMulai}
                      onChange={(date) => handleInputChange('tanggalMulai', date)}
                      placeholderText="Periode Awal"
                      dateFormat="dd/MM/yyyy"
                      className="h-10"
                    />
                    <p className="text-xs text-gray-500 mt-1">
                      Format: {formData.tanggalMulai ?
                        formData.tanggalMulai.toLocaleDateString("id-ID", {
                          day: "2-digit",
                          month: "short",
                          year: "numeric"
                        }).replace(/\s/g, "-") :
                        "dd-mmm-yyyy"
                      }
                    </p>
                  </div>
                </div>
                <div>
                  <div className="w-40 h-10">
                    <DatePickerInput
                      selected={formData.tanggalSelesai}
                      onChange={(date) => handleInputChange('tanggalSelesai', date)}
                      placeholderText="Periode Akhir"
                      dateFormat="dd/MM/yyyy"
                      className="h-10"
                    />
                    <p className="text-xs text-gray-500 mt-1">
                      Format: {formData.tanggalSelesai ?
                        formData.tanggalSelesai.toLocaleDateString("id-ID", {
                          day: "2-digit",
                          month: "short",
                          year: "numeric"
                        }).replace(/\s/g, "-") :
                        "dd-mmm-yyyy"
                      }
                    </p>
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
                      className="h-10"
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
                <DataTable
                  data={tableData}
                  columns={getTableColumns()}
                  title={getReportTitle()}
                  searchFields={["namaRasabah", "noCif", "noRekening", "keterangan"]}
                  loading={isGenerating}
                  emptyMessage="Belum ada data laporan. Silakan lakukan inquiry terlebih dahulu."
                />
              ) : (
                <div className="p-4">
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
