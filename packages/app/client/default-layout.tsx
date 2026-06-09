import type { ReactNode } from "react";

/** Built-in fallback used when a slide has no `layout` frontmatter and the
 * project does not define layouts/default.tsx. */
export default function DefaultLayout({
  title,
  children,
}: {
  title?: string;
  children: ReactNode;
}) {
  return (
    <main className="cf-default-layout">
      {title ? <h1 className="cf-default-layout-title">{title}</h1> : null}
      <div className="cf-default-layout-content">{children}</div>
    </main>
  );
}
