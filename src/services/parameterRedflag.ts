// services/parameterRedflagService.ts
import { 
  MOCK_PARAMETER_REDFLAG, 
  MOCK_PARAMETER_KODE_TRANSAKSI,
  MOCK_PARAMETER_TRANSAKSI_UMUM,
  MOCK_PARAMETER_PRIORITAS,
  MOCK_PARAMETER_AKTIVASI,
  MOCK_PARAMETER_WATCHLIST,
  MOCK_INDIKATOR,
  simulateDelay 
} from "@/data/mockData";

export async function getParameterRedflag(status?: string) {
  try {
    // Simulate API delay
    await simulateDelay(500);

    // Filter by status if provided
    let filteredData = MOCK_PARAMETER_REDFLAG;
    if (status) {
      filteredData = MOCK_PARAMETER_REDFLAG.filter(item => item.STATUS === status);
    }

    return { 
      status: "success", 
      message: "Success", 
      data: filteredData 
    };
  } catch (error) {
    console.error("Error fetching parameter redflag:", error);
    return { status: "error", message: "Failed to fetch data", data: [] };
  }
}

export async function getParameterRedflagOtorisasi() {
  try {
    // Simulate API delay
    await simulateDelay(500);

    return { 
      status: "success", 
      message: "Success", 
      data: [] // No pending otorisasi in demo
    };
  } catch (error) {
    console.error("Error fetching parameter redflag otorisasi:", error);
    return { status: "error", message: "Failed to fetch data", data: [] };
  }
}

export async function otorisasiParameterRedflag(action: "approve" | "reject") {
  try {
    // Simulate API delay
    await simulateDelay(500);

    return { 
      status: "success", 
      message: `Parameter redflag berhasil ${action === "approve" ? "diapprove" : "direject"}` 
    };
  } catch (error) {
    console.error("Error otorisasi parameter redflag:", error);
    return { status: "error", message: "Failed to process authorization" };
  }
}

export async function insertParameterRedflag(data: {
  passby_nominal_konsumtif: string;
  passby_jml_hari: string;
  passby_nominal_transaksi: string;
  pep_nominal_transaksi: string;
  nrt_nominal_transaksi: string;
  multi_dana_masuk: string;
  multi_dana_keluar: string;
  rbu_jml_pembukaan_rekening: string;
  rbu_jangka_waktu_penutupan: string;
  rds_saldo_mengendap_simpel: string;
  rds_saldo_mengendap_rdn: string;
  tun_nominal_transaksi_tunai: string;
  tun_jangka_waktu_transaksi: string;
  dor_nominal_transfer_masuk: string;
  dor_frekuensi: string;
  exceed_income_frekuensi_penyimpanan: string;
  exceed_income_jml_hari: string;
  tarik_setor_nominal_setoran: string;
  tarik_setor_nominal_tarikan: string;
  tarik_setor_nominal_filter_cbg: string;
  judol_deskripsi_transaksi: string;
  judol_jml_transaksi_debit: string;
  judol_jml_transaksi_kredit: string;
  judol_waktu: string | null;
  db_suspect_kategori_blacklist: string;
  db_suspect_keyword_keterangan: string;
}) {
  try {
    // Simulate API delay
    await simulateDelay(500);

    return { 
      status: "success", 
      message: "Parameter redflag berhasil disimpan" 
    };
  } catch (error) {
    console.error("Error inserting parameter redflag:", error);
    return { status: "error", message: "Failed to insert data" };
  }
}

// ==================== KODE TRANSAKSI ====================
export async function getParameterKodeTransaksi(redflag?: string) {
  try {
    // Simulate API delay
    await simulateDelay(500);

    // Filter by redflag if provided
    let filteredData = MOCK_PARAMETER_KODE_TRANSAKSI;
    if (redflag) {
      filteredData = MOCK_PARAMETER_KODE_TRANSAKSI.filter(item => item.JENIS_REDFLAG === redflag);
    }

    return { 
      status: "success", 
      message: "Success", 
      data: filteredData 
    };
  } catch (error) {
    console.error("Error fetching parameter kode transaksi:", error);
    return { status: "error", message: "Failed to fetch data", data: [] };
  }
}

export async function getParameterTransaksiUmum() {
  try {
    // Simulate API delay
    await simulateDelay(500);

    return { 
      status: "success", 
      message: "Success", 
      data: MOCK_PARAMETER_TRANSAKSI_UMUM 
    };
  } catch (error) {
    console.error("Error fetching parameter transaksi umum:", error);
    return { status: "error", message: "Failed to fetch data", data: [] };
  }
}

export async function updateParameterKodeTransaksi(data: {
  jenis_redflag: string;
  kodetran_masuk?: string;
  kodetran_keluar?: string;
  kodetran_setun?: string;
  kodetran_nonsetun?: string;
  kodetran_tartun?: string;
  kodetran_nontartun?: string;
}) {
  try {
    // Simulate API delay
    await simulateDelay(500);

    return { 
      status: "success", 
      message: "Parameter kode transaksi berhasil diupdate" 
    };
  } catch (error) {
    console.error("Error updating parameter kode transaksi:", error);
    return { status: "error", message: "Failed to update data" };
  }
}

// ==================== PRIORITAS ====================
export async function getParameterPrioritas() {
  try {
    // Simulate API delay
    await simulateDelay(500);

    return { 
      status: "success", 
      message: "Success", 
      data: MOCK_PARAMETER_PRIORITAS 
    };
  } catch (error) {
    console.error("Error fetching parameter prioritas:", error);
    return { status: "error", message: "Failed to fetch data", data: null };
  }
}

