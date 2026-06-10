import fs from "node:fs/promises";
import path from "node:path";
import { ServerCodeBlock } from "fumadocs-ui/components/codeblock.rsc";
import { Tab, Tabs } from "fumadocs-ui/components/tabs";
import type { ReactNode } from "react";
import { demos } from "./demos";
import { SlideFrame } from "./slide-frame";

/**
 * Shadcn-style preview block: a live render of the registry item on a scaled
 * slide canvas, with the MDX usage snippet (passed as children) in a Code tab.
 */
export function ComponentPreview({
  name,
  children,
}: {
  name: string;
  children: ReactNode;
}) {
  const demo = demos[name];
  if (!demo) {
    throw new Error(`No demo registered for registry item "${name}"`);
  }

  return (
    <Tabs items={["Preview", "Code"]}>
      <Tab value="Preview">
        <SlideFrame>{demo}</SlideFrame>
      </Tab>
      <Tab value="Code">{children}</Tab>
    </Tabs>
  );
}

const itemsDir = path.join(
  process.cwd(),
  "node_modules/@campfire/registry/items"
);

/** Highlighted source of a registry item, read from the registry package. */
export async function ComponentSource({
  name,
  title,
}: {
  name: string;
  title?: string;
}) {
  const code = await fs.readFile(path.join(itemsDir, `${name}.tsx`), "utf8");

  return (
    <ServerCodeBlock code={code.trim()} codeblock={{ title }} lang="tsx" />
  );
}
