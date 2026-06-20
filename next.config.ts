import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Nesting it under experimental resolves the TypeScript definition error in many Next.js versions
  experimental: {
    serverActions: {
      bodySizeLimit: "10mb",
    },
  },

  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "cloud.appwrite.io",
        pathname: "/v1/storage/buckets/**",
      },
    ],
  },
};

export default nextConfig;
