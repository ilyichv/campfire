import type { ComponentProps } from "react";
import { cn } from "@/lib/utils";

export type StatementLayoutProps = ComponentProps<"main"> & {
  /** From the slide's `title` frontmatter, rendered as an eyebrow. */
  title?: string;
};

/** One big takeaway, centered. Also the natural home for a QuoteCard. */
export default function StatementLayout({
  title,
  className,
  children,
  ...props
}: StatementLayoutProps) {
  return (
    <main
      className={cn(
        "flex h-full flex-col items-center justify-center gap-10 p-28 text-center",
        className
      )}
      data-slot="statement-layout"
      {...props}
    >
      {title ? (
        <span className="font-medium text-(--color-primary) text-xl uppercase tracking-[0.2em]">
          {title}
        </span>
      ) : null}
      <div
        className="flex max-w-5xl flex-col items-center gap-8 font-semibold text-6xl leading-tight tracking-tight [&_p]:font-semibold [&_p]:text-6xl [&_p]:leading-tight [&_p]:tracking-tight"
        data-slot="statement-layout-statement"
      >
        {children}
      </div>
    </main>
  );
}
