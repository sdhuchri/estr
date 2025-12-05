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
}

export const getLaporanCabang = async (
  params: LaporanCabangRequest
): Promise<LaporanCabangResponse> => {
  const response = await fetch("http://10.125.22.11:8080/api/laporan/cabang", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(params),
  });

  if (!response.ok) {
    throw new Error(`HTTP error! status: ${response.status}`);
  }

  return response.json();
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
  const response = await fetch("http://10.125.22.11:8080/api/laporan/opr-kepatuhan", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(params),
  });

  if (!response.ok) {
    throw new Error(`HTTP error! status: ${response.status}`);
  }

  return response.json();
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
  const response = await fetch("http://10.125.22.11:8080/api/laporan/spv-kepatuhan", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(params),
  });

  if (!response.ok) {
    throw new Error(`HTTP error! status: ${response.status}`);
  }

  return response.json();
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

export interface LaporanRejectResponse {
  status: string;
  message: string;
  data: LaporanRejectData[];
}

export interface LaporanRejectRequest {
  tanggal_awal: string;
  tanggal_akhir: string;
}

export const getLaporanReject = async (
  params: LaporanRejectRequest
): Promise<LaporanRejectResponse> => {
  const response = await fetch("http://10.125.22.11:8080/api/laporan/reject", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(params),
  });

  if (!response.ok) {
    throw new Error(`HTTP error! status: ${response.status}`);
  }

  return response.json();
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

export interface LaporanAllResponse {
  status: string;
  message: string;
  data: LaporanAllData[];
}

export interface LaporanAllRequest {
  tanggal_awal: string;
  tanggal_akhir: string;
}

export const getLaporanAll = async (
  params: LaporanAllRequest
): Promise<LaporanAllResponse> => {
  const response = await fetch("http://10.125.22.11:8080/api/laporan/all", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(params),
  });

  if (!response.ok) {
    throw new Error(`HTTP error! status: ${response.status}`);
  }

  return response.json();
};
