import type { ReactNode } from "react";

export default function Solution({ children }: { children: ReactNode }) {
  return (
    <section className="flex flex-col gap-4 rounded-2xl border-(--color-primary)/50 border-2 bg-(--color-primary)/5 p-10">
      <span className="font-semibold text-(--color-primary) text-sm uppercase tracking-[0.2em]">
        Solution
      </span>
      <div className="text-2xl leading-relaxed">{children}</div>
    </section>
  );
}
