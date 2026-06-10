import type { ComponentProps } from "react";
import { cn } from "@/lib/utils";

export type LogoCloudProps = ComponentProps<"section"> & {
  /** Optional uppercase eyebrow above the logos. */
  heading?: string;
};

/** A centered, muted row of logos. */
export default function LogoCloud({
  heading,
  className,
  children,
  ...props
}: LogoCloudProps) {
  return (
    <section
      className={cn("flex flex-col gap-6", className)}
      data-slot="logo-cloud"
      {...props}
    >
      {heading ? (
        <span
          className="text-center text-sm uppercase tracking-[0.2em] opacity-50"
          data-slot="logo-cloud-heading"
        >
          {heading}
        </span>
      ) : null}
      <div
        className="flex flex-wrap items-center justify-center gap-x-14 gap-y-8 opacity-70 grayscale"
        data-slot="logo-cloud-logos"
      >
        {children}
      </div>
    </section>
  );
}
