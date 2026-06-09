export type DiagnosticLevel = "error" | "warning" | "info";

export type Diagnostic = {
  level: DiagnosticLevel;
  code: string;
  message: string;
  file?: string;
  suggestion?: string;
};

export type SlideFrontmatter = {
  layout?: string;
  title?: string;
  notes?: string;
};

export type SlideFile = {
  id: string;
  number: number;
  slug: string;
  path: string;
  absolutePath: string;
  frontmatter: SlideFrontmatter;
  body: string;
};

export type SourceKind = "user" | "registry";

export type LayoutFile = {
  name: string;
  path: string;
  absolutePath: string;
  source: SourceKind;
};

export type ComponentFile = {
  name: string;
  path: string;
  absolutePath: string;
  source: SourceKind;
};

export type ThemeFile = {
  path: string;
  absolutePath: string;
};

export type MdxComponentsFile = {
  path: string;
  absolutePath: string;
};

export type Canvas = {
  width: number;
  height: number;
};

export type CampfireConfig = {
  title?: string;
  canvas?: Partial<Canvas>;
};

export type PresentationProject = {
  root: string;
  title?: string;
  canvas: Canvas;
  slides: SlideFile[];
  layouts: LayoutFile[];
  components: ComponentFile[];
  mdxComponents?: MdxComponentsFile;
  theme?: ThemeFile;
  config?: CampfireConfig;
  diagnostics: Diagnostic[];
};

export type FileOperation =
  | { kind: "create"; path: string; content: string }
  | { kind: "write"; path: string; content: string }
  | { kind: "rename"; path: string; to: string }
  | { kind: "delete"; path: string };

export type Result<T> =
  | { success: true; data: T; diagnostics: Diagnostic[] }
  | { success: false; diagnostics: Diagnostic[] };

export const DEFAULT_CANVAS: Canvas = { width: 1280, height: 720 };

export const REGISTRY_NAMESPACE = "campfire";
export const DEFAULT_LAYOUT_NAME = "default";
