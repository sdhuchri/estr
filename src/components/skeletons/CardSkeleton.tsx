import React from "react";

interface CardSkeletonProps {
  count?: number;
  showIcon?: boolean;
  showDescription?: boolean;
}

export default function CardSkeleton({ 
  count = 4, 
  showIcon = true,
  showDescription = true 
}: CardSkeletonProps) {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      {Array.from({ length: count }, (_, index) => (
        <div key={index} className="bg-white rounded-xl border border-gray-200 overflow-hidden">
          {/* Card Header */}
          <div className="bg-gray-200 p-4 animate-pulse">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                {showIcon && (
                  <div className="p-2 bg-white/20 rounded-lg">
                    <div className="w-5 h-5 bg-white/40 rounded animate-pulse"></div>
                  </div>
                )}
                <div className="h-6 bg-white/40 rounded w-24 animate-pulse"></div>
              </div>
              {showDescription && (
                <div className="h-4 bg-white/40 rounded w-32 animate-pulse"></div>
              )}
            </div>
          </div>

          {/* Card Content */}
          <div className="p-6 space-y-4">
            {Array.from({ length: 3 }, (_, fieldIndex) => (
              <div key={fieldIndex} className="space-y-2">
                <div className="h-4 bg-gray-200 rounded w-32 animate-pulse"></div>
                <div className="relative">
                  <div className="h-10 bg-gray-200 rounded-lg animate-pulse"></div>
                </div>
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}