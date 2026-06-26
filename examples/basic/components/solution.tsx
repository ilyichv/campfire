import type { ComponentProps } from "react";
import { cn } from "@/lib/utils";

export type SolutionProps = ComponentProps<"section">;

/** The "after" panel of a problem/solution narrative. */
export default function Solution({
  className,
  children,
  ...props
}: SolutionProps) {
  return (
    <section
      className={cn(
        "flex flex-col gap-4 rounded-2xl border-2 border-primary/50 bg-primary/5 p-10",
        className
      )}
      data-slot="solution"
      {...props}
    >
      <span className="font-semibold text-primary text-sm uppercase tracking-[0.2em]">
        Solution
      </span>
      <div className="text-2xl leading-relaxed">{children}</div>
    </section>
  );
}
