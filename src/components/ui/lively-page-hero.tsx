"use client";

import React from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowRight, ArrowUpRight, MapPin, ShieldCheck, Sparkles } from "lucide-react";

export interface LivelyPageHeroHighlight {
  title: string;
  subtitle: string;
  tag: string;
  image: string;
  href?: string;
}

export interface LivelyPageHeroSideImage {
  src: string;
  label: string;
  sublabel: string;
  href?: string;
}

export interface LivelyPageHeroProps {
  eyebrow?: string;
  badge?: string;
  title: string;
  accentText?: string;
  highlight?: string;
  description: string;
  backgroundImage: string;
  primaryCta?: {
    label: string;
    href: string;
  };
  secondaryCta?: {
    label: string;
    href: string;
  };
  highlights?: LivelyPageHeroHighlight[];
  sideImages?: LivelyPageHeroSideImage[];
}

const DEFAULT_HIGHLIGHTS: LivelyPageHeroHighlight[] = [
  {
    title: "Palm Jebel Ali & Como Residences",
    subtitle: "Nakheel island villas & Palm Jumeirah branded tower",
    tag: "Nakheel",
    image: "/img/hero/slides/p-palm-jebel-ali-card.webp",
    href: "/off-plan/palm-jebel-ali",
  },
  {
    title: "Creek Haven & Rashid Yachts",
    subtitle: "Emaar waterfront living on the Creek and at Mina Rashid",
    tag: "Emaar",
    image: "/img/hero/slides/p-creek-haven-card.webp",
    href: "/off-plan/creek-haven",
  },
  {
    title: "Bugatti Residences & Burj Binghatti",
    subtitle: "Branded hyper-luxury towers in Business Bay",
    tag: "Binghatti",
    image: "/img/hero/slides/p-bugatti-residences-card.webp",
    href: "/off-plan/bugatti-residences-by-binghatti",
  },
];

