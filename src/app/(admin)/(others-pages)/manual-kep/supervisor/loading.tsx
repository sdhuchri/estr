export default function Loading() {
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="p-6">
        <div className="bg-white rounded-lg shadow-sm border border-gray-200">
          <div className="p-6 border-b border-gray-200">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
              <div>
                <h1 className="text-2xl font-bold text-gray-900 mb-2">Manual Kepatuhan Supervisor</h1>
                <p className="text-gray-600">Kelola data laporan manual kepatuhan supervisor</p>
              </div>
              <div className="flex gap-2">
                <div className="h-10 bg-gray-200 rounded-lg w-64 animate-pulse"></div>
              </div>
            </div>
          </div>
          <div className="p-6">
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full border-collapse">
                  <thead>
                    <tr style={{ backgroundColor: '#161950' }}>
                      {Array.from({ length: 7 }, (_, i) => (
                        <th key={i} className="border border-gray-300 px-4 py-3">
                          <div className="h-4 bg-white/20 rounded animate-pulse"></div>
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {Array.from({ length: 8 }, (_, rowIndex) => (
                      <tr key={rowIndex} className={rowIndex % 2 === 0 ? 'bg-white' : 'bg-gray-50'}>
                        {Array.from({ length: 7 }, (_, colIndex) => (
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