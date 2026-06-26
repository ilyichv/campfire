declare module "virtual:campfire/project" {
  import type { ProjectManifest } from "@campfire-deck/core";

  const manifest: ProjectManifest;
  export default manifest;
}

declare module "virtual:campfire/slides" {
  import type { ComponentType } from "react";

  export type SlideEntry = {
    Component: ComponentType<{
      components?: Record<string, ComponentType<unknown>>;
    }>;
    id: string;
    number: number;
    slug: string;
    path: string;
    layout?: string;
    title?: string;
    notes?: string;
  };
  export const slides: SlideEntry[];
}

declare module "virtual:campfire/layouts" {
  import type { ComponentType, ReactNode } from "react";

  export const layouts: Record<
    string,
    ComponentType<{ title?: string; children: ReactNode }>
  >;
}

declare module "virtual:campfire/components" {
  import type { ComponentType } from "react";

  export const components: Record<string, ComponentType<unknown>>;
}

declare module "virtual:campfire/mdx-components" {
  import type { ComponentType } from "react";

  export const mdxComponents: Record<string, ComponentType<unknown>>;
}

declare module "virtual:campfire/theme.css";
