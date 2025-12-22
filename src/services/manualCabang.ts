// services/manualCabangService.ts
import { 
  MOCK_MANUAL_CABANG_TODO, 
  MOCK_MANUAL_CABANG_TRACKING, 
  MOCK_MANUAL_CABANG_OTORISASI,
  simulateDelay 
} from "@/data/mockData";

// ==================== GET MANUAL CABANG EDIT ====================
export async function getManualCabangEdit(cabang: string) {
  try {
    // Simulate API delay
    await simulateDelay(500);

    return { 
      status: "success", 
      message: "Success", 
      data: MOCK_MANUAL_CABANG_TODO 
    };
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
    // Simulate API delay
    await simulateDelay(500);

    return { 
      status: "success", 
      message: "Data berhasil diupdate" 
    };
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
    // Simulate API delay
    await simulateDelay(500);

    return { 
      status: "success", 
      message: "Todo berhasil diupdate" 
    };
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
    // Simulate API delay
    await simulateDelay(500);

    return { 
      status: "success", 
      message: "Data berhasil disimpan" 
    };
  } catch (error) {
    console.error("Error input manual cabang:", error);
    return { status: "error", message: "Failed to input manual cabang" };
  }
}

// ==================== GET TRACKING ====================
export async function getManualCabangTracking(cabang: string) {
  try {
    // Simulate API delay
    await simulateDelay(500);

    return { 
      status: "success", 
      message: "Success", 
      data: MOCK_MANUAL_CABANG_TRACKING 
    };
  } catch (error) {
    console.error("Error fetching tracking data:", error);
    return { status: "error", message: "Failed to fetch tracking data", data: [] };
  }
}

// ==================== GET OTORISASI ====================
export async function getManualCabangOtorisasi(cabang: string) {
  try {
    // Simulate API delay
    await simulateDelay(500);

    return { 
      status: "success", 
      message: "Success", 
      data: MOCK_MANUAL_CABANG_OTORISASI 
    };
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
    // Simulate API delay
    await simulateDelay(500);

    return { 
      status: "success", 
      message: `Data berhasil ${data.action === "approve" ? "diapprove" : "direject"}` 
    };
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