import type { ComponentProps } from "react";
import { cn } from "@/lib/utils";

export type TitleLayoutProps = ComponentProps<"main"> & {
  /** From the slide's `title` frontmatter. */
  title?: string;
};

/** Opening slide: oversized title with supporting copy. */
export default function TitleLayout({
  title,
  className,
  children,
  ...props
}: TitleLayoutProps) {
  return (
    <main
      className={cn(
        "flex h-full flex-col justify-center gap-10 p-28",
        className
      )}
      data-slot="title-layout"
      {...props}
    >
      {title ? (
        <h1 className="max-w-5xl font-bold font-heading text-8xl tracking-tight">
          {title}
        </h1>
      ) : null}
      <div
        className="max-w-4xl text-3xl leading-relaxed opacity-80"
        data-slot="title-layout-body"
      >
        {children}
      </div>
    </main>
  );
}
