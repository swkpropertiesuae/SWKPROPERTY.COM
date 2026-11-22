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
 * smooth flex expansion on click/hover, and direct Dubai collection links.
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
  subheading = "Click any architectural corridor to explore curated waterfront, supertall, golf, and island releases.",
  options = DEFAULT_OPTIONS,
  className,
}: {
  heading?: string;
  subheading?: string;
  options?: SelectorOption[];
  className?: string;
}) {
  const [activeIndex, setActiveIndex] = useState(0);
  const [animatedOptions, setAnimatedOptions] = useState<number[]>([]);

  useEffect(() => {
    const timers: ReturnType<typeof setTimeout>[] = [];
    options.forEach((_, i) => {
      const timer = setTimeout(() => {
        setAnimatedOptions((prev) => (prev.includes(i) ? prev : [...prev, i]));
      }, 140 * i);
      timers.push(timer);
    });
    return () => {
      timers.forEach((timer) => clearTimeout(timer));
    };
  }, [options]);

  return (
    <div
      className={cn(
        "relative flex flex-col items-center justify-center rounded-3xl border border-white/15 bg-gradient-to-b from-[#08131f]/95 via-[#0c1a2c]/95 to-[#09121e]/96 px-4 py-14 sm:px-8 sm:py-16 text-white shadow-[0_28px_80px_rgba(6,18,32,0.34)] backdrop-blur-2xl",
        className
      )}
    >
      {/* Header */}
      <div className="mx-auto mb-10 max-w-2xl text-center">
        <p className="text-[11px] font-semibold uppercase tracking-[0.24em] text-[#51fec0]">
          ARCHITECTURAL CORRIDORS · UAE
        </p>
        <h3 className="mt-3 text-3xl sm:text-4xl md:text-[44px] font-medium leading-[1.08] tracking-[-0.035em] text-white">
          {heading}
        </h3>
        <p className="mt-3 text-sm sm:text-base text-white/72">{subheading}</p>
      </div>

      {/* Expandable Selector Track */}
      <div className="flex h-[420px] sm:h-[450px] w-full max-w-[1140px] flex-col sm:flex-row items-stretch gap-2.5 overflow-hidden">
        {options.map((option, index) => {
          const isActive = activeIndex === index;
          const isAnimated = animatedOptions.includes(index);
          return (
            <div
              key={option.title}
              role="button"
              tabIndex={0}
              aria-expanded={isActive}
              onClick={() => setActiveIndex(index)}
              onMouseEnter={() => setActiveIndex(index)}
              onKeyDown={(e) => {
                if (e.key === "Enter" || e.key === " ") {
                  e.preventDefault();
                  setActiveIndex(index);
                }
              }}
              className="relative flex min-h-[64px] sm:min-w-[68px] cursor-pointer flex-col justify-end overflow-hidden rounded-2xl border-2 transition-all duration-700 ease-out"
              style={{
                opacity: isAnimated ? 1 : 0,
                transform: isAnimated ? "translateX(0)" : "translateX(-32px)",
                borderColor: isActive
                  ? "rgba(255,255,255,0.88)"
                  : "rgba(255,255,255,0.14)",
                boxShadow: isActive
                  ? "0 20px 60px rgba(0,0,0,0.52)"
                  : "0 10px 30px rgba(0,0,0,0.28)",
                flex: isActive ? "6.2 1 0%" : "1 1 0%",
                zIndex: isActive ? 10 : 1,
                willChange: "flex-grow, box-shadow",
              }}
            >
              <img
                src={option.image}
                alt={option.title}
                loading="lazy"
                className="absolute inset-0 h-full w-full object-cover transition-transform duration-700"
                style={{
                  transform: isActive ? "scale(1)" : "scale(1.12)",
                }}
              />

              {/* Deep Cinematic Bottom Scrim */}
              <div
                aria-hidden="true"
                className="pointer-events-none absolute inset-x-0 bottom-0 h-44 bg-gradient-to-t from-[#050d16]/92 via-[#050d16]/45 to-transparent transition-opacity duration-500"
                style={{ opacity: isActive ? 1 : 0.65 }}
              />

              {/* Medallion Icon + Animated Label & Action */}
              <div className="relative z-10 flex items-center justify-between gap-3 p-4 sm:p-5">
                <div className="flex items-center gap-3.5 min-w-0">
                  <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full border border-white/25 bg-[#0a1624]/82 backdrop-blur-md shadow-md">
                    {option.icon}
                  </div>
                  <div
                    className="min-w-0 transition-all duration-500"
                    style={{
                      opacity: isActive ? 1 : 0,
                      transform: isActive ? "translateX(0)" : "translateX(20px)",
                    }}
                  >
                    <div className="truncate text-base sm:text-xl font-semibold tracking-[-0.02em] text-white">
                      {option.title}
                    </div>
                    <div className="truncate text-xs sm:text-sm text-white/75">
                      {option.description}
                    </div>
                  </div>
                </div>

                {isActive ? (
                  <Link
                    href={option.href}
                    onClick={(e) => e.stopPropagation()}
                    className="hidden md:inline-flex shrink-0 items-center gap-1.5 rounded-full bg-white px-4 py-2 text-[11px] font-semibold uppercase tracking-[0.14em] text-[#0a1624] transition-colors hover:bg-[#51fec0]"
                  >
                    <span>View</span>
                    <ArrowUpRight className="h-3.5 w-3.5" />
                  </Link>
                ) : null}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

export default InteractiveSelector;
