"use client";
import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { updateTodo } from "@/services/manualCabang";
import { sendEmailNotification } from "@/services/emailQueue";
import { Toast } from "primereact/toast";
import ConfirmDialog from "@/components/common/ConfirmDialog";
import Modal from "@/components/common/Modal";
import DataTable from "@/components/common/DataTable";
import FormField, { Input, CustomListbox, Textarea, TimeInput24 } from "@/components/common/FormField";
import TailwindDatePicker from "@/components/common/TailwindDatePicker";
import { useSession } from "@/hooks/useSession";
import { formatDateToYYYYMMDD } from "@/utils/dateFormatter";

interface ManualCabangData {
  NO: string;
  ID_LAPORAN: string;
  INDIKATOR: string;
  NO_CIF: string;
  NO_REK: string;
  NAMA_NASABAH: string;
  KETERANGAN: string;
  KETERANGAN_STATUS: string | null;
  CABANG: string;
  CABANG_INDUK: string | null;
  KET_CABANG_OPR: string | null;
  KET_CABANG_SPV: string | null;
  KET_KEPATUHAN: string | null;
  TGL_HUB_NASABAH: string | null;
  JAM_HUB_NASABAH: string;
  STATUS: string;
  TANGGAL_LAPORAN: string;
  TANGGAL_INPUT: string;
  TANGGAL_OTOR_CSO: string | null;
  TANGGAL_OTOR_OPR_KEP: string | null;
  TANGGAL_OTOR_SPV_KEP: string | null;
  INPUT_BY_CBG: string;
  OTOR_BY_CBG: string | null;
  OTOR_BY_KEP_OPR: string | null;
  OTOR_BY_KEP_SPV: string | null;
  REJECT_BY: string;
  TANGGAL_REJECT: string;
  ALASAN_REJECT: string;
  STATUS_REJECT: string;
  TRANSAKSI_MENCURIGAKAN: string | null;
  TENGGAT: string | null;
  SKALA: string | null;
  KETERLAMBATAN: string | null;
}

interface ManualCabangToDoListClientProps {
  initialData: ManualCabangData[];
}

