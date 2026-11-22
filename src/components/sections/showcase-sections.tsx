"use client";

import React, { useEffect, useState } from "react";
import { BracketLink } from "@/components/avenlo/bracket-button";
import { SectionEyebrow, SplitHeading } from "@/components/avenlo/motion";
import { CollapsingCards } from "@/components/ui/cue-collapsing-cards-accordion";
import { DestinationSpotlightCard } from "@/components/ui/destination-spotlight-card";
import { InteractiveSelector } from "@/components/ui/interactive-selector";
import { MarketCard } from "@/components/ui/market-card";
import { PeakChart } from "@/components/ui/peak-chart";

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
/* B. DUBAI MARKET INTELLIGENCE SUITE — MARKET CARD (x2) + PEAK CHART (x2)    */
/* -------------------------------------------------------------------------- */
const PRIME_PSF_SERIES = [
  1680, 1745, 1810, 1890, 1940, 2030, 2110, 2195, 2260, 2340, 2415, 2490, 2560, 2640,
];

const GROSS_YIELD_SERIES = [
  5.9, 6.1, 6.3, 6.5, 6.4, 6.8, 7.1, 7.3, 7.5, 7.4, 7.7, 8.0, 8.2, 7.9,
];

const YIELD_BY_SEGMENT: Record<
  string,
  { data: number[]; labels: string[]; value: number }
> = {
  "1–2 Bed": {
    data: [6.1, 6.4, 6.7, 6.9, 7.2, 7.5, 7.8, 7.6],
    labels: ["Marina", "Downtown", "Bus. Bay", "Hills", "Creek", "Arjan", "JVC", "Furjan"],
    value: 7.8,
  },
  Studios: {
    data: [6.8, 7.1, 7.4, 7.8, 8.1, 8.4, 8.6, 8.3],
    labels: ["Marina", "Bus. Bay", "Azizi", "DSO", "Arjan", "Sports", "JVC", "South"],
    value: 8.6,
  },
  Villas: {
    data: [4.8, 5.1, 5.3, 5.6, 5.9, 6.2, 6.4, 6.1],
    labels: ["Palm", "Hills", "Ranches", "Islands", "Tilal", "Lagoons", "Furjan", "South"],
    value: 6.4,
  },
};

const DEMAND_BY_PERIOD: Record<
  string,
  { data: number[]; labels: string[]; value: number }
> = {
  Quarterly: {
    data: [112, 121, 128, 134, 142, 149, 158, 166],
    labels: ["Q1 '24", "Q2 '24", "Q3 '24", "Q4 '24", "Q1 '25", "Q2 '25", "Q3 '25", "Q4 '25"],
    value: 166,
  },
  Annual: {
    data: [98, 114, 131, 148, 169, 184],
    labels: ["2021", "2022", "2023", "2024", "2025", "2026"],
    value: 184,
  },
  "5-Year": {
    data: [92, 101, 110, 118, 127, 135, 144, 153, 161, 170, 178, 188],
    labels: ["H1 '21", "H2 '21", "H1 '22", "H2 '22", "H1 '23", "H2 '23", "H1 '24", "H2 '24", "H1 '25", "H2 '25", "H1 '26", "H2 '26"],
    value: 188,
  },
};

