import type { ComponentProps } from "react";
import { cn } from "@/lib/utils";

export type StepProps = ComponentProps<"div"> & {
  /** The step marker rendered in the badge. */
  number: number | string;
  /** Step heading. */
  heading: string;
};

/** A numbered step with heading and optional detail. */
export default function Step({
  number,
  heading,
  className,
  children,
  ...props
}: StepProps) {
  return (
    <div
      className={cn("flex items-start gap-6", className)}
      data-slot="step"
      {...props}
    >
      <span
        className="flex size-12 shrink-0 items-center justify-center rounded-full bg-(--color-primary) font-bold text-(--color-background) text-xl"
        data-slot="step-number"
      >
        {number}
      </span>
      <div className="flex flex-col gap-2">
        <span className="font-semibold text-3xl" data-slot="step-heading">
          {heading}
        </span>
        {children ? (
          <div
            className="text-xl leading-relaxed opacity-75"
            data-slot="step-detail"
          >
            {children}
          </div>
        ) : null}
      </div>
    </div>
  );
}
