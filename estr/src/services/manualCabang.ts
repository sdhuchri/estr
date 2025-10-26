export async function getManualCabangEdit(cabang: string) {
  try {
    const res = await fetch("http://10.125.9.43/new_estr/manual_cabang_edit.php", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ cabang }),
    });

    return await res.json(); // directly return whatever PHP sends
  } catch (error) {
    console.error("Error fetching nasabah:", error);
    return { status: "error", message: "Failed to fetch data", data: [] };
  }
}


// services/updateNasabahTransaksiMencurigakanService.ts

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
    const res = await fetch(
      "http://10.125.9.43/new_estr/update_manual_cabang.php",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
        cache: "no-store", // always refresh
      }
    );

    return await res.json();
  } catch (error) {
    console.error("Error updating nasabah transaksi mencurigakan:", error);
    return { status: "error", message: "Failed to update data" };
  }
}
