import React from "react";

export default function NewGridShape() {
  return (
    <>
      {/* Subtle top-right glow */}
      <div className="absolute top-0 right-0 -z-10 w-[400px] h-[400px] xl:w-[600px] xl:h-[600px]">
        <div className="absolute inset-0 bg-gradient-to-br from-indigo-300/20 via-white/5 to-transparent blur-3xl rounded-full" />
      </div>

      {/* Subtle bottom-left glow */}
      <div className="absolute bottom-0 left-0 -z-10 w-[400px] h-[400px] xl:w-[600px] xl:h-[600px]">
        <div className="absolute inset-0 bg-gradient-to-tr from-sky-400/20 via-white/5 to-transparent blur-3xl rounded-full" />
      </div>

      {/* Optional light diagonal overlay for premium feel */}
      <div className="absolute inset-0 -z-20 bg-gradient-to-br from-transparent via-white/2 to-transparent opacity-10" />

      {/* Tiny soft dots pattern (very subtle texture) */}
      <svg
        className="absolute inset-0 -z-30 w-full h-full opacity-[0.04]"
        xmlns="http://www.w3.org/2000/svg"
      >
        <defs>
          <pattern
            id="dots"
            x="0"
            y="0"
            width="20"
            height="20"
            patternUnits="userSpaceOnUse"
          >
            <circle cx="1" cy="1" r="1" fill="white" />
          </pattern>
        </defs>
        <rect width="100%" height="100%" fill="url(#dots)" />
      </svg>
    </>
  );
}
