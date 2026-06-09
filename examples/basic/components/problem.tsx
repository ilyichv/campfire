import type { ReactNode } from "react";

export default function Problem({ children }: { children: ReactNode }) {
  return (
    <section className="flex flex-col gap-4 rounded-2xl border-(--color-foreground)/15 border-2 p-10">
      <span className="font-semibold text-(--color-foreground)/50 text-sm uppercase tracking-[0.2em]">
        Problem
      </span>
      <div className="text-2xl leading-relaxed">{children}</div>
    </section>
  );
}
