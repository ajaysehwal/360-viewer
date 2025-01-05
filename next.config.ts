import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  images: {
    domains: ["firebasestorage.googleapis.com","lh3.googleusercontent.com"],
  },

  async rewrites() {
    return [
      {
        source: "/3d/:path*",
        destination:
          "https://firebasestorage.googleapis.com/v0/b/dreamdesignarchitects-a95fc.appspot.com/:path*",
      },
    ];
  },
  experimental: {
    serverActions: {
      bodySizeLimit: "50mb",
    },
  },
};

export default nextConfig;
