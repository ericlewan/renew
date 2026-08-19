import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* the rasteriser is a native module; it can't be bundled into an ESM chunk */
  serverExternalPackages: ['@resvg/resvg-js'],
  /* config options here */
};

export default nextConfig;
