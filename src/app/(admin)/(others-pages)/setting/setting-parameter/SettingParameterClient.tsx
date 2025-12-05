"use client";
import { useState, useRef, useEffect } from "react";
import FormField, { Input } from "@/components/common/FormField";
import { TrendingUp, Users, CreditCard, Shield, RefreshCw, AlertTriangle, Search, ChevronDown, X } from "lucide-react";
import { Toast } from "primereact/toast";
import ConfirmDialog from "@/components/common/ConfirmDialog";
import { insertParameterRedflag, getParameterWatchlist } from "@/services/parameterRedflag";

interface ParameterData {
  // Passby
  persentaseNominalKumulatif: string;
  jumlahHari: string;
  nominalTransaksi: string;

  // RBU
  jumlahPembukaanRekening: string;

  // RBU2
  maksimalJangkaWaktuPenutupan: string;

  // TUN
  nominalTransaksiTunai: string;
  jangkaWaktuBerulangTransaksiTunai: string;

  // RDS
  saldoMengendapRekeningSimple: string;
  saldoMengendapRekeningRDN: string;

  // Multi Transfer
  jumlahRekeningPerHariPemberiData: string;
  jumlahRekeningPerHariPenerimaData: string;

  // DOR
  nominalTransferMasuk: string;
  frekuensiPenarikanATM: string;

  // Exceed Income
  frekuensiPenyimpanan: string;
  jumlahHariExcludeIncome: string;

  // Tarik Setor
  nominalSetoran: string;
  nominalTarikan: string;
  filterCabang: string[];  // Changed to array for multiple selections

  // Judol
  deskripsiTransaksi: string;
  jumlahTransaksiDebit: string;
  jumlahTransaksiKredit: string;
  waktuJudol: string;

  // Database Suspect
  kategoriBlacklist: string[];
  keywordKeterangan: string;
}

interface SettingParameterClientProps {
  initialData: ParameterData;
}

