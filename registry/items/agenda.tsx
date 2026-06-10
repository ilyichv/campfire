import type { ComponentProps } from "react";
import { cn } from "@/lib/utils";

export type AgendaLayoutProps = ComponentProps<"main"> & {
  /** From the slide's `title` frontmatter. */
  title?: string;
};

/** What the talk covers. Pair with the AgendaItem component:
 *
 * ```mdx
 * <AgendaItem number="01" heading="The problem" />
 * <AgendaItem number="02" heading="What we built" />
 * ```
 */
export default function AgendaLayout({
  title,
  className,
  children,
  ...props
}: AgendaLayoutProps) {
  return (
    <main
      className={cn(
        "flex h-full flex-col justify-center gap-14 p-24",
        className
      )}
      data-slot="agenda-layout"
      {...props}
    >
      {title ? (
        <h1 className="font-bold text-6xl tracking-tight">{title}</h1>
      ) : null}
      <div
        className="flex max-w-4xl flex-col gap-8"
        data-slot="agenda-layout-items"
      >
        {children}
      </div>
    </main>
  );
}
