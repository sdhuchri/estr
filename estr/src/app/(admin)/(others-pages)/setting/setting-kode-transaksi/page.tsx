"use client";
import React, { useEffect, useState, useRef } from "react";
import { useRouter } from "next/navigation";
import Cookies from "js-cookie";
import FormField, { CustomListbox } from "@/components/common/FormField";
import { Settings, X, Search } from "lucide-react";
import { getParameterKodeTransaksi, getParameterTransaksiUmum } from "@/services/parameterRedflag";
import Modal from "@/components/common/Modal";
import { Toast } from "primereact/toast";

interface ParameterKodeTransaksiResponse {
  NO: string;
  REDFLAG: string;
  KODE_TRAN_MASUK: string | null;
  KODE_TRAN_KELUAR: string | null;
  KODE_TRAN_EXCLUE: string | null;
  KODE_TRAN_SETUN: string | null;
  KODE_TRAN_NONSETUN: string | null;
  KODE_TRAN_TARTUN: string | null;
  KODE_TRAN_NONTARTUN: string | null;
  TGL_UPDATE: string;
  STATUS: string;
}

interface ParameterTransaksiUmumResponse {
  KODE_TRANSAKSI: string;
  KETERANGAN: string;
}

interface TransactionCodeData {
  jenisRedflag: string;
  kodeTransaksiMasuk: string;
  kodeTransaksiKeluar: string;
  kodeTransaksiSelorTunai: string;
  kodeTransaksiSelorNonTunai: string;
  kodeTransaksiTarikTunai: string;
  kodeTransaksiTarikNonTunai: string;
}

