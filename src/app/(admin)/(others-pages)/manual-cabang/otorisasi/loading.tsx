"use client";
import DataTableSkeleton from "@/components/skeletons/DataTableSkeleton";

export default function Loading() {
  return (
    <>
      <style jsx global>{`
        @keyframes fadeIn {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        
        @keyframes skeletonFadeIn {
          from {
            opacity: 0;
          }
          to {
            opacity: 1;
          }
        }
        
        .fade-in-wrapper-otorisasi {
          opacity: 0;
          animation: fadeIn 0.4s ease-out forwards;
        }
        
        .skeleton-delayed-otorisasi {
          opacity: 0;
          animation: skeletonFadeIn 0.3s ease-out 0.5s forwards;
        }
      `}</style>
      <div className="fade-in-wrapper-otorisasi">
        <div className="skeleton-delayed-otorisasi">
          <DataTableSkeleton
            rows={8}
            columns={7}
            showActions={true}
            showTitleDescription={true}
            title="Manual Cabang Otorisasi"
            description="Kelola data laporan manual cabang"
          />
        </div>
      </div>
    </>
  );
}
