import DataTableSkeleton from "@/components/skeletons/DataTableSkeleton";

export default function Loading() {
  return (
    <DataTableSkeleton
      rows={8}
      columns={7}
      showActions={true}
      showTitleDescription={true}
      title="BI-Fast Transaction Status"
      description="Monitor status transaksi BI-Fast"
    />
  );
}
