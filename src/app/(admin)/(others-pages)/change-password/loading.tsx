export default function Loading() {
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="p-6">
        {/* Main Card Container Skeleton */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
          {/* Header Skeleton */}
          <div className="p-6 border-b border-gray-200">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-gray-200 rounded-lg animate-pulse"></div>
                <div>
                  <div className="h-8 w-48 bg-gray-200 rounded animate-pulse mb-2"></div>
                  <div className="h-4 w-64 bg-gray-200 rounded animate-pulse"></div>
                </div>
              </div>
            </div>
          </div>

          {/* Content Skeleton */}
          <div className="p-6">
            <div className="max-w-2xl mx-auto space-y-6">
              {/* Form Fields Skeleton */}
              {[1, 2, 3].map((i) => (
                <div key={i} className="space-y-2">
                  <div className="h-4 w-32 bg-gray-200 rounded animate-pulse"></div>
                  <div className="h-10 w-full bg-gray-200 rounded-lg animate-pulse"></div>
                </div>
              ))}

              {/* Button Skeleton */}
              <div className="flex justify-end pt-4">
                <div className="h-10 w-40 bg-gray-200 rounded-lg animate-pulse"></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
