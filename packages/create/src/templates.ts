export function packageJson(name: string): string {
  return `${JSON.stringify(
    {
      name,
      private: true,
      type: "module",
      scripts: {
        dev: "camp",
        validate: "camp validate",
        check: "ultracite check",
        format: "ultracite fix",
        "check-types": "tsc --noEmit",
      },
      dependencies: {
        clsx: "^2.1.1",
        react: "^19.2.7",
        "react-dom": "^19.2.7",
        "tailwind-merge": "^3.6.0",
      },
      devDependencies: {
        "@biomejs/biome": "^2.4.16",
        "@campfire/cli": "^0.0.1",
        "@types/react": "^19.2.17",
        "@types/react-dom": "^19.2.3",
        typescript: "^6.0.3",
        ultracite: "^7.8.2",
      },
    },
    null,
    2
  )}\n`;
}

export const TSCONFIG = `${JSON.stringify(
  {
    compilerOptions: {
      target: "ES2022",
      lib: ["ES2022", "DOM", "DOM.Iterable"],
      module: "preserve",
      moduleResolution: "bundler",
      jsx: "react-jsx",
      strict: true,
      noEmit: true,
      skipLibCheck: true,
      isolatedModules: true,
      paths: {
        "@/*": ["./*"],
      },
    },
    include: ["layouts", "components", "lib", "campfire.config.ts"],
  },
  null,
  2
)}\n`;

export const THEME_CSS = `@import "tailwindcss";

@source "./slides";
@source "./layouts";
@source "./components";

@theme {
  --font-sans: ui-sans-serif, system-ui, sans-serif;
  --color-background: oklch(1 0 0);
  --color-foreground: oklch(0.15 0 0);
  --color-primary: oklch(0.55 0.2 260);
  --color-muted: oklch(0.55 0.02 260);
}
`;

export const MDX_COMPONENTS = `import type { ComponentProps } from "react";

/** Base markdown rendering for every slide. Edit freely — this file is yours.
 * Anything defined here wins over discovered components. */
export const mdxComponents = {
  h1: (props: ComponentProps<"h1">) => (
    <h1 className="font-bold text-7xl tracking-tight" {...props} />
  ),
  h2: (props: ComponentProps<"h2">) => (
    <h2 className="font-semibold text-5xl tracking-tight" {...props} />
  ),
  h3: (props: ComponentProps<"h3">) => (
    <h3 className="font-semibold text-3xl" {...props} />
  ),
  p: (props: ComponentProps<"p">) => (
    <p className="text-2xl leading-relaxed" {...props} />
  ),
  ul: (props: ComponentProps<"ul">) => (
    <ul className="list-disc space-y-2 pl-8 text-2xl" {...props} />
  ),
  ol: (props: ComponentProps<"ol">) => (
    <ol className="list-decimal space-y-2 pl-8 text-2xl" {...props} />
  ),
  blockquote: (props: ComponentProps<"blockquote">) => (
    <blockquote className="border-l-4 pl-6 text-2xl italic opacity-80" {...props} />
  ),
  code: (props: ComponentProps<"code">) => (
    <code className="rounded bg-black/5 px-1.5 py-0.5 font-mono text-[0.9em]" {...props} />
  ),
  a: (props: ComponentProps<"a">) => (
    <a className="text-(--color-primary) underline" {...props} />
  ),
};
`;

export const LIB_UTILS = `import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

/** Merge class names; later classes win on Tailwind conflicts. */
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}
`;

export const FIRST_SLIDE = `---
title: Welcome to Campfire
---

# Welcome to Campfire

Edit \`slides/01-welcome.mdx\` and watch this update live.

- Slides are MDX files; filenames define order.
- Layouts and components are plain React in \`layouts/\` and \`components/\`.
- Install primitives with \`camp add metric-card\`.
`;

export const COMPONENTS_JSON = `${JSON.stringify(
  {
    $schema: "https://ui.shadcn.com/schema.json",
    style: "new-york",
    rsc: false,
    tsx: true,
    tailwind: {
      config: "",
      css: "theme.css",
      baseColor: "neutral",
      cssVariables: true,
    },
    aliases: {
      components: "@/components",
      ui: "@/components",
      lib: "@/lib",
      utils: "@/lib/utils",
      hooks: "@/hooks",
    },
  },
  null,
  2
)}\n`;

export const CAMPFIRE_CONFIG = `export default {
  // title: "My Presentation",
  // canvas: { width: 1280, height: 720 },
};
`;

export const BIOME_JSONC = `{
  "$schema": "https://biomejs.dev/schemas/2.4.16/schema.json",
  "extends": ["ultracite/biome/core"]
}
`;

export const GITIGNORE = `node_modules
.campfire
*.local
.DS_Store
`;

export const AGENTS_MD = `# Agent Instructions for Campfire

This is a Campfire presentation repository.

Campfire is filesystem-first. Edit files directly and use the CLI to inspect and validate the project.

## Commands

- \`camp\` starts the live presentation shell.
- \`camp validate\` validates slides, layouts, and components.
- \`camp inspect --json\` prints the project model.
- \`camp add <item>\` installs registry primitives or blocks.
- \`camp slide add <slug> [--title --layout --at N]\` creates a slide.
- \`camp slide move <slide> <position>\` reorders slides (renumbers files safely).
- \`camp slide remove|rename|update\` mutate existing slides.
- All commands accept \`--json\`; mutations accept \`--dry-run\`.

## Filesystem contract

- Slides live in \`slides/*.mdx\`.
- Slide filenames define order: \`01-title.mdx\`, \`02-problem.mdx\`.
- Layouts live in \`layouts/\` (registry installs land there too).
- Components live in \`components/\` (registry installs land there too).
- Base MDX markdown rendering lives in \`components/mdx.tsx\`.
- Static assets go in \`assets/\` (create it when needed); files are served from \`/\`.
- Styling lives in \`theme.css\` (Tailwind v4, CSS-first — no tailwind.config).
- Optional settings live in \`campfire.config.ts\` (deck title, canvas size).

## Slide rules

Slides are MDX files. Supported frontmatter: \`layout\`, \`title\`, \`notes\`.
\`layout\` is optional; slides without it use the built-in \`default\` layout.

Slides may use Markdown and any discovered component as JSX
(\`components/metric-card.tsx\` is available as \`<MetricCard />\`).

Slides must not use imports, exports, or arbitrary JavaScript. The dev server
rejects them and \`camp validate\` reports \`slide-esm\`.

## Layout rules

Layouts are React files that may import normally. They receive:

\`\`\`ts
type LayoutProps = {
  title?: string
  children: React.ReactNode
}
\`\`\`

Layouts render on a fixed canvas (default 1280x720) that the runtime scales
to fit; design against absolute canvas coordinates. Layouts should stay pure
and must not own presentation state.

## Component rules

Components are React files that may import normally. Component names are the
PascalCase of the filename and form a single flat namespace across
\`components/\` (directories are ignored; collisions are reported and the
file with the shallower path wins).

## Before finishing changes

\`\`\`bash
camp validate
bun run check
\`\`\`

Prefer small, file-based changes.
`;

export function readme(name: string): string {
  return `# ${name}

A [Campfire](https://campfire.dev) presentation.

\`\`\`bash
bun install
bun dev        # camp — live shell at http://localhost:3030
\`\`\`

- Write slides in \`slides/*.mdx\` (filename order is deck order).
- Style in \`theme.css\`, markdown rendering in \`components/mdx.tsx\`.
- Install primitives and layouts: \`camp add metric-card\`.
`;
}
