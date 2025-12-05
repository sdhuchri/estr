import DataTableSkeleton from "@/components/skeletons/DataTableSkeleton";

export default function Loading() {
  return (
    <DataTableSkeleton
      rows={8}
      columns={7}
      showActions={true}
      showTitleDescription={true}
      title="Manual Cabang To Do List"
      description="Kelola data laporan manual cabang"
    />
  );
}
