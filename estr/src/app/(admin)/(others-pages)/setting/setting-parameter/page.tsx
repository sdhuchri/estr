"use client";
import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Cookies from "js-cookie";
import { getParameterRedflag } from "@/services/parameterRedflag";
import FormField, { Input } from "@/components/common/FormField";
import { Save, Settings, TrendingUp, Users, CreditCard, Shield, RefreshCw, AlertTriangle, Search } from "lucide-react";

interface ParameterRedflagResponse {
  NO: string;
  PASSBY_NOMINAL_KONSUMTIF: string;
  PASSBY_JML_HARI: string;
  PASSBY_NOMINAL_TRANSAKSI: string;
  PEP_NOMINAL_TRANSAKSI: string;
  NRT_NOMINAL_TRANSAKSI: string;
  MULTI_DANA_MASUK: string;
  MULTI_DANA_KELUAR: string;
  RBU_JML_PEMBUKAAN_REKENING: string;
  RBU_JANGKA_WAKTU_PENUTUPAN: string;
  RDS_SALDO_MENGENDAP_SIMPEL: string;
  RDS_SALDO_MENGENDAP_RDN: string;
  TUN_NOMINAL_TRANSAKSI_TUNAI: string;
  TUN_JANGKA_WAKTU_TRANSAKSI: string;
  DOR_NOMINAL_TRANSFER_MASUK: string;
  DOR_FREKUENSI: string;
  TGL_UPDATE: string;
  STATUS: string;
}

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
}

