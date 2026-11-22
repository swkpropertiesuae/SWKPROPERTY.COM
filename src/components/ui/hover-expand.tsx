"use client";

import type { KeyboardEvent } from "react";
import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { motion, useReducedMotion } from "framer-motion";
import { ArrowUpRight } from "lucide-react";
import { cn } from "@/lib/utils";

/**
 * 21st.dev HoverExpand Spring Accordion Panels
 * Desktop: horizontal spring-expanding strips with rotated collapsed labels.
 * Mobile (< 768px): sleek vertical tap-to-expand accordion with horizontal labels & clear Explore CTA.
 */

export type HoverExpandOrientation = "horizontal" | "vertical";

export interface HoverExpandItem {
  alt?: string;
  description?: string;
  id: string;
  image?: string;
  title: string;
  href?: string;
  tag?: string;
}

export interface HoverExpandProps {
  activeIndex?: number;
  className?: string;
  collapsedFlex?: number;
  expandedFlex?: number;
  items: HoverExpandItem[];
  onActiveIndexChange?: (index: number) => void;
  orientation?: HoverExpandOrientation;
  showLabelsWhenCollapsed?: boolean;
}

const DEFAULT_EXPANDED_FLEX = 4;
const DEFAULT_COLLAPSED_FLEX = 1;
const LABEL_ROTATION = -90;

