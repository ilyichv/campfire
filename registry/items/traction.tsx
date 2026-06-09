import type { ReactNode } from "react";

/** Metrics row plus supporting narrative. Pairs with MetricCard. */
export default function TractionLayout({
  title,
  children,
}: {
  title?: string;
  children: ReactNode;
}) {
  return (
    <main className="flex h-full flex-col justify-center gap-12 p-24">
      {title ? (
        <h1 className="font-bold text-6xl tracking-tight">{title}</h1>
      ) : null}
      <div className="flex flex-wrap items-start gap-8 text-2xl leading-relaxed [&>p]:max-w-3xl">
        {children}
      </div>
    </main>
  );
}
