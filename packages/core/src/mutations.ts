import { existsSync, renameSync, rmSync, writeFileSync } from "node:fs";
import { join } from "node:path";
import matter from "gray-matter";
import { isValidSlug, padSlideNumber, slideFilename } from "./names.js";
import { scanSlides } from "./scan.js";
import type {
  Diagnostic,
  FileOperation,
  Result,
  SlideFile,
  SlideFrontmatter,
} from "./types.js";

export type MutationOptions = {
  /** Plan the operations without touching the filesystem. */
  dryRun?: boolean;
};

export type SlideMutation = {
  slide: { id: string; path: string };
  operations: FileOperation[];
};

const TMP_SUFFIX = ".campfire-tmp";

function error(code: string, message: string, file?: string): Diagnostic {
  return { level: "error", code, message, file };
}

function failure(diagnostic: Diagnostic): Result<SlideMutation> {
  return { success: false, diagnostics: [diagnostic] };
}

const NUMBER_REFERENCE_PATTERN = /^\d+$/;

function slideId(number: number, slug: string): string {
  return `${padSlideNumber(number)}-${slug}`;
}

/** Find a slide by id ("03-solution"), slug ("solution"), or number ("3"). */
function resolveSlide(
  slides: SlideFile[],
  reference: string
): SlideFile | undefined {
  return (
    slides.find((slide) => slide.id === reference) ??
    slides.find((slide) => slide.slug === reference) ??
    (NUMBER_REFERENCE_PATTERN.test(reference)
      ? slides.find((slide) => slide.number === Number.parseInt(reference, 10))
      : undefined)
  );
}

function serializeSlide(frontmatter: SlideFrontmatter, body: string): string {
  const data = Object.fromEntries(
    Object.entries(frontmatter).filter(([, value]) => value !== undefined)
  );
  if (Object.keys(data).length === 0) {
    return body.endsWith("\n") ? body : `${body}\n`;
  }
  return matter.stringify(body, data);
}

/** Renames that turn the current file list into sequential 1..n numbering for
 * `ordered`. Applied in two phases (via temp names) so swaps cannot collide. */
function planRenumber(ordered: SlideFile[]): FileOperation[] {
  const operations: FileOperation[] = [];
  ordered.forEach((slide, index) => {
    const target = `slides/${slideFilename(index + 1, slide.slug)}`;
    if (target !== slide.path) {
      operations.push({ kind: "rename", path: slide.path, to: target });
    }
  });
  return operations;
}

/** Deletes run first so renames cannot collide with a file on its way out;
 * renames run in two phases (via temp names) so swaps cannot collide either;
 * creates/writes land last, on freed slots. */
function applyOperations(root: string, operations: FileOperation[]): void {
  for (const operation of operations) {
    if (operation.kind === "delete") {
      rmSync(join(root, operation.path));
    }
  }
  const renames = operations.filter((operation) => operation.kind === "rename");
  for (const rename of renames) {
    renameSync(join(root, rename.path), join(root, rename.path + TMP_SUFFIX));
  }
  for (const rename of renames) {
    renameSync(join(root, rename.path + TMP_SUFFIX), join(root, rename.to));
  }
  for (const operation of operations) {
    if (operation.kind === "create" || operation.kind === "write") {
      writeFileSync(join(root, operation.path), operation.content);
    }
  }
}

function postMutationDiagnostics(root: string): Diagnostic[] {
  return scanSlides(root).diagnostics;
}

function runMutation(
  root: string,
  slide: { id: string; path: string },
  operations: FileOperation[],
  options: MutationOptions
): Result<SlideMutation> {
  if (options.dryRun) {
    return { success: true, data: { slide, operations }, diagnostics: [] };
  }
  applyOperations(root, operations);
  return {
    success: true,
    data: { slide, operations },
    diagnostics: postMutationDiagnostics(root),
  };
}

export type AddSlideInput = {
  slug: string;
  title?: string;
  layout?: string;
  notes?: string;
  body?: string;
  /** 1-based position in the deck. Defaults to the end. */
  at?: number;
};

