import DataTableSkeleton from "@/components/skeletons/DataTableSkeleton";

export default function Loading() {
  return (
    <DataTableSkeleton 
      rows={8}
      columns={8}
      showActions={true}
      showTitleDescription={true}
      title="List Reject Supervisor"
      description="Kelola data laporan yang direject dan sudah tidak aktif"
    />
  );
}