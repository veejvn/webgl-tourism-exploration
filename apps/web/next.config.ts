import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  reactCompiler: true,
  transpilePackages: ["@react-three/drei", "@react-three/fiber", "three"],
};

export default nextConfig;