export function HoverExpand({
  items,
  orientation = "horizontal",
  activeIndex: activeIndexProp,
  onActiveIndexChange,
  expandedFlex = DEFAULT_EXPANDED_FLEX,
  collapsedFlex = DEFAULT_COLLAPSED_FLEX,
  showLabelsWhenCollapsed = true,
  className,
}: HoverExpandProps) {
  const shouldReduceMotion = useReducedMotion();
  const [internalActive, setInternalActive] = useState(0);
  const isControlled = activeIndexProp !== undefined;
  const activeIndex = isControlled ? activeIndexProp : internalActive;
  const [isHoverDevice, setIsHoverDevice] = useState(false);
  const [isMobileViewport, setIsMobileViewport] = useState(false);
  const panelRefs = useRef<(HTMLDivElement | null)[]>([]);

  useEffect(() => {
    const hoverMq = window.matchMedia("(hover: hover) and (pointer: fine)");
    const mobileMq = window.matchMedia("(max-width: 767px)");
    const update = () => {
      setIsHoverDevice(hoverMq.matches);
      setIsMobileViewport(mobileMq.matches);
    };
    update();
    hoverMq.addEventListener("change", update);
    mobileMq.addEventListener("change", update);
    return () => {
      hoverMq.removeEventListener("change", update);
      mobileMq.removeEventListener("change", update);
    };
  }, []);

  const isHorizontal = orientation === "horizontal" && !isMobileViewport;

  const setActive = (index: number) => {
    if (!isControlled) {
      setInternalActive(index);
    }
    onActiveIndexChange?.(index);
  };

  const handleKeyDown = (
    event: KeyboardEvent<HTMLDivElement>,
    index: number
  ) => {
    const nextKey = isHorizontal ? "ArrowRight" : "ArrowDown";
    const prevKey = isHorizontal ? "ArrowLeft" : "ArrowUp";

    if (event.key === nextKey) {
      event.preventDefault();
      const next = Math.min(index + 1, items.length - 1);
      setActive(next);
      panelRefs.current[next]?.focus();
    } else if (event.key === prevKey) {
      event.preventDefault();
      const prev = Math.max(index - 1, 0);
      setActive(prev);
      panelRefs.current[prev]?.focus();
    }
  };

  return (
    <div
      aria-label="Expandable Dubai advisory panels"
      className={cn(
        "flex w-full gap-2.5 sm:gap-3",
        isHorizontal ? "h-[440px] flex-row" : "h-[590px] sm:h-[540px] flex-col",
        className
      )}
      role="group"
    >
      {items.map((item, index) => {
        const isActive = index === activeIndex;
        const shouldShowLabel = isActive || showLabelsWhenCollapsed;

        return (
          <motion.div
            animate={{
              flexGrow: isActive
                ? isMobileViewport
                  ? 4.6
                  : expandedFlex
                : isMobileViewport
                  ? 0.9
                  : collapsedFlex,
            }}
            aria-label={item.title}
            role="button"
            tabIndex={0}
            aria-expanded={isActive}
            className={cn(
              "relative min-h-0 flex-1 cursor-pointer overflow-hidden rounded-2xl border bg-[#101c2b] text-left transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#51fec0]",
              isHorizontal ? "min-w-[64px]" : "min-h-[56px] w-full",
              isActive ? "border-[#51fec0]/60" : "border-white/15"
            )}
            initial={false}
            key={item.id}
            onClick={() => setActive(index)}
            onFocus={() => setActive(index)}
            onKeyDown={(event) => handleKeyDown(event, index)}
            onMouseEnter={() => {
              if (isHoverDevice && !isMobileViewport) {
                setActive(index);
              }
            }}
            ref={(el) => {
              panelRefs.current[index] = el;
            }}
            style={{ flexBasis: 0 }}
            transition={
              shouldReduceMotion
                ? { duration: 0 }
                : { bounce: 0.08, duration: 0.42, type: "spring" }
            }
          >
            {item.image ? (
              <img
                alt={item.alt ?? item.title}
                className="absolute inset-0 h-full w-full object-cover transition-transform duration-700"
                style={{ transform: isActive ? "scale(1)" : "scale(1.08)" }}
                draggable={false}
                loading="lazy"
                src={item.image}
              />
            ) : null}
            <div
              aria-hidden="true"
              className="absolute inset-0 bg-gradient-to-t from-[#07111d]/92 via-[#07111d]/38 to-[#07111d]/25"
            />
            <motion.div
              animate={
                shouldReduceMotion
                  ? { opacity: shouldShowLabel ? 1 : 0 }
                  : {
                      opacity: shouldShowLabel ? 1 : 0,
                      rotate: isHorizontal && !isActive ? LABEL_ROTATION : 0,
                    }
              }
              className={cn(
                "absolute inset-0 flex p-4 sm:p-5",
                isActive || isHorizontal ? "items-end" : "items-center"
              )}
              transition={
                shouldReduceMotion
                  ? { duration: 0 }
                  : { bounce: 0.08, duration: 0.35, type: "spring" }
              }
            >
              <div
                className={cn(
                  "flex w-full gap-3 sm:gap-4",
                  isActive
                    ? "flex-col sm:flex-row sm:items-end justify-between"
                    : "items-center justify-between",
                  isHorizontal && !isActive && "origin-left whitespace-nowrap"
                )}
              >
                <div className="min-w-0">
                  {isActive && item.tag ? (
                    <span className="mb-1 inline-block text-[9.5px] sm:text-[10px] font-semibold uppercase tracking-[0.2em] text-[#51fec0]">
                      {item.tag}
                    </span>
                  ) : null}
                  <p className="text-[15px] sm:text-xl font-medium tracking-[-0.02em] text-white truncate sm:whitespace-normal">
                    {item.title}
                  </p>
                  {isActive && item.description ? (
                    <p className="mt-1.5 max-w-md text-xs sm:text-sm leading-relaxed text-white/82 line-clamp-3 sm:line-clamp-none">
                      {item.description}
                    </p>
                  ) : null}
                </div>

                {!isActive && isMobileViewport ? (
                  <span className="shrink-0 font-mono text-[10px] uppercase tracking-[0.16em] text-[#51fec0]">
                    Tap +
                  </span>
                ) : null}

                {isActive && item.href ? (
                  <Link
                    href={item.href}
                    onClick={(e) => e.stopPropagation()}
                    className="inline-flex w-fit shrink-0 items-center gap-1.5 rounded-full bg-white px-4 py-2 text-[10.5px] sm:text-[11px] font-semibold uppercase tracking-[0.14em] text-[#0a1624] transition-colors hover:bg-[#51fec0]"
                  >
                    <span>Explore</span>
                    <ArrowUpRight className="h-3.5 w-3.5" />
                  </Link>
                ) : null}
              </div>
            </motion.div>
          </motion.div>
        );
      })}
    </div>
  );
}

export default HoverExpand;
