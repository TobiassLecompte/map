import type { NextConfig } from "next";

const repoName = '/map'; 

const nextConfig: NextConfig = {
  // output: 'export',
  images: {
    unoptimized: true,
  },

  // basePath: repoName, 
};

export default nextConfig;