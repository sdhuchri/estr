import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactStrictMode: false,
  // basePath removed for Vercel deployment - app accessible at root URL
  // Enable Cache Components (PPR) - Next.js 16 syntax
  cacheComponents: true,
  // Image configuration
  images: {
    unoptimized: true, // Disable image optimization for static export compatibility
  },
  // Turbopack configuration for Next.js 16
  turbopack: {
    rules: {
      "*.svg": {
        loaders: ["@svgr/webpack"],
        as: "*.js",
      },
    },
  },
  // Keep webpack config for backward compatibility when using --webpack flag
  webpack(config) {
    config.module.rules.push({
      test: /\/svg$/,
      use: ["@svgr/webpack"],
    });
    return config;
  },
};

export default nextConfig;
