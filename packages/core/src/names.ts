const SLIDE_FILENAME_PATTERN = /^(\d+)-([a-z0-9][a-z0-9-]*)\.mdx$/;

export type ParsedSlideFilename = {
  number: number;
  slug: string;
  id: string;
};

export function parseSlideFilename(
  filename: string
): ParsedSlideFilename | undefined {
  const match = SLIDE_FILENAME_PATTERN.exec(filename);
  if (!match) {
    return;
  }
  const [, digits, slug] = match;
  if (!(digits && slug)) {
    return;
  }
  return {
    number: Number.parseInt(digits, 10),
    slug,
    id: `${digits}-${slug}`,
  };
}

export function slideFilename(number: number, slug: string): string {
  return `${padSlideNumber(number)}-${slug}.mdx`;
}

export function padSlideNumber(number: number): string {
  return String(number).padStart(2, "0");
}

export function isValidSlug(slug: string): boolean {
  return /^[a-z0-9][a-z0-9-]*$/.test(slug);
}

/** `metric-card` -> `MetricCard`. The directory part of a path is ignored:
 * component names form a single flat namespace. */
export function pascalCase(kebab: string): string {
  return kebab
    .split("-")
    .filter(Boolean)
    .map((part) => part[0]?.toUpperCase() + part.slice(1))
    .join("");
}

export function baseNameWithoutExtension(filePath: string): string {
  const file = filePath.split("/").at(-1) ?? filePath;
  return file.replace(/\.[^.]+$/, "");
}