export function addSlide(
  root: string,
  input: AddSlideInput,
  options: MutationOptions = {}
): Result<SlideMutation> {
  if (!isValidSlug(input.slug)) {
    return failure(
      error(
        "invalid-slug",
        `"${input.slug}" is not a valid slug (lowercase letters, digits, dashes).`
      )
    );
  }
  const { slides } = scanSlides(root);
  if (slides.some((slide) => slide.slug === input.slug)) {
    return failure(
      error(
        "duplicate-slug",
        `A slide with slug "${input.slug}" already exists.`
      )
    );
  }
  const position = input.at ?? slides.length + 1;
  if (position < 1 || position > slides.length + 1) {
    return failure(
      error(
        "invalid-position",
        `Position ${position} is out of range 1..${slides.length + 1}.`
      )
    );
  }

  const path = `slides/${slideFilename(position, input.slug)}`;
  const shifted = [...slides];
  const placeholder = { ...slides[0], slug: input.slug, path } as SlideFile;
  shifted.splice(position - 1, 0, placeholder);
  const operations = planRenumber(shifted).filter(
    (operation) => operation.kind !== "rename" || operation.path !== path
  );
  operations.push({
    kind: "create",
    path,
    content: serializeSlide(
      { layout: input.layout, title: input.title, notes: input.notes },
      input.body ?? (input.title ? `# ${input.title}\n` : "")
    ),
  });

  return runMutation(
    root,
    {
      id: slideId(position, input.slug),
      path,
    },
    operations,
    options
  );
}

export function removeSlide(
  root: string,
  reference: string,
  options: MutationOptions = {}
): Result<SlideMutation> {
  const { slides } = scanSlides(root);
  const slide = resolveSlide(slides, reference);
  if (!slide) {
    return failure(
      error("slide-not-found", `No slide matches "${reference}".`)
    );
  }
  const remaining = slides.filter((entry) => entry.id !== slide.id);
  const operations: FileOperation[] = [
    { kind: "delete", path: slide.path },
    ...planRenumber(remaining),
  ];
  return runMutation(
    root,
    { id: slide.id, path: slide.path },
    operations,
    options
  );
}

export function moveSlide(
  root: string,
  reference: string,
  to: number,
  options: MutationOptions = {}
): Result<SlideMutation> {
  const { slides } = scanSlides(root);
  const slide = resolveSlide(slides, reference);
  if (!slide) {
    return failure(
      error("slide-not-found", `No slide matches "${reference}".`)
    );
  }
  if (to < 1 || to > slides.length) {
    return failure(
      error(
        "invalid-position",
        `Position ${to} is out of range 1..${slides.length}.`
      )
    );
  }
  const reordered = slides.filter((entry) => entry.id !== slide.id);
  reordered.splice(to - 1, 0, slide);
  const operations = planRenumber(reordered);
  const path = `slides/${slideFilename(to, slide.slug)}`;
  return runMutation(
    root,
    { id: slideId(to, slide.slug), path },
    operations,
    options
  );
}

export function renameSlide(
  root: string,
  reference: string,
  newSlug: string,
  options: MutationOptions = {}
): Result<SlideMutation> {
  if (!isValidSlug(newSlug)) {
    return failure(
      error(
        "invalid-slug",
        `"${newSlug}" is not a valid slug (lowercase letters, digits, dashes).`
      )
    );
  }
  const { slides } = scanSlides(root);
  const slide = resolveSlide(slides, reference);
  if (!slide) {
    return failure(
      error("slide-not-found", `No slide matches "${reference}".`)
    );
  }
  const path = `slides/${slideFilename(slide.number, newSlug)}`;
  const operations: FileOperation[] = [
    { kind: "rename", path: slide.path, to: path },
  ];
  return runMutation(
    root,
    { id: slideId(slide.number, newSlug), path },
    operations,
    options
  );
}

export type UpdateSlideInput = {
  /** undefined keeps the current value; null clears it. */
  title?: string | null;
  layout?: string | null;
  notes?: string | null;
  body?: string;
};

export function updateSlide(
  root: string,
  reference: string,
  input: UpdateSlideInput,
  options: MutationOptions = {}
): Result<SlideMutation> {
  const { slides } = scanSlides(root);
  const slide = resolveSlide(slides, reference);
  if (!slide) {
    return failure(
      error("slide-not-found", `No slide matches "${reference}".`)
    );
  }
  const merge = (
    next: string | null | undefined,
    current: string | undefined
  ): string | undefined => (next === undefined ? current : (next ?? undefined));

  const frontmatter: SlideFrontmatter = {
    layout: merge(input.layout, slide.frontmatter.layout),
    title: merge(input.title, slide.frontmatter.title),
    notes: merge(input.notes, slide.frontmatter.notes),
  };
  const operations: FileOperation[] = [
    {
      kind: "write",
      path: slide.path,
      content: serializeSlide(frontmatter, input.body ?? slide.body),
    },
  ];
  return runMutation(
    root,
    { id: slide.id, path: slide.path },
    operations,
    options
  );
}

export function slideExists(root: string, reference: string): boolean {
  const { slides } = scanSlides(root);
  return resolveSlide(slides, reference) !== undefined;
}

export function projectFileExists(root: string, relativePath: string): boolean {
  return existsSync(join(root, relativePath));
}
