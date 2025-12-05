export const getLogActivity = async () => {
  try {
    const response = await fetch("http://10.125.9.43/estr/get_log_activity", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || "Failed to fetch log activity.");
    }

    return await response.json();
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
    const response = await fetch("http://10.125.9.43/estr/log_activity", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(log),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || "Failed to insert log.");
    }

    return await response.json(); // { status: "success", message: "..." }
  } catch (error) {
    throw error;
  }
};