export function DubaiMarketIntelligenceSuite() {
  const [demandPeriod, setDemandPeriod] = useState("Annual");
  const [yieldSegment, setYieldSegment] = useState("1–2 Bed");
  const [chartWidth, setChartWidth] = useState(340);

  useEffect(() => {
    const update = () => {
      const vw = window.innerWidth;
      if (vw < 480) setChartWidth(Math.max(250, vw - 64));
      else if (vw < 768) setChartWidth(330);
      else if (vw < 1024) setChartWidth(320);
      else setChartWidth(360);
    };
    update();
    window.addEventListener("resize", update);
    return () => window.removeEventListener("resize", update);
  }, []);

  const demand = DEMAND_BY_PERIOD[demandPeriod] ?? DEMAND_BY_PERIOD.Annual;
  const yieldData = YIELD_BY_SEGMENT[yieldSegment] ?? YIELD_BY_SEGMENT["1–2 Bed"];

  return (
    <section
      aria-label="Dubai Real Estate Market Intelligence"
      className="relative overflow-hidden bg-gradient-to-b from-[#070f1a]/97 via-[#0a1424]/96 to-[#0b131e]/97 py-24 text-white border-b border-white/10 backdrop-blur-xl"
    >
      <div className="mx-auto max-w-[1260px] px-4 sm:px-8">
        {/* Section Header */}
        <div className="flex flex-wrap items-end justify-between gap-6">
          <div>
            <SectionEyebrow tone="dark">DUBAI MARKET INTELLIGENCE</SectionEyebrow>
            <SplitHeading
              tone="dark"
              primary="Data-led conviction,"
              muted="drag & hover every curve"
              className="mt-5"
            />
          </div>
          <BracketLink href="/calculators" variant="white" size="sm">
            Open DLD &amp; Yield Calculators
          </BracketLink>
        </div>

        {/* Row 1: Two Interactive Louis Studios MarketCards (Odometer Digits + Dynamic Travelling Glow) */}
        <div className="mt-12 grid grid-cols-1 gap-6 lg:grid-cols-2">
          <div className="h-[270px] sm:h-[290px] w-full overflow-hidden rounded-[28px] border border-white/10 bg-[#08101a]/80">
            <MarketCard
              data={PRIME_PSF_SERIES}
              format={(v) => `AED ${Math.round(v).toLocaleString("en-US")}`}
              label="Prime Corridor AED / sq ft"
              deltaLabel="across Dubai freehold tiers (indicative)."
              defaultIndex={10}
              accent="#4358e2"
              cardColor="#0d1522"
              background="transparent"
              grid
              fill={0.94}
              menu={false}
            />
          </div>

          <div className="h-[270px] sm:h-[290px] w-full overflow-hidden rounded-[28px] border border-white/10 bg-[#08101a]/80">
            <MarketCard
              data={GROSS_YIELD_SERIES}
              format={(v) => `${v.toFixed(1)}%`}
              label="Freehold Gross Yield"
              deltaLabel="before Mollak service charges (indicative)."
              defaultIndex={11}
              accent="#14b886"
              cardColor="#0d1522"
              background="transparent"
              grid
              fill={0.94}
              menu={false}
            />
          </div>
        </div>

        {/* Row 2: Two Interactive Louis Studios PeakCharts (Hover Crosshair + Period Switcher) */}
        <div className="mt-10 rounded-[32px] border border-white/12 bg-[#08101a]/92 px-4 py-12 sm:px-8 sm:py-14 shadow-[0_30px_80px_rgba(0,0,0,0.45)]">
          <div className="flex flex-wrap items-center justify-center gap-12 lg:gap-16">
            <PeakChart
              width={chartWidth}
              accent="#4f8ef7"
              data={demand.data}
              labels={demand.labels}
              value={demand.value}
              valueSuffix=""
              decimals={0}
              title="DLD Demand Index"
              caption="Base 100 · indicative freehold cycle"
              updatedText="DLD Benchmark"
              periods={["Quarterly", "Annual", "5-Year"]}
              period={demandPeriod}
              onPeriodChange={setDemandPeriod}
              formatValue={(v) => `Idx ${Math.round(v)}`}
            />

            <PeakChart
              width={chartWidth}
              accent="#2ec99a"
              data={yieldData.data}
              labels={yieldData.labels}
              value={yieldData.value}
              valueSuffix="%"
              decimals={1}
              title="Indicative Gross Yield"
              caption="Hover curve to compare districts"
              updatedText="Dubai Freehold"
              periods={["1–2 Bed", "Studios", "Villas"]}
              period={yieldSegment}
              onPeriodChange={setYieldSegment}
              formatValue={(v) => `${v.toFixed(1)}%`}
            />
          </div>
        </div>

        {/* Mandatory RERA Transparency Footnote */}
        <p className="mt-6 text-center text-[11.5px] leading-relaxed text-white/55">
          Indicative Dubai freehold market reference curves compiled for general orientation only—not guaranteed yields, valuations, or financial advice. Every SWK shortlist is benchmarked against live DLD achieved transactions and verified Mollak service charges.
        </p>
      </div>
    </section>
  );
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