export function LivelyPageHero({
  eyebrow,
  badge,
  title,
  accentText,
  highlight,
  description,
  backgroundImage,
  primaryCta,
  secondaryCta,
  highlights,
  sideImages,
}: LivelyPageHeroProps) {
  const resolvedEyebrow = eyebrow || badge || "SWK Properties · Sheikh Zayed Road";
  const resolvedAccent = accentText || highlight;
  const resolvedHighlights: LivelyPageHeroHighlight[] =
    highlights ||
    (sideImages && sideImages.length > 0
      ? [
          ...sideImages.map((s) => ({
            title: s.label,
            subtitle: s.sublabel,
            tag: "SWK",
            image: s.src,
            href: s.href ?? "/off-plan",
          })),
          DEFAULT_HIGHLIGHTS[0],
        ]
      : DEFAULT_HIGHLIGHTS);

  const handlePointerMove = (e: React.PointerEvent<HTMLElement>) => {
    const el = e.currentTarget;
    const rect = el.getBoundingClientRect();
    el.style.setProperty("--spot-x", `${e.clientX - rect.left}px`);
    el.style.setProperty("--spot-y", `${e.clientY - rect.top}px`);
  };

  return (
    <section
      onPointerMove={handlePointerMove}
      className="relative overflow-hidden border-b border-[#e6dfd2] bg-[#0e0b08] py-14 sm:py-18 md:py-22 text-white"
    >
      {/* 1. Crystal-Clear Ken Burns Full-Color Architectural Backdrop */}
      <div className="pointer-events-none absolute inset-0 z-0 overflow-hidden">
        <img
          src={backgroundImage}
          alt={title}
          loading="eager"
          decoding="sync"
          onError={(e) => {
            const target = e.currentTarget;
            const fallback = "/img/hero/slides/01-dubai-horizon-desktop.webp";
            if (!target.src.endsWith(fallback)) {
              target.src = fallback;
            }
          }}
          className="h-full w-full object-cover object-center transition-transform duration-1000 ease-out"
        />
        {/* Balanced High-Clarity Architectural Vignette */}
        <div
          className="absolute inset-0"
          style={{
            background:
              "linear-gradient(90deg, rgba(12,10,7,0.38) 0%, rgba(12,10,7,0.12) 45%, transparent 70%)",
          }}
        />
        <div
          className="absolute inset-0"
          style={{
            background:
              "linear-gradient(180deg, rgba(12,10,7,0.22) 0%, transparent 25%, transparent 75%, rgba(12,10,7,0.3) 100%)",
          }}
        />
      </div>

      {/* 2. High-Contrast Highlighted Foreground Stage */}
      <div className="relative z-10 mx-auto max-w-7xl px-4 md:px-6">
        <div className="grid grid-cols-1 items-center gap-8 lg:grid-cols-12">
          {/* Left Column: Highlighted Editorial Spotlight Panel */}
          <motion.div
            initial={{ opacity: 1, y: 0 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
            onPointerMove={handlePointerMove}
            style={{
              backgroundImage:
                "radial-gradient(320px circle at var(--spot-x, 50%) var(--spot-y, 15%), rgba(255,251,238,0.22) 0%, rgba(255,255,255,0.05) 48%, transparent 80%), linear-gradient(160deg, rgba(34,27,19,0.88) 0%, rgba(15,12,9,0.92) 100%)",
            }}
            className="lg:col-span-7 rounded-3xl border border-white/40 p-6 sm:p-8 md:p-9 backdrop-blur-xl shadow-[0_24px_60px_rgba(0,0,0,0.44),inset_0_1.5px_0_rgba(255,255,255,0.5)] transition-all duration-300 hover:border-white/60 space-y-5"
          >
            <div className="inline-flex items-center gap-2.5 rounded-full border border-white/45 bg-[radial-gradient(120%_140%_at_50%_0%,rgba(255,252,240,0.25)_0%,rgba(23,19,14,0.95)_70%)] px-4 py-1.5 text-[11px] font-bold uppercase tracking-[0.2em] text-white shadow-[0_8px_20px_rgba(0,0,0,0.28),inset_0_1px_0_rgba(255,255,255,0.4)]">
              <Sparkles className="h-3.5 w-3.5 text-white" />
              <span>{resolvedEyebrow}</span>
            </div>

            <h1 className="font-hero-raleway font-light text-2xl sm:text-4xl md:text-5xl uppercase tracking-[0.07em] text-white leading-[1.18]">
              <span className="block drop-shadow-[0_2px_10px_rgba(0,0,0,0.5)]">
                {title}
              </span>
              {resolvedAccent && (
                <span className="mt-2 inline-block rounded-2xl border border-white/45 bg-[radial-gradient(130%_150%_at_30%_0%,rgba(255,252,240,0.26)_0%,rgba(60,47,31,0.96)_50%,rgba(23,19,14,0.98)_100%)] px-4 py-1.5 font-bold tracking-[0.06em] text-white shadow-[0_12px_28px_rgba(0,0,0,0.38),inset_0_1px_0_rgba(255,255,255,0.45)]">
                  {resolvedAccent}
                </span>
              )}
            </h1>

            <p className="max-w-2xl text-sm md:text-base text-white/95 font-normal leading-relaxed">
              {description}
            </p>

            {/* Highlighted Live KPI Pills */}
            <div className="flex flex-wrap items-center gap-2 pt-1">
              {[
                "18+ Years UAE Experience",
                "27+ Master Developers",
                "108+ Verified Projects",
                "25+ Professionals",
              ].map((kpi) => (
                <span
                  key={kpi}
                  className="inline-flex items-center gap-1.5 rounded-full border border-white/35 bg-white/14 px-3.5 py-1 text-[11px] font-semibold text-white shadow-[inset_0_1px_0_rgba(255,255,255,0.3)] transition-all duration-200 hover:-translate-y-0.5 hover:border-white/65 hover:bg-white/22"
                >
                  <ShieldCheck className="h-3.5 w-3.5 text-white" />
                  {kpi}
                </span>
              ))}
            </div>

            {(primaryCta || secondaryCta) && (
              <div className="flex flex-wrap items-center gap-3 pt-2">
                {primaryCta && (
                  <Link
                    href={primaryCta.href}
                    className="group inline-flex items-center gap-2 rounded-full border border-white/50 bg-[radial-gradient(120%_150%_at_50%_0%,rgba(255,252,240,0.28)_0%,rgba(23,19,14,0.98)_65%)] px-6 py-3.5 text-xs font-bold uppercase tracking-[0.16em] text-white shadow-[0_12px_28px_rgba(0,0,0,0.38),inset_0_1px_0_rgba(255,255,255,0.45)] transition-all duration-300 hover:-translate-y-0.5 hover:scale-[1.02] hover:border-white hover:shadow-[0_16px_34px_rgba(0,0,0,0.45),0_0_24px_rgba(255,252,240,0.28)]"
                  >
                    <span>{primaryCta.label}</span>
                    <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                  </Link>
                )}
                {secondaryCta && (
                  <Link
                    href={secondaryCta.href}
                    className="inline-flex items-center gap-2 rounded-full border border-white bg-white px-6 py-3.5 text-xs font-bold uppercase tracking-[0.16em] text-[#17130e] shadow-xl transition-all duration-300 hover:-translate-y-0.5 hover:scale-[1.02] hover:bg-[#f4efe6] hover:shadow-[0_16px_34px_rgba(0,0,0,0.38),0_0_24px_rgba(255,255,255,0.35)]"
                  >
                    <span>{secondaryCta.label}</span>
                    <ArrowUpRight className="h-4 w-4" />
                  </Link>
                )}
              </div>
            )}
          </motion.div>

          {/* Right Column: Animated Floating Architectural Showcase Cards with Natural-Light Spotlight */}
          <div className="lg:col-span-5">
            <motion.div
              initial={{ opacity: 1, x: 0 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.55, delay: 0.12, ease: [0.22, 1, 0.36, 1] }}
              onPointerMove={handlePointerMove}
              style={{
                backgroundImage:
                  "radial-gradient(280px circle at var(--spot-x, 50%) var(--spot-y, 12%), rgba(255,251,238,0.24) 0%, rgba(255,255,255,0.06) 48%, transparent 80%), linear-gradient(165deg, rgba(46,36,25,0.92) 0%, rgba(30,24,17,0.95) 100%)",
              }}
              className="rounded-3xl border border-white/42 p-5 backdrop-blur-xl shadow-[0_24px_60px_rgba(0,0,0,0.48),inset_0_1.5px_0_rgba(255,255,255,0.55)] transition-all duration-300 hover:-translate-y-1 hover:border-white/68"
            >
              <div className="mb-3.5 flex items-center justify-between border-b border-white/20 pb-3">
                <span className="inline-flex items-center gap-1.5 text-[11px] font-bold uppercase tracking-[0.2em] text-white">
                  <MapPin className="h-3.5 w-3.5 text-white" />
                  Priority UAE Allocations
                </span>
                <span className="rounded-full border border-white/30 bg-white/15 px-3 py-0.5 text-[10px] font-bold uppercase tracking-wider text-white">
                  Live Desk
                </span>
              </div>

              <div className="space-y-3">
                {resolvedHighlights.map((item, idx) => (
                  <motion.div
                    key={item.title + idx}
                    initial={{ opacity: 1, y: 0 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.4, delay: 0.18 + idx * 0.08 }}
                    whileHover={{ x: 4 }}
                  >
                    <Link
                      href={item.href ?? "/off-plan"}
                      className="group flex items-center gap-3.5 rounded-2xl border border-white/20 bg-white/12 p-3 transition hover:border-white/50 hover:bg-white/20"
                    >
                      <img
                        src={item.image}
                        alt={item.title}
                        loading="eager"
                        decoding="sync"
                        onError={(e) => {
                          const target = e.currentTarget;
                          const fallback = "/img/hero/slides/01-dubai-horizon-thumb.webp";
                          if (!target.src.endsWith(fallback)) {
                            target.src = fallback;
                          }
                        }}
                        className="h-14 w-16 shrink-0 rounded-xl object-cover border border-white/30"
                      />
                      <div className="min-w-0 flex-1">
                        <div className="flex items-center justify-between gap-2">
                          <p className="truncate font-serif text-base font-bold text-white">
                            {item.title}
                          </p>
                          <span className="shrink-0 rounded-full bg-[#17130e] border border-white/35 px-2.5 py-0.5 text-[9.5px] font-bold uppercase tracking-wider text-white">
                            {item.tag}
                          </span>
                        </div>
                        <p className="mt-0.5 truncate text-xs font-medium text-white/90">
                          {item.subtitle}
                        </p>
                      </div>
                    </Link>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    </section>
  );
}
