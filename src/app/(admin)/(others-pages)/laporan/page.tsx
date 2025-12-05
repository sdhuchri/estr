import { Suspense } from "react";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import LaporanClient from "./LaporanClient";

// Server Component for authentication check
async function LaporanContent() {
  const cookieStore = await cookies();
  const userId = cookieStore.get("userId")?.value;

  if (!userId) {
    redirect("/signin");
  }

  return <LaporanClient />;
}

// Loading skeleton for laporan page
function LaporanSkeleton() {
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="p-6">
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-visible">
          {/* Header Skeleton */}
          <div className="p-6 border-b border-gray-200">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-gray-200 rounded-lg animate-pulse"></div>
                <div>
                  <div className="h-8 bg-gray-200 rounded-md w-48 mb-2 animate-pulse"></div>
                  <div className="h-4 bg-gray-200 rounded-md w-64 animate-pulse"></div>
                </div>
              </div>
            </div>
          </div>

          {/* Content Skeleton */}
          <div className="p-6">
            {/* Form Controls Row */}
            <div className="flex items-end gap-4 mb-10">
              <div className="flex items-end gap-3">
                <div>
                  <div className="h-4 bg-gray-200 rounded w-16 mb-2 animate-pulse"></div>
                  <div className="w-40 h-10 bg-gray-200 rounded-lg animate-pulse"></div>
                </div>
                <div>
                  <div className="w-40 h-10 bg-gray-200 rounded-lg animate-pulse"></div>
                </div>
              </div>
              <div className="flex items-end gap-3">
                <div>
                  <div className="h-4 bg-gray-200 rounded w-24 mb-2 animate-pulse"></div>
                  <div className="w-[300px] h-10 bg-gray-200 rounded-lg animate-pulse"></div>
                </div>
              </div>
              <div>
                <div className="h-10 bg-gray-200 rounded-lg w-24 animate-pulse"></div>
              </div>
            </div>

            {/* Content Area */}
            <div className="rounded bg-white">
              <div className="p-4">
                <div className="h-64 bg-gray-200 rounded-lg animate-pulse"></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// Main page component with PPR
export default function LaporanPage() {
  return (
    <Suspense fallback={<LaporanSkeleton />}>
      <LaporanContent />
    </Suspense>
  );
}

// Add metadata
export const metadata = {
  title: "STR | Laporan",
  description: "Generate dan unduh laporan data nasabah"
};