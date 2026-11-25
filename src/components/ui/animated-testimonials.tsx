"use client";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Separator } from "@/components/ui/separator";
import { ArrowLeft, ArrowRight, ChevronDown, Globe2, Quote, Star } from "lucide-react";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { useEffect, useId, useRef, useState } from "react";

export interface Testimonial {
  id: string | number;
  region: string;
  context: string;
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
  defaultCollapsed?: boolean;
  className?: string;
}

export function AnimatedTestimonials({
  title = "International buyer perspectives",
  subtitle = "Anonymous feedback from international buyers and investors advised across Dubai and the UAE — representing South Asia, the United Kingdom, Mauritius, and Singapore.",
  badgeText = "International Client Perspectives",
  testimonials = [],
  autoRotateInterval = 7000,
  trustedCompanies = [],
  trustedCompaniesTitle = "Advising acquisitions across Dubai & UAE master developers",
  defaultCollapsed = true,
  className,
}: AnimatedTestimonialsProps) {
  const [isOpen, setIsOpen] = useState(!defaultCollapsed);
  const [activeIndex, setActiveIndex] = useState(0);
  const [direction, setDirection] = useState<1 | -1>(1);
  const [paused, setPaused] = useState(false);
  const touchStartX = useRef<number | null>(null);
  const pauseTimerRef = useRef<number | null>(null);
  const prefersReducedMotion = useReducedMotion();
  const panelId = useId();

  useEffect(() => {
    return () => {
      if (pauseTimerRef.current !== null) {
        window.clearTimeout(pauseTimerRef.current);
      }
    };
  }, []);

  useEffect(() => {
    if (
      !isOpen ||
      paused ||
      prefersReducedMotion ||
      autoRotateInterval <= 0 ||
      testimonials.length <= 1
    ) {
      return;
    }

    const interval = window.setInterval(() => {
      setDirection(1);
      setActiveIndex((current) => (current + 1) % testimonials.length);
    }, autoRotateInterval);

    return () => window.clearInterval(interval);
  }, [isOpen, paused, prefersReducedMotion, autoRotateInterval, testimonials.length]);

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
  const clampedRating = Math.max(1, Math.min(5, Math.round(Number(current.rating) || 5)));

  return (
    <section
      id="testimonials"
      aria-label="International client perspectives"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
      className={`relative border-t border-white/70 bg-white/30 py-8 sm:py-10 backdrop-blur-[4px] ${className || ""}`}
    >
      <div className="mx-auto max-w-[1260px] px-4 sm:px-8">
        {/* Subtle Bottom Disclosure Bar — Collapsed/Hidden by Default */}
        <div className="rounded-2xl border border-white/85 bg-white/78 px-5 py-4 sm:px-7 sm:py-5 shadow-[0_10px_30px_rgba(12,56,96,0.06)] backdrop-blur-xl">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex items-center gap-3 min-w-0">
              <span className="inline-flex h-9 w-9 shrink-0 items-center justify-center rounded-full border border-[#1b6aa7]/20 bg-[#eef7fc] text-[#1b6aa7]">
                <Globe2 className="h-4 w-4" aria-hidden="true" />
              </span>
              <div className="min-w-0">
                <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-[#1b6aa7]">
                  {badgeText}
                </p>
                <p className="mt-0.5 text-xs sm:text-sm text-[#475569]">
                  South Asia · United Kingdom · Mauritius · Singapore — buyer stories kept discreet at page footer.
                </p>
              </div>
            </div>

            <button
              type="button"
              onClick={() => setIsOpen((prev) => !prev)}
              aria-expanded={isOpen}
              aria-controls={panelId}
              className="inline-flex min-h-[44px] shrink-0 cursor-pointer items-center justify-center gap-2 rounded-full border border-[#0c233a]/15 bg-[#0c233a] px-5 py-2.5 text-xs font-semibold uppercase tracking-[0.14em] text-white transition-all hover:bg-[#1b6aa7] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#1b6aa7]"
            >
              <span>{isOpen ? "Hide Client Stories" : `View Client Stories (${testimonials.length})`}</span>
              <ChevronDown
                className={`h-4 w-4 transition-transform duration-300 ${isOpen ? "rotate-180" : ""}`}
                aria-hidden="true"
              />
            </button>
          </div>

          {/* Expandable Bottom Testimonials Drawer */}
          <AnimatePresence initial={false}>
            {isOpen ? (
              <motion.div
                id={panelId}
                initial={prefersReducedMotion ? { opacity: 1 } : { opacity: 0, height: 0 }}
                animate={prefersReducedMotion ? { opacity: 1 } : { opacity: 1, height: "auto" }}
                exit={prefersReducedMotion ? { opacity: 0 } : { opacity: 0, height: 0 }}
                transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
                className="overflow-hidden"
              >
                <div className="mt-6 border-t border-black/[0.07] pt-6 sm:pt-8">
                  <div className="grid grid-cols-1 gap-8 lg:grid-cols-12 lg:gap-12 items-start">
                    {/* Left Column: Editorial Context + Controls */}
                    <div className="lg:col-span-5 flex flex-col justify-between space-y-5">
                      <div>
                        <h2 className="text-[26px] sm:text-[34px] font-medium leading-[1.1] tracking-[-0.035em] text-[#121212]">
                          {title}
                        </h2>
                        <p className="mt-3 text-sm leading-[1.6] text-[#475569]">
                          {subtitle}
                        </p>
                      </div>

                      <div className="flex flex-wrap items-center gap-2.5">
                        <button
                          type="button"
                          onClick={handlePrev}
                          aria-label="Previous client perspective"
                          className="inline-flex h-11 w-11 cursor-pointer items-center justify-center rounded-full border border-black/15 bg-white text-[#121212] transition-all hover:border-[#121212] hover:bg-[#121212] hover:text-white focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#121212]"
                        >
                          <ArrowLeft className="h-4 w-4" aria-hidden="true" />
                        </button>
                        <button
                          type="button"
                          onClick={handleNext}
                          aria-label="Next client perspective"
                          className="inline-flex h-11 w-11 cursor-pointer items-center justify-center rounded-full border border-black/15 bg-white text-[#121212] transition-all hover:border-[#121212] hover:bg-[#121212] hover:text-white focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#121212]"
                        >
                          <ArrowRight className="h-4 w-4" aria-hidden="true" />
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
                              aria-label={`View client perspective ${index + 1} from ${t.region}`}
                              aria-pressed={activeIndex === index}
                              className="inline-flex h-9 items-center justify-center px-1 cursor-pointer focus-visible:outline-2 focus-visible:outline-offset-1 focus-visible:outline-[#121212] rounded-full"
                            >
                              <span
                                className={`block h-2.5 rounded-full transition-all duration-300 ${
                                  activeIndex === index
                                    ? "w-8 bg-[#121212]"
                                    : "w-2.5 bg-[#0c233a]/25 hover:bg-[#0c233a]/60"
                                }`}
                              />
                            </button>
                          ))}
                        </div>
                      </div>
                    </div>

                    {/* Right Column: Nameless Testimonial Card (Portrait Discreetly at Bottom) */}
                    <div
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
                        if (pauseTimerRef.current !== null) {
                          window.clearTimeout(pauseTimerRef.current);
                        }
                        pauseTimerRef.current = window.setTimeout(() => {
                          setPaused(false);
                          pauseTimerRef.current = null;
                        }, 3000);
                      }}
                    >
                      <AnimatePresence mode="wait" initial={false}>
                        <motion.div
                          key={current.id}
                          initial={
                            prefersReducedMotion
                              ? { opacity: 1 }
                              : { opacity: 0, x: direction * 28, scale: 0.99 }
                          }
                          animate={{ opacity: 1, x: 0, scale: 1 }}
                          exit={
                            prefersReducedMotion
                              ? { opacity: 0 }
                              : { opacity: 0, x: direction * -28, scale: 0.99 }
                          }
                          transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
                          className="relative z-10 flex min-h-[290px] sm:min-h-[320px] flex-col justify-between rounded-[22px] border border-black/[0.08] bg-white p-6 sm:p-8 shadow-[0_18px_46px_rgba(12,56,96,0.09)]"
                        >
                          <div>
                            <div className="mb-4 flex items-center justify-between gap-4">
                              <div
                                className="flex gap-1"
                                aria-label={`${clampedRating} out of 5 stars`}
                              >
                                {Array.from({ length: clampedRating }).map((_, i) => (
                                  <Star
                                    key={i}
                                    className="h-4 w-4 fill-[#0e9f6e] text-[#0e9f6e]"
                                    aria-hidden="true"
                                  />
                                ))}
                              </div>
                              <span className="font-mono text-[11px] font-semibold uppercase tracking-[0.16em] text-[#64748b]">
                                {String(activeIndex + 1).padStart(2, "0")} /{" "}
                                {String(testimonials.length).padStart(2, "0")}
                              </span>
                            </div>

                            <div className="relative">
                              <Quote
                                className="absolute -top-2 -left-1 h-7 w-7 text-[#1b6aa7]/15 rotate-180"
                                aria-hidden="true"
                              />
                              <p className="relative z-10 text-[16px] sm:text-[19px] font-medium leading-[1.52] tracking-[-0.015em] text-[#121212]">
                                &ldquo;{current.content}&rdquo;
                              </p>
                            </div>
                          </div>

                          {/* Portrait & Regional Attribution Positioned at Bottom (Zero Personal Names) */}
                          <div>
                            <Separator className="my-5" />
                            <div className="flex flex-wrap items-center justify-between gap-4">
                              <div className="flex items-center gap-3.5 min-w-0">
                                <Avatar className="h-12 w-12 sm:h-14 sm:w-14 shrink-0 border-2 border-white shadow-md">
                                  <AvatarImage
                                    src={current.avatar}
                                    alt={`International property buyer portrait representing ${current.region}`}
                                  />
                                  <AvatarFallback>{current.region.slice(0, 2).toUpperCase()}</AvatarFallback>
                                </Avatar>
                                <div className="min-w-0">
                                  <p className="text-xs sm:text-sm font-semibold uppercase tracking-[0.14em] text-[#1b6aa7]">
                                    {current.region}
                                  </p>
                                  <p className="mt-0.5 text-xs sm:text-sm text-[#475569]">
                                    {current.context}
                                  </p>
                                </div>
                              </div>

                              {/* Subtle Bottom Thumbnail Strip of All 5 Portraits */}
                              <div className="flex items-center gap-1.5">
                                {testimonials.map((t, idx) => (
                                  <button
                                    key={t.id}
                                    type="button"
                                    onClick={() => {
                                      setDirection(idx >= activeIndex ? 1 : -1);
                                      setActiveIndex(idx);
                                    }}
                                    aria-label={`Select perspective ${idx + 1} (${t.region})`}
                                    className={`relative h-9 w-9 overflow-hidden rounded-full border-2 transition-all cursor-pointer ${
                                      idx === activeIndex
                                        ? "border-[#0e9f6e] scale-105 opacity-100"
                                        : "border-white opacity-60 hover:opacity-100"
                                    }`}
                                  >
                                    <img
                                      src={t.avatar}
                                      alt={`Buyer from ${t.region}`}
                                      loading="lazy"
                                      className="h-full w-full object-cover object-top"
                                    />
                                  </button>
                                ))}
                              </div>
                            </div>
                          </div>
                        </motion.div>
                      </AnimatePresence>
                    </div>
                  </div>

                  {/* Trusted Master Developers Strip */}
                  {trustedCompanies.length > 0 && (
                    <div className="mt-8 border-t border-black/[0.06] pt-6 text-center">
                      <p className="font-mono text-[10.5px] font-semibold uppercase tracking-[0.18em] text-[#64748b] mb-4">
                        {trustedCompaniesTitle}
                      </p>
                      <div className="flex flex-wrap justify-center gap-2">
                        {trustedCompanies.map((company) => (
                          <span
                            key={company}
                            className="rounded-full border border-black/[0.08] bg-white/90 px-3.5 py-1.5 text-[11px] font-semibold uppercase tracking-[0.14em] text-[#0c233a]"
                          >
                            {company}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </motion.div>
            ) : null}
          </AnimatePresence>
        </div>
      </div>
    </section>
  );
}
