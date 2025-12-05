import DataTableSkeleton from "@/components/skeletons/DataTableSkeleton";

export default function Loading() {
  return (
    <DataTableSkeleton 
      rows={2}
      columns={1}
      showActions={false}
      showTitleDescription={true}
      title="Manual Cabang"
      description="Kelola data laporan manual cabang"
    />
  );
}