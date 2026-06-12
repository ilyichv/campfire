import { createMDX } from "fumadocs-mdx/next";

const withMDX = createMDX();

/** @type {import('next').NextConfig} */
const config = {
  reactStrictMode: true,
  transpilePackages: ["@campfire/registry"],
  serverExternalPackages: ["@takumi-rs/image-response"],
};

export default withMDX(config);
