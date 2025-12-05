import { Suspense } from "react";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { getListRejectTidakAktif } from "@/services/listReject";
import ListRejectSupervisorClient from "./ListRejectSupervisorClient";
import DataTableSkeleton from "@/components/skeletons/DataTableSkeleton";

interface ListRejectData {
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
async function ListRejectSupervisorData() {
  const cookieStore = await cookies();
  const userId = cookieStore.get("userId")?.value;
  const branchCode = cookieStore.get("branchCode")?.value;

  if (!userId) {
    redirect("/signin");
  }

  let data: ListRejectData[] = [];

  try {
    if (branchCode) {
      
      const response = await getListRejectTidakAktif(branchCode);
      if (response.status === "success" && response.data) {
        data = response.data;
      }
    }
  } catch (error) {
    console.error("Error fetching data:", error);
    // Return empty data on error, let client handle error display
  }

  return <ListRejectSupervisorClient initialData={data} />;
}

// Main page component with PPR
export default function ListRejectSupervisorPage() {
  return (
    <Suspense fallback={
      <DataTableSkeleton 
        rows={8}
        columns={8}
        showActions={true}
        showTitleDescription={true}
        title="List Reject Supervisor"
        description="Kelola data laporan yang direject dan sudah tidak aktif"
      />
    }>
      <ListRejectSupervisorData />
    </Suspense>
  );
}

// Add metadata
export const metadata = {
  title: "STR | List Reject Supervisor",
  description: "Kelola data laporan yang direject dan sudah tidak aktif"
};