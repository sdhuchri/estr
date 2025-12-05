"use client";
import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import { useSession } from "@/hooks/useSession";
import DataTable from "@/components/common/DataTable";
import TailwindDatePicker from "@/components/common/TailwindDatePicker";
import { Toast } from "primereact/toast";
import { getBiFastTodoList, formatDateToDDMMYYYY, BiFastTodoResponse, updateBiFast, revisiBiFast } from "@/services/bifastTransaction";
import Modal from "@/components/common/Modal";
import FormField, { Input, Textarea, TimeInput24 } from "@/components/common/FormField";

interface BiFastData {
  id: number;
  namaNasabah: string;
  tanggalTransaksi: string;
  cabang: string;
  info: string;
  keterangan: string;
  status: string;
  // Store original data for modal
  originalData?: BiFastTodoResponse;
}

export default function BiFastToDoListClient() {
  const router = useRouter();
  const toast = useRef<Toast>(null);
  const { session, loading } = useSession();

  const [tableData, setTableData] = useState<BiFastData[]>([]);
  const [filteredData, setFilteredData] = useState<BiFastData[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [filterDate, setFilterDate] = useState<Date | null>(null);
  const [isSaving, setIsSaving] = useState(false);

  // Modal state
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedData, setSelectedData] = useState<BiFastData | null>(null);
  const [editFormData, setEditFormData] = useState({
    tglHubungiNasabah: null as Date | null,
    jamHubungiNasabah: "00:00:00",
    penjelasanCSO: "",
    penjelasanSPV: "",
    penjelasanOperatorKepatuhan: "",
    penjelasanSupervisorKepatuhan: ""
  });

  useEffect(() => {
    if (!loading && !session) {
      router.push("/signin");
    }
  }, [session, loading, router]);

  // Fetch data from API - extracted as reusable function
  const fetchData = async () => {
    if (!session?.branchCode) {
      setIsLoading(false);
      return;
    }

    try {
      setIsLoading(true);
      const response = await getBiFastTodoList(session.branchCode);

      if (response.status === "success" && response.data) {
        // Transform API data to table format and filter out "Selesai Cabang"
        const transformedData: BiFastData[] = response.data
          .filter((item) => item.status !== "Selesai Cabang") // Exclude "Selesai Cabang"
          .map((item) => ({
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
      console.error("Error fetching BI-Fast data:", error);
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
        const itemDate = parseDate(item.tanggalTransaksi);
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

  const handleRowAction = (action: string, row: BiFastData) => {
    if (action === "edit") {
      // Additional validation based on user profile
      const userProfile = session?.userProfile || "";
      
      if (userProfile === "estr_opr_cab" && 
          (row.status === "Persetujuan Supervisor Cabang" || 
           row.status === "Persetujuan Operator Kepatuhan" ||
           row.status === "Persetujuan Supervisor Kepatuhan")) {
        return; // Operator Cabang cannot edit these statuses
      }
      
      if (userProfile === "estr_spv_cab" && row.status !== "Persetujuan Supervisor Cabang") {
        return; // Supervisor Cabang can only edit this status
      }
      
      if (userProfile === "estr_opr_kep" && row.status !== "Persetujuan Operator Kepatuhan") {
        return; // Operator Kepatuhan can only edit this status
      }
      
      if (userProfile === "estr_spv_kep" && row.status !== "Persetujuan Supervisor Kepatuhan") {
        return; // Supervisor Kepatuhan can only edit this status
      }

      setSelectedData(row);
      
      // Pre-fill form with existing data from API if available
      setEditFormData({
        tglHubungiNasabah: row.originalData?.tanggal_hubungi 
          ? new Date(row.originalData.tanggal_hubungi) 
          : null,
        jamHubungiNasabah: row.originalData?.jam_hubungi || "00:00:00",
        penjelasanCSO: row.originalData?.penjelasan_cso || "",
        penjelasanSPV: row.originalData?.penjelasan_spv || "",
        penjelasanOperatorKepatuhan: row.originalData?.penjelasan_opr_kepatuhan || "",
        penjelasanSupervisorKepatuhan: row.originalData?.penjelasan_spv_kepatuhan || ""
      });
      setIsModalOpen(true);
    }
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedData(null);
  };

  const handleInputChange = (field: string, value: string | Date | null) => {
    setEditFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleSubmit = async () => {
    if (!selectedData || !selectedData.originalData || !session?.userId) return;

    const userProfile = session?.userProfile || "";

    // Validation for Supervisor Cabang
    if (userProfile === "estr_spv_cab") {
      if (!editFormData.penjelasanSPV.trim()) {
        toast.current?.show({
          severity: "error",
          summary: "Error",
          detail: "Penjelasan SPV harus diisi",
          life: 3000
        });
        return;
      }
    } else if (userProfile === "estr_opr_kep") {
      // Validation for Operator Kepatuhan
      if (!editFormData.penjelasanOperatorKepatuhan.trim()) {
        toast.current?.show({
          severity: "error",
          summary: "Error",
          detail: "Penjelasan Operator Kepatuhan harus diisi",
          life: 3000
        });
        return;
      }
    } else if (userProfile === "estr_spv_kep") {
      // Validation for Supervisor Kepatuhan
      if (!editFormData.penjelasanSupervisorKepatuhan.trim()) {
        toast.current?.show({
          severity: "error",
          summary: "Error",
          detail: "Penjelasan Supervisor Kepatuhan harus diisi",
          life: 3000
        });
        return;
      }
    } else {
      // Validation for Operator Cabang - skip date validation for "O 71"
      if (selectedData.originalData.additional_info_rc !== "O 71") {
        if (!editFormData.tglHubungiNasabah) {
          toast.current?.show({
            severity: "error",
            summary: "Error",
            detail: "Tanggal menghubungi nasabah harus diisi",
            life: 3000
          });
          return;
        }
      }

      if (!editFormData.penjelasanCSO.trim()) {
        toast.current?.show({
          severity: "error",
          summary: "Error",
          detail: "Penjelasan CSO harus diisi",
          life: 3000
        });
        return;
      }
    }

    setIsSaving(true);

    try {
      let updateData: any;

      // Different payload structure based on user profile
      if (userProfile === "estr_spv_cab") {
        // Payload for Supervisor Cabang
        updateData = {
          id: selectedData.originalData.id.toString(),
          profile: userProfile,
          penjelasan_spv: editFormData.penjelasanSPV,
          otor_spv_cabang: session.userId,
          proses_on: session.userId
        };
      } else if (userProfile === "estr_opr_kep") {
        // Payload for Operator Kepatuhan
        updateData = {
          id: selectedData.originalData.id.toString(),
          profile: userProfile,
          penjelasan_opr_kepatuhan: editFormData.penjelasanOperatorKepatuhan,
          review_opr_kepatuhan: session.userId,
          proses_on: session.userId
        };
      } else if (userProfile === "estr_spv_kep") {
        // Payload for Supervisor Kepatuhan
        updateData = {
          id: selectedData.originalData.id.toString(),
          profile: userProfile,
          penjelasan_spv_kepatuhan: editFormData.penjelasanSupervisorKepatuhan,
          otor_spv_kepatuhan: session.userId,
          proses_on: session.userId
        };
      } else {
        // Payload for Operator Cabang
        const formattedTanggalHubungi = editFormData.tglHubungiNasabah 
          ? editFormData.tglHubungiNasabah.toISOString().split('T')[0]
          : "";
        
        const formattedTanggalTransaksi = new Date(selectedData.originalData.created_at)
          .toISOString().split('T')[0];

        updateData = {
          id: selectedData.originalData.id.toString(),
          profile: userProfile,
          cif: selectedData.originalData.no_cif,
          norek: selectedData.originalData.sender_account_number,
          indicator: selectedData.originalData.additional_info_rc,
          cabang: selectedData.originalData.cabang,
          nama_nasabah: selectedData.originalData.sender_name,
          tanggal_transaksi: formattedTanggalTransaksi,
          keterangan: selectedData.originalData.ket,
          tanggal_hubungi: formattedTanggalHubungi,
          jam_hubungi: editFormData.jamHubungiNasabah,
          penjelasan_cso: editFormData.penjelasanCSO,
          proses_on: session.userId,
          status: "Proses CSO"
        };
      }

      const response = await updateBiFast(updateData);

      if (response.status === "success") {
        toast.current?.show({
          severity: "success",
          summary: "Success",
          detail: response.message || "Data berhasil disimpan",
          life: 3000
        });

        handleCloseModal();
        // Fetch updated data
        await fetchData();
      } else {
        toast.current?.show({
          severity: "error",
          summary: "Error",
          detail: response.message || "Gagal menyimpan data",
          life: 3000
        });
      }
    } catch (error) {
      console.error("Error saving data:", error);
      toast.current?.show({
        severity: "error",
        summary: "Error",
        detail: "Terjadi kesalahan saat menyimpan data",
        life: 3000
      });
    } finally {
      setIsSaving(false);
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
      render: (_: any, row: BiFastData) => {
        // Determine if button should be disabled based on user profile and status
        const userProfile = session?.userProfile || "";
        let isDisabled = false;

        if (userProfile === "estr_opr_cab") {
          // Operator Cabang: can edit all except approval statuses
          isDisabled = row.status === "Persetujuan Supervisor Cabang" || 
                       row.status === "Persetujuan Operator Kepatuhan" ||
                       row.status === "Persetujuan Supervisor Kepatuhan";
        } else if (userProfile === "estr_spv_cab") {
          // Supervisor Cabang: can only edit "Persetujuan Supervisor Cabang"
          isDisabled = row.status !== "Persetujuan Supervisor Cabang";
        } else if (userProfile === "estr_opr_kep") {
          // Operator Kepatuhan: can only edit "Persetujuan Operator Kepatuhan"
          isDisabled = row.status !== "Persetujuan Operator Kepatuhan";
        } else if (userProfile === "estr_spv_kep") {
          // Supervisor Kepatuhan: can only edit "Persetujuan Supervisor Kepatuhan"
          isDisabled = row.status !== "Persetujuan Supervisor Kepatuhan";
        } else {
          // Default: disable all
          isDisabled = true;
        }

        return (
          <button
            onClick={() => !isDisabled && handleRowAction("edit", row)}
            disabled={isDisabled}
            className={`px-3 py-1 rounded text-sm font-medium transition-colors ${
              isDisabled
                ? "bg-gray-300 text-gray-500 cursor-not-allowed"
                : "bg-blue-500 hover:bg-blue-600 text-white"
            }`}
          >
            Edit
          </button>
        );
      }
    }
  ];

  // No need for actions prop anymore since we have custom action column

  const searchFields = ["namaNasabah", "cabang", "info", "keterangan"];

  const handleSendback = async () => {
    if (!selectedData || !selectedData.originalData) return;

    setIsSaving(true);

    try {
      const response = await revisiBiFast({
        id: selectedData.originalData.id.toString()
      });

      if (response.status === "success") {
        toast.current?.show({
          severity: "success",
          summary: "Success",
          detail: response.message || "Data berhasil dikembalikan untuk revisi",
          life: 3000
        });

        handleCloseModal();
        // Fetch updated data
        await fetchData();
      } else {
        toast.current?.show({
          severity: "error",
          summary: "Error",
          detail: response.message || "Gagal melakukan revisi data",
          life: 3000
        });
      }
    } catch (error) {
      console.error("Error sendback BI-Fast data:", error);
      toast.current?.show({
        severity: "error",
        summary: "Error",
        detail: "Terjadi kesalahan saat melakukan revisi data",
        life: 3000
      });
    } finally {
      setIsSaving(false);
    }
  };

  const modalFooter = (
    <div className="flex justify-between items-center w-full">
      {/* Left side - Close button */}
      <button
        onClick={handleCloseModal}
        className="px-6 py-2 bg-gray-400 hover:bg-gray-500 text-white rounded-full font-medium"
      >
        Close
      </button>

      {/* Right side - Action buttons */}
      <div className="flex gap-2">
        {/* Show Sendback button for all profiles except estr_opr_cab */}
        {session?.userProfile !== "estr_opr_cab" && (
          <button
            onClick={handleSendback}
            disabled={isSaving}
            className="px-6 py-2 bg-orange-500 hover:bg-orange-600 disabled:bg-gray-400 text-white rounded-full font-medium flex items-center gap-2"
          >
            {isSaving && (
              <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
            )}
            Sendback
          </button>
        )}
        
        <button
          onClick={handleSubmit}
          disabled={isSaving}
          className="px-6 py-2 bg-green-500 hover:bg-green-600 disabled:bg-gray-400 text-white rounded-full font-medium flex items-center gap-2"
        >
          {isSaving && (
            <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
          )}
          {isSaving ? "Menyimpan..." : "Submit"}
        </button>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-50">
      <Toast ref={toast} />

      {/* Custom styling for date picker on this page only */}
      <style jsx global>{`
        .bifast-todo-datepicker input[type="text"],
        .bifast-todo-datepicker .flatpickr-input,
        .bifast-todo-datepicker input {
          border-radius: 0.5rem !important;
          border: 1px solid #d1d5db !important;
          padding: 0.5rem 1rem !important;
          font-size: 0.875rem !important;
          height: 2.5rem !important;
          box-shadow: 0 1px 2px 0 rgba(0, 0, 0, 0.05) !important;
        }
        .bifast-todo-datepicker input[type="text"]:focus,
        .bifast-todo-datepicker .flatpickr-input:focus,
        .bifast-todo-datepicker input:focus {
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
          title="BI-Fast Transaction To Do List"
          description="Kelola transaksi BI-Fast"
          headerActions={
            <div className="flex gap-2">
              <div className="flex items-center gap-2 bifast-todo-datepicker">
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
        />
      </div>

      {/* Edit Modal */}
      <Modal
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        title="Detail Transaksi"
        footer={modalFooter}
        size="xl"
      >
        {selectedData && selectedData.originalData && (
          <>
            {/* Form Fields */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
              <FormField label="No CIF">
                <Input
                  value={selectedData.originalData.no_cif}
                  disabled
                />
              </FormField>
              <FormField label="No Rekening">
                <Input
                  value={selectedData.originalData.sender_account_number}
                  disabled
                />
              </FormField>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
              <FormField label="Indikator">
                <Input
                  value={selectedData.originalData.additional_info_rc}
                  disabled
                />
              </FormField>
              <FormField label="Cabang">
                <Input
                  value={selectedData.originalData.cabang}
                  disabled
                />
              </FormField>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
              <FormField label="Nama Nasabah">
                <Input
                  value={selectedData.originalData.sender_name}
                  disabled
                />
              </FormField>
              <FormField label="Tanggal Transaksi">
                <Input
                  value={formatDateToDDMMYYYY(selectedData.originalData.created_at)}
                  disabled
                />
              </FormField>
            </div>

            <FormField label="Keterangan" className="mb-4">
              <Input
                value={selectedData.originalData.ket}
                disabled
              />
            </FormField>

            {/* Hide these fields when additional_info_rc is "O 71" */}
            {selectedData.originalData.additional_info_rc !== "O 71" && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                <FormField label="Tgl Menghubungi Nasabah">
                  <TailwindDatePicker
                    value={editFormData.tglHubungiNasabah}
                    onChange={(date) => handleInputChange('tglHubungiNasabah', date)}
                    placeholder="Pilih tanggal"
                    disabled={
                      session?.userProfile === "estr_spv_cab" ||
                      session?.userProfile === "estr_opr_kep" ||
                      session?.userProfile === "estr_spv_kep"
                    }
                  />
                  <p className="text-xs text-gray-500 mt-1">
                    Format: {editFormData.tglHubungiNasabah ?
                      editFormData.tglHubungiNasabah.toLocaleDateString("id-ID", {
                        day: "2-digit",
                        month: "short",
                        year: "numeric"
                      }).replace(/\s/g, "-") :
                      "dd-mmm-yyyy"
                    }
                  </p>
                </FormField>
                <FormField label="Jam Menghubungi Nasabah">
                  <TimeInput24
                    value={editFormData.jamHubungiNasabah}
                    onChange={(time) => handleInputChange('jamHubungiNasabah', time)}
                    placeholder="HH:MM:SS"
                    disabled={
                      session?.userProfile === "estr_spv_cab" ||
                      session?.userProfile === "estr_opr_kep" ||
                      session?.userProfile === "estr_spv_kep"
                    }
                  />
                </FormField>
              </div>
            )}

            <FormField label="Penjelasan CSO" className="mb-4">
              <Textarea
                value={editFormData.penjelasanCSO}
                onChange={(e) => handleInputChange('penjelasanCSO', e.target.value)}
                rows={4}
                placeholder="Masukkan penjelasan..."
                disabled={
                  session?.userProfile === "estr_spv_cab" ||
                  session?.userProfile === "estr_opr_kep" ||
                  session?.userProfile === "estr_spv_kep"
                }
              />
            </FormField>

            {/* Show Penjelasan SPV field for Supervisor Cabang */}
            {session?.userProfile === "estr_spv_cab" && (
              <FormField label="Penjelasan SPV" className="mb-4">
                <Textarea
                  value={editFormData.penjelasanSPV}
                  onChange={(e) => handleInputChange('penjelasanSPV', e.target.value)}
                  rows={4}
                  placeholder="Masukkan penjelasan SPV..."
                />
              </FormField>
            )}

            {/* Show Penjelasan SPV (disabled) and Penjelasan Operator Kepatuhan (editable) for Operator Kepatuhan */}
            {session?.userProfile === "estr_opr_kep" && (
              <>
                <FormField label="Penjelasan SPV" className="mb-4">
                  <Textarea
                    value={editFormData.penjelasanSPV}
                    onChange={(e) => handleInputChange('penjelasanSPV', e.target.value)}
                    rows={4}
                    placeholder="Penjelasan SPV..."
                    disabled
                  />
                </FormField>
                <FormField label="Penjelasan Operator Kepatuhan" className="mb-4">
                  <Textarea
                    value={editFormData.penjelasanOperatorKepatuhan}
                    onChange={(e) => handleInputChange('penjelasanOperatorKepatuhan', e.target.value)}
                    rows={4}
                    placeholder="Masukkan penjelasan operator kepatuhan..."
                  />
                </FormField>
              </>
            )}

            {/* Show Penjelasan SPV (disabled), Penjelasan Operator Kepatuhan (disabled) and Penjelasan Supervisor Kepatuhan (editable) for Supervisor Kepatuhan */}
            {session?.userProfile === "estr_spv_kep" && (
              <>
                <FormField label="Penjelasan SPV" className="mb-4">
                  <Textarea
                    value={editFormData.penjelasanSPV}
                    rows={4}
                    placeholder="Penjelasan SPV..."
                    disabled
                  />
                </FormField>
                <FormField label="Penjelasan Operator Kepatuhan" className="mb-4">
                  <Textarea
                    value={editFormData.penjelasanOperatorKepatuhan}
                    rows={4}
                    placeholder="Penjelasan Operator Kepatuhan..."
                    disabled
                  />
                </FormField>
                <FormField label="Penjelasan Supervisor Kepatuhan" className="mb-4">
                  <Textarea
                    value={editFormData.penjelasanSupervisorKepatuhan}
                    onChange={(e) => handleInputChange('penjelasanSupervisorKepatuhan', e.target.value)}
                    rows={4}
                    placeholder="Masukkan penjelasan supervisor kepatuhan..."
                  />
                </FormField>
              </>
            )}
          </>
        )}
      </Modal>
    </div>
  );
}
