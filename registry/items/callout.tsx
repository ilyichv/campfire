import type { ReactNode } from "react";

const TONES = {
  default: "border-(--color-foreground)/15 bg-(--color-foreground)/[0.04]",
  primary: "border-(--color-primary)/40 bg-(--color-primary)/10",
  warning: "border-amber-500/40 bg-amber-500/10",
} as const;

export default function Callout({
  tone = "default",
  children,
}: {
  tone?: keyof typeof TONES;
  children: ReactNode;
}) {
  return (
    <aside
      className={`rounded-xl border-2 px-8 py-6 text-2xl leading-relaxed ${TONES[tone]}`}
    >
      {children}
    </aside>
  );
}
