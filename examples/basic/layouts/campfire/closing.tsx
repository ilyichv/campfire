import type { ReactNode } from "react";

export default function ClosingLayout({
  title,
  children,
}: {
  title?: string;
  children: ReactNode;
}) {
  return (
    <main className="flex h-full flex-col items-center justify-center gap-8 p-28 text-center">
      {title ? (
        <h1 className="font-bold text-8xl tracking-tight">{title}</h1>
      ) : null}
      <div className="max-w-3xl text-2xl leading-relaxed opacity-70">
        {children}
      </div>
    </main>
  );
}
