"use client";
import { useState, useRef } from "react";
import { useRouter } from "next/navigation";
import DataTable from "@/components/common/DataTable";
import Modal from "@/components/common/Modal";
import FormField, { Input, CustomListbox, Textarea, TimeInput24 } from "@/components/common/FormField";
import TailwindDatePicker from "@/components/common/TailwindDatePicker";
import { Toast } from "primereact/toast";
import ConfirmDialog from "@/components/common/ConfirmDialog";
import { otorisasiManualKep } from "@/services/manualKep";
import { sendMultipleEmails, DEFAULT_EMAIL_RECIPIENTS } from "@/services/emailQueue";

interface ManualKepOperatorData {
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

interface ManualKepOperatorClientProps {
  initialData: ManualKepOperatorData[];
}

export default function ManualKepOperatorClient({ initialData }: ManualKepOperatorClientProps) {
  const router = useRouter();
  const toast = useRef<Toast>(null);
  const [data, setData] = useState<ManualKepOperatorData[]>(initialData);
  const [isSaving, setIsSaving] = useState(false);

  // Modal state
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedData, setSelectedData] = useState<ManualKepOperatorData | null>(null);
  const [editFormData, setEditFormData] = useState({
    tglHubungiNasabah: null as Date | null,
    jamHubungiNasabah: "00:00:00",
    transaksiMencurigakan: "Tidak",
    penjelasanCSO: "",
    penjelasanSPV: "",
    penjelasanKepatuhan: ""
  });

  // Confirmation dialog state
  const [showConfirm, setShowConfirm] = useState(false);
  const [confirmAction, setConfirmAction] = useState<"approve" | "reject" | "simpan">("simpan");

  const formatDate = (dateString: string) => {
    if (!dateString || dateString === "1970-01-01") return "-";
    return new Date(dateString).toLocaleDateString("id-ID");
  };

  const handleRowAction = (action: string, item: ManualKepOperatorData) => {
    if (action === "view") {
      setSelectedData(item);
      // Map Y/T to Ya/Tidak
      const transaksiMencurigakan = item.TRANSAKSI_MENCURIGAKAN === "Y" ? "Ya" : item.TRANSAKSI_MENCURIGAKAN === "T" ? "Tidak" : "Tidak";
      
      setEditFormData({
        tglHubungiNasabah: item.TGL_HUB_NASABAH ? new Date(item.TGL_HUB_NASABAH) : null,
        jamHubungiNasabah: item.JAM_HUB_NASABAH || "00:00:00",
        transaksiMencurigakan: transaksiMencurigakan,
        penjelasanCSO: item.KET_CABANG_OPR || "",
        penjelasanSPV: item.KET_CABANG_SPV || "",
        penjelasanKepatuhan: item.KET_KEPATUHAN || ""
      });
      setIsModalOpen(true);
    }
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedData(null);
  };

  const handleSave = () => {
    if (!editFormData.penjelasanKepatuhan.trim()) {
      toast.current?.show({
        severity: "error",
        summary: "Error",
        detail: "Penjelasan Kepatuhan harus diisi"
      });
      return;
    }
    setConfirmAction("simpan");
    setShowConfirm(true);
  };

  const handleApprove = () => {
    if (!editFormData.penjelasanKepatuhan.trim()) {
      toast.current?.show({
        severity: "error",
        summary: "Error",
        detail: "Penjelasan Kepatuhan harus diisi"
      });
      return;
    }
    setConfirmAction("approve");
    setShowConfirm(true);
  };

  const handleReject = () => {
    if (!editFormData.penjelasanKepatuhan.trim()) {
      toast.current?.show({
        severity: "error",
        summary: "Error",
        detail: "Penjelasan Kepatuhan harus diisi"
      });
      return;
    }
    setConfirmAction("reject");
    setShowConfirm(true);
  };

  const handleConfirm = async () => {
    setShowConfirm(false);
    await performAction(confirmAction);
  };

