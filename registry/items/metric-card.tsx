import type { ComponentProps } from "react";
import { cn } from "@/lib/utils";

export type MetricCardProps = ComponentProps<"div"> & {
  /** The headline number, e.g. "42%". */
  value: string;
  /** What the number measures. */
  label: string;
  /** Optional change indicator rendered beside the value, e.g. "+18%". */
  delta?: string;
};

/** A headline number with label and optional delta. */
export default function MetricCard({
  value,
  label,
  delta,
  className,
  ...props
}: MetricCardProps) {
  return (
    <div
      className={cn(
        "inline-flex flex-col gap-1 rounded-2xl border border-foreground/10 bg-foreground/[0.03] px-8 py-6",
        className
      )}
      data-slot="metric-card"
      {...props}
    >
      <span className="flex items-baseline gap-3" data-slot="metric-card-value">
        <span className="font-bold font-heading text-6xl tracking-tight">
          {value}
        </span>
        {delta ? (
          <span
            className="font-medium text-primary text-xl"
            data-slot="metric-card-delta"
          >
            {delta}
          </span>
        ) : null}
      </span>
      <span className="text-lg opacity-60" data-slot="metric-card-label">
        {label}
      </span>
    </div>
  );
}
