// services/parameterRedflagService.ts

export async function getParameterRedflag(status?: string) {
  try {
    const res = await fetch("http://10.125.9.43/new_estr/parameter_redflag.php", {
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

// services/parameterKodeTransaksiService.ts

export async function getParameterKodeTransaksi(redflag?: string) {
  try {
    const res = await fetch("http://10.125.9.43/new_estr/parameter_kode_transaksi.php", {
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
    const res = await fetch("http://10.125.9.43/new_estr/param_kode_tran.php", {
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
