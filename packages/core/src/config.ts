import { existsSync } from "node:fs";
import { join } from "node:path";
import { pathToFileURL } from "node:url";
import { z } from "zod";
import type { CampfireConfig, Canvas, Diagnostic } from "./types.js";
import { DEFAULT_CANVAS } from "./types.js";

const configSchema = z
  .object({
    title: z.string().optional(),
    canvas: z
      .object({
        width: z.number().int().positive().optional(),
        height: z.number().int().positive().optional(),
      })
      .optional(),
  })
  .strict();

const CONFIG_FILENAMES = [
  "campfire.config.ts",
  "campfire.config.js",
  "campfire.config.mjs",
];

export type LoadedConfig = {
  config?: CampfireConfig;
  diagnostics: Diagnostic[];
};

export async function loadConfig(root: string): Promise<LoadedConfig> {
  const filename = CONFIG_FILENAMES.find((name) =>
    existsSync(join(root, name))
  );
  if (!filename) {
    return { diagnostics: [] };
  }
  try {
    const module = await import(pathToFileURL(join(root, filename)).href);
    const parsed = configSchema.safeParse(module.default ?? {});
    if (!parsed.success) {
      return {
        diagnostics: [
          {
            level: "error",
            code: "invalid-config",
            message: `Invalid ${filename}: ${parsed.error.issues
              .map((issue) => `${issue.path.join(".")}: ${issue.message}`)
              .join("; ")}`,
            file: filename,
            suggestion:
              "Export a default object with optional `title` and `canvas: { width, height }`.",
          },
        ],
      };
    }
    return { config: parsed.data, diagnostics: [] };
  } catch (error) {
    return {
      diagnostics: [
        {
          level: "error",
          code: "invalid-config",
          message: `Failed to load ${filename}: ${
            error instanceof Error ? error.message : String(error)
          }`,
          file: filename,
        },
      ],
    };
  }
}

export function resolveCanvas(config?: CampfireConfig): Canvas {
  return {
    width: config?.canvas?.width ?? DEFAULT_CANVAS.width,
    height: config?.canvas?.height ?? DEFAULT_CANVAS.height,
  };
}
