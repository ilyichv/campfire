import type { ComponentProps } from "react";
import { cn } from "@/lib/utils";

export type TimelineItemProps = ComponentProps<"li"> & {
  /** Milestone heading. */
  heading: string;
  /** Optional time marker, e.g. "Q3 2026". */
  period?: string;
};

/** A single milestone on a Timeline. */
export default function TimelineItem({
  heading,
  period,
  className,
  children,
  ...props
}: TimelineItemProps) {
  return (
    <li
      className={cn("group flex flex-1 flex-col gap-5", className)}
      data-slot="timeline-item"
      {...props}
    >
      <div className="flex w-full items-center gap-3">
        <span
          className="size-4 shrink-0 rounded-full bg-primary"
          data-slot="timeline-item-marker"
        />
        <span className="h-0.5 flex-1 rounded bg-foreground/15 group-last:hidden" />
      </div>
      <div className="flex flex-col gap-1 pr-10">
        {period ? (
          <span
            className="font-medium text-lg text-primary uppercase tracking-wide"
            data-slot="timeline-item-period"
          >
            {period}
          </span>
        ) : null}
        <span
          className="font-heading font-semibold text-2xl tracking-tight"
          data-slot="timeline-item-heading"
        >
          {heading}
        </span>
        {children ? (
          <div
            className="text-lg leading-relaxed opacity-70"
            data-slot="timeline-item-detail"
          >
            {children}
          </div>
        ) : null}
      </div>
    </li>
  );
}
