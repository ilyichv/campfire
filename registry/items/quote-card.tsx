import type { ComponentProps } from "react";
import { cn } from "@/lib/utils";

export type QuoteCardProps = ComponentProps<"figure"> & {
  /** The quotation, rendered with typographic quotes. */
  quote: string;
  /** Who said it. */
  author: string;
  /** Optional role or affiliation of the author. */
  affiliation?: string;
};

/** A large quotation with attribution. */
export default function QuoteCard({
  quote,
  author,
  affiliation,
  className,
  ...props
}: QuoteCardProps) {
  return (
    <figure
      className={cn("flex max-w-4xl flex-col gap-8", className)}
      data-slot="quote-card"
      {...props}
    >
      <blockquote
        className="font-heading font-medium text-5xl leading-snug tracking-tight"
        data-slot="quote-card-quote"
      >
        “{quote}”
      </blockquote>
      <figcaption
        className="flex items-baseline gap-3 text-xl"
        data-slot="quote-card-attribution"
      >
        <span className="font-semibold">{author}</span>
        {affiliation ? <span className="opacity-60">{affiliation}</span> : null}
      </figcaption>
    </figure>
  );
}
