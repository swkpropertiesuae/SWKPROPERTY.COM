"use client";

import React, { useCallback, useEffect, useRef, useState } from "react";
import Link from "next/link";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { ArrowDown, ArrowLeft, ArrowRight, ArrowUpRight, Pause, Play } from "lucide-react";

interface HeroSlide {
  id: string;
  image: string;
  alt: string;
  shortLabel: string;
  tag: string;
  title: string;
  hotTopic: string;
  href: string;
}

const HERO_SLIDES: HeroSlide[] = [
  {
    id: "downtown-burj",
    image: "/img/hero/uae-skyline-flagship.webp",
    alt: "Downtown Dubai architectural skyline, Burj Khalifa and Dubai Water Canal at golden hour",
    shortLabel: "Burj Khalifa",
    tag: "DOWNTOWN DUBAI · BURJ KHALIFA AXIS",
    title: "Trophy Branded Supertalls & Record AED/sq ft Demand",
    hotTopic: "Emaar · Binghatti Mercedes-Benz · Burj Khalifa Views",
    href: "/communities/downtown-dubai",
  },
  {
    id: "palm-jumeirah",
    image: "/img/hero/slide-02-palm-jumeirah.webp",
    alt: "Aerial view of Palm Jumeirah crescent, luxury waterfront fronds and Dubai Marina skyline",
    shortLabel: "Palm Islands",
    tag: "PALM JUMEIRAH & PALM JEBEL ALI",
    title: "Ultra-Prime Beachfront Fronds & Island Scarcity",
    hotTopic: "Nakheel Flagship Waterfront · Private Beach Villas",
    href: "/off-plan/palm-jebel-ali",
  },
  {
    id: "dubai-marina",
    image: "/img/hero/slide-03-dubai-marina.webp",
    alt: "Dubai Marina luxury yacht harbour and waterfront residential towers under golden sky",
    shortLabel: "Dubai Marina",
    tag: "DUBAI MARINA & BLUEWATERS",
    title: "Yacht-Front Waterfront Living & Peak Rental Yields",
    hotTopic: "Deepest Expat Tenant Pool · 7%+ Gross Yield Axis",
    href: "/communities/dubai-marina",
  },
  {
    id: "szr-dusk",
    image: "/img/hero/slide-04-szr-dusk.webp",
    alt: "Sheikh Zayed Road and New Dubai skyline glowing at golden dusk",
    shortLabel: "SZR Dusk",
    tag: "SHEIKH ZAYED ROAD CORRIDOR",
    title: "Dubai 2040 Urban Masterplan & Grade-A Office Boom",
    hotTopic: "DIFC & SZR Commercial Demand · Tightest Vacancy",
    href: "/properties?type=Office",
  },
  {
    id: "szr-night",
    image: "/img/hero/slide-05-szr-night.webp",
    alt: "Sheikh Zayed Road illuminated skyscrapers and golden highway light trails at night",
    shortLabel: "SZR Night",
    tag: "24/7 GLOBAL WEALTH & RESIDENCY HUB",
    title: "10-Year UAE Golden Visa (AED 2M+) & 0% Property Tax",
    hotTopic: "0% Capital Gains · Direct Freehold Ownership",
    href: "/guides/investing",
  },
  {
    id: "marina-night",
    image: "/img/hero/slide-06-marina-night.webp",
    alt: "Dubai Marina illuminated Emaar waterfront residential towers at blue hour",
    shortLabel: "Master Builders",
    tag: "DIRECT MASTER-DEVELOPER ACCESS",
    title: "0% Buyer Fee Releases Across Dubai's Premier Builders",
    hotTopic: "Nakheel · Binghatti · Emaar · DAMAC · Azizi · Sobha",
    href: "/developers",
  },
  {
    id: "fountain-aerial",
    image: "/img/hero/slide-07-fountain-aerial.webp",
    alt: "Bird's-eye night aerial view of The Dubai Fountain arcs and Downtown luxury residences",
    shortLabel: "Downtown Night",
    tag: "DOWNTOWN FOUNTAIN & HOSPITALITY CORE",
    title: "Global Capital Inflows & Year-Round Short-Stay Yields",
    hotTopic: "Branded Residences · Bugatti, VELA & Baccarat",
    href: "/off-plan",
  },
  {
    id: "creek-harbour",
    image: "/img/hero/slide-08-dubai-creek.webp",
    alt: "Dubai Creek Harbour skyline silhouetted against a golden Arabian sunset over water",
    shortLabel: "Creek Harbour",
    tag: "DUBAI CREEK HARBOUR · METRO BLUE LINE",
    title: "Next-Decade Waterfront Skyline & RERA Escrow Clarity",
    hotTopic: "Confirmed Blue Line Catalyst · Creek Haven Launches",
    href: "/communities/dubai-creek-harbour",
  },
];

