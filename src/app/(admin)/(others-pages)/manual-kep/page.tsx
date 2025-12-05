import { Suspense } from "react";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import Link from "next/link";
import { UserCheck, UserCog } from "lucide-react";
import DataTableSkeleton from "@/components/skeletons/DataTableSkeleton";

// Server Component for authentication check
async function ManualKepData() {
  const cookieStore = await cookies();
  const userId = cookieStore.get("userId")?.value;

  if (!userId) {
    redirect("/signin");
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="p-6">
        <div className="bg-white rounded-lg shadow-sm border border-gray-200">
          {/* Header */}
          <div className="p-6 border-b border-gray-200">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
              <div>
                <h1 className="text-2xl font-bold text-gray-900 mb-2">Manual Kepatuhan</h1>
                <p className="text-gray-600">Kelola data laporan manual kepatuhan</p>
              </div>
            </div>
          </div>

          {/* Menu Cards */}
          <div className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Manual Kep Operator */}
              <Link href="/manual-kep/operator">
                <div className="bg-white border border-gray-200 rounded-lg p-6 hover:shadow-md transition-shadow cursor-pointer group">
                  <div className="flex items-center gap-4">
                    <div className="p-3 bg-blue-100 rounded-lg group-hover:bg-blue-200 transition-colors">
                      <UserCheck className="w-6 h-6 text-blue-600" />
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900 mb-1">Manual Kepatuhan Operator</h3>
                      <p className="text-gray-600">Kelola data laporan manual kepatuhan operator</p>
                    </div>
                  </div>
                </div>
              </Link>

              {/* Manual Kep Supervisor */}
              <Link href="/manual-kep/supervisor">
                <div className="bg-white border border-gray-200 rounded-lg p-6 hover:shadow-md transition-shadow cursor-pointer group">
                  <div className="flex items-center gap-4">
                    <div className="p-3 bg-green-100 rounded-lg group-hover:bg-green-200 transition-colors">
                      <UserCog className="w-6 h-6 text-green-600" />
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900 mb-1">Manual Kepatuhan Supervisor</h3>
                      <p className="text-gray-600">Kelola data laporan manual kepatuhan supervisor</p>
                    </div>
                  </div>
                </div>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// Main page component with PPR
export default function ManualKepPage() {
  return (
    <Suspense fallback={
      <DataTableSkeleton 
        rows={2}
        columns={1}
        showActions={false}
        showTitleDescription={true}
        title="Manual Kepatuhan"
        description="Kelola data laporan manual kepatuhan"
      />
    }>
      <ManualKepData />
    </Suspense>
  );
}

// Add metadata
export const metadata = {
  title: "STR | Manual Kepatuhan",
  description: "Kelola data laporan manual kepatuhan"
};