export default function ManualCabangToDoListClient({ initialData }: ManualCabangToDoListClientProps) {
  const router = useRouter();
  const toast = React.useRef<Toast>(null);
  const { session } = useSession();
  const [isSaving, setIsSaving] = useState(false);
  const [filteredData, setFilteredData] = useState<ManualCabangData[]>(initialData);

  // Date filter state
  const [filterDate, setFilterDate] = useState<Date | null>(null);

  // Modal state
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedData, setSelectedData] = useState<ManualCabangData | null>(null);
  const [editFormData, setEditFormData] = useState({
    tglHubungiNasabah: null as Date | null,
    jamHubungiNasabah: "00:00:00",
    transaksiMencurigakan: "Tidak",
    penjelasanCSO: ""
  });

  // Confirmation dialog state
  const [showConfirm, setShowConfirm] = useState(false);

  // Filter data by date
  React.useEffect(() => {
    if (!filterDate) {
      setFilteredData(initialData);
      return;
    }

    const filtered = initialData.filter(item => {
      const itemDate = new Date(item.TANGGAL_LAPORAN);
      const filterDateOnly = new Date(filterDate.getFullYear(), filterDate.getMonth(), filterDate.getDate());
      const itemDateOnly = new Date(itemDate.getFullYear(), itemDate.getMonth(), itemDate.getDate());

      return itemDateOnly.getTime() === filterDateOnly.getTime();
    });

    setFilteredData(filtered);
  }, [filterDate, initialData]);

  const formatDate = (dateString: string) => {
    if (!dateString || dateString === "1970-01-01") return "-";
    const date = new Date(dateString);
    const day = date.getDate().toString().padStart(2, '0');
    const month = date.toLocaleDateString("en-US", { month: "short" });
    const year = date.getFullYear();
    return `${day}-${month}-${year}`;
  };

  // Add formatted date to data for search
  const dataWithFormattedDate = React.useMemo(() => {
    return filteredData.map(item => ({
      ...item,
      TANGGAL_FORMATTED: formatDate(item.TANGGAL_LAPORAN)
    }));
  }, [filteredData]);

  const handleRowAction = (action: string, item: ManualCabangData) => {
    if (action === "edit") {
      setSelectedData(item);
      // Map Y/T to Ya/Tidak
      const transaksiMencurigakan = item.TRANSAKSI_MENCURIGAKAN === "Y" ? "Ya" : item.TRANSAKSI_MENCURIGAKAN === "T" ? "Tidak" : "Tidak";
      
      setEditFormData({
        tglHubungiNasabah: item.TGL_HUB_NASABAH ? new Date(item.TGL_HUB_NASABAH) : null,
        jamHubungiNasabah: item.JAM_HUB_NASABAH || "00:00:00",
        transaksiMencurigakan: transaksiMencurigakan,
        penjelasanCSO: item.KET_CABANG_OPR || ""
      });
      setIsModalOpen(true);
    }
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedData(null);
  };

  const handleSave = () => {
    if (!selectedData) return;

    // Validation
    if (!editFormData.tglHubungiNasabah) {
      toast.current?.show({
        severity: "error",
        summary: "Error",
        detail: "Tanggal menghubungi nasabah harus diisi"
      });
      return;
    }

    if (!editFormData.penjelasanCSO.trim()) {
      toast.current?.show({
        severity: "error",
        summary: "Error",
        detail: "Penjelasan CSO harus diisi"
      });
      return;
    }

    // Show confirmation dialog
    setShowConfirm(true);
  };

  const handleConfirm = () => {
    setShowConfirm(false);
    performSave();
  };

  const performSave = async () => {
    if (!selectedData) return;

    setIsSaving(true);

    try {
      // Format date to YYYY-MM-DD for API (without timezone conversion)
      const formattedDate = formatDateToYYYYMMDD(editFormData.tglHubungiNasabah!);

      // Convert "Ya"/"Tidak" to "Y"/"T" for database
      const transaksiMencurigakanValue = editFormData.transaksiMencurigakan === "Ya" ? "Y" : "T";

      const updateData = {
        no: selectedData.NO.toString(),
        tgl_hub_nasabah: formattedDate,
        jam_hub_nasabah: editFormData.jamHubungiNasabah,
        trans_mencurigakan: transaksiMencurigakanValue,
        ket_cabang_opr: editFormData.penjelasanCSO,
        input_by_cbg: session?.userId || selectedData.INPUT_BY_CBG
      };

      const response = await updateTodo(updateData);

      if (response.status === "success") {
        // Send email notification after successful save
        try {
          await sendEmailNotification(
            "manual_cabang_update",
            session?.userId || "system",
            session?.branchCode || ""
          );
          console.log("Email notification queued successfully");
        } catch (emailError) {
          console.error("Error queuing email:", emailError);
          // Don't show error to user, just log it
        }

        toast.current?.show({
          severity: "success",
          summary: "Success",
          detail: "Data berhasil disimpan"
        });

        handleCloseModal();
        router.refresh(); // Refresh the page to get updated data
      } else {
        toast.current?.show({
          severity: "error",
          summary: "Error",
          detail: response.message || "Gagal menyimpan data"
        });
      }
    } catch (error) {
      console.error("Error saving data:", error);
      toast.current?.show({
        severity: "error",
        summary: "Error",
        detail: "Terjadi kesalahan saat menyimpan data"
      });
    } finally {
      setIsSaving(false);
    }
  };

  const handleInputChange = (field: string, value: string | Date | null) => {
    setEditFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  // Define table columns
  const columns = [
    {
      key: "NO",
      label: "No",
      className: "text-center",
      render: (_: any, __: any, index: number) => index
    },
    {
      key: "INDIKATOR",
      label: "Indikator"
    },
    {
      key: "NO_CIF",
      label: "No CIF"
    },
    {
      key: "NAMA_NASABAH",
      label: "Nama Nasabah",
      className: "font-medium"
    },
    {
      key: "CABANG",
      label: "Cabang"
    },
    {
      key: "TANGGAL_LAPORAN",
      label: "Tanggal",
      render: (value: string) => formatDate(value)
    },
    {
      key: "TENGGAT",
      label: "Tenggat",
      render: (value: string | null) => value || "-"
    },
    {
      key: "SKALA",
      label: "Skala",
      render: (value: string | null) => value || "-"
    },
    {
      key: "KETERANGAN_STATUS",
      label: "Keterangan",
      render: (value: string | null) => value || "-"
    }
  ];

  // Define table actions
  const actions = [
    {
      label: "Edit",
      action: "edit",
      className: "bg-blue-500 hover:bg-blue-600 text-white"
    }
  ];

  // Define search fields - include formatted date for search
  const searchFields = ["NAMA_NASABAH", "NO_CIF", "INDIKATOR", "CABANG", "KETERANGAN_STATUS", "TANGGAL_FORMATTED"];

  const modalFooter = (
    <div className="flex justify-between items-center w-full">
      {/* Left side - Close button */}
      <button
        onClick={handleCloseModal}
        className="px-6 py-2 bg-gray-400 hover:bg-gray-500 text-white rounded-full font-medium"
      >
        Close
      </button>

      {/* Right side - Save button */}
      <button
        onClick={handleSave}
        disabled={isSaving}
        className="px-6 py-2 bg-green-500 hover:bg-green-600 disabled:bg-gray-400 text-white rounded-full font-medium flex items-center gap-2"
      >
        {isSaving && (
          <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
        )}
        {isSaving ? "Menyimpan..." : "Save"}
      </button>
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-50">
      <Toast ref={toast} />

      {/* Custom Confirmation Dialog */}
      <ConfirmDialog
        isOpen={showConfirm}
        onClose={() => setShowConfirm(false)}
        onConfirm={handleConfirm}
        title="Konfirmasi Simpan"
        message="Apakah Anda yakin ingin menyimpan data ini?"
        confirmLabel="Ya, Simpan"
        cancelLabel="Batal"
      />

      <div className="p-6">
        {/* Data Table with integrated header */}
        <DataTable
          data={dataWithFormattedDate}
          columns={columns}
          actions={actions}
          searchFields={searchFields}
          onRowAction={handleRowAction}
          emptyMessage="Tidak ada data yang ditemukan"
          title="Manual Cabang To Do List"
          description="Kelola data laporan manual cabang"
          headerActions={
            <div className="flex gap-2">
              <div className="flex items-center gap-2">
                <TailwindDatePicker
                  value={filterDate}
                  onChange={(date) => setFilterDate(date)}
                  placeholder="Tanggal"
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
                <Input
                  value={selectedData.NO_CIF}
                  disabled
                />
              </FormField>
              <FormField label="No Rekening">
                <Input
                  value={selectedData.NO_REK || "-"}
                  disabled
                />
              </FormField>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
              <FormField label="Nama Nasabah">
                <Input
                  value={selectedData.NAMA_NASABAH}
                  disabled
                />
              </FormField>
              <FormField label="Cabang">
                <Input
                  value={selectedData.CABANG}
                  disabled
                />
              </FormField>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
              <FormField label="Indikator">
                <Input
                  value={selectedData.INDIKATOR}
                  disabled
                />
              </FormField>
              <FormField label="Tanggal Transaksi">
                <Input
                  value={formatDate(selectedData.TANGGAL_LAPORAN)}
                  disabled
                />
              </FormField>
            </div>

            <FormField label="Keterangan Indikator" className="mb-4">
              <Input
                value={selectedData.KETERANGAN}
                disabled
              />
            </FormField>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
              <FormField label="Tgl Menghubungi Nasabah">
                <TailwindDatePicker
                  value={editFormData.tglHubungiNasabah}
                  onChange={(date) => handleInputChange('tglHubungiNasabah', date)}
                  placeholder="Pilih tanggal"
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
                />
              </FormField>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
              <FormField label="Transaksi Mencurigakan">
                <CustomListbox
                  value={editFormData.transaksiMencurigakan}
                  onChange={(value) => handleInputChange('transaksiMencurigakan', value)}
                  options={[
                    { value: "Tidak", label: "Tidak" },
                    { value: "Ya", label: "Ya" }
                  ]}
                  placeholder="Pilih status"
                />
              </FormField>
            </div>

            <FormField label="Penjelasan CSO" className="mb-4">
              <Textarea
                value={editFormData.penjelasanCSO}
                onChange={(e) => handleInputChange('penjelasanCSO', e.target.value)}
                rows={4}
                placeholder="Masukkan penjelasan..."
              />
            </FormField>

            {/* Conditional field: Show only if status is Send Back */}
            {selectedData.KETERANGAN_STATUS === "Send Back" && (
              <FormField label="Penjelasan Send Back" className="mb-4">
                <Textarea
                  value={selectedData.ALASAN_REJECT || "-"}
                  onChange={() => {}}
                  rows={4}
                  disabled
                />
              </FormField>
            )}
          </>
        )}
      </Modal>
    </div>
  );
}
