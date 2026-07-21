import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactStrictMode: true,
  images: {
    deviceSizes: [320, 640, 768, 1080, 1440],
    imageSizes: [96, 128, 256],
    qualities: [75],
  },
};

export default nextConfig;
