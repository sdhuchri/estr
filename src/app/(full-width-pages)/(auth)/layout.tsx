"use client";
import { ThemeProvider } from "@/context/ThemeContext";
import React, { useState, useEffect } from "react";

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  // Generate stars only on client side after mount
  const [stars, setStars] = useState<Array<{
    id: number;
    size: number;
    top: number;
    left: number;
    delay: number;
    duration: number;
    opacity: number;
  }>>([]);

  useEffect(() => {
    // Generate stars only on client side
    setStars([...Array(80)].map((_, i) => ({
      id: i,
      size: Math.random() * 2 + 0.5,
      top: Math.random() * 100,
      left: Math.random() * 100,
      delay: Math.random() * 3,
      duration: Math.random() * 2 + 2,
      opacity: Math.random() * 0.7 + 0.3,
    })));
  }, []);
  return (
    <>
      <style jsx global>{`
        @import url('https://fonts.googleapis.com/css2?family=Tiny5&display=swap');
        
        @keyframes slowRotate {
          from {
            transform: rotate(0deg);
          }
          to {
            transform: rotate(360deg);
          }
        }
        
        .stars-container {
          animation: slowRotate 300s linear infinite;
        }
        
        .font-tiny5 {
          font-family: 'Tiny5', cursive;
        }
      `}</style>
      <div className="relative p-6 bg-white z-1 dark:bg-gray-900 sm:p-0" style={{ minHeight: '100vh' }}>
        <ThemeProvider>
          <div className="relative flex lg:flex-row w-full justify-center flex-col dark:bg-gray-900 sm:p-0" style={{ height: '111.11vh' }}>
            {children}
            <div className="lg:w-1/2 w-full lg:grid items-center hidden relative overflow-hidden" style={{ height: '111.11vh', background: 'radial-gradient(ellipse at center, #1a3a52 0%, #0d1f2d 50%, #050a0f 100%)' }}>
              {/* Starry Night Background */}
              <div className="absolute inset-0 stars-container" style={{ transformOrigin: 'center center' }}>
                {/* Small stars scattered across */}
                {stars.map((star) => (
                  <div
                    key={star.id}
                    className="absolute bg-white rounded-full animate-pulse"
                    style={{
                      width: `${star.size}px`,
                      height: `${star.size}px`,
                      top: `${star.top}%`,
                      left: `${star.left}%`,
                      opacity: star.opacity,
                      animationDelay: `${star.delay}s`,
                      animationDuration: `${star.duration}s`,
                    }}
                  />
                ))}

                {/* Nebula/Galaxy effect in center */}
                <div
                  className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 rounded-full opacity-30"
                  style={{
                    background: 'radial-gradient(circle, rgba(59, 130, 246, 0.4) 0%, rgba(147, 51, 234, 0.3) 40%, transparent 70%)',
                    filter: 'blur(60px)',
                  }}
                />

                {/* Bright stars with glow */}
                <div className="absolute top-10 left-10 w-3 h-3 bg-cyan-300 rounded-full animate-pulse" style={{ boxShadow: '0 0 20px #22d3ee, 0 0 40px #22d3ee' }}></div>
                <div className="absolute top-20 right-20 w-2 h-2 bg-blue-200 rounded-full animate-pulse" style={{ animationDelay: '0.5s', boxShadow: '0 0 15px #93c5fd, 0 0 30px #93c5fd' }}></div>
                <div className="absolute bottom-32 left-1/4 w-2.5 h-2.5 bg-cyan-200 rounded-full animate-pulse" style={{ animationDelay: '1s', boxShadow: '0 0 18px #67e8f9, 0 0 35px #67e8f9' }}></div>
                <div className="absolute top-1/3 right-1/3 w-2 h-2 bg-blue-300 rounded-full animate-pulse" style={{ animationDelay: '1.5s', boxShadow: '0 0 15px #60a5fa, 0 0 30px #60a5fa' }}></div>
                <div className="absolute bottom-20 right-1/4 w-3 h-3 bg-cyan-100 rounded-full animate-pulse" style={{ animationDelay: '2s', boxShadow: '0 0 20px #cffafe, 0 0 40px #cffafe' }}></div>
                <div className="absolute top-1/2 left-1/3 w-2 h-2 bg-blue-200 rounded-full animate-pulse" style={{ animationDelay: '2.5s', boxShadow: '0 0 15px #bfdbfe, 0 0 30px #bfdbfe' }}></div>
                <div className="absolute top-1/4 left-1/2 w-1.5 h-1.5 bg-white rounded-full animate-pulse" style={{ animationDelay: '0.8s', boxShadow: '0 0 12px #ffffff, 0 0 25px #ffffff' }}></div>
                <div className="absolute bottom-1/3 right-1/2 w-2 h-2 bg-cyan-200 rounded-full animate-pulse" style={{ animationDelay: '1.8s', boxShadow: '0 0 15px #a5f3fc, 0 0 30px #a5f3fc' }}></div>
              </div>
              <div className="relative items-center justify-center flex z-1">
                {/* <!-- ===== Common Grid Shape Start ===== --> */}
                <div className="flex flex-col items-center max-w-xs">
                  <div className="block mb-4 text-center select-none cursor-default">
                    <h1 className="text-5xl font-bold text-white dark:text-white font-tiny5">
                      ESTR
                    </h1>
                    <p className="text-m text-gray-300 dark:text-white/70 mt-1">
                      Electronic Suspicious Transaction Report
                    </p>
                  </div>
                </div>
              </div>
            </div>

          </div>
        </ThemeProvider>
      </div>
    </>
  );
}
