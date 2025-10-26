"use client";
import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Cookies from "js-cookie";
import { getManualKepSpv } from "@/services/manualKep";
import DataTable from "@/components/common/DataTable";
import Modal from "@/components/common/Modal";
import FormField, { Input, CustomListbox, Textarea, DatePickerInput, TimeInput24 } from "@/components/common/FormField";

interface ManualKepSupervisorData {
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

export default function ManualKepSupervisorPage() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(true);
  const [data, setData] = useState<ManualKepSupervisorData[]>([]);

  // Modal state
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedData, setSelectedData] = useState<ManualKepSupervisorData | null>(null);
  const [editFormData, setEditFormData] = useState({
    tglHubungiNasabah: null as Date | null,
    jamHubungiNasabah: "00:00:00",
    transaksiMencurigakan: "Tidak",
    penjelasanCSO: ""
  });

  useEffect(() => {
    document.title = "ESTR | Manual Kepatuhan Supervisor";

    const userId = Cookies.get("userId");
    const branchCode = Cookies.get("branchCode");

    if (!userId) {
      setIsLoading(true);
      router.push("/signin");
      return;
    }

    // Fetch data
    const fetchData = async () => {
      try {
        const response = await getManualKepSpv();
        if (response.status === "success" && response.data) {
          setData(response.data);
        }
      } catch (error) {
        console.error("Error fetching data:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, [router]);

  const formatDate = (dateString: string) => {
    if (!dateString || dateString === "1970-01-01") return "-";
    return new Date(dateString).toLocaleDateString("id-ID");
  };

  const handleRowAction = (action: string, item: ManualKepSupervisorData) => {
    if (action === "view") {
      setSelectedData(item);
      setEditFormData({
        tglHubungiNasabah: item.TGL_HUB_NASABAH ? new Date(item.TGL_HUB_NASABAH) : null,
        jamHubungiNasabah: item.JAM_HUB_NASABAH || "00:00:00",
        transaksiMencurigakan: item.TRANSAKSI_MENCURIGAKAN || "Tidak",
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

  // Define table columns based on the image header
  const columns = [
    {
      key: "NO",
      label: "No",
      className: "text-center",
      render: (_: any, __: any, rowNumber: number) => rowNumber
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

  // Define search fields
  const searchFields = ["NAMA_NASABAH", "NO_CIF", "INDIKATOR", "CABANG"];

  const modalFooter = (
    <div className="flex justify-between items-center w-full">
      {/* Left side - Close button */}
      <button
        onClick={handleCloseModal}
        className="px-6 py-2 bg-gray-400 hover:bg-gray-500 text-white rounded-full font-medium"
      >
        Close
      </button>

      {/* Right side - Empty for consistency */}
      <div></div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Spinner */}
      {isLoading && (
        <div className="fixed inset-0 z-50 flex items-center justify-center backdrop-blur-sm bg-white/30">
          <div className="w-16 h-16 border-4 border-blue-900 border-t-transparent rounded-full animate-spin"></div>
        </div>
      )}

      <div className="p-6">
        {/* Data Table with integrated header */}
        <DataTable
          data={data}
          columns={columns}
          actions={actions}
          searchFields={searchFields}
          onRowAction={handleRowAction}
          loading={isLoading}
          emptyMessage="Tidak ada data yang ditemukan"
          title="Manual Kepatuhan Supervisor"
          description="Kelola data laporan manual kepatuhan supervisor"
        />
      </div>

      {/* View Modal */}
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
              <FormField label="Indikator">
                <Input
                  value={selectedData.INDIKATOR}
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
              <FormField label="Nama Nasabah">
                <Input
                  value={selectedData.NAMA_NASABAH}
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

            <FormField label="Keterangan" className="mb-4">
              <Input
                value={selectedData.KETERANGAN}
                disabled
              />
            </FormField>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
              <FormField label="Tgl Menghubungi Nasabah">
                <DatePickerInput
                  selected={editFormData.tglHubungiNasabah}
                  onChange={(date) => handleInputChange('tglHubungiNasabah', date)}
                  placeholderText=""
                  dateFormat="dd/MM/yyyy"
                />
              </FormField>
              <FormField label="Jam Menghubungi Nasabah">
                <TimeInput24
                  value={editFormData.jamHubungiNasabah}
                  onChange={(time) => handleInputChange('jamHubungiNasabah', time)}
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
          </>
        )}
      </Modal>
    </div>
  );
}