import { Suspense } from "react";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { getParameterKodeTransaksi, getParameterTransaksiUmum } from "@/services/parameterRedflag";
import SettingKodeTransaksiClient from "./SettingKodeTransaksiClient";

interface ParameterKodeTransaksiResponse {
  NO: string;
  REDFLAG: string;
  KODE_TRAN_MASUK: string | null;
  KODE_TRAN_KELUAR: string | null;
  KODE_TRAN_EXCLUE: string | null;
  KODE_TRAN_SETUN: string | null;
  KODE_TRAN_NONSETUN: string | null;
  KODE_TRAN_TARTUN: string | null;
  KODE_TRAN_NONTARTUN: string | null;
  TGL_UPDATE: string;
  STATUS: string;
}

interface ParameterTransaksiUmumResponse {
  KODE_TRANSAKSI: string;
  KETERANGAN: string;
}

interface TransactionCodeData {
  jenisRedflag: string;
  kodeTransaksiMasuk: string;
  kodeTransaksiKeluar: string;
  kodeTransaksiSelorTunai: string;
  kodeTransaksiSelorNonTunai: string;
  kodeTransaksiTarikTunai: string;
  kodeTransaksiTarikNonTunai: string;
}

// Server Component for data fetching
async function SettingKodeTransaksiData() {
  const cookieStore = await cookies();
  const userId = cookieStore.get("userId")?.value;

  if (!userId) {
    redirect("/signin");
  }

  let transactionCodes: TransactionCodeData = {
    jenisRedflag: "",
    kodeTransaksiMasuk: "",
    kodeTransaksiKeluar: "",
    kodeTransaksiSelorTunai: "",
    kodeTransaksiSelorNonTunai: "",
    kodeTransaksiTarikTunai: "",
    kodeTransaksiTarikNonTunai: ""
  };
  let availableRedFlags: string[] = [];
  let validTransactionCodes: string[] = [];

  try {
    
    // Fetch transaction codes data
    const response = await getParameterKodeTransaksi();
    if (response.status === "success" && response.data && response.data.length > 0) {
      const apiData = response.data as ParameterKodeTransaksiResponse[];

      // Get available red flags for dropdown
      const redFlags = apiData.map((item: ParameterKodeTransaksiResponse) => item.REDFLAG.toUpperCase());
      availableRedFlags = redFlags;

      // Set first red flag as default and find its corresponding data
      const firstRedFlag = redFlags[0];
      const firstData = apiData.find((item: ParameterKodeTransaksiResponse) => 
        item.REDFLAG.toUpperCase() === firstRedFlag
      ) || apiData[0];

      transactionCodes = {
        jenisRedflag: firstRedFlag,
        kodeTransaksiMasuk: firstData.KODE_TRAN_MASUK || "",
        kodeTransaksiKeluar: firstData.KODE_TRAN_KELUAR || "",
        kodeTransaksiSelorTunai: firstData.KODE_TRAN_SETUN || "",
        kodeTransaksiSelorNonTunai: firstData.KODE_TRAN_NONSETUN || "",
        kodeTransaksiTarikTunai: firstData.KODE_TRAN_TARTUN || "",
        kodeTransaksiTarikNonTunai: firstData.KODE_TRAN_NONTARTUN || ""
      };
    }

    // Fetch valid transaction codes for validation
    const validCodesResponse = await getParameterTransaksiUmum();
    if (validCodesResponse.status === "success" && validCodesResponse.data) {
      const codes = validCodesResponse.data.map((item: ParameterTransaksiUmumResponse) => item.KODE_TRANSAKSI);
      validTransactionCodes = codes;
    }
  } catch (error) {
    console.error("Error fetching transaction codes:", error);
    // Return empty data on error, let client handle error display
  }

  return (
    <SettingKodeTransaksiClient 
      initialData={transactionCodes}
      availableRedFlags={availableRedFlags}
      validTransactionCodes={validTransactionCodes}
    />
  );
}

// Main page component with PPR
export default function SettingKodeTransaksiPage() {
  return (
    <SettingKodeTransaksiData />
  );
}

// Add metadata
export const metadata = {
  title: "STR | Setting Kode Transaksi",
  description: "Kelola kode transaksi untuk deteksi red flag"
};