export default function SettingParameterClient({ initialData }: SettingParameterClientProps) {
  const toast = useRef<Toast>(null);
  const [isSaving, setIsSaving] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [parameters, setParameters] = useState<ParameterData>(initialData);
  const [isConfirmDialogOpen, setIsConfirmDialogOpen] = useState(false);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [isTimePickerOpen, setIsTimePickerOpen] = useState(false);
  const [tempTimeStart, setTempTimeStart] = useState("");
  const [tempTimeEnd, setTempTimeEnd] = useState("");
  const [isBlacklistDropdownOpen, setIsBlacklistDropdownOpen] = useState(false);
  const [watchlistData, setWatchlistData] = useState<Array<{ID: number; Nama: string; aktif: number}>>([]);

  // Fetch watchlist data on mount
  useEffect(() => {
    const fetchWatchlist = async () => {
      const response = await getParameterWatchlist();
      if (response.status === "success" && response.data) {
        setWatchlistData(response.data.filter((item: any) => item.aktif === 1));
      }
    };
    fetchWatchlist();
  }, []);

  // Helper function to format number with dots as thousand separators
  const formatNumber = (value: string) => {
    const numericValue = value.replace(/\D/g, '');
    return numericValue.replace(/\B(?=(\d{3})+(?!\d))/g, '.');
  };

  // Helper function to get raw numeric value (remove dots)
  const getRawValue = (formattedValue: string) => {
    return formattedValue.replace(/\./g, '');
  };

  const handleInputChange = (field: keyof ParameterData, value: string | string[]) => {
    setParameters(prev => ({
      ...prev,
      [field]: value
    }));
  };

  // Handler for checkbox changes
  const handleCheckboxChange = (field: keyof ParameterData, option: string) => {
    setParameters(prev => {
      const currentValues = prev[field] as string[];
      const newValues = currentValues.includes(option)
        ? currentValues.filter(v => v !== option)
        : [...currentValues, option];
      return {
        ...prev,
        [field]: newValues
      };
    });
  };

  // Chip input handlers for Deskripsi Transaksi
  const [chipInputValue, setChipInputValue] = useState("");
  const [keywordChipInputValue, setKeywordChipInputValue] = useState("");
  
  const stringToChips = (str: string): string[] => {
    return str.split(',').map(s => s.trim()).filter(s => s.length > 0);
  };

  const chipsToString = (chips: string[]): string => {
    return chips.join(',');
  };

  const addChip = (newChip: string) => {
    if (!newChip.trim()) return;
    const trimmedChip = newChip.trim().toUpperCase();
    const currentChips = stringToChips(parameters.deskripsiTransaksi);
    
    if (currentChips.includes(trimmedChip)) {
      toast.current?.show({
        severity: "warn",
        summary: "Peringatan!",
        detail: `"${trimmedChip}" sudah ada!`,
        life: 3000
      });
      return;
    }
    
    const updatedChips = [...currentChips, trimmedChip];
    handleInputChange("deskripsiTransaksi", chipsToString(updatedChips));
  };

  const removeChip = (chipToRemove: string) => {
    const currentChips = stringToChips(parameters.deskripsiTransaksi);
    const updatedChips = currentChips.filter(chip => chip !== chipToRemove);
    handleInputChange("deskripsiTransaksi", chipsToString(updatedChips));
  };

  // Chip input handlers for Keyword Keterangan
  const addKeywordChip = (newChip: string) => {
    if (!newChip.trim()) return;
    const trimmedChip = newChip.trim().toUpperCase();
    const currentChips = stringToChips(parameters.keywordKeterangan);
    
    if (currentChips.includes(trimmedChip)) {
      toast.current?.show({
        severity: "warn",
        summary: "Peringatan!",
        detail: `"${trimmedChip}" sudah ada!`,
        life: 3000
      });
      return;
    }
    
    const updatedChips = [...currentChips, trimmedChip];
    handleInputChange("keywordKeterangan", chipsToString(updatedChips));
  };

  const removeKeywordChip = (chipToRemove: string) => {
    const currentChips = stringToChips(parameters.keywordKeterangan);
    const updatedChips = currentChips.filter(chip => chip !== chipToRemove);
    handleInputChange("keywordKeterangan", chipsToString(updatedChips));
  };

  // Special handler for nominal fields with formatting
  const handleNominalChange = (field: keyof ParameterData, value: string) => {
    const formattedValue = formatNumber(value);
    setParameters(prev => ({
      ...prev,
      [field]: formattedValue
    }));
  };

  const handleSaveClick = () => {
    setIsConfirmDialogOpen(true);
  };

  const handleConfirmSave = () => {
    setIsConfirmDialogOpen(false);
    handleSave();
  };

  const handleCancelSave = () => {
    setIsConfirmDialogOpen(false);
  };

  const handleSave = async () => {
    setIsSaving(true);
    try {
      // Map form data to API format (snake_case)
      const apiData = {
        passby_nominal_konsumtif: parameters.persentaseNominalKumulatif,
        passby_jml_hari: parameters.jumlahHari,
        passby_nominal_transaksi: getRawValue(parameters.nominalTransaksi),
        pep_nominal_transaksi: "10000000", // Default value, adjust if needed
        nrt_nominal_transaksi: "15000000", // Default value, adjust if needed
        multi_dana_masuk: parameters.jumlahRekeningPerHariPemberiData,
        multi_dana_keluar: parameters.jumlahRekeningPerHariPenerimaData,
        rbu_jml_pembukaan_rekening: parameters.jumlahPembukaanRekening,
        rbu_jangka_waktu_penutupan: parameters.maksimalJangkaWaktuPenutupan,
        rds_saldo_mengendap_simpel: getRawValue(parameters.saldoMengendapRekeningSimple),
        rds_saldo_mengendap_rdn: getRawValue(parameters.saldoMengendapRekeningRDN),
        tun_nominal_transaksi_tunai: getRawValue(parameters.nominalTransaksiTunai),
        tun_jangka_waktu_transaksi: parameters.jangkaWaktuBerulangTransaksiTunai,
        dor_nominal_transfer_masuk: getRawValue(parameters.nominalTransferMasuk),
        dor_frekuensi: parameters.frekuensiPenarikanATM,
        exceed_income_frekuensi_penyimpanan: parameters.frekuensiPenyimpanan,
        exceed_income_jml_hari: parameters.jumlahHariExcludeIncome,
        tarik_setor_nominal_setoran: getRawValue(parameters.nominalSetoran),
        tarik_setor_nominal_tarikan: getRawValue(parameters.nominalTarikan),
        tarik_setor_nominal_filter_cbg: Array.isArray(parameters.filterCabang) ? parameters.filterCabang.join(',') : parameters.filterCabang,
        judol_deskripsi_transaksi: parameters.deskripsiTransaksi,
        judol_jml_transaksi_debit: getRawValue(parameters.jumlahTransaksiDebit),
        judol_jml_transaksi_kredit: getRawValue(parameters.jumlahTransaksiKredit),
        judol_waktu: parameters.waktuJudol || null,
        db_suspect_kategori_blacklist: Array.isArray(parameters.kategoriBlacklist) ? parameters.kategoriBlacklist.join(',') : parameters.kategoriBlacklist,
        db_suspect_keyword_keterangan: parameters.keywordKeterangan
      };

      const response = await insertParameterRedflag(apiData);

      if (response.status === "success") {
        toast.current?.show({
          severity: "success",
          summary: "Berhasil!",
          detail: response.message || "Parameter berhasil disimpan!",
          life: 3000
        });
      } else {
        toast.current?.show({
          severity: "error",
          summary: "Gagal!",
          detail: response.message || "Gagal menyimpan parameter!",
          life: 3000
        });
      }
    } catch (error) {
      console.error("Error saving parameters:", error);
      toast.current?.show({
        severity: "error",
        summary: "Gagal!",
        detail: "Terjadi kesalahan saat menyimpan parameter!",
        life: 3000
      });
    } finally {
      setIsSaving(false);
    }
  };

  const parameterSections = [
    {
      title: "Passby",
      description: "Transaksi Passby",
      icon: <TrendingUp className="w-5 h-5" />,
      color: "bg-blue-500",
      fields: [
        {
          key: "persentaseNominalKumulatif" as keyof ParameterData,
          label: "Persentase Nominal Kumulatif (%)",
          suffix: "%"
        },
        {
          key: "jumlahHari" as keyof ParameterData,
          label: "Jumlah Hari",
          suffix: "hari"
        },
        {
          key: "nominalTransaksi" as keyof ParameterData,
          label: "Nominal Transaksi",
          prefix: "Rp"
        }
      ]
    },
    {
      title: "RBU",
      description: "Pembukaan Rekening Baru",
      icon: <Users className="w-5 h-5" />,
      color: "bg-green-500",
      fields: [
        {
          key: "jumlahPembukaanRekening" as keyof ParameterData,
          label: "Jumlah Pembukaan Rekening",
          suffix: "rekening"
        }
      ]
    },
    {
      title: "RBU2",
      description: "Pembukaan Rekening dalam jangka waktu Pendek",
      icon: <CreditCard className="w-5 h-5" />,
      color: "bg-purple-500",
      fields: [
        {
          key: "maksimalJangkaWaktuPenutupan" as keyof ParameterData,
          label: "Maksimal Jangka Waktu Penutupan Rekening",
          suffix: "hari"
        }
      ]
    },
    {
      title: "TUN",
      description: "Transaksi tunai secara berulang",
      icon: <RefreshCw className="w-5 h-5" />,
      color: "bg-orange-500",
      fields: [
        {
          key: "nominalTransaksiTunai" as keyof ParameterData,
          label: "Nominal Transaksi Tunai",
          prefix: "Rp"
        },
        {
          key: "jangkaWaktuBerulangTransaksiTunai" as keyof ParameterData,
          label: "Jangka Waktu Berulang Transaksi Tunai",
          suffix: "hari"
        }
      ]
    },
    {
      title: "RDS",
      description: "Rekening KSEI dan Rekening Simpel",
      icon: <Shield className="w-5 h-5" />,
      color: "bg-teal-500",
      fields: [
        {
          key: "saldoMengendapRekeningSimple" as keyof ParameterData,
          label: "Saldo Mengendap Rekening Simple",
          prefix: "Rp"
        },
        {
          key: "saldoMengendapRekeningRDN" as keyof ParameterData,
          label: "Saldo Mengendap Rekening RDN",
          prefix: "Rp"
        }
      ]
    },
    {
      title: "MTM",
      description: "Transaksi Multi Transfer",
      icon: <RefreshCw className="w-5 h-5" />,
      color: "bg-indigo-500",
      fields: [
        {
          key: "jumlahRekeningPerHariPemberiData" as keyof ParameterData,
          label: "Jumlah Rekening Per Hari Pemberi Data Masuk",
          suffix: "rekening"
        },
        {
          key: "jumlahRekeningPerHariPenerimaData" as keyof ParameterData,
          label: "Jumlah Rekening Per Hari Penerima Data Keluar",
          suffix: "rekening"
        }
      ]
    },
    {
      title: "DOR",
      description: "Transaksi Nasabah Dorman",
      icon: <AlertTriangle className="w-5 h-5" />,
      color: "bg-red-500",
      fields: [
        {
          key: "nominalTransferMasuk" as keyof ParameterData,
          label: "Nominal Transfer Masuk",
          prefix: "Rp"
        },
        {
          key: "frekuensiPenarikanATM" as keyof ParameterData,
          label: "Frekuensi Penarikan di ATM Selama Seminggu",
          suffix: "kali"
        }
      ]
    },
    {
      title: "Exceed Income",
      description: "Parameter Exceed Income",
      icon: <TrendingUp className="w-5 h-5" />,
      color: "bg-cyan-500",
      fields: [
        {
          key: "frekuensiPenyimpanan" as keyof ParameterData,
          label: "Frekuensi Penyimpanan",
          suffix: "kali"
        },
        {
          key: "jumlahHariExcludeIncome" as keyof ParameterData,
          label: "Jumlah Hari",
          suffix: "hari"
        }
      ]
    },
    {
      title: "Tarik Setor",
      description: "Parameter Tarik Setor",
      icon: <RefreshCw className="w-5 h-5" />,
      color: "bg-pink-500",
      fields: [
        {
          key: "nominalSetoran" as keyof ParameterData,
          label: "Nominal Setoran",
          prefix: "Rp"
        },
        {
          key: "nominalTarikan" as keyof ParameterData,
          label: "Nominal Tarikan",
          prefix: "Rp"
        },
        {
          key: "filterCabang" as keyof ParameterData,
          label: "Filter Cabang"
        }
      ]
    },
    {
      title: "Judol",
      description: "Parameter Judi Online",
      icon: <AlertTriangle className="w-5 h-5" />,
      color: "bg-yellow-500",
      fields: [
        {
          key: "waktuJudol" as keyof ParameterData,
          label: "Waktu",
          type: "time-range"
        },
        {
          key: "deskripsiTransaksi" as keyof ParameterData,
          label: "Deskripsi Transaksi"
        },
        {
          key: "jumlahTransaksiDebit" as keyof ParameterData,
          label: "Jumlah Transaksi Debit",
          prefix: "Rp"
        },
        {
          key: "jumlahTransaksiKredit" as keyof ParameterData,
          label: "Jumlah Transaksi Kredit",
          prefix: "Rp"
        }
      ]
    },
    {
      title: "Database Suspect",
      description: "Parameter Database Suspect",
      icon: <Shield className="w-5 h-5" />,
      color: "bg-rose-500",
      fields: [
        {
          key: "kategoriBlacklist" as keyof ParameterData,
          label: "Kategori Blacklist",
          type: "multi-select"
        },
        {
          key: "keywordKeterangan" as keyof ParameterData,
          label: "Keyword Keterangan",
          type: "chip-input"
        }
      ]
    }
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      <Toast ref={toast} />
      
      {/* Confirm Dialog */}
      <ConfirmDialog
        isOpen={isConfirmDialogOpen}
        onClose={handleCancelSave}
        onConfirm={handleConfirmSave}
        title="Konfirmasi Simpan"
        message="Apakah Anda yakin ingin menyimpan perubahan parameter ini?"
        confirmLabel="Ya, Simpan"
        cancelLabel="Batal"
        variant="default"
      />

      <div className="p-6">
        {/* Main Card Container */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
          {/* Header */}
          <div className="p-6 border-b border-gray-200">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-3">
                <div>
                  <h1 className="text-3xl font-bold text-gray-900">Setting Parameter</h1>
                  <p className="text-gray-600 mt-1">Kelola parameter sistem untuk deteksi transaksi mencurigakan</p>
                </div>
              </div>

              {/* Search and Save Button - Right Side */}
              <div className="flex items-center gap-4">
                {/* Search Parameter */}
                <div className="relative w-64">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={16} />
                  <input
                    type="text"
                    placeholder="Search anything.."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
                  />
                </div>

                {/* Save Button */}
                <button
                  onClick={handleSaveClick}
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
                      Simpan Parameter
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>

          {/* Parameter Cards Grid */}
          <div className="p-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {parameterSections
                .filter(section => {
                  if (!searchTerm.trim()) return true;
                  const searchLower = searchTerm.toLowerCase();
                  return (
                    section.title.toLowerCase().includes(searchLower) ||
                    section.fields.some(field =>
                      field.label.toLowerCase().includes(searchLower)
                    )
                  );
                })
                .map((section, index) => (
                  <div key={index} className="bg-white rounded-xl border border-gray-200 overflow-visible">
                    {/* Card Header */}
                    <div className={`${section.color} p-4 rounded-t-xl`}>
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <div className="p-2 bg-white/20 rounded-lg">
                            {section.icon}
                          </div>
                          <h2 className="text-xl font-semibold text-white">{section.title}</h2>
                        </div>
                        <p className="text-white/80 text-sm">{section.description}</p>
                      </div>
                    </div>

                    {/* Card Content */}
                    <div className="p-6 space-y-4">
                      {section.fields.map((field, fieldIndex) => (
                        <FormField key={fieldIndex} label={field.label}>
                          {field.key === "filterCabang" ? (
                            // Dropdown with Checkbox for Filter Cabang
                            <div className="relative">
                              <button
                                type="button"
                                onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                                className="w-full px-3 py-2 border border-gray-300 rounded text-left bg-white hover:border-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 flex items-center justify-between"
                              >
                                <span className="text-sm text-gray-700">
                                  {parameters.filterCabang.length === 0
                                    ? "Pilih Filter Cabang"
                                    : parameters.filterCabang.join(", ")}
                                </span>
                                <ChevronDown className={`w-4 h-4 text-gray-500 transition-transform ${isDropdownOpen ? 'rotate-180' : ''}`} />
                              </button>
                              {isDropdownOpen && (
                                <>
                                  <div
                                    className="fixed inset-0 z-10"
                                    onClick={() => setIsDropdownOpen(false)}
                                  />
                                  <div className="absolute z-20 w-full mt-1 bg-white border border-gray-300 rounded-lg shadow-lg">
                                    <div className="p-2 space-y-1">
                                      <label className="flex items-center gap-2 px-3 py-2 hover:bg-gray-50 rounded cursor-pointer">
                                        <input
                                          type="checkbox"
                                          checked={parameters.filterCabang.includes("CABANG")}
                                          onChange={() => handleCheckboxChange("filterCabang", "CABANG")}
                                          className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                                        />
                                        <span className="text-sm text-gray-700">CABANG</span>
                                      </label>
                                      <label className="flex items-center gap-2 px-3 py-2 hover:bg-gray-50 rounded cursor-pointer">
                                        <input
                                          type="checkbox"
                                          checked={parameters.filterCabang.includes("TELLER")}
                                          onChange={() => handleCheckboxChange("filterCabang", "TELLER")}
                                          className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                                        />
                                        <span className="text-sm text-gray-700">TELLER</span>
                                      </label>
                                    </div>
                                  </div>
                                </>
                              )}
                            </div>
                          ) : field.key === "kategoriBlacklist" ? (
                            // Multi-select Dropdown for Kategori Blacklist
                            <div className="relative">
                              <button
                                type="button"
                                onClick={() => setIsBlacklistDropdownOpen(!isBlacklistDropdownOpen)}
                                className="w-full px-3 py-2 border border-gray-300 rounded text-left bg-white hover:border-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 flex items-center justify-between"
                              >
                                <span className="text-sm text-gray-700">
                                  {parameters.kategoriBlacklist.length === 0
                                    ? "Pilih Kategori Blacklist"
                                    : `${parameters.kategoriBlacklist.length} kategori dipilih`}
                                </span>
                                <ChevronDown className={`w-4 h-4 text-gray-500 transition-transform ${isBlacklistDropdownOpen ? 'rotate-180' : ''}`} />
                              </button>
                              {isBlacklistDropdownOpen && (
                                <>
                                  <div
                                    className="fixed inset-0 z-10"
                                    onClick={() => setIsBlacklistDropdownOpen(false)}
                                  />
                                  <div className="absolute z-20 w-full bottom-full mb-1 bg-white border border-gray-300 rounded-lg shadow-lg max-h-60 overflow-y-auto">
                                    <div className="p-2 space-y-1">
                                      {watchlistData.map((item) => (
                                        <label key={item.ID} className="flex items-center gap-2 px-3 py-2 hover:bg-gray-50 rounded cursor-pointer">
                                          <input
                                            type="checkbox"
                                            checked={parameters.kategoriBlacklist.includes(item.Nama)}
                                            onChange={() => handleCheckboxChange("kategoriBlacklist", item.Nama)}
                                            className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                                          />
                                          <span className="text-sm text-gray-700">{item.Nama}</span>
                                        </label>
                                      ))}
                                    </div>
                                  </div>
                                </>
                              )}
                            </div>
                          ) : field.key === "deskripsiTransaksi" ? (
                            // Chip Input for Deskripsi Transaksi
                            <div className="border border-gray-300 rounded p-3 min-h-[100px] focus-within:ring-2 focus-within:ring-blue-500 focus-within:border-transparent">
                              {/* Display chips */}
                              <div className="flex flex-wrap gap-2 mb-2">
                                {stringToChips(parameters.deskripsiTransaksi).map((chip, index) => (
                                  <span
                                    key={index}
                                    className="inline-flex items-center gap-1 px-3 py-1 bg-blue-100 text-blue-800 text-sm rounded-full"
                                  >
                                    {chip}
                                    <button
                                      type="button"
                                      onClick={() => removeChip(chip)}
                                      className="hover:bg-blue-200 rounded-full p-0.5"
                                    >
                                      <X className="w-3 h-3" />
                                    </button>
                                  </span>
                                ))}
                              </div>
                              {/* Input field */}
                              <input
                                type="text"
                                value={chipInputValue}
                                onChange={(e) => setChipInputValue(e.target.value)}
                                onKeyDown={(e) => {
                                  if (e.key === 'Enter' || e.key === ',') {
                                    e.preventDefault();
                                    addChip(chipInputValue);
                                    setChipInputValue("");
                                  }
                                }}
                                placeholder="Ketik dan tekan Enter atau koma untuk menambah..."
                                className="w-full outline-none text-sm"
                              />
                            </div>
                          ) : 'type' in field && field.type === "chip-input" ? (
                            // Chip Input for Keyword Keterangan
                            <div className="border border-gray-300 rounded p-3 min-h-[100px] focus-within:ring-2 focus-within:ring-blue-500 focus-within:border-transparent">
                              {/* Display chips */}
                              <div className="flex flex-wrap gap-2 mb-2">
                                {stringToChips(parameters.keywordKeterangan).map((chip, index) => (
                                  <span
                                    key={index}
                                    className="inline-flex items-center gap-1 px-3 py-1 bg-blue-100 text-blue-800 text-sm rounded-full"
                                  >
                                    {chip}
                                    <button
                                      type="button"
                                      onClick={() => removeKeywordChip(chip)}
                                      className="hover:bg-blue-200 rounded-full p-0.5"
                                    >
                                      <X className="w-3 h-3" />
                                    </button>
                                  </span>
                                ))}
                              </div>
                              {/* Input field */}
                              <input
                                type="text"
                                value={keywordChipInputValue}
                                onChange={(e) => setKeywordChipInputValue(e.target.value)}
                                onKeyDown={(e) => {
                                  if (e.key === 'Enter' || e.key === ',') {
                                    e.preventDefault();
                                    addKeywordChip(keywordChipInputValue);
                                    setKeywordChipInputValue("");
                                  }
                                }}
                                placeholder="Ketik dan tekan Enter atau koma untuk menambah..."
                                className="w-full outline-none text-sm"
                              />
                            </div>
                          ) : 'type' in field && field.type === "time-range" ? (
                            // Time Range Picker for Judol (dropdown with 2 time inputs)
                            <div className="relative">
                              <button
                                type="button"
                                onClick={() => {
                                  const currentValue = parameters[field.key] as string;
                                  if (currentValue) {
                                    const [start, end] = currentValue.split('-');
                                    setTempTimeStart(start || "");
                                    setTempTimeEnd(end || "");
                                  } else {
                                    setTempTimeStart("");
                                    setTempTimeEnd("");
                                  }
                                  setIsTimePickerOpen(!isTimePickerOpen);
                                }}
                                className="w-full px-3 py-2 border border-gray-300 rounded text-left bg-white hover:border-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 flex items-center justify-between"
                              >
                                <span className="text-sm text-gray-700">
                                  {parameters[field.key] || "Pilih Waktu"}
                                </span>
                                <ChevronDown className={`w-4 h-4 text-gray-500 transition-transform ${isTimePickerOpen ? 'rotate-180' : ''}`} />
                              </button>
                              {isTimePickerOpen && (
                                <>
                                  <div
                                    className="fixed inset-0 z-10"
                                    onClick={() => setIsTimePickerOpen(false)}
                                  />
                                  <div className="absolute z-20 w-full mt-1 bg-white border border-gray-300 rounded-lg shadow-lg p-4">
                                    <div className="space-y-3">
                                      <div>
                                        <label className="block text-xs font-medium text-gray-700 mb-1">Waktu Mulai</label>
                                        <input
                                          type="time"
                                          value={tempTimeStart}
                                          onChange={(e) => setTempTimeStart(e.target.value)}
                                          className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                                          step="60"
                                        />
                                      </div>
                                      <div>
                                        <label className="block text-xs font-medium text-gray-700 mb-1">Waktu Selesai</label>
                                        <input
                                          type="time"
                                          value={tempTimeEnd}
                                          onChange={(e) => setTempTimeEnd(e.target.value)}
                                          className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                                          step="60"
                                        />
                                      </div>
                                      <div className="flex gap-2 pt-2">
                                        <button
                                          type="button"
                                          onClick={() => {
                                            if (tempTimeStart && tempTimeEnd) {
                                              handleInputChange(field.key, `${tempTimeStart}-${tempTimeEnd}`);
                                              setIsTimePickerOpen(false);
                                            }
                                          }}
                                          className="flex-1 px-6 py-2 bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white rounded-lg font-medium transition-colors shadow-lg"
                                          disabled={!tempTimeStart || !tempTimeEnd}
                                        >
                                          Simpan
                                        </button>
                                        <button
                                          type="button"
                                          onClick={() => {
                                            setTempTimeStart("");
                                            setTempTimeEnd("");
                                            handleInputChange(field.key, "");
                                            setIsTimePickerOpen(false);
                                          }}
                                          className="px-6 py-2 bg-gray-200 hover:bg-gray-300 text-gray-700 rounded-lg font-medium transition-colors"
                                        >
                                          Clear
                                        </button>
                                      </div>
                                    </div>
                                  </div>
                                </>
                              )}
                            </div>
                          ) : (
                            // Regular input for other fields
                            <div className="relative">
                              {'prefix' in field && field.prefix && (
                                <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500 text-sm">
                                  {field.prefix}
                                </span>
                              )}
                              <Input
                                value={parameters[field.key] as string}
                                onChange={(e) => {
                                  // Use special handler for nominal fields (those with Rp prefix)
                                  if ('prefix' in field && field.prefix === "Rp") {
                                    handleNominalChange(field.key, e.target.value);
                                  } else {
                                    handleInputChange(field.key, e.target.value);
                                  }
                                }}
                                className={`${'prefix' in field && field.prefix ? 'pl-8' : ''} ${'suffix' in field && field.suffix ? 'pr-16' : ''}`}
                                placeholder="Masukkan nilai..."
                              />
                              {'suffix' in field && field.suffix && (
                                <span className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 text-sm">
                                  {field.suffix}
                                </span>
                              )}
                            </div>
                          )}
                        </FormField>
                      ))}
                    </div>
                  </div>
                ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}