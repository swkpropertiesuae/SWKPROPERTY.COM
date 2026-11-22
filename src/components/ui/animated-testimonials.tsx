"use client";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Separator } from "@/components/ui/separator";
import { ArrowLeft, ArrowRight, Quote, Star } from "lucide-react";
import { motion, useAnimation, useInView } from "framer-motion";
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
  const [paused, setPaused] = useState(false);

  const sectionRef = useRef<HTMLElement>(null);
  const isInView = useInView(sectionRef, { once: true, amount: 0.15 });
  const controls = useAnimation();

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.12,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.5,
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
      setActiveIndex((current) => (current + 1) % testimonials.length);
    }, autoRotateInterval);

    return () => clearInterval(interval);
  }, [paused, autoRotateInterval, testimonials.length]);

  if (testimonials.length === 0) {
    return null;
  }

  const handlePrev = () =>
    setActiveIndex((curr) => (curr - 1 + testimonials.length) % testimonials.length);
  const handleNext = () =>
    setActiveIndex((curr) => (curr + 1) % testimonials.length);

  return (
    <section
      ref={sectionRef}
      id="testimonials"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
      className={`relative py-24 overflow-hidden bg-white/22 backdrop-blur-[2px] ${className || ""}`}
    >
      <div className="mx-auto max-w-[1260px] px-4 sm:px-8">
        <motion.div
          initial="hidden"
          animate={controls}
          variants={containerVariants}
          className="grid grid-cols-1 gap-12 w-full lg:grid-cols-12 lg:gap-16 items-center"
        >
          {/* Left side: Heading and navigation */}
          <motion.div variants={itemVariants} className="lg:col-span-5 flex flex-col justify-center">
            <div className="space-y-5">
              {badgeText && (
                <div className="inline-flex items-center gap-1.5 rounded-full border border-[#0e9f6e]/25 bg-white/88 px-3.5 py-1.5 text-xs font-semibold uppercase tracking-[0.16em] text-[#0e9f6e] shadow-xs backdrop-blur-md">
                  <Star className="h-3.5 w-3.5 fill-[#0e9f6e] text-[#0e9f6e]" />
                  <span>{badgeText}</span>
                </div>
              )}

              <h2 className="text-[32px] sm:text-[42px] md:text-[48px] font-medium leading-[1.05] tracking-[-0.04em] text-[#121212]">
                {title}
              </h2>

              <p className="max-w-[500px] text-[15px] sm:text-[16.5px] leading-[1.6] text-[#475569]">
                {subtitle}
              </p>

              {/* Controls: Prev/Next + All 10 Indicator Pills */}
              <div className="flex flex-wrap items-center gap-3 pt-3">
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
                      onClick={() => setActiveIndex(index)}
                      className={`h-2.5 cursor-pointer rounded-full transition-all duration-300 hover:scale-y-125 ${
                        activeIndex === index
                          ? "w-9 bg-[#121212]"
                          : "w-2.5 bg-[#0c233a]/25 hover:bg-[#0c233a]/60"
                      }`}
                      aria-label={`View review from ${t.name}`}
                    />
                  ))}
                </div>
              </div>
            </div>
          </motion.div>

          {/* Right side: Animated Testimonial Cards */}
          <motion.div
            variants={itemVariants}
            className="lg:col-span-7 relative min-h-[360px] sm:min-h-[390px]"
          >
            {testimonials.map((testimonial, index) => {
              const isCurrent = activeIndex === index;
              return (
                <motion.div
                  key={testimonial.id}
                  className="absolute inset-0"
                  initial={false}
                  animate={{
                    opacity: isCurrent ? 1 : 0,
                    x: isCurrent ? 0 : 70,
                    scale: isCurrent ? 1 : 0.94,
                  }}
                  transition={{ duration: 0.48, ease: [0.22, 1, 0.36, 1] }}
                  style={{
                    zIndex: isCurrent ? 10 : 0,
                    pointerEvents: isCurrent ? "auto" : "none",
                  }}
                >
                  <div className="flex h-full flex-col justify-between rounded-[28px] border border-white/90 bg-white/92 p-7 sm:p-10 shadow-[0_24px_64px_rgba(12,56,96,0.13)] backdrop-blur-2xl">
                    <div>
                      <div className="mb-6 flex items-center justify-between gap-4">
                        <div className="flex gap-1.5">
                          {Array(testimonial.rating)
                            .fill(0)
                            .map((_, i) => (
                              <Star
                                key={i}
                                className="h-4 w-4 fill-[#0e9f6e] text-[#0e9f6e]"
                              />
                            ))}
                        </div>
                        <span className="font-mono text-[11px] font-semibold uppercase tracking-[0.16em] text-[#64748b]">
                          {String(index + 1).padStart(2, "0")} / {String(testimonials.length).padStart(2, "0")}
                        </span>
                      </div>

                      <div className="relative">
                        <Quote className="absolute -top-2 -left-2 h-8 w-8 text-[#1b6aa7]/18 rotate-180" />
                        <p className="relative z-10 text-lg sm:text-[21px] font-medium leading-[1.45] tracking-[-0.02em] text-[#121212]">
                          &ldquo;{testimonial.content}&rdquo;
                        </p>
                      </div>
                    </div>

                    <div>
                      <Separator className="my-5" />
                      <div className="flex items-center justify-between gap-4">
                        <div className="flex items-center gap-4">
                          <Avatar className="h-14 w-14 border-2 border-white shadow-md">
                            <AvatarImage src={testimonial.avatar} alt={testimonial.name} />
                            <AvatarFallback>{testimonial.name.charAt(0)}</AvatarFallback>
                          </Avatar>
                          <div>
                            <h3 className="text-base font-semibold text-[#121212]">
                              {testimonial.name}
                            </h3>
                            <p className="text-xs sm:text-sm text-[#475569]">
                              {testimonial.role}
                            </p>
                            <p className="mt-0.5 text-[11px] font-semibold uppercase tracking-[0.14em] text-[#1b6aa7]">
                              {testimonial.company}
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </motion.div>
              );
            })}

            {/* Subtle luminous corner halos */}
            <div
              aria-hidden="true"
              className="pointer-events-none absolute -bottom-5 -left-5 h-24 w-24 rounded-2xl border border-white/70 bg-white/45 backdrop-blur-md"
            />
            <div
              aria-hidden="true"
              className="pointer-events-none absolute -top-5 -right-5 h-24 w-24 rounded-2xl border border-white/70 bg-white/45 backdrop-blur-md"
            />
          </motion.div>
        </motion.div>

        {/* Trusted Master Developers Strip */}
        {trustedCompanies.length > 0 && (
          <motion.div
            variants={itemVariants}
            initial="hidden"
            animate={controls}
            className="mt-20 border-t border-white/70 pt-12 text-center"
          >
            <h3 className="font-mono text-[11px] font-semibold uppercase tracking-[0.2em] text-[#475569] mb-6">
              {trustedCompaniesTitle}
            </h3>
            <div className="flex flex-wrap justify-center gap-3">
              {trustedCompanies.map((company) => (
                <span
                  key={company}
                  className="rounded-full border border-white/85 bg-white/80 px-5 py-2 text-xs font-semibold uppercase tracking-[0.16em] text-[#0c233a] shadow-xs backdrop-blur-md transition-all duration-200 hover:-translate-y-0.5 hover:border-[#121212] hover:bg-[#121212] hover:text-white"
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
