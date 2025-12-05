import { Suspense } from "react";
import PageSkeleton from "@/components/skeletons/PageSkeleton";
import ChangePasswordClient from "./ChangePasswordClient";

export default function ChangePasswordPage() {
  return (
    <Suspense fallback={<PageSkeleton type="form" />}>
      <ChangePasswordClient />
    </Suspense>
  );
}

export const metadata = {
  title: "STR | Change Password",
  description: "Ubah password akun Anda"
};
