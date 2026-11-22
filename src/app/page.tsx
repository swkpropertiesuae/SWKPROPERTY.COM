import {
  AvenloHero,
  EditorialBento,
  DubaiDeveloperPulse,
  FullBleedResidences,
  ServicesAndTrackRecord,
  CommunitiesAndTicker,
  AcquisitionStagesWave,
  ClientVoices,
  InsightsPreview,
} from "@/components/sections/home-sections";
import { Faq } from "@/components/site/faq";
import { CtaBanner } from "@/components/avenlo/motion";

export default function Home() {
  return (
    <>
      <link
        rel="preload"
        as="image"
        href="/img/hero/dubai-skyline-hero.webp"
        fetchPriority="high"
      />

      {/* 01 · Bright Architectural Hairline-Grid Hero (owns the page's single <h1>) */}
      <AvenloHero />

      {/* 02 · Scroll-Reveal Editorial Statement & 2-Card Client Growth Bento */}
      <EditorialBento />

      {/* 03 · What's Happening in Dubai: 27+ Master Developers & Live 2026 Releases */}
      <DubaiDeveloperPulse />

      {/* 04 · Six Full-Bleed Architectural Residence Showcase Panels */}
      <FullBleedResidences />

      {/* 05 · Obsidian Contrast Band: 01-04 Services, 3 Photo Cards & Track Record */}
      <ServicesAndTrackRecord />

      {/* 06 · Dubai Marquee Ticker & 8 Core Community Corridors */}
      <CommunitiesAndTicker />

      {/* 07 · Four-Column Staggered Acquisition Stages Wave */}
      <AcquisitionStagesWave />

      {/* 08 · Verified Client Stories & Two-Column FAQ */}
      <ClientVoices />
      <Faq />

      {/* 09 · Dubai Market Insights & Buyer Guides Preview */}
      <InsightsPreview />

      {/* 10 · Full-Bleed Dubai Architectural CTA Banner */}
      <CtaBanner />
    </>
  );
}
