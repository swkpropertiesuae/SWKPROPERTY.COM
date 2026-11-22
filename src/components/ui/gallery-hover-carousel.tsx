"use client";

import React, { useCallback, useEffect, useRef, useState } from "react";
import Link from "next/link";
import { ArrowRight, ChevronLeft, ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";

/**
 * 21st.dev Gallery Hover Carousel (@ruixen.ui/gallery-hover-carousel)
 * Full-bleed architectural photography cards that smoothly collapse to the top half on hover,
 * revealing a luminous frosted-glass dossier panel with developer, community, summary & rotating arrow.
 */
export interface GalleryHoverCarouselItem {
  id: string;
  title: string;
  developer: string;
  community: string;
  summary: string;
  url: string;
  image: string;
  badge?: string;
  tags?: string[];
  isRender?: boolean;
}

export function GalleryHoverCarousel({
  items,
  ariaLabel = "Featured Dubai Developer Projects",
  className,
}: {
  items: GalleryHoverCarouselItem[];
  ariaLabel?: string;
  className?: string;
}) {
  const scrollerRef = useRef<HTMLDivElement>(null);
  const [canPrev, setCanPrev] = useState(false);
  const [canNext, setCanNext] = useState(true);
  const [progress, setProgress] = useState(0);

  const updateScroll = useCallback(() => {
    const el = scrollerRef.current;
    if (!el) return;
    const maxScroll = Math.max(el.scrollWidth - el.clientWidth, 1);
    setCanPrev(el.scrollLeft > 8);
    setCanNext(el.scrollLeft < maxScroll - 8);
    setProgress(Math.min(1, Math.max(0, el.scrollLeft / maxScroll)));
  }, []);

  useEffect(() => {
    const el = scrollerRef.current;
    if (!el) return;
    el.scrollTo({ left: 0, behavior: "auto" });
    updateScroll();
    window.addEventListener("resize", updateScroll);
    return () => window.removeEventListener("resize", updateScroll);
  }, [items, updateScroll]);

  const scrollByStep = (dir: -1 | 1) => {
    const el = scrollerRef.current;
    if (!el) return;
    const step = Math.max(330, Math.floor(el.clientWidth * 0.78));
    el.scrollBy({ left: dir * step, behavior: "smooth" });
  };

  return (
    <div className={cn("relative", className)} role="region" aria-label={ariaLabel}>
      {/* Controls & Progress Header */}
      <div className="mb-6 flex items-center justify-between gap-4">
        <div className="flex items-center gap-3 flex-1 max-w-[300px]">
          <div className="h-[3px] flex-1 overflow-hidden rounded-full bg-[#0b1f33]/12">
            <div
              className="h-full rounded-full bg-[#121212] transition-all duration-300"
              style={{ width: `${Math.max(20, Math.round(progress * 100))}%` }}
            />
          </div>
          <span className="font-mono text-[11px] font-medium text-[#121212]/65 tabular-nums">
            HOVER CARD TO EXPAND
          </span>
        </div>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => scrollByStep(-1)}
            disabled={!canPrev}
            aria-label="Previous developer projects"
            className="inline-flex h-10 w-10 cursor-pointer items-center justify-center rounded-full border border-white/80 bg-white/85 text-[#121212] shadow-[0_8px_24px_rgba(12,56,96,0.1)] backdrop-blur-xl transition-all hover:bg-[#121212] hover:text-white hover:border-[#121212] disabled:cursor-not-allowed disabled:opacity-35"
          >
            <ChevronLeft className="h-4 w-4" />
          </button>
          <button
            type="button"
            onClick={() => scrollByStep(1)}
            disabled={!canNext}
            aria-label="Next developer projects"
            className="inline-flex h-10 w-10 cursor-pointer items-center justify-center rounded-full border border-white/80 bg-white/85 text-[#121212] shadow-[0_8px_24px_rgba(12,56,96,0.1)] backdrop-blur-xl transition-all hover:bg-[#121212] hover:text-white hover:border-[#121212] disabled:cursor-not-allowed disabled:opacity-35"
          >
            <ChevronRight className="h-4 w-4" />
          </button>
        </div>
      </div>

      {/* Horizontal Carousel Track */}
      <div
        ref={scrollerRef}
        onScroll={updateScroll}
        className="flex gap-6 overflow-x-auto pb-4 snap-x snap-mandatory scroll-smooth [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
      >
        {items.map((item) => (
          <div
            key={item.id}
            className="w-[84vw] sm:w-[370px] lg:w-[390px] shrink-0 snap-start"
          >
            <Link
              href={item.url}
              className="group relative block h-[400px] sm:h-[430px] w-full overflow-hidden rounded-3xl border border-white/80 bg-white/85 shadow-[0_20px_54px_rgba(12,56,96,0.12)] backdrop-blur-xl transition-all duration-500 hover:shadow-[0_28px_72px_rgba(12,56,96,0.2)]"
            >
              {/* Full-Bleed Architectural Image — Smoothly Collapses to Top Half on Hover */}
              <div className="relative h-full w-full overflow-hidden transition-all duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:h-[52%]">
                <img
                  src={item.image}
                  alt={`${item.title} by ${item.developer}`}
                  loading="lazy"
                  className="h-full w-full object-cover object-center transition-transform duration-700 ease-out group-hover:scale-105"
                />

                {/* Top Badge Overlay */}
                <div className="absolute top-4 left-4 right-4 flex items-center justify-between gap-2">
                  <span className="inline-flex items-center gap-1.5 rounded-full bg-[#0b1623]/80 px-3 py-1 text-[10px] font-medium uppercase tracking-[0.16em] text-white backdrop-blur-md">
                    <span className="h-1.5 w-1.5 rounded-[2px] bg-[#51fec0]" aria-hidden="true" />
                    {item.badge ?? "Premier Launch"}
                  </span>
                  {item.isRender !== false ? (
                    <span className="rounded-full bg-white/88 px-2.5 py-0.5 text-[10px] font-medium text-[#121212] backdrop-blur-md">
                      Architectural Visual
                    </span>
                  ) : null}
                </div>

                {/* Resting Bottom Scrim & Floating Editorial Title (fades out as hover panel rises) */}
                <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-[#08131f]/90 via-[#08131f]/45 to-transparent p-6 pt-16 text-white transition-opacity duration-300 group-hover:opacity-0">
                  <p className="text-[10.5px] font-medium uppercase tracking-[0.2em] text-[#51fec0]">
                    {item.developer} · {item.community}
                  </p>
                  <h3 className="mt-1.5 text-[23px] font-medium leading-tight tracking-[-0.03em] text-white">
                    {item.title}
                  </h3>
                </div>

                {/* Soft Hover Bottom Edge Fade */}
                <div className="pointer-events-none absolute inset-x-0 bottom-0 h-16 bg-gradient-to-t from-black/45 to-transparent opacity-0 transition-opacity duration-500 group-hover:opacity-100" />
              </div>

              {/* Hover Reveal Panel (Bottom 48%) — Luminous Frosted Glass Dossier */}
              <div className="absolute inset-x-0 bottom-0 flex h-[48%] flex-col justify-between bg-white/96 px-6 py-5 backdrop-blur-xl transition-all duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] translate-y-6 opacity-0 group-hover:translate-y-0 group-hover:opacity-100">
                <div>
                  <div className="flex items-center justify-between gap-2 text-[10.5px] font-semibold uppercase tracking-[0.16em] text-[#0e9f6e]">
                    <span className="truncate">{item.developer}</span>
                    <span className="truncate text-[#64748b] font-medium">{item.community}</span>
                  </div>
                  <h3 className="mt-1.5 text-[20px] font-medium leading-tight tracking-[-0.03em] text-[#121212]">
                    {item.title}
                  </h3>
                  <p className="mt-2 line-clamp-2 text-[13px] leading-relaxed text-[#4b5563]">
                    {item.summary}
                  </p>
                </div>

                <div className="flex items-center justify-between gap-3 pt-2 border-t border-black/[0.06]">
                  <div className="flex flex-wrap gap-1.5">
                    {(item.tags ?? []).slice(0, 2).map((tag) => (
                      <span
                        key={tag}
                        className="rounded-full bg-[#eef6fb] px-2.5 py-0.5 text-[10px] font-medium text-[#1b5a8a]"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                  <span
                    aria-hidden="true"
                    className="inline-flex h-9 w-9 shrink-0 items-center justify-center rounded-full border border-black/12 bg-white text-[#121212] transition-all duration-500 group-hover:-rotate-45 group-hover:border-[#121212] group-hover:bg-[#121212] group-hover:text-[#51fec0]"
                  >
                    <ArrowRight className="h-4 w-4" />
                  </span>
                </div>
              </div>
            </Link>
          </div>
        ))}
      </div>
    </div>
  );
}

export default GalleryHoverCarousel;
