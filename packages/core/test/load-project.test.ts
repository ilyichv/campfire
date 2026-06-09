import { afterEach, describe, expect, test } from "bun:test";
import { mkdirSync } from "node:fs";
import { join } from "node:path";
import { discoverRoot } from "../src/discover.js";
import { loadProject } from "../src/load-project.js";
import { parseSlideFilename, pascalCase } from "../src/names.js";
import { BASIC_DECK, createFixture, type Fixture } from "./fixture.js";

let fixture: Fixture | undefined;
afterEach(() => {
  fixture?.cleanup();
  fixture = undefined;
});

describe("names", () => {
  test("parses slide filenames", () => {
    expect(parseSlideFilename("03-solution.mdx")).toEqual({
      number: 3,
      slug: "solution",
      id: "03-solution",
    });
    expect(parseSlideFilename("intro.mdx")).toBeUndefined();
    expect(parseSlideFilename("01-Bad_Name.mdx")).toBeUndefined();
  });

  test("maps kebab-case files to PascalCase components", () => {
    expect(pascalCase("metric-card")).toBe("MetricCard");
    expect(pascalCase("logo-cloud")).toBe("LogoCloud");
  });
});

describe("discoverRoot", () => {
  test("walks up from a subdirectory", () => {
    fixture = createFixture(BASIC_DECK);
    const nested = join(fixture.root, "components", "campfire");
    mkdirSync(nested, { recursive: true });
    expect(discoverRoot(nested)).toBe(fixture.root);
  });

  test("returns undefined outside a project", () => {
    fixture = createFixture({ "readme.md": "not a deck" });
    expect(discoverRoot(fixture.root)).toBeUndefined();
  });
});

describe("loadProject", () => {
  test("loads slides in filename order with frontmatter", async () => {
    fixture = createFixture(BASIC_DECK);
    const project = await loadProject({ root: fixture.root });

    expect(project.slides.map((slide) => slide.id)).toEqual([
      "01-title",
      "02-problem",
      "03-solution",
    ]);
    expect(project.slides[0]?.frontmatter.title).toBe("Building Campfire");
    expect(project.slides[2]?.frontmatter.layout).toBeUndefined();
    expect(project.canvas).toEqual({ width: 1280, height: 720 });
    expect(project.layouts.map((layout) => layout.name).sort()).toEqual([
      "problem-solution",
      "title",
    ]);
    expect(project.layouts.find((l) => l.name === "problem-solution")?.source).toBe(
      "registry"
    );
    expect(project.components).toHaveLength(1);
    expect(project.components[0]?.name).toBe("MetricCard");
    expect(project.mdxComponents?.path).toBe("components/mdx.tsx");
    expect(project.diagnostics).toEqual([]);
  });

  test("reads canvas from campfire.config.ts", async () => {
    fixture = createFixture({
      ...BASIC_DECK,
      "campfire.config.ts":
        "export default { title: 'Demo', canvas: { width: 1920, height: 1080 } }\n",
    });
    const project = await loadProject({ root: fixture.root });
    expect(project.canvas).toEqual({ width: 1920, height: 1080 });
    expect(project.title).toBe("Demo");
  });

  test("flags structural problems", async () => {
    fixture = createFixture({
      "slides/01-title.mdx": "---\nlayout: missing-one\n---\n\nHello\n",
      "slides/01-duplicate.mdx": "Duplicate number\n",
      "slides/notaslide.mdx": "Bad filename\n",
      "slides/02-esm.mdx": 'import { x } from "y"\n\n<Unknown />\n',
      "slides/03-empty.mdx": "",
    });
    const project = await loadProject({ root: fixture.root });
    const codes = project.diagnostics.map((diagnostic) => diagnostic.code);

    expect(codes).toContain("missing-layout");
    expect(codes).toContain("duplicate-slide-number");
    expect(codes).toContain("invalid-slide-filename");
    expect(codes).toContain("slide-esm");
    expect(codes).toContain("unknown-component");
    expect(codes).toContain("missing-theme");
    expect(codes).toContain("empty-slide");
  });

  test("does not flag imports inside code fences", async () => {
    fixture = createFixture({
      ...BASIC_DECK,
      "slides/04-code.mdx":
        '```ts\nimport { x } from "y"\nexport const a = 1\n```\n',
    });
    const project = await loadProject({ root: fixture.root });
    expect(
      project.diagnostics.filter((diagnostic) => diagnostic.code === "slide-esm")
    ).toEqual([]);
  });

  test("rejects unsupported frontmatter keys", async () => {
    fixture = createFixture({
      ...BASIC_DECK,
      "slides/04-extra.mdx": "---\nbackground: red\n---\n\nHi\n",
    });
    const project = await loadProject({ root: fixture.root });
    expect(
      project.diagnostics.some(
        (diagnostic) => diagnostic.code === "invalid-frontmatter"
      )
    ).toBe(true);
  });

  test("warns on flat-namespace component collisions, user wins", async () => {
    fixture = createFixture({
      ...BASIC_DECK,
      "components/metric-card.tsx":
        "export default function MetricCard() { return null }\n",
    });
    const project = await loadProject({ root: fixture.root });
    expect(
      project.diagnostics.some(
        (diagnostic) => diagnostic.code === "component-collision"
      )
    ).toBe(true);
    const metricCard = project.components.find(
      (component) => component.name === "MetricCard"
    );
    expect(metricCard?.source).toBe("user");
  });
});
