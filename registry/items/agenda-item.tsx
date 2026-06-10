import type { ComponentProps } from "react";
import { cn } from "@/lib/utils";

export type AgendaItemProps = ComponentProps<"div"> & {
  /** The item marker, e.g. 1 or "01". */
  number: number | string;
  /** What this part of the talk covers. */
  heading: string;
};

/** A numbered row for agenda slides. Pairs with the agenda layout. */
export default function AgendaItem({
  number,
  heading,
  className,
  children,
  ...props
}: AgendaItemProps) {
  return (
    <div
      className={cn("flex items-baseline gap-8", className)}
      data-slot="agenda-item"
      {...props}
    >
      <span
        className="font-mono font-semibold text-(--color-primary) text-2xl tabular-nums"
        data-slot="agenda-item-number"
      >
        {number}
      </span>
      <div className="flex flex-col gap-1">
        <span
          className="font-semibold text-4xl tracking-tight"
          data-slot="agenda-item-heading"
        >
          {heading}
        </span>
        {children ? (
          <div
            className="text-xl leading-relaxed opacity-70"
            data-slot="agenda-item-detail"
          >
            {children}
          </div>
        ) : null}
      </div>
    </div>
  );
}
