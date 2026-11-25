"use client";

import React, { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { AnimatePresence, motion } from "framer-motion";
import { ArrowRight, ArrowUpRight, Flame, MessageCircle, Play, ShieldCheck, X } from "lucide-react";
import {
  communities,
  SITE,
  stats,
  team,
  testimonials,
} from "@/lib/swk";
import { developers, projects, type Project } from "@/lib/developers";
import { blogIndex } from "@/lib/blog-index";
import { BracketLink } from "@/components/avenlo/bracket-button";
import {
  BlurReveal,
  LiveStatusDot,
  ScrollRevealStatement,
  SectionEyebrow,
  SplitHeading,
} from "@/components/avenlo/motion";
import { SpotlightCard } from "@/components/ui/spotlight-card";
import {
  GalleryHoverCarousel,
  type GalleryHoverCarouselItem,
} from "@/components/ui/gallery-hover-carousel";
import { LogoCloudMarquee } from "@/components/ui/logo-cloud-marquee";
import { CommunityFlipCard } from "@/components/ui/perspective-flip-card";
import {
  AnimatedTestimonials,
  type Testimonial,
} from "@/components/ui/animated-testimonials";
import {
  InteractiveImageGallery,
  type GalleryItem,
} from "@/components/ui/interactive-image-gallery";
import { HoverExpand, type HoverExpandItem } from "@/components/ui/hover-expand";
import {
  SignatureHorizontalDeck,
  type SignatureDeckItem,
} from "@/components/ui/signature-horizontal-deck";
import { HeroDubaiReel } from "@/components/site/hero-dubai-reel";

/* -------------------------------------------------------------------------- */
/* 01. ACTIVE ARCHITECTURAL HERO OVER LIVE 21ST.DEV MESH DRIFT SHADER WAVES   */
/* -------------------------------------------------------------------------- */
export function AvenloHero() {
  const [briefOpen, setBriefOpen] = useState(false);

  useEffect(() => {
    if (!briefOpen) return;
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") setBriefOpen(false);
    };
    window.addEventListener("keydown", onKeyDown);
    return () => {
      document.body.style.overflow = prevOverflow;
      window.removeEventListener("keydown", onKeyDown);
    };
  }, [briefOpen]);

  return (
    <section className="relative overflow-hidden bg-transparent pt-14 pb-0 sm:pt-20">
      {/* Subtle Architectural Grid Hairlines + Crisp Editorial Contrast Veil (Lets Live Waves Shine!) */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 z-0 bg-arch-grid opacity-55"
      />
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-x-0 top-0 z-0 h-[520px] bg-[radial-gradient(ellipse_at_top,rgba(255,255,255,0.62)_0%,rgba(255,255,255,0.16)_58%,transparent_100%)]"
      />

      <div className="relative z-10 mx-auto max-w-[1260px] px-4 sm:px-8">
        {/* Centered Eyebrow + Monumental Mixed Roman/Italic H1 */}
        <div className="mx-auto max-w-5xl text-center">
          <div className="inline-flex items-center gap-2.5 rounded-full border border-white/80 bg-white/72 px-4 py-1.5 shadow-[0_8px_24px_rgba(12,56,96,0.08)] backdrop-blur-xl">
            <span className="relative flex h-2 w-2" aria-hidden="true">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-[#0e9f6e] opacity-75" />
              <span className="relative inline-flex h-2 w-2 rounded-full bg-[#0e9f6e]" />
            </span>
            <span className="text-[11px] font-semibold uppercase tracking-[0.22em] text-[#0c233a]">
              RERA ORN {SITE.reraOrn} · DUBAI &amp; UAE REAL ESTATE
            </span>
          </div>

          <h1 className="mt-7 text-[46px] sm:text-[74px] md:text-[102px] lg:text-[124px] font-medium leading-[0.95] tracking-[-0.048em] text-[#0a1624] drop-shadow-[0_1px_0_rgba(255,255,255,0.5)]">
            Own the{" "}
            <span className="italic font-light text-[#0f3457]">skyline</span>
            <br />
            before it rises
          </h1>

          <div className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-5">
            <BracketLink href="/contact" variant="light" size="lg">
              Work With Us
            </BracketLink>
            <Link
              href="/off-plan"
              className="group inline-flex items-center gap-2 rounded-full border border-white/85 bg-white/74 px-6 py-3.5 text-xs font-semibold uppercase tracking-[0.16em] text-[#0c233a] shadow-[0_10px_28px_rgba(12,56,96,0.1)] backdrop-blur-xl transition-all duration-300 hover:-translate-y-0.5 hover:border-[#121212] hover:bg-[#121212] hover:text-white hover:shadow-[0_16px_36px_rgba(12,35,58,0.26)]"
            >
              <span>Explore Iconic UAE Launches</span>
              <ArrowUpRight className="h-3.5 w-3.5 transition-transform duration-200 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 group-hover:text-[#51fec0]" />
            </Link>
          </div>
        </div>

        {/* Asymmetric Lower Meta Row: Full Advisory Team Showcase (No Employee Count) + Market Brief */}
        <div className="mt-14 sm:mt-20 grid grid-cols-1 items-end gap-8 md:grid-cols-12">
          {/* Left: Full SWK Advisory Team Portraits (All Staff, Zero Headcount Mentioned) */}
          <div className="md:col-span-6 flex flex-col items-start gap-4">
            <Link
              href="/agents"
              className="group inline-flex flex-wrap items-center gap-2 rounded-2xl border border-white/85 bg-white/82 p-2.5 shadow-[0_18px_46px_rgba(12,56,96,0.12)] backdrop-blur-2xl transition-all duration-300 hover:-translate-y-1 hover:border-[#0e9f6e]/40 hover:bg-white hover:shadow-[0_24px_56px_rgba(12,56,96,0.18)]"
              aria-label="Meet the SWK Properties Dubai Advisory Team"
            >
              <div className="flex items-center -space-x-2">
                {team.map((member) => (
                  <div
                    key={member.slug}
                    title={`${member.name} — ${member.role}`}
                    className="relative h-9 w-9 sm:h-12 sm:w-12 md:h-14 md:w-14 shrink-0 overflow-hidden rounded-full border-2 border-white bg-[#eaf3f9] shadow-xs transition-all duration-300 hover:z-20 hover:-translate-y-1.5 hover:scale-110 hover:border-[#51fec0]"
                  >
                    <img
                      src={member.photo}
                      alt={`${member.name} — ${member.role}`}
                      className="h-full w-full object-cover object-top"
                    />
                  </div>
                ))}
              </div>
              <div className="pl-2 pr-3">
                <p className="text-[10px] font-semibold uppercase tracking-[0.2em] text-[#0e9f6e]">
                  OUR DUBAI TEAM
                </p>
                <p className="mt-0.5 inline-flex items-center gap-1 text-xs font-semibold text-[#0a1624] transition-colors group-hover:text-[#0e9f6e]">
                  <span>Meet our advisory team</span>
                  <ArrowUpRight className="h-3.5 w-3.5 transition-transform duration-200 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                </p>
              </div>
            </Link>

            <div className="inline-flex items-baseline gap-4 rounded-2xl border border-white/80 bg-white/70 px-5 py-3 shadow-[0_12px_32px_rgba(12,56,96,0.08)] backdrop-blur-xl transition-all duration-300 hover:-translate-y-0.5 hover:bg-white/90 hover:shadow-[0_18px_42px_rgba(12,56,96,0.14)]">
              <div className="text-[38px] sm:text-[48px] font-medium leading-none tracking-[-0.045em] text-[#0a1624] tabular-nums">
                18+
              </div>
              <p className="max-w-[230px] text-[13px] leading-snug text-[#273849]">
                Years advising residential, waterfront &amp; commercial buyers across the UAE
              </p>
            </div>
          </div>

          {/* Right: Circular Play / Market Brief Button + Glass Editorial Note */}
          <div className="md:col-span-5 md:col-start-8 flex flex-col items-start md:items-end text-left md:text-right">
            <button
              type="button"
              onClick={() => setBriefOpen(true)}
              aria-label="Open Dubai Market Briefing"
              className="group relative inline-flex h-16 w-16 cursor-pointer items-center justify-center rounded-full border border-white/90 bg-white/88 text-[#0a1624] shadow-[0_16px_40px_rgba(12,56,96,0.16)] backdrop-blur-xl transition-all duration-300 hover:-translate-y-1 hover:scale-110 hover:border-[#121212] hover:bg-[#121212] hover:text-[#51fec0] hover:shadow-[0_22px_50px_rgba(12,35,58,0.3)]"
            >
              <Play className="h-5 w-5 translate-x-0.5 fill-current transition-transform duration-300 group-hover:scale-110" />
            </button>
            <div className="mt-4 max-w-[360px] rounded-2xl border border-white/80 bg-white/74 px-5 py-3.5 shadow-[0_12px_32px_rgba(12,56,96,0.08)] backdrop-blur-xl transition-all duration-300 hover:-translate-y-0.5 hover:bg-white/92 hover:shadow-[0_18px_42px_rgba(12,56,96,0.14)]">
              <p className="text-[14.5px] leading-[1.48] tracking-[-0.015em] text-[#0a1624]">
                Direct master-developer access across{" "}
                <span className="font-semibold text-[#1b6aa7]">
                  Nakheel, Binghatti, Emaar, DAMAC &amp; Azizi,
                </span>{" "}
                paired with RERA escrow clarity.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Cinematic HD Dubai Real Estate Landmark Video Transition Reel Over "Since 2008" Watermark */}
      <div className="relative z-10 mt-10 sm:mt-14 w-full overflow-hidden">
        <div
          aria-hidden="true"
          className="pointer-events-none select-none text-center text-[19vw] xl:text-[230px] font-medium leading-[0.82] tracking-[-0.055em] text-[#0a233d]/[0.075]"
        >
          Since 2008
        </div>

        <div className="relative z-10 mx-auto -mt-[8vw] sm:-mt-[95px] max-w-[1260px] px-4 sm:px-8">
          <HeroDubaiReel />
        </div>
      </div>

      {/* Clean Market Briefing Lightbox Modal (Compact Mobile Sheet + Always-Visible Close Button) */}
      <AnimatePresence>
        {briefOpen ? (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[120] flex items-center justify-center bg-[#08131f]/80 p-3 sm:p-4 backdrop-blur-md"
            onClick={() => setBriefOpen(false)}
          >
            <motion.div
              role="dialog"
              aria-modal="true"
              aria-labelledby="briefing-dialog-title"
              initial={{ opacity: 0, scale: 0.96, y: 12 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.96, y: 12 }}
              onClick={(e) => e.stopPropagation()}
              className="flex max-h-[84dvh] w-full max-w-[390px] sm:max-w-2xl flex-col overflow-hidden rounded-2xl border border-white/15 bg-[#0c1624] text-white shadow-2xl"
            >
              <div className="flex shrink-0 items-center justify-between border-b border-white/10 px-4 py-3.5 sm:px-6 sm:py-4">
                <SectionEyebrow tone="dark">DUBAI MARKET BRIEFING</SectionEyebrow>
                <button
                  type="button"
                  onClick={() => setBriefOpen(false)}
                  aria-label="Close briefing"
                  className="inline-flex h-9 w-9 cursor-pointer items-center justify-center rounded-full bg-white text-[#0c1624] shadow-md transition-colors hover:bg-[#51fec0] sm:bg-white/10 sm:text-white sm:hover:bg-white/20"
                >
                  <X className="h-4 w-4 stroke-[2.3]" />
                </button>
              </div>
              <div className="flex-1 overflow-y-auto overscroll-contain p-5 sm:p-8 space-y-4 sm:space-y-5">
                <h2 id="briefing-dialog-title" className="text-2xl sm:text-3xl font-medium tracking-[-0.03em]">
                  How SWK navigates Dubai&apos;s flagship developer pipeline
                </h2>
                <p className="text-sm leading-relaxed text-white/75">
                  Across Nakheel, Binghatti, Emaar, DAMAC, Azizi, Sobha Realty, Omniyat, Aldar, Ellington, and Arada, the difference between an ordinary purchase and a generational asset comes down to three checks: delivered build quality, RERA escrow protection, and realistic net rental yield after service charges.
                </p>
                <div className="grid grid-cols-1 gap-3 sm:grid-cols-3 pt-2">
                  {[
                    { k: "0% Buyer Fee", v: "On primary developer launches" },
                    { k: "Escrow Registered", v: "Under Dubai Law No. 8 / 2007" },
                    { k: "5 Emirates", v: "Dubai, Abu Dhabi, Sharjah, RAK & UAQ" },
                  ].map((item) => (
                    <div key={item.k} className="rounded-xl bg-white/[0.06] border border-white/10 p-4">
                      <p className="text-sm font-medium text-[#51fec0]">{item.k}</p>
                      <p className="mt-1 text-xs text-white/70">{item.v}</p>
                    </div>
                  ))}
                </div>
                <div className="flex flex-wrap items-center gap-4 pt-3">
                  <BracketLink
                    href="/off-plan"
                    variant="white"
                    size="sm"
                    onClick={() => setBriefOpen(false)}
                  >
                    Explore Launches
                  </BracketLink>
                  <BracketLink
                    href="/contact"
                    variant="dark"
                    size="sm"
                    onClick={() => setBriefOpen(false)}
                  >
                    Book Private Briefing
                  </BracketLink>
                </div>
              </div>
            </motion.div>
          </motion.div>
        ) : null}
      </AnimatePresence>
    </section>
  );
}

/* -------------------------------------------------------------------------- */
/* 02. SCROLL-REVEAL EDITORIAL STATEMENT, GLASS BENTO & FOCUS GALLERY         */
/* -------------------------------------------------------------------------- */
const ARCHITECTURAL_MOSAIC_ITEMS: GalleryItem[] = [
  {
    id: "mosaic-lana",
    type: "image",
    src: "/img/projects/omniyat/the-lana.webp",
    label: "The Lana Residences",
    sublabel: "OMNIYAT · MARASI BAY",
    href: "/off-plan/the-lana",
  },
  {
    id: "mosaic-note-1",
    type: "text",
    eyebrow: "ARCHITECTURAL PRESENCE",
    text: "We filter Dubai's expanding master-developer pipeline down to towers with enduring floor plates, verified escrow milestones, and real tenant liquidity.",
  },
  {
    id: "mosaic-avarra",
    type: "image",
    src: "/img/projects/emaar/avarra-by-palace.webp",
    label: "Avarra by Palace",
    sublabel: "EMAAR · WATERFRONT",
    href: "/off-plan/avarra-by-palace",
  },
  {
    id: "mosaic-baccarat",
    type: "image",
    src: "/img/projects/hh-development/baccarat-residences-dubai.webp",
    label: "Baccarat Residences",
    sublabel: "H&H · DOWNTOWN DUBAI",
    href: "/off-plan/baccarat-residences-dubai",
  },
  {
    id: "mosaic-note-2",
    type: "text",
    eyebrow: "CLIENT CAPITAL GROWTH",
    text: "From waterfront beachfront mansions to high-yield urban corridors, every acquisition is benchmarked against live DLD comparable transfers.",
  },
  {
    id: "mosaic-armani",
    type: "image",
    src: "/img/projects/arada/armani-beach-residences.webp",
    label: "Armani Beach Residences",
    sublabel: "ARADA · PALM JUMEIRAH",
    href: "/off-plan/armani-beach-residences",
  },
  {
    id: "mosaic-waves",
    type: "image",
    src: "/img/projects/sobha/waves-opulence.webp",
    label: "Waves Opulence",
    sublabel: "SOBHA HARTLAND",
    href: "/off-plan/waves-opulence",
  },
];

export function EditorialBento() {
  return (
    <section className="relative overflow-hidden bg-white/22 py-24 sm:py-32 backdrop-blur-[2px]">
      <div className="relative mx-auto max-w-[1120px] px-4 sm:px-8">
        <div className="mx-auto max-w-4xl rounded-3xl border border-white/80 bg-white/68 p-7 sm:p-11 shadow-[0_20px_60px_rgba(12,56,96,0.09)] backdrop-blur-2xl">
          <ScrollRevealStatement text="We advise buyers and investors who look past developer brochures — pairing Dubai floor-plate intelligence with escrow security and long-term appreciation." />

          <div className="mt-9 flex flex-wrap items-center gap-2.5">
            {[
              "Direct Developer Allocations",
              "DLD & Escrow Due Diligence",
              "Yield & Exit Strategy",
              "Residential & Commercial",
            ].map((pillar) => (
              <span
                key={pillar}
                className="cursor-default rounded-full border border-[#1b6aa7]/20 bg-white/90 px-4 py-2 text-xs font-medium text-[#0c233a] shadow-xs transition-all duration-200 hover:-translate-y-0.5 hover:border-[#121212] hover:bg-[#121212] hover:text-white hover:shadow-md"
              >
                {pillar}
              </span>
            ))}
          </div>
        </div>

        {/* 2-Card Glass Spotlight Bento Row */}
        <div className="mt-10 grid grid-cols-1 gap-6 md:grid-cols-2">
          {/* Left Card: SWK DLD & Escrow Advisory Standard */}
          <SpotlightCard>
            <div className="flex min-h-[420px] sm:min-h-[460px] flex-col justify-between p-8 sm:p-10">
              <div className="flex items-center justify-between gap-3">
                <span className="inline-flex items-center gap-2 rounded-full border border-[#0e9f6e]/25 bg-[#0e9f6e]/10 px-3.5 py-1.5 text-[11px] font-semibold uppercase tracking-[0.16em] text-[#0e9f6e]">
                  <ShieldCheck className="h-3.5 w-3.5" aria-hidden="true" />
                  SWK Advisory Standard
                </span>
                <span className="font-mono text-[11px] font-semibold uppercase tracking-[0.14em] text-[#64748b]">
                  RERA ORN {SITE.reraOrn}
                </span>
              </div>

              <div className="my-7 space-y-4">
                <h2 className="text-[24px] sm:text-[28px] font-medium leading-[1.2] tracking-[-0.03em] text-[#121212]">
                  Every AED accounted for before you reserve a unit.
                </h2>
                <p className="text-sm leading-[1.65] text-[#475569]">
                  Before any booking cheque is written, we lay out 4% DLD registration, approximate developer admin charges (AED 4,000–5,500), zero off-plan mortgage registration or trustee fees, and verified RERA escrow account details.
                </p>
                <div className="grid grid-cols-2 gap-3 pt-1">
                  <div className="rounded-xl border border-black/[0.06] bg-white/80 p-3.5">
                    <p className="font-mono text-[10px] uppercase tracking-[0.14em] text-[#1b6aa7]">Off-Plan Buyer Fee</p>
                    <p className="mt-1 text-lg font-semibold text-[#121212]">0%</p>
                  </div>
                  <div className="rounded-xl border border-black/[0.06] bg-white/80 p-3.5">
                    <p className="font-mono text-[10px] uppercase tracking-[0.14em] text-[#1b6aa7]">Escrow Compliance</p>
                    <p className="mt-1 text-lg font-semibold text-[#121212]">Law No. 8</p>
                  </div>
                </div>
              </div>

              <div className="flex flex-wrap items-center justify-between gap-4 border-t border-black/[0.07] pt-5">
                <Link
                  href="/calculators"
                  className="text-xs font-semibold text-[#121212] underline underline-offset-4 hover:text-[#0e9f6e]"
                >
                  Open UAE Mortgage &amp; DLD Calculator →
                </Link>
                <Link
                  href="/terms"
                  className="text-xs font-medium text-[#64748b] hover:text-[#121212]"
                >
                  Terms &amp; Conditions
                </Link>
              </div>
            </div>
          </SpotlightCard>

          {/* Right Card: Ultra-Sharp Palm Waterfront Villa + Frosted Team Bar */}
          <div className="relative min-h-[420px] sm:min-h-[460px] overflow-hidden rounded-2xl border border-white/80 bg-[#0b1623] shadow-[0_20px_54px_rgba(12,56,96,0.16)]">
            <img
              src="/img/hero/palm-waterfront-twilight.webp"
              alt="Contemporary Dubai travertine and glass beachfront villa overlooking the Arabian Gulf"
              loading="lazy"
              className="h-full w-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-[#08131f]/78 via-transparent to-transparent" />

            <div className="absolute inset-x-4 bottom-4 sm:inset-x-6 sm:bottom-6 rounded-2xl border border-white/25 bg-[#08131f]/62 p-5 text-white backdrop-blur-xl">
              <div className="flex items-center justify-between gap-3">
                <div className="flex items-center -space-x-1.5">
                  {team.slice(0, 5).map((advisor) => (
                    <img
                      key={advisor.slug}
                      src={advisor.photo}
                      alt={advisor.name}
                      loading="lazy"
                      className="h-9 w-9 rounded-full border border-white/60 object-cover object-top"
                    />
                  ))}
                </div>
                <Link
                  href="/agents"
                  className="inline-flex items-center gap-1 rounded-full border border-white/30 bg-white/15 px-3.5 py-1.5 text-[11px] font-medium uppercase tracking-[0.14em] text-white transition-colors hover:bg-[#51fec0] hover:text-[#121212]"
                >
                  <span>Our Team</span>
                  <ArrowUpRight className="h-3.5 w-3.5" />
                </Link>
              </div>

              <div className="mt-4 flex items-end justify-between gap-4">
                <p className="max-w-[260px] text-xs sm:text-sm leading-snug text-white/95">
                  Turning a Dubai brief into direct master-developer allocation and Title Deed security.
                </p>
                <div className="text-right leading-none shrink-0">
                  <span className="text-[11px] font-medium uppercase tracking-[0.16em] text-[#51fec0]">
                    Sheikh Zayed Rd
                  </span>
                  <span className="mt-1 block text-xs text-white/80">
                    25th Fl · Al Saqr
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* 21st.dev Interactive Focus Image Gallery — Hover to Spotlight Any Landmark */}
        <div className="mt-16">
          <div className="mb-4 text-center">
            <SectionEyebrow align="center">CURATED ARCHITECTURAL MOSAIC · HOVER TO FOCUS</SectionEyebrow>
          </div>
          <InteractiveImageGallery items={ARCHITECTURAL_MOSAIC_ITEMS} />
        </div>
      </div>
    </section>
  );
}

/* -------------------------------------------------------------------------- */
/* 03. 21ST.DEV LOGO CLOUD MARQUEE + GALLERY HOVER CAROUSEL (USER BOOKMARK!)  */
/* -------------------------------------------------------------------------- */
type LaunchCategory =
  | "signature"
  | "nakheel-emaar"
  | "binghatti-branded"
  | "damac-azizi"
  | "jvc-urban";

const LAUNCH_TABS: { id: LaunchCategory; label: string }[] = [
  { id: "signature", label: "Signature Icons" },
  { id: "nakheel-emaar", label: "Nakheel & Emaar" },
  { id: "binghatti-branded", label: "Binghatti & Branded" },
  { id: "damac-azizi", label: "DAMAC & Azizi Lagoons" },
  { id: "jvc-urban", label: "JVC & Creek Growth" },
];

const CAROUSEL_SLUGS_BY_TAB: Record<LaunchCategory, string[]> = {
  signature: [
    "palm-springs-beachfront-villas",
    "mercedes-benz-places",
    "bugatti-residences-by-binghatti",
    "creek-haven",
    "damac-lagoons",
    "riviera",
    "binghatti-jvc-boutique-residences",
    "como-residences",
  ],
  "nakheel-emaar": [
    "palm-springs-beachfront-villas",
    "como-residences",
    "creek-haven",
    "emaar-the-oasis",
    "dubai-islands",
    "rashid-yachts-and-marina",
  ],
  "binghatti-branded": [
    "mercedes-benz-places",
    "bugatti-residences-by-binghatti",
    "burj-binghatti-jacob-and-co-residences",
    "orla-dorchester-collection-dubai",
    "karl-lagerfeld-villas",
    "sobha-seahaven",
  ],
  "damac-azizi": [
    "damac-lagoons",
    "damac-islands",
    "riviera",
    "azizi-milan",
    "chelsea-residences",
    "azizi-florence",
  ],
  "jvc-urban": [
    "binghatti-jvc-boutique-residences",
    "binghatti-hills",
    "sobha-century",
    "dubai-hills-estate-residences",
    "ellington-berkeley-tower",
    "samana-downtown-one",
  ],
};

const SIGNATURE_DECK_CONFIG = [
  {
    slug: "palm-springs-beachfront-villas",
    kicker: "Nakheel · Palm Jebel Ali & Palm Jumeirah",
    price: "From AED 18.5M",
    priceNote: "80/20 Plan · 0% Buyer Fee",
    accent: "#51fec0",
  },
  {
    slug: "mercedes-benz-places",
    kicker: "Binghatti · Downtown Dubai · 65 Floors",
    price: "From AED 8.8M",
    priceNote: "70/30 Plan · Burj Views",
    accent: "#67e8f9",
  },
  {
    slug: "bugatti-residences-by-binghatti",
    kicker: "Binghatti · Business Bay Sky Mansions",
    price: "From AED 19.0M",
    priceNote: "Private Car Lifts · Riviera",
    accent: "#f4d35e",
  },
  {
    slug: "creek-haven",
    kicker: "Emaar · Dubai Creek Harbour · Blue Line",
    price: "From AED 1.65M",
    priceNote: "80/20 Emaar Schedule",
    accent: "#51fec0",
  },
  {
    slug: "damac-lagoons",
    kicker: "DAMAC · Mediterranean Lagoon Villas",
    price: "From AED 2.65M",
    priceNote: "Crystal Swimmable Lagoons",
    accent: "#93c5fd",
  },
  {
    slug: "riviera",
    kicker: "Azizi · MBR City Waterfront Boulevard",
    price: "From AED 1.15M",
    priceNote: "Ready & Off-Plan Phases",
    accent: "#51fec0",
  },
  {
    slug: "como-residences",
    kicker: "Nakheel · Palm Jumeirah Curved Tower",
    price: "From AED 21.0M",
    priceNote: "360° Gulf & Marina Views",
    accent: "#67e8f9",
  },
  {
    slug: "binghatti-jvc-boutique-residences",
    kicker: "Binghatti · Jumeirah Village Circle",
    price: "From AED 950K",
    priceNote: "High-Yield Urban Corridor",
    accent: "#51fec0",
  },
] as const;

const HOT_PROJECTS = [
  {
    id: "hot-binghatti-studio",
    tag: "HOT PROJECT · HIGH-YIELD STUDIO",
    name: "Binghatti Studio",
    developer: "Binghatti",
    location: "Jumeirah Village Circle (JVC), Dubai",
    priceLabel: "AED 550,000*",
    meta: "Off-Plan Studio · 0% Buyer Fee · Flexible Plan",
    image: "/img/projects/binghatti/binghatti-jvc-boutique-residences.webp",
    href: "/properties/binghatti-studio-residences-jvc-offplan",
    whatsappText: "Hello SWK Properties, please share floor plans and live unit availability for Binghatti Studio (from AED 550,000).",
  },
  {
    id: "hot-tarrad",
    tag: "HOT PROJECT · NEW RELEASE",
    name: "Tarrad",
    developer: "Tarrad Development",
    location: "Dubailand (DLRC), Dubai",
    priceLabel: "AED 620,000*",
    meta: "Boutique Off-Plan Studio · 0% Buyer Fee · Podium Pool",
    image: "/img/projects/tarrad/tarrad-dubailand.webp",
    href: "/properties/tarrad-studio-residences-dubailand-offplan",
    whatsappText: "Hello SWK Properties, please share the brochure and latest availability for Tarrad Residences (from AED 620,000).",
  },
  {
    id: "hot-azizi-venice-studio",
    tag: "HOT PROJECT · CRYSTAL LAGOON",
    name: "Azizi Venice Studio",
    developer: "Azizi Developments",
    location: "Dubai South · Crystal Lagoon Boulevard",
    priceLabel: "AED 680,000*",
    meta: "Off-Plan Lagoon Studio · 0% Buyer Fee · Near DWC",
    image: "/img/projects/azizi/azizi-venice.webp",
    href: "/properties/azizi-venice-studio-dubai-south-offplan",
    whatsappText: "Hello SWK Properties, please share current studio inventory and payment plans for Azizi Venice Studio (from AED 680,000).",
  },
] as const;

function SignatureIconsHorizontalShowcase() {
  const deckItems = useMemo<SignatureDeckItem[]>(() => {
    return SIGNATURE_DECK_CONFIG.flatMap((cfg) => {
      const proj = projects.find((p) => p.slug === cfg.slug);
      if (!proj) return [];
      return [
        {
          slug: proj.slug,
          title: proj.name,
          developer: proj.developer,
          community: proj.community,
          kicker: cfg.kicker,
          summary: proj.summary,
          image: proj.image,
          price: cfg.price,
          priceNote: cfg.priceNote,
          tags: proj.tags,
          href: `/off-plan/${proj.slug}`,
          accent: cfg.accent,
        },
      ];
    });
  }, []);

  return <SignatureHorizontalDeck items={deckItems} className="mt-8" />;
}

export function DubaiDeveloperPulse() {
  const [activeTab, setActiveTab] = useState<LaunchCategory>("signature");

  const galleryItems = useMemo<GalleryHoverCarouselItem[]>(() => {
    const slugs = CAROUSEL_SLUGS_BY_TAB[activeTab];
    const matched = slugs
      .map((s) => projects.find((p) => p.slug === s))
      .filter((p): p is Project => Boolean(p));

    const seen = new Set(matched.map((m) => m.slug));
    const list =
      matched.length >= 6
        ? matched
        : [
            ...matched,
            ...projects
              .filter((p) => !seen.has(p.slug))
              .slice(0, 6 - matched.length),
          ];

    return list.map((proj) => ({
      id: proj.slug,
      title: proj.name,
      developer: proj.developer,
      community: proj.community,
      summary: proj.summary,
      image: proj.image,
      url: `/off-plan/${proj.slug}`,
      tags: proj.tags,
      badge: proj.priorityTarget ? "Flagship Mandate" : "Premier Launch",
      isRender: true,
    }));
  }, [activeTab]);

  const logoDevelopers = useMemo(
    () =>
      developers
        .filter((d) => Boolean(d.logo))
        .map((d) => ({
          slug: d.slug,
          name: d.name,
          logo: d.logo as string,
          knownFor: d.knownFor,
        })),
    []
  );

  return (
    <section
      id="dubai-launches"
      className="relative border-y border-white/60 bg-white/24 py-24 backdrop-blur-[2px]"
    >
      <div className="mx-auto max-w-[1260px] px-4 sm:px-8">
        {/* Header */}
        <div className="flex flex-wrap items-end justify-between gap-6">
          <div>
            <SectionEyebrow>PREMIER UAE MASTER DEVELOPERS</SectionEyebrow>
            <SplitHeading
              primary="Iconic projects shaping"
              muted="Dubai's next decade"
              className="mt-5"
            />
          </div>
          <BracketLink href="/off-plan" variant="light" size="md">
            Explore All Projects
          </BracketLink>
        </div>

        {/* Hot Projects Spotlight: Binghatti Studio (550K), Tarrad (620K), Azizi Venice Studio (680K) */}
        <div
          id="hot-projects"
          className="mt-10 rounded-3xl border border-white/85 bg-white/80 p-5 sm:p-7 shadow-[0_18px_52px_rgba(12,56,96,0.1)] backdrop-blur-2xl"
        >
          <div className="flex flex-wrap items-end justify-between gap-4">
            <div>
              <span className="inline-flex items-center gap-1.5 rounded-full border border-[#d97706]/30 bg-[#fef3c7] px-3 py-1 text-[10.5px] font-semibold uppercase tracking-[0.18em] text-[#92400e]">
                <Flame className="h-3.5 w-3.5 text-[#d97706]" aria-hidden="true" />
                Hot Projects · Direct Developer Pricing
              </span>
              <h3 className="mt-2.5 text-xl sm:text-2xl font-medium tracking-[-0.03em] text-[#0a1624]">
                High-demand Dubai off-plan studios starting from AED 550,000*
              </h3>
            </div>
            <Link
              href="/off-plan"
              className="text-xs font-semibold text-[#1b6aa7] underline underline-offset-4 hover:text-[#0a1624]"
            >
              View all off-plan launches →
            </Link>
          </div>

          <div className="mt-5 grid grid-cols-1 gap-5 md:grid-cols-3">
            {HOT_PROJECTS.map((hp) => (
              <article
                key={hp.id}
                className="group flex flex-col overflow-hidden rounded-2xl border border-black/[0.08] bg-white shadow-xs transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_18px_42px_rgba(12,56,96,0.14)]"
              >
                <Link href={hp.href} className="relative block aspect-[16/10] overflow-hidden bg-[#eaf3f9]">
                  <img
                    src={hp.image}
                    alt={`${hp.name} by ${hp.developer} in ${hp.location}`}
                    loading="lazy"
                    className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#08131f]/75 via-transparent to-transparent" />
                  <span className="absolute top-3 left-3 rounded-full bg-[#08131f]/82 px-3 py-1 text-[10px] font-semibold uppercase tracking-[0.14em] text-[#51fec0] backdrop-blur-md">
                    {hp.tag}
                  </span>
                  <div className="absolute bottom-3 left-3 right-3 flex items-end justify-between gap-2 text-white">
                    <div>
                      <p className="text-[10px] font-semibold uppercase tracking-[0.16em] text-white/80">
                        {hp.developer}
                      </p>
                      <h4 className="text-lg font-semibold leading-tight tracking-[-0.02em]">
                        {hp.name}
                      </h4>
                    </div>
                    <span className="shrink-0 rounded-full bg-[#51fec0] px-3 py-1 text-xs font-bold text-[#08131f] tabular-nums shadow-sm">
                      {hp.priceLabel}
                    </span>
                  </div>
                </Link>

                <div className="flex flex-1 flex-col justify-between p-4 sm:p-5">
                  <div>
                    <p className="text-xs font-medium text-[#0c233a]">{hp.location}</p>
                    <p className="mt-1 text-xs text-[#64748b]">{hp.meta}</p>
                  </div>
                  <div className="mt-4 flex items-center gap-2 border-t border-black/[0.06] pt-3.5">
                    <Link
                      href={hp.href}
                      className="inline-flex flex-1 items-center justify-center gap-1 rounded-full bg-[#0c233a] px-3.5 py-2 text-[11px] font-semibold uppercase tracking-[0.12em] text-white transition-colors hover:bg-[#1b6aa7]"
                    >
                      <span>Details</span>
                      <ArrowUpRight className="h-3.5 w-3.5" aria-hidden="true" />
                    </Link>
                    <a
                      href={`${SITE.whatsappUrl}?text=${encodeURIComponent(hp.whatsappText)}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center justify-center gap-1.5 rounded-full border border-[#0e9f6e]/30 bg-[#0e9f6e]/10 px-3.5 py-2 text-[11px] font-semibold uppercase tracking-[0.12em] text-[#0e9f6e] transition-colors hover:bg-[#0e9f6e] hover:text-white"
                    >
                      <MessageCircle className="h-3.5 w-3.5" aria-hidden="true" />
                      <span>WhatsApp</span>
                    </a>
                  </div>
                </div>
              </article>
            ))}
          </div>

          <p className="mt-4 text-[11px] leading-relaxed text-[#64748b]">
            *Indicative starting prices only. All properties, unit availability, payment schedules, and prices depend on the respective developer and prevailing market conditions. Off-plan purchases carry 0% buyer brokerage fee and no mortgage registration or trustee fees (4% DLD Oqood + approx. AED 4,000–5,500 developer admin fee apply).{" "}
            <Link href="/terms" className="font-semibold text-[#1b6aa7] underline underline-offset-2 hover:text-[#0a1624]">
              Read full Terms &amp; Conditions
            </Link>
            .
          </p>
        </div>

        {/* 21st.dev Bidirectional Flowing Developer Logo Cloud — 100% Authentic Original Colors */}
        <LogoCloudMarquee developers={logoDevelopers} className="mt-10" />

        {/* Interactive Glass Category Pill Filters (Swipeable Rail on Mobile) */}
        <div className="mt-10 sm:mt-12 flex flex-nowrap sm:flex-wrap items-center gap-2 sm:gap-2.5 overflow-x-auto pb-1 [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
          {LAUNCH_TABS.map((tab) => {
            const active = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                type="button"
                onClick={() => setActiveTab(tab.id)}
                className={`shrink-0 cursor-pointer rounded-full px-4 py-2 sm:px-5 sm:py-2.5 text-xs font-medium transition-all duration-200 sm:hover:-translate-y-0.5 ${
                  active
                    ? "bg-[#121212] text-white shadow-[0_12px_28px_rgba(12,35,58,0.28)]"
                    : "border border-white/85 bg-white/80 text-[#1e293b] shadow-xs backdrop-blur-xl hover:border-[#121212] hover:bg-[#121212] hover:text-white hover:shadow-[0_12px_28px_rgba(12,35,58,0.2)]"
                }`}
              >
                {tab.label}
              </button>
            );
          })}
        </div>

        {/* Signature Icons -> 21st.dev Interactive Horizontal Expanding Deck; other clusters -> Gallery Hover Carousel */}
        {activeTab === "signature" ? (
          <SignatureIconsHorizontalShowcase />
        ) : (
          <GalleryHoverCarousel items={galleryItems} className="mt-8" />
        )}
      </div>
    </section>
  );
}

/* -------------------------------------------------------------------------- */
/* 04. SLOW INFINITE HORIZONTAL ARCHITECTURAL RESIDENCE MARQUEE               */
/* -------------------------------------------------------------------------- */
const SHOWCASE_PANELS = [
  {
    title: "Palm Jebel Ali",
    developer: "Nakheel",
    status: "NAKHEEL FLAGSHIP",
    tone: "launch" as const,
    specs: "PALM JEBEL ALI, DUBAI  ·  BEACHFRONT FROND VILLAS",
    href: "/off-plan/palm-jebel-ali",
    image: "/img/showcase/nakheel-palm-jebel-ali.webp",
  },
  {
    title: "Bugatti Residences",
    developer: "Binghatti",
    status: "ULTRA-PRIME BRANDED",
    tone: "offer" as const,
    specs: "BUSINESS BAY, DUBAI  ·  RIVIERA SKY MANSIONS",
    href: "/off-plan/bugatti-residences-by-binghatti",
    image: "/img/showcase/binghatti-bugatti-residences.webp",
  },
  {
    title: "Mercedes-Benz Places",
    developer: "Binghatti",
    status: "DOWNTOWN ICON",
    tone: "launch" as const,
    specs: "DOWNTOWN DUBAI  ·  65-STOREY SUPERTALL",
    href: "/off-plan/mercedes-benz-places",
    image: "/img/showcase/binghatti-mercedes-benz-places.webp",
  },
  {
    title: "Dubai Creek Harbour",
    developer: "Emaar Properties",
    status: "EMAAR WATERFRONT",
    tone: "launch" as const,
    specs: "DUBAI CREEK HARBOUR  ·  CREEK MARINA TOWERS",
    href: "/communities/dubai-creek-harbour",
    image: "/img/showcase/emaar-creek-harbour.webp",
  },
  {
    title: "DAMAC Lagoons",
    developer: "DAMAC Properties",
    status: "CRYSTAL LAGOON LIVING",
    tone: "launch" as const,
    specs: "DUBAILAND  ·  MEDITERRANEAN WATERFRONT VILLAS",
    href: "/off-plan/damac-lagoons",
    image: "/img/showcase/damac-lagoons.webp",
  },
  {
    title: "Azizi Venice",
    developer: "Azizi Developments",
    status: "DUBAI SOUTH MASTERPLAN",
    tone: "offer" as const,
    specs: "DUBAI SOUTH  ·  CRYSTAL LAGOON BOULEVARD",
    href: "/off-plan/azizi-venice",
    image: "/img/showcase/azizi-venice.webp",
  },
];

export function FullBleedResidences() {
  const [activeIndex, setActiveIndex] = useState(0);
  const current = SHOWCASE_PANELS[activeIndex] ?? SHOWCASE_PANELS[0];
  const marqueePanels = useMemo(
    () => [
      ...SHOWCASE_PANELS.map((p, idx) => ({ ...p, originalIdx: idx, isDuplicate: false, loopKey: `a-${p.title}` })),
      ...SHOWCASE_PANELS.map((p, idx) => ({ ...p, originalIdx: idx, isDuplicate: true, loopKey: `b-${p.title}` })),
    ],
    []
  );

  return (
    <section
      aria-label="Featured Dubai Residences Infinite Showcase Marquee"
      className="relative overflow-hidden bg-gradient-to-b from-[#07111d]/96 via-[#0a1829]/95 to-[#0b131e]/97 py-20 sm:py-24 text-white backdrop-blur-xl border-b border-white/10"
    >
      {/* Subtle Ambient Sapphire Halo Behind Stage */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute top-1/2 left-1/2 h-[540px] w-[860px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-[radial-gradient(circle,rgba(87,210,244,0.16)_0%,rgba(27,106,167,0.08)_42%,transparent_72%)] blur-3xl"
      />

      <div className="relative z-10 mx-auto max-w-[1260px] px-4 sm:px-8">
        {/* Top Synced Architectural Header */}
        <div className="flex flex-wrap items-end justify-between gap-6">
          <div>
            <LiveStatusDot
              label={current.status}
              tone={current.tone}
              surface="dark"
            />
            <h2 className="mt-4 text-[34px] sm:text-[48px] md:text-[58px] font-medium leading-[1.03] tracking-[-0.04em] text-white transition-all duration-300">
              {current.title}
            </h2>
            <p className="mt-3 text-[11px] sm:text-[12px] font-medium uppercase tracking-[0.22em] text-white/70">
              {current.specs}
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-4">
            <span className="hidden sm:inline-block font-mono text-xs text-[#51fec0]/80">
              HOVER ANY CARD TO PAUSE &amp; INSPECT
            </span>
            <BracketLink href={current.href} variant="white" size="md">
              View Residence
            </BracketLink>
          </div>
        </div>
      </div>

      {/* Slow Infinite Seamless Horizontal Architectural Card Marquee (Pauses on Hover) */}
      <div
        className="group/res-marquee relative z-10 mt-12 w-full overflow-hidden py-5"
        style={{
          maskImage:
            "linear-gradient(to right, transparent 0%, black 5%, black 95%, transparent 100%)",
          WebkitMaskImage:
            "linear-gradient(to right, transparent 0%, black 5%, black 95%, transparent 100%)",
        }}
      >
        <div className="animate-residence-marquee gap-6 pr-6 group-hover/res-marquee:[animation-play-state:paused] group-focus-within/res-marquee:[animation-play-state:paused]">
          {marqueePanels.map((panel) => {
            const isHighlighted = panel.originalIdx === activeIndex;
            return (
              <Link
                key={panel.loopKey}
                href={panel.href}
                aria-hidden={panel.isDuplicate ? true : undefined}
                tabIndex={panel.isDuplicate ? -1 : undefined}
                onMouseEnter={() => setActiveIndex(panel.originalIdx)}
                onFocus={() => setActiveIndex(panel.originalIdx)}
                className={`group/rcard relative flex h-[385px] sm:h-[500px] w-[275px] sm:w-[400px] lg:w-[440px] shrink-0 flex-col justify-between overflow-hidden rounded-[24px] sm:rounded-[28px] border bg-[#0d1928] transition-all duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] sm:hover:-translate-y-2.5 sm:hover:scale-[1.02] hover:border-[#51fec0]/80 hover:shadow-[0_30px_76px_rgba(81,254,192,0.2)] ${
                  isHighlighted
                    ? "border-[#51fec0]/55 shadow-[0_24px_64px_rgba(0,0,0,0.55)]"
                    : "border-white/15 shadow-[0_18px_46px_rgba(0,0,0,0.4)]"
                }`}
              >
                {/* Full-Bleed Architectural Photo */}
                <img
                  src={panel.image}
                  alt={`${panel.title} by ${panel.developer}`}
                  loading="lazy"
                  className="absolute inset-0 h-full w-full object-cover transition-transform duration-700 ease-out group-hover/rcard:scale-110"
                />

                {/* Cinematic Edge Scrim */}
                <div
                  aria-hidden="true"
                  className="absolute inset-0 bg-gradient-to-t from-[#050d17]/92 via-[#050d17]/28 to-[#050d17]/45 transition-opacity duration-300 group-hover/rcard:opacity-90"
                />

                {/* Top Row: Status Pill + Landmark Number */}
                <div className="relative z-10 flex items-center justify-between gap-3 p-5 sm:p-6">
                  <span className="inline-flex items-center gap-2 rounded-full border border-white/20 bg-[#08131f]/75 px-3.5 py-1.5 text-[10px] font-semibold uppercase tracking-[0.18em] text-white backdrop-blur-md transition-colors group-hover/rcard:border-[#51fec0]/60">
                    <span
                      className={`h-1.5 w-1.5 rounded-full ${
                        panel.tone === "offer" ? "bg-[#a5ce3a]" : "bg-[#51fec0]"
                      }`}
                      aria-hidden="true"
                    />
                    {panel.status}
                  </span>
                  <span className="flex h-9 w-9 items-center justify-center rounded-full border border-white/20 bg-[#08131f]/70 font-mono text-xs font-semibold text-white/90 backdrop-blur-md transition-all duration-300 group-hover/rcard:border-[#51fec0] group-hover/rcard:bg-[#51fec0] group-hover/rcard:text-[#08131f]">
                    0{panel.originalIdx + 1}
                  </span>
                </div>

                {/* Bottom Editorial Meta + Hover-Animated Explore Pill */}
                <div className="relative z-10 p-5 sm:p-6">
                  <p className="text-[10.5px] font-semibold uppercase tracking-[0.22em] text-[#51fec0]">
                    {panel.developer}
                  </p>
                  <h3 className="mt-1.5 text-[26px] sm:text-[30px] font-medium leading-[1.08] tracking-[-0.03em] text-white">
                    {panel.title}
                  </h3>
                  <p className="mt-2 text-[11px] font-medium uppercase tracking-[0.16em] text-white/75">
                    {panel.specs}
                  </p>

                  <div className="mt-5 flex items-center justify-between gap-3 border-t border-white/15 pt-4">
                    <span className="inline-flex items-center gap-2 rounded-full bg-white/95 px-4 py-2 text-[11px] font-semibold uppercase tracking-[0.15em] text-[#0a1624] transition-all duration-300 group-hover/rcard:bg-[#51fec0] group-hover/rcard:shadow-[0_10px_24px_rgba(81,254,192,0.38)]">
                      <span>Explore Residence</span>
                      <ArrowUpRight className="h-3.5 w-3.5 transition-transform duration-300 group-hover/rcard:translate-x-0.5 group-hover/rcard:-translate-y-0.5" />
                    </span>
                    <span className="text-[10px] font-medium uppercase tracking-[0.18em] text-white/55">
                      Architectural Visual
                    </span>
                  </div>
                </div>
              </Link>
            );
          })}
        </div>
      </div>

      {/* Interactive Landmark Selector Pills (Horizontal Swipe Rail on Mobile, Wrapped on Desktop) */}
      <div className="relative z-10 mx-auto mt-6 max-w-[1260px] px-4 sm:px-8">
        <div className="flex flex-nowrap sm:flex-wrap items-center justify-start sm:justify-center gap-2 sm:gap-2.5 overflow-x-auto pb-1 [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
          {SHOWCASE_PANELS.map((panel, idx) => {
            const active = idx === activeIndex;
            return (
              <Link
                key={panel.title}
                href={panel.href}
                onMouseEnter={() => setActiveIndex(idx)}
                className={`shrink-0 cursor-pointer rounded-full px-3.5 py-2 sm:px-4 text-[10.5px] sm:text-[11px] font-semibold uppercase tracking-[0.14em] transition-all duration-200 sm:hover:-translate-y-0.5 ${
                  active
                    ? "bg-white text-[#0a1624] shadow-[0_10px_28px_rgba(255,255,255,0.28)] hover:bg-[#51fec0]"
                    : "border border-white/20 bg-white/[0.08] text-white/85 hover:border-[#51fec0]/70 hover:bg-white/16 hover:text-white hover:shadow-[0_10px_24px_rgba(81,254,192,0.18)]"
                }`}
              >
                <span className="mr-1.5 font-mono opacity-65">0{idx + 1}</span>
                {panel.title}
              </Link>
            );
          })}
        </div>
      </div>
    </section>
  );
}

/* -------------------------------------------------------------------------- */
/* 05. OBSIDIAN CONTRAST BAND: SERVICES + 3 UNIQUE PHOTO CARDS + CREDENTIALS  */
/* -------------------------------------------------------------------------- */
const CORE_SERVICES = [
  {
    num: "01",
    title: "Off-Plan Advisory",
    href: "/services/off-plan-advisory",
    items: [
      "Direct access to Nakheel, Binghatti, Emaar, DAMAC, Azizi & Sobha",
      "Side-by-side payment plan & floor-plate audit",
      "RERA escrow & Oqood verification",
      "Launch-day allocation & exit guidance",
    ],
  },
  {
    num: "02",
    title: "Secondary & Ready Handovers",
    href: "/services/secondary-market",
    items: [
      "Valuation anchored to DLD comparable sales",
      "Qualified viewings & offer strategy",
      "Form F (MOU), Developer NOC & Trustee transfer",
      "Seamless Title Deed, snagging & utility handover",
    ],
  },
  {
    num: "03",
    title: "Leasing & Commercial Spaces",
    href: "/services/leasing-rental",
    items: [
      "Executive residential & Grade-A commercial representation",
      "Realistic cheque-schedule & corporate lease structuring",
      "Ejari contract drafting & DLD registration",
      "Renewal benchmarks & RERA rental index checks",
    ],
  },
  {
    num: "04",
    title: "Investment & Portfolio Advisory",
    href: "/services/investment-advisory",
    items: [
      "Net rental yield after Mollak service charges",
      "Capital growth corridors across 5 UAE emirates",
      "UAE Golden Visa AED 2M+ qualification mapping",
      "Annual hold, refinance, or resale review",
    ],
  },
];

const BEYOND_EXPAND_ITEMS: HoverExpandItem[] = [
  {
    id: "mortgage-assistance",
    title: "Mortgage Assistance",
    tag: "FINANCING DESK",
    description:
      "Pre-approval comparisons across UAE resident and non-resident banks before you sign Form F or commit to a developer milestone.",
    image: "/img/beyond/mortgage-villa.webp",
    href: "/services/mortgage-assistance",
  },
  {
    id: "property-management",
    title: "Property Management",
    tag: "LANDLORD ASSET CARE",
    description:
      "End-to-end tenant vetting, Ejari registration, snagging, and annual RERA rental index yield optimization for absentee owners.",
    image: "/img/beyond/management-lobby.webp",
    href: "/services/property-management",
  },
  {
    id: "legal-golden-visa",
    title: "Legal, Golden Visa & Fit-Out",
    tag: "CONVEYANCING & RESIDENCY",
    description:
      "DLD Trustee transfers, Power of Attorney coordination, AED 2M+ 10-year UAE Golden Visa eligibility guidance, and turnkey fit-out partners.",
    image: "/img/beyond/legal-pavilion.webp",
    href: "/services/legal-documentation",
  },
  {
    id: "private-office-desk",
    title: "Al Saqr Private Office",
    tag: "25TH FLOOR · SHEIKH ZAYED RD",
    description:
      "Confidential portfolio reviews and direct master-developer allocation briefings hosted at our Sheikh Zayed Road headquarters.",
    image: "/img/about/contact-reception.webp",
    href: "/contact",
  },
  {
    id: "branded-residences",
    title: "Branded Residences Desk",
    tag: "ULTRA-PRIME ALLOCATIONS",
    description:
      "Early-access floor plans across Four Seasons, Bugatti, Mercedes-Benz, Baccarat, Armani, and Dorchester Collection residences.",
    image: "/img/projects/hh-development/four-seasons-branded-residences.webp",
    href: "/off-plan",
  },
];

function CredentialLaurel({ top, bottom }: { top: string; bottom: string }) {
  return (
    <div className="group flex flex-col items-center text-center transition-transform duration-300 hover:-translate-y-1">
      <div className="relative flex h-24 w-24 items-center justify-center rounded-full border border-dashed border-[#51fec0]/45 bg-white/[0.06] backdrop-blur-md transition-all duration-300 group-hover:scale-105 group-hover:border-[#51fec0] group-hover:bg-[#51fec0]/15 group-hover:shadow-[0_0_28px_rgba(81,254,192,0.28)]">
        <div className="text-center px-2">
          <div className="text-sm font-medium tracking-[-0.02em] text-white transition-colors group-hover:text-[#51fec0]">
            {top}
          </div>
        </div>
      </div>
      <p className="mt-3 max-w-[120px] text-[11px] leading-snug text-[#94a3b8] transition-colors group-hover:text-white/90">
        {bottom}
      </p>
    </div>
  );
}

export function ServicesAndTrackRecord() {
  return (
    <section className="bg-[#0b131e]/95 py-24 sm:py-32 text-white backdrop-blur-xl">
      <div className="mx-auto max-w-[1260px] px-4 sm:px-8">
        {/* Part A: Services Header */}
        <div className="flex flex-wrap items-end justify-between gap-6">
          <div>
            <SectionEyebrow tone="dark">WHAT WE PROVIDE</SectionEyebrow>
            <SplitHeading
              tone="dark"
              primary="Taking the guesswork"
              muted="out of Dubai property"
              className="mt-5"
            />
          </div>
          <BracketLink href="/services" variant="white" size="sm">
            All Services
          </BracketLink>
        </div>

        {/* 4 Interactive Numbered Rows */}
        <div className="mt-14 divide-y divide-white/[0.1] border-y border-white/[0.1]">
          {CORE_SERVICES.map((srv) => (
            <Link
              key={srv.num}
              href={srv.href}
              className="group grid grid-cols-1 items-center gap-6 px-3 py-9 sm:py-11 md:grid-cols-12 rounded-2xl transition-all duration-300 hover:bg-white/[0.05] hover:px-5"
            >
              <div className="md:col-span-5 flex items-baseline gap-6">
                <span className="font-mono text-sm text-[#57d2f4] transition-transform duration-300 group-hover:scale-110">{srv.num}</span>
                <h3 className="text-2xl sm:text-[28px] font-medium tracking-[-0.03em] text-white transition-all duration-300 group-hover:translate-x-1 group-hover:text-[#51fec0]">
                  {srv.title}
                </h3>
              </div>
              <ul className="md:col-span-5 space-y-2 text-sm text-[#cbd5e1]">
                {srv.items.map((pt) => (
                  <li key={pt} className="flex items-start gap-2.5">
                    <span className="text-[#51fec0]" aria-hidden="true">
                      +
                    </span>
                    <span>{pt}</span>
                  </li>
                ))}
              </ul>
              <div className="md:col-span-2 flex md:justify-end">
                <span className="inline-flex h-16 w-12 items-center justify-center rounded-xl border border-white/15 bg-white/[0.06] text-white transition-all duration-300 group-hover:scale-105 group-hover:border-[#51fec0] group-hover:bg-[#51fec0] group-hover:text-[#0a1624] group-hover:shadow-[0_12px_28px_rgba(81,254,192,0.35)]">
                  <ArrowRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-0.5" />
                </span>
              </div>
            </Link>
          ))}
        </div>

        {/* Part B: Support Beyond Buying and Selling (21st.dev HoverExpand Spring Panels) */}
        <div className="mt-24">
          <div className="flex flex-wrap items-end justify-between gap-4">
            <SplitHeading
              tone="dark"
              size="md"
              primary="Support beyond"
              muted="buying and selling"
            />
            <span className="font-mono text-[11px] uppercase tracking-[0.18em] text-[#51fec0]/85">
              HOVER OR TAP ANY DESK TO EXPAND
            </span>
          </div>
          <HoverExpand
            items={BEYOND_EXPAND_ITEMS}
            orientation="horizontal"
            expandedFlex={4.2}
            collapsedFlex={1}
            className="mt-10"
          />
        </div>

        {/* Part C: Track Record Credentials + 2x2 Crisp White Stat Cards (No Restrictive Caps) */}
        <div className="mt-28 border-t border-white/[0.1] pt-20">
          <div className="grid grid-cols-1 items-center gap-12 lg:grid-cols-12">
            <div className="lg:col-span-5 grid grid-cols-3 gap-4">
              <CredentialLaurel
                top={`ORN ${SITE.reraOrn}`}
                bottom="RERA Registered Dubai Brokerage"
              />
              <CredentialLaurel
                top="Direct Desk"
                bottom="Premier UAE Master Developers"
              />
              <CredentialLaurel
                top="Est. 2008"
                bottom="Al Saqr Building · SZR"
              />
            </div>

            <div className="lg:col-span-7">
              <h2 className="text-[30px] sm:text-[42px] md:text-[48px] font-medium leading-[1.1] tracking-[-0.04em] text-white">
                Eighteen years advising Dubai buyers and investors —{" "}
                <span className="text-[#94a3b8]">
                  pairing DLD transaction evidence with street-level floor-plate
                  knowledge.
                </span>
              </h2>
            </div>
          </div>

          <div className="mt-14 grid grid-cols-1 gap-5 sm:grid-cols-2">
            {stats.map((st) => (
              <SpotlightCard key={st.label} className="bg-white/95">
                <div className="flex min-h-[136px] items-center justify-between gap-6 px-7 py-6 sm:px-9 text-[#121212]">
                  <p className="max-w-[220px] text-sm leading-snug text-[#475569]">
                    {st.label}
                  </p>
                  <p className="text-[42px] sm:text-[56px] font-medium leading-none tracking-[-0.045em] text-[#0a1624] tabular-nums">
                    {st.value}
                    {st.suffix}
                  </p>
                </div>
              </SpotlightCard>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

/* -------------------------------------------------------------------------- */
/* 06. GLASS TICKER + 21ST.DEV 3D PERSPECTIVE FLIP DUBAI COMMUNITIES          */
/* -------------------------------------------------------------------------- */
const TICKER_ITEMS = [
  `RERA ORN ${SITE.reraOrn}`,
  "NAKHEEL · BINGHATTI · EMAAR · DAMAC · AZIZI · TARRAD",
  "ESCROW-REGISTERED OFF-PLAN",
  "25TH FLOOR · AL SAQR BUILDING · SZR",
  "RESIDENTIAL, LEASING & COMMERCIAL SPACES",
  "DLD TRANSFER & EJARI ADVISORY",
];

export function CommunitiesAndTicker() {
  return (
    <section className="relative bg-white/16 backdrop-blur-[1px]">
      {/* Luminous Translucent Uppercase Marquee Ticker */}
      <div className="overflow-hidden border-b border-white/70 bg-white/62 py-5 backdrop-blur-xl">
        <div className="avenlo-marquee-track flex items-center gap-8 text-[11px] font-semibold uppercase tracking-[0.22em] text-[#0c233a]">
          {[...TICKER_ITEMS, ...TICKER_ITEMS].map((item, idx) => (
            <React.Fragment key={`${item}-${idx}`}>
              <span
                className="whitespace-nowrap"
                aria-hidden={idx >= TICKER_ITEMS.length ? true : undefined}
              >
                {item}
              </span>
              <span
                className="h-[5px] w-[5px] shrink-0 bg-[#1b6aa7]"
                aria-hidden="true"
              />
            </React.Fragment>
          ))}
        </div>
      </div>

      {/* Flagship Dubai Communities — 21st.dev 3D Perspective Flip Cards */}
      <div className="mx-auto max-w-[1260px] px-4 py-24 sm:px-8">
        <div className="flex flex-wrap items-end justify-between gap-6">
          <div>
            <SectionEyebrow>DUBAI DISTRICTS</SectionEyebrow>
            <SplitHeading
              primary="Flagship corridors,"
              muted="known building by building"
              className="mt-5"
            />
          </div>
          <BracketLink href="/communities" variant="light" size="md">
            All Community Guides
          </BracketLink>
        </div>

        <div className="mt-12 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {communities.slice(0, 8).map((comm) => (
            <CommunityFlipCard
              key={comm.slug}
              name={comm.name}
              slug={comm.slug}
              image={comm.image}
              blurb={comm.blurb}
            />
          ))}
        </div>
      </div>
    </section>
  );
}

/* -------------------------------------------------------------------------- */
/* 07. STAGES OF ACQUISITION — 4-COLUMN GLASS WAVE CARDS                      */
/* -------------------------------------------------------------------------- */
const ACQUISITION_STAGES = [
  {
    num: "01",
    title: "Brief & Shortlist",
    body: "We align on yield, lifestyle, or Golden Visa goals, then narrow active developer releases and ready homes to a sharp 3–5 contender sheet.",
    dashed: true,
    offset: "lg:mt-0",
  },
  {
    num: "02",
    title: "Viewings & DLD Check",
    body: "Sales gallery tours or building inspections paired with RERA escrow status, developer handover history, and service-charge evidence.",
    dashed: false,
    offset: "lg:mt-16",
  },
  {
    num: "03",
    title: "Reservation, Form F & SPA",
    body: "We price every offer on recent DLD comparables, review SPA/Form F clauses in plain English, and structure mortgage pre-approval.",
    dashed: true,
    offset: "lg:mt-4",
  },
  {
    num: "04",
    title: "Transfer, Oqood & Keys",
    body: "Developer NOC, DLD Trustee transfer or Oqood registration, handover snagging, DEWA setup, and Ejari leasing handled cleanly.",
    dashed: false,
    offset: "lg:mt-20",
  },
];

export function AcquisitionStagesWave() {
  return (
    <section className="border-t border-white/60 bg-white/24 py-24 sm:py-28 backdrop-blur-[2px]">
      <div className="mx-auto max-w-[1260px] px-4 sm:px-8">
        <div className="text-center">
          <SectionEyebrow align="center">STAGES OF A TRANSACTION</SectionEyebrow>
          <SplitHeading
            align="center"
            primary="From first brief"
            muted="to Title Deed"
            inline
            className="mt-5"
          />
        </div>

        <div className="mt-16 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4 items-start">
          {ACQUISITION_STAGES.map((stage) => (
            <BlurReveal key={stage.num} className={stage.offset}>
              <SpotlightCard className="h-full">
                <div className="flex min-h-[290px] flex-col justify-between p-7 sm:p-8">
                  {stage.dashed ? (
                    <div className="flex h-16 w-16 items-center justify-center rounded-full border border-dashed border-[#1b6aa7]/45 bg-[#eef7fc]/80 font-mono text-sm font-semibold text-[#0c233a]">
                      {stage.num}
                    </div>
                  ) : (
                    <span className="font-mono text-xs font-semibold tracking-[0.18em] text-[#1b6aa7]">
                      STAGE {stage.num}
                    </span>
                  )}

                  <div className="mt-10">
                    <h3 className="text-[20px] font-medium tracking-[-0.025em] text-[#121212]">
                      {stage.title}
                    </h3>
                    <p className="mt-3 text-sm leading-[1.6] text-[#475569]">
                      {stage.body}
                    </p>
                  </div>
                </div>
              </SpotlightCard>
            </BlurReveal>
          ))}
        </div>
      </div>
    </section>
  );
}

/* -------------------------------------------------------------------------- */
/* 08. INTERNATIONAL CLIENT PERSPECTIVES — NAMELESS, BESPOKE, HIDDEN AT BOTTOM */
/* -------------------------------------------------------------------------- */
const TRUSTED_MASTER_DEVELOPERS = [
  "Nakheel",
  "Emaar Properties",
  "Binghatti",
  "DAMAC",
  "Azizi Developments",
  "Tarrad Development",
  "Sobha Realty",
  "Omniyat",
  "Ellington",
  "Meraas",
  "Aldar",
];

export function ClientVoices() {
  const internationalReviews = useMemo<Testimonial[]>(() => {
    return testimonials.map((item) => ({
      id: item.id,
      region: item.city,
      context: item.role,
      content: item.quote,
      rating: item.rating ?? 5,
      avatar: item.image,
    }));
  }, []);

  return (
    <AnimatedTestimonials
      badgeText="International Client Perspectives"
      title="Judged on numbers and outcomes"
      subtitle="Anonymous perspectives from international buyers advised across Dubai and the UAE — representing South Asia, the United Kingdom, Mauritius, and Singapore."
      testimonials={internationalReviews}
      autoRotateInterval={7000}
      trustedCompanies={TRUSTED_MASTER_DEVELOPERS}
      trustedCompaniesTitle="Advising acquisitions across Dubai & UAE master developers"
      defaultCollapsed
    />
  );
}

/* -------------------------------------------------------------------------- */
/* 09. DUBAI MARKET INSIGHTS & BUYER GUIDES PREVIEW                           */
/* -------------------------------------------------------------------------- */
const HOME_INSIGHT_TABS = [
  { id: "latest", label: "Latest Briefings" },
  { id: "Off-Plan & Launches", label: "Off-Plan & Launches" },
  { id: "Rental Yields & Leasing", label: "Rental Yields" },
  { id: "Buying & DLD Law", label: "Buying & DLD Law" },
] as const;

export function InsightsPreview() {
  const [tab, setTab] = useState<string>("latest");

  const visibleArticles = useMemo(() => {
    const pool =
      tab === "latest"
        ? blogIndex
        : blogIndex.filter((a) => a.category === tab);
    return pool.slice(0, 6);
  }, [tab]);

  return (
    <section className="bg-white/24 py-24 backdrop-blur-[2px]">
      <div className="mx-auto max-w-[1260px] px-4 sm:px-8">
        <div className="flex flex-wrap items-end justify-between gap-6">
          <div>
            <SectionEyebrow>JOURNAL &amp; RESEARCH ARCHIVE · SINCE 2008</SectionEyebrow>
            <SplitHeading
              primary="Notes from Sheikh"
              muted="Zayed Road"
              className="mt-5"
            />
          </div>
          <div className="flex flex-wrap items-center gap-3">
            <Link
              href="/guides/buying"
              className="rounded-full border border-white/85 bg-white/84 px-4 py-2.5 text-xs font-medium text-[#121212] shadow-xs backdrop-blur-xl transition-all duration-200 hover:-translate-y-0.5 hover:border-[#121212] hover:bg-[#121212] hover:text-white hover:shadow-md"
            >
              Buying Guide
            </Link>
            <Link
              href="/guides/investing"
              className="rounded-full border border-white/85 bg-white/84 px-4 py-2.5 text-xs font-medium text-[#121212] shadow-xs backdrop-blur-xl transition-all duration-200 hover:-translate-y-0.5 hover:border-[#121212] hover:bg-[#121212] hover:text-white hover:shadow-md"
            >
              Investor Guide
            </Link>
            <BracketLink href="/insights" variant="light" size="sm">
              Explore Full Archive
            </BracketLink>
          </div>
        </div>

        {/* Interactive Category Switcher */}
        <div className="mt-8 flex flex-wrap items-center gap-2">
          {HOME_INSIGHT_TABS.map((t) => {
            const active = tab === t.id;
            return (
              <button
                key={t.id}
                type="button"
                onClick={() => setTab(t.id)}
                className={`cursor-pointer rounded-full px-4 py-2 text-xs font-medium transition-all duration-200 hover:-translate-y-0.5 ${
                  active
                    ? "bg-[#121212] text-white shadow-md"
                    : "border border-white/85 bg-white/80 text-[#334155] backdrop-blur-xl hover:border-[#121212] hover:bg-white hover:text-[#121212]"
                }`}
              >
                {t.label}
              </button>
            );
          })}
        </div>

        <div className="mt-8 grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
          {visibleArticles.map((art) => (
            <SpotlightCard key={art.slug}>
              <Link
                href={`/insights/${art.slug}`}
                className="group flex h-full flex-col justify-between"
              >
                <div>
                  <div className="relative aspect-[16/10] w-full overflow-hidden bg-[#e7f2f9]">
                    <img
                      src={art.image}
                      alt={art.title}
                      loading="lazy"
                      className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
                    />
                  </div>
                  <div className="p-6">
                    <p className="font-mono text-[10.5px] font-semibold uppercase tracking-[0.16em] text-[#1b6aa7]">
                      {art.category} · {art.readTime}
                    </p>
                    <h3 className="mt-2.5 text-[19px] font-medium leading-[1.25] tracking-[-0.025em] text-[#121212] group-hover:text-[#0e9f6e] transition-colors">
                      {art.title}
                    </h3>
                    <p className="mt-2.5 line-clamp-3 text-xs leading-relaxed text-[#475569]">
                      {art.excerpt}
                    </p>
                  </div>
                </div>
                <div className="flex items-center justify-between border-t border-black/[0.06] px-6 py-4 text-xs font-medium text-[#121212]">
                  <span className="font-mono text-[11px] text-[#64748b]">{art.date}</span>
                  <span className="inline-flex items-center gap-1 transition-all group-hover:translate-x-0.5 group-hover:text-[#0e9f6e]">
                    Read <ArrowUpRight className="h-3.5 w-3.5" />
                  </span>
                </div>
              </Link>
            </SpotlightCard>
          ))}
        </div>
      </div>
    </section>
  );
}
