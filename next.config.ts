import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactStrictMode: false, // Prevents double-mounting canvas audio/animation frames in dev
};

export default nextConfig;
