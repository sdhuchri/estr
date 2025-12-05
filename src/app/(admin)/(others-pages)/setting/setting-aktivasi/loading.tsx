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
                  <h1 className="text-3xl font-bold text-gray-900">Aktivasi Parameter</h1>
                  <p className="text-gray-600 mt-1">Kelola aktivasi parameter deteksi red flag</p>
                </div>
              </div>

              {/* Save Button Skeleton */}
              <div className="h-10 bg-gray-200 rounded-lg w-40 animate-pulse"></div>
            </div>
          </div>

          {/* Content */}
          <div className="p-6">
            <div className="grid grid-cols-4 gap-6">
              {Array.from({ length: 18 }, (_, index) => (
                <div 
                  key={index}
                  className="flex items-center justify-between p-4 bg-gray-50 rounded-lg"
                >
                  <div className="h-6 bg-gray-200 rounded w-24 animate-pulse"></div>
                  <div className="h-8 w-14 bg-gray-200 rounded-full animate-pulse"></div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
