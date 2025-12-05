

interface PageSkeletonProps {
  type?: "table" | "form" | "cards" | "dashboard";
}

export default function PageSkeleton({ type = "table" }: PageSkeletonProps) {
  if (type === "table") {
    return (
      <div className="min-h-screen bg-gray-50">
        <div className="p-6">
          <div className="bg-white rounded-lg shadow-sm border border-gray-200">
            {/* Header */}
            <div className="p-6 border-b border-gray-200">
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                <div>
                  <div className="h-8 bg-gray-200 rounded-md w-48 mb-2 animate-pulse"></div>
                  <div className="h-4 bg-gray-200 rounded-md w-64 animate-pulse"></div>
                </div>
                <div className="flex gap-2">
                  <div className="h-10 bg-gray-200 rounded-lg w-32 animate-pulse"></div>
                  <div className="h-10 bg-gray-200 rounded-lg w-64 animate-pulse"></div>
                </div>
              </div>
            </div>

            {/* Table */}
            <div className="p-6">
              <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
                <table className="w-full border-collapse">
                  <thead>
                    <tr style={{ backgroundColor: '#161950' }}>
                      {Array.from({ length: 6 }, (_, i) => (
                        <th key={i} className="border border-gray-300 px-4 py-3">
                          <div className="h-4 bg-white/20 rounded animate-pulse"></div>
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {Array.from({ length: 5 }, (_, rowIndex) => (
                      <tr key={rowIndex} className={rowIndex % 2 === 0 ? 'bg-white' : 'bg-gray-50'}>
                        {Array.from({ length: 6 }, (_, colIndex) => (
                          <td key={colIndex} className="border border-gray-300 px-4 py-3">
                            <div className="h-4 bg-gray-200 rounded animate-pulse"></div>
                          </td>
                        ))}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (type === "form") {
    return (
      <div className="min-h-screen bg-gray-50">
        <div className="p-6">
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
            {/* Header */}
            <div className="p-6 border-b border-gray-200">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-gray-200 rounded-lg animate-pulse"></div>
                  <div>
                    <div className="h-8 bg-gray-200 rounded-md w-48 mb-2 animate-pulse"></div>
                    <div className="h-4 bg-gray-200 rounded-md w-64 animate-pulse"></div>
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  <div className="h-10 bg-gray-200 rounded-lg w-32 animate-pulse"></div>
                  <div className="h-10 bg-gray-200 rounded-lg w-40 animate-pulse"></div>
                </div>
              </div>
            </div>

            {/* Form Content */}
            <div className="p-6">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {Array.from({ length: 6 }, (_, index) => (
                  <div key={index} className="bg-white rounded-xl border border-gray-200 overflow-hidden">
                    <div className="bg-gray-200 p-4 animate-pulse">
                      <div className="flex items-center gap-3">
                        <div className="p-2 bg-white/20 rounded-lg">
                          <div className="w-5 h-5 bg-white/40 rounded animate-pulse"></div>
                        </div>
                        <div className="h-6 bg-white/40 rounded w-24 animate-pulse"></div>
                      </div>
                    </div>
                    <div className="p-6 space-y-4">
                      {Array.from({ length: 3 }, (_, fieldIndex) => (
                        <div key={fieldIndex} className="space-y-2">
                          <div className="h-4 bg-gray-200 rounded w-32 animate-pulse"></div>
                          <div className="h-10 bg-gray-200 rounded-lg animate-pulse"></div>
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (type === "dashboard") {
    return (
      <div className="min-h-screen bg-gray-50">
        <div className="p-6">
          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
            {Array.from({ length: 4 }, (_, i) => (
              <div key={i} className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <div className="h-4 bg-gray-200 rounded w-20 mb-2 animate-pulse"></div>
                    <div className="h-8 bg-gray-200 rounded w-16 animate-pulse"></div>
                  </div>
                  <div className="w-12 h-12 bg-gray-200 rounded-lg animate-pulse"></div>
                </div>
              </div>
            ))}
          </div>

          {/* Main Content */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2">
              <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                <div className="h-6 bg-gray-200 rounded w-32 mb-4 animate-pulse"></div>
                <div className="h-64 bg-gray-200 rounded animate-pulse"></div>
              </div>
            </div>
            <div>
              <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                <div className="h-6 bg-gray-200 rounded w-24 mb-4 animate-pulse"></div>
                <div className="space-y-3">
                  {Array.from({ length: 5 }, (_, i) => (
                    <div key={i} className="flex items-center gap-3">
                      <div className="w-8 h-8 bg-gray-200 rounded-full animate-pulse"></div>
                      <div className="flex-1">
                        <div className="h-4 bg-gray-200 rounded w-full mb-1 animate-pulse"></div>
                        <div className="h-3 bg-gray-200 rounded w-2/3 animate-pulse"></div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Default table skeleton
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="p-6">
        <div className="h-8 bg-gray-200 rounded-md w-48 mb-6 animate-pulse"></div>
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <div className="space-y-4">
            {Array.from({ length: 8 }, (_, i) => (
              <div key={i} className="h-4 bg-gray-200 rounded animate-pulse"></div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
