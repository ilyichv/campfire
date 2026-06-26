import { join, relative } from "node:path";
import { fileURLToPath } from "node:url";
import {
  DEFAULT_LAYOUT_NAME,
  generateManifest,
  loadProject,
  type PresentationProject,
} from "@campfire-deck/core";
import mdx from "@mdx-js/rollup";
import remarkFrontmatter from "remark-frontmatter";
import remarkGfm from "remark-gfm";
import type { Plugin, ViteDevServer } from "vite";

const VIRTUAL_PREFIX = "virtual:campfire/";
const RESOLVED_PREFIX = "\0virtual:campfire/";

const MODULE_IDS = [
  "project",
  "slides",
  "layouts",
  "components",
  "mdx-components",
] as const;

const OPENING_BRACE_PATTERN = /^\{/;
const MDX_FILE_PATTERN = /\.mdx$/;

type CampfirePluginOptions = {
  /** Absolute path of the presentation project root. */
  root: string;
};

/** Top-level ESM is forbidden in slides; this is the authoritative
 * enforcement of the "slides never import" contract. */
function remarkForbidEsm() {
  return (tree: { children?: { type: string }[] }, file: { path?: string }) => {
    if (tree.children?.some((node) => node.type === "mdxjsEsm")) {
      throw new Error(
        `Slides never import or export${
          file.path ? ` (${file.path})` : ""
        }. Components in components/ are available automatically; move code into a component file.`
      );
    }
  };
}

function clientFile(name: string): string {
  return fileURLToPath(new URL(`../client/${name}`, import.meta.url));
}

function moduleCode(project: PresentationProject, id: string): string {
  switch (id) {
    case "project":
      return `export default ${JSON.stringify(generateManifest(project), null, 2)};`;
    case "slides": {
      const imports = project.slides
        .map(
          (slide, index) =>
            `import slide_${index} from ${JSON.stringify(slide.absolutePath)};`
        )
        .join("\n");
      const entries = project.slides
        .map((slide, index) =>
          JSON.stringify({
            id: slide.id,
            number: slide.number,
            slug: slide.slug,
            path: slide.path,
            layout: slide.frontmatter.layout,
            title: slide.frontmatter.title,
            notes: slide.frontmatter.notes,
          }).replace(OPENING_BRACE_PATTERN, `{ Component: slide_${index}, `)
        )
        .join(",\n  ");
      return `${imports}\nexport const slides = [\n  ${entries}\n];`;
    }
    case "layouts": {
      const userDefault = project.layouts.some(
        (layout) => layout.name === DEFAULT_LAYOUT_NAME
      );
      const imports = project.layouts
        .map(
          (layout, index) =>
            `import layout_${index} from ${JSON.stringify(layout.absolutePath)};`
        )
        .join("\n");
      const entries = project.layouts
        .map(
          (layout, index) => `${JSON.stringify(layout.name)}: layout_${index}`
        )
        .join(",\n  ");
      const builtin = userDefault
        ? ""
        : `import builtinDefault from ${JSON.stringify(clientFile("default-layout.tsx"))};\n`;
      return `${builtin}${imports}\nexport const layouts = {\n  ${
        userDefault
          ? ""
          : `${JSON.stringify(DEFAULT_LAYOUT_NAME)}: builtinDefault,\n  `
      }${entries}\n};`;
    }
    case "components": {
      const imports = project.components
        .map(
          (component, index) =>
            `import * as component_${index} from ${JSON.stringify(component.absolutePath)};`
        )
        .join("\n");
      const entries = project.components
        .map(
          (component, index) =>
            `${JSON.stringify(component.name)}: component_${index}.default ?? component_${index}[${JSON.stringify(component.name)}]`
        )
        .join(",\n  ");
      return `${imports}\nexport const components = {\n  ${entries}\n};`;
    }
    case "mdx-components": {
      if (!project.mdxComponents) {
        return "export const mdxComponents = {};";
      }
      return `import * as mod from ${JSON.stringify(project.mdxComponents.absolutePath)};
export const mdxComponents = mod.mdxComponents ?? mod.default ?? {};`;
    }
    default:
      throw new Error(`Unknown campfire virtual module: ${id}`);
  }
}

export function campfirePlugin(options: CampfirePluginOptions): Plugin[] {
  const root = options.root;
  let projectPromise = loadProject({ root });

  const reload = async (server: ViteDevServer) => {
    projectPromise = loadProject({ root });
    await projectPromise;
    for (const id of MODULE_IDS) {
      const mod = server.moduleGraph.getModuleById(RESOLVED_PREFIX + id);
      if (mod) {
        server.moduleGraph.invalidateModule(mod);
      }
    }
    server.ws.send({ type: "full-reload" });
  };

  const campfire: Plugin = {
    name: "campfire",
    enforce: "pre",

    async resolveId(id) {
      if (id === `${VIRTUAL_PREFIX}theme.css`) {
        const project = await projectPromise;
        return project.theme?.absolutePath ?? `${RESOLVED_PREFIX}theme.css`;
      }
      if (id.startsWith(VIRTUAL_PREFIX)) {
        return RESOLVED_PREFIX + id.slice(VIRTUAL_PREFIX.length);
      }
      return null;
    },

    async load(id) {
      if (id === `${RESOLVED_PREFIX}theme.css`) {
        return "/* no theme.css found in this project */";
      }
      if (id.startsWith(RESOLVED_PREFIX)) {
        const project = await projectPromise;
        return moduleCode(project, id.slice(RESOLVED_PREFIX.length));
      }
      return null;
    },

    configureServer(server) {
      const watched = ["slides", "layouts", "components"].map((dir) =>
        join(root, dir)
      );
      server.watcher.add([...watched, join(root, "campfire.config.ts")]);

      let timer: ReturnType<typeof setTimeout> | undefined;
      const scheduleReload = () => {
        clearTimeout(timer);
        timer = setTimeout(() => {
          reload(server).catch((error) => {
            server.config.logger.error(`[campfire] reload failed: ${error}`);
          });
        }, 50);
      };

      const isProjectFile = (file: string) => {
        const rel = relative(root, file);
        return (
          !rel.startsWith("..") &&
          (rel.startsWith("slides/") ||
            rel.startsWith("layouts/") ||
            rel.startsWith("components/") ||
            rel.startsWith("campfire.config."))
        );
      };

      // Structure changes (new/removed files) always rebuild the project
      // graph. Content edits of existing modules go through Vite's own HMR;
      // .mdx and config edits also affect the manifest, so rebuild for those.
      server.watcher.on("add", (file) => {
        if (isProjectFile(file)) {
          scheduleReload();
        }
      });
      server.watcher.on("unlink", (file) => {
        if (isProjectFile(file)) {
          scheduleReload();
        }
      });
      server.watcher.on("change", (file) => {
        if (
          isProjectFile(file) &&
          (file.endsWith(".mdx") || file.includes("campfire.config."))
        ) {
          scheduleReload();
        }
      });
    },
  };

  const mdxPlugin = mdx({
    include: MDX_FILE_PATTERN,
    jsxImportSource: "react",
    development: true,
    remarkPlugins: [remarkFrontmatter, remarkGfm, remarkForbidEsm],
  }) as Plugin;
  mdxPlugin.enforce = "pre";

  return [campfire, mdxPlugin];
}
