// services/dashboardHome.ts

const API_BASE_URL = "http://10.125.22.11:8080";

// ==================== INTERFACES ====================
export interface DashboardCabangData {
  belum_dikerjakan_cabang: number;
  belum_diotorisasi_spv: number;
  sudah_diotorisasi_spv: number;
  redflag_reject_cabang: number;
  total_cabang: number;
}

export interface DashboardKepatuhanData {
  belum_dikerjakan_kep: number;
  belum_diotorisasi_kep: number;
  sudah_diotorisasi_kep: number;
  redflag_reject_kep: number;
  total_kep: number;
}

export interface DashboardTotalData {
  total_transaksi_mencurigakan_cabang: number;
  total_transaksi_mencurigakan_kep: number;
  total_transaksi_mencurigakan: number;
}

export interface DashboardData {
  cabang: DashboardCabangData;
  kepatuhan: DashboardKepatuhanData;
  total: DashboardTotalData;
}

export interface DashboardResponse {
  status: string;
  message: string;
  data?: DashboardData;
}

// ==================== GET DASHBOARD HOME DATA ====================
/**
 * Get dashboard home statistics
 * @param periodeAwal - Start date in format "YYYY-MM-DD"
 * @param periodeAkhir - End date in format "YYYY-MM-DD"
 * @returns Promise with dashboard data
 * 
 * @example
 * const response = await getDashboardHome("2025-01-01", "2025-12-31");
 */
export async function getDashboardHome(
  periodeAwal: string,
  periodeAkhir: string
): Promise<DashboardResponse> {
  try {
    const res = await fetch(`${API_BASE_URL}/api/dashboard/home`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        periode_awal: periodeAwal,
        periode_akhir: periodeAkhir,
      }),
      cache: "no-store",
    });

    const result = await res.json();
    return result;
  } catch (error) {
    console.error("Error fetching dashboard home data:", error);
    return {
      status: "error",
      message: "Failed to fetch dashboard data",
      data: undefined,
    };
  }
}

// ==================== HELPER FUNCTIONS ====================
/**
 * Format Date object to YYYY-MM-DD string
 */
export function formatDateToAPI(date: Date | null): string {
  if (!date) return "";
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}