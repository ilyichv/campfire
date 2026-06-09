import type { ReactNode } from "react";

export default function LogoCloud({
  title,
  children,
}: {
  title?: string;
  children: ReactNode;
}) {
  return (
    <section className="flex flex-col gap-6">
      {title ? (
        <span className="text-center text-sm uppercase tracking-[0.2em] opacity-50">
          {title}
        </span>
      ) : null}
      <div className="flex flex-wrap items-center justify-center gap-x-14 gap-y-8 opacity-70 grayscale">
        {children}
      </div>
    </section>
  );
}
