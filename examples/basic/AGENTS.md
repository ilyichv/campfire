# Agent Instructions for Campfire

This is a Campfire presentation repository.

Campfire is filesystem-first. Edit files directly and use the CLI to inspect and validate the project.

## Commands

- `camp` starts the live presentation shell.
- `camp validate` validates slides, layouts, and components.
- `camp inspect --json` prints the project model.
- `camp add <item>` installs registry primitives or blocks.
- `camp slide add <slug> [--title --layout --at N]` creates a slide.
- `camp slide move <slide> <position>` reorders slides (renumbers files safely).
- `camp slide remove|rename|update` mutate existing slides.
- All commands accept `--json`; mutations accept `--dry-run`.

## Filesystem contract

- Slides live in `slides/*.mdx`.
- Slide filenames define order: `01-title.mdx`, `02-problem.mdx`.
- Layouts live in `layouts/`.
- Registry-installed layouts live in `layouts/campfire/`.
- Components live in `components/`.
- Registry-installed components live in `components/campfire/`.
- Base MDX markdown rendering lives in `components/mdx.tsx`.
- Assets live in `assets/` and are served from `/`.
- Styling lives in `theme.css` (Tailwind v4, CSS-first — no tailwind.config).
- Optional settings live in `campfire.config.ts` (deck title, canvas size).

## Slide rules

Slides are MDX files. Supported frontmatter: `layout`, `title`, `notes`.
`layout` is optional; slides without it use the built-in `default` layout.

Slides may use Markdown and any discovered component as JSX
(`components/metric-card.tsx` is available as `<MetricCard />`).

Slides must not use imports, exports, or arbitrary JavaScript. The dev server
rejects them and `camp validate` reports `slide-esm`.

## Layout rules

Layouts are React files that may import normally. They receive:

```ts
type LayoutProps = {
  title?: string
  children: React.ReactNode
}
```

Layouts render on a fixed canvas (default 1280x720) that the runtime scales
to fit; design against absolute canvas coordinates. Layouts should stay pure
and must not own presentation state.

## Component rules

Components are React files that may import normally. Component names are the
PascalCase of the filename and form a single flat namespace across
`components/` (directories are ignored; collisions are reported and the
user file wins).

## Before finishing changes

```bash
camp validate
bun run check
```

Prefer small, file-based changes.
