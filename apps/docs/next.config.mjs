import { createMDX } from "fumadocs-mdx/next";

const withMDX = createMDX();

/** @type {import('next').NextConfig} */
const config = {
  reactStrictMode: true,
  transpilePackages: ["@campfire-deck/registry"],
  serverExternalPackages: ["@takumi-rs/image-response"],
};

export default withMDX(config);
