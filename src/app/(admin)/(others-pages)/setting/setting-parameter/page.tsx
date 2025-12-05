
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { getParameterRedflag } from "@/services/parameterRedflag";
import SettingParameterClient from "./SettingParameterClient";

interface ParameterRedflagResponse {
  NO: string;
  PASSBY_NOMINAL_KONSUMTIF: string;
  PASSBY_JML_HARI: string;
  PASSBY_NOMINAL_TRANSAKSI: string;
  PEP_NOMINAL_TRANSAKSI: string;
  NRT_NOMINAL_TRANSAKSI: string;
  MULTI_DANA_MASUK: string;
  MULTI_DANA_KELUAR: string;
  RBU_JML_PEMBUKAAN_REKENING: string;
  RBU_JANGKA_WAKTU_PENUTUPAN: string;
  RDS_SALDO_MENGENDAP_SIMPEL: string;
  RDS_SALDO_MENGENDAP_RDN: string;
  TUN_NOMINAL_TRANSAKSI_TUNAI: string;
  TUN_JANGKA_WAKTU_TRANSAKSI: string;
  DOR_NOMINAL_TRANSFER_MASUK: string;
  DOR_FREKUENSI: string;
  EXCEED_INCOME_FREKUENSI_PENYIMPANAN: string;
  EXCEED_INCOME_JML_HARI: string;
  TARIK_SETOR_NOMINAL_SETORAN: string;
  TARIK_SETOR_NOMINAL_TARIKAN: string;
  TARIK_SETOR_NOMINAL_FILTER_CBG: string;
  JUDOL_DESKRIPSI_TRANSAKSI: string;
  JUDOL_JML_TRANSAKSI_DEBIT: string;
  JUDOL_JML_TRANSAKSI_KREDIT: string;
  JUDOL_WAKTU: string | null;
  DB_SUSPECT_KATEGORI_BLACKLIST: string;
  DB_SUSPECT_KEYWORD_KETERANGAN: string;
  TGL_UPDATE: string;
  STATUS: string;
}

interface ParameterData {
  // Passby
  persentaseNominalKumulatif: string;
  jumlahHari: string;
  nominalTransaksi: string;

  // RBU
  jumlahPembukaanRekening: string;

  // RBU2
  maksimalJangkaWaktuPenutupan: string;

  // TUN
  nominalTransaksiTunai: string;
  jangkaWaktuBerulangTransaksiTunai: string;

  // RDS
  saldoMengendapRekeningSimple: string;
  saldoMengendapRekeningRDN: string;

  // Multi Transfer
  jumlahRekeningPerHariPemberiData: string;
  jumlahRekeningPerHariPenerimaData: string;

  // DOR
  nominalTransferMasuk: string;
  frekuensiPenarikanATM: string;

  // Exceed Income
  frekuensiPenyimpanan: string;
  jumlahHariExcludeIncome: string;

  // Tarik Setor
  nominalSetoran: string;
  nominalTarikan: string;
  filterCabang: string[];  // Changed to array for multiple selections

  // Judol
  deskripsiTransaksi: string;
  jumlahTransaksiDebit: string;
  jumlahTransaksiKredit: string;
  waktuJudol: string;

  // Database Suspect
  kategoriBlacklist: string[];
  keywordKeterangan: string;
}

// Helper function to format number with dots as thousand separators
const formatNumber = (value: string) => {
  const numericValue = value.replace(/\D/g, '');
  return numericValue.replace(/\B(?=(\d{3})+(?!\d))/g, '.');
};

