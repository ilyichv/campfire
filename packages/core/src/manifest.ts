import type { PresentationProject } from "./types.js";

export type ProjectManifest = {
  root: string;
  title?: string;
  canvas: { width: number; height: number };
  slides: {
    id: string;
    number: number;
    slug: string;
    path: string;
    layout?: string;
    title?: string;
    notes?: string;
  }[];
  layouts: { name: string; path: string }[];
  components: { name: string; path: string }[];
  mdxComponents?: string;
  theme?: string;
  diagnostics: PresentationProject["diagnostics"];
};

/** A JSON-serializable view of the project, stable for `camp inspect --json`
 * and the app's virtual project module. */
export function generateManifest(
  project: PresentationProject
): ProjectManifest {
  return {
    root: project.root,
    title: project.title,
    canvas: project.canvas,
    slides: project.slides.map((slide) => ({
      id: slide.id,
      number: slide.number,
      slug: slide.slug,
      path: slide.path,
      layout: slide.frontmatter.layout,
      title: slide.frontmatter.title,
      notes: slide.frontmatter.notes,
    })),
    layouts: project.layouts.map(({ name, path }) => ({ name, path })),
    components: project.components.map(({ name, path }) => ({ name, path })),
    mdxComponents: project.mdxComponents?.path,
    theme: project.theme?.path,
    diagnostics: project.diagnostics,
  };
}
