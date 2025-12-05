import { Suspense } from "react";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { getManualKepOpr } from "@/services/manualKep";
import ManualKepOperatorClient from "./ManualKepOperatorClient";
import DataTableSkeleton from "@/components/skeletons/DataTableSkeleton";
import FadeInWrapper from "@/components/common/FadeInWrapper";

interface ManualKepOperatorData {
  NO: string;
  ID_LAPORAN: string;
  INDIKATOR: string;
  NO_CIF: string;
  NO_REK: string;
  NAMA_NASABAH: string;
  KETERANGAN: string;
  CABANG: string;
  CABANG_INDUK: string | null;
  KET_CABANG_OPR: string | null;
  KET_CABANG_SPV: string | null;
  KET_KEPATUHAN: string | null;
  TGL_HUB_NASABAH: string | null;
  JAM_HUB_NASABAH: string;
  STATUS: string;
  TANGGAL_LAPORAN: string;
  TANGGAL_INPUT: string;
  TANGGAL_OTOR_CSO: string | null;
  TANGGAL_OTOR_OPR_KEP: string | null;
  TANGGAL_OTOR_SPV_KEP: string | null;
  INPUT_BY_CBG: string;
  OTOR_BY_CBG: string | null;
  OTOR_BY_KEP_OPR: string | null;
  OTOR_BY_KEP_SPV: string | null;
  REJECT_BY: string;
  TANGGAL_REJECT: string;
  ALASAN_REJECT: string;
  STATUS_REJECT: string;
  TRANSAKSI_MENCURIGAKAN: string | null;
}

// Server Component for data fetching
async function ManualKepOperatorData() {
  const cookieStore = await cookies();
  const userId = cookieStore.get("userId")?.value;

  if (!userId) {
    redirect("/signin");
  }

  let data: ManualKepOperatorData[] = [];

  try {

    const response = await getManualKepOpr();
    if (response.status === "success" && response.data) {
      data = response.data;
    }
  } catch (error) {
    console.error("Error fetching data:", error);
    // Return empty data on error, let client handle error display
  }

  return (
    <FadeInWrapper>
      <ManualKepOperatorClient initialData={data} />
    </FadeInWrapper>
  );
}

// Main page component with PPR
export default function ManualKepOperatorPage() {
  return (
    <Suspense fallback={
      <DataTableSkeleton
        rows={8}
        columns={6}
        showActions={true}
        showTitleDescription={true}
        title="Manual Kepatuhan Operator"
        description="Kelola data laporan manual kepatuhan operator"
      />
    }>
      <ManualKepOperatorData />
    </Suspense>
  );
}

// Add metadata
export const metadata = {
  title: "STR | Manual Kepatuhan Operator",
  description: "Kelola data laporan manual kepatuhan operator"
};