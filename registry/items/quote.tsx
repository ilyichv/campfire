import type { ReactNode } from "react";

/** Center stage for a single quotation. Pairs well with QuoteCard. */
export default function QuoteLayout({
  children,
}: {
  title?: string;
  children: ReactNode;
}) {
  return (
    <main className="flex h-full items-center justify-center p-28">
      {children}
    </main>
  );
}
