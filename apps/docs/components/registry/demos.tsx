import Callout from "@campfire/registry/items/callout";
import ClosingLayout from "@campfire/registry/items/closing";
import LogoCloud from "@campfire/registry/items/logo-cloud";
import MetricCard from "@campfire/registry/items/metric-card";
import Problem from "@campfire/registry/items/problem";
import ProblemSolutionLayout from "@campfire/registry/items/problem-solution";
import QuoteLayout from "@campfire/registry/items/quote";
import QuoteCard from "@campfire/registry/items/quote-card";
import SectionLayout from "@campfire/registry/items/section";
import Solution from "@campfire/registry/items/solution";
import Step from "@campfire/registry/items/step";
import TitleLayout from "@campfire/registry/items/title";
import TractionLayout from "@campfire/registry/items/traction";
import type { ReactNode } from "react";

/** Primitives render inside a minimal slide so they appear at slide scale. */
function Slide({ children }: { children: ReactNode }) {
  return (
    <main className="flex h-full flex-col items-center justify-center gap-10 p-24">
      {children}
    </main>
  );
}

export const demos: Record<string, ReactNode> = {
  "metric-card": (
    <Slide>
      <div className="flex gap-8">
        <MetricCard delta="+18%" label="Activation lift" value="42%" />
        <MetricCard label="Teams onboarded" value="1,200" />
      </div>
    </Slide>
  ),
  "logo-cloud": (
    <Slide>
      <LogoCloud title="Trusted by teams at">
        <span className="font-bold text-3xl">acme</span>
        <span className="font-bold text-3xl">globex</span>
        <span className="font-bold text-3xl">initech</span>
        <span className="font-bold text-3xl">umbrella</span>
        <span className="font-bold text-3xl">hooli</span>
      </LogoCloud>
    </Slide>
  ),
  callout: (
    <Slide>
      <div className="flex w-full max-w-4xl flex-col gap-6">
        <Callout>Slides are files — the repo is the deck.</Callout>
        <Callout tone="primary">
          Registry items are copied as source. Edit them.
        </Callout>
        <Callout tone="warning">
          Filename ordering is the contract: 01, 02, 03…
        </Callout>
      </div>
    </Slide>
  ),
  "quote-card": (
    <Slide>
      {/* biome-ignore lint/a11y/useValidAriaRole: QuoteCard's role prop is attribution, not ARIA */}
      <QuoteCard
        author="Ada Lovelace"
        quote="The deck that lives in git is the deck that stays true."
        role="Analyst, Analytical Engines"
      />
    </Slide>
  ),
  step: (
    <Slide>
      <div className="flex flex-col gap-10">
        <Step number="1" title="Write slides">
          One MDX file per slide — 01-campfire.mdx, 02-why.mdx.
        </Step>
        <Step number="2" title="Shape the story">
          Layouts and components are plain React.
        </Step>
        <Step number="3" title="Present">
          camp watches the filesystem and hot reloads.
        </Step>
      </div>
    </Slide>
  ),
  title: (
    <TitleLayout title="Campfire">
      Where stories are told. Slides are MDX files, layouts are React, and the
      whole deck is just a repository.
    </TitleLayout>
  ),
  section: (
    <SectionLayout title="Numbers">
      Section divider before the metrics deep-dive.
    </SectionLayout>
  ),
  "problem-solution": (
    <ProblemSolutionLayout title="Why Campfire">
      <Problem>
        Decks rot inside proprietary tools — unversioned, undiffable, and
        impossible for coding agents to help with.
      </Problem>
      <Solution>
        The repo is the deck. Files diff, agents edit safely, and camp serves a
        live presentation shell.
      </Solution>
    </ProblemSolutionLayout>
  ),
  quote: (
    <QuoteLayout>
      {/* biome-ignore lint/a11y/useValidAriaRole: QuoteCard's role prop is attribution, not ARIA */}
      <QuoteCard
        author="Grace Hopper"
        quote="The most damaging phrase in the language is: it's always been done this way."
        role="Rear Admiral, US Navy"
      />
    </QuoteLayout>
  ),
  traction: (
    <TractionLayout title="Traction">
      <MetricCard delta="+18%" label="Activation lift" value="42%" />
      <MetricCard label="Teams onboarded" value="1,200" />
      <MetricCard delta="+5pts" label="NPS" value="68" />
    </TractionLayout>
  ),
  closing: (
    <ClosingLayout title="Thanks">
      bun create campfire my-deck — and tell your story.
    </ClosingLayout>
  ),
};
