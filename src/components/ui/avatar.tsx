"use client";

import * as React from "react";
import { cn } from "@/lib/utils";

export function Avatar({
  className,
  children,
  ...props
}: React.HTMLAttributes<HTMLSpanElement>) {
  return (
    <span
      data-slot="avatar"
      className={cn(
        "relative flex h-10 w-10 shrink-0 overflow-hidden rounded-full bg-[#f1f5f9]",
        className
      )}
      {...props}
    >
      {children}
    </span>
  );
}

export function AvatarImage({
  className,
  src,
  alt = "",
  ...props
}: React.ImgHTMLAttributes<HTMLImageElement>) {
  const [failedSrc, setFailedSrc] = React.useState<string | Blob | undefined>(undefined);

  if (!src || failedSrc === src) return null;

  return (
    <img
      data-slot="avatar-image"
      src={src}
      alt={alt}
      loading="lazy"
      onError={() => setFailedSrc(src)}
      className={cn("absolute inset-0 z-10 aspect-square h-full w-full object-cover object-top", className)}
      {...props}
    />
  );
}

export function AvatarFallback({
  className,
  children,
  ...props
}: React.HTMLAttributes<HTMLSpanElement>) {
  return (
    <span
      data-slot="avatar-fallback"
      className={cn(
        "flex h-full w-full items-center justify-center rounded-full bg-[#0c233a] text-xs font-semibold text-white",
        className
      )}
      {...props}
    >
      {children}
    </span>
  );
}
