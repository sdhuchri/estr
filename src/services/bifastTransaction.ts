const API_BASE_URL = "http://10.125.22.11:8080";

// ==================== INTERFACES ====================
export interface BiFastTodoResponse {
  additional_info_rc: string;
  amount: number;
  cabang: string;
  created_at: string;
  end_to_end_id: string;
  id: number;
  ket: string;
  no_cif: string;
  receiver_account_number: string;
  receiver_bank_code: string;
  receiver_name: string;
  reference_number: string;
  sender_account_number: string;
  sender_bank_code: string;
  sender_name: string;
  status: string;
  type_trx: string;
  // New fields
  jam_hubungi?: string;
  tanggal_hubungi?: string;
  penjelasan_cso?: string;
  penjelasan_spv?: string;
  penjelasan_opr_kepatuhan?: string;
  penjelasan_spv_kepatuhan?: string;
}

export interface BiFastTodoApiResponse {
  status: string;
  message: string;
  data: BiFastTodoResponse[];
}

// ==================== GET BI-FAST TODO LIST ====================
/**
 * Fetch BI-Fast todo list data
 * @param kodeCabang - Kode cabang untuk filter data
 * @returns Promise dengan data todo list
 * 
 * @example
 * const response = await getBiFastTodoList("001");
 */
export async function getBiFastTodoList(kodeCabang: string): Promise<BiFastTodoApiResponse> {
  try {
    const res = await fetch(`${API_BASE_URL}/api/bifast/todo`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        kode_cabang: kodeCabang,
      }),
      cache: "no-store",
    });

    const result = await res.json();
    return result;
  } catch (error) {
    console.error("Error fetching BI-Fast todo list:", error);
    return {
      status: "error",
      message: "Gagal mengambil data todo bifast",
      data: [],
    };
  }
}

// ==================== UPDATE/INSERT BI-FAST ====================
export interface UpdateBiFastRequest {
  id: string;
  cif: string;
  norek: string;
  indicator: string;
  cabang: string;
  nama_nasabah: string;
  tanggal_transaksi: string;
  keterangan: string;
  tanggal_hubungi: string;
  jam_hubungi: string;
  penjelasan_cso: string;
  proses_on: string;
  status: string;
}

export interface UpdateBiFastResponse {
  status: string;
  message: string;
}

/**
 * Update or insert BI-Fast transaction data
 * @param data - Update request data
 * @returns Promise with response
 */
export async function updateBiFast(data: UpdateBiFastRequest): Promise<UpdateBiFastResponse> {
  try {
    const res = await fetch(`${API_BASE_URL}/api/bifast/upsert`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
      cache: "no-store",
    });

    const result = await res.json();
    return result;
  } catch (error) {
    console.error("Error updating BI-Fast data:", error);
    return {
      status: "error",
      message: "Gagal menyimpan data",
    };
  }
}

// ==================== REVISI BI-FAST ====================
export interface RevisiBiFastRequest {
  id: string;
}

export interface RevisiBiFastResponse {
  status: string;
  message: string;
}

/**
 * Revisi/Sendback BI-Fast transaction data
 * @param data - Revisi request data
 * @returns Promise with response
 * 
 * @example
 * const response = await revisiBiFast({ id: "71" });
 */
export async function revisiBiFast(data: RevisiBiFastRequest): Promise<RevisiBiFastResponse> {
  try {
    const res = await fetch(`${API_BASE_URL}/api/bifast/revisi`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
      cache: "no-store",
    });

    const result = await res.json();
    return result;
  } catch (error) {
    console.error("Error revisi BI-Fast data:", error);
    return {
      status: "error",
      message: "Gagal melakukan revisi data",
    };
  }
}

// ==================== GET BI-FAST STATUS ====================
export interface BiFastStatusResponse {
  additional_info_rc: string;
  amount: number;
  cabang: string;
  created_at: string;
  end_to_end_id: string;
  id: number;
  jam_hubungi: string | null;
  ket: string;
  no_cif: string;
  otor_spv_cabang: string | null;
  otor_spv_kepatuhan: string | null;
  penjelasan_cso: string | null;
  penjelasan_opr_kepatuhan: string | null;
  penjelasan_spv: string | null;
  penjelasan_spv_kepatuhan: string | null;
  proses_on: string | null;
  receiver_account_number: string;
  receiver_bank_code: string;
  receiver_name: string;
  reference_number: string;
  review_opr_kepatuhan: string | null;
  sender_account_number: string;
  sender_bank_code: string;
  sender_name: string;
  status: string;
  tanggal_hubungi: string | null;
  type_trx: string;
}

export interface BiFastStatusApiResponse {
  status: string;
  message: string;
  data: BiFastStatusResponse[];
}

/**
 * Fetch BI-Fast status data
 * @param kodeCabang - Kode cabang untuk filter data
 * @returns Promise dengan data status
 * 
 * @example
 * const response = await getBiFastStatus("001");
 */
export async function getBiFastStatus(kodeCabang: string): Promise<BiFastStatusApiResponse> {
  try {
    const res = await fetch(`${API_BASE_URL}/api/bifast/status`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        kode_cabang: kodeCabang,
      }),
      cache: "no-store",
    });

    const result = await res.json();
    return result;
  } catch (error) {
    console.error("Error fetching BI-Fast status:", error);
    return {
      status: "error",
      message: "Gagal mengambil data status bifast",
      data: [],
    };
  }
}

// ==================== GET BI-FAST LAPORAN ====================
export interface BiFastLaporanResponse {
  additional_info_rc: string;
  amount: number;
  cabang: string;
  created_at: string;
  end_to_end_id: string;
  id: number;
  jam_hubungi: string | null;
  ket: string;
  no_cif: string;
  otor_spv_cabang: string | null;
  otor_spv_kepatuhan: string | null;
  penjelasan_cso: string | null;
  penjelasan_opr_kepatuhan: string | null;
  penjelasan_spv: string | null;
  penjelasan_spv_kepatuhan: string | null;
  proses_on: string | null;
  receiver_account_number: string;
  receiver_bank_code: string;
  receiver_name: string;
  reference_number: string;
  review_opr_kepatuhan: string | null;
  sender_account_number: string;
  sender_bank_code: string;
  sender_name: string;
  status: string;
  tanggal_hubungi: string | null;
  type_trx: string;
}

export interface BiFastLaporanApiResponse {
  status: string;
  message: string;
  data: BiFastLaporanResponse[];
}

/**
 * Fetch BI-Fast laporan aktivitas data
 * @param kodeCabang - Kode cabang untuk filter data
 * @returns Promise dengan data laporan
 * 
 * @example
 * const response = await getBiFastLaporan("001");
 */
export async function getBiFastLaporan(kodeCabang: string): Promise<BiFastLaporanApiResponse> {
  try {
    const res = await fetch(`${API_BASE_URL}/api/bifast/laporan`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        kode_cabang: kodeCabang,
      }),
      cache: "no-store",
    });

    const result = await res.json();
    return result;
  } catch (error) {
    console.error("Error fetching BI-Fast laporan:", error);
    return {
      status: "error",
      message: "Gagal mengambil data laporan bifast",
      data: [],
    };
  }
}

// ==================== HELPER FUNCTIONS ====================
/**
 * Format date dari ISO string ke format dd-mm-yyyy
 * @param isoDate - ISO date string
 * @returns Formatted date string
 */
export function formatDateToDDMMYYYY(isoDate: string): string {
  const date = new Date(isoDate);
  const day = String(date.getDate()).padStart(2, "0");
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const year = date.getFullYear();
  return `${day}-${month}-${year}`;
}
