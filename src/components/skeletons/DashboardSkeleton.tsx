export default function DashboardSkeleton() {
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="p-6">
        {/* Main Dashboard Card */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200">
          {/* Header Section */}
          <div className="p-6 border-b border-gray-200">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
              {/* Title and Description Skeleton */}
              <div className="space-y-2">
                <div className="h-8 w-32 bg-gray-200 rounded animate-pulse" />
                <div className="h-4 w-64 bg-gray-200 rounded animate-pulse" />
              </div>

              {/* Date Filter Skeleton */}
              <div className="flex items-center gap-2">
                <div className="h-4 w-24 bg-gray-200 rounded animate-pulse" />
                <div className="h-10 w-44 bg-gray-200 rounded-lg animate-pulse" />
                <div className="h-4 w-8 bg-gray-200 rounded animate-pulse" />
                <div className="h-10 w-44 bg-gray-200 rounded-lg animate-pulse" />
              </div>
            </div>
          </div>

          {/* Dashboard Content */}
          <div className="p-6">
            <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
              {/* Left Sidebar - Dashboard Keseluruhan Skeleton */}
              <div className="lg:col-span-1">
                <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                  <div className="h-6 w-48 bg-gray-200 rounded animate-pulse mb-6" />

                  <div className="space-y-6">
                    {/* Card Skeleton 1 */}
                    <div className="p-4 bg-gray-100 rounded-lg">
                      <div className="flex items-center justify-between">
                        <div className="space-y-2 flex-1">
                          <div className="h-3 w-32 bg-gray-200 rounded animate-pulse" />
                          <div className="h-8 w-16 bg-gray-200 rounded animate-pulse" />
                        </div>
                        <div className="w-10 h-10 bg-gray-200 rounded-lg animate-pulse" />
                      </div>
                    </div>

                    {/* Card Skeleton 2 */}
                    <div className="p-4 bg-gray-100 rounded-lg">
                      <div className="flex items-center justify-between">
                        <div className="space-y-2 flex-1">
                          <div className="h-3 w-40 bg-gray-200 rounded animate-pulse" />
                          <div className="h-8 w-16 bg-gray-200 rounded animate-pulse" />
                        </div>
                        <div className="w-10 h-10 bg-gray-200 rounded-lg animate-pulse" />
                      </div>
                    </div>

                    {/* Card Skeleton 3 */}
                    <div className="p-4 bg-gray-100 rounded-lg">
                      <div className="flex items-center justify-between">
                        <div className="space-y-2 flex-1">
                          <div className="h-3 w-44 bg-gray-200 rounded animate-pulse" />
                          <div className="h-8 w-16 bg-gray-200 rounded animate-pulse" />
                        </div>
                        <div className="w-10 h-10 bg-gray-200 rounded-lg animate-pulse" />
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Right Content - Dashboard Performa Skeleton */}
              <div className="lg:col-span-3">
                <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                  <div className="h-6 w-48 bg-gray-200 rounded animate-pulse mb-6" />

                  {/* Cabang Section Skeleton */}
                  <div className="mb-8">
                    <div className="flex items-center justify-between mb-4">
                      <div className="h-5 w-64 bg-gray-200 rounded animate-pulse" />
                      <div className="h-8 w-16 bg-gray-200 rounded animate-pulse" />
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      {/* Stats List Skeleton */}
                      <div className="space-y-3">
                        {[1, 2, 3, 4].map((i) => (
                          <div key={i} className="p-3 bg-gray-50 rounded-lg">
                            <div className="flex items-center justify-between">
                              <div className="flex items-center gap-2 flex-1">
                                <div className="w-5 h-5 bg-gray-200 rounded animate-pulse" />
                                <div className="h-3 w-40 bg-gray-200 rounded animate-pulse" />
                              </div>
                              <div className="h-4 w-8 bg-gray-200 rounded animate-pulse" />
                            </div>
                          </div>
                        ))}
                      </div>

                      {/* Pie Chart Skeleton */}
                      <div className="flex items-center justify-center bg-gradient-to-br from-blue-50 to-blue-100 rounded-lg p-6">
                        <div className="text-center">
                          <div className="w-48 h-48 mx-auto mb-4 bg-gray-200 rounded-full animate-pulse" />
                          <div className="grid grid-cols-2 gap-2 w-full">
                            {[1, 2, 3, 4].map((i) => (
                              <div key={i} className="flex items-center gap-2">
                                <div className="w-3 h-3 bg-gray-200 rounded-sm animate-pulse" />
                                <div className="h-3 w-20 bg-gray-200 rounded animate-pulse" />
                              </div>
                            ))}
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Kepatuhan Section Skeleton */}
                  <div>
                    <div className="flex items-center justify-between mb-4">
                      <div className="h-5 w-72 bg-gray-200 rounded animate-pulse" />
                      <div className="h-8 w-16 bg-gray-200 rounded animate-pulse" />
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      {/* Stats List Skeleton */}
                      <div className="space-y-3">
                        {[1, 2, 3, 4].map((i) => (
                          <div key={i} className="p-3 bg-gray-50 rounded-lg">
                            <div className="flex items-center justify-between">
                              <div className="flex items-center gap-2 flex-1">
                                <div className="w-5 h-5 bg-gray-200 rounded animate-pulse" />
                                <div className="h-3 w-44 bg-gray-200 rounded animate-pulse" />
                              </div>
                              <div className="h-4 w-8 bg-gray-200 rounded animate-pulse" />
                            </div>
                          </div>
                        ))}
                      </div>

                      {/* Pie Chart Skeleton */}
                      <div className="flex items-center justify-center bg-gradient-to-br from-green-50 to-green-100 rounded-lg p-6">
                        <div className="text-center">
                          <div className="w-48 h-48 mx-auto mb-4 bg-gray-200 rounded-full animate-pulse" />
                          <div className="grid grid-cols-2 gap-2 w-full">
                            {[1, 2, 3, 4].map((i) => (
                              <div key={i} className="flex items-center gap-2">
                                <div className="w-3 h-3 bg-gray-200 rounded-sm animate-pulse" />
                                <div className="h-3 w-20 bg-gray-200 rounded animate-pulse" />
                              </div>
                            ))}
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
