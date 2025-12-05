"use client";
import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import { useSession } from "@/hooks/useSession";
import DataTable from "@/components/common/DataTable";
import TailwindDatePicker from "@/components/common/TailwindDatePicker";
import { Toast } from "primereact/toast";
import { getBiFastStatus, formatDateToDDMMYYYY, BiFastStatusResponse } from "@/services/bifastTransaction";
import Modal from "@/components/common/Modal";
import FormField, { Input, Textarea, CustomListbox } from "@/components/common/FormField";

interface BiFastStatusData {
  id: number;
  namaNasabah: string;
  tanggalTransaksi: string;
  cabang: string;
  info: string;
  keterangan: string;
  status: string;
  // Store original data for modal
  originalData?: BiFastStatusResponse;
}

export default function BiFastStatusClient() {
  const router = useRouter();
  const toast = useRef<Toast>(null);
  const { session, loading } = useSession();

  const [tableData, setTableData] = useState<BiFastStatusData[]>([]);
  const [filteredData, setFilteredData] = useState<BiFastStatusData[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [filterDate, setFilterDate] = useState<Date | null>(null);
  const [filterStatus, setFilterStatus] = useState<string>("");

  // Modal state
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedData, setSelectedData] = useState<BiFastStatusData | null>(null);

  // Status options for dropdown
  const statusOptions = [
    { value: "", label: "Semua" },
    { value: "Open", label: "Open" },
    { value: "Persetujuan Supervisor Cabang", label: "Persetujuan Supervisor Cabang" },
    { value: "Selesai Cabang", label: "Selesai Cabang" },
    { value: "Persetujuan Operator Kepatuhan", label: "Persetujuan Operator Kepatuhan" },
    { value: "Persetujuan Supervisor Kepatuhan", label: "Persetujuan Supervisor Kepatuhan" },
    { value: "Selesai Kepatuhan", label: "Selesai Kepatuhan" },
    { value: "Tolak", label: "Tolak" },
    { value: "Revisi", label: "Revisi" }
  ];

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
      const response = await getBiFastStatus(session.branchCode);

      if (response.status === "success" && response.data) {
        // Transform API data to table format
        const transformedData: BiFastStatusData[] = response.data.map((item) => ({
          id: item.id,
          namaNasabah: item.sender_name,
          tanggalTransaksi: formatDateToDDMMYYYY(item.created_at),
          cabang: item.cabang,
          info: item.additional_info_rc,
          keterangan: item.ket,
          status: item.status,
          originalData: item // Store original data for modal
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
      console.error("Error fetching BI-Fast status:", error);
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
  }, [filterDate, filterStatus, tableData]);

  const applyFilters = () => {
    let filtered = [...tableData];

    // Filter by date
    if (filterDate) {
      filtered = filtered.filter(item => {
        const itemDate = parseDate(item.tanggalTransaksi);
        return (
          itemDate.getDate() === filterDate.getDate() &&
          itemDate.getMonth() === filterDate.getMonth() &&
          itemDate.getFullYear() === filterDate.getFullYear()
        );
      });
    }

    // Filter by status
    if (filterStatus) {
      filtered = filtered.filter(item => item.status === filterStatus);
    }

    setFilteredData(filtered);
  };

  const parseDate = (dateStr: string): Date => {
    const [day, month, year] = dateStr.split('-');
    return new Date(parseInt(year), parseInt(month) - 1, parseInt(day));
  };

  const handleRowAction = (action: string, row: BiFastStatusData) => {
    if (action === "view") {
      setSelectedData(row);
      setIsModalOpen(true);
    }
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedData(null);
  };

  const formatAmount = (amount: number): string => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 0
    }).format(amount);
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
    { key: "tanggalTransaksi", label: "TANGGAL TRANSAKSI" },
    { key: "cabang", label: "CABANG" },
    { key: "info", label: "INFO" },
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
    },
    {
      key: "action",
      label: "Action",
      className: "text-center",
      render: (_: any, row: BiFastStatusData) => (
        <button
          onClick={() => handleRowAction("view", row)}
          className="px-3 py-1 rounded text-sm font-medium transition-colors bg-blue-500 hover:bg-blue-600 text-white"
        >
          View
        </button>
      )
    }
  ];

  const searchFields = ["namaNasabah", "cabang", "info", "keterangan"];

  const modalFooter = (
    <div className="flex justify-end w-full">
      <button
        onClick={handleCloseModal}
        className="px-6 py-2 bg-gray-400 hover:bg-gray-500 text-white rounded-full font-medium"
      >
        Close
      </button>
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-50">
      <Toast ref={toast} />

      {/* Custom styling for date picker and listbox on this page only */}
      <style jsx global>{`
        .bifast-status-datepicker input[type="text"],
        .bifast-status-datepicker .flatpickr-input,
        .bifast-status-datepicker input {
          border-radius: 0.5rem !important;
          border: 1px solid #d1d5db !important;
          padding: 0.5rem 1rem !important;
          font-size: 0.875rem !important;
          height: 2.5rem !important;
          box-shadow: 0 1px 2px 0 rgba(0, 0, 0, 0.05) !important;
        }
        .bifast-status-datepicker input[type="text"]:focus,
        .bifast-status-datepicker .flatpickr-input:focus,
        .bifast-status-datepicker input:focus {
          outline: none !important;
          border-color: #3b82f6 !important;
          box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1) !important;
        }
        
        .bifast-status-listbox button {
          border-radius: 0.5rem !important;
          border: 1px solid #d1d5db !important;
          padding: 0.5rem 1rem !important;
          font-size: 0.875rem !important;
          height: 2.5rem !important;
          box-shadow: 0 1px 2px 0 rgba(0, 0, 0, 0.05) !important;
        }
        .bifast-status-listbox button:focus {
          outline: none !important;
          border-color: #3b82f6 !important;
          box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1) !important;
        }
      `}</style>

      <div className="p-6">
        <DataTable
          data={filteredData}
          columns={columns}
          searchFields={searchFields}
          onRowAction={handleRowAction}
          loading={isLoading}
          emptyMessage="Tidak ada data yang ditemukan"
          title="BI-Fast Transaction Status"
          description="Monitor status transaksi BI-Fast"
          headerActions={
            <div className="flex gap-2">
              <div className="flex items-center gap-2 bifast-status-datepicker">
                <TailwindDatePicker
                  value={filterDate}
                  onChange={(date) => setFilterDate(date)}
                  placeholder="Periode"
                  className="w-44"
                  roundedClass="rounded-lg"
                />
              </div>
              
              <div className="w-64 bifast-status-listbox">
                <CustomListbox
                  value={filterStatus}
                  onChange={(value) => setFilterStatus(value)}
                  options={statusOptions}
                  placeholder="Semua"
                />
              </div>

              {(filterDate || filterStatus) && (
                <button
                  onClick={() => {
                    setFilterDate(null);
                    setFilterStatus("");
                  }}
                  className="px-3 py-2 text-sm text-gray-600 hover:text-gray-800 border border-gray-300 rounded-lg hover:bg-gray-50"
                >
                  Reset
                </button>
              )}
            </div>
          }
        />
      </div>

      {/* View Modal */}
      <Modal
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        title="Detail Transaksi BI-Fast"
        footer={modalFooter}
        size="xl"
      >
        {selectedData && selectedData.originalData && (
          <>
            {/* Basic Information */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
              <FormField label="No CIF">
                <Input value={selectedData.originalData.no_cif} disabled />
              </FormField>
              <FormField label="No Rekening">
                <Input value={selectedData.originalData.sender_account_number} disabled />
              </FormField>
              <FormField label="Indikator">
                <Input value={selectedData.originalData.additional_info_rc} disabled />
              </FormField>
              <FormField label="Cabang">
                <Input value={selectedData.originalData.cabang} disabled />
              </FormField>
              <FormField label="Nama Nasabah">
                <Input value={selectedData.originalData.sender_name} disabled />
              </FormField>
              <FormField label="Tanggal Transaksi">
                <Input value={formatDateToDDMMYYYY(selectedData.originalData.created_at)} disabled />
              </FormField>
            </div>

            <FormField label="Keterangan" className="mb-4">
              <Input value={selectedData.originalData.ket} disabled />
            </FormField>

            {/* Follow Up Information */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
              <FormField label="Tgl Menghubungi Nasabah">
                <Input 
                  value={selectedData.originalData.tanggal_hubungi 
                    ? formatDateToDDMMYYYY(selectedData.originalData.tanggal_hubungi) 
                    : "-"
                  } 
                  disabled 
                />
              </FormField>
              <FormField label="Jam Menghubungi Nasabah">
                <Input value={selectedData.originalData.jam_hubungi || "-"} disabled />
              </FormField>
            </div>

            {/* Explanation Fields */}
            <FormField label="Penjelasan CSO" className="mb-4">
              <Textarea
                value={selectedData.originalData.penjelasan_cso || "-"}
                rows={3}
                disabled
              />
            </FormField>

            <FormField label="Penjelasan SPV Cabang" className="mb-4">
              <Textarea
                value={selectedData.originalData.penjelasan_spv || "-"}
                rows={3}
                disabled
              />
            </FormField>

            {/* Hide Kepatuhan fields if status is "Selesai Cabang" */}
            {selectedData.originalData.status !== "Selesai Cabang" && (
              <>
                <FormField label="Penjelasan Operator Kepatuhan" className="mb-4">
                  <Textarea
                    value={selectedData.originalData.penjelasan_opr_kepatuhan || "-"}
                    rows={3}
                    disabled
                  />
                </FormField>

                <FormField label="Penjelasan Supervisor Kepatuhan" className="mb-4">
                  <Textarea
                    value={selectedData.originalData.penjelasan_spv_kepatuhan || "-"}
                    rows={3}
                    disabled
                  />
                </FormField>
              </>
            )}

            {/* Tracking Information */}
            <div className="mt-6">
              <h3 className="text-lg font-semibold mb-4 text-gray-700 border-b pb-2">Tracking</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <FormField label="Diproses Oleh">
                  <Input value={selectedData.originalData.proses_on || "-"} disabled />
                </FormField>
                <FormField label="Otorisasi SPV Cabang">
                  <Input value={selectedData.originalData.otor_spv_cabang || "-"} disabled />
                </FormField>
                
                {/* Hide Kepatuhan tracking fields if status is "Selesai Cabang" */}
                {selectedData.originalData.status !== "Selesai Cabang" && (
                  <>
                    <FormField label="Review OPR Kepatuhan">
                      <Input value={selectedData.originalData.review_opr_kepatuhan || "-"} disabled />
                    </FormField>
                    <FormField label="Otorisasi SPV Kepatuhan">
                      <Input value={selectedData.originalData.otor_spv_kepatuhan || "-"} disabled />
                    </FormField>
                  </>
                )}
              </div>
            </div>
          </>
        )}
      </Modal>
    </div>
  );
}
