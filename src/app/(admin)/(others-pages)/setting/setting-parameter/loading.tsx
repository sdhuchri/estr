export default function Loading() {
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="p-6">
        {/* Main Card Container */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
          {/* Header */}
          <div className="p-6 border-b border-gray-200">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-3">
                <div>
                  <h1 className="text-3xl font-bold text-gray-900">Setting Parameter</h1>
                  <p className="text-gray-600 mt-1">Kelola parameter sistem untuk deteksi transaksi mencurigakan</p>
                </div>
              </div>

              {/* Search and Save Button - Right Side */}
              <div className="flex items-center gap-4">
                {/* Search Parameter */}
                <div className="relative w-64">
                  <div className="h-10 bg-gray-200 rounded-lg animate-pulse"></div>
                </div>

                {/* Save Button */}
                <div className="h-10 bg-gray-200 rounded-lg w-40 animate-pulse"></div>
              </div>
            </div>
          </div>

          {/* Parameter Cards Grid */}
          <div className="p-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {Array.from({ length: 7 }, (_, index) => (
                <div key={index} className="bg-white rounded-xl border border-gray-200 overflow-hidden">
                  {/* Card Header */}
                  <div className="bg-gray-200 p-4 animate-pulse">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className="p-2 bg-white/20 rounded-lg">
                          <div className="w-5 h-5 bg-white/40 rounded animate-pulse"></div>
                        </div>
                        <div className="h-6 bg-white/40 rounded w-24 animate-pulse"></div>
                      </div>
                      <div className="h-4 bg-white/40 rounded w-32 animate-pulse"></div>
                    </div>
                  </div>

                  {/* Card Content */}
                  <div className="p-6 space-y-4">
                    {Array.from({ length: index === 0 ? 3 : index === 4 ? 2 : index === 6 ? 2 : 1 }, (_, fieldIndex) => (
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