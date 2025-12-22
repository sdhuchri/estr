"use client";
import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import { useSession } from "@/hooks/useSession";
import TailwindDatePicker from "@/components/common/TailwindDatePicker";
import { Toast } from "primereact/toast";
import { FileText, Clock, CheckCircle, XCircle, TrendingUp, Users } from "lucide-react";
import PieChart from "@/components/charts/PieChart";
import { getDashboardHome, formatDateToAPI } from "@/services/dashboardHome";
import DashboardSkeleton from "@/components/skeletons/DashboardSkeleton";
import { getCabangOptions } from "@/services/helper";
import { CustomListbox } from "@/components/common/FormField";

// Utility function to format number with thousand separator
const formatNumber = (num: number): string => {
  return num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".");
};

interface DashboardStats {
  totalTransaksi: number;
  totalDataCabang: number;
  totalDataKepatuhan: number;
  totalCabang: number;
  totalKepatuhan: number;
  cabang: {
    belumDikerjakan: number;
    belumOtorisasiSPV: number;
    sudahOtorisasiSPV: number;
    redflagReject: number;
  };
  kepatuhan: {
    belumDikerjakan: number;
    belumOtorisasiSPV: number;
    sudahOtorisasiSPV: number;
    rejectSPV: number;
  };
}

export default function HomeClient() {
  const router = useRouter();
  const toast = useRef<Toast>(null);
  const { session, loading } = useSession();

  // Set default dates (current month)
  const [periodeAwal, setPeriodeAwal] = useState<Date | null>(() => {
    const now = new Date();
    return new Date(now.getFullYear(), now.getMonth(), 1);
  });
  const [periodeAkhir, setPeriodeAkhir] = useState<Date | null>(() => {
    const now = new Date();
    return new Date(now.getFullYear(), now.getMonth() + 1, 0);
  });
  const [isLoading, setIsLoading] = useState(false);

  // Branch filter state
  const [selectedCabang, setSelectedCabang] = useState<string>("all");
  const [cabangOptions, setCabangOptions] = useState<Array<{ value: string; label: string }>>([]);

  const [stats, setStats] = useState<DashboardStats>({
    totalTransaksi: 0,
    totalDataCabang: 0,
    totalDataKepatuhan: 0,
    totalCabang: 0,
    totalKepatuhan: 0,
    cabang: {
      belumDikerjakan: 0,
      belumOtorisasiSPV: 0,
      sudahOtorisasiSPV: 0,
      redflagReject: 0,
    },
    kepatuhan: {
      belumDikerjakan: 0,
      belumOtorisasiSPV: 0,
      sudahOtorisasiSPV: 0,
      rejectSPV: 0,
    },
  });

  useEffect(() => {
    if (!loading && !session) {
      router.push("/signin");
    }
  }, [session, loading, router]);

  // Load cabang options on mount
  useEffect(() => {
    const loadCabangOptions = async () => {
      try {
        const options = await getCabangOptions("999"); // Get all branches
        setCabangOptions([
          { value: "all", label: "Semua Cabang" },
          ...options
        ]);
      } catch (error) {
        console.error("Error loading cabang options:", error);
      }
    };

    loadCabangOptions();
  }, []);

  const fetchDashboardData = async () => {
    if (!periodeAwal || !periodeAkhir) {
      toast.current?.show({
        severity: "warn",
        summary: "Peringatan",
        detail: "Silakan pilih periode tanggal",
        life: 3000,
      });
      return;
    }

    setIsLoading(true);
    try {
      // Pass kode_cabang only if not "all"
      const kodeCabang = selectedCabang === "all" ? undefined : selectedCabang;
      
      const response = await getDashboardHome(
        formatDateToAPI(periodeAwal),
        formatDateToAPI(periodeAkhir),
        kodeCabang
      );

      if (response.status === "success" && response.data) {
        setStats({
          totalTransaksi: response.data.total.total_transaksi_mencurigakan,
          totalDataCabang: response.data.total.total_transaksi_mencurigakan_cabang,
          totalDataKepatuhan: response.data.total.total_transaksi_mencurigakan_kep,
          totalCabang: response.data.cabang.total_cabang,
          totalKepatuhan: response.data.kepatuhan.total_kep,
          cabang: {
            belumDikerjakan: response.data.cabang.belum_dikerjakan_cabang,
            belumOtorisasiSPV: response.data.cabang.belum_diotorisasi_spv,
            sudahOtorisasiSPV: response.data.cabang.sudah_diotorisasi_spv,
            redflagReject: response.data.cabang.redflag_reject_cabang,
          },
          kepatuhan: {
            belumDikerjakan: response.data.kepatuhan.belum_dikerjakan_kep,
            belumOtorisasiSPV: response.data.kepatuhan.belum_diotorisasi_kep,
            sudahOtorisasiSPV: response.data.kepatuhan.sudah_diotorisasi_kep,
            rejectSPV: response.data.kepatuhan.redflag_reject_kep,
          },
        });
      } else {
        toast.current?.show({
          severity: "error",
          summary: "Error",
          detail: response.message || "Gagal memuat data dashboard",
          life: 3000,
        });
      }
    } catch (error) {
      console.error("Error fetching dashboard data:", error);
      toast.current?.show({
        severity: "error",
        summary: "Error",
        detail: "Terjadi kesalahan saat memuat data",
        life: 3000,
      });
    } finally {
      setIsLoading(false);
    }
  };

  // Check if user has permission to view dashboard
  const canViewDashboard = session?.userProfile === "estr_opr_kep" || session?.userProfile === "estr_spv_kep";

  // Fetch data on mount and when dates or branch filter change
  useEffect(() => {
    if (session && periodeAwal && periodeAkhir && canViewDashboard) {
      fetchDashboardData();
    }
  }, [session, periodeAwal, periodeAkhir, selectedCabang, canViewDashboard]);

  // Show skeleton while loading
  if (isLoading) {
    return (
      <>
        <Toast ref={toast} />
        <DashboardSkeleton />
      </>
    );
  }

  // Hide dashboard if user doesn't have permission
  if (!canViewDashboard) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Toast ref={toast} />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <style jsx global>{`
        @keyframes fadeIn {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        
        .fade-in-delay-1 {
          opacity: 0;
          animation: fadeIn 0.6s ease-out 0.1s forwards;
        }
        
        .fade-in-delay-2 {
          opacity: 0;
          animation: fadeIn 0.6s ease-out 0.2s forwards;
        }
        
        .fade-in-delay-3 {
          opacity: 0;
          animation: fadeIn 0.6s ease-out 0.3s forwards;
        }

        .dashboard-home-listbox button {
          border-radius: 0.5rem !important;
          border: 1px solid #d1d5db !important;
          padding: 0.5rem 1rem !important;
          font-size: 0.875rem !important;
          height: 2.5rem !important;
          box-shadow: 0 1px 2px 0 rgba(0, 0, 0, 0.05) !important;
        }
        .dashboard-home-listbox button:focus {
          outline: none !important;
          border-color: #3b82f6 !important;
          box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1) !important;
        }
      `}</style>
      <Toast ref={toast} />

      <div className="p-6">
        {/* Main Dashboard Card - Same style as DataTable */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 fade-in-delay-1">
          {/* Header Section */}
          <div className="p-6 border-b border-gray-200">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
              {/* Title and Description */}
              <div>
                <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
                <p className="text-gray-600 mt-1">
                  Monitor performa dan status transaksi
                </p>
              </div>

              {/* Filter Actions */}
              <div className="flex items-center gap-2">
                {/* Branch Filter */}
                <div className="w-56 dashboard-home-listbox">
                  <CustomListbox
                    value={selectedCabang}
                    onChange={(value) => setSelectedCabang(value)}
                    options={cabangOptions}
                    placeholder="Semua Cabang"
                  />
                </div>

                {/* Date Filter */}
                <TailwindDatePicker
                  value={periodeAwal}
                  onChange={(date) => setPeriodeAwal(date)}
                  placeholder="Tanggal Awal"
                  className="w-44"
                  roundedClass="rounded-lg"
                />
                <span className="text-sm text-gray-600">s/d</span>
                <TailwindDatePicker
                  value={periodeAkhir}
                  onChange={(date) => setPeriodeAkhir(date)}
                  placeholder="Tanggal Akhir"
                  className="w-44"
                  align="right"
                  roundedClass="rounded-lg"
                />
              </div>
            </div>
          </div>

          {/* Dashboard Content */}
          <div className="p-6">
            <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
              {/* Left Sidebar - Dashboard Keseluruhan */}
              <div className="lg:col-span-1 fade-in-delay-2">
                <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                  <h2 className="text-lg font-semibold text-gray-900 mb-6">
                    Dashboard Keseluruhan
                  </h2>

                  <div className="space-y-6">
                    <div className="flex items-center justify-between p-4 bg-blue-50 rounded-lg">
                      <div>
                        <p className="text-sm text-gray-600 mb-1">
                          Total Transaksi Mencurigakan
                        </p>
                        <p className="text-3xl font-bold text-blue-600">
                          {formatNumber(stats.totalTransaksi)}
                        </p>
                      </div>
                      <FileText className="w-10 h-10 text-blue-600" />
                    </div>

                    <div className="flex items-center justify-between p-4 bg-purple-50 rounded-lg">
                      <div>
                        <p className="text-sm text-gray-600 mb-1">
                          Total Data Mencurigakan di Cabang
                        </p>
                        <p className="text-3xl font-bold text-purple-600">
                          {formatNumber(stats.totalDataCabang)}
                        </p>
                      </div>
                      <Users className="w-10 h-10 text-purple-600" />
                    </div>

                    <div className="flex items-center justify-between p-4 bg-green-50 rounded-lg">
                      <div>
                        <p className="text-sm text-gray-600 mb-1">
                          Total Data Mencurigakan di Kepatuhan
                        </p>
                        <p className="text-3xl font-bold text-green-600">
                          {formatNumber(stats.totalDataKepatuhan)}
                        </p>
                      </div>
                      <TrendingUp className="w-10 h-10 text-green-600" />
                    </div>
                  </div>
                </div>
              </div>

              {/* Right Content - Dashboard Performa */}
              <div className="lg:col-span-3 fade-in-delay-3">
                <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                  <h2 className="text-lg font-semibold text-gray-900 mb-6">
                    Dashboard Performa
                  </h2>

                  {/* Cabang Section */}
                  <div className="mb-8">
                    <div className="flex items-center justify-between mb-4">
                      <h3 className="text-base font-semibold text-gray-800">
                        Total Transaksi Mencurigakan Cabang
                      </h3>
                      <span className="text-3xl font-bold text-blue-600">
                        : {formatNumber(stats.totalCabang)}
                      </span>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      {/* Stats List */}
                      <div className="space-y-3">
                        <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                          <div className="flex items-center gap-2">
                            <Clock className="w-5 h-5 text-orange-500" />
                            <span className="text-sm text-gray-700">
                              Belum Dikerjakan User Cabang
                            </span>
                          </div>
                          <span className="font-semibold text-gray-900">
                            {formatNumber(stats.cabang.belumDikerjakan)}
                          </span>
                        </div>

                        <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                          <div className="flex items-center gap-2">
                            <Clock className="w-5 h-5 text-yellow-500" />
                            <span className="text-sm text-gray-700">
                              Belum Diotorisasi SPV Cabang
                            </span>
                          </div>
                          <span className="font-semibold text-gray-900">
                            {formatNumber(stats.cabang.belumOtorisasiSPV)}
                          </span>
                        </div>

                        <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                          <div className="flex items-center gap-2">
                            <CheckCircle className="w-5 h-5 text-green-500" />
                            <span className="text-sm text-gray-700">
                              Sudah Diotorisasi SPV Cabang
                            </span>
                          </div>
                          <span className="font-semibold text-gray-900">
                            {formatNumber(stats.cabang.sudahOtorisasiSPV)}
                          </span>
                        </div>

                        <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                          <div className="flex items-center gap-2">
                            <XCircle className="w-5 h-5 text-red-500" />
                            <span className="text-sm text-gray-700">
                              Redflag Reject
                            </span>
                          </div>
                          <span className="font-semibold text-gray-900">
                            {formatNumber(stats.cabang.redflagReject)}
                          </span>
                        </div>
                      </div>

                      {/* Pie Chart */}
                      <div className="flex items-center justify-center bg-gradient-to-br from-blue-50 to-blue-100 rounded-lg p-6">
                        <PieChart
                          data={[
                            {
                              label: "Belum Dikerjakan",
                              value: stats.cabang.belumDikerjakan,
                              color: "#3B82F6",
                            },
                            {
                              label: "Belum Otorisasi SPV",
                              value: stats.cabang.belumOtorisasiSPV,
                              color: "#F59E0B",
                            },
                            {
                              label: "Sudah Otorisasi SPV",
                              value: stats.cabang.sudahOtorisasiSPV,
                              color: "#10B981",
                            },
                            {
                              label: "Redflag Reject",
                              value: stats.cabang.redflagReject,
                              color: "#EF4444",
                            },
                          ]}
                          size={240}
                        />
                      </div>
                    </div>
                  </div>

                  {/* Kepatuhan Section */}
                  <div>
                    <div className="flex items-center justify-between mb-4">
                      <h3 className="text-base font-semibold text-gray-800">
                        Total Transaksi Mencurigakan Kepatuhan
                      </h3>
                      <span className="text-3xl font-bold text-green-600">
                        : {formatNumber(stats.totalKepatuhan)}
                      </span>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      {/* Stats List */}
                      <div className="space-y-3">
                        <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                          <div className="flex items-center gap-2">
                            <Clock className="w-5 h-5 text-orange-500" />
                            <span className="text-sm text-gray-700">
                              Belum Dikerjakan User Kepatuhan
                            </span>
                          </div>
                          <span className="font-semibold text-gray-900">
                            {formatNumber(stats.kepatuhan.belumDikerjakan)}
                          </span>
                        </div>

                        <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                          <div className="flex items-center gap-2">
                            <Clock className="w-5 h-5 text-yellow-500" />
                            <span className="text-sm text-gray-700">
                              Belum Diotorisasi SPV Kepatuhan
                            </span>
                          </div>
                          <span className="font-semibold text-gray-900">
                            {formatNumber(stats.kepatuhan.belumOtorisasiSPV)}
                          </span>
                        </div>

                        <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                          <div className="flex items-center gap-2">
                            <CheckCircle className="w-5 h-5 text-green-500" />
                            <span className="text-sm text-gray-700">
                              Sudah Diotorisasi SPV Kepatuhan
                            </span>
                          </div>
                          <span className="font-semibold text-gray-900">
                            {formatNumber(stats.kepatuhan.sudahOtorisasiSPV)}
                          </span>
                        </div>

                        <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                          <div className="flex items-center gap-2">
                            <XCircle className="w-5 h-5 text-red-500" />
                            <span className="text-sm text-gray-700">
                              Reject SPV Kepatuhan
                            </span>
                          </div>
                          <span className="font-semibold text-gray-900">
                            {formatNumber(stats.kepatuhan.rejectSPV)}
                          </span>
                        </div>
                      </div>

                      {/* Pie Chart */}
                      <div className="flex items-center justify-center bg-gradient-to-br from-green-50 to-green-100 rounded-lg p-6">
                        <PieChart
                          data={[
                            {
                              label: "Belum Dikerjakan",
                              value: stats.kepatuhan.belumDikerjakan,
                              color: "#3B82F6",
                            },
                            {
                              label: "Belum Otorisasi SPV",
                              value: stats.kepatuhan.belumOtorisasiSPV,
                              color: "#F59E0B",
                            },
                            {
                              label: "Sudah Otorisasi SPV",
                              value: stats.kepatuhan.sudahOtorisasiSPV,
                              color: "#10B981",
                            },
                            {
                              label: "Reject SPV",
                              value: stats.kepatuhan.rejectSPV,
                              color: "#EF4444",
                            },
                          ]}
                          size={240}
                        />
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          {/* End Dashboard Content */}
        </div>
        {/* End Main Dashboard Card */}
      </div>
    </div>
  );
}
