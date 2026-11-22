"use client";

import React, { useRef } from "react";
import { motion, useScroll, useTransform, useReducedMotion, type MotionValue } from "framer-motion";
import { cn } from "@/lib/utils";
import { BracketLink } from "@/components/avenlo/bracket-button";

export function SectionEyebrow({
  children,
  tone = "light",
  align = "left",
  className,
}: {
  children: React.ReactNode;
  tone?: "light" | "dark";
  align?: "left" | "center";
  className?: string;
}) {
  return (
    <div
      className={cn(
        "inline-flex items-center gap-2.5 text-[11px] sm:text-[12px] font-medium uppercase tracking-[0.22em]",
        tone === "dark" ? "text-white/80" : "text-[#121212]/80",
        align === "center" && "justify-center",
        className
      )}
    >
      <span
        aria-hidden="true"
        className={cn(
          "inline-block h-[5px] w-[5px] shrink-0",
          tone === "dark" ? "bg-white" : "bg-[#121212]"
        )}
      />
      <span>{children}</span>
    </div>
  );
}

export function SplitHeading({
  primary,
  muted,
  as: Tag = "h2",
  tone = "light",
  align = "left",
  size = "lg",
  inline = false,
  className,
}: {
  primary: React.ReactNode;
  muted?: React.ReactNode;
  as?: "h2" | "h3";
  tone?: "light" | "dark";
  align?: "left" | "center";
  size?: "md" | "lg";
  inline?: boolean;
  className?: string;
}) {
  const sizeClass =
    size === "lg"
      ? "text-[32px] sm:text-[42px] md:text-[52px] leading-[1.05] tracking-[-0.04em]"
      : "text-[26px] sm:text-[32px] md:text-[40px] leading-[1.08] tracking-[-0.035em]";

  return (
    <Tag
      className={cn(
        "font-medium",
        sizeClass,
        align === "center" && "text-center",
        tone === "dark" ? "text-white" : "text-[#121212]",
        className
      )}
    >
      <span className={inline ? "inline" : "block"}>{primary}</span>
      {muted ? (
        <span
          className={cn(
            inline ? "inline ml-2" : "block",
            "text-[#8b8b8b]"
          )}
        >
          {muted}
        </span>
      ) : null}
    </Tag>
  );
}

export function BlurReveal({
  children,
  delay = 0,
  className,
}: {
  children: React.ReactNode;
  delay?: number;
  className?: string;
}) {
  const reduced = useReducedMotion();
  if (reduced) {
    return <div className={className}>{children}</div>;
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 14, filter: "blur(8px)" }}
      whileInView={{ opacity: 1, y: 0, filter: "blur(0px)" }}
      viewport={{ once: true, margin: "-40px" }}
      transition={{ duration: 0.65, delay, ease: [0.22, 1, 0.36, 1] }}
      className={className}
    >
      {children}
    </motion.div>
  );
}

function ScrollWord({
  word,
  range,
  progress,
}: {
  word: string;
  range: [number, number];
  progress: MotionValue<number>;
}) {
  const opacity = useTransform(progress, range, [0.24, 1]);
  return (
    <span className="relative mr-[0.26em] inline-block">
      <span className="text-[#8b8b8b]/45" aria-hidden="true">
        {word}
      </span>
      <motion.span
        style={{ opacity }}
        className="absolute inset-0 text-[#121212]"
      >
        {word}
      </motion.span>
    </span>
  );
}

