import AgendaLayout from "@campfire/registry/items/agenda";
import AgendaItem from "@campfire/registry/items/agenda-item";
import Callout from "@campfire/registry/items/callout";
import ClosingLayout from "@campfire/registry/items/closing";
import LogoCloud from "@campfire/registry/items/logo-cloud";
import MetricCard from "@campfire/registry/items/metric-card";
import Problem from "@campfire/registry/items/problem";
import ProblemSolutionLayout from "@campfire/registry/items/problem-solution";
import QuoteCard from "@campfire/registry/items/quote-card";
import SectionLayout from "@campfire/registry/items/section";
import Solution from "@campfire/registry/items/solution";
import SplitLayout from "@campfire/registry/items/split";
import StatementLayout from "@campfire/registry/items/statement";
import Step from "@campfire/registry/items/step";
import TeamMember from "@campfire/registry/items/team-member";
import Timeline from "@campfire/registry/items/timeline";
import TimelineItem from "@campfire/registry/items/timeline-item";
import TitleLayout from "@campfire/registry/items/title";
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
      <LogoCloud heading="Trusted by teams at">
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
      <QuoteCard
        affiliation="Analyst, Analytical Engines"
        author="Ada Lovelace"
        quote="The deck that lives in git is the deck that stays true."
      />
    </Slide>
  ),
  step: (
    <Slide>
      <div className="flex flex-col gap-10">
        <Step heading="Write slides" number="1">
          One MDX file per slide — 01-campfire.mdx, 02-why.mdx.
        </Step>
        <Step heading="Shape the story" number="2">
          Layouts and components are plain React.
        </Step>
        <Step heading="Present" number="3">
          camp watches the filesystem and hot reloads.
        </Step>
      </div>
    </Slide>
  ),
  timeline: (
    <Slide>
      <Timeline>
        <TimelineItem heading="Prototype" period="Q1">
          Filesystem runtime and live shell.
        </TimelineItem>
        <TimelineItem heading="Registry" period="Q2">
          shadcn-compatible blocks and primitives.
        </TimelineItem>
        <TimelineItem heading="Kits" period="Q3">
          Starter packs that compose blocks.
        </TimelineItem>
        <TimelineItem heading="v1" period="Q4">
          Stable layout contract.
        </TimelineItem>
      </Timeline>
    </Slide>
  ),
  "team-member": (
    <Slide>
      <div className="flex gap-12">
        <TeamMember name="Ada Lovelace" position="CEO & Co-founder" />
        <TeamMember name="Grace Hopper" position="CTO & Co-founder" />
        <TeamMember name="Alan Turing" position="Founding Engineer" />
      </div>
    </Slide>
  ),
  title: (
    <TitleLayout title="Campfire">
      Where stories are told. Slides are MDX files, layouts are React, and the
      whole deck is just a repository.
    </TitleLayout>
  ),
  agenda: (
    <AgendaLayout title="Agenda">
      <AgendaItem heading="The problem" number="01" />
      <AgendaItem heading="What we built" number="02" />
      <AgendaItem heading="Where it goes next" number="03" />
    </AgendaLayout>
  ),
  section: (
    <SectionLayout title="Numbers">
      Section divider before the metrics deep-dive.
    </SectionLayout>
  ),
  split: (
    <SplitLayout title="Two ways to tell it">
      <div className="flex flex-col gap-4">
        <p>
          Narrative on the left: why decks belong in git, diffed and reviewed
          like everything else you ship.
        </p>
      </div>
      <div className="flex flex-col gap-6">
        <MetricCard delta="+18%" label="Activation lift" value="42%" />
        <MetricCard label="Teams onboarded" value="1,200" />
      </div>
    </SplitLayout>
  ),
  statement: (
    <StatementLayout title="The takeaway">
      The repo is the deck.
    </StatementLayout>
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
  closing: (
    <ClosingLayout title="Thanks">
      bun create campfire my-deck — and tell your story.
    </ClosingLayout>
  ),
};
