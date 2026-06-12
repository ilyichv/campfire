import { ImageResponse } from "@takumi-rs/image-response";
import {
  EMBER,
  ESPRESSO,
  ESPRESSO_MUTED,
  logo,
  ogFonts,
  PARCHMENT,
} from "@/lib/og/assets";

export const alt = "Campfire — filesystem-native presentations";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function Image() {
  return new ImageResponse(
    <div
      style={{ backgroundColor: PARCHMENT, color: ESPRESSO }}
      tw="flex h-full w-full flex-col items-center justify-center"
    >
      {/* biome-ignore lint/performance/noImgElement: JSX rendered to a PNG by Takumi, not served to a browser. */}
      <img alt="" height={200} src={logo} width={200} />
      <span
        style={{ fontFamily: "Fraunces" }}
        tw="mt-8 font-semibold text-8xl tracking-tight"
      >
        Campfire
      </span>
      <span
        style={{ color: ESPRESSO_MUTED, fontFamily: "Karla" }}
        tw="mt-6 text-3xl"
      >
        A filesystem-native presentation runtime
      </span>
      <div tw="mt-10 flex items-center">
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
    </div>,
    { ...size, fonts: ogFonts }
  );
}
