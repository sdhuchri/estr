import { MOCK_LAPORAN_DATA, MOCK_LAPORAN_KETERLAMBATAN, simulateDelay } from "@/data/mockData";

export interface LaporanCabangData {
  NO: number;
  ID_LAPORAN: string;
  INDIKATOR: string;
  NO_CIF: string;
  NO_REK: string;
  NAMA_NASABAH: string;
  KETERANGAN: string;
  KETERANGAN_STATUS: string | null;
  CABANG: string;
  CABANG_INDUK: string | null;
  KET_CABANG_OPR: string | null;
  KET_CABANG_SPV: string | null;
  KET_KEPATUHAN: string | null;
  TGL_HUB_NASABAH: string | null;
  JAM_HUB_NASABAH: string;
  STATUS: string;
  DESKRIPSI_STATUS: string;
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
  TENGGAT: string | null;
  SKALA: string | null;
}

export interface LaporanCabangResponse {
  status: string;
  message: string;
  data: LaporanCabangData[];
}

export interface LaporanCabangRequest {
  tanggal_awal: string;
  tanggal_akhir: string;
  kode_cabang: string;
}

export const getLaporanCabang = async (
  params: LaporanCabangRequest
): Promise<LaporanCabangResponse> => {
  try {
    // Simulate API delay
    await simulateDelay(500);

    // Filter by cabang if not "999"
    let filteredData = MOCK_LAPORAN_DATA;
    if (params.kode_cabang !== "999") {
      filteredData = MOCK_LAPORAN_DATA.filter(item => item.CABANG === params.kode_cabang);
    }

    return {
      status: "success",
      message: "Success",
      data: filteredData
    };
  } catch (error) {
    throw new Error(`Error fetching laporan cabang: ${error}`);
  }
};

// ==================== LAPORAN OPR KEPATUHAN ====================
export interface LaporanOprKepatuhanData {
  NO: number;
  ID_LAPORAN: string;
  INDIKATOR: string;
  NO_CIF: string;
  NO_REK: string;
  NAMA_NASABAH: string;
  KETERANGAN: string;
  KETERANGAN_STATUS: string | null;
  CABANG: string;
  CABANG_INDUK: string | null;
  KET_CABANG_OPR: string | null;
  KET_CABANG_SPV: string | null;
  KET_KEPATUHAN: string | null;
  TGL_HUB_NASABAH: string | null;
  JAM_HUB_NASABAH: string;
  STATUS: string;
  DESKRIPSI_STATUS: string;
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
  TENGGAT: string | null;
  SKALA: string | null;
}

export interface LaporanOprKepatuhanResponse {
  status: string;
  message: string;
  data: LaporanOprKepatuhanData[];
}

export interface LaporanOprKepatuhanRequest {
  tanggal_awal: string;
  tanggal_akhir: string;
}

export const getLaporanOprKepatuhan = async (
  params: LaporanOprKepatuhanRequest
): Promise<LaporanOprKepatuhanResponse> => {
  try {
    // Simulate API delay
    await simulateDelay(500);

    return {
      status: "success",
      message: "Success",
      data: MOCK_LAPORAN_DATA
    };
  } catch (error) {
    throw new Error(`Error fetching laporan opr kepatuhan: ${error}`);
  }
};

// ==================== LAPORAN SPV KEPATUHAN ====================
export interface LaporanSpvKepatuhanData {
  NO: number;
  ID_LAPORAN: string;
  INDIKATOR: string;
  NO_CIF: string;
  NO_REK: string;
  NAMA_NASABAH: string;
  KETERANGAN: string;
  KETERANGAN_STATUS: string | null;
  CABANG: string;
  CABANG_INDUK: string | null;
  KET_CABANG_OPR: string | null;
  KET_CABANG_SPV: string | null;
  KET_KEPATUHAN: string | null;
  TGL_HUB_NASABAH: string | null;
  JAM_HUB_NASABAH: string;
  STATUS: string;
  DESKRIPSI_STATUS: string;
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
  TENGGAT: string | null;
  SKALA: string | null;
}

export interface LaporanSpvKepatuhanResponse {
  status: string;
  message: string;
  data: LaporanSpvKepatuhanData[];
}

export interface LaporanSpvKepatuhanRequest {
  tanggal_awal: string;
  tanggal_akhir: string;
}

export const getLaporanSpvKepatuhan = async (
  params: LaporanSpvKepatuhanRequest
): Promise<LaporanSpvKepatuhanResponse> => {
  try {
    // Simulate API delay
    await simulateDelay(500);

    return {
      status: "success",
      message: "Success",
      data: MOCK_LAPORAN_DATA
    };
  } catch (error) {
    throw new Error(`Error fetching laporan spv kepatuhan: ${error}`);
  }
};

// ==================== LAPORAN REJECT ====================
export interface LaporanRejectData {
  NO: number;
  ID_LAPORAN: string;
  INDIKATOR: string;
  NO_CIF: string;
  NO_REK: string;
  NAMA_NASABAH: string;
  KETERANGAN: string;
  KETERANGAN_STATUS: string | null;
  CABANG: string;
  CABANG_INDUK: string | null;
  KET_CABANG_OPR: string | null;
  KET_CABANG_SPV: string | null;
  KET_KEPATUHAN: string | null;
  TGL_HUB_NASABAH: string | null;
  JAM_HUB_NASABAH: string;
  STATUS: string;
  DESKRIPSI_STATUS: string;
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
  TENGGAT: string | null;
  SKALA: string | null;
}

