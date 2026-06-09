import type { ReactNode } from "react";

export default function SectionLayout({
  title,
  children,
}: {
  title?: string;
  children: ReactNode;
}) {
  return (
    <main className="flex h-full flex-col justify-center gap-8 bg-(--color-primary) p-28 text-(--color-background)">
      {title ? (
        <h1 className="font-bold text-8xl tracking-tight">{title}</h1>
      ) : null}
      <div className="max-w-4xl text-3xl leading-relaxed opacity-90">
        {children}
      </div>
    </main>
  );
}
