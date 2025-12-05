

interface DataTableSkeletonProps {
  rows?: number;
  columns?: number;
  showHeader?: boolean;
  showActions?: boolean;
  title?: string;
  description?: string;
  showTitleDescription?: boolean;
}

export default function DataTableSkeleton({ 
  rows = 5, 
  columns = 6, 
  showHeader = true,
  showActions = true,
  title,
  description,
  showTitleDescription = false
}: DataTableSkeletonProps) {
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="p-6">
        <div className="bg-white rounded-lg shadow-sm border border-gray-200">
          {/* Header Skeleton */}
          {showHeader && (
            <div className="p-6 border-b border-gray-200">
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                <div>
                  {showTitleDescription && title ? (
                    <>
                      <h1 className="text-2xl font-bold text-gray-900 mb-2">{title}</h1>
                      {description && <p className="text-gray-600">{description}</p>}
                    </>
                  ) : (
                    <>
                      <div className="h-8 bg-gray-200 rounded-md w-48 mb-2 animate-pulse"></div>
                      <div className="h-4 bg-gray-200 rounded-md w-64 animate-pulse"></div>
                    </>
                  )}
                </div>
                <div className="flex gap-2">
                  <div className="h-10 bg-gray-200 rounded-lg w-64 animate-pulse"></div>
                </div>
              </div>
            </div>
          )}

          {/* Table Skeleton */}
          <div className="p-6">
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full border-collapse">
                  <thead>
                    <tr style={{ backgroundColor: '#161950' }}>
                      {Array.from({ length: columns }, (_, i) => (
                        <th key={i} className="border border-gray-300 px-4 py-3">
                          <div className="h-4 bg-white/20 rounded animate-pulse"></div>
                        </th>
                      ))}
                      {showActions && (
                        <th className="border border-gray-300 px-4 py-3">
                          <div className="h-4 bg-white/20 rounded animate-pulse"></div>
                        </th>
                      )}
                    </tr>
                  </thead>
                  <tbody>
                    {Array.from({ length: rows }, (_, rowIndex) => (
                      <tr
                        key={rowIndex}
                        className={rowIndex % 2 === 0 ? 'bg-white' : 'bg-gray-50'}
                      >
                        {Array.from({ length: columns }, (_, colIndex) => (
                          <td key={colIndex} className="border border-gray-300 px-4 py-3">
                            <div className={`h-4 bg-gray-200 rounded animate-pulse ${
                              colIndex === 0 ? 'w-6 mx-auto' : 
                              colIndex === 1 ? (rowIndex % 3 === 0 ? 'w-28' : rowIndex % 3 === 1 ? 'w-20' : 'w-24') :
                              colIndex === 2 ? (rowIndex % 2 === 0 ? 'w-16' : 'w-20') :
                              colIndex === 3 ? (rowIndex % 4 === 0 ? 'w-36' : rowIndex % 4 === 1 ? 'w-28' : rowIndex % 4 === 2 ? 'w-32' : 'w-40') :
                              'w-24'
                            }`} style={{ animationDelay: `${rowIndex * 100 + colIndex * 50}ms` }}></div>
                          </td>
                        ))}
                        {showActions && (
                          <td className="border border-gray-300 px-4 py-3 text-center">
                            <div className="flex justify-center gap-2">
                              <div className="h-6 w-12 bg-blue-200 rounded animate-pulse" style={{ animationDelay: `${rowIndex * 100}ms` }}></div>
                            </div>
                          </td>
                        )}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>

          {/* Pagination Skeleton */}
          <div className="p-4 border-t border-gray-200">
            <div className="flex flex-col md:flex-row md:justify-between md:items-center gap-4">
              <div className="flex items-center gap-2">
                <span className="text-sm text-gray-700">Tampilkan</span>
                <div className="h-8 bg-gray-200 rounded w-16 animate-pulse"></div>
                <span className="text-sm text-gray-700">data per halaman</span>
              </div>
              <div className="flex-1 text-center">
                <div className="h-4 bg-gray-200 rounded w-32 mx-auto animate-pulse"></div>
              </div>
              <div className="flex gap-2">
                {Array.from({ length: 5 }, (_, i) => (
                  <div key={i} className="h-8 w-8 bg-gray-200 rounded animate-pulse"></div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
