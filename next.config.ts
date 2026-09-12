import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  async redirects() {
    return [
      { source: "/privacy", destination: "/privacy-policy", permanent: true },
      { source: "/our-farms", destination: "/our-process", permanent: true },
      { source: "/shipping-returns", destination: "/shipping-policy", permanent: true },
    ];
  },
};

export default nextConfig;
