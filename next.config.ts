import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  typescript: {
    ignoreBuildErrors: false, // ✅ Set true only if you want to skip TS errors
  },
};

export default nextConfig;
