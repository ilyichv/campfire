import type { ComponentProps } from "react";
import { cn } from "@/lib/utils";

export type CalloutTone = "default" | "primary" | "warning";

const toneStyles: Record<CalloutTone, string> = {
  default: "border-(--color-foreground)/15 bg-(--color-foreground)/[0.04]",
  primary: "border-(--color-primary)/40 bg-(--color-primary)/10",
  warning: "border-amber-500/40 bg-amber-500/10",
};

export type CalloutProps = ComponentProps<"aside"> & {
  /** Visual emphasis of the aside. */
  tone?: CalloutTone;
};

/** An emphasized aside with tone variants. */
export default function Callout({
  tone = "default",
  className,
  ...props
}: CalloutProps) {
  return (
    <aside
      className={cn(
        "rounded-xl border-2 px-8 py-6 text-2xl leading-relaxed",
        toneStyles[tone],
        className
      )}
      data-slot="callout"
      data-tone={tone}
      {...props}
    />
  );
}
