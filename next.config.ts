import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "images.unsplash.com",
      }
    ]
  },
  async rewrites() {
    return [
      {
        source: '/api/:path*',
        destination: 'http://localhost:8001/api/:path*',
      },
    ];
  },
  // Increase timeout for slow AWS API calls
  experimental: {
    proxyTimeout: 60000, // 60 seconds
  },
  // Prevent connection issues
  httpAgentOptions: {
    keepAlive: true,
  },
};

export default nextConfig;
