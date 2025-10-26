
export async function getManualKepOpr() {
  try {
    const res = await fetch("http://10.125.9.43/new_estr/manual_kep_opr.php", {
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
    const res = await fetch("http://10.125.9.43/new_estr/manual_kep_spv.php", {
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
