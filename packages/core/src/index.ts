export { loadConfig, resolveCanvas } from "./config.js";
export { discoverRoot } from "./discover.js";
export {
  loadProject,
  ProjectNotFoundError,
  type LoadProjectOptions,
} from "./load-project.js";
export { generateManifest, type ProjectManifest } from "./manifest.js";
export { findEsmStatements, findJsxComponentNames } from "./mdx-analysis.js";
export {
  addSlide,
  moveSlide,
  removeSlide,
  renameSlide,
  updateSlide,
  type AddSlideInput,
  type MutationOptions,
  type SlideMutation,
  type UpdateSlideInput,
} from "./mutations.js";
export {
  isValidSlug,
  parseSlideFilename,
  pascalCase,
  slideFilename,
} from "./names.js";
export {
  scanComponents,
  scanLayouts,
  scanSlides,
  scanTheme,
} from "./scan.js";
export { validateProject, type ValidationResult } from "./validate.js";
export type {
  CampfireConfig,
  Canvas,
  ComponentFile,
  Diagnostic,
  DiagnosticLevel,
  FileOperation,
  LayoutFile,
  MdxComponentsFile,
  PresentationProject,
  Result,
  SlideFile,
  SlideFrontmatter,
  SourceKind,
  ThemeFile,
} from "./types.js";
export {
  DEFAULT_CANVAS,
  DEFAULT_LAYOUT_NAME,
  REGISTRY_NAMESPACE,
} from "./types.js";
