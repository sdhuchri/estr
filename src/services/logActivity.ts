import { simulateDelay } from "@/data/mockData";

export const getLogActivity = async () => {
  try {
    // Simulate API delay
    await simulateDelay(500);

    // Return mock log activity data
    return {
      status: "success",
      message: "Success",
      data: [
        {
          user_id: "demo",
          action: "LOGIN",
          url: "/signin",
          kode_cabang: "001",
          nama_cabang: "Kantor Pusat Jakarta",
          keterangan: "User logged in",
          timestamp: "2025-01-10 10:30:00"
        },
        {
          user_id: "demo",
          action: "VIEW",
          url: "/manual-cabang/to-do-list",
          kode_cabang: "001",
          nama_cabang: "Kantor Pusat Jakarta",
          keterangan: "Viewed manual cabang todo list",
          timestamp: "2025-01-10 10:35:00"
        }
      ]
    };
  } catch (error) {
    throw error;
  }
};


export interface LogEntry {
  user_id: string;
  action: string;
  url: string;
  kode_cabang: string;
  nama_cabang: string;
  keterangan: string;
}

export const insertLogActivity = async (log: LogEntry) => {
  try {
    // Simulate API delay
    await simulateDelay(300);

    console.log("Log activity:", log);

    return { 
      status: "success", 
      message: "Log activity berhasil disimpan" 
    };
  } catch (error) {
    throw error;
  }
};
