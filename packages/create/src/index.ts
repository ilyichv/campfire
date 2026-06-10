import { existsSync, mkdirSync, readdirSync, writeFileSync } from "node:fs";
import { basename, dirname, join, resolve } from "node:path";
import {
  AGENTS_MD,
  BIOME_JSONC,
  CAMPFIRE_CONFIG,
  COMPONENTS_JSON,
  FIRST_SLIDE,
  GITIGNORE,
  LIB_UTILS,
  MDX_COMPONENTS,
  packageJson,
  readme,
  THEME_CSS,
  TSCONFIG,
} from "./templates.js";

const directoryArg = process.argv[2];

if (!directoryArg || directoryArg.startsWith("-")) {
  console.log("Usage: bun create campfire <directory>");
  process.exit(1);
}

const target = resolve(process.cwd(), directoryArg);
const name = basename(target);

if (existsSync(target) && readdirSync(target).length > 0) {
  console.error(`✗ ${directoryArg} already exists and is not empty.`);
  process.exit(1);
}

const files: Record<string, string> = {
  "package.json": packageJson(name),
  "tsconfig.json": TSCONFIG,
  "theme.css": THEME_CSS,
  "campfire.config.ts": CAMPFIRE_CONFIG,
  "components.json": COMPONENTS_JSON,
  "biome.jsonc": BIOME_JSONC,
  ".gitignore": GITIGNORE,
  "AGENTS.md": AGENTS_MD,
  "README.md": readme(name),
  "slides/01-welcome.mdx": FIRST_SLIDE,
  "components/mdx.tsx": MDX_COMPONENTS,
  "lib/utils.ts": LIB_UTILS,
};

for (const [relativePath, content] of Object.entries(files)) {
  const absolute = join(target, relativePath);
  mkdirSync(dirname(absolute), { recursive: true });
  writeFileSync(absolute, content);
}

console.log(`🔥 Created ${name}

Next steps:
  cd ${directoryArg}
  bun install
  bun dev
`);
