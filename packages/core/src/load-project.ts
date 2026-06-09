import { resolve } from "node:path";
import { loadConfig, resolveCanvas } from "./config.js";
import { discoverRoot } from "./discover.js";
import { findEsmStatements, findJsxComponentNames } from "./mdx-analysis.js";
import { scanComponents, scanLayouts, scanSlides, scanTheme } from "./scan.js";
import type { Diagnostic, PresentationProject, SlideFile } from "./types.js";
import { DEFAULT_LAYOUT_NAME } from "./types.js";

export type LoadProjectOptions = {
  /** Directory to start root discovery from. Defaults to process.cwd(). */
  cwd?: string;
  /** Skip discovery and treat this directory as the project root. */
  root?: string;
};

export class ProjectNotFoundError extends Error {
  constructor(cwd: string) {
    super(
      `No Campfire project found from ${cwd}. A project root is any directory containing slides/.`
    );
    this.name = "ProjectNotFoundError";
  }
}

function slideDiagnostics(
  slides: SlideFile[],
  layoutNames: Set<string>,
  componentNames: Set<string>
): Diagnostic[] {
  const diagnostics: Diagnostic[] = [];
  const numbersSeen = new Map<number, string>();

  for (const slide of slides) {
    const existing = numbersSeen.get(slide.number);
    if (existing) {
      diagnostics.push({
        level: "error",
        code: "duplicate-slide-number",
        message: `Slides "${existing}" and "${slide.id}" share number ${slide.number}.`,
        file: slide.path,
        suggestion: "Run `camp slide move` or renumber the files.",
      });
    } else {
      numbersSeen.set(slide.number, slide.id);
    }

    const layout = slide.frontmatter.layout;
    if (layout && layout !== DEFAULT_LAYOUT_NAME && !layoutNames.has(layout)) {
      diagnostics.push({
        level: "error",
        code: "missing-layout",
        message: `Slide "${slide.id}" uses layout "${layout}" but no ${layout}.tsx exists under layouts/.`,
        file: slide.path,
        suggestion: `Create the layout or install one: camp add ${layout}`,
      });
    }

    for (const statement of findEsmStatements(slide.body)) {
      diagnostics.push({
        level: "error",
        code: "slide-esm",
        message: `Slide "${slide.id}" contains an import/export statement: \`${statement}\`. Slides never import.`,
        file: slide.path,
        suggestion:
          "Components in components/ are available to slides automatically.",
      });
    }

    for (const name of findJsxComponentNames(slide.body)) {
      if (!componentNames.has(name)) {
        diagnostics.push({
          level: "warning",
          code: "unknown-component",
          message: `Slide "${slide.id}" uses <${name}> but no matching component file was found.`,
          file: slide.path,
          suggestion: `Create components/${name
            .replace(/([a-z0-9])([A-Z])/g, "$1-$2")
            .toLowerCase()}.tsx or install it from the registry.`,
        });
      }
    }

    if (slide.body.trim() === "") {
      diagnostics.push({
        level: "info",
        code: "empty-slide",
        message: `Slide "${slide.id}" has no content.`,
        file: slide.path,
      });
    }
  }

  return diagnostics;
}

export async function loadProject(
  options: LoadProjectOptions = {}
): Promise<PresentationProject> {
  const root = options.root
    ? resolve(options.root)
    : discoverRoot(options.cwd ?? process.cwd());
  if (!root) {
    throw new ProjectNotFoundError(options.cwd ?? process.cwd());
  }

  const [{ config, diagnostics: configDiagnostics }] = await Promise.all([
    loadConfig(root),
  ]);
  const slidesScan = scanSlides(root);
  const layoutsScan = scanLayouts(root);
  const componentsScan = scanComponents(root);
  const themeScan = scanTheme(root);

  const layoutNames = new Set(layoutsScan.layouts.map((layout) => layout.name));
  const componentNames = new Set(
    componentsScan.components.map((component) => component.name)
  );

  return {
    root,
    title: config?.title,
    canvas: resolveCanvas(config),
    slides: slidesScan.slides,
    layouts: layoutsScan.layouts,
    components: componentsScan.components,
    mdxComponents: componentsScan.mdxComponents,
    theme: themeScan.theme,
    config,
    diagnostics: [
      ...configDiagnostics,
      ...slidesScan.diagnostics,
      ...layoutsScan.diagnostics,
      ...componentsScan.diagnostics,
      ...themeScan.diagnostics,
      ...slideDiagnostics(slidesScan.slides, layoutNames, componentNames),
    ],
  };
}
