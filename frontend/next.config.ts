import type { NextConfig } from "next";
import path from "path";
import { fileURLToPath } from "url";

/** This app’s folder (…/frontend). Stops Next from picking a parent lockfile as the workspace root. */
const appRoot = path.dirname(fileURLToPath(import.meta.url));

/** Strip accidental markdown / quotes so rewrites get a valid http(s) origin. */
function sanitizeBackendOriginForRewrite(raw: string): string {
  let s = raw.trim().replace(/^\uFEFF/, "");
  if ((s.startsWith('"') && s.endsWith('"')) || (s.startsWith("'") && s.endsWith("'"))) {
    s = s.slice(1, -1).trim();
  }
  const mdLink = /\[https?:\/\/[^\]]+]\((https?:\/\/[^)]+)\)/i.exec(s);
  if (mdLink?.[1]) {
    s = mdLink[1].trim();
  }
  const bareUrl = /(https?:\/\/[^\s"'<>[\]()]+)/i.exec(s);
  if (bareUrl?.[1] && (s.includes("[") || s.includes("("))) {
    s = bareUrl[1].trim();
  }
  return s.replace(/\/$/, "");
}

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
  /**
   * Same-origin proxy: /api/proxy/:path* → backend origin + :path*
   * Development default destination: http://127.0.0.1:8080 (IPv4; avoids ::1 issues).
   * Restart `next dev` after changing BACKEND_URL.
   */
  async rewrites() {
    let raw =
      process.env.BACKEND_URL?.trim() ||
      process.env.INTERNAL_BACKEND_URL?.trim() ||
      process.env.LUXEGEN_BACKEND_URL?.trim() ||
      "";
    if (raw) {
      raw = sanitizeBackendOriginForRewrite(raw);
    }
    if (!raw) {
      const pub = process.env.NEXT_PUBLIC_API_URL?.trim();
      if (pub) {
        try {
          const u = new URL(sanitizeBackendOriginForRewrite(pub));
          raw = `${u.protocol}//${u.host}`;
        } catch {
          raw = "";
        }
      }
    }
    if (!raw && process.env.NODE_ENV === "development") {
      raw = "http://127.0.0.1:8080";
    }
    if (!raw) {
      return [];
    }
    let base = sanitizeBackendOriginForRewrite(raw);
    try {
      const u = new URL(base);
      if (u.protocol !== "http:" && u.protocol !== "https:") {
        return [];
      }
      if (u.hostname === "localhost") {
        u.hostname = "127.0.0.1";
      }
      base = `${u.protocol}//${u.host}`;
    } catch {
      return [];
    }
    const destination = `${base}/:path*`;
    return [{ source: "/api/proxy/:path*", destination }];
  },
};

export default nextConfig;
