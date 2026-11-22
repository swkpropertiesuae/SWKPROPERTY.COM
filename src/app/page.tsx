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
        href="/img/hero/uae-skyline-flagship.webp"
        fetchPriority="high"
      />

      {/* 01 · Active Architectural Hero Over Live 21st.dev Mesh Drift ShaderBackground */}
      <AvenloHero />

      {/* 02 · Scroll-Reveal Editorial Statement & 2-Card Glass Client Growth Bento */}
      <EditorialBento />

      {/* 03 · 21st.dev Logo Cloud Marquee & Gallery Hover Carousel */}
      <DubaiDeveloperPulse />

      {/* 04 · 21st.dev Dual-Spring Tilted Architectural Cascade Showcase */}
      <FullBleedResidences />

      {/* 05 · Obsidian Contrast Band: 01-04 Services, 3 Photo Cards & Track Record */}
      <ServicesAndTrackRecord />

      {/* 06 · Glass Marquee Ticker & 21st.dev 3D Flip Dubai Communities */}
      <CommunitiesAndTicker />

      {/* 07 · Four-Column Staggered Glass Acquisition Stages Wave */}
      <AcquisitionStagesWave />

      {/* 08 · 21st.dev Editorial Testimonial Slider & Frosted-Glass FAQ */}
      <ClientVoices />
      <Faq />

      {/* 09 · Dubai Market Insights & Buyer Guides Preview */}
      <InsightsPreview />

      {/* 10 · Full-Bleed Dubai Architectural CTA Banner */}
      <CtaBanner />
    </>
  );
}
