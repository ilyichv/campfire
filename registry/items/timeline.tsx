import type { ComponentProps } from "react";
import { cn } from "@/lib/utils";

export type TimelineProps = ComponentProps<"ol">;

/** A horizontal sequence of milestones. Pair with TimelineItem. */
export default function Timeline({ className, ...props }: TimelineProps) {
  return (
    <ol
      className={cn("flex w-full items-start", className)}
      data-slot="timeline"
      {...props}
    />
  );
}
