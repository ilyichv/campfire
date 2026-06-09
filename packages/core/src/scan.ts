import { existsSync, readdirSync, readFileSync, statSync } from "node:fs";
import { join, relative } from "node:path";
import matter from "gray-matter";
import { z } from "zod";
import { baseNameWithoutExtension, parseSlideFilename, pascalCase } from "./names.js";
import type {
  ComponentFile,
  Diagnostic,
  LayoutFile,
  MdxComponentsFile,
  SlideFile,
  SourceKind,
  ThemeFile,
} from "./types.js";
import { REGISTRY_NAMESPACE } from "./types.js";

const frontmatterSchema = z
  .object({
    layout: z.string().optional(),
    title: z.string().optional(),
    notes: z.string().optional(),
  })
  .strict();

export type ScanResult = {
  slides: SlideFile[];
  layouts: LayoutFile[];
  components: ComponentFile[];
  mdxComponents?: MdxComponentsFile;
  theme?: ThemeFile;
  diagnostics: Diagnostic[];
};

function walkFiles(dir: string, extensions: string[]): string[] {
  if (!existsSync(dir)) {
    return [];
  }
  const files: string[] = [];
  for (const entry of readdirSync(dir, { withFileTypes: true })) {
    const full = join(dir, entry.name);
    if (entry.isDirectory()) {
      files.push(...walkFiles(full, extensions));
    } else if (extensions.some((ext) => entry.name.endsWith(ext))) {
      files.push(full);
    }
  }
  return files.sort();
}

function sourceKind(relativePath: string, baseDir: string): SourceKind {
  return relativePath.startsWith(`${baseDir}/${REGISTRY_NAMESPACE}/`)
    ? "registry"
    : "user";
}

export function scanSlides(root: string): {
  slides: SlideFile[];
  diagnostics: Diagnostic[];
} {
  const slidesDir = join(root, "slides");
  const diagnostics: Diagnostic[] = [];
  const slides: SlideFile[] = [];

  if (!existsSync(slidesDir)) {
    return {
      slides,
      diagnostics: [
        {
          level: "error",
          code: "missing-slides-dir",
          message: "No slides/ directory found.",
          suggestion: "Create slides/ and add MDX files like 01-title.mdx.",
        },
      ],
    };
  }

  for (const entry of readdirSync(slidesDir).sort()) {
    const absolutePath = join(slidesDir, entry);
    if (statSync(absolutePath).isDirectory()) {
      continue;
    }
    const parsed = parseSlideFilename(entry);
    if (!parsed) {
      diagnostics.push({
        level: "error",
        code: "invalid-slide-filename",
        message: `Slide filename "${entry}" does not match NN-slug.mdx.`,
        file: `slides/${entry}`,
        suggestion: "Rename it like 01-title.mdx (number prefix defines order).",
      });
      continue;
    }
    const raw = readFileSync(absolutePath, "utf8");
    let frontmatter: Record<string, unknown> = {};
    let body = raw;
    try {
      const parsedMatter = matter(raw);
      frontmatter = parsedMatter.data;
      body = parsedMatter.content;
    } catch (error) {
      diagnostics.push({
        level: "error",
        code: "invalid-frontmatter",
        message: `Could not parse frontmatter: ${
          error instanceof Error ? error.message : String(error)
        }`,
        file: `slides/${entry}`,
      });
    }
    const validated = frontmatterSchema.safeParse(frontmatter);
    if (!validated.success) {
      diagnostics.push({
        level: "error",
        code: "invalid-frontmatter",
        message: `Unsupported frontmatter in ${entry}: ${validated.error.issues
          .map((issue) => `${issue.path.join(".")}: ${issue.message}`)
          .join("; ")}`,
        file: `slides/${entry}`,
        suggestion: "Only `layout`, `title`, and `notes` are supported.",
      });
    }
    slides.push({
      id: parsed.id,
      number: parsed.number,
      slug: parsed.slug,
      path: `slides/${entry}`,
      absolutePath,
      frontmatter: validated.success ? validated.data : {},
      body,
    });
  }

  slides.sort((a, b) => a.number - b.number || a.slug.localeCompare(b.slug));
  return { slides, diagnostics };
}

export function scanLayouts(root: string): {
  layouts: LayoutFile[];
  diagnostics: Diagnostic[];
} {
  const layouts: LayoutFile[] = [];
  const diagnostics: Diagnostic[] = [];
  const seen = new Map<string, LayoutFile>();

  for (const absolutePath of walkFiles(join(root, "layouts"), [".tsx", ".jsx"])) {
    const path = relative(root, absolutePath);
    const layout: LayoutFile = {
      name: baseNameWithoutExtension(path),
      path,
      absolutePath,
      source: sourceKind(path, "layouts"),
    };
    const existing = seen.get(layout.name);
    if (existing) {
      diagnostics.push({
        level: "warning",
        code: "layout-collision",
        message: `Layout "${layout.name}" is defined in both ${existing.path} and ${path}. The user layout wins.`,
        file: path,
      });
      if (existing.source === "registry" && layout.source === "user") {
        seen.set(layout.name, layout);
      }
    } else {
      seen.set(layout.name, layout);
    }
  }

  layouts.push(...seen.values());
  return { layouts, diagnostics };
}

export function scanComponents(root: string): {
  components: ComponentFile[];
  mdxComponents?: MdxComponentsFile;
  diagnostics: Diagnostic[];
} {
  const diagnostics: Diagnostic[] = [];
  const seen = new Map<string, ComponentFile>();
  let mdxComponents: MdxComponentsFile | undefined;

  for (const absolutePath of walkFiles(join(root, "components"), [
    ".tsx",
    ".jsx",
  ])) {
    const path = relative(root, absolutePath);
    if (path === "components/mdx.tsx") {
      mdxComponents = { path, absolutePath };
      continue;
    }
    const component: ComponentFile = {
      name: pascalCase(baseNameWithoutExtension(path)),
      path,
      absolutePath,
      source: sourceKind(path, "components"),
    };
    const existing = seen.get(component.name);
    if (existing) {
      diagnostics.push({
        level: "warning",
        code: "component-collision",
        message: `Component "${component.name}" is defined in both ${existing.path} and ${path}. The user component wins.`,
        file: path,
        suggestion:
          "Component names form a flat namespace; rename one of the files.",
      });
      if (existing.source === "registry" && component.source === "user") {
        seen.set(component.name, component);
      }
    } else {
      seen.set(component.name, component);
    }
  }

  return { components: [...seen.values()], mdxComponents, diagnostics };
}

export function scanTheme(root: string): {
  theme?: ThemeFile;
  diagnostics: Diagnostic[];
} {
  const absolutePath = join(root, "theme.css");
  if (existsSync(absolutePath)) {
    return { theme: { path: "theme.css", absolutePath }, diagnostics: [] };
  }
  return {
    diagnostics: [
      {
        level: "warning",
        code: "missing-theme",
        message: "No theme.css found at the project root.",
        suggestion:
          'Create theme.css with `@import "tailwindcss";` and your design tokens.',
      },
    ],
  };
}
