
import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactCompiler: true,

  // Optimized production server output
  output: "standalone",

  images: {
    unoptimized: true,
  },
};

export default nextConfig;
