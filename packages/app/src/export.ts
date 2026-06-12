import { basename, resolve } from "node:path";
import { loadProject } from "@campfire/core";
import { startCampfireApp } from "./server.js";

export const PLAYWRIGHT_INSTALL_HINT =
  "PDF export needs Chromium via playwright-chromium. Install it in your deck:\n  bun add -D playwright-chromium";

/** Raised when playwright-chromium is not installed; the CLI turns this
 * into the install hint instead of a stack trace. */
export class PlaywrightMissingError extends Error {
  constructor() {
    super(PLAYWRIGHT_INSTALL_HINT);
    this.name = "PlaywrightMissingError";
  }
}

export type ExportPdfOptions = {
  /** Absolute path of the presentation project root. */
  root: string;
  /** Output file; defaults to `<deck-title-or-dirname>.pdf` in cwd. */
  out?: string;
  port?: number;
};

async function loadChromium() {
  try {
    const { chromium } = await import("playwright-chromium");
    return chromium;
  } catch {
    throw new PlaywrightMissingError();
  }
}

function slug(value: string): string {
  return (
    value
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-+|-+$/g, "") || "deck"
  );
}

/** Print the deck to a vector PDF (one page per slide) by driving headless
 * Chromium against the shell's #/print route. */
export async function exportPdf(options: ExportPdfOptions): Promise<string> {
  const chromium = await loadChromium();
  const project = await loadProject({ root: options.root });
  const out = resolve(
    options.out ?? `${slug(project.title ?? basename(options.root))}.pdf`
  );

  const server = await startCampfireApp({
    root: options.root,
    port: options.port ?? 3030,
    open: false,
  });
  try {
    const url = server.resolvedUrls?.local[0];
    if (!url) {
      throw new Error("The Campfire dev server did not report a local URL.");
    }
    const browser = await chromium.launch();
    try {
      const page = await browser.newPage();
      await page.goto(`${url}#/print`, { waitUntil: "networkidle" });
      // The print view flips this after mount + document.fonts.ready.
      await page.waitForSelector('html[data-cf-ready="true"]', {
        state: "attached",
      });
      await page.pdf({
        path: out,
        preferCSSPageSize: true,
        printBackground: true,
      });
    } finally {
      await browser.close();
    }
  } finally {
    await server.close();
  }
  return out;
}
