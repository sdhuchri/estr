
export async function getManualKepOpr() {
  try {
    const res = await fetch("http://10.125.22.11:8080/api/manual-kep/opr", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({}), // required for php://input decode
      cache: "no-store", // ensure always fresh data
    });

    return await res.json(); // return whatever PHP sends
  } catch (error) {
    console.error("Error fetching nasabah transaksi mencurigakan:", error);
    return { status: "error", message: "Failed to fetch data", data: [] };
  }
}


export async function getManualKepSpv() {
  try {
    const res = await fetch("http://10.125.22.11:8080/api/manual-kep/spv", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({}), // required for php://input decode
      cache: "no-store", // ensure always fresh data
    });

    return await res.json(); // return whatever PHP sends
  } catch (error) {
    console.error("Error fetching nasabah transaksi mencurigakan:", error);
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
    const res = await fetch("http://10.125.22.11:8080/api/manual-kep/otorisasi", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
      cache: "no-store",
    });

    return await res.json();
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
    const res = await fetch("http://10.125.22.11:8080/api/manual-kep/otorisasi-spv", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
      cache: "no-store",
    });

    return await res.json();
  } catch (error) {
    console.error("Error otorisasi manual kep supervisor:", error);
    return { status: "error", message: "Failed to process action", data: null };
  }
}
