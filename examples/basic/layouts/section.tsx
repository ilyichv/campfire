import type { ComponentProps } from "react";
import { cn } from "@/lib/utils";

export type SectionLayoutProps = ComponentProps<"main"> & {
  /** From the slide's `title` frontmatter. */
  title?: string;
};

/** A full-bleed divider slide on the primary color. */
export default function SectionLayout({
  title,
  className,
  children,
  ...props
}: SectionLayoutProps) {
  return (
    <main
      className={cn(
        "flex h-full flex-col justify-center gap-8 bg-primary p-28 text-background",
        className
      )}
      data-slot="section-layout"
      {...props}
    >
      {title ? (
        <h1 className="font-bold text-8xl tracking-tight">{title}</h1>
      ) : null}
      <div
        className="max-w-4xl text-3xl leading-relaxed opacity-90"
        data-slot="section-layout-body"
      >
        {children}
      </div>
    </main>
  );
}
