import type { Diagnostic, Result, SlideMutation } from "@campfire-deck/core";

export function printJson(value: unknown): void {
  console.log(JSON.stringify(value, null, 2));
}

const LEVEL_ICONS: Record<Diagnostic["level"], string> = {
  error: "✗",
  warning: "⚠",
  info: "ℹ",
};

export function printDiagnostics(diagnostics: Diagnostic[]): void {
  for (const diagnostic of diagnostics) {
    const location = diagnostic.file ? ` [${diagnostic.file}]` : "";
    const suggestion = diagnostic.suggestion
      ? `\n    ${diagnostic.suggestion}`
      : "";
    console.log(
      `${LEVEL_ICONS[diagnostic.level]} ${diagnostic.code}: ${diagnostic.message}${location}${suggestion}`
    );
  }
}

export function reportMutation(
  action: string,
  result: Result<SlideMutation>,
  options: { json?: boolean; dryRun?: boolean }
): void {
  if (options.json) {
    printJson({
      action,
      dryRun: options.dryRun ?? false,
      success: result.success,
      slide: result.success ? result.data.slide : undefined,
      operations: result.success ? result.data.operations : [],
      diagnostics: result.diagnostics,
    });
  } else if (result.success) {
    const prefix = options.dryRun ? "Would" : "Did";
    console.log(`✓ ${prefix} ${action}: ${result.data.slide.path}`);
    for (const operation of result.data.operations) {
      const detail =
        operation.kind === "rename"
          ? `${operation.path} -> ${operation.to}`
          : operation.path;
      console.log(`  ${operation.kind}: ${detail}`);
    }
    printDiagnostics(result.diagnostics);
  } else {
    console.error(`✗ Could not ${action}.`);
    printDiagnostics(result.diagnostics);
  }
  if (!result.success) {
    process.exitCode = 1;
  }
}
