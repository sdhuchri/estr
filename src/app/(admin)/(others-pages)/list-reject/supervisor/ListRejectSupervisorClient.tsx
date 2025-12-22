"use client";
import React, { useState, useRef } from "react";
import DataTable from "@/components/common/DataTable";
import Modal from "@/components/common/Modal";
import FormField, { Input, CustomListbox, Textarea, TimeInput24 } from "@/components/common/FormField";
import TailwindDatePicker from "@/components/common/TailwindDatePicker";
import FadeInWrapper from "@/components/common/FadeInWrapper";
import { Toast } from "primereact/toast";
import { updateStatusListReject } from "@/services/listReject";
import ConfirmDialog from "@/components/common/ConfirmDialog";

interface ListRejectData {
  NO: string;
  ID_LAPORAN: string;
  INDIKATOR: string;
  NO_CIF: string;
  NO_REK: string;
  NAMA_NASABAH: string;
  KETERANGAN: string;
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
}

interface ListRejectSupervisorClientProps {
  initialData: ListRejectData[];
}

export default function ListRejectSupervisorClient({ initialData }: ListRejectSupervisorClientProps) {
  const [data, setData] = useState<ListRejectData[]>(initialData);
  const [filteredData, setFilteredData] = useState<ListRejectData[]>(initialData);
  const toast = useRef<Toast>(null);
  const [isActivating, setIsActivating] = useState(false);
  const [isBulkActivating, setIsBulkActivating] = useState(false);
  const [selectedRows, setSelectedRows] = useState<string[]>([]);

  // Date filter state
  const [filterDate, setFilterDate] = useState<Date | null>(null);

  // Modal state
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedData, setSelectedData] = useState<ListRejectData | null>(null);
  const [editFormData, setEditFormData] = useState({
    tglHubungiNasabah: null as Date | null,
    jamHubungiNasabah: "00:00:00",
    transaksiMencurigakan: "Tidak",
    penjelasanCSO: ""
  });

  // Confirmation dialog state
  const [isConfirmDialogOpen, setIsConfirmDialogOpen] = useState(false);
  const [isBulkConfirmDialogOpen, setIsBulkConfirmDialogOpen] = useState(false);

  // Filter data by date
  React.useEffect(() => {
    if (!filterDate) {
      setFilteredData(data);
      return;
    }

    const filtered = data.filter(item => {
      const itemDate = new Date(item.TANGGAL_LAPORAN);
      const filterDateOnly = new Date(filterDate.getFullYear(), filterDate.getMonth(), filterDate.getDate());
      const itemDateOnly = new Date(itemDate.getFullYear(), itemDate.getMonth(), itemDate.getDate());

      return itemDateOnly.getTime() === filterDateOnly.getTime();
    });

    setFilteredData(filtered);
  }, [filterDate, data]);

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

  const handleRowAction = (action: string, item: ListRejectData) => {
    if (action === "view") {
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

  const handleInputChange = (field: string, value: string | Date | null) => {
    setEditFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleAktifkanClick = () => {
    setIsConfirmDialogOpen(true);
  };

  const handleAktifkan = async () => {
    if (!selectedData) return;

    setIsConfirmDialogOpen(false);
    setIsActivating(true);
    try {
      const response = await updateStatusListReject([String(selectedData.NO)]);

      if (response.status === "success") {
        toast.current?.show({
          severity: "success",
          summary: "Berhasil!",
          detail: response.message || "Data berhasil diaktifkan!",
          life: 3000
        });

        // Update local data
        setData(prevData => prevData.filter(item => item.NO !== selectedData.NO));
        
        // Close modal after success
        setTimeout(() => {
          handleCloseModal();
        }, 1000);
      } else {
        toast.current?.show({
          severity: "error",
          summary: "Gagal!",
          detail: response.message || "Gagal mengaktifkan data!",
          life: 3000
        });
      }
    } catch (error) {
      console.error("Error activating data:", error);
      toast.current?.show({
        severity: "error",
        summary: "Gagal!",
        detail: "Terjadi kesalahan saat mengaktifkan data!",
        life: 3000
      });
    } finally {
      setIsActivating(false);
    }
  };

  const handleBulkAktifkanClick = () => {
    if (selectedRows.length === 0) {
      toast.current?.show({
        severity: "warn",
        summary: "Peringatan!",
        detail: "Pilih minimal 1 data untuk diaktifkan!",
        life: 3000
      });
      return;
    }
    setIsBulkConfirmDialogOpen(true);
  };

  const handleBulkAktifkan = async () => {
    setIsBulkConfirmDialogOpen(false);
    setIsBulkActivating(true);
    try {
      const response = await updateStatusListReject(selectedRows.map(String));

      if (response.status === "success") {
        toast.current?.show({
          severity: "success",
          summary: "Berhasil!",
          detail: response.message || `Berhasil mengaktifkan ${selectedRows.length} data!`,
          life: 3000
        });

        // Update local data - remove activated items
        setData(prevData => prevData.filter(item => !selectedRows.includes(item.NO)));
        setSelectedRows([]);
      } else {
        toast.current?.show({
          severity: "error",
          summary: "Gagal!",
          detail: response.message || "Gagal mengaktifkan data!",
          life: 3000
        });
      }
    } catch (error) {
      console.error("Error bulk activating data:", error);
      toast.current?.show({
        severity: "error",
        summary: "Gagal!",
        detail: "Terjadi kesalahan saat mengaktifkan data!",
        life: 3000
      });
    } finally {
      setIsBulkActivating(false);
    }
  };

  const handleCheckboxChange = (no: string) => {
    setSelectedRows(prev => 
      prev.includes(no) 
        ? prev.filter(id => id !== no)
        : [...prev, no]
    );
  };

  const handleSelectAll = (checked: boolean) => {
    if (checked) {
      setSelectedRows(data.map(item => item.NO));
    } else {
      setSelectedRows([]);
    }
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
      key: "TANGGAL_LAPORAN",
      label: "Tanggal Transaksi",
      render: (value: string) => formatDate(value)
    },
    {
      key: "CABANG",
      label: "Cabang"
    },
    {
      key: "REJECT_BY",
      label: "Reject By"
    },
    {
      key: "STATUS_REJECT",
      label: "Status Reject",
      render: (value: string) => (
        <span className={`px-2 py-1 rounded-full text-xs font-medium ${value === 'Tidak Aktif' ? 'bg-gray-100 text-gray-800' : 'bg-red-100 text-red-800'
          }`}>
          {value}
        </span>
      )
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

  // Define search fields - include formatted date for search
  const searchFields = ["NAMA_NASABAH", "NO_CIF", "INDIKATOR", "CABANG", "REJECT_BY", "TANGGAL_FORMATTED"];

  const modalFooter = (
    <div className="flex justify-between items-center w-full">
      <button
        onClick={handleCloseModal}
        className="px-6 py-2 bg-gray-400 hover:bg-gray-500 text-white rounded-full font-medium"
      >
        Close
      </button>
      <button
        onClick={handleAktifkanClick}
        disabled={isActivating}
        className="px-6 py-2 bg-green-500 hover:bg-green-600 disabled:bg-green-300 text-white rounded-full font-medium flex items-center gap-2"
      >
        {isActivating ? (
          <>
            <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
            Mengaktifkan...
          </>
        ) : (
          "Aktif"
        )}
      </button>
    </div>
  );

  return (
    <FadeInWrapper>
      <Toast ref={toast} />
      
      {/* Confirmation Dialog for Single Activation */}
      <ConfirmDialog
        isOpen={isConfirmDialogOpen}
        onClose={() => setIsConfirmDialogOpen(false)}
        onConfirm={handleAktifkan}
        title="Konfirmasi Aktivasi"
        message="Apakah Anda yakin ingin mengaktifkan data ini?"
        confirmLabel="Ya, Aktifkan"
        cancelLabel="Batal"
        variant="default"
      />

      {/* Confirmation Dialog for Bulk Activation */}
      <ConfirmDialog
        isOpen={isBulkConfirmDialogOpen}
        onClose={() => setIsBulkConfirmDialogOpen(false)}
        onConfirm={handleBulkAktifkan}
        title="Konfirmasi Aktivasi Bulk"
        message={`Apakah Anda yakin ingin mengaktifkan ${selectedRows.length} data yang dipilih?`}
        confirmLabel="Ya, Aktifkan"
        cancelLabel="Batal"
        variant="default"
      />

      <div className="min-h-screen bg-gray-50">
        <div className="p-6">
          <DataTable
          data={dataWithFormattedDate}
          columns={columns}
          actions={actions}
          searchFields={searchFields}
          onRowAction={handleRowAction}
          emptyMessage="Tidak ada data yang ditemukan"
          title="List Reject Supervisor"
          description="Kelola data laporan yang direject dan sudah tidak aktif"
          showCheckbox={true}
          selectedRows={selectedRows}
          onCheckboxChange={handleCheckboxChange}
          onSelectAll={handleSelectAll}
          getRowId={(row) => row.NO}
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
              onClick={handleBulkAktifkanClick}
              disabled={isBulkActivating || selectedRows.length === 0}
              className="flex items-center gap-2 px-4 py-2 bg-green-500 hover:bg-green-600 disabled:bg-green-300 text-white rounded-lg font-medium transition-colors"
            >
              {isBulkActivating ? (
                <>
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  Mengaktifkan...
                </>
              ) : (
                <>
                  Aktif ({selectedRows.length})
                </>
              )}
            </button>
          }
        />
      </div>

      {/* View Modal */}
      <Modal
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        title="Detail Reject"
        footer={modalFooter}
        size="xl"
      >
        {selectedData && (
          <>
            {/* Red Info Box for Tidak Aktif */}
            {/* <div className="bg-red-500 text-white p-4 rounded-lg mb-6">
              <h3 className="text-lg font-semibold text-center">Aktifkan terlebih dahulu oleh Supervisor!</h3>
            </div> */}

            {/* Form Fields */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
              <FormField label="No CIF">
                <Input value={selectedData.NO_CIF} disabled />
              </FormField>
              <FormField label="No Rekening">
                <Input value={selectedData.NO_REK || "-"} disabled />
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

            <FormField label="Keterangan" className="mb-4">
              <Input value={selectedData.KETERANGAN} disabled />
            </FormField>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
              <FormField label="Tgl Menghubungi Nasabah">
                <TailwindDatePicker
                  value={editFormData.tglHubungiNasabah}
                  onChange={(date) => handleInputChange('tglHubungiNasabah', date)}
                  placeholder="Pilih tanggal"
                  disabled
                />
                <p className="text-xs text-gray-500 mt-1">Format: dd-mmm-yyyy</p>
              </FormField>
              <FormField label="Jam Menghubungi Nasabah">
                <TimeInput24
                  value={editFormData.jamHubungiNasabah}
                  onChange={(time) => handleInputChange('jamHubungiNasabah', time)}
                  disabled
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
                  disabled
                />
              </FormField>
            </div>

            <FormField label="Penjelasan CSO" className="mb-4">
              <Textarea
                value={editFormData.penjelasanCSO}
                onChange={(e) => handleInputChange('penjelasanCSO', e.target.value)}
                rows={4}
                placeholder="Masukkan penjelasan..."
                disabled
              />
            </FormField>

            <FormField label="Alasan Reject" className="mb-4">
              <Textarea
                value={selectedData.ALASAN_REJECT || ""}
                onChange={() => { }}
                rows={3}
                placeholder="Alasan reject..."
                disabled
              />
            </FormField>
          </>
        )}
      </Modal>
    </div>
    </FadeInWrapper>
  );
}
