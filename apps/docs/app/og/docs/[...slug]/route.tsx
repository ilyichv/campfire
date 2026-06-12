import { readFileSync } from "node:fs";
import { join } from "node:path";
import { ImageResponse } from "@takumi-rs/image-response";
import { notFound } from "next/navigation";
import { appName } from "@/lib/shared";
import { getPageImage, source } from "@/lib/source";

export const revalidate = false;

const logo = `data:image/png;base64,${readFileSync(
  join(process.cwd(), "public/logo.png")
).toString("base64")}`;

const fraunces = readFileSync(
  join(process.cwd(), "lib/og/fraunces-semibold.ttf")
);

const karla = readFileSync(join(process.cwd(), "lib/og/karla-regular.ttf"));

// Campfire palette, mirroring the docs theme in global.css.
const PARCHMENT = "#f8f3ea";
const ESPRESSO = "#42301f";
const ESPRESSO_MUTED = "#84715a";
const EMBER = "#d65420";

export async function GET(
  _req: Request,
  { params }: RouteContext<"/og/docs/[...slug]">
) {
  const { slug } = await params;
  const page = source.getPage(slug.slice(0, -1));
  if (!page) {
    notFound();
  }

  return new ImageResponse(
    <div
      style={{ backgroundColor: PARCHMENT, color: ESPRESSO }}
      tw="flex h-full w-full flex-col justify-between p-16"
    >
      <div tw="flex items-center">
        {/* biome-ignore lint/performance/noImgElement: JSX rendered to a PNG by Takumi, not served to a browser. */}
        <img alt="" height={72} src={logo} width={72} />
        <span
          style={{ fontFamily: "Fraunces" }}
          tw="ml-4 font-semibold text-4xl"
        >
          {appName}
        </span>
      </div>
      <div tw="flex flex-col">
        <span
          style={{ fontFamily: "Fraunces" }}
          tw="font-semibold text-7xl tracking-tight"
        >
          {page.data.title}
        </span>
        {page.data.description ? (
          <span
            style={{ color: ESPRESSO_MUTED, fontFamily: "Karla" }}
            tw="mt-6 text-3xl"
          >
            {page.data.description}
          </span>
        ) : null}
      </div>
      <div tw="flex items-center justify-between">
        <div tw="flex items-center">
          <div
            style={{ backgroundColor: EMBER }}
            tw="mr-4 h-3 w-12 rounded-full"
          />
          <span
            style={{ color: ESPRESSO_MUTED, fontFamily: "Karla" }}
            tw="text-2xl"
          >
            campfire-deck.vercel.app
          </span>
        </div>
        <span style={{ color: EMBER }} tw="font-semibold text-2xl">
          docs
        </span>
      </div>
    </div>,
    {
      width: 1200,
      height: 630,
      fonts: [
        { name: "Fraunces", data: fraunces },
        { name: "Karla", data: karla },
      ],
    }
  );
}

export function generateStaticParams() {
  return source.getPages().map((page) => ({
    slug: getPageImage(page).segments,
  }));
}
