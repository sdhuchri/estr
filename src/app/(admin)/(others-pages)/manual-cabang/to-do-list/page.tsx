import { Suspense } from "react";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { getManualCabangEdit } from "@/services/manualCabang";
import ManualCabangToDoListClient from "./ManualCabangToDoListClient";
import DataTableSkeleton from "@/components/skeletons/DataTableSkeleton";
import FadeInWrapper from "@/components/common/FadeInWrapper";


interface ManualCabangData {
  NO: string;
  ID_LAPORAN: string;
  INDIKATOR: string;
  NO_CIF: string;
  NO_REK: string;
  NAMA_NASABAH: string;
  KETERANGAN: string;
  KETERANGAN_STATUS: string | null;
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
  TENGGAT: string | null;
  SKALA: string | null;
  KETERLAMBATAN: string | null;
}

// Server Component for data fetching
async function ManualCabangToDoListData() {
  const cookieStore = await cookies();
  const userId = cookieStore.get("userId")?.value;
  const branchCode = cookieStore.get("branchCode")?.value;

  if (!userId) {
    redirect("/signin");
  }

  let data: ManualCabangData[] = [];

  try {
    if (branchCode) {
      const response = await getManualCabangEdit(branchCode);
      if (response.status === "success" && response.data) {
        data = response.data;
      }
    }
  } catch (error) {
    console.error("Error fetching data:", error);
    // Return empty data on error, let client handle error display
  }

  return (
    <FadeInWrapper>
      <ManualCabangToDoListClient initialData={data} />
    </FadeInWrapper>
  );
}

// Main page component with PPR
export default function ManualCabangToDoListPage() {
  return (
    <Suspense fallback={
      <DataTableSkeleton
        rows={8}
        columns={9}
        showActions={true}
        showTitleDescription={true}
        title="Manual Cabang To Do List"
        description="Kelola data laporan manual cabang"
      />
    }>
      <ManualCabangToDoListData />
    </Suspense>
  );
}

// Add metadata
export const metadata = {
  title: "STR | Manual Cabang To Do List",
  description: "Kelola data laporan manual cabang"
};
