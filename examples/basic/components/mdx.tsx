import type { ComponentProps } from "react";

/** Base markdown rendering for every slide. Edit freely — this file is yours.
 * Anything defined here wins over discovered components. */
export const mdxComponents = {
  h1: (props: ComponentProps<"h1">) => (
    <h1 className="font-bold text-7xl tracking-tight" {...props} />
  ),
  h2: (props: ComponentProps<"h2">) => (
    <h2 className="font-semibold text-5xl tracking-tight" {...props} />
  ),
  h3: (props: ComponentProps<"h3">) => (
    <h3 className="font-semibold text-3xl" {...props} />
  ),
  p: (props: ComponentProps<"p">) => (
    <p className="text-2xl leading-relaxed" {...props} />
  ),
  ul: (props: ComponentProps<"ul">) => (
    <ul className="list-disc space-y-2 pl-8 text-2xl" {...props} />
  ),
  ol: (props: ComponentProps<"ol">) => (
    <ol className="list-decimal space-y-2 pl-8 text-2xl" {...props} />
  ),
  blockquote: (props: ComponentProps<"blockquote">) => (
    <blockquote
      className="border-l-4 pl-6 text-2xl italic opacity-80"
      {...props}
    />
  ),
  code: (props: ComponentProps<"code">) => (
    <code
      className="rounded bg-black/5 px-1.5 py-0.5 font-mono text-[0.9em]"
      {...props}
    />
  ),
  a: (props: ComponentProps<"a">) => (
    <a className="text-(--color-primary) underline" {...props} />
  ),
};
