# @campfire/cli

The Campfire command line. Campfire is a filesystem-native presentation
runtime: write slides in MDX, shape the story with React layouts, and present
from a live local shell.

## Usage

```sh
bunx @campfire/cli init my-deck
cd my-deck && bun install && bun dev
```

| Command | Description |
| --- | --- |
| `camp [dir]` | Start the presentation shell |
| `camp init [dir]` | Scaffold a new deck |
| `camp export [dir]` | Export the deck as a PDF |
| `camp validate [dir]` | Validate slides, layouts, and components |
| `camp inspect [dir]` | Print the project model |
| `camp add <items...>` | Install registry items (shadcn-compatible) |
| `camp slide <verb>` | Add, move, remove, rename, or update slides |

The binary is available as both `camp` and `campfire`.

## Documentation

https://campfire-deck.vercel.app

## License

[MIT](./LICENSE)
