import Image from "next/image";
import Link from "next/link";

export default function HomePage() {
  return (
    <div className="relative flex flex-1 flex-col items-center justify-center gap-6 overflow-hidden px-6 text-center">
      <div
        aria-hidden
        className="cf-glow pointer-events-none absolute top-[8%] left-1/2 h-72 w-72 -translate-x-1/2 rounded-full bg-fd-primary/25 blur-3xl"
      />
      <div className="cf-rise cf-float relative">
        <Image
          alt="Campfire logo: a campfire wearing a cowboy hat"
          height={168}
          priority
          src="/logo.png"
          width={168}
        />
      </div>
      <h1 className="cf-rise font-display font-semibold text-5xl tracking-tight [animation-delay:90ms] sm:text-6xl">
        Campfire
      </h1>
      <p className="cf-rise max-w-xl text-fd-muted-foreground text-lg [animation-delay:160ms]">
        A filesystem-native presentation runtime. Write slides in MDX, shape the
        story with React layouts, and present from a live local shell.
      </p>
      <pre className="cf-rise rounded-lg border border-fd-border bg-fd-card px-6 py-3 text-left text-sm shadow-sm [animation-delay:230ms]">
        <span aria-hidden className="select-none text-fd-primary">
          ${" "}
        </span>
        bunx @campfire-deck/cli init my-deck
      </pre>
      <div className="cf-rise flex gap-4 [animation-delay:300ms]">
        <Link
          className="rounded-full bg-fd-primary px-6 py-2 font-medium text-fd-primary-foreground text-sm transition-transform hover:scale-[1.03]"
          href="/docs"
        >
          Documentation
        </Link>
        <Link
          className="rounded-full border border-fd-border px-6 py-2 font-medium text-sm transition-colors hover:bg-fd-accent"
          href="/docs/registry"
        >
          Registry
        </Link>
      </div>
    </div>
  );
}