const SLIDE_INTERVAL_MS = 4800;

export function HeroDubaiReel() {
  const prefersReducedMotion = useReducedMotion();
  const [activeIdx, setActiveIdx] = useState(0);
  const [isPlaying, setIsPlaying] = useState(true);
  const [isHovered, setIsHovered] = useState(false);
  const [direction, setDirection] = useState<1 | -1>(1);
  const touchStartX = useRef<number | null>(null);

  const total = HERO_SLIDES.length;

  const goTo = useCallback(
    (nextIdx: number, dir?: 1 | -1) => {
      const wrapped = ((nextIdx % total) + total) % total;
      setDirection(dir ?? (wrapped >= activeIdx ? 1 : -1));
      setActiveIdx(wrapped);
    },
    [activeIdx, total]
  );

  const handleNext = useCallback(() => {
    setDirection(1);
    setActiveIdx((prev) => (prev + 1) % total);
  }, [total]);

  const handlePrev = useCallback(() => {
    setDirection(-1);
    setActiveIdx((prev) => (prev - 1 + total) % total);
  }, [total]);

  // Smooth auto-advancing slideshow (pauses cleanly on hover, reduced motion, or manual pause)
  useEffect(() => {
    if (!isPlaying || isHovered || prefersReducedMotion) return;
    const timer = window.setInterval(() => {
      setDirection(1);
      setActiveIdx((prev) => (prev + 1) % total);
    }, SLIDE_INTERVAL_MS);
    return () => window.clearInterval(timer);
  }, [isPlaying, isHovered, prefersReducedMotion, total]);

  // Preload the next slide quietly for zero-flicker instant transitions
  useEffect(() => {
    const nextSlide = HERO_SLIDES[(activeIdx + 1) % total];
    if (!nextSlide) return;
    const img = new window.Image();
    img.src = nextSlide.image;
  }, [activeIdx, total]);

  const current = HERO_SLIDES[activeIdx] ?? HERO_SLIDES[0];
  const upcomingCards = [
    HERO_SLIDES[(activeIdx + 1) % total],
    HERO_SLIDES[(activeIdx + 2) % total],
  ];

  return (
    <div
      role="region"
      aria-roledescription="carousel"
      aria-label="Iconic Dubai Real Estate Landmark Slideshow"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onTouchStart={(e) => {
        touchStartX.current = e.touches[0]?.clientX ?? null;
      }}
      onTouchEnd={(e) => {
        const startX = touchStartX.current;
        const endX = e.changedTouches[0]?.clientX ?? null;
        touchStartX.current = null;
        if (startX !== null && endX !== null) {
          const dx = endX - startX;
          if (dx < -40) handleNext();
          else if (dx > 40) handlePrev();
        }
      }}
      className="relative overflow-hidden rounded-t-[22px] sm:rounded-t-3xl border border-b-0 border-white/80 bg-[#0b1623] shadow-[0_-24px_80px_rgba(12,56,96,0.22)]"
    >
      {/* Razor-Sharp 1920x1080 Photographic Slide Stage (Zero Video Blur!) */}
      <div className="relative h-[340px] sm:h-[490px] md:h-[600px] w-full overflow-hidden bg-[#091320]">
        <AnimatePresence initial={false} mode="sync">
          <motion.div
            key={current.id}
            initial={{ opacity: 0, scale: 1.055, x: direction * 24 }}
            animate={{ opacity: 1, scale: 1.0, x: 0 }}
            exit={{ opacity: 0, scale: 0.99 }}
            transition={{
              opacity: { duration: 0.72, ease: [0.22, 1, 0.36, 1] },
              x: { duration: 0.78, ease: [0.22, 1, 0.36, 1] },
              scale: { duration: 5.2, ease: "easeOut" },
            }}
            className="absolute inset-0"
          >
            <img
              src={current.image}
              alt={current.alt}
              fetchPriority={activeIdx === 0 ? "high" : "auto"}
              className="h-full w-full object-cover object-center"
            />
          </motion.div>
        </AnimatePresence>

        {/* Refined Editorial Contrast Scrims */}
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 z-10 bg-gradient-to-t from-[#060f1a]/92 via-[#060f1a]/22 to-[#060f1a]/36"
        />

        {/* Top Bar: Live Showcase Indicator + Prev / Play-Pause / Next Controls */}
        <div className="absolute inset-x-0 top-0 z-20 flex items-center justify-between gap-2 p-3.5 sm:p-6">
          <div className="inline-flex items-center gap-1.5 sm:gap-2 rounded-full border border-white/25 bg-[#08131f]/74 px-2.5 sm:px-3 py-1.5 backdrop-blur-xl whitespace-nowrap">
            <span className="relative flex h-2 w-2 shrink-0" aria-hidden="true">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-[#51fec0] opacity-75" />
              <span className="relative inline-flex h-2 w-2 rounded-full bg-[#51fec0]" />
            </span>
            <span className="font-mono text-[9.5px] sm:text-[10.5px] font-semibold uppercase tracking-[0.14em] sm:tracking-[0.16em] text-white">
              <span className="sm:hidden">DUBAI LANDMARKS</span>
              <span className="hidden sm:inline">DUBAI ICONIC LANDMARKS</span>
            </span>
            <span className="font-mono text-[9.5px] sm:text-[10px] text-[#51fec0]">
              · {String(activeIdx + 1).padStart(2, "0")}/{String(total).padStart(2, "0")}
            </span>
          </div>

          <div className="flex items-center gap-1.5 sm:gap-2">
            <button
              type="button"
              onClick={handlePrev}
              aria-label="Previous Dubai landmark slide"
              className="inline-flex h-8 w-8 sm:h-9 sm:w-9 cursor-pointer items-center justify-center rounded-full border border-white/28 bg-[#08131f]/72 text-white backdrop-blur-xl transition-all duration-200 hover:scale-105 hover:border-[#51fec0] hover:bg-[#51fec0] hover:text-[#08131f]"
            >
              <ArrowLeft className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
            </button>
            <button
              type="button"
              onClick={() => setIsPlaying((v) => !v)}
              aria-label={isPlaying ? "Pause landmark slideshow" : "Play landmark slideshow"}
              className="inline-flex h-8 w-8 sm:h-9 sm:w-9 cursor-pointer items-center justify-center rounded-full border border-white/28 bg-[#08131f]/72 text-white backdrop-blur-xl transition-all duration-200 hover:scale-105 hover:border-[#51fec0] hover:bg-[#51fec0] hover:text-[#08131f]"
            >
              {isPlaying ? <Pause className="h-3.5 w-3.5" /> : <Play className="h-3.5 w-3.5 translate-x-0.5" />}
            </button>
            <button
              type="button"
              onClick={handleNext}
              aria-label="Next Dubai landmark slide"
              className="inline-flex h-8 w-8 sm:h-9 sm:w-9 cursor-pointer items-center justify-center rounded-full border border-white/28 bg-[#08131f]/72 text-white backdrop-blur-xl transition-all duration-200 hover:scale-105 hover:border-[#51fec0] hover:bg-[#51fec0] hover:text-[#08131f]"
            >
              <ArrowRight className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
            </button>
          </div>
        </div>

        {/* Bottom Stage: Active Hot-Topic Headline + Interactive Floating Next-Slide Preview Cards */}
        <div className="absolute inset-x-0 bottom-0 z-20 px-4 pb-4 pt-10 sm:px-7 sm:pb-6 text-white">
          <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
            {/* Left: Animated Hot-Topic Dubai Real Estate Story */}
            <div className="min-w-0 max-w-xl">
              <AnimatePresence mode="wait">
                <motion.div
                  key={current.id}
                  initial={{ opacity: 0, y: 12 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -8 }}
                  transition={{ duration: 0.36, ease: [0.22, 1, 0.36, 1] }}
                >
                  <p className="inline-flex items-center gap-2 font-mono text-[9.5px] sm:text-[10.5px] font-semibold uppercase tracking-[0.18em] text-[#51fec0]">
                    <span className="h-1.5 w-1.5 rounded-[2px] bg-[#51fec0]" aria-hidden="true" />
                    <span className="truncate">{current.tag}</span>
                  </p>
                  <Link
                    href={current.href}
                    className="group mt-1.5 inline-flex items-start gap-2 text-[17px] sm:text-2xl md:text-[27px] font-medium leading-[1.15] tracking-[-0.025em] text-white transition-colors hover:text-[#51fec0]"
                  >
                    <span>{current.title}</span>
                    <ArrowUpRight className="mt-1 h-4 w-4 sm:h-5 sm:w-5 shrink-0 opacity-75 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5 group-hover:opacity-100" />
                  </Link>
                  <p className="mt-1 hidden sm:block text-xs text-white/80">
                    {current.hotTopic}
                  </p>
                </motion.div>
              </AnimatePresence>

              <div className="mt-3 sm:hidden">
                <Link
                  href="#dubai-launches"
                  className="inline-flex items-center gap-1.5 rounded-full border border-white/28 bg-white/14 px-3.5 py-1.5 text-[10px] font-semibold uppercase tracking-[0.14em] text-white backdrop-blur-md"
                >
                  <span>Explore Iconic Projects</span>
                  <ArrowDown className="h-3 w-3" />
                </Link>
              </div>
            </div>

            {/* Right (Desktop): Floating Interactive Next-Slide Preview Cards + Anchor CTA */}
            <div className="hidden lg:flex flex-col items-end gap-3 shrink-0">
              <div className="flex items-center gap-2.5">
                {upcomingCards.map((card, offset) => {
                  const targetIdx = (activeIdx + offset + 1) % total;
                  return (
                    <button
                      key={card.id}
                      type="button"
                      onClick={() => goTo(targetIdx, 1)}
                      className="group relative flex h-[76px] w-[142px] cursor-pointer overflow-hidden rounded-xl border border-white/30 bg-[#0b1623] text-left shadow-[0_14px_34px_rgba(0,0,0,0.42)] transition-all duration-300 hover:-translate-y-1 hover:border-[#51fec0] hover:shadow-[0_18px_40px_rgba(81,254,192,0.22)]"
                    >
                      <img
                        src={card.image}
                        alt={card.shortLabel}
                        loading="lazy"
                        className="absolute inset-0 h-full w-full object-cover transition-transform duration-500 group-hover:scale-110"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-[#060f1a]/90 via-[#060f1a]/25 to-transparent" />
                      <div className="relative z-10 mt-auto w-full px-2.5 pb-2">
                        <span className="block font-mono text-[8.5px] font-semibold uppercase tracking-[0.16em] text-[#51fec0]">
                          NEXT · {String(targetIdx + 1).padStart(2, "0")}
                        </span>
                        <span className="block truncate text-[11.5px] font-medium text-white">
                          {card.shortLabel}
                        </span>
                      </div>
                    </button>
                  );
                })}
              </div>

              <Link
                href="#dubai-launches"
                className="inline-flex items-center gap-1.5 rounded-full border border-white/25 bg-white/12 px-4 py-1.5 text-[11px] font-semibold uppercase tracking-[0.15em] text-white backdrop-blur-md transition-all hover:border-[#51fec0] hover:bg-[#51fec0] hover:text-[#08131f]"
              >
                <span>Explore Iconic Projects</span>
                <ArrowDown className="h-3.5 w-3.5" />
              </Link>
            </div>
          </div>

          {/* Interactive 8-Slide Animated Progress Bar */}
          <div
            className="mt-3.5 sm:mt-4 grid grid-cols-8 gap-1.5"
            role="tablist"
            aria-label="Select Dubai landmark slide"
          >
            {HERO_SLIDES.map((sl, idx) => {
              const isCurrent = idx === activeIdx;
              const isPast = idx < activeIdx;
              return (
                <button
                  key={sl.id}
                  type="button"
                  role="tab"
                  aria-selected={isCurrent}
                  aria-label={`Slide ${idx + 1}: ${sl.shortLabel}`}
                  onClick={() => goTo(idx)}
                  className="group relative h-3 cursor-pointer py-1 focus:outline-none"
                >
                  <span className="block h-[3px] w-full overflow-hidden rounded-full bg-white/25 transition-colors group-hover:bg-white/45">
                    {isCurrent ? (
                      <motion.span
                        key={`${sl.id}-${isPlaying && !isHovered ? "run" : "hold"}`}
                        initial={{ scaleX: 0 }}
                        animate={{ scaleX: isPlaying && !isHovered ? 1 : 0.45 }}
                        transition={
                          isPlaying && !isHovered
                            ? { duration: SLIDE_INTERVAL_MS / 1000, ease: "linear" }
                            : { duration: 0.2 }
                        }
                        style={{ transformOrigin: "0% 50%" }}
                        className="block h-full w-full rounded-full bg-[#51fec0]"
                      />
                    ) : (
                      <span
                        className="block h-full rounded-full bg-[#51fec0]/85 transition-all duration-300"
                        style={{ width: isPast ? "100%" : "0%" }}
                      />
                    )}
                  </span>
                </button>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
