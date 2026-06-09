/**
 * Lightweight static analysis of MDX slide bodies. The authoritative
 * enforcement happens in the Vite MDX pipeline (a remark plugin rejects ESM
 * nodes); these checks let `camp validate` catch the same problems without
 * compiling.
 */

const FENCE_PATTERN = /^(`{3,}|~{3,})/;
const ESM_PATTERN = /^(import\s|export\s)/;
const JSX_COMPONENT_PATTERN = /<([A-Z][A-Za-z0-9]*)/g;

function nonCodeLines(body: string): string[] {
  const lines: string[] = [];
  let inFence = false;
  let fenceMarker = "";
  for (const line of body.split("\n")) {
    const fence = FENCE_PATTERN.exec(line.trimStart());
    if (fence?.[1]) {
      if (inFence && fence[1][0] === fenceMarker[0]) {
        inFence = false;
      } else if (!inFence) {
        inFence = true;
        fenceMarker = fence[1];
      }
      continue;
    }
    if (!inFence) {
      lines.push(line);
    }
  }
  return lines;
}

/** MDX ESM statements must start at column 0, so checking unindented lines
 * outside code fences closely approximates real mdxjsEsm nodes. */
export function findEsmStatements(body: string): string[] {
  return nonCodeLines(body)
    .filter((line) => ESM_PATTERN.test(line))
    .map((line) => line.trim());
}

export function findJsxComponentNames(body: string): string[] {
  const names = new Set<string>();
  for (const line of nonCodeLines(body)) {
    for (const match of line.matchAll(JSX_COMPONENT_PATTERN)) {
      const name = match[1];
      if (name) {
        names.add(name);
      }
    }
  }
  return [...names];
}
