"use client";

import React, { useMemo, useState } from "react";
import Link from "next/link";
import { AnimatePresence, motion } from "framer-motion";
import { ArrowRight, ArrowUpRight, Play, X } from "lucide-react";
import {
  communities,
  SITE,
  stats,
  team,
  testimonials,
  horizontalTestimonials,
} from "@/lib/swk";
import { developers, projects, type Project } from "@/lib/developers";
import { LISTINGS } from "@/lib/listings";
import { blogArticles } from "@/lib/blog";
import { BracketLink } from "@/components/avenlo/bracket-button";
import {
  BlurReveal,
  LiveStatusDot,
  ScrollRevealStatement,
  SectionEyebrow,
  SplitHeading,
} from "@/components/avenlo/motion";

/* -------------------------------------------------------------------------- */
/* 01. BRIGHT ARCHITECTURAL HERO                                              */
/* -------------------------------------------------------------------------- */
export function AvenloHero() {
  const [briefOpen, setBriefOpen] = useState(false);

  return (
    <section className="relative overflow-hidden bg-white bg-arch-grid-fade pt-14 pb-0 sm:pt-20">
      <div className="mx-auto max-w-[1260px] px-4 sm:px-8">
        {/* Centered Eyebrow + Monumental Mixed Roman/Italic H1 */}
        <div className="mx-auto max-w-5xl text-center">
          <SectionEyebrow align="center">
            RERA ORN {SITE.reraOrn} · DUBAI &amp; UAE REAL ESTATE
          </SectionEyebrow>

          <h1 className="mt-6 text-[46px] sm:text-[74px] md:text-[102px] lg:text-[124px] font-medium leading-[0.96] tracking-[-0.048em] text-[#121212]">
            Own the{" "}
            <span className="italic font-light">skyline</span>
            <br />
            before it rises
          </h1>

          <div className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-5">
            <BracketLink href="/contact" variant="light" size="lg">
              Work With Us
            </BracketLink>
            <Link
              href="/off-plan"
              className="inline-flex items-center gap-1.5 text-xs font-medium uppercase tracking-[0.16em] text-[#525252] transition-colors hover:text-[#121212]"
            >
              <span>Explore 108+ Developer Launches</span>
              <ArrowUpRight className="h-3.5 w-3.5" />
            </Link>
          </div>
        </div>

        {/* Asymmetric Lower Meta Row (Avenlo Signature) */}
        <div className="mt-14 sm:mt-20 grid grid-cols-1 items-end gap-10 md:grid-cols-12">
          {/* Left: Arched Portrait + 18+ Stat */}
          <div className="md:col-span-5 flex items-center gap-6">
            <div className="relative h-[132px] w-[104px] sm:h-[154px] sm:w-[122px] shrink-0 overflow-hidden rounded-tl-[90px] rounded-bl-[90px] rounded-tr-xl rounded-br-xl bg-[#f5f5f5] border border-black/[0.06]">
              <img
                src="/img/team/haseeb-portrait.webp"
                alt="Mohammad Haseeb — SWK Properties Sales & Operations Manager"
                className="h-full w-full object-cover object-top"
              />
            </div>
            <div>
              <div className="text-[44px] sm:text-[56px] font-medium leading-none tracking-[-0.045em] text-[#121212] tabular-nums">
                18+
              </div>
              <p className="mt-2 max-w-[160px] text-[13px] leading-snug text-[#525252]">
                Years advising buyers across Dubai &amp; the UAE
              </p>
            </div>
          </div>

          {/* Right: Circular Play / Market Brief Button + Split-Tone Editorial Note */}
          <div className="md:col-span-5 md:col-start-8 flex flex-col items-start md:items-end text-left md:text-right">
            <button
              type="button"
              onClick={() => setBriefOpen(true)}
              aria-label="Open 2026 Dubai Market Briefing"
              className="group inline-flex h-16 w-16 cursor-pointer items-center justify-center rounded-full border border-[#cfcfcf] bg-white text-[#121212] transition-all duration-300 hover:scale-105 hover:border-[#121212] hover:bg-[#121212] hover:text-white"
            >
              <Play className="h-5 w-5 translate-x-0.5 fill-current" />
            </button>
            <p className="mt-5 max-w-[320px] text-[15px] leading-[1.45] tracking-[-0.015em] text-[#121212]">
              Dubai advisory built around{" "}
              <span className="text-[#8b8b8b]">
                live developer launches, RERA escrow clarity,
              </span>{" "}
              and real handover records.
            </p>
          </div>
        </div>
      </div>

      {/* Architectural Skyline Layered Over Monumental Faint "Since 2008" Watermark */}
      <div className="relative mt-10 sm:mt-14 w-full overflow-hidden">
        <div
          aria-hidden="true"
          className="pointer-events-none select-none text-center text-[19vw] xl:text-[230px] font-medium leading-[0.82] tracking-[-0.055em] text-black/[0.045]"
        >
          Since 2008
        </div>

        <div className="relative z-10 mx-auto -mt-[8vw] sm:-mt-[95px] max-w-[1260px] px-4 sm:px-8">
          <div className="relative overflow-hidden rounded-t-3xl border border-b-0 border-black/[0.08] bg-[#f5f5f5] shadow-[0_-20px_70px_rgba(18,18,18,0.06)]">
            <img
              src="/img/hero/dubai-skyline-hero.webp"
              alt="Dubai skyline modern glass towers and architectural waterfront"
              fetchPriority="high"
              className="h-[320px] sm:h-[460px] md:h-[580px] w-full object-cover object-center"
            />
            <div className="absolute inset-x-0 bottom-0 flex flex-wrap items-center justify-between gap-3 bg-gradient-to-t from-[#121212]/80 via-[#121212]/35 to-transparent px-6 py-5 text-white">
              <LiveStatusDot label="27+ UAE Developers · 108+ Verified Projects" tone="launch" />
              <Link
                href="#dubai-launches"
                className="text-xs font-medium uppercase tracking-[0.16em] text-white/90 hover:text-[#51fec0] transition-colors"
              >
                See 2026 New Releases ↓
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Clean Market Briefing Lightbox Modal */}
      <AnimatePresence>
        {briefOpen ? (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] flex items-center justify-center bg-[#121212]/70 p-4 backdrop-blur-md"
            onClick={() => setBriefOpen(false)}
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.96, y: 12 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.96, y: 12 }}
              onClick={(e) => e.stopPropagation()}
              className="w-full max-w-2xl overflow-hidden rounded-2xl border border-white/15 bg-[#121212] text-white shadow-2xl"
            >
              <div className="flex items-center justify-between border-b border-white/10 px-6 py-4">
                <SectionEyebrow tone="dark">2026 DUBAI MARKET BRIEFING</SectionEyebrow>
                <button
                  type="button"
                  onClick={() => setBriefOpen(false)}
                  aria-label="Close briefing"
                  className="cursor-pointer rounded-full p-1.5 text-white/70 hover:bg-white/10 hover:text-white"
                >
                  <X className="h-4 w-4" />
                </button>
              </div>
              <div className="p-6 sm:p-8 space-y-5">
                <h2 className="text-2xl sm:text-3xl font-medium tracking-[-0.03em]">
                  How SWK approaches Dubai&apos;s 2026 developer pipeline
                </h2>
                <p className="text-sm leading-relaxed text-white/75">
                  With over 108 tracked launches across Emaar, Nakheel, Sobha, DAMAC, Binghatti, Azizi, Aldar, Ellington, and Arada, the difference between an average purchase and a resilient asset comes down to three checks: delivered build quality, RERA escrow protection, and realistic net rental yield after service charges.
                </p>
                <div className="grid grid-cols-1 gap-3 sm:grid-cols-3 pt-2">
                  {[
                    { k: "0% Buyer Fee", v: "On primary developer launches" },
                    { k: "Escrow Registered", v: "Under Dubai Law No. 8 / 2007" },
                    { k: "5 Emirates", v: "Dubai, Abu Dhabi, Sharjah, RAK & UAQ" },
                  ].map((item) => (
                    <div key={item.k} className="rounded-xl bg-[#1e1e1e] p-4">
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
                    Browse 108+ Launches
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
/* 02. SCROLL-REVEAL EDITORIAL STATEMENT & 2-CARD CLIENT GROWTH BENTO         */
/* -------------------------------------------------------------------------- */
export function EditorialBento() {
  const quotePool = useMemo(() => testimonials.slice(0, 3), []);
  const [activeQuote, setActiveQuote] = useState(0);
  const current = quotePool[activeQuote] ?? quotePool[0];

  return (
    <section className="relative overflow-hidden bg-white py-24 sm:py-32">
      {/* Soft Architectural Halo Backdrop */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-x-0 top-0 h-[520px] bg-gradient-to-b from-[#f7f7f7] via-white to-white"
      />

      <div className="relative mx-auto max-w-[1120px] px-4 sm:px-8">
        <div className="mx-auto max-w-4xl">
          <ScrollRevealStatement text="We advise buyers and investors who look past developer brochures — pairing Dubai floor-plate intelligence with escrow security and long-term appreciation." />

          <div className="mt-10 flex flex-wrap items-center gap-3">
            {["Off-Plan Intelligence", "DLD & Escrow Due Diligence", "Yield & Exit Strategy"].map(
              (pillar) => (
                <span
                  key={pillar}
                  className="rounded-full border border-black/10 bg-[#f7f7f7] px-4 py-2 text-xs font-medium text-[#121212]"
                >
                  {pillar}
                </span>
              )
            )}
          </div>
        </div>

        {/* 2-Card Avenlo Bento Row */}
        <div className="mt-16 grid grid-cols-1 gap-6 md:grid-cols-2">
          {/* Left Card: Pure White Client Outcome Spotlight */}
          <div className="flex min-h-[400px] sm:min-h-[450px] flex-col justify-between rounded-2xl border border-black/[0.07] bg-[#f7f7f7] p-8 sm:p-10">
            <div className="flex items-center justify-between">
              <span className="text-xl font-semibold tracking-[-0.04em] text-[#121212]">
                client note
              </span>
              <div className="flex items-center gap-1.5" role="tablist" aria-label="Client stories">
                {quotePool.map((q, idx) => (
                  <button
                    key={q.id}
                    type="button"
                    role="tab"
                    aria-selected={activeQuote === idx}
                    aria-label={`Read quote from ${q.name}`}
                    onClick={() => setActiveQuote(idx)}
                    className={`h-2 w-2 cursor-pointer rounded-full transition-colors ${
                      activeQuote === idx ? "bg-[#121212]" : "bg-[#cfcfcf] hover:bg-[#8b8b8b]"
                    }`}
                  />
                ))}
              </div>
            </div>

            {current ? (
              <blockquote className="my-8 text-[22px] sm:text-[26px] font-medium leading-[1.3] tracking-[-0.03em] text-[#121212]">
                &ldquo;{current.quote}&rdquo;
              </blockquote>
            ) : null}

            {current ? (
              <div className="flex items-center justify-between gap-4 border-t border-black/[0.06] pt-5">
                <div className="flex items-center gap-3">
                  <img
                    src={current.image}
                    alt={current.name}
                    loading="lazy"
                    className="h-10 w-10 rounded-lg object-cover"
                  />
                  <div className="text-xs">
                    <span className="font-medium text-[#121212]">{current.name}</span>
                    <span className="mx-1.5 text-[#a7a7a7]">•</span>
                    <span className="uppercase tracking-[0.14em] text-[#8b8b8b]">
                      {current.city}
                    </span>
                    <span className="block text-[#737373]">{current.role}</span>
                  </div>
                </div>
                <Link
                  href="/about"
                  className="text-xs font-medium text-[#121212] underline underline-offset-4"
                >
                  Our ethos
                </Link>
              </div>
            ) : null}
          </div>

          {/* Right Card: Vivid Dubai Architecture + Frosted Glass Advisor Overlay */}
          <div className="relative min-h-[400px] sm:min-h-[450px] overflow-hidden rounded-2xl bg-[#121212]">
            <img
              src="/img/projects/emaar/rashid-yachts-and-marina.webp"
              alt="Dubai waterfront luxury architecture"
              loading="lazy"
              className="h-full w-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-[#121212]/65 via-transparent to-transparent" />

            <div className="absolute inset-x-4 bottom-4 sm:inset-x-6 sm:bottom-6 rounded-2xl border border-white/25 bg-white/16 p-5 text-white backdrop-blur-xl">
              <div className="flex items-center gap-1.5">
                {team.slice(0, 4).map((advisor) => (
                  <img
                    key={advisor.slug}
                    src={advisor.photo}
                    alt={advisor.name}
                    loading="lazy"
                    className="h-10 w-10 rounded-lg border border-white/40 object-cover object-top"
                  />
                ))}
                <Link
                  href="/agents"
                  aria-label="Meet all SWK Properties advisors"
                  className="flex h-10 w-10 items-center justify-center rounded-lg border border-white/30 bg-[#121212]/80 text-xs font-medium text-[#51fec0] hover:bg-[#121212]"
                >
                  +4
                </Link>
              </div>

              <div className="mt-4 flex items-end justify-between gap-4">
                <p className="max-w-[230px] text-xs sm:text-sm leading-snug text-white/95">
                  Turning a Dubai brief into the right developer allocation.
                </p>
                <div className="text-right leading-none shrink-0">
                  <span className="text-3xl sm:text-4xl font-medium tracking-[-0.04em] text-white">
                    108+
                  </span>
                  <span className="ml-1 text-[11px] font-medium uppercase tracking-[0.14em] text-[#51fec0]">
                    Launches
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

/* -------------------------------------------------------------------------- */
/* 03. WHAT'S HAPPENING IN DUBAI — 2026 DEVELOPER LAUNCHES PULSE              */
/* -------------------------------------------------------------------------- */
type LaunchCategory = "all" | "waterfront" | "branded" | "villas" | "plans";

const LAUNCH_TABS: { id: LaunchCategory; label: string }[] = [
  { id: "all", label: "All 2026 Releases" },
  { id: "waterfront", label: "Waterfront & Islands" },
  { id: "branded", label: "Branded & Sky Towers" },
  { id: "villas", label: "Master Villas" },
  { id: "plans", label: "Structured Plans" },
];

const CURATED_RELEASE_SLUGS: Record<LaunchCategory, string[]> = {
  all: [
    "imtiaz-kore",
    "azizi-venice",
    "emaar-the-oasis",
    "damac-islands",
    "sobha-century",
    "binghatti-maybach-mercedes-benz",
  ],
  waterfront: [
    "palm-jebel-ali",
    "creek-haven",
    "azizi-venice",
    "the-meriva-dubai-islands",
    "sobha-seahaven",
    "sobha-siniya-island",
  ],
  branded: [
    "binghatti-maybach-mercedes-benz",
    "bugatti-residences-by-binghatti",
    "mercedes-benz-places",
    "como-residences",
    "manchester-city-yas-residences",
    "karl-lagerfeld-villas",
  ],
  villas: [
    "emaar-the-oasis",
    "damac-islands",
    "palm-jebel-ali",
    "masaar",
    "lunaya-the-bloom-villa",
    "dubai-hills-estate-residences",
  ],
  plans: [
    "imtiaz-kore",
    "azizi-florence",
    "danube-greenz",
    "samana-downtown-one",
    "dugasta-platinum-residence",
    "sobha-river-core",
  ],
};

export function DubaiDeveloperPulse() {
  const [activeTab, setActiveTab] = useState<LaunchCategory>("all");

  const visibleReleases = useMemo(() => {
    const slugs = CURATED_RELEASE_SLUGS[activeTab];
    const matched = slugs
      .map((s) => projects.find((p) => p.slug === s))
      .filter((p): p is Project => Boolean(p));
    if (matched.length >= 6) return matched.slice(0, 6);
    const seen = new Set(matched.map((m) => m.slug));
    const fill = projects.filter((p) => !seen.has(p.slug)).slice(0, 6 - matched.length);
    return [...matched, ...fill];
  }, [activeTab]);

  const logoDevelopers = useMemo(
    () => developers.filter((d) => Boolean(d.logo)).slice(0, 14),
    []
  );

  return (
    <section id="dubai-launches" className="border-y border-black/[0.06] bg-[#f7f7f7] py-24">
      <div className="mx-auto max-w-[1260px] px-4 sm:px-8">
        {/* Header */}
        <div className="flex flex-wrap items-end justify-between gap-6">
          <div>
            <SectionEyebrow>DUBAI MARKET PULSE · 2026 RELEASES</SectionEyebrow>
            <SplitHeading
              primary="What's launching now"
              muted="across Dubai & the UAE"
              className="mt-5"
            />
          </div>
          <BracketLink href="/off-plan" variant="light" size="md">
            All 108+ Projects
          </BracketLink>
        </div>

        {/* Official UAE Master Developer Logo Roster */}
        <div className="mt-12 rounded-2xl border border-black/[0.06] bg-white p-5 sm:p-7">
          <div className="mb-4 flex flex-wrap items-center justify-between gap-2">
            <span className="text-[11px] font-medium uppercase tracking-[0.2em] text-[#8b8b8b]">
              27+ Official UAE Master Developer Partners
            </span>
            <Link
              href="/developers"
              className="text-xs font-medium text-[#121212] underline underline-offset-4 hover:text-[#0e9f6e]"
            >
              Inspect All 27+ Developers →
            </Link>
          </div>
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-4 md:grid-cols-7">
            {logoDevelopers.map((dev) => (
              <Link
                key={dev.slug}
                href={`/developers/${dev.slug}`}
                title={`${dev.name} — ${dev.projectCount} projects`}
                className="group flex h-16 items-center justify-center rounded-xl border border-black/[0.05] bg-[#f7f7f7] px-3 transition-colors hover:border-black/20 hover:bg-white"
              >
                <img
                  src={dev.logo}
                  alt={dev.name}
                  loading="lazy"
                  className="max-h-8 max-w-[96px] object-contain opacity-75 grayscale transition-all duration-200 group-hover:opacity-100 group-hover:grayscale-0"
                />
              </Link>
            ))}
          </div>
        </div>

        {/* Interactive Avenlo Pill Filters */}
        <div className="mt-10 flex flex-wrap items-center gap-2">
          {LAUNCH_TABS.map((tab) => {
            const active = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                type="button"
                onClick={() => setActiveTab(tab.id)}
                className={`cursor-pointer rounded-full px-5 py-2.5 text-xs font-medium transition-colors ${
                  active
                    ? "bg-[#121212] text-white"
                    : "border border-black/10 bg-white text-[#525252] hover:border-[#121212] hover:text-[#121212]"
                }`}
              >
                {tab.label}
              </button>
            );
          })}
        </div>

        {/* 6 Live Release Architectural Cards */}
        <div className="mt-8 grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
          {visibleReleases.map((proj) => (
            <Link
              key={proj.slug}
              href={`/off-plan/${proj.slug}`}
              className="group flex flex-col overflow-hidden rounded-2xl border border-black/[0.07] bg-white transition-all duration-300 hover:border-black/20 hover:shadow-[0_20px_50px_rgba(18,18,18,0.08)]"
            >
              <div className="relative aspect-[16/10] w-full overflow-hidden bg-[#ececec]">
                <img
                  src={proj.image}
                  alt={`${proj.name} by ${proj.developer}`}
                  loading="lazy"
                  className="h-full w-full object-cover transition-transform duration-700 ease-out group-hover:scale-[1.04]"
                />
                <div className="absolute top-3.5 left-3.5 flex items-center gap-1.5">
                  <span className="inline-flex items-center gap-1.5 rounded-full bg-[#121212]/82 px-3 py-1 text-[10px] font-medium uppercase tracking-[0.16em] text-white backdrop-blur-md">
                    <span className="h-1.5 w-1.5 rounded-[2px] bg-[#51fec0]" aria-hidden="true" />
                    New Release
                  </span>
                </div>
                <span className="absolute bottom-3 right-3 rounded-full bg-white/90 px-2.5 py-0.5 text-[10px] font-medium text-[#121212] backdrop-blur-md">
                  Developer Render
                </span>
              </div>

              <div className="flex flex-1 flex-col justify-between p-6">
                <div>
                  <div className="flex items-center justify-between gap-2 text-[11px] font-medium uppercase tracking-[0.16em] text-[#8b8b8b]">
                    <span className="truncate">{proj.developer}</span>
                    <span className="shrink-0">{proj.community}</span>
                  </div>
                  <h3 className="mt-2 text-[22px] font-medium tracking-[-0.03em] text-[#121212] group-hover:text-[#525252] transition-colors">
                    {proj.name}
                  </h3>
                  <p className="mt-2 line-clamp-2 text-xs leading-relaxed text-[#666666]">
                    {proj.summary}
                  </p>
                </div>

                <div className="mt-5 flex items-center justify-between gap-3 border-t border-black/[0.06] pt-4">
                  <div className="flex flex-wrap gap-1.5">
                    {proj.tags.slice(0, 2).map((tag) => (
                      <span
                        key={tag}
                        className="rounded-full bg-[#f5f5f5] px-2.5 py-1 text-[10px] font-medium text-[#525252]"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                  <span className="inline-flex shrink-0 items-center gap-1 text-xs font-medium text-[#121212] group-hover:text-[#0e9f6e]">
                    <span>Inspect</span>
                    <ArrowUpRight className="h-3.5 w-3.5" />
                  </span>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}

/* -------------------------------------------------------------------------- */
/* 04. FULL-BLEED ARCHITECTURAL RESIDENCE PANELS (AVENLO SHOWSTOPPER)         */
/* -------------------------------------------------------------------------- */
const SHOWCASE_PANELS = [
  {
    title: "Palm Jebel Ali",
    status: "NEW LAUNCH",
    tone: "launch" as const,
    specs: "PALM JEBEL ALI, DUBAI  |  WATERFRONT VILLAS  |  NAKHEEL",
    href: "/off-plan/palm-jebel-ali",
    image: "/img/projects/nakheel/palm-jebel-ali.webp",
    isRender: true,
  },
  {
    title: "Creek Haven",
    status: "NEW LAUNCH",
    tone: "launch" as const,
    specs: "DUBAI CREEK HARBOUR  |  CREEKFRONT TOWER  |  EMAAR",
    href: "/off-plan/creek-haven",
    image: "/img/projects/emaar/creek-haven.webp",
    isRender: true,
  },
  {
    title: "Bugatti Residences",
    status: "PRIORITY ALLOCATION",
    tone: "offer" as const,
    specs: "BUSINESS BAY, DUBAI  |  BRANDED SKY MANSIONS  |  BINGHATTI",
    href: "/off-plan/bugatti-residences-by-binghatti",
    image: "/img/projects/binghatti/bugatti-residences-by-binghatti.webp",
    isRender: true,
  },
  {
    title: "Sobha SeaHaven",
    status: "NEW LAUNCH",
    tone: "launch" as const,
    specs: "DUBAI HARBOUR  |  MARINA RESIDENCES  |  SOBHA REALTY",
    href: "/off-plan/sobha-seahaven",
    image: "/img/projects/sobha/sobha-seahaven.webp",
    isRender: true,
  },
  {
    title: LISTINGS[0]?.title ?? "Burj Crown Boulevard Residence",
    status: "FOR SALE · READY",
    tone: "sale" as const,
    specs: "DOWNTOWN DUBAI  |  3 BR APARTMENT  |  1,785 SQ FT",
    href: `/properties/${LISTINGS[0]?.slug ?? "burj-crown-boulevard-3br-downtown-dubai"}`,
    image: LISTINGS[0]?.images[0] ?? "/img/communities/downtown-dubai.webp",
    isRender: false,
  },
  {
    title: "Como Residences",
    status: "LIMITED RELEASE",
    tone: "offer" as const,
    specs: "PALM JUMEIRAH  |  SCULPTURAL SKY PENTHOUSES  |  NAKHEEL",
    href: "/off-plan/como-residences",
    image: "/img/projects/nakheel/como-residences.webp",
    isRender: true,
  },
];

export function FullBleedResidences() {
  return (
    <section aria-label="Featured Dubai Residences Showcase" className="bg-[#121212]">
      {SHOWCASE_PANELS.map((panel) => (
        <div
          key={panel.title}
          className="group relative flex min-h-[600px] sm:min-h-[720px] lg:min-h-[780px] w-full items-center justify-center overflow-hidden border-b border-white/10"
        >
          <img
            src={panel.image}
            alt={panel.title}
            loading="lazy"
            className="absolute inset-0 h-full w-full object-cover transition-transform duration-1000 ease-out group-hover:scale-[1.03]"
          />
          <div
            aria-hidden="true"
            className="absolute inset-0 bg-gradient-to-t from-[#121212]/80 via-[#121212]/30 to-[#121212]/40"
          />

          <div className="relative z-10 mx-auto max-w-4xl px-4 text-center text-white">
            <LiveStatusDot label={panel.status} tone={panel.tone} surface="dark" />
            <h3 className="mt-4 text-[36px] sm:text-[50px] md:text-[60px] font-light leading-[1.04] tracking-[-0.035em] text-white">
              {panel.title}
            </h3>
            <p className="mt-4 text-[11px] sm:text-[12px] font-medium uppercase tracking-[0.22em] text-white/80">
              {panel.specs}
            </p>
            <div className="mt-9">
              <BracketLink href={panel.href} variant="dark" size="md">
                View Residence
              </BracketLink>
            </div>
          </div>

          {panel.isRender ? (
            <span className="absolute bottom-5 right-5 z-10 text-[10px] font-medium uppercase tracking-[0.18em] text-white/55">
              Developer Architectural Render
            </span>
          ) : null}
        </div>
      ))}
    </section>
  );
}

/* -------------------------------------------------------------------------- */
/* 05. OBSIDIAN CONTRAST BAND: SERVICES + 3 PHOTO CARDS + TRACK RECORD        */
/* -------------------------------------------------------------------------- */
const CORE_SERVICES = [
  {
    num: "01",
    title: "Off-Plan Advisory",
    href: "/services/off-plan-advisory",
    items: [
      "Direct access to 27+ UAE master developers",
      "Side-by-side payment plan & floor-plate audit",
      "RERA escrow & Oqood verification",
      "Launch-day allocation & exit guidance",
    ],
  },
  {
    num: "02",
    title: "Buying & Selling Ready Homes",
    href: "/services/secondary-market",
    items: [
      "Valuation anchored to DLD comparable sales",
      "Qualified viewings & offer strategy",
      "Form F (MOU), Developer NOC & Trustee transfer",
      "Seamless Title Deed & utility handover",
    ],
  },
  {
    num: "03",
    title: "Leasing & Ejari Rentals",
    href: "/services/leasing-rental",
    items: [
      "Executive tenant & landlord representation",
      "Realistic cheque-schedule structuring",
      "Ejari contract drafting & registration",
      "Renewal benchmarks & RERA index checks",
    ],
  },
  {
    num: "04",
    title: "Investment & Portfolio Advisory",
    href: "/services/investment-advisory",
    items: [
      "Net rental yield after Mollak service charges",
      "Capital growth corridors across 5 emirates",
      "UAE Golden Visa AED 2M+ qualification mapping",
      "Annual hold, refinance, or resale review",
    ],
  },
];

const BEYOND_CARDS = [
  {
    title: "Mortgage Assistance",
    href: "/services/mortgage-assistance",
    image: "/img/gallery/image13.webp",
  },
  {
    title: "Property Management",
    href: "/services/property-management",
    image: "/img/gallery/image12.webp",
  },
  {
    title: "Legal, Golden Visa & Fit-Out",
    href: "/services/legal-documentation",
    image: "/img/gallery/image4.webp",
  },
];

function CredentialLaurel({ top, bottom }: { top: string; bottom: string }) {
  return (
    <div className="flex flex-col items-center text-center">
      <div className="relative flex h-24 w-24 items-center justify-center rounded-full border border-dashed border-white/25 bg-[#1e1e1e]/70">
        <div className="text-center px-2">
          <div className="text-sm font-medium tracking-[-0.02em] text-white">{top}</div>
        </div>
      </div>
      <p className="mt-3 max-w-[110px] text-[11px] leading-snug text-[#8b8b8b]">{bottom}</p>
    </div>
  );
}

export function ServicesAndTrackRecord() {
  return (
    <section className="bg-[#121212] py-24 sm:py-32 text-white">
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
          <div className="text-left sm:text-right">
            <p className="text-[11px] font-medium uppercase tracking-[0.22em] text-[#8b8b8b]">
              SERVICES
            </p>
            <p className="mt-1 text-3xl sm:text-4xl font-medium tracking-[-0.04em] text-white tabular-nums">
              +008
            </p>
          </div>
        </div>

        {/* 4 Interactive Numbered Rows */}
        <div className="mt-14 divide-y divide-white/[0.1] border-y border-white/[0.1]">
          {CORE_SERVICES.map((srv) => (
            <Link
              key={srv.num}
              href={srv.href}
              className="group grid grid-cols-1 items-center gap-6 py-9 sm:py-11 md:grid-cols-12 transition-colors hover:bg-white/[0.02]"
            >
              <div className="md:col-span-5 flex items-baseline gap-6">
                <span className="font-mono text-sm text-[#8b8b8b]">{srv.num}</span>
                <h3 className="text-2xl sm:text-[28px] font-medium tracking-[-0.03em] text-white group-hover:text-[#51fec0] transition-colors">
                  {srv.title}
                </h3>
              </div>
              <ul className="md:col-span-5 space-y-2 text-sm text-[#a7a7a7]">
                {srv.items.map((pt) => (
                  <li key={pt} className="flex items-start gap-2.5">
                    <span className="text-[#8b8b8b]" aria-hidden="true">+</span>
                    <span>{pt}</span>
                  </li>
                ))}
              </ul>
              <div className="md:col-span-2 flex md:justify-end">
                <span className="inline-flex h-16 w-12 items-center justify-center rounded-xl bg-[#1e1e1e] text-white transition-colors duration-200 group-hover:bg-[#51fec0] group-hover:text-[#121212]">
                  <ArrowRight className="h-4 w-4" />
                </span>
              </div>
            </Link>
          ))}
        </div>

        {/* Part B: Support Beyond Buying and Selling (3 Vertical Architectural Cards) */}
        <div className="mt-24">
          <SplitHeading
            tone="dark"
            size="md"
            primary="Support beyond"
            muted="buying and selling"
          />
          <div className="mt-10 grid grid-cols-1 gap-6 md:grid-cols-3">
            {BEYOND_CARDS.map((card) => (
              <Link
                key={card.title}
                href={card.href}
                className="group relative flex min-h-[380px] sm:min-h-[430px] flex-col justify-between overflow-hidden rounded-2xl bg-[#1e1e1e] p-6"
              >
                <img
                  src={card.image}
                  alt={card.title}
                  loading="lazy"
                  className="absolute inset-0 h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-b from-[#121212]/70 via-[#121212]/15 to-[#121212]/65" />
                <h3 className="relative z-10 text-2xl font-medium tracking-[-0.03em] text-white">
                  {card.title}
                </h3>
                <div className="relative z-10">
                  <span className="inline-flex items-center gap-2 rounded-full bg-white px-5 py-2.5 text-[11px] font-medium uppercase tracking-[0.16em] text-[#121212] transition-colors group-hover:bg-[#51fec0]">
                    <span>Learn More</span>
                    <ArrowRight className="h-3.5 w-3.5" />
                  </span>
                </div>
              </Link>
            ))}
          </div>
        </div>

        {/* Part C: Track Record Credentials + 2x2 Crisp White Stat Cards */}
        <div className="mt-28 border-t border-white/[0.1] pt-20">
          <div className="grid grid-cols-1 items-center gap-12 lg:grid-cols-12">
            <div className="lg:col-span-5 grid grid-cols-3 gap-4">
              <CredentialLaurel top="ORN 51517" bottom="RERA Registered Dubai Brokerage" />
              <CredentialLaurel top="27+" bottom="Official UAE Master Developers" />
              <CredentialLaurel top="Est. 2008" bottom="Sheikh Zayed Road Advisory" />
            </div>

            <div className="lg:col-span-7">
              <h2 className="text-[30px] sm:text-[42px] md:text-[48px] font-medium leading-[1.1] tracking-[-0.04em] text-white">
                Eighteen years advising Dubai buyers and investors —{" "}
                <span className="text-[#8b8b8b]">
                  pairing DLD transaction evidence with street-level floor-plate knowledge.
                </span>
              </h2>
            </div>
          </div>

          {/* 2x2 Crisp White Avenlo Stat Cards */}
          <div className="mt-14 grid grid-cols-1 gap-5 sm:grid-cols-2">
            {stats.map((st) => (
              <div
                key={st.label}
                className="flex min-h-[136px] items-center justify-between gap-6 rounded-2xl bg-white px-7 py-6 sm:px-9 text-[#121212]"
              >
                <p className="max-w-[200px] text-sm leading-snug text-[#737373]">{st.label}</p>
                <p className="text-[42px] sm:text-[56px] font-medium leading-none tracking-[-0.045em] text-[#121212] tabular-nums">
                  {st.value}
                  {st.suffix}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

/* -------------------------------------------------------------------------- */
/* 06. TICKER MARQUEE + DUBAI COMMUNITIES ARCHITECTURAL STRIP                 */
/* -------------------------------------------------------------------------- */
const TICKER_ITEMS = [
  "RERA ORN 51517",
  "DIRECT DEVELOPER ALLOCATIONS",
  "ESCROW-REGISTERED OFF-PLAN",
  "SHEIKH ZAYED ROAD HQ",
  "108+ VERIFIED UAE PROJECTS",
  "DLD TRANSFER & EJARI ADVISORY",
];

export function CommunitiesAndTicker() {
  return (
    <section className="bg-white">
      {/* Crisp White Uppercase Marquee Ticker */}
      <div className="overflow-hidden border-b border-black/[0.08] py-5">
        <div className="avenlo-marquee-track flex items-center gap-8 text-[11px] font-medium uppercase tracking-[0.22em] text-[#121212]">
          {[...TICKER_ITEMS, ...TICKER_ITEMS].map((item, idx) => (
            <React.Fragment key={`${item}-${idx}`}>
              <span className="whitespace-nowrap">{item}</span>
              <span className="h-[5px] w-[5px] shrink-0 bg-[#121212]" aria-hidden="true" />
            </React.Fragment>
          ))}
        </div>
      </div>

      {/* 8 Core Dubai Communities */}
      <div className="mx-auto max-w-[1260px] px-4 py-24 sm:px-8">
        <div className="flex flex-wrap items-end justify-between gap-6">
          <div>
            <SectionEyebrow>DUBAI DISTRICTS</SectionEyebrow>
            <SplitHeading
              primary="Eight flagship corridors,"
              muted="known building by building"
              className="mt-5"
            />
          </div>
          <BracketLink href="/communities" variant="light" size="md">
            All Community Guides
          </BracketLink>
        </div>

        <div className="mt-12 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {communities.map((comm) => (
            <Link
              key={comm.slug}
              href={`/communities/${comm.slug}`}
              className="group overflow-hidden rounded-2xl border border-black/[0.06] bg-[#f7f7f7] transition-all hover:border-black/20"
            >
              <div className="relative aspect-[4/3] w-full overflow-hidden bg-[#ececec]">
                <img
                  src={comm.thumb}
                  alt={comm.name}
                  loading="lazy"
                  className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
                />
              </div>
              <div className="p-5">
                <div className="flex items-center justify-between gap-2">
                  <h3 className="text-[18px] font-medium tracking-[-0.025em] text-[#121212]">
                    {comm.name}
                  </h3>
                  <ArrowUpRight className="h-4 w-4 shrink-0 text-[#8b8b8b] transition-colors group-hover:text-[#121212]" />
                </div>
                <p className="mt-1.5 line-clamp-2 text-xs leading-relaxed text-[#737373]">
                  {comm.blurb}
                </p>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}

/* -------------------------------------------------------------------------- */
/* 07. STAGES OF ACQUISITION — 4-COLUMN STAGGERED WAVE (AVENLO SIGNATURE)     */
/* -------------------------------------------------------------------------- */
const ACQUISITION_STAGES = [
  {
    num: "01",
    title: "Brief & Shortlist",
    body: "We align on yield, lifestyle, or Golden Visa goals, then narrow 108+ launches and ready units to a sharp 3–5 contender sheet.",
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
    <section className="border-t border-black/[0.06] bg-[#f7f7f7] py-24 sm:py-28">
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
              <div className="flex min-h-[290px] flex-col justify-between rounded-2xl border border-black/[0.06] bg-white p-7 sm:p-8">
                {stage.dashed ? (
                  <div className="flex h-16 w-16 items-center justify-center rounded-full border border-dashed border-[#cfcfcf] font-mono text-sm font-medium text-[#121212]">
                    {stage.num}
                  </div>
                ) : (
                  <span className="font-mono text-xs font-medium tracking-[0.18em] text-[#8b8b8b]">
                    STAGE {stage.num}
                  </span>
                )}

                <div className="mt-10">
                  <h3 className="text-[20px] font-medium tracking-[-0.025em] text-[#121212]">
                    {stage.title}
                  </h3>
                  <p className="mt-3 text-sm leading-[1.6] text-[#737373]">{stage.body}</p>
                </div>
              </div>
            </BlurReveal>
          ))}
        </div>
      </div>
    </section>
  );
}

/* -------------------------------------------------------------------------- */
/* 08. CLIENT STORIES STRIP                                                   */
/* -------------------------------------------------------------------------- */
export function ClientVoices() {
  const allVoices = [...testimonials, ...horizontalTestimonials].slice(0, 6);

  return (
    <section className="bg-[#f7f7f7] pt-10 pb-8">
      <div className="mx-auto max-w-[1260px] px-4 sm:px-8">
        <div className="text-center">
          <SectionEyebrow align="center">WHAT CLIENTS SAY</SectionEyebrow>
          <SplitHeading
            align="center"
            primary="Judged on outcomes,"
            muted="not on brochures"
            className="mt-5"
          />
        </div>

        <div className="mt-14 grid grid-cols-1 gap-5 md:grid-cols-2 lg:grid-cols-3">
          {allVoices.map((item) => (
            <article
              key={item.id}
              className="flex flex-col justify-between rounded-2xl border border-black/[0.06] bg-white p-7"
            >
              <div>
                <span
                  aria-hidden="true"
                  className="font-mono text-sm tracking-[0.2em] text-[#cfcfcf]"
                >
                  {"//"}
                </span>
                <p className="mt-4 text-[15px] leading-[1.65] text-[#4a4a4a]">
                  &ldquo;{item.quote}&rdquo;
                </p>
              </div>
              <div className="mt-8 flex items-center gap-3.5 pt-4 border-t border-black/[0.05]">
                <img
                  src={item.image}
                  alt={item.name}
                  loading="lazy"
                  className="h-10 w-10 rounded-lg object-cover"
                />
                <div>
                  <p className="text-sm font-medium text-[#121212]">{item.name}</p>
                  <p className="text-xs text-[#8b8b8b]">
                    {item.role} · {item.city}
                  </p>
                </div>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}

/* -------------------------------------------------------------------------- */
/* 09. DUBAI MARKET INSIGHTS & BUYER GUIDES PREVIEW                           */
/* -------------------------------------------------------------------------- */
export function InsightsPreview() {
  const latest = blogArticles.slice(0, 3);

  return (
    <section className="bg-white py-24">
      <div className="mx-auto max-w-[1260px] px-4 sm:px-8">
        <div className="flex flex-wrap items-end justify-between gap-6">
          <div>
            <SectionEyebrow>JOURNAL &amp; BRIEFINGS</SectionEyebrow>
            <SplitHeading
              primary="Notes from Sheikh"
              muted="Zayed Road"
              className="mt-5"
            />
          </div>
          <div className="flex flex-wrap items-center gap-3">
            <Link
              href="/guides/buying"
              className="rounded-full border border-black/10 bg-[#f7f7f7] px-4 py-2.5 text-xs font-medium text-[#121212] hover:bg-[#ececec]"
            >
              Buying Guide
            </Link>
            <Link
              href="/guides/investing"
              className="rounded-full border border-black/10 bg-[#f7f7f7] px-4 py-2.5 text-xs font-medium text-[#121212] hover:bg-[#ececec]"
            >
              Investor Guide
            </Link>
            <BracketLink href="/insights" variant="light" size="sm">
              All Briefings
            </BracketLink>
          </div>
        </div>

        <div className="mt-12 grid grid-cols-1 gap-6 md:grid-cols-3">
          {latest.map((art) => (
            <Link
              key={art.slug}
              href={`/insights/${art.slug}`}
              className="group flex flex-col justify-between overflow-hidden rounded-2xl border border-black/[0.07] bg-white transition-all hover:border-black/20 hover:shadow-[0_20px_50px_rgba(18,18,18,0.07)]"
            >
              <div>
                <div className="relative aspect-[16/10] w-full overflow-hidden bg-[#f5f5f5]">
                  <img
                    src={art.image}
                    alt={art.title}
                    loading="lazy"
                    className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
                  />
                </div>
                <div className="p-6">
                  <p className="text-[11px] font-medium uppercase tracking-[0.16em] text-[#8b8b8b]">
                    {art.category} · {art.readTime}
                  </p>
                  <h3 className="mt-2.5 text-[20px] font-medium leading-[1.25] tracking-[-0.025em] text-[#121212] group-hover:text-[#525252]">
                    {art.title}
                  </h3>
                  <p className="mt-2.5 line-clamp-3 text-sm leading-relaxed text-[#666666]">
                    {art.excerpt}
                  </p>
                </div>
              </div>
              <div className="flex items-center justify-between border-t border-black/[0.06] px-6 py-4 text-xs font-medium text-[#121212]">
                <span>{art.date}</span>
                <span className="inline-flex items-center gap-1 group-hover:text-[#0e9f6e]">
                  Read <ArrowUpRight className="h-3.5 w-3.5" />
                </span>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