export async function getParameterPrioritasOtorisasi() {
  try {
    // Simulate API delay
    await simulateDelay(500);

    return { 
      status: "success", 
      message: "Success", 
      data: {
        status: "input",
        STATUS: "input",
        ...MOCK_PARAMETER_PRIORITAS
      }
    };
  } catch (error) {
    console.error("Error fetching parameter prioritas:", error);
    return { status: "error", message: "Failed to fetch data", data: null };
  }
}

export async function updateParameterPrioritas(data: {
  freq_redflag_perbulan: {
    high: string;
    low: string;
    medium: string;
  };
  freq_redflag_sama_perbulan: {
    high: string;
    low: string;
    medium: string;
  };
  redflag_list: {
    high: string;
    low: string;
    medium: string;
  };
}) {
  try {
    // Simulate API delay
    await simulateDelay(500);

    return { 
      status: "success", 
      message: "Parameter prioritas berhasil diupdate" 
    };
  } catch (error) {
    console.error("Error updating parameter prioritas:", error);
    return { status: "error", message: "Failed to update data" };
  }
}

export async function insertParameterPrioritas(data: {
  high: {
    freq_redflag_perbulan: string;
    freq_redflag_sama_perbulan: string;
    redflag_list: string;
  };
  medium: {
    freq_redflag_perbulan: string;
    freq_redflag_sama_perbulan: string;
    redflag_list: string;
  };
  low: {
    freq_redflag_perbulan: string;
    freq_redflag_sama_perbulan: string;
    redflag_list: string;
  };
  user_input: string;
}) {
  try {
    // Simulate API delay
    await simulateDelay(500);

    return { 
      status: "success", 
      message: "Parameter prioritas berhasil disimpan" 
    };
  } catch (error) {
    console.error("Error inserting parameter prioritas:", error);
    return { status: "error", message: "Failed to insert data" };
  }
}

export async function otorisasiParameterPrioritas(data: {
  action: "approve" | "reject";
  user_otor: string;
}) {
  try {
    // Simulate API delay
    await simulateDelay(500);

    return { 
      status: "success", 
      message: `Parameter prioritas berhasil ${data.action === "approve" ? "diapprove" : "direject"}` 
    };
  } catch (error) {
    console.error("Error otorisasi parameter prioritas:", error);
    return { status: "error", message: "Failed to process authorization" };
  }
}

// ==================== AKTIVASI ====================
export async function getParameterAktivasi() {
  try {
    // Simulate API delay
    await simulateDelay(500);

    return { 
      status: "success", 
      message: "Success", 
      data: MOCK_PARAMETER_AKTIVASI 
    };
  } catch (error) {
    console.error("Error fetching parameter aktivasi:", error);
    return { status: "error", message: "Failed to fetch data", data: null };
  }
}

export async function insertParameterAktivasi(data: {
  passby: string;
  pep: string;
  et: string;
  nrt: string;
  dorman: string;
  mtm: string;
  bop: string;
  rbu: string;
  rbu2: string;
  rds: string;
  tun: string;
  dor: string;
  exceed_income: string;
  tarik_setor: string;
  judol: string;
  db_suspect: string;
  db_teroris: string;
  trf_suspect: string;
  user_input: string;
}) {
  try {
    // Simulate API delay
    await simulateDelay(500);

    return { 
      status: "success", 
      message: "Parameter aktivasi berhasil disimpan" 
    };
  } catch (error) {
    console.error("Error inserting parameter aktivasi:", error);
    return { status: "error", message: "Failed to insert data" };
  }
}

export async function getParameterAktivasiOtorisasi() {
  try {
    // Simulate API delay
    await simulateDelay(500);

    return { 
      status: "success", 
      message: "Success", 
      data: {
        STATUS: "input",
        PASSBY: "ON",
        PEP: "ON",
        ET: "ON",
        NRT: "ON",
        DORMAN: "ON",
        MTM: "ON",
        BOP: "ON",
        RBU: "ON",
        RBU2: "ON",
        RDS: "ON",
        TUN: "ON",
        DOR: "ON",
        EXCEED_INCOME: "ON",
        TARIK_SETOR: "ON",
        JUDOL: "ON",
        DB_SUSPECT: "ON",
        DB_TERORIS: "ON",
        TRF_SUSPECT: "ON"
      }
    };
  } catch (error) {
    console.error("Error fetching parameter aktivasi otorisasi:", error);
    return { status: "error", message: "Failed to fetch data", data: null };
  }
}

export async function otorisasiParameterAktivasi(data: {
  action: "approve" | "reject";
  user_otor: string;
}) {
  try {
    // Simulate API delay
    await simulateDelay(500);

    return { 
      status: "success", 
      message: `Parameter aktivasi berhasil ${data.action === "approve" ? "diapprove" : "direject"}` 
    };
  } catch (error) {
    console.error("Error otorisasi parameter aktivasi:", error);
    return { status: "error", message: "Failed to process authorization" };
  }
}

// ==================== WATCHLIST ====================
export async function getParameterWatchlist() {
  try {
    // Simulate API delay
    await simulateDelay(500);

    return { 
      status: "success", 
      message: "Success", 
      data: MOCK_PARAMETER_WATCHLIST 
    };
  } catch (error) {
    console.error("Error fetching parameter watchlist:", error);
    return { status: "error", message: "Failed to fetch data", data: [] };
  }
}

export async function getListIndikator() {
  try {
    // Simulate API delay
    await simulateDelay(500);

    return { 
      status: "success", 
      message: "Success", 
      data: { 
        data: MOCK_INDIKATOR, 
        total: MOCK_INDIKATOR.length 
      } 
    };
  } catch (error) {
    console.error("Error fetching list indikator:", error);
    return { status: "error", message: "Failed to fetch data", data: { data: [], total: 0 } };
  }
}