  const performAction = async (action: "approve" | "reject" | "simpan") => {
    if (!selectedData) return;

    setIsSaving(true);

    try {
      const payload = {
        no: selectedData.NO,
        ket_kepatuhan: editFormData.penjelasanKepatuhan,
        action: action,
        otor_by_kep_opr: "USER123" // TODO: Get from session
      };

      const response = await otorisasiManualKep(payload);

      if (response.status === "success") {
        // Send email notifications after successful action
        try {
          let emailAction = "manual_kep_operator_save";
          if (action === "approve") emailAction = "manual_kep_operator_approve";
          if (action === "reject") emailAction = "manual_kep_operator_reject";
          
          await sendMultipleEmails(
            DEFAULT_EMAIL_RECIPIENTS,
            emailAction,
            "USER123" // TODO: Get from session
          );
          console.log(`Email notifications queued successfully for ${action}`);
        } catch (emailError) {
          console.error("Error queuing emails:", emailError);
          // Don't show error to user, just log it
        }

        toast.current?.show({
          severity: "success",
          summary: "Success",
          detail: response.message || "Data berhasil diproses"
        });

        // Remove the processed item from the table
        setData(prevData => prevData.filter(item => item.NO !== selectedData.NO));
        
        handleCloseModal();
        
        // Also trigger router refresh for server-side sync
        setTimeout(() => {
          router.refresh();
        }, 100);
      } else {
        toast.current?.show({
          severity: "error",
          summary: "Error",
          detail: response.message || "Gagal memproses data"
        });
      }
    } catch (error) {
      console.error("Error processing action:", error);
      toast.current?.show({
        severity: "error",
        summary: "Error",
        detail: "Terjadi kesalahan saat memproses data"
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
      <button
        onClick={handleCloseModal}
        className="px-6 py-2 bg-gray-400 hover:bg-gray-500 text-white rounded-full font-medium"
        disabled={isSaving}
      >
        Close
      </button>
      <div className="flex gap-3">
        <button
          onClick={handleReject}
          disabled={isSaving}
          className="px-6 py-2 bg-red-500 hover:bg-red-600 disabled:bg-gray-400 text-white rounded-full font-medium flex items-center gap-2"
        >
          {isSaving && confirmAction === "reject" && (
            <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
          )}
          Reject
        </button>
        <button
          onClick={handleSave}
          disabled={isSaving}
          className="px-6 py-2 bg-blue-500 hover:bg-blue-600 disabled:bg-gray-400 text-white rounded-full font-medium flex items-center gap-2"
        >
          {isSaving && confirmAction === "simpan" && (
            <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
          )}
          Simpan
        </button>
        <button
          onClick={handleApprove}
          disabled={isSaving}
          className="px-6 py-2 bg-green-500 hover:bg-green-600 disabled:bg-gray-400 text-white rounded-full font-medium flex items-center gap-2"
        >
          {isSaving && confirmAction === "approve" && (
            <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
          )}
          Approve
        </button>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-50">
      <Toast ref={toast} />

      {/* Confirmation Dialog for All Actions */}
      <ConfirmDialog
        isOpen={showConfirm}
        onClose={() => setShowConfirm(false)}
        onConfirm={handleConfirm}
        title={confirmAction === "approve" ? "Konfirmasi Approve" : confirmAction === "reject" ? "Konfirmasi Reject" : "Konfirmasi Simpan"}
        message={confirmAction === "approve" ? "Apakah Anda yakin ingin approve data ini?" : confirmAction === "reject" ? "Apakah Anda yakin ingin reject data ini?" : "Apakah Anda yakin ingin menyimpan data ini?"}
        confirmLabel={confirmAction === "approve" ? "Ya, Approve" : confirmAction === "reject" ? "Ya, Reject" : "Ya, Simpan"}
        cancelLabel="Batal"
        variant={confirmAction === "reject" ? "danger" : "default"}
      />

      <div className="p-6">
        <DataTable
          data={data}
          columns={columns}
          actions={actions}
          searchFields={searchFields}
          onRowAction={handleRowAction}
          emptyMessage="Tidak ada data yang ditemukan"
          title="Manual Kepatuhan Operator"
          description="Kelola data laporan manual kepatuhan operator"
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

            <FormField label="Penjelasan SPV" className="mb-4">
              <Textarea
                value={editFormData.penjelasanSPV}
                onChange={(e) => handleInputChange('penjelasanSPV', e.target.value)}
                rows={4}
                placeholder="Masukkan penjelasan..."
                disabled
              />
            </FormField>

            <FormField label="Penjelasan Kepatuhan" className="mb-4">
              <Textarea
                value={editFormData.penjelasanKepatuhan}
                onChange={(e) => handleInputChange('penjelasanKepatuhan', e.target.value)}
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