export default function SettingKodeTransaksiPage() {
  const router = useRouter();
  const toast = useRef<Toast>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);

  const [transactionCodes, setTransactionCodes] = useState<TransactionCodeData>({
    jenisRedflag: "",
    kodeTransaksiMasuk: "",
    kodeTransaksiKeluar: "",
    kodeTransaksiSelorTunai: "",
    kodeTransaksiSelorNonTunai: "",
    kodeTransaksiTarikTunai: "",
    kodeTransaksiTarikNonTunai: ""
  });
  const [availableRedFlags, setAvailableRedFlags] = useState<string[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalLoading, setModalLoading] = useState(false);
  const [transaksiUmumData, setTransaksiUmumData] = useState<ParameterTransaksiUmumResponse[]>([]);
  const [modalSearchTerm, setModalSearchTerm] = useState("");
  const [modalCurrentPage, setModalCurrentPage] = useState(1);
  const [modalItemsPerPage, setModalItemsPerPage] = useState(10);
  const [redFlagLoading, setRedFlagLoading] = useState(false);
  const [validTransactionCodes, setValidTransactionCodes] = useState<string[]>([]);

  useEffect(() => {
    document.title = "ESTR | Setting Kode Transaksi";

    const userId = Cookies.get("userId");

    if (!userId) {
      setIsLoading(true);
      router.push("/signin");
      return;
    }

    // Fetch data from API
    const fetchData = async () => {
      try {
        const response = await getParameterKodeTransaksi();
        if (response.status === "success" && response.data && response.data.length > 0) {
          const apiData = response.data as ParameterKodeTransaksiResponse[];

          // Get available red flags for dropdown
          const redFlags = apiData.map((item: ParameterKodeTransaksiResponse) => item.REDFLAG.toUpperCase());
          setAvailableRedFlags(redFlags);

          // Set first red flag as default
          const firstRedFlag = redFlags[0];
          const firstData = apiData[0];

          setTransactionCodes({
            jenisRedflag: firstRedFlag,
            kodeTransaksiMasuk: firstData.KODE_TRAN_MASUK || "",
            kodeTransaksiKeluar: firstData.KODE_TRAN_KELUAR || "",
            kodeTransaksiSelorTunai: firstData.KODE_TRAN_SETUN || "",
            kodeTransaksiSelorNonTunai: firstData.KODE_TRAN_NONSETUN || "",
            kodeTransaksiTarikTunai: firstData.KODE_TRAN_TARTUN || "",
            kodeTransaksiTarikNonTunai: firstData.KODE_TRAN_NONTARTUN || ""
          });
        }

        // Fetch valid transaction codes for validation
        const validCodesResponse = await getParameterTransaksiUmum();
        if (validCodesResponse.status === "success" && validCodesResponse.data) {
          const codes = validCodesResponse.data.map((item: ParameterTransaksiUmumResponse) => item.KODE_TRANSAKSI);
          setValidTransactionCodes(codes);
        }
      } catch (error) {
        console.error("Error fetching transaction codes:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, [router]);

  const handleInputChange = (field: keyof TransactionCodeData, value: string) => {
    setTransactionCodes(prev => ({
      ...prev,
      [field]: value
    }));
  };

  // Handle red flag change and load corresponding data
  const handleRedFlagChange = async (newRedFlag: string) => {
    setRedFlagLoading(true);
    try {
      const response = await getParameterKodeTransaksi(newRedFlag.toLowerCase());
      if (response.status === "success" && response.data && response.data.length > 0) {
        const apiData = response.data[0] as ParameterKodeTransaksiResponse;

        setTransactionCodes({
          jenisRedflag: newRedFlag,
          kodeTransaksiMasuk: apiData.KODE_TRAN_MASUK || "",
          kodeTransaksiKeluar: apiData.KODE_TRAN_KELUAR || "",
          kodeTransaksiSelorTunai: apiData.KODE_TRAN_SETUN || "",
          kodeTransaksiSelorNonTunai: apiData.KODE_TRAN_NONSETUN || "",
          kodeTransaksiTarikTunai: apiData.KODE_TRAN_TARTUN || "",
          kodeTransaksiTarikNonTunai: apiData.KODE_TRAN_NONTARTUN || ""
        });
      }
    } catch (error) {
      console.error("Error fetching data for red flag:", newRedFlag, error);
    } finally {
      setRedFlagLoading(false);
    }
  };

  const handleSave = async () => {
    setIsSaving(true);
    try {
      console.log("Saving transaction codes:", transactionCodes);

      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 2000));

      toast.current?.show({
        severity: "success",
        summary: "Berhasil!",
        detail: "Kode transaksi berhasil disimpan!",
        life: 3000
      });
    } catch (error) {
      console.error("Error saving transaction codes:", error);
      toast.current?.show({
        severity: "error",
        summary: "Gagal!",
        detail: "Gagal menyimpan kode transaksi!",
        life: 3000
      });
    } finally {
      setIsSaving(false);
    }
  };

  const handleViewCodes = async () => {
    setIsModalOpen(true);
    setModalLoading(true);

    try {
      const response = await getParameterTransaksiUmum();
      if (response.status === "success" && response.data) {
        setTransaksiUmumData(response.data);
      }
    } catch (error) {
      console.error("Error fetching transaksi umum data:", error);
    } finally {
      setModalLoading(false);
    }
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setTransaksiUmumData([]);
    setModalSearchTerm("");
    setModalCurrentPage(1);
  };

  // Filter and paginate modal data
  const getFilteredModalData = () => {
    let filtered = transaksiUmumData;

    if (modalSearchTerm.trim()) {
      const searchLower = modalSearchTerm.toLowerCase();
      filtered = transaksiUmumData.filter((item: ParameterTransaksiUmumResponse) =>
        (item.KODE_TRANSAKSI || "").toLowerCase().includes(searchLower) ||
        (item.KETERANGAN || "").toLowerCase().includes(searchLower)
      );
    }

    return filtered;
  };

  const getPaginatedModalData = () => {
    const filtered = getFilteredModalData();
    const startIndex = (modalCurrentPage - 1) * modalItemsPerPage;
    const endIndex = startIndex + modalItemsPerPage;
    return filtered.slice(startIndex, endIndex);
  };

  const getTotalModalPages = () => {
    const filtered = getFilteredModalData();
    return Math.ceil(filtered.length / modalItemsPerPage);
  };

  const generateModalPagination = (current: number, total: number): (number | "...")[] => {
    const range: (number | "...")[] = [];
    if (total <= 7) {
      for (let i = 1; i <= total; i++) range.push(i);
    } else if (current <= 4) {
      range.push(1, 2, 3, 4, 5, "...", total);
    } else if (current >= total - 3) {
      range.push(1, "...", total - 4, total - 3, total - 2, total - 1, total);
    } else {
      range.push(1, "...", current - 1, current, current + 1, "...", total);
    }
    return range;
  };

  // Convert comma-separated string to chips array
  const stringToChips = (str: string): string[] => {
    return str.split(',').map(s => s.trim()).filter(s => s.length > 0);
  };

  // Convert chips array to comma-separated string
  const chipsToString = (chips: string[]): string => {
    return chips.join(',');
  };

  // Validate transaction code
  const validateTransactionCode = (code: string): boolean => {
    return validTransactionCodes.includes(code.trim().toUpperCase());
  };

  // Add new chip with validation
  const addChip = (field: keyof TransactionCodeData, newChip: string) => {
    if (!newChip.trim()) return;

    const trimmedChip = newChip.trim().toUpperCase();
    const currentChips = stringToChips(transactionCodes[field]);

    // Check if chip already exists
    if (currentChips.includes(trimmedChip)) {
      toast.current?.show({
        severity: "warn",
        summary: "Peringatan!",
        detail: `Kode transaksi "${trimmedChip}" sudah ada!`,
        life: 3000
      });
      return;
    }

    // Validate transaction code
    if (!validateTransactionCode(trimmedChip)) {
      toast.current?.show({
        severity: "error",
        summary: "Kode Tidak Valid!",
        detail: `Kode transaksi "${trimmedChip}" tidak valid! Silakan periksa daftar kode transaksi yang tersedia.`,
        life: 3000
      });
      return;
    }

    // Add valid chip
    const updatedChips = [...currentChips, trimmedChip];
    handleInputChange(field, chipsToString(updatedChips));
  };

  // Remove chip
  const removeChip = (field: keyof TransactionCodeData, chipToRemove: string) => {
    const currentChips = stringToChips(transactionCodes[field]);
    const updatedChips = currentChips.filter(chip => chip !== chipToRemove);
    handleInputChange(field, chipsToString(updatedChips));
  };

  // Chip Input Component
  const ChipInput = ({
    field,
    label,
    placeholder
  }: {
    field: keyof TransactionCodeData;
    label: string;
    placeholder: string;
  }) => {
    const [inputValue, setInputValue] = useState("");
    const chips = stringToChips(transactionCodes[field]);

    const handleKeyDown = (e: React.KeyboardEvent) => {
      if (e.key === 'Enter' || e.key === ',') {
        e.preventDefault();
        addChip(field, inputValue);
        setInputValue("");
      }
    };

    return (
      <FormField label={label}>
        <div className="border border-gray-300 rounded-lg p-3 min-h-[100px] focus-within:ring-2 focus-within:ring-blue-500 focus-within:border-transparent">
          {/* Display chips */}
          <div className="flex flex-wrap gap-2 mb-2">
            {chips.map((chip, index) => (
              <span
                key={index}
                className="inline-flex items-center gap-1 px-3 py-1 bg-blue-100 text-blue-800 text-sm rounded-full"
              >
                {chip}
                <button
                  type="button"
                  onClick={() => removeChip(field, chip)}
                  className="hover:bg-blue-200 rounded-full p-0.5"
                >
                  <X size={12} />
                </button>
              </span>
            ))}
          </div>

          {/* Input for new chips */}
          <input
            type="text"
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            onKeyDown={handleKeyDown}
            onBlur={() => {
              if (inputValue.trim()) {
                addChip(field, inputValue);
                setInputValue("");
              }
            }}
            placeholder={placeholder}
            className="w-full border-none outline-none text-sm"
          />
        </div>
        <p className="text-xs text-gray-500 mt-1">
          Tekan Enter atau koma untuk menambah kode transaksi
        </p>
      </FormField>
    );
  };

  const redFlagOptions = availableRedFlags.map(flag => ({
    value: flag,
    label: flag
  }));

  const getFieldsForRedFlag = (redFlag: string) => {
    switch (redFlag.toUpperCase()) {
      case "DOR":
        return [
          { field: "kodeTransaksiMasuk" as keyof TransactionCodeData, label: "Kode Transaksi Masuk" },
          { field: "kodeTransaksiKeluar" as keyof TransactionCodeData, label: "Kode Transaksi Tarikan ATM" }
        ];
      case "MTM":
        return [
          { field: "kodeTransaksiMasuk" as keyof TransactionCodeData, label: "Kode Transaksi Masuk" },
          { field: "kodeTransaksiKeluar" as keyof TransactionCodeData, label: "Kode Transaksi Keluar" }
        ];
      case "PEP/NRT":
        return [
          { field: "kodeTransaksiSelorTunai" as keyof TransactionCodeData, label: "Kode Transaksi Selor Tunai" },
          { field: "kodeTransaksiSelorNonTunai" as keyof TransactionCodeData, label: "Kode Transaksi Selor Non Tunai" },
          { field: "kodeTransaksiTarikTunai" as keyof TransactionCodeData, label: "Kode Transaksi Tarik Tunai" },
          { field: "kodeTransaksiTarikNonTunai" as keyof TransactionCodeData, label: "Kode Transaksi Tarik Non Tunai" }
        ];
      case "PASSBY":
        return [
          { field: "kodeTransaksiMasuk" as keyof TransactionCodeData, label: "Kode Transaksi Masuk" },
          { field: "kodeTransaksiKeluar" as keyof TransactionCodeData, label: "Kode Transaksi Keluar" }
        ];
      default:
        return [];
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
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
          {/* Header */}
          <div className="p-6 border-b border-gray-200">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-blue-600 rounded-lg">
                  <Settings className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h1 className="text-3xl font-bold text-gray-900">Setting Kode Transaksi</h1>
                  <p className="text-gray-600 mt-1">Kelola kode transaksi untuk deteksi red flag</p>
                </div>
              </div>

              {/* Action Buttons - Right Side */}
              <div className="flex items-center gap-4">
                {/* View Codes Button */}
                <button
                  onClick={handleViewCodes}
                  className="flex items-center gap-3 px-6 py-2 bg-gray-600 hover:bg-gray-700 text-white rounded-lg font-medium transition-colors shadow-lg"
                >
                  Lihat Kode Transaksi
                </button>

                {/* Save Button */}
                <button
                  onClick={handleSave}
                  disabled={isSaving}
                  className="flex items-center gap-3 px-6 py-2 bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white rounded-lg font-medium transition-colors shadow-lg"
                >
                  {isSaving ? (
                    <>
                      <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                      Menyimpan...
                    </>
                  ) : (
                    <>
                      Simpan Kode Transaksi
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>

          {/* Content */}
          <div className="p-6">
            {/* Jenis Redflag Selection */}
            <div className="mb-6">
              <FormField label="Jenis Redflag">
                <div className="w-64">
                  <CustomListbox
                    value={transactionCodes.jenisRedflag}
                    onChange={(value) => handleRedFlagChange(value)}
                    options={redFlagOptions}
                  />
                </div>
              </FormField>
            </div>

            {/* Dynamic Fields based on selected Redflag */}
            <div className="relative">
              {redFlagLoading && (
                <div className="absolute inset-0 bg-white/70 backdrop-blur-sm z-10 flex items-center justify-center rounded-lg">
                  <div className="flex items-center gap-3">
                    <div className="w-6 h-6 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
                    <span className="text-gray-600 font-medium">Memuat data...</span>
                  </div>
                </div>
              )}
              <div className="space-y-6">
                {getFieldsForRedFlag(transactionCodes.jenisRedflag).map(({ field, label }) => (
                  <ChipInput
                    key={field}
                    field={field}
                    label={label}
                    placeholder="Masukkan kode transaksi..."
                  />
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
      {/* View Codes Modal */}
      <Modal
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        title="Daftar Kode Transaksi Umum"
        footer={
          <div className="flex justify-between items-center w-full">
            <button
              onClick={handleCloseModal}
              className="px-6 py-2 bg-gray-400 hover:bg-gray-500 text-white rounded-full font-medium"
            >
              Close
            </button>
            <div></div>
          </div>
        }
        size="xl"
      >
        {modalLoading ? (
          <div className="flex justify-center items-center py-8">
            <div className="w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
          </div>
        ) : (
          <div>
            {/* Search Bar */}
            <div className="mb-4">
              <div className="relative w-full max-w-md">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={16} />
                <input
                  type="text"
                  placeholder="Cari kode transaksi atau keterangan..."
                  value={modalSearchTerm}
                  onChange={(e) => {
                    setModalSearchTerm(e.target.value);
                    setModalCurrentPage(1);
                  }}
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
                />
              </div>
            </div>

            {/* Table */}
            <div className="bg-white rounded-lg border border-gray-200 overflow-hidden mb-4">
              <table className="w-full">
                <thead>
                  <tr style={{ backgroundColor: '#161950' }}>
                    <th className="border border-gray-300 px-4 py-3 text-left text-sm font-medium text-white w-1/4">
                      No
                    </th>
                    <th className="border border-gray-300 px-4 py-3 text-left text-sm font-medium text-white w-1/3">
                      Kode Transaksi
                    </th>
                    <th className="border border-gray-300 px-4 py-3 text-left text-sm font-medium text-white">
                      Keterangan
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {getPaginatedModalData().length === 0 ? (
                    <tr>
                      <td colSpan={3} className="border border-gray-300 px-4 py-8 text-center text-gray-500">
                        {modalSearchTerm ? "Tidak ada data yang sesuai dengan pencarian" : "Tidak ada data yang ditemukan"}
                      </td>
                    </tr>
                  ) : (
                    getPaginatedModalData().map((item: ParameterTransaksiUmumResponse, index: number) => (
                      <tr
                        key={index}
                        className={`hover:bg-blue-50 ${index % 2 === 0 ? 'bg-white' : 'bg-gray-50'}`}
                      >
                        <td className="border border-gray-300 px-4 py-3 text-sm text-gray-900 text-center">
                          {(modalCurrentPage - 1) * modalItemsPerPage + index + 1}
                        </td>
                        <td className="border border-gray-300 px-4 py-3 text-sm text-gray-900 font-medium">
                          {item.KODE_TRANSAKSI}
                        </td>
                        <td className="border border-gray-300 px-4 py-3 text-sm text-gray-900">
                          {item.KETERANGAN}
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>

            {/* Pagination */}
            {getFilteredModalData().length > 0 && (
              <div className="flex flex-col gap-3">
                <div className="flex flex-col md:flex-row md:justify-between md:items-center gap-4">
                  <div className="flex items-center gap-2">
                    <span className="text-sm text-gray-700">Tampilkan</span>
                    <div className="w-20">
                      <CustomListbox
                        value={modalItemsPerPage.toString()}
                        onChange={(value) => {
                          setModalItemsPerPage(Number(value));
                          setModalCurrentPage(1);
                        }}
                        options={[
                          { value: "5", label: "5" },
                          { value: "10", label: "10" },
                          { value: "25", label: "25" },
                          { value: "50", label: "50" }
                        ]}
                        className="text-sm py-1"
                      />
                    </div>
                    <span className="text-sm text-gray-700">data per halaman</span>
                  </div>

                  <div className="flex gap-2">
                    <button
                      onClick={() => setModalCurrentPage((prev) => Math.max(prev - 1, 1))}
                      disabled={modalCurrentPage === 1}
                      className="px-3 py-1 border rounded text-sm bg-white hover:bg-gray-100 disabled:opacity-50"
                    >
                      Prev
                    </button>

                    {generateModalPagination(modalCurrentPage, getTotalModalPages()).map((page, index) =>
                      page === "..." ? (
                        <span key={index} className="px-3 py-1 text-sm text-gray-500 select-none">
                          ...
                        </span>
                      ) : (
                        <button
                          key={index}
                          onClick={() => setModalCurrentPage(Number(page))}
                          className={`px-3 py-1 border rounded text-sm transition-all ${modalCurrentPage === page
                            ? "text-white border-gray-300"
                            : "bg-white text-black border-gray-300 hover:border-gray-400"
                            }`}
                          style={modalCurrentPage === page ? { backgroundColor: '#161950' } : {}}
                        >
                          {page}
                        </button>
                      )
                    )}

                    <button
                      onClick={() => setModalCurrentPage((prev) => Math.min(prev + 1, getTotalModalPages()))}
                      disabled={modalCurrentPage === getTotalModalPages()}
                      className="px-3 py-1 border rounded text-sm bg-white hover:bg-gray-100 disabled:opacity-50"
                    >
                      Next
                    </button>
                  </div>
                </div>
                
                {/* Data count info - moved to bottom left */}
                <div className="text-left">
                  <span className="text-sm text-gray-700">
                    Menampilkan {getPaginatedModalData().length} dari {getFilteredModalData().length} data
                  </span>
                </div>
              </div>
            )}
          </div>
        )}
      </Modal>
    </div>
  );
}