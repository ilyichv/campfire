import type { ReactNode } from "react";

export default function TitleLayout({
  title,
  children,
}: {
  title?: string;
  children: ReactNode;
}) {
  return (
    <main className="flex h-full flex-col justify-center gap-10 p-28">
      {title ? (
        <h1 className="max-w-5xl font-bold text-8xl tracking-tight">{title}</h1>
      ) : null}
      <div className="max-w-4xl text-3xl leading-relaxed opacity-80">
        {children}
      </div>
    </main>
  );
}
