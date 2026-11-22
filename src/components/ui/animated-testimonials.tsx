"use client";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Separator } from "@/components/ui/separator";
import { ArrowLeft, ArrowRight, Quote, Star } from "lucide-react";
import { AnimatePresence, motion, useAnimation, useInView } from "framer-motion";
import { useEffect, useRef, useState } from "react";

export interface Testimonial {
  id: number;
  name: string;
  role: string;
  company: string;
  content: string;
  rating: number;
  avatar: string;
}

export interface AnimatedTestimonialsProps {
  title?: string;
  subtitle?: string;
  badgeText?: string;
  testimonials?: Testimonial[];
  autoRotateInterval?: number;
  trustedCompanies?: string[];
  trustedCompaniesTitle?: string;
  className?: string;
}

export function AnimatedTestimonials({
  title = "Judged on outcomes, not on brochures",
  subtitle = "Real feedback from international buyers, relocating families, and portfolio investors advised across Dubai and the UAE.",
  badgeText = "Verified Client Stories",
  testimonials = [],
  autoRotateInterval = 6000,
  trustedCompanies = [],
  trustedCompaniesTitle = "Advising acquisitions across Dubai's leading master developers",
  className,
}: AnimatedTestimonialsProps) {
  const [activeIndex, setActiveIndex] = useState(0);
  const [direction, setDirection] = useState<1 | -1>(1);
  const [paused, setPaused] = useState(false);
  const touchStartX = useRef<number | null>(null);

  const sectionRef = useRef<HTMLElement>(null);
  const isInView = useInView(sectionRef, { once: true, amount: 0.12 });
  const controls = useAnimation();

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.1,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 18 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.45,
        ease: [0.22, 1, 0.36, 1] as const,
      },
    },
  };

  useEffect(() => {
    if (isInView) {
      controls.start("visible");
    }
  }, [isInView, controls]);

  useEffect(() => {
    if (paused || autoRotateInterval <= 0 || testimonials.length <= 1) return;

    const interval = setInterval(() => {
      setDirection(1);
      setActiveIndex((current) => (current + 1) % testimonials.length);
    }, autoRotateInterval);

    return () => clearInterval(interval);
  }, [paused, autoRotateInterval, testimonials.length]);

  if (testimonials.length === 0) {
    return null;
  }

  const handlePrev = () => {
    setDirection(-1);
    setActiveIndex((curr) => (curr - 1 + testimonials.length) % testimonials.length);
  };

  const handleNext = () => {
    setDirection(1);
    setActiveIndex((curr) => (curr + 1) % testimonials.length);
  };

  const current = testimonials[activeIndex] ?? testimonials[0];

  return (
    <section
      ref={sectionRef}
      id="testimonials"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
      className={`relative py-20 sm:py-24 overflow-hidden bg-white/22 backdrop-blur-[2px] ${className || ""}`}
    >
      <div className="mx-auto max-w-[1260px] px-4 sm:px-8">
        <motion.div
          initial="hidden"
          animate={controls}
          variants={containerVariants}
          className="grid grid-cols-1 gap-8 sm:gap-12 w-full lg:grid-cols-12 lg:gap-16 items-center"
        >
          {/* Left side: Heading and navigation */}
          <motion.div variants={itemVariants} className="lg:col-span-5 flex flex-col justify-center">
            <div className="space-y-4 sm:space-y-5">
              {badgeText && (
                <div className="inline-flex items-center gap-1.5 rounded-full border border-[#0e9f6e]/25 bg-white/88 px-3.5 py-1.5 text-[11px] sm:text-xs font-semibold uppercase tracking-[0.16em] text-[#0e9f6e] shadow-xs backdrop-blur-md">
                  <Star className="h-3.5 w-3.5 fill-[#0e9f6e] text-[#0e9f6e]" />
                  <span>{badgeText}</span>
                </div>
              )}

              <h2 className="text-[30px] sm:text-[42px] md:text-[48px] font-medium leading-[1.06] tracking-[-0.04em] text-[#121212]">
                {title}
              </h2>

              <p className="max-w-[500px] text-[14px] sm:text-[16.5px] leading-[1.6] text-[#475569]">
                {subtitle}
              </p>

              {/* Controls: Prev/Next + All Indicator Pills */}
              <div className="flex flex-wrap items-center gap-2.5 sm:gap-3 pt-2 sm:pt-3">
                <button
                  type="button"
                  onClick={handlePrev}
                  aria-label="Previous client review"
                  className="inline-flex h-10 w-10 cursor-pointer items-center justify-center rounded-full border border-white/90 bg-white/88 text-[#121212] shadow-xs backdrop-blur-md transition-all duration-200 hover:-translate-y-0.5 hover:border-[#121212] hover:bg-[#121212] hover:text-white hover:shadow-md"
                >
                  <ArrowLeft className="h-4 w-4" />
                </button>
                <button
                  type="button"
                  onClick={handleNext}
                  aria-label="Next client review"
                  className="inline-flex h-10 w-10 cursor-pointer items-center justify-center rounded-full border border-white/90 bg-white/88 text-[#121212] shadow-xs backdrop-blur-md transition-all duration-200 hover:-translate-y-0.5 hover:border-[#121212] hover:bg-[#121212] hover:text-white hover:shadow-md"
                >
                  <ArrowRight className="h-4 w-4" />
                </button>

                <div className="flex flex-wrap items-center gap-1.5 pl-1">
                  {testimonials.map((t, index) => (
                    <button
                      key={t.id}
                      type="button"
                      onClick={() => {
                        setDirection(index >= activeIndex ? 1 : -1);
                        setActiveIndex(index);
                      }}
                      className={`h-2 sm:h-2.5 cursor-pointer rounded-full transition-all duration-300 ${
                        activeIndex === index
                          ? "w-7 sm:w-9 bg-[#121212]"
                          : "w-2 sm:w-2.5 bg-[#0c233a]/25 hover:bg-[#0c233a]/60"
                      }`}
                      aria-label={`View review from ${t.name}`}
                    />
                  ))}
                </div>
              </div>
            </div>
          </motion.div>

          {/* Right side: Flow-Sized Animated Testimonial Card (Zero Clipping on Mobile + Swipeable!) */}
          <motion.div
            variants={itemVariants}
            className="lg:col-span-7 relative"
            onTouchStart={(e) => {
              touchStartX.current = e.touches[0]?.clientX ?? null;
              setPaused(true);
            }}
            onTouchEnd={(e) => {
              const startX = touchStartX.current;
              const endX = e.changedTouches[0]?.clientX ?? null;
              touchStartX.current = null;
              if (startX !== null && endX !== null) {
                const dx = endX - startX;
                if (dx < -40) handleNext();
                else if (dx > 40) handlePrev();
              }
              window.setTimeout(() => setPaused(false), 3000);
            }}
          >
            {/* Subtle luminous corner halos (desktop/tablet only so mobile never clips edges) */}
            <div
              aria-hidden="true"
              className="hidden sm:block pointer-events-none absolute -bottom-5 -left-5 h-24 w-24 rounded-2xl border border-white/70 bg-white/45 backdrop-blur-md"
            />
            <div
              aria-hidden="true"
              className="hidden sm:block pointer-events-none absolute -top-5 -right-5 h-24 w-24 rounded-2xl border border-white/70 bg-white/45 backdrop-blur-md"
            />

            <AnimatePresence mode="wait" initial={false}>
              <motion.div
                key={current.id}
                initial={{ opacity: 0, x: direction * 36, scale: 0.98 }}
                animate={{ opacity: 1, x: 0, scale: 1 }}
                exit={{ opacity: 0, x: direction * -36, scale: 0.98 }}
                transition={{ duration: 0.36, ease: [0.22, 1, 0.36, 1] }}
                className="relative z-10 flex min-h-[320px] sm:min-h-[370px] flex-col justify-between rounded-[24px] sm:rounded-[28px] border border-white/90 bg-white/94 p-6 sm:p-10 shadow-[0_24px_64px_rgba(12,56,96,0.13)] backdrop-blur-2xl"
              >
                <div>
                  <div className="mb-4 sm:mb-6 flex items-center justify-between gap-4">
                    <div className="flex gap-1.5">
                      {Array(current.rating)
                        .fill(0)
                        .map((_, i) => (
                          <Star
                            key={i}
                            className="h-4 w-4 fill-[#0e9f6e] text-[#0e9f6e]"
                          />
                        ))}
                    </div>
                    <span className="font-mono text-[11px] font-semibold uppercase tracking-[0.16em] text-[#64748b]">
                      {String(activeIndex + 1).padStart(2, "0")} / {String(testimonials.length).padStart(2, "0")}
                    </span>
                  </div>

                  <div className="relative">
                    <Quote className="absolute -top-2 -left-1 sm:-left-2 h-7 w-7 sm:h-8 sm:w-8 text-[#1b6aa7]/16 rotate-180" />
                    <p className="relative z-10 text-[16px] sm:text-[21px] font-medium leading-[1.48] tracking-[-0.02em] text-[#121212]">
                      &ldquo;{current.content}&rdquo;
                    </p>
                  </div>
                </div>

                <div>
                  <Separator className="my-4 sm:my-5" />
                  <div className="flex items-center justify-between gap-4">
                    <div className="flex items-center gap-3.5 sm:gap-4 min-w-0">
                      <Avatar className="h-12 w-12 sm:h-14 sm:w-14 shrink-0 border-2 border-white shadow-md">
                        <AvatarImage src={current.avatar} alt={current.name} />
                        <AvatarFallback>{current.name.charAt(0)}</AvatarFallback>
                      </Avatar>
                      <div className="min-w-0">
                        <h3 className="text-sm sm:text-base font-semibold text-[#121212] truncate">
                          {current.name}
                        </h3>
                        <p className="text-xs sm:text-sm text-[#475569] truncate">
                          {current.role}
                        </p>
                        <p className="mt-0.5 text-[10.5px] sm:text-[11px] font-semibold uppercase tracking-[0.14em] text-[#1b6aa7] truncate">
                          {current.company}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </motion.div>
            </AnimatePresence>
          </motion.div>
        </motion.div>

        {/* Trusted Master Developers Strip */}
        {trustedCompanies.length > 0 && (
          <motion.div
            variants={itemVariants}
            initial="hidden"
            animate={controls}
            className="mt-14 sm:mt-20 border-t border-white/70 pt-10 sm:pt-12 text-center"
          >
            <h3 className="font-mono text-[10.5px] sm:text-[11px] font-semibold uppercase tracking-[0.2em] text-[#475569] mb-5 sm:mb-6">
              {trustedCompaniesTitle}
            </h3>
            <div className="flex flex-wrap justify-center gap-2 sm:gap-3">
              {trustedCompanies.map((company) => (
                <span
                  key={company}
                  className="rounded-full border border-white/85 bg-white/82 px-3.5 py-1.5 sm:px-5 sm:py-2 text-[11px] sm:text-xs font-semibold uppercase tracking-[0.14em] sm:tracking-[0.16em] text-[#0c233a] shadow-xs backdrop-blur-md transition-all duration-200 hover:-translate-y-0.5 hover:border-[#121212] hover:bg-[#121212] hover:text-white"
                >
                  {company}
                </span>
              ))}
            </div>
          </motion.div>
        )}
      </div>
    </section>
  );
}
