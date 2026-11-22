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
import {
  FlagshipAccordionAndSpotlights,
  DubaiMarketIntelligenceSuite,
  DubaiLifestyleSelectorSection,
} from "@/components/sections/showcase-sections";
import { Faq } from "@/components/site/faq";
import { CtaBanner } from "@/components/avenlo/motion";
import { JsonLd } from "@/components/seo/json-ld";
import { faqSchema, webPageLd } from "@/lib/seo";
import { faqs } from "@/lib/swk";

export default function Home() {
  return (
    <>
      <JsonLd
        id="ld-home-aeo"
        data={[
          webPageLd({
            name: "SWK Properties | RERA-Licensed Dubai Real Estate Broker",
            description:
              "RERA-licensed Dubai real estate brokerage (ORN 51517) on Sheikh Zayed Road advising on off-plan developer launches, secondary homes, leasing, commercial spaces, and property management across the UAE.",
            path: "/",
            type: "RealEstateAgent",
          }),
          faqSchema(faqs),
        ]}
      />
      <link
        rel="preload"
        as="image"
        href="/img/hero/uae-skyline-flagship.webp"
        fetchPriority="high"
      />

      {/* 01 · Active Architectural Hero Over Live 21st.dev Mesh Drift ShaderBackground */}
      <AvenloHero />

      {/* 02 · Editorial Statement, Glass Bento & Interactive Focus Image Gallery */}
      <EditorialBento />

      {/* 03 · 21st.dev Logo Cloud Marquee & Gallery Hover Carousel */}
      <DubaiDeveloperPulse />

      {/* 04 · Cue Collapsing Cards Accordion & Ambient Destination Spotlight Cards */}
      <FlagshipAccordionAndSpotlights />

      {/* 05 · Slow Infinite Horizontal Architectural Residence Marquee */}
      <FullBleedResidences />

      {/* 06 · Dubai Market Intelligence Suite: Interactive MarketCard + PeakChart */}
      <DubaiMarketIntelligenceSuite />

      {/* 07 · Obsidian Services Band + HoverExpand Spring Advisory Desks & Track Record */}
      <ServicesAndTrackRecord />

      {/* 08 · Interactive Dubai Lifestyle Corridor Selector */}
      <DubaiLifestyleSelectorSection />

      {/* 09 · Glass Marquee Ticker & 21st.dev 3D Flip Dubai Communities */}
      <CommunitiesAndTicker />

      {/* 10 · Four-Column Staggered Glass Acquisition Stages Wave */}
      <AcquisitionStagesWave />

      {/* 11 · 21st.dev Editorial Testimonial Slider & Frosted-Glass FAQ */}
      <ClientVoices />
      <Faq />

      {/* 12 · Dubai Market Insights & Buyer Guides Preview */}
      <InsightsPreview />

      {/* 13 · Full-Bleed Dubai Architectural CTA Banner */}
      <CtaBanner />
    </>
  );
}
