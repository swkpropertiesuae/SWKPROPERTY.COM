"use client";

import React from "react";
import Link from "next/link";
import { cn } from "@/lib/utils";

type BracketVariant = "light" | "dark" | "white";
type BracketSize = "sm" | "md" | "lg";

interface SharedProps {
  children: React.ReactNode;
  variant?: BracketVariant;
  size?: BracketSize;
  fullWidth?: boolean;
  className?: string;
}

const SIZE_CLASSES: Record<BracketSize, string> = {
  sm: "px-5 py-2.5 text-[11px] tracking-[0.14em]",
  md: "px-7 py-3.5 text-[12px] tracking-[0.14em]",
  lg: "px-9 py-4 text-[12px] tracking-[0.16em]",
};

const SURFACE_CLASSES: Record<BracketVariant, string> = {
  light:
    "bg-white/90 text-[#121212] backdrop-blur-md shadow-[0_10px_28px_rgba(12,56,96,0.1)] hover:-translate-y-0.5 hover:bg-[#121212] hover:text-white hover:shadow-[0_16px_36px_rgba(12,35,58,0.28)] active:translate-y-0 active:scale-[0.98]",
  dark:
    "bg-[#121212]/88 text-white backdrop-blur-md hover:-translate-y-0.5 hover:bg-[#51fec0] hover:text-[#0a1624] hover:shadow-[0_14px_34px_rgba(81,254,192,0.3)] active:translate-y-0 active:scale-[0.98]",
  white:
    "bg-white text-[#121212] shadow-[0_10px_28px_rgba(0,0,0,0.2)] hover:-translate-y-0.5 hover:bg-[#51fec0] hover:text-[#0a1624] hover:shadow-[0_16px_38px_rgba(81,254,192,0.34)] active:translate-y-0 active:scale-[0.98]",
};

const BRACKET_BORDER: Record<BracketVariant, string> = {
  light: "border-[#0b2640]/35 group-hover/brk:border-[#51fec0]",
  dark: "border-white/45 group-hover/brk:border-[#51fec0]",
  white: "border-white/60 group-hover/brk:border-[#51fec0]",
};

function CornerTicks({ variant }: { variant: BracketVariant }) {
  const color = BRACKET_BORDER[variant];
  return (
    <>
      <span
        aria-hidden="true"
        className={cn(
          "pointer-events-none absolute -top-[4px] -left-[4px] h-[8px] w-[8px] border-t-2 border-l-2 transition-all duration-300 ease-out group-hover/brk:-top-[6px] group-hover/brk:-left-[6px]",
          color
        )}
      />
      <span
        aria-hidden="true"
        className={cn(
          "pointer-events-none absolute -top-[4px] -right-[4px] h-[8px] w-[8px] border-t-2 border-r-2 transition-all duration-300 ease-out group-hover/brk:-top-[6px] group-hover/brk:-right-[6px]",
          color
        )}
      />
      <span
        aria-hidden="true"
        className={cn(
          "pointer-events-none absolute -bottom-[4px] -left-[4px] h-[8px] w-[8px] border-b-2 border-l-2 transition-all duration-300 ease-out group-hover/brk:-bottom-[6px] group-hover/brk:-left-[6px]",
          color
        )}
      />
      <span
        aria-hidden="true"
        className={cn(
          "pointer-events-none absolute -bottom-[4px] -right-[4px] h-[8px] w-[8px] border-b-2 border-r-2 transition-all duration-300 ease-out group-hover/brk:-bottom-[6px] group-hover/brk:-right-[6px]",
          color
        )}
      />
    </>
  );
}

export interface BracketLinkProps extends SharedProps {
  href: string;
  external?: boolean;
  onClick?: () => void;
  ariaLabel?: string;
}

export function BracketLink({
  href,
  external,
  onClick,
  ariaLabel,
  children,
  variant = "light",
  size = "md",
  fullWidth = false,
  className,
}: BracketLinkProps) {
  const innerClass = cn(
    "group/brk relative inline-flex items-center justify-center gap-2 font-medium uppercase whitespace-nowrap transition-all duration-300 ease-[cubic-bezier(0.22,1,0.36,1)] focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#121212]",
    SIZE_CLASSES[size],
    SURFACE_CLASSES[variant],
    fullWidth && "w-full",
    className
  );

  if (external) {
    return (
      <a
        href={href}
        target="_blank"
        rel="noopener noreferrer"
        onClick={onClick}
        aria-label={ariaLabel}
        className={innerClass}
      >
        <CornerTicks variant={variant} />
        <span>{children}</span>
      </a>
    );
  }

  return (
    <Link href={href} onClick={onClick} aria-label={ariaLabel} className={innerClass}>
      <CornerTicks variant={variant} />
      <span>{children}</span>
    </Link>
  );
}

export interface BracketButtonProps extends SharedProps {
  type?: "button" | "submit" | "reset";
  disabled?: boolean;
  onClick?: React.MouseEventHandler<HTMLButtonElement>;
  ariaLabel?: string;
}

export function BracketButton({
  type = "button",
  disabled,
  onClick,
  ariaLabel,
  children,
  variant = "light",
  size = "md",
  fullWidth = false,
  className,
}: BracketButtonProps) {
  return (
    <button
      type={type}
      disabled={disabled}
      onClick={onClick}
      aria-label={ariaLabel}
      className={cn(
        "group/brk relative inline-flex cursor-pointer items-center justify-center gap-2 font-medium uppercase whitespace-nowrap transition-all duration-300 ease-[cubic-bezier(0.22,1,0.36,1)] disabled:cursor-not-allowed disabled:opacity-50 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#121212]",
        SIZE_CLASSES[size],
        SURFACE_CLASSES[variant],
        fullWidth && "w-full",
        className
      )}
    >
      <CornerTicks variant={variant} />
      <span>{children}</span>
    </button>
  );
}
