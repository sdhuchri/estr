import { Suspense } from "react";
import DataTableSkeleton from "@/components/skeletons/DataTableSkeleton";
import ManualCabangTrackingClient from "./ManualCabangTrackingClient";

export default function ManualCabangTrackingPage() {
  return (
    <Suspense
      fallback={
        <DataTableSkeleton
          rows={8}
          columns={11}
          showActions={false}
          showTitleDescription={true}
          title="Tracking Manual Cabang"
          description="Monitor status dan progress data manual cabang"
        />
      }
    >
      <ManualCabangTrackingClient />
    </Suspense>
  );
}

export const metadata = {
  title: "STR | Tracking Manual Cabang",
  description: "Monitor status dan progress data manual cabang"
};
