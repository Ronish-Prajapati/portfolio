import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactStrictMode: true,
  // This project lives in a nested folder; pin the tracing root to silence the
  // multiple-lockfile warning and ensure correct output tracing on Vercel.
  outputFileTracingRoot: __dirname,
  images: {
    // Adds 1600/2400 steps so the layered hero can pick sensible sizes.
    deviceSizes: [640, 750, 828, 1080, 1200, 1600, 1920, 2400, 3200],
    remotePatterns: [
      {
        protocol: "https",
        hostname: "res.cloudinary.com",
      },
      {
        protocol: "https",
        hostname: "images.unsplash.com",
      },
    ],
  },
  eslint: {
    // Lint is run separately; don't fail production builds on lint.
    ignoreDuringBuilds: true,
  },
};

export default nextConfig;
