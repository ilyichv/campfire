import type { Diagnostic, PresentationProject } from "./types.js";

export type ValidationResult = {
  valid: boolean;
  diagnostics: Diagnostic[];
};

export function validateProject(
  project: PresentationProject
): ValidationResult {
  return {
    valid: !project.diagnostics.some(
      (diagnostic) => diagnostic.level === "error"
    ),
    diagnostics: project.diagnostics,
  };
}
