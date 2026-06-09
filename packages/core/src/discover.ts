import { existsSync, statSync } from "node:fs";
import { dirname, join, resolve } from "node:path";

/**
 * Walk upward from `cwd` until a directory containing `slides/` is found.
 * `slides/` alone marks a Campfire project root; config files are optional.
 */
export function discoverRoot(cwd: string): string | undefined {
  let current = resolve(cwd);
  while (true) {
    const slidesDir = join(current, "slides");
    if (existsSync(slidesDir) && statSync(slidesDir).isDirectory()) {
      return current;
    }
    const parent = dirname(current);
    if (parent === current) {
      return;
    }
    current = parent;
  }
}
