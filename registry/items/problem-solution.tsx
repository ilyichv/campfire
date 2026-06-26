import type { ComponentProps } from "react";
import { cn } from "@/lib/utils";

export type ProblemSolutionLayoutProps = ComponentProps<"main"> & {
  /** From the slide's `title` frontmatter. */
  title?: string;
};

/** Pair with the Problem and Solution components installed alongside:
 *
 * ```mdx
 * <Problem>Decks rot in proprietary tools.</Problem>
 * <Solution>Slides are files; the repo is the deck.</Solution>
 * ```
 */
export default function ProblemSolutionLayout({
  title,
  className,
  children,
  ...props
}: ProblemSolutionLayoutProps) {
  return (
    <main
      className={cn("flex h-full flex-col gap-10 p-24", className)}
      data-slot="problem-solution-layout"
      {...props}
    >
      {title ? (
        <h1 className="font-bold font-heading text-6xl tracking-tight">
          {title}
        </h1>
      ) : null}
      <div
        className="grid flex-1 grid-cols-2 items-stretch gap-10"
        data-slot="problem-solution-layout-panels"
      >
        {children}
      </div>
    </main>
  );
}
