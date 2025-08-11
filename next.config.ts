import type { NextConfig } from "next";

/** @type {import('next').NextConfig} */
const nextConfig = {
    transpilePackages: ["react-well-plates", "well-plates"],
};

export default nextConfig;
