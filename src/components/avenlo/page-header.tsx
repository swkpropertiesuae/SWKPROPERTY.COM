"use client";

import React from "react";
import Link from "next/link";
import { motion, useReducedMotion } from "framer-motion";
import { cn } from "@/lib/utils";
import { SectionEyebrow } from "@/components/avenlo/motion";

export interface BreadcrumbItem {
  label: string;
  href?: string;
}

export interface AvenloPageHeaderProps {
  eyebrow: string;
  title: React.ReactNode;
  italic?: string;
  lead?: React.ReactNode;
  align?: "center" | "left";
  breadcrumb?: BreadcrumbItem[];
  meta?: React.ReactNode;
  actions?: React.ReactNode;
  compact?: boolean;
  className?: string;
}

export function AvenloPageHeader({
  eyebrow,
  title,
  italic,
  lead,
  align = "center",
  breadcrumb,
  meta,
  actions,
  compact = false,
  className,
}: AvenloPageHeaderProps) {
  const reduced = useReducedMotion();

  return (
    <section
      className={cn(
        "relative overflow-hidden bg-white bg-arch-grid-fade border-b border-black/[0.06]",
        compact ? "pt-12 pb-12 sm:pt-16 sm:pb-14" : "pt-16 pb-16 sm:pt-24 sm:pb-20",
        className
      )}
    >
      <div className="mx-auto max-w-[1260px] px-4 sm:px-8">
        {breadcrumb && breadcrumb.length > 0 ? (
          <nav
            aria-label="Breadcrumb"
            className={cn(
              "mb-6 flex flex-wrap items-center gap-2 text-[11px] font-medium uppercase tracking-[0.16em] text-[#8b8b8b]",
              align === "center" && "justify-center"
            )}
          >
            {breadcrumb.map((item, idx) => (
              <React.Fragment key={`${item.label}-${idx}`}>
                {idx > 0 ? <span aria-hidden="true">/</span> : null}
                {item.href ? (
                  <Link href={item.href} className="hover:text-[#121212] transition-colors">
                    {item.label}
                  </Link>
                ) : (
                  <span className="text-[#121212]">{item.label}</span>
                )}
              </React.Fragment>
            ))}
          </nav>
        ) : null}

        <div
          className={cn(
            align === "center" ? "mx-auto max-w-4xl text-center" : "max-w-4xl text-left"
          )}
        >
          <SectionEyebrow align={align}>{eyebrow}</SectionEyebrow>

          <motion.h1
            initial={reduced ? false : { opacity: 0, y: 12, filter: "blur(8px)" }}
            animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
            transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
            className="mt-5 text-[38px] sm:text-[56px] md:text-[74px] font-medium leading-[1.01] tracking-[-0.045em] text-[#121212]"
          >
            <span>{title}</span>
            {italic ? (
              <>
                {" "}
                <span className="italic font-light text-[#121212]/90">{italic}</span>
              </>
            ) : null}
          </motion.h1>

          {meta ? (
            <div
              className={cn(
                "mt-5 flex flex-wrap items-center gap-x-4 gap-y-2 text-sm font-medium text-[#525252]",
                align === "center" && "justify-center"
              )}
            >
              {meta}
            </div>
          ) : null}

          {lead ? (
            <p
              className={cn(
                "mt-5 text-[15px] sm:text-[17px] leading-[1.6] text-[#525252]",
                align === "center" ? "mx-auto max-w-2xl" : "max-w-2xl"
              )}
            >
              {lead}
            </p>
          ) : null}

          {actions ? (
            <div
              className={cn(
                "mt-9 flex flex-wrap items-center gap-4",
                align === "center" && "justify-center"
              )}
            >
              {actions}
            </div>
          ) : null}
        </div>
      </div>
    </section>
  );
}
