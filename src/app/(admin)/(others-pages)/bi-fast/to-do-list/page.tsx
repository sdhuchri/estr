import { Suspense } from "react";
import DataTableSkeleton from "@/components/skeletons/DataTableSkeleton";
import BiFastToDoListClient from "./BiFastToDoListClient";
import FadeInWrapper from "@/components/common/FadeInWrapper";

export default function BiFastToDoListPage() {
  return (
    <Suspense
      fallback={
        <DataTableSkeleton
          rows={8}
          columns={7}
          showActions={true}
          showTitleDescription={true}
          title="BI-Fast Transaction To Do List"
          description="Kelola transaksi BI-Fast"
        />
      }
    >
      <FadeInWrapper>
        <BiFastToDoListClient />
      </FadeInWrapper>
    </Suspense>
  );
}

export const metadata = {
  title: "STR | BI-Fast To Do List",
  description: "Kelola transaksi BI-Fast"
};