// Server Component for data fetching
async function SettingParameterData() {
  const cookieStore = await cookies();
  const userId = cookieStore.get("userId")?.value;

  if (!userId) {
    redirect("/signin");
  }

  let parameters: ParameterData = {
    persentaseNominalKumulatif: "",
    jumlahHari: "",
    nominalTransaksi: "",
    jumlahPembukaanRekening: "",
    maksimalJangkaWaktuPenutupan: "",
    nominalTransaksiTunai: "",
    jangkaWaktuBerulangTransaksiTunai: "",
    saldoMengendapRekeningSimple: "",
    saldoMengendapRekeningRDN: "",
    jumlahRekeningPerHariPemberiData: "",
    jumlahRekeningPerHariPenerimaData: "",
    nominalTransferMasuk: "",
    frekuensiPenarikanATM: "",
    frekuensiPenyimpanan: "",
    jumlahHariExcludeIncome: "",
    nominalSetoran: "",
    nominalTarikan: "",
    filterCabang: [],
    deskripsiTransaksi: "",
    jumlahTransaksiDebit: "",
    jumlahTransaksiKredit: "",
    waktuJudol: "",
    kategoriBlacklist: [],
    keywordKeterangan: ""
  };

  try {
    
    const response = await getParameterRedflag("1");
    if (response.status === "success" && response.data && response.data.length > 0) {
      const apiData = response.data[0] as ParameterRedflagResponse;

      // Map API data to form state
      parameters = {
        persentaseNominalKumulatif: apiData.PASSBY_NOMINAL_KONSUMTIF || "",
        jumlahHari: apiData.PASSBY_JML_HARI || "",
        nominalTransaksi: formatNumber(apiData.PASSBY_NOMINAL_TRANSAKSI || ""),
        jumlahPembukaanRekening: apiData.RBU_JML_PEMBUKAAN_REKENING || "",
        maksimalJangkaWaktuPenutupan: apiData.RBU_JANGKA_WAKTU_PENUTUPAN || "",
        nominalTransaksiTunai: formatNumber(apiData.TUN_NOMINAL_TRANSAKSI_TUNAI || ""),
        jangkaWaktuBerulangTransaksiTunai: apiData.TUN_JANGKA_WAKTU_TRANSAKSI || "",
        saldoMengendapRekeningSimple: formatNumber(apiData.RDS_SALDO_MENGENDAP_SIMPEL || ""),
        saldoMengendapRekeningRDN: formatNumber(apiData.RDS_SALDO_MENGENDAP_RDN || ""),
        jumlahRekeningPerHariPemberiData: apiData.MULTI_DANA_MASUK || "",
        jumlahRekeningPerHariPenerimaData: apiData.MULTI_DANA_KELUAR || "",
        nominalTransferMasuk: formatNumber(apiData.DOR_NOMINAL_TRANSFER_MASUK || ""),
        frekuensiPenarikanATM: apiData.DOR_FREKUENSI || "",
        frekuensiPenyimpanan: apiData.EXCEED_INCOME_FREKUENSI_PENYIMPANAN || "",
        jumlahHariExcludeIncome: apiData.EXCEED_INCOME_JML_HARI || "",
        nominalSetoran: formatNumber(apiData.TARIK_SETOR_NOMINAL_SETORAN || ""),
        nominalTarikan: formatNumber(apiData.TARIK_SETOR_NOMINAL_TARIKAN || ""),
        filterCabang: apiData.TARIK_SETOR_NOMINAL_FILTER_CBG ? apiData.TARIK_SETOR_NOMINAL_FILTER_CBG.split(',').filter(v => v) : [],
        deskripsiTransaksi: apiData.JUDOL_DESKRIPSI_TRANSAKSI || "",
        jumlahTransaksiDebit: formatNumber(apiData.JUDOL_JML_TRANSAKSI_DEBIT || ""),
        jumlahTransaksiKredit: formatNumber(apiData.JUDOL_JML_TRANSAKSI_KREDIT || ""),
        waktuJudol: apiData.JUDOL_WAKTU || "",
        kategoriBlacklist: apiData.DB_SUSPECT_KATEGORI_BLACKLIST ? apiData.DB_SUSPECT_KATEGORI_BLACKLIST.split(',').filter(v => v) : [],
        keywordKeterangan: apiData.DB_SUSPECT_KEYWORD_KETERANGAN || ""
      };
    }
  } catch (error) {
    console.error("Error fetching parameter data:", error);
    // Return empty data on error, let client handle error display
  }

  return <SettingParameterClient initialData={parameters} />;
}

// Main page component with PPR
export default function SettingParameterPage() {
  return (
    <SettingParameterData />
  );
}

// Add metadata
export const metadata = {
  title: "STR | Setting Parameter",
  description: "Kelola parameter sistem untuk deteksi transaksi mencurigakan"
};