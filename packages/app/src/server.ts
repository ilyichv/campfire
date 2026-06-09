import { existsSync, realpathSync } from "node:fs";
import { join } from "node:path";
import { fileURLToPath } from "node:url";
import tailwindcss from "@tailwindcss/vite";
import react from "@vitejs/plugin-react";
import { createServer, searchForWorkspaceRoot, type ViteDevServer } from "vite";
import { campfirePlugin } from "./plugin.js";

export type StartCampfireAppOptions = {
  /** Absolute path of the presentation project root. */
  root: string;
  port?: number;
  open?: boolean;
};

export async function startCampfireApp(
  options: StartCampfireAppOptions
): Promise<ViteDevServer> {
  const clientRoot = realpathSync(
    fileURLToPath(new URL("../client", import.meta.url))
  );
  // Vite's fs allow-list compares realpaths (e.g. /tmp -> /private/tmp on
  // macOS), so symlinked project roots must be resolved up front.
  const root = realpathSync(options.root);
  const assetsDir = join(root, "assets");

  const server = await createServer({
    configFile: false,
    root: clientRoot,
    publicDir: existsSync(assetsDir) ? assetsDir : false,
    cacheDir: join(root, "node_modules", ".campfire"),
    clearScreen: false,
    plugins: [...campfirePlugin({ root }), react(), tailwindcss()],
    resolve: {
      dedupe: ["react", "react-dom"],
    },
    server: {
      port: options.port ?? 3030,
      open: options.open ?? true,
      fs: {
        allow: [
          clientRoot,
          root,
          searchForWorkspaceRoot(root),
          searchForWorkspaceRoot(clientRoot),
        ],
      },
    },
  });

  await server.listen();
  return server;
}
