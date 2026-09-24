import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  typescript: {
    ignoreBuildErrors: true,
  },
  async redirects() {
    return [
      { source: "/panel", destination: "/yonetici", permanent: false },
      { source: "/panel/:path*", destination: "/yonetici/:path*", permanent: false },
    ];
  },
  async rewrites() {
    return [
      { source: "/yonetici", destination: "/panel" },
      { source: "/yonetici/:path*", destination: "/panel/:path*" },
      { source: "/yönetici", destination: "/panel" },
      { source: "/yönetici/:path*", destination: "/panel/:path*" },
    ];
  },
};

export default nextConfig;
