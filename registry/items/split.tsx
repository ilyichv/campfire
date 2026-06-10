import type { ComponentProps } from "react";
import { cn } from "@/lib/utils";

export type SplitLayoutProps = ComponentProps<"main"> & {
  /** From the slide's `title` frontmatter. */
  title?: string;
};

/** The two-column workhorse: children flow into equal side-by-side panels. */
export default function SplitLayout({
  title,
  className,
  children,
  ...props
}: SplitLayoutProps) {
  return (
    <main
      className={cn("flex h-full flex-col gap-10 p-24", className)}
      data-slot="split-layout"
      {...props}
    >
      {title ? (
        <h1 className="font-bold text-6xl tracking-tight">{title}</h1>
      ) : null}
      <div
        className="grid flex-1 grid-cols-2 items-center gap-16 text-2xl leading-relaxed"
        data-slot="split-layout-panels"
      >
        {children}
      </div>
    </main>
  );
}
