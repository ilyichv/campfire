# Contributing to Campfire

Thanks for your interest in Campfire!

## Setup

Campfire is a [Bun](https://bun.sh) + [Turborepo](https://turborepo.dev)
monorepo.

```sh
bun install
bun dev        # docs app + watch builds
bun run build  # build everything
```

## Repository layout

- `packages/core` — project engine: discovery, validation, mutations
- `packages/app` — browser shell and local runtime (Vite)
- `packages/cli` — the `camp` command line and init templates
- `registry/` — shadcn-compatible registry items
- `apps/docs` — docs site (Next.js + fumadocs), serves the registry at `/r`
- `examples/` — example decks

## Checks

Run these before opening a PR (CI enforces them):

```sh
bun run check        # lint/format (ultracite)
bun run fix          # auto-fix lint/format issues
bun run check-types  # typescript
bun run test         # bun test via turbo
bun run build
```

## Changesets

User-facing changes to `packages/*` need a changeset:

```sh
bunx changeset
```

Pick the affected packages and a semver bump, describe the change, and commit
the generated file with your PR. Docs-only or internal changes don't need one.
Releases are automated: merging the release PR that the changesets action
opens on `main` publishes to npm.

## Registry items

Items live in `registry/items` and follow the
[components.build](https://components.build) standard. `bun run registry:build`
regenerates `apps/docs/public/r`, which is committed.
