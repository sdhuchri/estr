export default function Loading() {
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="p-6">
        {/* Main Card Container */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
          {/* Header */}
          <div className="p-6 border-b border-gray-200">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div>
                  <h1 className="text-3xl font-bold text-gray-900">Setting Kode Transaksi</h1>
                  <p className="text-gray-600 mt-1">Kelola kode transaksi untuk deteksi red flag</p>
                </div>
              </div>

              {/* Action Buttons - Right Side */}
              <div className="flex items-center gap-4">
                {/* View Codes Button */}
                <div className="h-10 bg-gray-200 rounded-lg w-40 animate-pulse"></div>

                {/* Save Button */}
                <div className="h-10 bg-gray-200 rounded-lg w-44 animate-pulse"></div>
              </div>
            </div>
          </div>

          {/* Content */}
          <div className="p-6">
            {/* Jenis Redflag Selection */}
            <div className="mb-6">
              <div className="space-y-2">
                <div className="h-4 bg-gray-200 rounded w-24 animate-pulse"></div>
                <div className="w-64">
                  <div className="h-10 bg-gray-200 rounded-lg animate-pulse"></div>
                </div>
              </div>
            </div>

            {/* Dynamic Fields */}
            <div className="space-y-6">
              {Array.from({ length: 2 }, (_, index) => (
                <div key={index} className="space-y-2">
                  <div className="h-4 bg-gray-200 rounded w-48 animate-pulse"></div>
                  <div className="border border-gray-300 rounded-lg p-3 min-h-[100px]">
                    <div className="flex flex-wrap gap-2 mb-2">
                      {Array.from({ length: 3 }, (_, chipIndex) => (
                        <div key={chipIndex} className="h-7 bg-gray-200 rounded-full w-16 animate-pulse"></div>
                      ))}
                    </div>
                    <div className="h-4 bg-gray-200 rounded w-full animate-pulse"></div>
                  </div>
                  <div className="h-3 bg-gray-200 rounded w-64 animate-pulse"></div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}