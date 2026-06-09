import { afterEach, describe, expect, test } from "bun:test";
import { existsSync, readdirSync, readFileSync } from "node:fs";
import { join } from "node:path";
import {
  addSlide,
  moveSlide,
  removeSlide,
  renameSlide,
  updateSlide,
} from "../src/mutations.js";
import { BASIC_DECK, createFixture, type Fixture } from "./fixture.js";

let fixture: Fixture | undefined;
afterEach(() => {
  fixture?.cleanup();
  fixture = undefined;
});

function slideFiles(root: string): string[] {
  return readdirSync(join(root, "slides")).sort();
}

describe("addSlide", () => {
  test("appends at the end by default", () => {
    fixture = createFixture(BASIC_DECK);
    const result = addSlide(fixture.root, {
      slug: "closing",
      title: "Thanks",
      layout: "title",
    });
    expect(result.success).toBe(true);
    expect(slideFiles(fixture.root)).toEqual([
      "01-title.mdx",
      "02-problem.mdx",
      "03-solution.mdx",
      "04-closing.mdx",
    ]);
    const content = readFileSync(
      join(fixture.root, "slides/04-closing.mdx"),
      "utf8"
    );
    expect(content).toContain("layout: title");
    expect(content).toContain("# Thanks");
  });

  test("inserts at a position and renumbers the rest", () => {
    fixture = createFixture(BASIC_DECK);
    const result = addSlide(fixture.root, { slug: "agenda", at: 2 });
    expect(result.success).toBe(true);
    expect(slideFiles(fixture.root)).toEqual([
      "01-title.mdx",
      "02-agenda.mdx",
      "03-problem.mdx",
      "04-solution.mdx",
    ]);
  });

  test("dry run plans without writing", () => {
    fixture = createFixture(BASIC_DECK);
    const result = addSlide(
      fixture.root,
      { slug: "agenda", at: 1 },
      { dryRun: true }
    );
    expect(result.success).toBe(true);
    if (result.success) {
      expect(result.data.operations.length).toBeGreaterThan(0);
    }
    expect(slideFiles(fixture.root)).toEqual([
      "01-title.mdx",
      "02-problem.mdx",
      "03-solution.mdx",
    ]);
  });

  test("rejects duplicate slugs and bad positions", () => {
    fixture = createFixture(BASIC_DECK);
    expect(addSlide(fixture.root, { slug: "title" }).success).toBe(false);
    expect(addSlide(fixture.root, { slug: "ok", at: 9 }).success).toBe(false);
    expect(addSlide(fixture.root, { slug: "Bad Slug" }).success).toBe(false);
  });
});

describe("moveSlide", () => {
  test("moves a slide and renumbers", () => {
    fixture = createFixture(BASIC_DECK);
    const result = moveSlide(fixture.root, "03-solution", 2);
    expect(result.success).toBe(true);
    expect(slideFiles(fixture.root)).toEqual([
      "01-title.mdx",
      "02-solution.mdx",
      "03-problem.mdx",
    ]);
  });

  test("resolves references by slug and number", () => {
    fixture = createFixture(BASIC_DECK);
    expect(moveSlide(fixture.root, "solution", 1).success).toBe(true);
    expect(slideFiles(fixture.root)[0]).toBe("01-solution.mdx");
    expect(moveSlide(fixture.root, "3", 1).success).toBe(true);
  });

  test("handles colliding swap targets safely", () => {
    fixture = createFixture({
      "slides/01-a.mdx": "A\n",
      "slides/02-b.mdx": "B\n",
    });
    const result = moveSlide(fixture.root, "01-a", 2);
    expect(result.success).toBe(true);
    expect(slideFiles(fixture.root)).toEqual(["01-b.mdx", "02-a.mdx"]);
    expect(readFileSync(join(fixture.root, "slides/02-a.mdx"), "utf8")).toBe(
      "A\n"
    );
  });
});

describe("removeSlide", () => {
  test("removes and renumbers", () => {
    fixture = createFixture(BASIC_DECK);
    const result = removeSlide(fixture.root, "02-problem");
    expect(result.success).toBe(true);
    expect(slideFiles(fixture.root)).toEqual([
      "01-title.mdx",
      "02-solution.mdx",
    ]);
  });

  test("survives delete/rename collisions", () => {
    fixture = createFixture({
      "slides/01-a.mdx": "A\n",
      "slides/02-keep.mdx": "OLD\n",
      "slides/03-keep2.mdx": "NEW\n",
    });
    // Removing 01 renames 02-keep -> 01-keep and 03-keep2 -> 02-keep2.
    const result = removeSlide(fixture.root, "01-a");
    expect(result.success).toBe(true);
    expect(slideFiles(fixture.root)).toEqual(["01-keep.mdx", "02-keep2.mdx"]);
  });
});

describe("renameSlide", () => {
  test("changes the slug, keeps the number", () => {
    fixture = createFixture(BASIC_DECK);
    const result = renameSlide(fixture.root, "02-problem", "pain");
    expect(result.success).toBe(true);
    expect(existsSync(join(fixture.root, "slides/02-pain.mdx"))).toBe(true);
  });
});

describe("updateSlide", () => {
  test("patches frontmatter, preserves body, clears with null", () => {
    fixture = createFixture(BASIC_DECK);
    const result = updateSlide(fixture.root, "01-title", {
      title: "New Title",
      notes: null,
    });
    expect(result.success).toBe(true);
    const content = readFileSync(
      join(fixture.root, "slides/01-title.mdx"),
      "utf8"
    );
    expect(content).toContain("title: New Title");
    expect(content).toContain("layout: title");
    expect(content).not.toContain("notes:");
    expect(content).toContain("# Building Campfire");
  });

  test("replaces the body when given", () => {
    fixture = createFixture(BASIC_DECK);
    updateSlide(fixture.root, "03-solution", { body: "New body\n" });
    expect(
      readFileSync(join(fixture.root, "slides/03-solution.mdx"), "utf8")
    ).toBe("New body\n");
  });
});
