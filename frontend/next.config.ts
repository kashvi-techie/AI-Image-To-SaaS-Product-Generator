import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactStrictMode: true,
  poweredByHeader: false,
  compress: true,
  productionBrowserSourceMaps: false,
  transpilePackages: ["react-syntax-highlighter", "react-live"],
  experimental: {
    optimizePackageImports: ["react-syntax-highlighter", "react-live"],
  },
};

export default nextConfig;
