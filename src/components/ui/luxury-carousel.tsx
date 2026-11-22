"use client";

import React, { useCallback, useEffect, useRef, useState } from "react";
import Link from "next/link";
import { ArrowLeft, ArrowRight, ArrowUpRight } from "lucide-react";
import { cn } from "@/lib/utils";
import { SpotlightCard } from "@/components/ui/spotlight-card";

export interface LuxuryCarouselItem {
  id: string;
  title: string;
  developer: string;
  community: string;
  summary: string;
  image: string;
  href: string;
  tags: string[];
  badge?: string;
  isRender?: boolean;
}

/**
 * 21st.dev-inspired Architectural Property Carousel
 * Smooth snap-scroll showcase with keyboard/arrow navigation, active index telemetry,
 * and SpotlightCard luxury hover elevation.
 */
export function LuxuryProjectCarousel({
  items,
  ariaLabel = "Featured Dubai Developer Projects Carousel",
  className,
}: {
  items: LuxuryCarouselItem[];
  ariaLabel?: string;
  className?: string;
}) {
  const scrollerRef = useRef<HTMLDivElement>(null);
  const [canPrev, setCanPrev] = useState(false);
  const [canNext, setCanNext] = useState(true);
  const [progress, setProgress] = useState(0);

  const updateScrollState = useCallback(() => {
    const el = scrollerRef.current;
    if (!el) return;
    const maxScroll = Math.max(el.scrollWidth - el.clientWidth, 1);
    setCanPrev(el.scrollLeft > 8);
    setCanNext(el.scrollLeft < maxScroll - 8);
    setProgress(Math.min(1, Math.max(0, el.scrollLeft / maxScroll)));
  }, []);

  useEffect(() => {
    updateScrollState();
    const el = scrollerRef.current;
    if (!el) return;
    el.scrollTo({ left: 0, behavior: "auto" });
    const onResize = () => updateScrollState();
    window.addEventListener("resize", onResize);
    return () => window.removeEventListener("resize", onResize);
  }, [items, updateScrollState]);

  const scrollByCard = (dir: -1 | 1) => {
    const el = scrollerRef.current;
    if (!el) return;
    const step = Math.max(320, Math.floor(el.clientWidth * 0.78));
    el.scrollBy({ left: dir * step, behavior: "smooth" });
  };

  return (
    <div className={cn("relative", className)} role="region" aria-label={ariaLabel}>
      {/* Carousel Controls Bar */}
      <div className="mb-5 flex items-center justify-between gap-4">
        <div className="h-[2px] flex-1 max-w-[260px] overflow-hidden rounded-full bg-black/[0.08]">
          <div
            className="h-full bg-[#121212] transition-all duration-300"
            style={{ width: `${Math.max(18, Math.round(progress * 100))}%` }}
          />
        </div>
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => scrollByCard(-1)}
            disabled={!canPrev}
            aria-label="Previous projects"
            className="inline-flex h-10 w-10 cursor-pointer items-center justify-center rounded-full border border-black/12 bg-white text-[#121212] transition-all hover:border-[#121212] hover:bg-[#121212] hover:text-white disabled:cursor-not-allowed disabled:opacity-35"
          >
            <ArrowLeft className="h-4 w-4" />
          </button>
          <button
            type="button"
            onClick={() => scrollByCard(1)}
            disabled={!canNext}
            aria-label="Next projects"
            className="inline-flex h-10 w-10 cursor-pointer items-center justify-center rounded-full border border-black/12 bg-white text-[#121212] transition-all hover:border-[#121212] hover:bg-[#121212] hover:text-white disabled:cursor-not-allowed disabled:opacity-35"
          >
            <ArrowRight className="h-4 w-4" />
          </button>
        </div>
      </div>

      {/* Horizontal Snap Track */}
      <div
        ref={scrollerRef}
        onScroll={updateScrollState}
        className="flex gap-6 overflow-x-auto pb-4 snap-x snap-mandatory scroll-smooth [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
      >
        {items.map((item) => (
          <div
            key={item.id}
            className="w-[86vw] sm:w-[400px] lg:w-[410px] shrink-0 snap-start"
          >
            <SpotlightCard className="h-full flex flex-col">
              <Link href={item.href} className="group flex h-full flex-col">
                <div className="relative aspect-[16/10] w-full overflow-hidden bg-[#ececec]">
                  <img
                    src={item.image}
                    alt={`${item.title} by ${item.developer}`}
                    loading="lazy"
                    className="h-full w-full object-cover transition-transform duration-700 ease-out group-hover:scale-[1.04]"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#121212]/45 via-transparent to-transparent opacity-60 transition-opacity duration-300 group-hover:opacity-40" />
                  <div className="absolute top-3.5 left-3.5 flex items-center gap-1.5">
                    <span className="inline-flex items-center gap-1.5 rounded-full bg-[#121212]/82 px-3 py-1 text-[10px] font-medium uppercase tracking-[0.16em] text-white backdrop-blur-md">
                      <span className="h-1.5 w-1.5 rounded-[2px] bg-[#51fec0]" aria-hidden="true" />
                      {item.badge ?? "Featured Release"}
                    </span>
                  </div>
                  {item.isRender !== false ? (
                    <span className="absolute bottom-3 right-3 rounded-full bg-white/92 px-2.5 py-0.5 text-[10px] font-medium text-[#121212] backdrop-blur-md">
                      Architectural Visual
                    </span>
                  ) : null}
                </div>

                <div className="flex flex-1 flex-col justify-between p-6">
                  <div>
                    <div className="flex items-center justify-between gap-2 text-[11px] font-medium uppercase tracking-[0.16em] text-[#8b8b8b]">
                      <span className="truncate font-semibold text-[#121212]">{item.developer}</span>
                      <span className="shrink-0 truncate max-w-[55%]">{item.community}</span>
                    </div>
                    <h3 className="mt-2.5 text-[22px] font-medium leading-tight tracking-[-0.03em] text-[#121212] group-hover:text-[#0e9f6e] transition-colors">
                      {item.title}
                    </h3>
                    <p className="mt-2.5 line-clamp-2 text-xs leading-relaxed text-[#666666]">
                      {item.summary}
                    </p>
                  </div>

                  <div className="mt-5 flex items-center justify-between gap-3 border-t border-black/[0.06] pt-4">
                    <div className="flex flex-wrap gap-1.5">
                      {item.tags.slice(0, 2).map((tag) => (
                        <span
                          key={tag}
                          className="rounded-full bg-[#f5f5f5] px-2.5 py-1 text-[10px] font-medium text-[#525252]"
                        >
                          {tag}
                        </span>
                      ))}
                    </div>
                    <span className="inline-flex shrink-0 items-center gap-1 text-xs font-medium text-[#121212] group-hover:text-[#0e9f6e]">
                      <span>Explore</span>
                      <ArrowUpRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                    </span>
                  </div>
                </div>
              </Link>
            </SpotlightCard>
          </div>
        ))}
      </div>
    </div>
  );
}
