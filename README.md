<img width="350" height="350" alt="Campfire" src="https://github.com/user-attachments/assets/69c6c526-3c72-41ef-8db7-4f2820213ad8" />


# 🔥 Campfire

**A filesystem-native presentation runtime.** Write slides in MDX, shape the
story with React layouts, and present from a live local shell.

```bash
bunx @campfire-deck/cli init my-deck
cd my-deck && bun install
bun dev          # camp — live shell at http://localhost:3030
```

Campfire is not a slide builder, a CMS, or an AI generator. It watches a
presentation repository — slides, layouts, components, theme — and serves a
live browser shell with hot reload, diagnostics, and a presentation mode.
Slides render on a fixed logical canvas (1280×720 by default) scaled to fit
every surface. When the deck is ready to leave the campfire, `camp export` 
produces a vector PDF.

## Monorepo

| Path | Package | What it is |
| ---- | ------- | ---------- |
| `packages/core` | `@campfire-deck/core` | Project engine: discovery, scanning, validation, diagnostics, slide mutations |
| `packages/app` | `@campfire-deck/app` | Browser shell + Vite runtime: virtual modules, MDX pipeline, canvas, HMR, PDF export |
| `packages/cli` | `@campfire-deck/cli` | `camp` / `campfire` bins: shell, init, export, validate, inspect, add, `slide` mutations |
| `registry/` | `@campfire-deck/registry` | shadcn-compatible registry items (built into the docs app) |
| `apps/docs` | `docs` | Fumadocs site: documentation + registry at `/r/<item>.json` |
| `examples/basic` | — | A Campfire deck built with registry items |

## Development

```bash
bun install
bun run build          # turbo: all packages + docs
bun run test           # bun test (core)
bun run check-types    # tsc everywhere
bun run check          # ultracite/biome
bun run registry:build # rebuild registry JSON into apps/docs/public/r
```

Try the example deck:

```bash
cd examples/basic
./node_modules/.bin/camp --no-open
```

## Conventions

- Slide filenames define order: `01-title.mdx`, `02-problem.mdx`. The
  filename is the contract.
- Slide frontmatter supports exactly `layout`, `title`, `notes` — `layout`
  is optional and falls back to the built-in `default` layout.
- **Slides never import.** The MDX pipeline rejects ESM in slides;
  `camp validate` reports it as `slide-esm`.
- Registry code installs straight into `layouts/` and `components/`, next to
  user code. Names form a flat namespace; on collision the shallower path
  wins with a warning.
- Tailwind v4, CSS-first: a single `theme.css`, no `tailwind.config`.
- Everything builds with rolldown (`tsdown` for packages, Vite 8 for the
  runtime).

## Roadmap

Presenting and distribution are where Campfire grows next. Nothing here is
promised; it's the order we'd build in.

**Presenting**

- **Presenter view** — current slide, next-slide preview, the `notes`
  frontmatter, and an elapsed timer in a second window, synced to the
  audience shell over `BroadcastChannel`.
- **Incremental reveal** — step through a slide before advancing to the next,
  giving the runtime counterpart to the `step` registry item.
- **Slide transitions** — fade/slide between slides via the View Transitions
  API, since the runtime owns navigation.

**Authoring**

- **`draft` frontmatter** — skip a slide in present and export while keeping
  it in the repo.
- **Code highlighting** — Shiki with line-highlight ranges for technical
  decks.
- **More mutations** — `camp slide duplicate`, and a `renumber` that closes
  gaps left by deletions.
- **Overflow diagnostics** — headless render of each slide against the fixed
  canvas, reporting clipped content as a `camp validate` diagnostic.

**Export & distribution**

- **More export formats** — `camp export` grows a format argument: static HTML
  so decks ship as a shareable URL, and per-slide PNG for OG images and README
  previews (the render step overflow diagnostics need anyway).
- **Handout PDF** — slide plus notes per page, built on the existing print
  route.

**Ecosystem**

- **Registry themes** — curated `registry:theme` items showcasing the
  CSS-first design system.
