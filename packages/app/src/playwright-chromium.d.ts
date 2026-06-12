/** Minimal surface of the optional playwright-chromium dependency.
 * Declared here so the monorepo type-checks without installing it
 * (and without its Chromium download). */
declare module "playwright-chromium" {
  export type Page = {
    goto(
      url: string,
      options?: { waitUntil?: "load" | "domcontentloaded" | "networkidle" }
    ): Promise<unknown>;
    waitForSelector(
      selector: string,
      options?: { state?: "attached" | "visible"; timeout?: number }
    ): Promise<unknown>;
    pdf(options?: {
      path?: string;
      preferCSSPageSize?: boolean;
      printBackground?: boolean;
    }): Promise<Uint8Array>;
  };

  export type Browser = {
    newPage(): Promise<Page>;
    close(): Promise<void>;
  };

  export const chromium: {
    launch(options?: { headless?: boolean }): Promise<Browser>;
  };
}
