import { defineConfig } from "tsdown";

export default defineConfig({
  entry: ["src/index.ts"],
  format: ["esm"],
  platform: "node",
  dts: false,
  clean: true,
  outputOptions: {
    banner: "#!/usr/bin/env bun",
  },
});