export interface LaporanRejectPagination {
  current_page: number;
  has_next_page: boolean;
  has_prev_page: boolean;
  records_per_page: number;
  total_pages: number;
  total_records: number;
}

export interface LaporanRejectResponse {
  status: string;
  message: string;
  data: {
    data: LaporanRejectData[];
    pagination: LaporanRejectPagination;
  } | LaporanRejectData[]; // Support both old and new structure
}

export interface LaporanRejectRequest {
  tanggal_awal: string;
  tanggal_akhir: string;
  page?: number;
  limit?: number;
}

export const getLaporanReject = async (
  params: LaporanRejectRequest
): Promise<LaporanRejectResponse> => {
  try {
    // Simulate API delay
    await simulateDelay(500);

    // Filter rejected items
    const rejectedData = MOCK_LAPORAN_DATA.filter(item => item.STATUS === "10");

    // Pagination
    const page = params.page || 1;
    const limit = params.limit || 10;
    const startIndex = (page - 1) * limit;
    const endIndex = startIndex + limit;
    const paginatedData = rejectedData.slice(startIndex, endIndex);

    return {
      status: "success",
      message: "Success",
      data: {
        data: paginatedData,
        pagination: {
          current_page: page,
          has_next_page: endIndex < rejectedData.length,
          has_prev_page: page > 1,
          records_per_page: limit,
          total_pages: Math.ceil(rejectedData.length / limit),
          total_records: rejectedData.length
        }
      }
    };
  } catch (error) {
    throw new Error(`Error fetching laporan reject: ${error}`);
  }
};

// ==================== LAPORAN ALL ====================
export interface LaporanAllData {
  NO: number;
  ID_LAPORAN: string;
  INDIKATOR: string;
  NO_CIF: string;
  NO_REK: string;
  NAMA_NASABAH: string;
  KETERANGAN: string;
  KETERANGAN_STATUS: string | null;
  CABANG: string;
  CABANG_INDUK: string | null;
  KET_CABANG_OPR: string | null;
  KET_CABANG_SPV: string | null;
  KET_KEPATUHAN: string | null;
  TGL_HUB_NASABAH: string | null;
  JAM_HUB_NASABAH: string;
  STATUS: string;
  DESKRIPSI_STATUS: string;
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
  TENGGAT: string | null;
  SKALA: string | null;
}

export interface LaporanAllPagination {
  current_page: number;
  has_next_page: boolean;
  has_prev_page: boolean;
  records_per_page: number;
  total_pages: number;
  total_records: number;
}

export interface LaporanAllResponse {
  status: string;
  message: string;
  data: {
    data: LaporanAllData[];
    pagination: LaporanAllPagination;
  } | LaporanAllData[]; // Support both old and new structure
}

export interface LaporanAllRequest {
  tanggal_awal: string;
  tanggal_akhir: string;
  page?: number;
  limit?: number;
}

export const getLaporanAll = async (
  params: LaporanAllRequest
): Promise<LaporanAllResponse> => {
  try {
    // Simulate API delay
    await simulateDelay(500);

    // Pagination
    const page = params.page || 1;
    const limit = params.limit || 10;
    const startIndex = (page - 1) * limit;
    const endIndex = startIndex + limit;
    const paginatedData = MOCK_LAPORAN_DATA.slice(startIndex, endIndex);

    return {
      status: "success",
      message: "Success",
      data: {
        data: paginatedData,
        pagination: {
          current_page: page,
          has_next_page: endIndex < MOCK_LAPORAN_DATA.length,
          has_prev_page: page > 1,
          records_per_page: limit,
          total_pages: Math.ceil(MOCK_LAPORAN_DATA.length / limit),
          total_records: MOCK_LAPORAN_DATA.length
        }
      }
    };
  } catch (error) {
    throw new Error(`Error fetching laporan all: ${error}`);
  }
};


// ==================== LAPORAN KETERLAMBATAN ====================
export interface LaporanKeterlambatanData {
  tanggal_laporan: string;
  keterlambatan: number;
  daftar_cabang: string;
}

export interface LaporanKeterlambatanResponse {
  success: boolean;
  count: number;
  data: LaporanKeterlambatanData[];
}

export interface LaporanKeterlambatanRequest {
  tanggal_awal: string;
  tanggal_akhir: string;
}

export const getLaporanKeterlambatan = async (
  params: LaporanKeterlambatanRequest
): Promise<{ status: string; message: string; data?: LaporanKeterlambatanData[] }> => {
  try {
    // Simulate API delay
    await simulateDelay(500);

    return {
      status: "success",
      message: "Data berhasil diambil",
      data: MOCK_LAPORAN_KETERLAMBATAN
    };
  } catch (error) {
    throw new Error(`Error fetching laporan keterlambatan: ${error}`);
  }
};
