// services/listReject.ts
import { MOCK_LIST_REJECT_AKTIF, simulateDelay } from "@/data/mockData";

export async function getListRejectTidakAktif(cabang: string) {
  try {
    // Simulate API delay
    await simulateDelay(500);

    // Return empty array for tidak aktif (inactive rejects)
    return { 
      status: "success", 
      message: "Success", 
      data: [] 
    };
  } catch (error) {
    console.error("Error fetching list reject tidak aktif:", error);
    return { status: "error", message: "Failed to fetch data", data: [] };
  }
}


export async function getListRejectAktif(cabang: string) {
  try {
    // Simulate API delay
    await simulateDelay(500);

    // Filter by cabang if not "999"
    let filteredData = MOCK_LIST_REJECT_AKTIF;
    if (cabang !== "999") {
      filteredData = MOCK_LIST_REJECT_AKTIF.filter(item => item.CABANG === cabang);
    }

    return { 
      status: "success", 
      message: "Success", 
      data: filteredData 
    };
  } catch (error) {
    console.error("Error fetching list reject aktif:", error);
    return { status: "error", message: "Failed to fetch data", data: [] };
  }
}

export async function updateStatusListReject(no: string[]) {
  try {
    // Simulate API delay
    await simulateDelay(500);

    return { 
      status: "success", 
      message: "Status berhasil diupdate", 
      data: null 
    };
  } catch (error) {
    console.error("Error updating status:", error);
    return { status: "error", message: "Failed to update status", data: null };
  }
}
