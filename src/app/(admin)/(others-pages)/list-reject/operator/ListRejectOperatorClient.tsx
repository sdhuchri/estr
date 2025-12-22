"use client";
import React, { useState } from "react";
import DataTable from "@/components/common/DataTable";
import Modal from "@/components/common/Modal";
import FormField, { Input, CustomListbox, Textarea, TimeInput24 } from "@/components/common/FormField";
import TailwindDatePicker from "@/components/common/TailwindDatePicker";
import FadeInWrapper from "@/components/common/FadeInWrapper";

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

interface ListRejectOperatorClientProps {
  initialData: ListRejectData[];
}

export default function ListRejectOperatorClient({ initialData }: ListRejectOperatorClientProps) {
  const [data] = useState<ListRejectData[]>(initialData);
  const [filteredData, setFilteredData] = useState<ListRejectData[]>(initialData);

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

  // Define table columns based on the image
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
        <span className={`px-2 py-1 rounded-full text-xs font-medium ${value === 'Aktif' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
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
      <div></div>
    </div>
  );

  return (
    <FadeInWrapper>
      <div className="min-h-screen bg-gray-50">
        <div className="p-6">
          <DataTable
            data={dataWithFormattedDate}
            columns={columns}
            actions={actions}
            searchFields={searchFields}
            onRowAction={handleRowAction}
            emptyMessage="Tidak ada data yang ditemukan"
            title="List Reject Operator"
            description="Kelola data laporan yang direject"
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
