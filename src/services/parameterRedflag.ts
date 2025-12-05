// services/parameterRedflagService.ts

export async function getParameterRedflag(status?: string) {
  try {
    const res = await fetch("http://10.125.22.11:8080/api/setting/parameter-redflag", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ status }),
      cache: "no-store", // recommended to always fetch fresh data
    });

    return await res.json(); // return PHP response
  } catch (error) {
    console.error("Error fetching parameter redflag:", error);
    return { status: "error", message: "Failed to fetch data", data: [] };
  }
}

// services/parameterRedflagOtorisasiService.ts

export async function getParameterRedflagOtorisasi() {
  try {
    const res = await fetch("http://10.125.22.11:8080/api/setting/parameter-redflag-otorisasi", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({}),
      cache: "no-store", // always fetch fresh data
    });

    return await res.json(); // return PHP response
  } catch (error) {
    console.error("Error fetching parameter redflag otorisasi:", error);
    return { status: "error", message: "Failed to fetch data", data: [] };
  }
}

export async function otorisasiParameterRedflag(action: "approve" | "reject") {
  try {
    const res = await fetch("http://10.125.22.11:8080/api/setting/parameter-redflag-otorisasi-action", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ action }),
      cache: "no-store",
    });

    return await res.json(); // return PHP response
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
    const res = await fetch("http://10.125.22.11:8080/api/setting/parameter-redflag-hist-insert", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
      cache: "no-store",
    });

    return await res.json(); // return PHP response
  } catch (error) {
    console.error("Error inserting parameter redflag:", error);
    return { status: "error", message: "Failed to insert data" };
  }
}

// services/parameterKodeTransaksiService.ts

export async function getParameterKodeTransaksi(redflag?: string) {
  try {
    const res = await fetch("http://10.125.22.11:8080/api/setting/parameter-kode-transaksi", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ redflag }),
      cache: "no-store", // always fetch fresh data
    });

    return await res.json(); // return PHP response as is
  } catch (error) {
    console.error("Error fetching parameter kode transaksi:", error);
    return { status: "error", message: "Failed to fetch data", data: [] };
  }
}

// services/parameterTransaksiUmumService.ts

export async function getParameterTransaksiUmum() {
  try {
    const res = await fetch("http://10.125.22.11:8080/api/kode-transaksi-umum", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({}), // no filter, required for PHP input decode
      cache: "no-store", // always fetch fresh data
    });

    return await res.json(); // return PHP response
  } catch (error) {
    console.error("Error fetching parameter transaksi umum:", error);
    return { status: "error", message: "Failed to fetch data", data: [] };
  }
}

// services/updateParameterKodeTransaksiService.ts

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
    const res = await fetch("http://10.125.22.11:8080/api/setting/parameter-kode-transaksi-update", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
      cache: "no-store",
    });

    return await res.json(); // return PHP response
  } catch (error) {
    console.error("Error updating parameter kode transaksi:", error);
    return { status: "error", message: "Failed to update data" };
  }
}

// services/parameterPrioritasService.ts

export async function getParameterPrioritas() {
  try {
    const res = await fetch("http://10.125.22.11:8080/api/setting/parameter-prioritas", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      cache: "no-store", // always fetch fresh data
    });

    return await res.json(); // return PHP response
  } catch (error) {
    console.error("Error fetching parameter prioritas:", error);
    return { status: "error", message: "Failed to fetch data", data: null };
  }
}


// services/parameterPrioritasService.ts

export async function getParameterPrioritasOtorisasi() {
  try {
    const res = await fetch("http://10.125.22.11:8080/api/setting/parameter-prioritas-otorisasi", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      cache: "no-store", // always fetch fresh data
    });

    return await res.json(); // return PHP response
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
    const res = await fetch("http://10.125.22.11:8080/api/setting/parameter-prioritas", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
      cache: "no-store",
    });

    return await res.json(); // return PHP response
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
    const res = await fetch("http://10.125.22.11:8080/api/setting/parameter-prioritas-insert", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
      cache: "no-store",
    });

    return await res.json(); // return PHP response
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
    const res = await fetch("http://10.125.22.11:8080/api/setting/parameter-prioritas-otorisasi-action", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
      cache: "no-store",
    });

    return await res.json(); // return PHP response
  } catch (error) {
    console.error("Error otorisasi parameter prioritas:", error);
    return { status: "error", message: "Failed to process authorization" };
  }
}


// services/parameterAktivasiService.ts

export async function getParameterAktivasi() {
  try {
    const res = await fetch("http://10.125.22.11:8080/api/setting/parameter-aktivasi", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({}),
      cache: "no-store", // always fetch fresh data
    });

    return await res.json(); // return PHP response
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
    const res = await fetch("http://10.125.22.11:8080/api/setting/parameter-aktivasi-upsert", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
      cache: "no-store",
    });

    return await res.json(); // return PHP response
  } catch (error) {
    console.error("Error inserting parameter aktivasi:", error);
    return { status: "error", message: "Failed to insert data" };
  }
}


export async function getParameterAktivasiOtorisasi() {
  try {
    const res = await fetch("http://10.125.22.11:8080/api/setting/parameter-aktivasi-otorisasi", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({}),
      cache: "no-store", // always fetch fresh data
    });

    return await res.json(); // return PHP response
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
    const res = await fetch("http://10.125.22.11:8080/api/setting/parameter-aktivasi-otorisasi-action", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
      cache: "no-store",
    });

    return await res.json(); // return PHP response
  } catch (error) {
    console.error("Error otorisasi parameter aktivasi:", error);
    return { status: "error", message: "Failed to process authorization" };
  }
}


export async function getParameterWatchlist() {
  try {
    const res = await fetch("http://10.125.22.11:8080/api/setting/parameter-watchlist", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({}),
      cache: "no-store",
    });

    return await res.json(); // return PHP response
  } catch (error) {
    console.error("Error fetching parameter watchlist:", error);
    return { status: "error", message: "Failed to fetch data", data: [] };
  }
}

export async function getListIndikator() {
  try {
    const res = await fetch("http://10.125.22.11:8080/api/setting/list-indikator", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({}),
      cache: "no-store",
    });

    return await res.json(); // return PHP response
  } catch (error) {
    console.error("Error fetching list indikator:", error);
    return { status: "error", message: "Failed to fetch data", data: { data: [], total: 0 } };
  }
}
