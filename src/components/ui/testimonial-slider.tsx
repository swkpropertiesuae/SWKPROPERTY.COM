"use client";

import * as React from "react";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowLeft, ArrowRight } from "lucide-react";
import { cn } from "@/lib/utils";

/**
 * 21st.dev Editorial Testimonial Slider (@kavikatiyar/testimonial-slider-1)
 * Vertical sliding portrait frame + horizontal editorial quote transitions,
 * clickable preview thumbnails, and luminous frosted-glass styling.
 */

export type SliderReview = {
  id: string | number;
  name: string;
  affiliation: string;
  quote: string;
  imageSrc: string;
  thumbnailSrc: string;
};

interface TestimonialSliderProps {
  reviews: SliderReview[];
  className?: string;
}

export function TestimonialSlider({
  reviews,
  className,
}: TestimonialSliderProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [direction, setDirection] = useState<"left" | "right">("right");

  if (!reviews.length) return null;

  const activeReview = reviews[currentIndex] ?? reviews[0];

  const handleNext = () => {
    setDirection("right");
    setCurrentIndex((prev) => (prev + 1) % reviews.length);
  };

  const handlePrev = () => {
    setDirection("left");
    setCurrentIndex((prev) => (prev - 1 + reviews.length) % reviews.length);
  };

  const handleThumbnailClick = (index: number) => {
    setDirection(index > currentIndex ? "right" : "left");
    setCurrentIndex(index);
  };

  const thumbnailReviews = reviews
    .filter((_, i) => i !== currentIndex)
    .slice(0, 3);

  const imageVariants = {
    enter: (dir: "left" | "right") => ({
      y: dir === "right" ? "100%" : "-100%",
      opacity: 0,
    }),
    center: { y: 0, opacity: 1 },
    exit: (dir: "left" | "right") => ({
      y: dir === "right" ? "-100%" : "100%",
      opacity: 0,
    }),
  };

  const textVariants = {
    enter: (dir: "left" | "right") => ({
      x: dir === "right" ? 44 : -44,
      opacity: 0,
    }),
    center: { x: 0, opacity: 1 },
    exit: (dir: "left" | "right") => ({
      x: dir === "right" ? -44 : 44,
      opacity: 0,
    }),
  };

  return (
    <div
      className={cn(
        "relative w-full overflow-hidden rounded-3xl border border-white/80 bg-white/82 p-6 sm:p-10 lg:p-12 text-[#121212] shadow-[0_24px_70px_rgba(12,56,96,0.11)] backdrop-blur-2xl",
        className
      )}
    >
      <div className="grid grid-cols-1 gap-8 md:grid-cols-12 md:min-h-[460px]">
        {/* Left Column: Pagination, Vertical Label & Clickable Portrait Thumbnails */}
        <div className="order-2 md:order-1 md:col-span-3 flex flex-col justify-between">
          <div className="flex flex-row md:flex-col justify-between md:justify-start gap-4">
            <span className="font-mono text-sm font-medium text-[#1b6aa7]">
              {String(currentIndex + 1).padStart(2, "0")} /{" "}
              {String(reviews.length).padStart(2, "0")}
            </span>
            <p className="hidden md:block text-[11px] font-semibold tracking-[0.26em] uppercase text-[#121212]/45 [writing-mode:vertical-rl] md:rotate-180">
              CLIENT REVIEWS
            </p>
          </div>

          <div className="mt-6 md:mt-0 flex items-center gap-2.5">
            {thumbnailReviews.map((review) => {
              const originalIndex = reviews.findIndex((r) => r.id === review.id);
              return (
                <button
                  key={review.id}
                  type="button"
                  onClick={() => handleThumbnailClick(originalIndex)}
                  className="group relative h-20 w-16 md:h-24 md:w-20 cursor-pointer overflow-hidden rounded-xl border border-black/10 opacity-75 transition-all duration-300 hover:opacity-100 hover:scale-[1.04] focus:outline-none focus:ring-2 focus:ring-[#121212]"
                  aria-label={`View client review from ${review.name}`}
                >
                  <img
                    src={review.thumbnailSrc}
                    alt={review.name}
                    loading="lazy"
                    className="h-full w-full object-cover object-top"
                  />
                </button>
              );
            })}
          </div>
        </div>

        {/* Center Column: Animated Vertical-Slide Portrait */}
        <div className="order-1 md:order-2 md:col-span-4 relative h-[320px] sm:h-[380px] md:h-auto md:min-h-[440px] overflow-hidden rounded-2xl bg-[#eaf3f9] border border-white/70 shadow-[0_18px_40px_rgba(12,56,96,0.12)]">
          <AnimatePresence initial={false} custom={direction}>
            <motion.img
              key={currentIndex}
              src={activeReview.imageSrc}
              alt={activeReview.name}
              custom={direction}
              variants={imageVariants}
              initial="enter"
              animate="center"
              exit="exit"
              transition={{ duration: 0.55, ease: [0.4, 0, 0.2, 1] }}
              className="absolute inset-0 h-full w-full object-cover object-top"
            />
          </AnimatePresence>
        </div>

        {/* Right Column: Editorial Quote & Navigation Arrows */}
        <div className="order-3 md:col-span-5 flex flex-col justify-between md:pl-6">
          <div className="relative overflow-hidden pt-2 md:pt-10 min-h-[220px]">
            <AnimatePresence initial={false} custom={direction} mode="wait">
              <motion.div
                key={currentIndex}
                custom={direction}
                variants={textVariants}
                initial="enter"
                animate="center"
                exit="exit"
                transition={{ duration: 0.5, ease: [0.4, 0, 0.2, 1] }}
              >
                <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-[#0e9f6e]">
                  {activeReview.affiliation}
                </p>
                <h3 className="mt-1.5 text-2xl font-medium tracking-[-0.03em] text-[#121212]">
                  {activeReview.name}
                </h3>
                <blockquote className="mt-6 text-[20px] sm:text-[24px] lg:text-[26px] font-medium leading-[1.34] tracking-[-0.025em] text-[#121212]">
                  &ldquo;{activeReview.quote}&rdquo;
                </blockquote>
              </motion.div>
            </AnimatePresence>
          </div>

          <div className="mt-8 md:mt-0 flex items-center justify-between gap-4 border-t border-black/[0.08] pt-6">
            <div className="flex items-center gap-2.5">
              <button
                type="button"
                onClick={handlePrev}
                aria-label="Previous client review"
                className="inline-flex h-12 w-12 cursor-pointer items-center justify-center rounded-full border border-black/15 bg-white/90 text-[#121212] transition-all duration-200 hover:-translate-y-0.5 hover:scale-105 hover:border-[#121212] hover:bg-[#121212] hover:text-[#51fec0] hover:shadow-lg"
              >
                <ArrowLeft className="h-4 w-4" />
              </button>
              <button
                type="button"
                onClick={handleNext}
                aria-label="Next client review"
                className="inline-flex h-12 w-12 cursor-pointer items-center justify-center rounded-full bg-[#121212] text-white transition-all duration-200 hover:-translate-y-0.5 hover:scale-105 hover:bg-[#0e9f6e] hover:text-white hover:shadow-[0_12px_28px_rgba(14,159,110,0.35)]"
              >
                <ArrowRight className="h-4 w-4" />
              </button>
            </div>
            <span className="text-[11px] font-medium uppercase tracking-[0.18em] text-[#64748b]">
              Verified Advisory Outcome
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
