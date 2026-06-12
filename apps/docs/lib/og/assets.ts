import { readFileSync } from "node:fs";
import { join } from "node:path";

// Campfire palette, mirroring the docs theme in global.css.
export const PARCHMENT = "#f8f3ea";
export const ESPRESSO = "#42301f";
export const ESPRESSO_MUTED = "#84715a";
export const EMBER = "#d65420";

export const logo = `data:image/png;base64,${readFileSync(
  join(process.cwd(), "public/logo.png")
).toString("base64")}`;

export const ogFonts = [
  {
    name: "Fraunces",
    data: readFileSync(join(process.cwd(), "lib/og/fraunces-semibold.ttf")),
  },
  {
    name: "Karla",
    data: readFileSync(join(process.cwd(), "lib/og/karla-regular.ttf")),
  },
];