export default function SettingParameterPage() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [parameters, setParameters] = useState<ParameterData>({
    persentaseNominalKumulatif: "",
    jumlahHari: "",
    nominalTransaksi: "",
    jumlahPembukaanRekening: "",
    maksimalJangkaWaktuPenutupan: "",
    nominalTransaksiTunai: "",
    jangkaWaktuBerulangTransaksiTunai: "",
    saldoMengendapRekeningSimple: "",
    saldoMengendapRekeningRDN: "",
    jumlahRekeningPerHariPemberiData: "",
    jumlahRekeningPerHariPenerimaData: "",
    nominalTransferMasuk: "",
    frekuensiPenarikanATM: ""
  });

  useEffect(() => {
    document.title = "ESTR | Setting Parameter";

    const userId = Cookies.get("userId");

    if (!userId) {
      setIsLoading(true);
      router.push("/signin");
      return;
    }

    // Fetch parameter data
    const fetchData = async () => {
      try {
        const response = await getParameterRedflag("1");
        if (response.status === "success" && response.data && response.data.length > 0) {
          const apiData = response.data[0] as ParameterRedflagResponse;

          // Map API data to form state
          setParameters({
            persentaseNominalKumulatif: apiData.PASSBY_NOMINAL_KONSUMTIF || "",
            jumlahHari: apiData.PASSBY_JML_HARI || "",
            nominalTransaksi: formatNumber(apiData.PASSBY_NOMINAL_TRANSAKSI || ""),
            jumlahPembukaanRekening: apiData.RBU_JML_PEMBUKAAN_REKENING || "",
            maksimalJangkaWaktuPenutupan: apiData.RBU_JANGKA_WAKTU_PENUTUPAN || "",
            nominalTransaksiTunai: formatNumber(apiData.TUN_NOMINAL_TRANSAKSI_TUNAI || ""),
            jangkaWaktuBerulangTransaksiTunai: apiData.TUN_JANGKA_WAKTU_TRANSAKSI || "",
            saldoMengendapRekeningSimple: formatNumber(apiData.RDS_SALDO_MENGENDAP_SIMPEL || ""),
            saldoMengendapRekeningRDN: formatNumber(apiData.RDS_SALDO_MENGENDAP_RDN || ""),
            jumlahRekeningPerHariPemberiData: apiData.MULTI_DANA_MASUK || "",
            jumlahRekeningPerHariPenerimaData: apiData.MULTI_DANA_KELUAR || "",
            nominalTransferMasuk: formatNumber(apiData.DOR_NOMINAL_TRANSFER_MASUK || ""),
            frekuensiPenarikanATM: apiData.DOR_FREKUENSI || ""
          });
        }
      } catch (error) {
        console.error("Error fetching parameter data:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, [router]);

  // Helper function to format number with dots as thousand separators
  const formatNumber = (value: string) => {
    // Remove all non-digits
    const numericValue = value.replace(/\D/g, '');

    // Add dots as thousand separators
    return numericValue.replace(/\B(?=(\d{3})+(?!\d))/g, '.');
  };

  // Helper function to get raw numeric value (remove dots)
  const getRawValue = (formattedValue: string) => {
    return formattedValue.replace(/\./g, '');
  };

  const handleInputChange = (field: keyof ParameterData, value: string) => {
    setParameters(prev => ({
      ...prev,
      [field]: value
    }));
  };

  // Special handler for nominal fields with formatting
  const handleNominalChange = (field: keyof ParameterData, value: string) => {
    const formattedValue = formatNumber(value);
    setParameters(prev => ({
      ...prev,
      [field]: formattedValue
    }));
  };

  const handleSave = async () => {
    setIsSaving(true);
    try {
      // Map form data back to API format
      const apiData = {
        PASSBY_NOMINAL_KONSUMTIF: parameters.persentaseNominalKumulatif,
        PASSBY_JML_HARI: parameters.jumlahHari,
        PASSBY_NOMINAL_TRANSAKSI: getRawValue(parameters.nominalTransaksi),
        RBU_JML_PEMBUKAAN_REKENING: parameters.jumlahPembukaanRekening,
        RBU_JANGKA_WAKTU_PENUTUPAN: parameters.maksimalJangkaWaktuPenutupan,
        TUN_NOMINAL_TRANSAKSI_TUNAI: getRawValue(parameters.nominalTransaksiTunai),
        TUN_JANGKA_WAKTU_TRANSAKSI: parameters.jangkaWaktuBerulangTransaksiTunai,
        RDS_SALDO_MENGENDAP_SIMPEL: parameters.saldoMengendapRekeningSimple,
        RDS_SALDO_MENGENDAP_RDN: parameters.saldoMengendapRekeningRDN,
        MULTI_DANA_MASUK: parameters.jumlahRekeningPerHariPemberiData,
        MULTI_DANA_KELUAR: parameters.jumlahRekeningPerHariPenerimaData,
        DOR_NOMINAL_TRANSFER_MASUK: parameters.nominalTransferMasuk,
        DOR_FREKUENSI: parameters.frekuensiPenarikanATM,
        STATUS: "1"
      };

      console.log("Saving parameters:", apiData);

      // Here you would make an API call to save parameters
      // const response = await updateParameterRedflag(apiData);

      // Simulate API call for now
      await new Promise(resolve => setTimeout(resolve, 2000));

      // Show success message or handle response
      alert("Parameter berhasil disimpan!");
    } catch (error) {
      console.error("Error saving parameters:", error);
      alert("Gagal menyimpan parameter!");
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
    }
  ];

  return (
    <div className="min-h-screen bg-gray-50">
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
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-blue-600 rounded-lg">
                  <Settings className="w-6 h-6 text-white" />
                </div>
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
                  <div key={index} className="bg-white rounded-xl border border-gray-200 overflow-hidden">
                    {/* Card Header */}
                    <div className={`${section.color} p-4`}>
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
                          <div className="relative">
                            {field.prefix && (
                              <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500 text-sm">
                                {field.prefix}
                              </span>
                            )}
                            <Input
                              value={parameters[field.key]}
                              onChange={(e) => {
                                // Use special handler for nominal fields (those with Rp prefix)
                                if (field.prefix === "Rp") {
                                  handleNominalChange(field.key, e.target.value);
                                } else {
                                  handleInputChange(field.key, e.target.value);
                                }
                              }}
                              className={`${field.prefix ? 'pl-8' : ''} ${field.suffix ? 'pr-16' : ''}`}
                              placeholder="Masukkan nilai..."
                            />
                            {field.suffix && (
                              <span className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 text-sm">
                                {field.suffix}
                              </span>
                            )}
                          </div>
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