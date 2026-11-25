"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import {
  ArrowUpRight,
  Building2,
  Compass,
  Crown,
  Landmark,
  Waves,
} from "lucide-react";
import { cn } from "@/lib/utils";

/**
 * 21st.dev Interactive Selector
 * Staggered-entry architectural corridor selector with frosted-glass icon medallions,
 * smooth flex expansion on click/hover, mobile-visible collapsed titles, and direct CTA.
 */

export interface SelectorOption {
  title: string;
  description: string;
  image: string;
  href: string;
  icon: React.ReactNode;
}

const DEFAULT_OPTIONS: SelectorOption[] = [
  {
    title: "Island Waterfront Estates",
    description: "Nakheel Jumeirah Park & private coastal villas",
    image: "/img/projects/nakheel/jumeirah-park.webp",
    href: "/off-plan/jumeirah-park",
    icon: <Waves className="h-5 w-5 text-[#51fec0]" />,
  },
  {
    title: "Sculptural Sky Towers",
    description: "Binghatti Skyrise architectural supertalls",
    image: "/img/projects/binghatti/binghatti-skyrise.webp",
    href: "/off-plan/binghatti-skyrise",
    icon: <Building2 className="h-5 w-5 text-[#51fec0]" />,
  },
  {
    title: "Parkland Residences",
    description: "Emaar Greencrest serene sanctuary living",
    image: "/img/projects/emaar/greencrest.webp",
    href: "/off-plan/greencrest",
    icon: <Compass className="h-5 w-5 text-[#51fec0]" />,
  },
  {
    title: "Championship Golf Views",
    description: "Emaar Golf Vale fairway-facing residences",
    image: "/img/projects/emaar/golf-vale.webp",
    href: "/off-plan/golf-vale",
    icon: <Crown className="h-5 w-5 text-[#51fec0]" />,
  },
  {
    title: "Cultural Island Living",
    description: "Aldar Saadiyat Grove museum district, Abu Dhabi",
    image: "/img/projects/aldar/saadiyat-grove.webp",
    href: "/off-plan/saadiyat-grove",
    icon: <Landmark className="h-5 w-5 text-[#51fec0]" />,
  },
];

