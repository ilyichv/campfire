# {{name}}

A [Campfire](https://campfire-deck.vercel.app) presentation.

```bash
bun install
bun dev        # camp — live shell at http://localhost:3030
```

- Write slides in `slides/*.mdx` (filename order is deck order).
- Style in `theme.css`, markdown rendering in `components/mdx.tsx`.
- Install primitives and layouts: `camp add metric-card`.
- Ship it: `camp export` (PDF).
