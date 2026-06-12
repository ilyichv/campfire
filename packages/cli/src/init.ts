import {
  existsSync,
  mkdirSync,
  readdirSync,
  readFileSync,
  writeFileSync,
} from "node:fs";
import { basename, join, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const TEMPLATES_DIR = fileURLToPath(new URL("../templates", import.meta.url));

// npm refuses to pack .gitignore files, so the template stores them without
// the leading dot and init restores it on copy.
const DOTFILES = new Set(["gitignore"]);

type InitOptions = {
  force?: boolean;
};

export function runInit(
  directory: string | undefined,
  options: InitOptions
): void {
  const target = resolve(process.cwd(), directory ?? ".");
  const name = basename(target);

  if (!options.force && existsSync(target) && readdirSync(target).length > 0) {
    console.error(
      `✗ ${directory ?? target} already exists and is not empty. Use --force to scaffold anyway.`
    );
    process.exit(1);
  }

  copyTemplate(join(TEMPLATES_DIR, "default"), target, name);

  const steps = [directory && `  cd ${directory}`, "  bun install", "  bun dev"]
    .filter(Boolean)
    .join("\n");
  console.log(`🔥 Created ${name}\n\nNext steps:\n${steps}\n`);
}

function copyTemplate(from: string, to: string, name: string): void {
  mkdirSync(to, { recursive: true });
  for (const entry of readdirSync(from, { withFileTypes: true })) {
    const source = join(from, entry.name);
    if (entry.isDirectory()) {
      copyTemplate(source, join(to, entry.name), name);
      continue;
    }
    const filename = DOTFILES.has(entry.name) ? `.${entry.name}` : entry.name;
    const content = readFileSync(source, "utf8").replaceAll("{{name}}", name);
    writeFileSync(join(to, filename), content);
  }
}
