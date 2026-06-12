import type { ComponentProps } from "react";
import { cn } from "@/lib/utils";

/** Base markdown rendering for every slide. Edit freely — this file is
 * yours. Anything defined here wins over discovered components. */
export const mdxComponents = {
  h1: ({ className, ...props }: ComponentProps<"h1">) => (
    <h1
      className={cn("font-bold text-7xl tracking-tight", className)}
      {...props}
    />
  ),
  h2: ({ className, ...props }: ComponentProps<"h2">) => (
    <h2
      className={cn("font-semibold text-5xl tracking-tight", className)}
      {...props}
    />
  ),
  h3: ({ className, ...props }: ComponentProps<"h3">) => (
    <h3 className={cn("font-semibold text-3xl", className)} {...props} />
  ),
  p: ({ className, ...props }: ComponentProps<"p">) => (
    <p className={cn("text-2xl leading-relaxed", className)} {...props} />
  ),
  ul: ({ className, ...props }: ComponentProps<"ul">) => (
    <ul
      className={cn("list-disc space-y-2 pl-8 text-2xl", className)}
      {...props}
    />
  ),
  ol: ({ className, ...props }: ComponentProps<"ol">) => (
    <ol
      className={cn("list-decimal space-y-2 pl-8 text-2xl", className)}
      {...props}
    />
  ),
  blockquote: ({ className, ...props }: ComponentProps<"blockquote">) => (
    <blockquote
      className={cn("border-l-4 pl-6 text-2xl italic opacity-80", className)}
      {...props}
    />
  ),
  code: ({ className, ...props }: ComponentProps<"code">) => (
    <code
      className={cn(
        "rounded bg-black/5 px-1.5 py-0.5 font-mono text-[0.9em]",
        className
      )}
      {...props}
    />
  ),
  a: ({ className, ...props }: ComponentProps<"a">) => (
    <a
      className={cn("text-(--color-primary) underline", className)}
      {...props}
    />
  ),
};
