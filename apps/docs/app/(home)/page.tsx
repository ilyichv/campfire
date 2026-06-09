import Link from "next/link";

export default function HomePage() {
  return (
    <div className="flex flex-1 flex-col items-center justify-center gap-6 px-6 text-center">
      <span aria-hidden className="text-6xl">
        🔥
      </span>
      <h1 className="font-bold text-4xl tracking-tight">Campfire</h1>
      <p className="max-w-xl text-fd-muted-foreground text-lg">
        A filesystem-native presentation runtime. Write slides in MDX, shape
        the story with React layouts, and present from a live local shell.
      </p>
      <pre className="rounded-lg border bg-fd-secondary px-6 py-3 text-left text-sm">
        bun create campfire my-deck
      </pre>
      <div className="flex gap-4">
        <Link
          className="rounded-full bg-fd-primary px-6 py-2 font-medium text-fd-primary-foreground text-sm"
          href="/docs"
        >
          Documentation
        </Link>
        <Link
          className="rounded-full border px-6 py-2 font-medium text-sm"
          href="/docs/registry"
        >
          Registry
        </Link>
      </div>
    </div>
  );
}
