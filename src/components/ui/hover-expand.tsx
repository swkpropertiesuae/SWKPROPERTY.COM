"use client";

import type { KeyboardEvent } from "react";
import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { motion, useReducedMotion } from "framer-motion";
import { ArrowUpRight } from "lucide-react";
import { cn } from "@/lib/utils";

/**
 * 21st.dev HoverExpand Spring Accordion Panels
 * Spring-animated expandable architectural strips with vertical rotated collapsed labels,
 * keyboard arrow navigation, reduced-motion support, and optional direct route links.
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
  const panelRefs = useRef<(HTMLDivElement | null)[]>([]);
  const isHorizontal = orientation === "horizontal";

  useEffect(() => {
    const mediaQuery = window.matchMedia("(hover: hover) and (pointer: fine)");
    const update = () => setIsHoverDevice(mediaQuery.matches);
    update();

    const handleChange = (event: MediaQueryListEvent) => {
      setIsHoverDevice(event.matches);
    };

    mediaQuery.addEventListener("change", handleChange);
    return () => mediaQuery.removeEventListener("change", handleChange);
  }, []);

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
        "flex w-full gap-3",
        isHorizontal ? "h-[400px] sm:h-[440px] flex-row" : "h-[540px] flex-col",
        className
      )}
      role="group"
    >
      {items.map((item, index) => {
        const isActive = index === activeIndex;
        const shouldShowLabel = isActive || showLabelsWhenCollapsed;

        return (
          <motion.div
            animate={{ flexGrow: isActive ? expandedFlex : collapsedFlex }}
            aria-label={item.title}
            role="button"
            tabIndex={0}
            aria-expanded={isActive}
            className="relative min-h-0 min-w-[64px] flex-1 cursor-pointer overflow-hidden rounded-2xl border border-white/15 bg-[#101c2b] text-left focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#51fec0]"
            initial={false}
            key={item.id}
            onClick={() => setActive(index)}
            onFocus={() => setActive(index)}
            onKeyDown={(event) => handleKeyDown(event, index)}
            onMouseEnter={() => {
              if (isHoverDevice) {
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
                : { bounce: 0.1, duration: 0.35, type: "spring" }
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
              className="absolute inset-0 bg-gradient-to-t from-[#07111d]/88 via-[#07111d]/25 to-[#07111d]/20"
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
              className="absolute inset-0 flex items-end p-5"
              transition={
                shouldReduceMotion
                  ? { duration: 0 }
                  : { bounce: 0.1, duration: 0.3, type: "spring" }
              }
            >
              <div
                className={cn(
                  "flex w-full items-end justify-between gap-4",
                  isHorizontal && !isActive && "origin-left whitespace-nowrap"
                )}
              >
                <div>
                  {isActive && item.tag ? (
                    <span className="mb-1.5 inline-block text-[10px] font-semibold uppercase tracking-[0.2em] text-[#51fec0]">
                      {item.tag}
                    </span>
                  ) : null}
                  <p className="text-base sm:text-xl font-medium tracking-[-0.02em] text-white">
                    {item.title}
                  </p>
                  {isActive && item.description ? (
                    <p className="mt-1.5 max-w-md text-xs sm:text-sm leading-relaxed text-white/80">
                      {item.description}
                    </p>
                  ) : null}
                </div>

                {isActive && item.href ? (
                  <Link
                    href={item.href}
                    onClick={(e) => e.stopPropagation()}
                    className="inline-flex shrink-0 items-center gap-1.5 rounded-full bg-white px-4 py-2 text-[11px] font-semibold uppercase tracking-[0.14em] text-[#0a1624] transition-colors hover:bg-[#51fec0]"
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
