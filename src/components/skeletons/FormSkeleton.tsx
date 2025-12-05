import React from "react";

interface FormSkeletonProps {
  fields?: number;
  showHeader?: boolean;
  showActions?: boolean;
  layout?: "single" | "double" | "mixed";
}

export default function FormSkeleton({ 
  fields = 6, 
  showHeader = true,
  showActions = true,
  layout = "mixed"
}: FormSkeletonProps) {
  const renderField = (index: number) => (
    <div key={index} className="space-y-2">
      <div className="h-4 bg-gray-200 rounded w-32 animate-pulse"></div>
      <div className="h-10 bg-gray-200 rounded-lg animate-pulse"></div>
    </div>
  );

  const renderFields = () => {
    const fieldElements = Array.from({ length: fields }, (_, i) => renderField(i));
    
    if (layout === "single") {
      return <div className="space-y-4">{fieldElements}</div>;
    }
    
    if (layout === "double") {
      return (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {fieldElements}
        </div>
      );
    }
    
    // Mixed layout
    return (
      <div className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {fieldElements.slice(0, 4)}
        </div>
        <div className="space-y-4">
          {fieldElements.slice(4)}
        </div>
      </div>
    );
  };

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
      {/* Header Skeleton */}
      {showHeader && (
        <div className="p-6 border-b border-gray-200">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-gray-200 rounded-lg animate-pulse"></div>
              <div>
                <div className="h-8 bg-gray-200 rounded-md w-48 mb-2 animate-pulse"></div>
                <div className="h-4 bg-gray-200 rounded-md w-64 animate-pulse"></div>
              </div>
            </div>
            {showActions && (
              <div className="flex items-center gap-4">
                <div className="h-10 bg-gray-200 rounded-lg w-32 animate-pulse"></div>
                <div className="h-10 bg-gray-200 rounded-lg w-40 animate-pulse"></div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Form Content Skeleton */}
      <div className="p-6">
        {renderFields()}
      </div>

      {/* Actions Skeleton */}
      {showActions && (
        <div className="p-6 border-t border-gray-200 bg-gray-50">
          <div className="flex justify-end gap-4">
            <div className="h-10 bg-gray-200 rounded-lg w-20 animate-pulse"></div>
            <div className="h-10 bg-gray-200 rounded-lg w-24 animate-pulse"></div>
          </div>
        </div>
      )}
    </div>
  );
}