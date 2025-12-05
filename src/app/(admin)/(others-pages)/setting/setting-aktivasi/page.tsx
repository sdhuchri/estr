import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import SettingAktivasiClient from "./SettingAktivasiClient";

interface AktivasiData {
  passby: boolean;
  pep: boolean;
  et: boolean;
  nrt: boolean;
  dorman: boolean;
  mtm: boolean;
  bop: boolean;
  rbu: boolean;
  rbu2: boolean;
  rds: boolean;
  tun: boolean;
  dor: boolean;
  exceedIncome: boolean;
  tarikSetor: boolean;
  judol: boolean;
  dbSuspect: boolean;
  dbTeroris: boolean;
  trfSuspect: boolean;
}

// Server Component for data fetching
async function SettingAktivasiData() {
  const cookieStore = await cookies();
  const userId = cookieStore.get("userId")?.value;

  if (!userId) {
    redirect("/signin");
  }

  // Default activation data - will be replaced with API call
  let aktivasiData: AktivasiData = {
    passby: true,
    pep: false,
    et: false,
    nrt: false,
    dorman: false,
    mtm: false,
    bop: false,
    rbu: false,
    rbu2: false,
    rds: false,
    tun: false,
    dor: false,
    exceedIncome: false,
    tarikSetor: false,
    judol: false,
    dbSuspect: false,
    dbTeroris: false,
    trfSuspect: false
  };

  try {
    const { getParameterAktivasi } = await import("@/services/parameterRedflag");
    const response = await getParameterAktivasi();
    
    if (response.status === "success" && response.data) {
      const apiData = response.data;
      
      // Map API response to aktivasiData (ON = true, OFF = false)
      aktivasiData = {
        passby: apiData.PASSBY === "ON",
        pep: apiData.PEP === "ON",
        et: apiData.ET === "ON",
        nrt: apiData.NRT === "ON",
        dorman: apiData.DORMAN === "ON",
        mtm: apiData.MTM === "ON",
        bop: apiData.BOP === "ON",
        rbu: apiData.RBU === "ON",
        rbu2: apiData.RBU2 === "ON",
        rds: apiData.RDS === "ON",
        tun: apiData.TUN === "ON",
        dor: apiData.DOR === "ON",
        exceedIncome: apiData.EXCEED_INCOME === "ON",
        tarikSetor: apiData.TARIK_SETOR === "ON",
        judol: apiData.JUDOL === "ON",
        dbSuspect: apiData.DB_SUSPECT === "ON",
        dbTeroris: apiData.DB_TERORIS === "ON",
        trfSuspect: apiData.TRF_SUSPECT === "ON"
      };
    }
  } catch (error) {
    console.error("Error fetching aktivasi data:", error);
  }

  return <SettingAktivasiClient initialData={aktivasiData} userId={userId} />;
}

// Main page component
export default function SettingAktivasiPage() {
  return (
    <SettingAktivasiData />
  );
}

// Add metadata
export const metadata = {
  title: "STR | Setting Aktivasi",
  description: "Kelola aktivasi parameter deteksi red flag"
};
