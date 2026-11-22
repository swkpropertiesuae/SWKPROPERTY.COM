"use client";

import React, { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowLeft, ArrowRight, ArrowUpRight } from "lucide-react";

export interface SignatureDeckItem {
  slug: string;
  title: string;
  developer: string;
  community: string;
  kicker: string;
  summary: string;
  image: string;
  price: string;
  priceNote: string;
  tags: string[];
  href: string;
  accent?: string;
}

export function SignatureHorizontalDeck({
  items,
  className = "",
}: {
  items: SignatureDeckItem[];
  className?: string;
}) {
  const [activeIndex, setActiveIndex] = useState(0);
  const [hovered, setHovered] = useState(false);
  const [pageStart, setPageStart] = useState(0);
  const railRef = useRef<HTMLDivElement>(null);
  const pillRailRef = useRef<HTMLDivElement>(null);
  const programmaticScrollRef = useRef(false);

  const total = items.length;
  const WINDOW_SIZE = 5;

  const scrollMobileRailTo = (idx: number) => {
    const rail = railRef.current;
    if (!rail || rail.offsetParent === null) return;
    const child = rail.children[idx] as HTMLElement | undefined;
    if (!child) return;
    programmaticScrollRef.current = true;
    const targetLeft = child.offsetLeft - (rail.clientWidth - child.clientWidth) / 2;
    rail.scrollTo({ left: Math.max(0, targetLeft), behavior: "smooth" });
    window.setTimeout(() => {
      programmaticScrollRef.current = false;
    }, 450);
  };

  const selectIndex = (idx: number, syncRail = true) => {
    const wrapped = ((idx % total) + total) % total;
    setActiveIndex(wrapped);
    if (total > WINDOW_SIZE) {
      if (wrapped < pageStart) {
        setPageStart(wrapped);
      } else if (wrapped >= pageStart + WINDOW_SIZE) {
        setPageStart(Math.min(total - WINDOW_SIZE, wrapped - WINDOW_SIZE + 1));
      }
    }
    if (syncRail) {
      scrollMobileRailTo(wrapped);
    }
  };

  const handlePrev = () => selectIndex(activeIndex - 1);
  const handleNext = () => selectIndex(activeIndex + 1);

  // Sync mobile manual swipe back to activeIndex cleanly
  const handleMobileScroll = () => {
    if (programmaticScrollRef.current) return;
    const rail = railRef.current;
    if (!rail) return;
    const center = rail.scrollLeft + rail.clientWidth / 2;
    let bestIdx = activeIndex;
    let bestDist = Infinity;
    for (let i = 0; i < rail.children.length; i++) {
      const child = rail.children[i] as HTMLElement;
      const childCenter = child.offsetLeft + child.clientWidth / 2;
      const dist = Math.abs(childCenter - center);
      if (dist < bestDist) {
        bestDist = dist;
        bestIdx = i;
      }
    }
    if (bestIdx !== activeIndex) {
      setActiveIndex(bestIdx);
    }
  };

  // Gentle auto-advance on desktop (pauses while hovered or on touch mobile so user swipes smoothly)
  useEffect(() => {
    if (hovered || total <= 1) return;
    const isDesktop = typeof window !== "undefined" && window.matchMedia("(min-width: 1024px)").matches;
    if (!isDesktop) return;

    const timer = window.setInterval(() => {
      setActiveIndex((prev) => {
        const next = (prev + 1) % total;
        setPageStart((start) => {
          if (total <= WINDOW_SIZE) return 0;
          if (next < start) return next;
          if (next >= start + WINDOW_SIZE) return Math.min(total - WINDOW_SIZE, next - WINDOW_SIZE + 1);
          return start;
        });
        return next;
      });
    }, 6200);
    return () => window.clearInterval(timer);
  }, [hovered, total]);

  const visibleDesktopItems =
    total <= WINDOW_SIZE
      ? items.map((item, idx) => ({ item, idx }))
      : items.slice(pageStart, pageStart + WINDOW_SIZE).map((item, offset) => ({
          item,
          idx: pageStart + offset,
        }));

  const current = items[activeIndex] ?? items[0];

  if (total === 0) return null;

  return (
    <div
      className={`w-full ${className}`}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      onKeyDown={(e) => {
        if (e.key === "ArrowLeft") handlePrev();
        if (e.key === "ArrowRight") handleNext();
      }}
      tabIndex={0}
      role="region"
      aria-roledescription="carousel"
      aria-label="Signature Icons Horizontal Showcase"
    >
      {/* Top Synchronized Bar: Active Landmark Summary + Controls */}
      <div className="mb-4 sm:mb-5 flex items-center justify-between gap-3 rounded-2xl border border-white/85 bg-white/84 px-4 py-3 sm:px-5 sm:py-4 shadow-[0_14px_38px_rgba(12,56,96,0.08)] backdrop-blur-xl">
        <div className="flex min-w-0 items-center gap-2.5 sm:gap-3">
          <span className="inline-flex shrink-0 items-center gap-1.5 rounded-full bg-[#121212] px-2.5 py-1 sm:px-3 font-mono text-[10px] sm:text-[10.5px] font-semibold uppercase tracking-[0.14em] text-[#51fec0]">
            <span>{String(activeIndex + 1).padStart(2, "0")}</span>
            <span className="text-white/40">/</span>
            <span className="text-white/80">{String(total).padStart(2, "0")}</span>
          </span>
          <div className="min-w-0">
            <p className="truncate font-mono text-[9.5px] sm:text-[10px] font-semibold uppercase tracking-[0.16em] text-[#1b6aa7]">
              {current.kicker}
            </p>
            <p className="truncate text-xs sm:text-base font-medium text-[#121212]">
              {current.title} · <span className="text-[#0e9f6e]">{current.price}</span>
            </p>
          </div>
        </div>

        <div className="flex shrink-0 items-center gap-1.5 sm:gap-2">
          <button
            type="button"
            onClick={handlePrev}
            aria-label="Previous Signature Icon"
            className="inline-flex h-9 w-9 sm:h-10 sm:w-10 cursor-pointer items-center justify-center rounded-full border border-black/12 bg-white text-[#121212] shadow-xs transition-all duration-200 hover:-translate-y-0.5 hover:border-[#121212] hover:bg-[#121212] hover:text-white hover:shadow-md"
          >
            <ArrowLeft className="h-4 w-4" />
          </button>
          <button
            type="button"
            onClick={handleNext}
            aria-label="Next Signature Icon"
            className="inline-flex h-9 w-9 sm:h-10 sm:w-10 cursor-pointer items-center justify-center rounded-full border border-black/12 bg-white text-[#121212] shadow-xs transition-all duration-200 hover:-translate-y-0.5 hover:border-[#121212] hover:bg-[#121212] hover:text-white hover:shadow-md"
          >
            <ArrowRight className="h-4 w-4" />
          </button>
        </div>
      </div>

      {/* Desktop: 21st.dev Horizontal Spring-Expanding Interactive Architectural Deck */}
      <div className="hidden lg:flex h-[540px] w-full items-stretch gap-3.5">
        {visibleDesktopItems.map(({ item, idx }) => {
          const isActive = idx === activeIndex;
          return (
            <motion.article
              key={item.slug}
              layout
              onMouseEnter={() => selectIndex(idx, false)}
              onClick={() => selectIndex(idx, false)}
              animate={{
                flexGrow: isActive ? 4.4 : 1,
              }}
              transition={{
                type: "spring",
                stiffness: 230,
                damping: 28,
                mass: 0.85,
              }}
              className={`group relative min-w-0 cursor-pointer overflow-hidden rounded-[28px] border bg-[#091524] shadow-[0_24px_60px_rgba(8,22,38,0.22)] transition-colors duration-300 ${
                isActive ? "border-[#51fec0]/65" : "border-white/25 hover:border-white/55"
              }`}
              style={{ flexBasis: 0 }}
            >
              <img
                src={item.image}
                alt={`${item.title} by ${item.developer}`}
                loading={idx < 3 ? "eager" : "lazy"}
                className={`absolute inset-0 h-full w-full object-cover transition-transform duration-700 ease-out ${
                  isActive ? "scale-[1.03]" : "scale-105 brightness-75 group-hover:scale-100 group-hover:brightness-90"
                }`}
              />

              <div
                aria-hidden="true"
                className={`absolute inset-0 transition-opacity duration-500 ${
                  isActive
                    ? "bg-gradient-to-t from-[#050c16]/94 via-[#050c16]/32 to-[#050c16]/25"
                    : "bg-gradient-to-t from-[#050c16]/88 via-[#050c16]/45 to-[#050c16]/35"
                }`}
              />

              <div className="relative z-10 flex items-center justify-between gap-3 p-5 sm:p-6">
                <span
                  className={`inline-flex h-9 w-9 items-center justify-center rounded-full font-mono text-xs font-semibold backdrop-blur-md transition-all duration-300 ${
                    isActive
                      ? "bg-[#51fec0] text-[#091524] shadow-[0_0_24px_rgba(81,254,192,0.45)]"
                      : "border border-white/25 bg-[#08131f]/70 text-white"
                  }`}
                >
                  {String(idx + 1).padStart(2, "0")}
                </span>

                {isActive ? (
                  <span className="rounded-full border border-white/25 bg-[#08131f]/75 px-3.5 py-1.5 font-mono text-[10.5px] font-semibold uppercase tracking-[0.16em] text-white backdrop-blur-md">
                    {item.developer} · {item.community}
                  </span>
                ) : null}
              </div>

              {!isActive ? (
                <div className="absolute inset-x-0 bottom-6 z-10 flex flex-col items-center px-3 text-center text-white">
                  <span className="font-mono text-[10px] font-semibold uppercase tracking-[0.18em] text-[#51fec0]">
                    {item.developer.split(" ")[0]}
                  </span>
                  <h4 className="mt-1.5 line-clamp-2 text-sm font-medium leading-snug tracking-[-0.02em]">
                    {item.title}
                  </h4>
                </div>
              ) : null}

              {isActive ? (
                <motion.div
                  initial={{ opacity: 0, y: 14 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.32, ease: [0.22, 1, 0.36, 1] }}
                  className="absolute inset-x-0 bottom-0 z-10 p-6 sm:p-8 text-white"
                >
                  <div className="flex flex-wrap items-end justify-between gap-6">
                    <div className="max-w-lg">
                      <h4 className="text-3xl xl:text-[38px] font-medium leading-[1.04] tracking-[-0.035em] text-white">
                        {item.title}
                      </h4>
                      <p className="mt-2.5 line-clamp-2 text-sm leading-relaxed text-white/85">
                        {item.summary}
                      </p>
                      {item.tags.length > 0 ? (
                        <div className="mt-4 flex flex-wrap gap-2">
                          {item.tags.slice(0, 3).map((tag) => (
                            <span
                              key={tag}
                              className="inline-flex items-center gap-1.5 rounded-full border border-white/20 bg-black/35 px-3 py-1 text-[11px] font-medium text-white/90 backdrop-blur-md"
                            >
                              <span
                                className="h-1.5 w-1.5 rounded-full"
                                style={{ backgroundColor: item.accent ?? "#51fec0" }}
                              />
                              {tag}
                            </span>
                          ))}
                        </div>
                      ) : null}
                    </div>

                    <div className="flex flex-col items-start sm:items-end gap-3 shrink-0">
                      <div className="text-left sm:text-right">
                        <p className="text-2xl font-semibold tracking-[-0.03em] text-white">
                          {item.price}
                        </p>
                        <p className="mt-0.5 font-mono text-[10px] uppercase tracking-[0.16em] text-white/70">
                          {item.priceNote}
                        </p>
                      </div>
                      <Link
                        href={item.href}
                        onClick={(e) => e.stopPropagation()}
                        className="inline-flex items-center gap-2 rounded-full bg-[#51fec0] px-5 py-2.5 text-xs font-semibold uppercase tracking-[0.14em] text-[#091524] shadow-[0_12px_28px_rgba(81,254,192,0.38)] transition-all duration-200 hover:-translate-y-0.5 hover:bg-white hover:shadow-lg"
                      >
                        <span>Explore Residence</span>
                        <ArrowUpRight className="h-4 w-4" />
                      </Link>
                    </div>
                  </div>
                </motion.div>
              ) : null}
            </motion.article>
          );
        })}
      </div>

      {/* Tablet & Mobile: Synchronized Horizontal Snap-Scroll Architectural Cards */}
      <div
        ref={railRef}
        onScroll={handleMobileScroll}
        className="flex lg:hidden gap-3.5 overflow-x-auto pb-2.5 snap-x snap-mandatory scroll-smooth [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
      >
        {items.map((item, idx) => {
          const isSelected = idx === activeIndex;
          return (
            <Link
              key={item.slug}
              href={item.href}
              className={`relative flex h-[395px] sm:h-[430px] w-[85vw] max-w-[355px] shrink-0 snap-center flex-col justify-between overflow-hidden rounded-[24px] border bg-[#091524] text-white shadow-xl transition-all duration-300 ${
                isSelected ? "border-[#51fec0]/75 scale-100" : "border-white/25 scale-[0.98] opacity-90"
              }`}
            >
              <img
                src={item.image}
                alt={`${item.title} by ${item.developer}`}
                loading="lazy"
                className="absolute inset-0 h-full w-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#050c16]/95 via-[#050c16]/35 to-[#050c16]/30" />
              <div className="relative z-10 flex items-center justify-between gap-2 p-4">
                <span className="inline-flex h-8 w-8 items-center justify-center rounded-full bg-[#51fec0] font-mono text-xs font-semibold text-[#091524]">
                  {String(idx + 1).padStart(2, "0")}
                </span>
                <span className="truncate rounded-full border border-white/25 bg-[#08131f]/75 px-3 py-1 font-mono text-[9.5px] font-semibold uppercase tracking-[0.14em] text-white backdrop-blur-md">
                  {item.developer}
                </span>
              </div>
              <div className="relative z-10 p-4">
                <p className="truncate font-mono text-[9.5px] uppercase tracking-[0.16em] text-[#51fec0]">
                  {item.community}
                </p>
                <h4 className="mt-1 text-xl font-medium leading-tight tracking-[-0.025em]">
                  {item.title}
                </h4>
                <p className="mt-1.5 line-clamp-2 text-xs leading-relaxed text-white/82">
                  {item.summary}
                </p>
                <div className="mt-3.5 flex items-center justify-between gap-2 border-t border-white/15 pt-3">
                  <div>
                    <span className="block text-sm font-semibold">{item.price}</span>
                    <span className="block font-mono text-[9.5px] text-white/65">{item.priceNote}</span>
                  </div>
                  <span className="inline-flex shrink-0 items-center gap-1 rounded-full bg-[#51fec0] px-3.5 py-1.5 text-[10.5px] font-semibold uppercase tracking-[0.12em] text-[#091524]">
                    Explore <ArrowUpRight className="h-3.5 w-3.5" />
                  </span>
                </div>
              </div>
            </Link>
          );
        })}
      </div>

      {/* Bottom Interactive Selector Pills (Horizontal Swipe Rail on Mobile, Wrapped on Desktop) */}
      <div
        ref={pillRailRef}
        className="mt-4 sm:mt-5 flex flex-nowrap sm:flex-wrap items-center justify-start sm:justify-center gap-2 overflow-x-auto pb-1 [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
      >
        {items.map((item, idx) => {
          const isSelected = idx === activeIndex;
          return (
            <button
              key={item.slug}
              type="button"
              onClick={() => selectIndex(idx)}
              className={`shrink-0 cursor-pointer rounded-full px-3.5 py-1.5 text-[11px] font-medium transition-all duration-200 sm:hover:-translate-y-0.5 ${
                isSelected
                  ? "bg-[#121212] text-white shadow-md"
                  : "border border-white/85 bg-white/80 text-[#334155] backdrop-blur-md hover:border-[#121212] hover:bg-white hover:text-[#121212]"
              }`}
            >
              <span className="mr-1.5 font-mono text-[10px] opacity-65">
                {String(idx + 1).padStart(2, "0")}
              </span>
              {item.title}
            </button>
          );
        })}
      </div>
    </div>
  );
}
