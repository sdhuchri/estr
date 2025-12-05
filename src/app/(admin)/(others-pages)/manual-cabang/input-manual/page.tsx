import { Suspense } from "react";
import PageSkeleton from "@/components/skeletons/PageSkeleton";
import InputManualClient from "./InputManualClient";

export default function ManualCabangInputManualPage() {
  return (
    <Suspense fallback={<PageSkeleton />}>
      <InputManualClient />
    </Suspense>
  );
}

export const metadata = {
  title: "STR | Input Manual Cabang",
  description: "Tambah data laporan manual cabang baru"
};
