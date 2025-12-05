// services/manualCabangService.ts

const API_BASE_URL = "http://10.125.22.11:8080";

// ==================== GET MANUAL CABANG EDIT ====================
export async function getManualCabangEdit(cabang: string) {
  try {
    const res = await fetch(`${API_BASE_URL}/api/manual-cabang/todo`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ cabang }),
    });
    return await res.json();
  } catch (error) {
    console.error("Error fetching nasabah:", error);
    return { status: "error", message: "Failed to fetch data", data: [] };
  }
}

// ==================== UPDATE MANUAL CABANG ====================
export async function updateManualCabang(data: {
  penjelasan: string;
  tgl_hub: string;
  jam: string;
  trans_mencurigakan: string;
  id_laporan: string;
  indikator: string;
  no_cif: string;
}) {
  try {
    const res = await fetch(`${API_BASE_URL}/api/manual-cabang/update`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
      cache: "no-store",
    });
    return await res.json();
  } catch (error) {
    console.error("Error updating nasabah transaksi mencurigakan:", error);
    return { status: "error", message: "Failed to update data" };
  }
}

// ==================== UPDATE TODO ====================
export async function updateTodo(data: {
  no: string;
  tgl_hub_nasabah: string;
  jam_hub_nasabah: string;
  trans_mencurigakan: string;
  ket_cabang_opr: string;
  input_by_cbg: string;
}) {
  try {
    const res = await fetch(`${API_BASE_URL}/api/manual-cabang/update-todo`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
      cache: "no-store",
    });
    return await res.json();
  } catch (error) {
    console.error("Error updating todo:", error);
    return { status: "error", message: "Failed to update todo" };
  }
}

// ==================== INPUT MANUAL CABANG ====================
export async function inputManualCabang(data: {
  indikator: string;
  no_cif: string;
  no_rek: string;
  nama_nasabah: string;
  keterangan: string;
  cabang: string;
  cabang_induk: string;
  ket_cabang_opr: string;
  ket_cabang_spv: string;
  ket_kepatuhan: string;
  tgl_hub_nasabah: string;
  jam_hub_nasabah: string;
  input_by_cbg: string;
  transaksi_mencurigakan: string;
  tenggat: string;
  skala: string;
  keterangan_status: string;
}) {
  try {
    const res = await fetch(`${API_BASE_URL}/api/manual-cabang/input-manual`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
      cache: "no-store",
    });
    return await res.json();
  } catch (error) {
    console.error("Error input manual cabang:", error);
    return { status: "error", message: "Failed to input manual cabang" };
  }
}

// ==================== GET TRACKING ====================
export async function getManualCabangTracking(cabang: string) {
  try {
    const res = await fetch(`${API_BASE_URL}/api/manual-cabang/tracking`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ cabang }),
      cache: "no-store",
    });
    return await res.json();
  } catch (error) {
    console.error("Error fetching tracking data:", error);
    return { status: "error", message: "Failed to fetch tracking data", data: [] };
  }
}

// ==================== GET OTORISASI ====================
export async function getManualCabangOtorisasi(cabang: string) {
  try {
    const res = await fetch(`${API_BASE_URL}/api/manual-cabang/get-otorisasi`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ cabang }),
      cache: "no-store",
    });
    return await res.json();
  } catch (error) {
    console.error("Error fetching otorisasi data:", error);
    return { status: "error", message: "Failed to fetch otorisasi data", data: [] };
  }
}

// ==================== OTORISASI APPROVE/REJECT ====================
export async function otorisasiManualCabang(data: {
  no: string;
  ket_cabang_spv: string;
  otor_by_cbg: string;
  action: "approve" | "reject";
}) {
  try {
    const res = await fetch(`${API_BASE_URL}/api/manual-cabang/otorisasi`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
      cache: "no-store",
    });
    return await res.json();
  } catch (error) {
    console.error("Error processing otorisasi:", error);
    return { status: "error", message: "Failed to process otorisasi" };
  }
}

// ==================== HELPER FUNCTIONS ====================
/**
 * Validasi data updateTodo sebelum dikirim ke API
 */
export function validateUpdateTodoData(data: {
  no: string;
  tgl_hub_nasabah: string;
  jam_hub_nasabah: string;
  trans_mencurigakan: string;
  ket_cabang_opr: string;
  input_by_cbg: string;
}): true | string {
  if (!data.no || data.no.trim() === "") {
    return "Field 'no' wajib diisi";
  }
  if (!data.input_by_cbg || data.input_by_cbg.trim() === "") {
    return "Field 'input_by_cbg' wajib diisi";
  }
  return true;
}