import { Suspense } from "react";
import DataTableSkeleton from "@/components/skeletons/DataTableSkeleton";
import BiFastStatusClient from "./BiFastStatusClient";

export default function BiFastStatusPage() {
  return (
    <Suspense
      fallback={
        <DataTableSkeleton
          rows={8}
          columns={7}
          showActions={true}
          showTitleDescription={true}
          title="BI-Fast Transaction Status"
          description="Monitor status transaksi BI-Fast"
        />
      }
    >
      <BiFastStatusClient />
    </Suspense>
  );
}

export const metadata = {
  title: "STR | BI-Fast Status",
  description: "Monitor status transaksi BI-Fast"
};
