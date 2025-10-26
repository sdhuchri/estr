// services/nasabahService.ts

export async function getListRejectTidakAktif(cabang: string) {
  try {
    const res = await fetch("http://10.125.9.43/new_estr/list_reject_tidak_aktif.php", {
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
    const res = await fetch("http://10.125.9.43/new_estr/list_reject_aktif.php", {
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
