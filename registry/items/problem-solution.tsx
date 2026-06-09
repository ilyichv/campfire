import type { ReactNode } from "react";

/** Pair with the Problem and Solution components installed alongside:
 *
 * ```mdx
 * <Problem>Decks rot in proprietary tools.</Problem>
 * <Solution>Slides are files; the repo is the deck.</Solution>
 * ```
 */
export default function ProblemSolutionLayout({
  title,
  children,
}: {
  title?: string;
  children: ReactNode;
}) {
  return (
    <main className="flex h-full flex-col gap-10 p-24">
      {title ? (
        <h1 className="font-bold text-6xl tracking-tight">{title}</h1>
      ) : null}
      <div className="grid flex-1 grid-cols-2 items-stretch gap-10">
        {children}
      </div>
    </main>
  );
}
