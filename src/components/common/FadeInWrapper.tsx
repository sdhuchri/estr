"use client";
import { ReactNode } from "react";

interface FadeInWrapperProps {
  children: ReactNode;
}

export default function FadeInWrapper({ children }: FadeInWrapperProps) {
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
        
        .fade-in-content {
          opacity: 0;
          animation: fadeIn 0.6s ease-out 0.1s forwards;
        }
      `}</style>
      <div className="fade-in-content">
        {children}
      </div>
    </>
  );
}
