"use client";

import React from "react";
import { BracketLink } from "@/components/avenlo/bracket-button";
import { SectionEyebrow, SplitHeading } from "@/components/avenlo/motion";
import { CollapsingCards } from "@/components/ui/cue-collapsing-cards-accordion";
import { DestinationSpotlightCard } from "@/components/ui/destination-spotlight-card";
import { InteractiveSelector } from "@/components/ui/interactive-selector";
import { MarketIntelligenceBento } from "@/components/ui/market-intelligence-bento";

/* -------------------------------------------------------------------------- */
/* A. CUE COLLAPSING CARDS ACCORDION + 3 AMBIENT DESTINATION SPOTLIGHT CARDS  */
/* -------------------------------------------------------------------------- */
const SPOTLIGHT_DESTINATIONS = [
  {
    titleTop: "JUMEIRAH",
    titleBottom: "ISLANDS",
    developer: "NAKHEEL",
    description:
      "Private waterfront villa clusters framed by shimmering freshwater lagoons and lush landscaped boardwalks across New Dubai.",
    image: "/img/projects/nakheel/jumeirah-islands.webp",
    href: "/off-plan/jumeirah-islands",
    gradientClass: "from-[#7dd3fc] via-[#e0f2fe] to-[#51fec0]",
  },
  {
    titleTop: "CREEK",
    titleBottom: "HARBOUR",
    developer: "EMAAR PROPERTIES",
    description:
      "Waterfront towers overlooking the Ras Al Khor skyline sanctuary, private creek marina promenade, and future central park.",
    image: "/img/projects/emaar/grove-ridge.webp",
    href: "/off-plan/grove-ridge",
    gradientClass: "from-[#93c5fd] via-[#c7d2fe] to-[#67e8f9]",
  },
  {
    titleTop: "VELA",
    titleBottom: "MARASI BAY",
    developer: "OMNIYAT",
    description:
      "Architectural waterfront residences curated by Dorchester Collection along Marasi Bay with cantilevered marina sky pools.",
    image: "/img/projects/omniyat/vela.webp",
    href: "/off-plan/vela",
    gradientClass: "from-[#67e8f9] via-[#a5f3fc] to-[#51fec0]",
  },
];

export function FlagshipAccordionAndSpotlights() {
  return (
    <section className="relative bg-white/20 py-24 backdrop-blur-[2px]">
      <div className="mx-auto max-w-[1260px] px-4 sm:px-8">
        {/* Part 1: Cue Collapsing Cards Horizontal Accordion */}
        <div className="flex flex-wrap items-end justify-between gap-6">
          <div>
            <SectionEyebrow>ARCHITECTURAL MASTERPLANS</SectionEyebrow>
            <SplitHeading
              primary="Five addresses,"
              muted="hover to expand"
              className="mt-5"
            />
          </div>
          <BracketLink href="/off-plan" variant="light" size="sm">
            Full Off-Plan Index
          </BracketLink>
        </div>

        <CollapsingCards className="mt-12" />

        {/* Part 2: 3-Column Ambient Glow Destination Spotlight Cards */}
        <div className="mt-20">
          <div className="flex flex-wrap items-end justify-between gap-6">
            <div>
              <SectionEyebrow>SIGNATURE WATERFRONT ADDRESSES</SectionEyebrow>
              <SplitHeading
                size="md"
                primary="Iconic UAE living,"
                muted="curated by master developer"
                className="mt-4"
              />
            </div>
            <BracketLink href="/developers" variant="light" size="sm">
              Explore Developers
            </BracketLink>
          </div>

          <div className="mt-10 grid grid-cols-1 gap-6 md:grid-cols-3">
            {SPOTLIGHT_DESTINATIONS.map((dest) => (
              <DestinationSpotlightCard key={dest.href} {...dest} />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

/* -------------------------------------------------------------------------- */
/* B. LUMINOUS 21ST.DEV DUBAI MARKET INTELLIGENCE BENTO                       */
/* -------------------------------------------------------------------------- */
export function DubaiMarketIntelligenceSuite() {
  return <MarketIntelligenceBento />;
}

/* -------------------------------------------------------------------------- */
/* C. INTERACTIVE CORRIDOR SELECTOR SECTION                                   */
/* -------------------------------------------------------------------------- */
export function DubaiLifestyleSelectorSection() {
  return (
    <section className="relative bg-white/18 py-20 backdrop-blur-[2px]">
      <div className="mx-auto max-w-[1260px] px-4 sm:px-8">
        <InteractiveSelector />
      </div>
    </section>
  );
}
