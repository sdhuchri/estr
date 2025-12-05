// services/nasabahService.ts

export async function getListRejectTidakAktif(cabang: string) {
  try {
    const res = await fetch("http://10.125.22.11:8080/api/list-reject/tidak-aktif", {
      method: "POST",
      headers: { 
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ cabang }),
      cache: "no-store", // optional (recommended for fresh data)
    });

    return await res.json(); // directly return PHP response
  } catch (error) {
    console.error("Error fetching nasabah:", error);
    return { status: "error", message: "Failed to fetch data", data: [] };
  }
}


// services/nasabahService.ts

export async function getListRejectAktif(cabang: string) {
  try {
    const res = await fetch("http://10.125.22.11:8080/api/list-reject/aktif", {
      method: "POST",
      headers: { 
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ cabang }),
      cache: "no-store", // optional (recommended for fresh data)
    });

    return await res.json(); // directly return PHP response
  } catch (error) {
    console.error("Error fetching nasabah:", error);
    return { status: "error", message: "Failed to fetch data", data: [] };
  }
}

export async function updateStatusListReject(no: string[]) {
  try {
    const res = await fetch("http://10.125.22.11:8080/api/list-reject/update-status", {
      method: "POST",
      headers: { 
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ no }),
      cache: "no-store",
    });

    return await res.json();
  } catch (error) {
    console.error("Error updating status:", error);
    return { status: "error", message: "Failed to update status", data: null };
  }
}