export function ScrollRevealStatement({
  text,
  className,
}: {
  text: string;
  className?: string;
}) {
  const ref = useRef<HTMLParagraphElement>(null);
  const reduced = useReducedMotion();
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start 0.88", "end 0.45"],
  });

  const words = text.split(" ");

  if (reduced) {
    return (
      <p
        className={cn(
          "text-[28px] sm:text-[38px] md:text-[48px] font-medium leading-[1.15] tracking-[-0.04em] text-[#121212]",
          className
        )}
      >
        {text}
      </p>
    );
  }

  return (
    <p
      ref={ref}
      className={cn(
        "flex flex-wrap text-[28px] sm:text-[38px] md:text-[48px] font-medium leading-[1.16] tracking-[-0.04em]",
        className
      )}
    >
      {words.map((word, idx) => {
        const start = idx / words.length;
        const end = Math.min(1, start + 1 / words.length + 0.08);
        return (
          <ScrollWord
            key={`${word}-${idx}`}
            word={word}
            range={[start, end]}
            progress={scrollYProgress}
          />
        );
      })}
    </p>
  );
}

export function LiveStatusDot({
  label,
  tone = "launch",
  surface = "dark",
  className,
}: {
  label: string;
  tone?: "launch" | "sale" | "offer" | "sold";
  surface?: "light" | "dark";
  className?: string;
}) {
  const dotColor =
    tone === "launch"
      ? "bg-[#51fec0]"
      : tone === "sale"
      ? "bg-[#62c584]"
      : tone === "offer"
      ? "bg-[#a5ce3a]"
      : "bg-[#dc2626]";

  return (
    <span
      className={cn(
        "inline-flex items-center gap-2 text-[11px] font-medium uppercase tracking-[0.2em]",
        surface === "dark" ? "text-white/90" : "text-[#121212]/80",
        className
      )}
    >
      <span className={cn("h-2 w-2 shrink-0 rounded-[2px]", dotColor)} aria-hidden="true" />
      <span>{label}</span>
    </span>
  );
}

export function CtaBanner({
  eyebrow = "GET STARTED",
  primary = "Your next Dubai address",
  italic = "starts here",
  primaryHref = "/contact",
  primaryLabel = "Book a Call",
  secondaryHref = "/calculators",
  secondaryLabel = "Calculate Costs",
  image = "/img/hero/dubai-skyline-hero.webp",
}: {
  eyebrow?: string;
  primary?: string;
  italic?: string;
  primaryHref?: string;
  primaryLabel?: string;
  secondaryHref?: string;
  secondaryLabel?: string;
  image?: string;
}) {
  return (
    <section className="relative overflow-hidden bg-[#121212]">
      <div className="relative mx-auto flex min-h-[500px] md:min-h-[580px] w-full items-center justify-center px-4 py-24 sm:px-8">
        <img
          src={image}
          alt="Dubai skyline twilight architectural panorama"
          loading="lazy"
          className="absolute inset-0 h-full w-full object-cover object-center opacity-50"
        />
        <div
          aria-hidden="true"
          className="absolute inset-0 bg-gradient-to-b from-[#121212]/60 via-[#121212]/55 to-[#121212]"
        />

        <div className="relative z-10 mx-auto max-w-4xl text-center">
          <SectionEyebrow tone="dark" align="center">
            {eyebrow}
          </SectionEyebrow>
          <h2 className="mt-6 text-[38px] sm:text-[52px] md:text-[66px] font-medium leading-[1.02] tracking-[-0.045em] text-white">
            {primary}{" "}
            <span className="italic font-light text-white/95">{italic}</span>
          </h2>
          <p className="mx-auto mt-5 max-w-xl text-sm sm:text-base text-white/75 leading-relaxed">
            Direct developer allocations, secondary transfers, and transparent DLD cost breakdowns from our Sheikh Zayed Road advisory desk.
          </p>
          <div className="mt-10 flex flex-wrap items-center justify-center gap-5">
            <BracketLink href={primaryHref} variant="white" size="lg">
              {primaryLabel}
            </BracketLink>
            {secondaryHref && secondaryLabel ? (
              <BracketLink href={secondaryHref} variant="dark" size="lg">
                {secondaryLabel}
              </BracketLink>
            ) : null}
          </div>
        </div>
      </div>
    </section>
  );
}
