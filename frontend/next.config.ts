import type { NextConfig } from "next";
import path from "path";
import { fileURLToPath } from "url";

/** This app’s folder (…/frontend). Stops Next from picking a parent lockfile as the workspace root. */
const appRoot = path.dirname(fileURLToPath(import.meta.url));

const nextConfig: NextConfig = {
  reactStrictMode: true,
  distDir: ".next",
  poweredByHeader: false,
  compress: true,
  productionBrowserSourceMaps: false,
  transpilePackages: ["react-syntax-highlighter", "react-live"],
  outputFileTracingRoot: appRoot,
  experimental: {
    optimizePackageImports: ["react-syntax-highlighter", "react-live"],
  },
  turbopack: {
    root: appRoot,
  },
  async headers() {
    return [
      {
        source: "/(.*)",
        headers: [
          {
            key: "X-Frame-Options",
            value: "DENY",
          },
          {
            key: "X-Content-Type-Options",
            value: "nosniff",
          },
          {
            key: "Referrer-Policy",
            value: "strict-origin-when-cross-origin",
          },
          {
            key: "X-XSS-Protection",
            value: "1; mode=block",
          },
          {
            key: "Permissions-Policy",
            value: "camera=(), microphone=(), geolocation=()",
          },
          {
            key: "Strict-Transport-Security",
            value: "max-age=31536000; includeSubDomains",
          },
        ],
      },
    ];
  },
  /**
   * Same-origin proxy: /api/proxy/:path* → backend origin + :path*
   * Development default destination: http://127.0.0.1:8080 (IPv4; avoids ::1 issues).
   * Restart `next dev` after changing BACKEND_URL.
   */
  async rewrites() {
    const forcedDestination = "http://127.0.0.1:8080/:path*";
    return [{ source: "/api/proxy/:path*", destination: forcedDestination }];
  },
};

export default nextConfig;
