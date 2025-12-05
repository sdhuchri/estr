import { Suspense } from "react";
import PageSkeleton from "@/components/skeletons/PageSkeleton";
import HomeClient from "./HomeClient";

// Main page component with PPR
export default function HomePage() {
  return (
    <Suspense fallback={<PageSkeleton type="dashboard" />}>
      <HomeClient />
    </Suspense>
  );
}

// Add metadata
export const metadata = {
  title: "STR | Home",
  description: "Dashboard utama sistem E-STR"
};