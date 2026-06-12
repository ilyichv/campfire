import { RootProvider } from "fumadocs-ui/provider/next";
import type { Metadata } from "next";
import "./global.css";
import { Fraunces, Karla } from "next/font/google";

const karla = Karla({
  subsets: ["latin"],
  variable: "--font-karla",
});

const fraunces = Fraunces({
  subsets: ["latin"],
  variable: "--font-fraunces",
  axes: ["opsz", "SOFT", "WONK"],
});

export const metadata: Metadata = {
  metadataBase: new URL("https://campfire-deck.vercel.app"),
  title: {
    default: "Campfire — filesystem-native presentations",
    template: "%s | Campfire",
  },
  description:
    "Write slides in MDX, shape the story with React layouts, and present from a live local shell.",
};

export default function Layout({ children }: LayoutProps<"/">) {
  return (
    <html
      className={`${karla.variable} ${fraunces.variable}`}
      lang="en"
      suppressHydrationWarning
    >
      <body className="flex min-h-screen flex-col font-sans">
        <RootProvider>{children}</RootProvider>
      </body>
    </html>
  );
}
