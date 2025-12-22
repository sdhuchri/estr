// services/manualKep.ts
import { MOCK_MANUAL_KEP_OPR, MOCK_MANUAL_KEP_SPV, simulateDelay } from "@/data/mockData";

export async function getManualKepOpr() {
  try {
    // Simulate API delay
    await simulateDelay(500);

    return { 
      status: "success", 
      message: "Success", 
      data: MOCK_MANUAL_KEP_OPR 
    };
  } catch (error) {
    console.error("Error fetching manual kep opr:", error);
    return { status: "error", message: "Failed to fetch data", data: [] };
  }
}


export async function getManualKepSpv() {
  try {
    // Simulate API delay
    await simulateDelay(500);

    return { 
      status: "success", 
      message: "Success", 
      data: MOCK_MANUAL_KEP_SPV 
    };
  } catch (error) {
    console.error("Error fetching manual kep spv:", error);
    return { status: "error", message: "Failed to fetch data", data: [] };
  }
}


export async function otorisasiManualKep(data: {
  no: string;
  ket_kepatuhan: string;
  action: "approve" | "reject" | "simpan";
  otor_by_kep_opr: string;
  alasan_reject?: string;
}) {
  try {
    // Simulate API delay
    await simulateDelay(500);

    return { 
      status: "success", 
      message: `Data berhasil ${data.action === "approve" ? "diapprove" : data.action === "reject" ? "direject" : "disimpan"}`, 
      data: null 
    };
  } catch (error) {
    console.error("Error otorisasi manual kep:", error);
    return { status: "error", message: "Failed to process action", data: null };
  }
}

export async function otorisasiManualKepSpv(data: {
  no: string;
  action: "approve" | "reject";
  otor_by_kep_spv: string;
}) {
  try {
    // Simulate API delay
    await simulateDelay(500);

    return { 
      status: "success", 
      message: `Data berhasil ${data.action === "approve" ? "diapprove" : "direject"}`, 
      data: null 
    };
  } catch (error) {
    console.error("Error otorisasi manual kep supervisor:", error);
    return { status: "error", message: "Failed to process action", data: null };
  }
}
