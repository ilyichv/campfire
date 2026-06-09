import { spawnSync } from "node:child_process";
import { resolve } from "node:path";
import { cac } from "cac";
import {
  addSlide,
  discoverRoot,
  generateManifest,
  loadProject,
  moveSlide,
  removeSlide,
  renameSlide,
  updateSlide,
  validateProject,
} from "@campfire/core";
import { printDiagnostics, printJson, reportMutation } from "./output.js";

const REGISTRY_URL =
  process.env.CAMPFIRE_REGISTRY_URL ?? "https://campfire.dev/r";

function requireRoot(dir?: string): string {
  const root = discoverRoot(resolve(dir ?? process.cwd()));
  if (!root) {
    console.error(
      "✗ No Campfire project found. A project root is any directory containing slides/."
    );
    process.exit(1);
  }
  return root;
}

// cac matches single-word command names only, so `camp slide <verb>` runs
// through a nested instance fed argv without the "slide" token.
const slideCli = cac("camp slide");
const cli = cac("camp");

cli
  .command("[dir]", "Start the Campfire shell")
  .option("--port <port>", "Port to listen on", { default: 3030 })
  .option("--open", "Open the browser", { default: true })
  .action(async (dir: string | undefined, options: { port: number; open: boolean }) => {
    const root = requireRoot(dir);
    const { startCampfireApp } = await import("@campfire/app");
    const server = await startCampfireApp({
      root,
      port: Number(options.port),
      open: options.open,
    });
    const url =
      server.resolvedUrls?.local[0] ?? `http://localhost:${options.port}/`;
    console.log(`🔥 Campfire burning at ${url}`);
  });

cli
  .command("validate [dir]", "Validate slides, layouts, and components")
  .option("--json", "Machine-readable output")
  .action(async (dir: string | undefined, options: { json?: boolean }) => {
    const root = requireRoot(dir);
    const project = await loadProject({ root });
    const { valid, diagnostics } = validateProject(project);
    if (options.json) {
      printJson({ valid, diagnostics });
    } else {
      console.log(`${valid ? "✓" : "✗"} ${project.slides.length} slides`);
      console.log(`✓ ${project.layouts.length} layouts`);
      console.log(`✓ ${project.components.length} components`);
      if (diagnostics.length === 0) {
        console.log("✓ No diagnostics");
      } else {
        printDiagnostics(diagnostics);
      }
    }
    if (!valid) {
      process.exitCode = 1;
    }
  });

cli
  .command("inspect [dir]", "Print the project model")
  .option("--json", "Machine-readable output")
  .action(async (dir: string | undefined, options: { json?: boolean }) => {
    const root = requireRoot(dir);
    const project = await loadProject({ root });
    const manifest = generateManifest(project);
    if (options.json) {
      printJson(manifest);
      return;
    }
    console.log(`root: ${manifest.root}`);
    console.log(`canvas: ${manifest.canvas.width}x${manifest.canvas.height}`);
    console.log("slides:");
    for (const slide of manifest.slides) {
      console.log(
        `  ${slide.id}  layout=${slide.layout ?? "default"}${slide.title ? `  "${slide.title}"` : ""}`
      );
    }
    console.log("layouts:");
    for (const layout of manifest.layouts) {
      console.log(`  ${layout.name} (${layout.source})  ${layout.path}`);
    }
    console.log("components:");
    for (const component of manifest.components) {
      console.log(`  ${component.name} (${component.source})  ${component.path}`);
    }
    printDiagnostics(manifest.diagnostics);
  });

cli
  .command("add <...items>", "Install registry items (shadcn-compatible)")
  .action((items: string[]) => {
    const root = requireRoot();
    const urls = items.map((item) =>
      item.includes("://") || item.endsWith(".json")
        ? item
        : `${REGISTRY_URL}/${item}.json`
    );
    const result = spawnSync(
      "bunx",
      ["--bun", "shadcn@latest", "add", ...urls],
      { cwd: root, stdio: "inherit" }
    );
    process.exitCode = result.status ?? 1;
  });

slideCli
  .command("add <slug>", "Create a slide")
  .option("--title <title>", "Slide title")
  .option("--layout <layout>", "Layout name")
  .option("--notes <notes>", "Speaker notes")
  .option("--at <position>", "1-based position (defaults to the end)")
  .option("--dry-run", "Plan without writing")
  .option("--json", "Machine-readable output")
  .action(
    (
      slug: string,
      options: {
        title?: string;
        layout?: string;
        notes?: string;
        at?: number;
        dryRun?: boolean;
        json?: boolean;
      }
    ) => {
      const root = requireRoot();
      const result = addSlide(
        root,
        {
          slug,
          title: options.title,
          layout: options.layout,
          notes: options.notes,
          at: options.at === undefined ? undefined : Number(options.at),
        },
        { dryRun: options.dryRun }
      );
      reportMutation("add slide", result, options);
    }
  );

slideCli
  .command("move <slide> <to>", "Move a slide to a 1-based position")
  .option("--dry-run", "Plan without writing")
  .option("--json", "Machine-readable output")
  .action(
    (
      slide: string,
      to: string,
      options: { dryRun?: boolean; json?: boolean }
    ) => {
      const root = requireRoot();
      const result = moveSlide(root, slide, Number(to), {
        dryRun: options.dryRun,
      });
      reportMutation("move slide", result, options);
    }
  );

slideCli
  .command("remove <slide>", "Remove a slide")
  .option("--dry-run", "Plan without writing")
  .option("--json", "Machine-readable output")
  .action((slide: string, options: { dryRun?: boolean; json?: boolean }) => {
    const root = requireRoot();
    const result = removeSlide(root, slide, { dryRun: options.dryRun });
    reportMutation("remove slide", result, options);
  });

slideCli
  .command("rename <slide> <slug>", "Change a slide's slug")
  .option("--dry-run", "Plan without writing")
  .option("--json", "Machine-readable output")
  .action(
    (
      slide: string,
      slug: string,
      options: { dryRun?: boolean; json?: boolean }
    ) => {
      const root = requireRoot();
      const result = renameSlide(root, slide, slug, {
        dryRun: options.dryRun,
      });
      reportMutation("rename slide", result, options);
    }
  );

slideCli
  .command("update <slide>", "Update a slide's frontmatter or body")
  .option("--title <title>", "New title")
  .option("--layout <layout>", "New layout")
  .option("--notes <notes>", "New speaker notes")
  .option("--body <body>", "Replace the MDX body")
  .option("--clear <fields>", "Comma-separated fields to clear (title,layout,notes)")
  .option("--dry-run", "Plan without writing")
  .option("--json", "Machine-readable output")
  .action(
    (
      slide: string,
      options: {
        title?: string;
        layout?: string;
        notes?: string;
        body?: string;
        clear?: string;
        dryRun?: boolean;
        json?: boolean;
      }
    ) => {
      const root = requireRoot();
      const cleared = new Set(
        (options.clear ?? "").split(",").map((field) => field.trim())
      );
      const field = (name: "title" | "layout" | "notes") =>
        cleared.has(name) ? null : options[name];
      const result = updateSlide(
        root,
        slide,
        {
          title: field("title"),
          layout: field("layout"),
          notes: field("notes"),
          body: options.body,
        },
        { dryRun: options.dryRun }
      );
      reportMutation("update slide", result, options);
    }
  );

cli.help();
cli.version("0.0.1");
slideCli.help();
slideCli.version("0.0.1");

if (process.argv[2] === "slide") {
  slideCli.parse([
    ...process.argv.slice(0, 2),
    ...process.argv.slice(3),
  ]);
} else {
  cli.parse();
}
