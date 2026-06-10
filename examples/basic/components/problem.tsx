import type { ComponentProps } from "react";
import { cn } from "@/lib/utils";

export type ProblemProps = ComponentProps<"section">;

/** The "before" panel of a problem/solution narrative. */
export default function Problem({
  className,
  children,
  ...props
}: ProblemProps) {
  return (
    <section
      className={cn(
        "flex flex-col gap-4 rounded-2xl border-(--color-foreground)/15 border-2 p-10",
        className
      )}
      data-slot="problem"
      {...props}
    >
      <span className="font-semibold text-(--color-foreground)/50 text-sm uppercase tracking-[0.2em]">
        Problem
      </span>
      <div className="text-2xl leading-relaxed">{children}</div>
    </section>
  );
}
