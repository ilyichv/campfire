import type { ComponentProps } from "react";
import { cn } from "@/lib/utils";

export type ClosingLayoutProps = ComponentProps<"main"> & {
  /** From the slide's `title` frontmatter. */
  title?: string;
};

/** Centered thank-you slide. */
export default function ClosingLayout({
  title,
  className,
  children,
  ...props
}: ClosingLayoutProps) {
  return (
    <main
      className={cn(
        "flex h-full flex-col items-center justify-center gap-8 p-28 text-center",
        className
      )}
      data-slot="closing-layout"
      {...props}
    >
      {title ? (
        <h1 className="font-bold text-8xl tracking-tight">{title}</h1>
      ) : null}
      <div
        className="max-w-3xl text-2xl leading-relaxed opacity-70"
        data-slot="closing-layout-body"
      >
        {children}
      </div>
    </main>
  );
}
