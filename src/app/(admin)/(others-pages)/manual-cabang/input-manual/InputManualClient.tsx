"use client";
import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import { useSession } from "@/hooks/useSession";
import ManualCabangForm from "@/components/forms/ManualCabangForm";
import { Save, X } from "lucide-react";
import { Toast } from "primereact/toast";
import { getCabangOptions, getIndikatorOptions, getPrioritas } from "@/services/helper";
import { inputManualCabang } from "@/services/manualCabang";
import { sendEmailNotification } from "@/services/emailQueue";
import ConfirmDialog from "@/components/common/ConfirmDialog";
import FadeInWrapper from "@/components/common/FadeInWrapper";
import { formatDateToYYYYMMDD } from "@/utils/dateFormatter";

interface FormData {
  noCif: string;
  noRek: string;
  indikator: string;
  cabang: string;
  namaNasabah: string;
  tanggalTransaksi: Date | null;
  keterangan: string;
  tglHubungiNasabah: Date | null;
  jamHubungiNasabah: string;
  transaksiMencurigakan: string;
  penjelasanCSO: string;
  penjelasanSPV: string;
  penjelasanKepatuhan: string;
}

export default function InputManualClient() {
  const router = useRouter();
  const toast = useRef<Toast>(null);
  const { session, loading } = useSession();

  const [formData, setFormData] = useState<FormData>({
    noCif: "",
    noRek: "",
    indikator: "",
    cabang: "",
    namaNasabah: "",
    tanggalTransaksi: null,
    keterangan: "",
    tglHubungiNasabah: null,
    jamHubungiNasabah: "",
    transaksiMencurigakan: "",
    penjelasanCSO: "",
    penjelasanSPV: "",
    penjelasanKepatuhan: ""
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [cabangOptions, setCabangOptions] = useState<Array<{ value: string; label: string }>>([]);
  const [indikatorOptions, setIndikatorOptions] = useState<Array<{ value: string; label: string }>>([]);
  const [isLoadingCabang, setIsLoadingCabang] = useState(true);
  const [isLoadingIndikator, setIsLoadingIndikator] = useState(true);
  const [showConfirm, setShowConfirm] = useState(false);
  const [skala, setSkala] = useState<string>("Tinggi"); // Default skala

  useEffect(() => {
    if (!loading && !session) {
      router.push("/signin");
    }
  }, [session, loading, router]);

  // Fetch cabang options
  useEffect(() => {
    const fetchCabangOptions = async () => {
      if (!session?.branchCode) return;

      try {
        setIsLoadingCabang(true);
        const options = await getCabangOptions(session.branchCode);
        setCabangOptions(options);
      } catch (error) {
        console.error("Error fetching cabang options:", error);
        toast.current?.show({
          severity: "error",
          summary: "Error",
          detail: "Gagal memuat data cabang",
          life: 3000
        });
      } finally {
        setIsLoadingCabang(false);
      }
    };

    if (session) {
      fetchCabangOptions();
    }
  }, [session]);

  // Fetch indikator options
  useEffect(() => {
    const fetchIndikatorOptions = async () => {
      try {
        setIsLoadingIndikator(true);
        const options = await getIndikatorOptions();
        setIndikatorOptions(options);
      } catch (error) {
        console.error("Error fetching indikator options:", error);
        toast.current?.show({
          severity: "error",
          summary: "Error",
          detail: "Gagal memuat data indikator",
          life: 3000
        });
      } finally {
        setIsLoadingIndikator(false);
      }
    };

    fetchIndikatorOptions();
  }, []);

  const handleInputChange = async (field: string, value: any) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));

    // Fetch prioritas when indikator changes
    if (field === "indikator" && value) {
      try {
        const response = await getPrioritas(value);
        if (response.status === "success" && response.data?.prioritas) {
          setSkala(response.data.prioritas);
        } else {
          // Default to "Tinggi" if API fails
          setSkala("Tinggi");
        }
      } catch (error) {
        console.error("Error fetching prioritas:", error);
        setSkala("Tinggi");
      }
    }
  };

  const validateForm = (): boolean => {
    if (!formData.noCif.trim()) {
      toast.current?.show({
        severity: "warn",
        summary: "Validasi Gagal",
        detail: "No CIF harus diisi",
        life: 3000
      });
      return false;
    }

    if (!formData.indikator.trim()) {
      toast.current?.show({
        severity: "warn",
        summary: "Validasi Gagal",
        detail: "Indikator harus diisi",
        life: 3000
      });
      return false;
    }

    if (!formData.cabang.trim()) {
      toast.current?.show({
        severity: "warn",
        summary: "Validasi Gagal",
        detail: "Cabang harus diisi",
        life: 3000
      });
      return false;
    }

    if (!formData.namaNasabah.trim()) {
      toast.current?.show({
        severity: "warn",
        summary: "Validasi Gagal",
        detail: "Nama Nasabah harus diisi",
        life: 3000
      });
      return false;
    }

    if (!formData.tanggalTransaksi) {
      toast.current?.show({
        severity: "warn",
        summary: "Validasi Gagal",
        detail: "Tanggal Transaksi harus diisi",
        life: 3000
      });
      return false;
    }

    if (!formData.keterangan.trim()) {
      toast.current?.show({
        severity: "warn",
        summary: "Validasi Gagal",
        detail: "Keterangan harus diisi",
        life: 3000
      });
      return false;
    }

    if (!formData.tglHubungiNasabah) {
      toast.current?.show({
        severity: "warn",
        summary: "Validasi Gagal",
        detail: "Tanggal Menghubungi Nasabah harus diisi",
        life: 3000
      });
      return false;
    }

    if (!formData.jamHubungiNasabah.trim()) {
      toast.current?.show({
        severity: "warn",
        summary: "Validasi Gagal",
        detail: "Jam Menghubungi Nasabah harus diisi",
        life: 3000
      });
      return false;
    }

    if (!formData.transaksiMencurigakan) {
      toast.current?.show({
        severity: "warn",
        summary: "Validasi Gagal",
        detail: "Transaksi Mencurigakan harus dipilih",
        life: 3000
      });
      return false;
    }

    if (!formData.penjelasanCSO.trim()) {
      toast.current?.show({
        severity: "warn",
        summary: "Validasi Gagal",
        detail: "Penjelasan CSO harus diisi",
        life: 3000
      });
      return false;
    }

    return true;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    // Show confirmation dialog
    setShowConfirm(true);
  };

  const handleConfirm = () => {
    setShowConfirm(false);
    performSubmit();
  };

  const performSubmit = async () => {
    if (!session?.userId || !session?.branchCode) {
      toast.current?.show({
        severity: "error",
        summary: "Error",
        detail: "Session tidak valid",
        life: 3000
      });
      return;
    }

    setIsSubmitting(true);

    try {
      // Format dates to YYYY-MM-DD (without timezone conversion)
      const formattedTglTransaksi = formatDateToYYYYMMDD(formData.tanggalTransaksi!);
      const formattedTglHubNasabah = formatDateToYYYYMMDD(formData.tglHubungiNasabah!);

      // Get cabang_induk from cabangOptions
      const selectedCabang = cabangOptions.find(opt => opt.value === formData.cabang);
      const cabangInduk = (selectedCabang as any)?.induk || session.branchCode;

      // Convert Transaksi Mencurigakan: "Tidak" => "T", "Ya" => "Y"
      const transaksiMencurigakanValue = formData.transaksiMencurigakan === "Ya" ? "Y" : "T";

      const requestData = {
        indikator: formData.indikator,
        no_cif: formData.noCif,
        no_rek: formData.noRek || "",
        nama_nasabah: formData.namaNasabah,
        keterangan: formData.keterangan,
        cabang: formData.cabang,
        cabang_induk: cabangInduk,
        ket_cabang_opr: formData.penjelasanCSO,
        ket_cabang_spv: formData.penjelasanSPV || "",
        ket_kepatuhan: formData.penjelasanKepatuhan || "",
        tgl_hub_nasabah: formattedTglHubNasabah,
        jam_hub_nasabah: formData.jamHubungiNasabah,
        input_by_cbg: session.userId,
        transaksi_mencurigakan: transaksiMencurigakanValue,
        tenggat: formattedTglTransaksi,
        skala: skala,
        keterangan_status: "Open"
      };

      const response = await inputManualCabang(requestData);

      if (response.status === "success") {
        // Send email notification after successful save
        try {
          await sendEmailNotification(
            "manual_cabang_input",
            session.userId,
            session.branchCode || ""
          );
          console.log("Email notification queued successfully");
        } catch (emailError) {
          console.error("Error queuing email:", emailError);
          // Don't show error to user, just log it
        }

        toast.current?.show({
          severity: "success",
          summary: "Berhasil!",
          detail: response.message || "Data berhasil disimpan",
          life: 3000
        });

        // Reset form
        setFormData({
          noCif: "",
          noRek: "",
          indikator: "",
          cabang: "",
          namaNasabah: "",
          tanggalTransaksi: null,
          keterangan: "",
          tglHubungiNasabah: null,
          jamHubungiNasabah: "",
          transaksiMencurigakan: "",
          penjelasanCSO: "",
          penjelasanSPV: "",
          penjelasanKepatuhan: ""
        });
        
        setSkala("Tinggi"); // Reset skala to default
      } else {
        toast.current?.show({
          severity: "error",
          summary: "Gagal!",
          detail: response.message || "Gagal menyimpan data",
          life: 3000
        });
      }
    } catch (error) {
      console.error("Error submitting form:", error);
      toast.current?.show({
        severity: "error",
        summary: "Gagal!",
        detail: "Gagal menyimpan data. Silakan coba lagi",
        life: 3000
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleReset = () => {
    setFormData({
      noCif: "",
      noRek: "",
      indikator: "",
      cabang: "",
      namaNasabah: "",
      tanggalTransaksi: null,
      keterangan: "",
      tglHubungiNasabah: null,
      jamHubungiNasabah: "",
      transaksiMencurigakan: "",
      penjelasanCSO: "",
      penjelasanSPV: "",
      penjelasanKepatuhan: ""
    });

    setSkala("Tinggi"); // Reset skala to default

    toast.current?.show({
      severity: "info",
      summary: "Form Direset",
      detail: "Semua field telah dikosongkan",
      life: 2000
    });
  };

  return (
    <FadeInWrapper>
      <div className="min-h-screen bg-gray-50">
        <Toast ref={toast} />

        {/* Confirmation Dialog */}
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
          <div className="bg-white rounded-xl shadow-sm border border-gray-200">
            {/* Header */}
            <div className="p-6 border-b border-gray-200">
              <div>
                <h1 className="text-2xl font-bold text-gray-900">Input Manual Cabang</h1>
                <p className="text-gray-600 mt-1">Tambah data laporan manual cabang baru</p>
              </div>
            </div>

            {/* Form */}
            <div className="p-6">
              <ManualCabangForm
                formData={formData}
                onChange={handleInputChange}
                showInfoBox={false}
                cabangOptions={cabangOptions}
                indikatorOptions={indikatorOptions}
              />
            </div>

            {/* Footer Actions */}
            <div className="p-6 border-t border-gray-200 bg-gray-50">
              <div className="flex justify-end gap-3">
                <button
                  type="button"
                  onClick={handleReset}
                  disabled={isSubmitting}
                  className="px-6 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-100 font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                >
                  <X className="w-4 h-4" />
                  Reset
                </button>
                <button
                  type="button"
                  onClick={handleSubmit}
                  disabled={isSubmitting}
                  className="px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                >
                  {isSubmitting ? (
                    <>
                      <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                      Menyimpan...
                    </>
                  ) : (
                    <>
                      <Save className="w-4 h-4" />
                      Simpan
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </FadeInWrapper>
  );
}
