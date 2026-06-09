import type { ReactNode } from "react";

export default function Step({
  number,
  title,
  children,
}: {
  number: number | string;
  title: string;
  children?: ReactNode;
}) {
  return (
    <div className="flex items-start gap-6">
      <span className="flex size-12 shrink-0 items-center justify-center rounded-full bg-(--color-primary) font-bold text-(--color-background) text-xl">
        {number}
      </span>
      <div className="flex flex-col gap-2">
        <span className="font-semibold text-3xl">{title}</span>
        {children ? (
          <div className="text-xl leading-relaxed opacity-75">{children}</div>
        ) : null}
      </div>
    </div>
  );
}
