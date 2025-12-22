// services/cabangService.ts
import { MOCK_CABANG, MOCK_INDIKATOR, simulateDelay } from "@/data/mockData";

// ==================== INTERFACES ====================
export interface CabangData {
  kode_cabang: string;
  nama_cabang: string;
  singkatan_cabang: string;
  induk_cabang: string;
}

export interface CabangResponse {
  status: number | string;
  message: string;
  data?: CabangData[];
}

// ==================== GET ALL CABANG ====================
/**
 * Get all cabang data from DBMIS
 * @param kodeCabang - Kode cabang untuk filter. Gunakan "999" untuk mendapatkan semua cabang
 * @returns Promise dengan data cabang
 * 
 * @example
 * // Get semua cabang
 * const allCabang = await getAllCabang("999");
 * 
 * // Get cabang spesifik atau cabang yang induknya sama
 * const specificCabang = await getAllCabang("001");
 */
export async function getAllCabang(kodeCabang: string): Promise<CabangResponse> {
  try {
    // Simulate API delay
    await simulateDelay(300);

    // Filter cabang based on kode_cabang
    let filteredCabang = MOCK_CABANG;
    
    if (kodeCabang !== "999") {
      filteredCabang = MOCK_CABANG.filter(
        (c) => c.kode_cabang === kodeCabang || c.induk_cabang === kodeCabang
      );
    }

    return {
      status: 200,
      message: "Success",
      data: filteredCabang
    };
  } catch (error) {
    console.error("Error fetching cabang data:", error);
    return {
      status: "error",
      message: "Failed to fetch cabang data",
      data: [],
    };
  }
}

// ==================== HELPER FUNCTIONS ====================
/**
 * Validasi kode cabang sebelum request
 */
export function validateKodeCabang(kodeCabang: string): true | string {
  if (!kodeCabang || kodeCabang.trim() === "") {
    return "Parameter 'kode_cabang' wajib diisi";
  }
  return true;
}

/**
 * Get cabang options untuk dropdown/select
 * Format: { value: kode_cabang, label: "kode - nama" }
 */
export async function getCabangOptions(kodeCabang: string = "999") {
  const response = await getAllCabang(kodeCabang);
  
  if (response.data && response.data.length > 0) {
    return response.data.map((cabang) => ({
      value: cabang.kode_cabang,
      label: `${cabang.kode_cabang} - ${cabang.nama_cabang}`,
      singkatan: cabang.singkatan_cabang,
      induk: cabang.induk_cabang,
    }));
  }
  
  return [];
}

/**
 * Get cabang by kode (single result)
 */
export async function getCabangByKode(kodeCabang: string): Promise<CabangData | null> {
  const response = await getAllCabang(kodeCabang);
  
  if (response.data && response.data.length > 0) {
    // Return first result that matches exactly
    return response.data.find(c => c.kode_cabang === kodeCabang) || response.data[0];
  }
  
  return null;
}

// ==================== INDIKATOR ====================
export interface IndikatorData {
  deskripsi: string;
  kode_indikator: string;
}

export interface IndikatorResponse {
  status: number | string;
  message: string;
  data?: IndikatorData[];
}

/**
 * Get all indikator data
 * @returns Promise dengan data indikator
 */
export async function getAllIndikator(): Promise<IndikatorResponse> {
  try {
    // Simulate API delay
    await simulateDelay(300);

    return {
      status: 200,
      message: "Success",
      data: MOCK_INDIKATOR
    };
  } catch (error) {
    console.error("Error fetching indikator data:", error);
    return {
      status: "error",
      message: "Failed to fetch indikator data",
      data: [],
    };
  }
}

/**
 * Get indikator options untuk dropdown/select
 * Format: { value: kode_indikator, label: "kode_indikator" }
 */
export async function getIndikatorOptions() {
  const response = await getAllIndikator();
  
  if (response.data && response.data.length > 0) {
    return response.data.map((indikator) => ({
      value: indikator.kode_indikator,
      label: indikator.kode_indikator,
      deskripsi: indikator.deskripsi,
    }));
  }
  
  return [];
}

// ==================== PRIORITAS ====================
export interface PrioritasResponse {
  status: string;
  message: string;
  data?: {
    prioritas: string;
  };
}

/**
 * Get prioritas/skala berdasarkan redflag/indikator
 * @param redflag - Kode indikator (PASSBY, ET, BOP, dll)
 * @returns Promise dengan data prioritas
 * 
 * @example
 * const response = await getPrioritas("PASSBY");
 * // Returns: { status: "success", message: "...", data: { prioritas: "MEDIUM" } }
 */
export async function getPrioritas(redflag: string): Promise<PrioritasResponse> {
  try {
    // Simulate API delay
    await simulateDelay(300);

    // Determine prioritas based on redflag
    const prioritasMap: Record<string, string> = {
      "PASSBY": "HIGH",
      "ET": "MEDIUM",
      "BOP": "HIGH",
      "CASH": "MEDIUM",
      "STRUCT": "HIGH",
      "UNUSUAL": "LOW"
    };

    const prioritas = prioritasMap[redflag] || "MEDIUM";

    return {
      status: "success",
      message: "Success",
      data: { prioritas }
    };
  } catch (error) {
    console.error("Error fetching prioritas data:", error);
    return {
      status: "error",
      message: "Failed to fetch prioritas data",
    };
  }
}