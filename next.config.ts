import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Optimize barrel imports for better bundle size and faster builds
  // Rule: bundle-barrel-imports (CRITICAL)
  experimental: {
    optimizePackageImports: [
      "lucide-react",
      "@radix-ui/react-icons",
    ],
  },
  // Image optimization for external sources
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "**",
      },
    ],
  },
};

export default nextConfig;