export function InteractiveSelector({
  heading = "Live Across Every Dubai Lifestyle",
  subheading = "Tap or hover any architectural corridor to explore curated waterfront, supertall, golf, and island releases.",
  options = DEFAULT_OPTIONS,
  className,
}: {
  heading?: string;
  subheading?: string;
  options?: SelectorOption[];
  className?: string;
}) {
  const [activeIndex, setActiveIndex] = useState(0);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const mq = window.matchMedia("(max-width: 639px)");
    const update = () => setIsMobile(mq.matches);
    update();
    mq.addEventListener("change", update);
    return () => mq.removeEventListener("change", update);
  }, []);

  return (
    <div
      className={cn(
        "relative flex flex-col items-center justify-center rounded-[26px] sm:rounded-3xl border border-white/15 bg-gradient-to-b from-[#08131f]/95 via-[#0c1a2c]/95 to-[#09121e]/96 px-4 py-11 sm:px-8 sm:py-16 text-white shadow-[0_28px_80px_rgba(6,18,32,0.34)] backdrop-blur-2xl",
        className
      )}
    >
      {/* Header */}
      <div className="mx-auto mb-8 sm:mb-10 max-w-2xl text-center">
        <p className="text-[10.5px] sm:text-[11px] font-semibold uppercase tracking-[0.22em] text-[#51fec0]">
          ARCHITECTURAL CORRIDORS · UAE
        </p>
        <h3 className="mt-2.5 sm:mt-3 text-[26px] sm:text-4xl md:text-[44px] font-medium leading-[1.08] tracking-[-0.035em] text-white">
          {heading}
        </h3>
        <p className="mt-2.5 sm:mt-3 text-xs sm:text-base text-white/72">{subheading}</p>
      </div>

      {/* Expandable Selector Track */}
      <div className="flex h-[560px] sm:h-[450px] w-full max-w-[1140px] flex-col sm:flex-row items-stretch gap-2.5 overflow-hidden">
        {options.map((option, index) => {
          const isActive = activeIndex === index;
          return (
            <div
              key={option.title}
              onMouseEnter={() => {
                if (!isMobile) setActiveIndex(index);
              }}
              className={cn(
                "relative flex flex-col overflow-hidden rounded-2xl border-2 transition-all duration-500 ease-out",
                isActive ? "justify-end" : "justify-center sm:justify-end",
                "min-h-[60px] sm:min-w-[68px]"
              )}
              style={{
                borderColor: isActive
                  ? "rgba(81,254,192,0.85)"
                  : "rgba(255,255,255,0.14)",
                boxShadow: isActive
                  ? "0 20px 60px rgba(0,0,0,0.52)"
                  : "0 10px 30px rgba(0,0,0,0.28)",
                flex: isActive ? (isMobile ? "5.2 1 0%" : "6.2 1 0%") : "1 1 0%",
                zIndex: isActive ? 10 : 1,
                willChange: "flex-grow, box-shadow",
              }}
            >
              <button
                type="button"
                aria-expanded={isActive}
                aria-label={`Select ${option.title}`}
                onClick={() => setActiveIndex(index)}
                className="absolute inset-0 z-[5] cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-[#51fec0]"
              />
              <img
                src={option.image}
                alt={option.title}
                loading="lazy"
                className="absolute inset-0 h-full w-full object-cover transition-transform duration-700"
                style={{
                  transform: isActive ? "scale(1)" : "scale(1.1)",
                }}
              />

              {/* Deep Cinematic Scrim */}
              <div
                aria-hidden="true"
                className="pointer-events-none absolute inset-0 bg-gradient-to-t from-[#050d16]/94 via-[#050d16]/48 to-[#050d16]/25 transition-opacity duration-500"
                style={{ opacity: isActive ? 1 : 0.8 }}
              />

              {/* Medallion Icon + Animated Label & Action */}
              <div className="pointer-events-none relative z-10 flex items-center justify-between gap-3 p-3.5 sm:p-5">
                <div className="flex items-center gap-3 min-w-0">
                  <div className="flex h-10 w-10 sm:h-11 sm:w-11 shrink-0 items-center justify-center rounded-full border border-white/25 bg-[#0a1624]/82 backdrop-blur-md shadow-md">
                    {option.icon}
                  </div>
                  <div
                    className={cn(
                      "min-w-0 transition-all duration-300",
                      isActive
                        ? "opacity-100 translate-x-0"
                        : "opacity-100 sm:opacity-0 sm:translate-x-5"
                    )}
                  >
                    <div className="truncate text-sm sm:text-xl font-semibold tracking-[-0.02em] text-white">
                      {option.title}
                    </div>
                    {isActive ? (
                      <div className="line-clamp-1 sm:truncate text-xs sm:text-sm text-white/78">
                        {option.description}
                      </div>
                    ) : null}
                  </div>
                </div>

                {isActive ? (
                  <Link
                    href={option.href}
                    className="pointer-events-auto relative z-20 inline-flex shrink-0 items-center gap-1.5 rounded-full bg-[#51fec0] sm:bg-white px-3.5 py-2 sm:px-4 text-[10.5px] sm:text-[11px] font-semibold uppercase tracking-[0.14em] text-[#0a1624] transition-colors hover:bg-[#51fec0]"
                  >
                    <span>View</span>
                    <ArrowUpRight className="h-3.5 w-3.5" />
                  </Link>
                ) : (
                  <span className="sm:hidden shrink-0 font-mono text-[10px] uppercase tracking-[0.14em] text-[#51fec0]">
                    Tap
                  </span>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

export default InteractiveSelector;
