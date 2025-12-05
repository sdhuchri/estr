"use client";
import { useState, useRef } from "react";
import FormField, { Input } from "@/components/common/FormField";
import { TrendingUp, Users, CreditCard, Shield, RefreshCw, AlertTriangle, Search, CheckCircle, XCircle } from "lucide-react";
import { Toast } from "primereact/toast";
import ConfirmDialog from "@/components/common/ConfirmDialog";
import { otorisasiParameterRedflag } from "@/services/parameterRedflag";

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
  filterCabang: string;

  // Judol
  deskripsiTransaksi: string;
  jumlahTransaksiDebit: string;
  jumlahTransaksiKredit: string;
  waktuJudol: string;

  // Database Suspect
  kategoriBlacklist: string;
  keywordKeterangan: string;
}

interface SettingParameterOtorisasiClientProps {
  initialData: ParameterData;
  userId: string;
}

export default function SettingParameterOtorisasiClient({ initialData, userId }: SettingParameterOtorisasiClientProps) {
  const toast = useRef<Toast>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [parameters] = useState<ParameterData>(initialData);
  const [isConfirmDialogOpen, setIsConfirmDialogOpen] = useState(false);
  const [actionType, setActionType] = useState<"approve" | "reject">("approve");

  const handleApproveClick = () => {
    setActionType("approve");
    setIsConfirmDialogOpen(true);
  };

  const handleRejectClick = () => {
    setActionType("reject");
    setIsConfirmDialogOpen(true);
  };

  const handleConfirmAction = async () => {
    setIsConfirmDialogOpen(false);
    setIsProcessing(true);

    try {
      const response = await otorisasiParameterRedflag(actionType);

      if (response.status === "success") {
        toast.current?.show({
          severity: "success",
          summary: "Berhasil!",
          detail: response.message || `Parameter berhasil ${actionType === "approve" ? "disetujui" : "ditolak"}!`,
          life: 3000
        });

        // Redirect or refresh after successful action
        setTimeout(() => {
          // window.location.reload();
          window.location.href = "/estr/setting-parameter/otorisasi";
        }, 1500);
      } else {
        toast.current?.show({
          severity: "error",
          summary: "Gagal!",
          detail: response.message || `Gagal ${actionType === "approve" ? "menyetujui" : "menolak"} parameter!`,
          life: 3000
        });
      }
    } catch (error) {
      console.error(`Error ${actionType}ing parameters:`, error);
      toast.current?.show({
        severity: "error",
        summary: "Gagal!",
        detail: `Terjadi kesalahan saat ${actionType === "approve" ? "menyetujui" : "menolak"} parameter!`,
        life: 3000
      });
    } finally {
      setIsProcessing(false);
    }
  };

  const handleCancelAction = () => {
    setIsConfirmDialogOpen(false);
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
          label: "Waktu"
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
          label: "Kategori Blacklist"
        },
        {
          key: "keywordKeterangan" as keyof ParameterData,
          label: "Keyword Keterangan"
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
        onClose={handleCancelAction}
        onConfirm={handleConfirmAction}
        title={actionType === "approve" ? "Konfirmasi Approve" : "Konfirmasi Reject"}
        message={`Apakah Anda yakin ingin ${actionType === "approve" ? "menyetujui" : "menolak"} perubahan parameter ini?`}
        confirmLabel={actionType === "approve" ? "Ya, Setujui" : "Ya, Tolak"}
        cancelLabel="Batal"
        variant={actionType === "reject" ? "danger" : "default"}
      />

      <div className="p-6">
        {/* Main Card Container */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
          {/* Header */}
          <div className="p-6 border-b border-gray-200">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-3">
                <div>
                  <h1 className="text-3xl font-bold text-gray-900">Otorisasi Setting Parameter</h1>
                  <p className="text-gray-600 mt-1">Review dan otorisasi perubahan parameter sistem</p>
                </div>
              </div>

              {/* Search and Action Buttons - Right Side */}
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

                {/* Reject Button */}
                <button
                  onClick={handleRejectClick}
                  disabled={isProcessing}
                  className="flex items-center gap-2 px-6 py-2 bg-red-600 hover:bg-red-700 disabled:bg-red-400 text-white rounded-lg font-medium transition-colors shadow-lg"
                >
                  {isProcessing && actionType === "reject" ? (
                    <>
                      <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                      Memproses...
                    </>
                  ) : (
                    <>
                      <XCircle className="w-5 h-5" />
                      Reject
                    </>
                  )}
                </button>

                {/* Approve Button */}
                <button
                  onClick={handleApproveClick}
                  disabled={isProcessing}
                  className="flex items-center gap-2 px-6 py-2 bg-green-600 hover:bg-green-700 disabled:bg-green-400 text-white rounded-lg font-medium transition-colors shadow-lg"
                >
                  {isProcessing && actionType === "approve" ? (
                    <>
                      <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                      Memproses...
                    </>
                  ) : (
                    <>
                      <CheckCircle className="w-5 h-5" />
                      Approve
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
                            {'prefix' in field && field.prefix && (
                              <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500 text-sm">
                                {field.prefix}
                              </span>
                            )}
                            <Input
                              value={parameters[field.key]}
                              disabled
                              className={`${'prefix' in field && field.prefix ? 'pl-8' : ''} ${'suffix' in field && field.suffix ? 'pr-16' : ''} bg-gray-50 cursor-not-allowed`}
                              placeholder="Tidak ada data"
                            />
                            {'suffix' in field && field.suffix && (
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
