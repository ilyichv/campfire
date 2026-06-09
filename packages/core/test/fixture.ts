import { mkdirSync, mkdtempSync, rmSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { dirname, join } from "node:path";

export type Fixture = {
  root: string;
  write: (relativePath: string, content: string) => void;
  cleanup: () => void;
};

export function createFixture(files: Record<string, string>): Fixture {
  const root = mkdtempSync(join(tmpdir(), "campfire-test-"));
  const write = (relativePath: string, content: string) => {
    const absolute = join(root, relativePath);
    mkdirSync(dirname(absolute), { recursive: true });
    writeFileSync(absolute, content);
  };
  for (const [relativePath, content] of Object.entries(files)) {
    write(relativePath, content);
  }
  return { root, write, cleanup: () => rmSync(root, { recursive: true }) };
}

export const BASIC_DECK: Record<string, string> = {
  "slides/01-title.mdx": `---
layout: title
title: Building Campfire
notes: |
  Open with the origin story.
---

# Building Campfire
`,
  "slides/02-problem.mdx": `---
layout: problem-solution
---

<MetricCard value="42%" label="Activation" />
`,
  "slides/03-solution.mdx": "Plain content, default layout.\n",
  "layouts/title.tsx":
    "export default function TitleLayout() { return null }\n",
  "layouts/nested/problem-solution.tsx":
    "export default function ProblemSolution() { return null }\n",
  "components/mdx.tsx": "export const mdxComponents = {}\n",
  "components/nested/metric-card.tsx":
    "export default function MetricCard() { return null }\n",
  "theme.css": '@import "tailwindcss";\n',
};
