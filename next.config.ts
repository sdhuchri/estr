import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactStrictMode: false,
  basePath: "/estr",
  // Enable Cache Components (PPR) - Next.js 16 syntax
  cacheComponents: true,
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
