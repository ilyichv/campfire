export { loadConfig, resolveCanvas } from "./config.js";
export { discoverRoot } from "./discover.js";
export {
  type LoadProjectOptions,
  loadProject,
  ProjectNotFoundError,
} from "./load-project.js";
export { generateManifest, type ProjectManifest } from "./manifest.js";
export { findEsmStatements, findJsxComponentNames } from "./mdx-analysis.js";
export {
  type AddSlideInput,
  addSlide,
  type MutationOptions,
  moveSlide,
  removeSlide,
  renameSlide,
  type SlideMutation,
  type UpdateSlideInput,
  updateSlide,
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
  ThemeFile,
} from "./types.js";
export {
  DEFAULT_CANVAS,
  DEFAULT_LAYOUT_NAME,
} from "./types.js";
export { type ValidationResult, validateProject } from "./validate.js";
