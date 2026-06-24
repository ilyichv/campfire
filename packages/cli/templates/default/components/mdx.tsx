import type { ComponentProps } from "react";
import { cn } from "@/lib/utils";

/** Base markdown rendering for every slide. Edit freely — this file is
 * yours. Anything defined here wins over discovered components. */
export const mdxComponents = {
  h1: ({ className, ...props }: ComponentProps<"h1">) => (
    <h1
      className={cn("font-bold font-heading text-7xl tracking-tight", className)}
      {...props}
    />
  ),
  h2: ({ className, ...props }: ComponentProps<"h2">) => (
    <h2
      className={cn(
        "font-heading font-semibold text-5xl tracking-tight",
        className
      )}
      {...props}
    />
  ),
  h3: ({ className, ...props }: ComponentProps<"h3">) => (
    <h3
      className={cn("font-heading font-semibold text-3xl", className)}
      {...props}
    />
  ),
  h4: ({ className, ...props }: ComponentProps<"h4">) => (
    <h4
      className={cn("font-heading font-semibold text-2xl", className)}
      {...props}
    />
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
  pre: ({ className, ...props }: ComponentProps<"pre">) => (
    <pre
      className={cn(
        "overflow-x-auto rounded-lg bg-black/5 p-6 text-xl leading-relaxed",
        "[&_code]:bg-transparent [&_code]:p-0",
        className
      )}
      {...props}
    />
  ),
  a: ({ className, ...props }: ComponentProps<"a">) => (
    <a className={cn("text-primary underline", className)} {...props} />
  ),
  strong: ({ className, ...props }: ComponentProps<"strong">) => (
    <strong className={cn("font-semibold", className)} {...props} />
  ),
  em: ({ className, ...props }: ComponentProps<"em">) => (
    <em className={cn("italic", className)} {...props} />
  ),
  hr: ({ className, ...props }: ComponentProps<"hr">) => (
    <hr
      className={cn("my-8 border-current/15 border-t", className)}
      {...props}
    />
  ),
  img: ({ className, ...props }: ComponentProps<"img">) => (
    // biome-ignore lint/a11y/useAltText: alt flows in from the markdown source
    // biome-ignore lint/correctness/useImageSize: markdown images carry no dimensions
    <img className={cn("rounded-lg", className)} {...props} />
  ),
  table: ({ className, ...props }: ComponentProps<"table">) => (
    <table
      className={cn("w-full border-collapse text-left text-2xl", className)}
      {...props}
    />
  ),
  th: ({ className, ...props }: ComponentProps<"th">) => (
    <th
      className={cn(
        "border-current/20 border-b-2 px-4 py-3 font-semibold",
        className
      )}
      {...props}
    />
  ),
  td: ({ className, ...props }: ComponentProps<"td">) => (
    <td
      className={cn("border-current/10 border-b px-4 py-3", className)}
      {...props}
    />
  ),
};
