import type { ComponentProps } from "react";
import { cn } from "@/lib/utils";

export type TeamMemberProps = ComponentProps<"figure"> & {
  /** Full name. */
  name: string;
  /** Optional role, e.g. "CEO & Co-founder". */
  position?: string;
  /** Optional photo URL; falls back to initials. */
  src?: string;
};

const WHITESPACE = /\s+/;

function initials(name: string): string {
  return name
    .split(WHITESPACE)
    .filter(Boolean)
    .map((part) => part[0])
    .slice(0, 2)
    .join("")
    .toUpperCase();
}

/** A person card for team slides: photo (or initials), name, and role. */
export default function TeamMember({
  name,
  position,
  src,
  className,
  children,
  ...props
}: TeamMemberProps) {
  return (
    <figure
      className={cn(
        "flex w-56 flex-col items-center gap-5 text-center",
        className
      )}
      data-slot="team-member"
      {...props}
    >
      {src ? (
        <img
          alt={name}
          className="size-28 rounded-full object-cover"
          data-slot="team-member-photo"
          height={112}
          src={src}
          width={112}
        />
      ) : (
        <span
          aria-hidden
          className="flex size-28 items-center justify-center rounded-full bg-(--color-primary)/10 font-semibold text-(--color-primary) text-3xl"
          data-slot="team-member-photo"
        >
          {initials(name)}
        </span>
      )}
      <figcaption className="flex flex-col gap-1">
        <span className="font-semibold text-2xl" data-slot="team-member-name">
          {name}
        </span>
        {position ? (
          <span className="text-lg opacity-60" data-slot="team-member-position">
            {position}
          </span>
        ) : null}
        {children ? (
          <div
            className="pt-2 text-base leading-relaxed opacity-70"
            data-slot="team-member-detail"
          >
            {children}
          </div>
        ) : null}
      </figcaption>
    </figure>
  );
}
