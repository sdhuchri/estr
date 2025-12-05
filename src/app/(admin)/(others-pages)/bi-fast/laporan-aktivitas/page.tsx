import { Suspense } from "react";
import DataTableSkeleton from "@/components/skeletons/DataTableSkeleton";
import BiFastLaporanAktivitasClient from "./BiFastLaporanAktivitasClient";

export default function BiFastLaporanAktivitasPage() {
  return (
    <Suspense
      fallback={
        <DataTableSkeleton
          rows={8}
          columns={7}
          showActions={true}
          showTitleDescription={true}
          title="BI-Fast Laporan Aktivitas"
          description="Laporan aktivitas transaksi BI-Fast"
        />
      }
    >
      <BiFastLaporanAktivitasClient />
    </Suspense>
  );
}

export const metadata = {
  title: "STR | BI-Fast Laporan Aktivitas",
  description: "Laporan aktivitas transaksi BI-Fast"
};
