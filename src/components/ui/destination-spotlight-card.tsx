"use client";

import React, { useState } from "react";
import Link from "next/link";
import { motion, useReducedMotion } from "framer-motion";
import { ArrowUpRight, Compass } from "lucide-react";
import { cn } from "@/lib/utils";

/**
 * 21st.dev Ambient-Glow Destination Spotlight Card
 * Signature dark architectural card with gradient typographic headline,
 * ambient blurred halo bleed behind the centerpiece visual, spring badge,
 * and glowing circular action trigger.
 */

export interface DestinationSpotlightProps {
  titleTop: string;
  titleBottom: string;
  developer: string;
  description: string;
  image: string;
  href: string;
  gradientClass?: string;
  className?: string;
}

export function DestinationSpotlightCard({
  titleTop,
  titleBottom,
  developer,
  description,
  image,
  href,
  gradientClass = "from-[#7dd3fc] via-[#bae6fd] to-[#51fec0]",
  className,
}: DestinationSpotlightProps) {
  const [isHovered, setIsHovered] = useState(false);
  const reduced = useReducedMotion();

  return (
    <Link
      href={href}
      onFocus={() => setIsHovered(true)}
      onBlur={() => setIsHovered(false)}
      className={cn("block h-full focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#51fec0] rounded-[2rem]", className)}
    >
      <motion.div
        className="relative flex h-full min-h-[470px] w-full flex-col justify-between overflow-hidden rounded-[2rem] border border-white/15 bg-[#08121e]/92 p-4 shadow-[0_30px_70px_-18px_rgba(6,18,32,0.55)] backdrop-blur-xl transition-colors"
        initial={reduced ? false : { opacity: 0, y: 18 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-40px" }}
        transition={reduced ? { duration: 0 } : { duration: 0.45, ease: "easeOut" }}
        whileHover={
          reduced
            ? undefined
            : {
                scale: 1.018,
                borderColor: "rgba(81, 254, 192, 0.45)",
                boxShadow: "0 36px 78px -15px rgba(8, 25, 44, 0.72)",
              }
        }
        onHoverStart={() => setIsHovered(true)}
        onHoverEnd={() => setIsHovered(false)}
      >
        {/* Top Header Row: Architectural Emblem + Glowing Circular Arrow */}
        <div className="relative z-10 flex items-center justify-between px-2 pt-1">
          <div className="flex items-center gap-2.5">
            <motion.div
              whileHover={{ rotate: 12, scale: 1.08 }}
              transition={{ type: "spring", stiffness: 300 }}
              className="flex h-9 w-9 items-center justify-center rounded-full border border-white/20 bg-white/10 text-white"
            >
              <Compass className="h-4 w-4 text-[#51fec0]" />
            </motion.div>
            <span className="text-[10.5px] font-semibold uppercase tracking-[0.2em] text-white/75">
              {developer}
            </span>
          </div>

          <motion.div
            className="flex h-10 w-10 items-center justify-center rounded-full bg-[#38bdf8] text-[#08121e] shadow-[0_0_20px_rgba(56,189,248,0.45)]"
            animate={{
              scale: isHovered ? 1.1 : 1,
              backgroundColor: isHovered ? "#51fec0" : "#38bdf8",
              boxShadow: isHovered
                ? "0 0 24px rgba(81, 254, 192, 0.7)"
                : "0 0 18px rgba(56, 189, 248, 0.45)",
            }}
            transition={{ duration: 0.25 }}
          >
            <ArrowUpRight className="h-5 w-5" />
          </motion.div>
        </div>

        {/* Center Gradient Monumental Title + Ambient-Halo Photo Frame */}
        <div className="relative z-10 my-5 flex flex-col gap-5">
          <div
            className={cn(
              "text-center text-[34px] sm:text-[38px] font-bold uppercase leading-[0.98] tracking-[-0.03em] bg-gradient-to-r bg-clip-text text-transparent",
              gradientClass
            )}
          >
            {titleTop}
            <br />
            {titleBottom}
          </div>

          <div className="relative mx-1">
            {/* Soft Ambient Blurred Glow Layer (Signature Effect) */}
            <div
              aria-hidden="true"
              className="pointer-events-none absolute -inset-3 z-0 overflow-hidden rounded-3xl opacity-35"
            >
              <motion.div
                className="h-full w-full"
                animate={{ scale: isHovered ? 1.15 : 1.02 }}
                transition={{ duration: 1.6, ease: "easeInOut" }}
              >
                <img
                  src={image}
                  alt=""
                  loading="lazy"
                  className="h-full w-full scale-150 object-cover blur-2xl"
                />
              </motion.div>
            </div>

            {/* Razor-Sharp Centerpiece Residence Photo */}
            <motion.div
              className="relative z-10 overflow-hidden rounded-2xl border border-white/15 bg-[#0f1c2d] shadow-2xl"
              animate={{ scale: isHovered ? 1.025 : 1 }}
              transition={{ duration: 0.45, ease: "easeOut" }}
            >
              <img
                src={image}
                alt={`${titleTop} ${titleBottom} by ${developer}`}
                loading="lazy"
                className="aspect-[16/10] w-full object-cover"
              />
            </motion.div>
          </div>
        </div>

        {/* Editorial Caption */}
        <p className="relative z-10 mx-auto max-w-[290px] pb-2 text-center text-xs leading-relaxed text-white/75">
          {description}
        </p>
      </motion.div>
    </Link>
  );
}

export default DestinationSpotlightCard;
