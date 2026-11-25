"use client";

import React from "react";
import Link from "next/link";
import { ArrowUpRight, Bath, BedDouble, Expand, Heart, Scale } from "lucide-react";
import { type PropertyListing, isPermitVerified, permitLabel } from "@/lib/listings";
import { usePrefs } from "@/lib/prefs";
import { SITE } from "@/lib/swk";
import { WhatsAppIcon } from "@/components/site/whatsapp-icon";
import { SpotlightCard } from "@/components/ui/spotlight-card";

/**
 * 21st.dev Property Preview Card (@shadcnspace/card-02) + SWK Live Currency/Area Engine
 * Luminous frosted-glass card over Mesh Drift background, dramatic image zoom + hover
 * circular arrow reveal, emerald AED price pill, and structured Bed/Bath/Area divider strip.
 */
export function PropertyCard({
  listing,
  featured = false,
}: {
  listing: PropertyListing;
  featured?: boolean;
}) {
  const {
    formatPrice,
    formatArea,
    savedSlugs,
    toggleSaved,
    compareSlugs,
    toggleCompare,
    trackEvent,
  } = usePrefs();

  const isSaved = savedSlugs.includes(listing.slug);
  const isCompared = compareSlugs.includes(listing.slug);

  const waMessage = encodeURIComponent(
    `Hello SWK Properties, I am enquiring about ${listing.title} in ${listing.community} (Ref: ${listing.reference}${
      permitLabel(listing) ? `, ${permitLabel(listing)}` : ""
    }). Please share current availability.`
  );

  const dotColor =
    listing.purpose === "off-plan"
      ? "bg-[#51fec0]"
      : listing.status === "sold" || listing.status === "rented"
      ? "bg-[#dc2626]"
      : listing.status === "reserved"
      ? "bg-[#a5ce3a]"
      : "bg-[#62c584]";

  const statusText =
    listing.purpose === "off-plan"
      ? "Off-Plan Launch"
      : listing.purpose === "rent"
      ? `For Rent · ${listing.rentalPeriod === "monthly" ? "Monthly" : "Yearly"}`
      : "For Sale · Ready";

  const bedroomLabel =
    listing.propertyType === "Office"
      ? "Commercial"
      : listing.bedrooms === 0
      ? "Studio"
      : `${listing.bedrooms} ${listing.bedrooms === 1 ? "Bed" : "Beds"}`;

  return (
    <SpotlightCard>
      <article className="group flex h-full flex-col">
        {/* 21st.dev Hover-Zoom Architectural Photo Frame + Floating Reveal Arrow */}
        <div
          className={`relative w-full overflow-hidden bg-[#e7f2f9] ${
            featured ? "aspect-[16/10]" : "aspect-[4/3]"
          }`}
        >
          <Link href={`/properties/${listing.slug}`} className="block h-full w-full">
            <img
              src={listing.images?.[0] || "/og-default.jpg"}
              alt={listing.title}
              loading="lazy"
              className="h-full w-full object-cover transition-all duration-700 ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:scale-110 group-hover:brightness-[0.82]"
            />
          </Link>

          {/* Top Left Status Pill */}
          <div className="pointer-events-none absolute top-3.5 left-3.5 flex flex-wrap items-center gap-1.5">
            <span className="inline-flex items-center gap-2 rounded-full bg-[#0b1623]/82 px-3 py-1 text-[10px] font-medium uppercase tracking-[0.16em] text-white backdrop-blur-md">
              <span className={`h-1.5 w-1.5 rounded-[2px] ${dotColor}`} aria-hidden="true" />
              {statusText}
            </span>
            {listing.isRender ? (
              <span className="rounded-full bg-white/90 px-2.5 py-1 text-[10px] font-medium text-[#121212] backdrop-blur-md">
                Developer Render
              </span>
            ) : null}
          </div>

          {/* Top Right Save & Compare Controls */}
          <div className="absolute top-3.5 right-3.5 flex items-center gap-1.5">
            <button
              type="button"
              onClick={() => toggleSaved(listing.slug)}
              aria-pressed={isSaved}
              aria-label={isSaved ? "Remove from shortlist" : "Save to shortlist"}
              className={`flex h-8 w-8 cursor-pointer items-center justify-center rounded-full backdrop-blur-md transition-colors ${
                isSaved
                  ? "bg-[#121212] text-[#51fec0]"
                  : "bg-white/90 text-[#121212] hover:bg-[#121212] hover:text-white"
              }`}
            >
              <Heart className="h-3.5 w-3.5" fill={isSaved ? "currentColor" : "none"} />
            </button>
            <button
              type="button"
              onClick={() => toggleCompare(listing.slug)}
              aria-pressed={isCompared}
              aria-label={isCompared ? "Remove from comparison" : "Compare property"}
              className={`flex h-8 w-8 cursor-pointer items-center justify-center rounded-full backdrop-blur-md transition-colors ${
                isCompared
                  ? "bg-[#121212] text-[#51fec0]"
                  : "bg-white/90 text-[#121212] hover:bg-[#121212] hover:text-white"
              }`}
            >
              <Scale className="h-3.5 w-3.5" />
            </button>
          </div>

          {/* 21st.dev Floating Circular Reveal Arrow on Hover */}
          <Link
            href={`/properties/${listing.slug}`}
            aria-label={`Open ${listing.title}`}
            className="absolute bottom-3.5 right-3.5 flex h-11 w-11 translate-y-2 items-center justify-center rounded-full bg-white text-[#121212] opacity-0 shadow-lg transition-all duration-300 group-hover:translate-y-0 group-hover:opacity-100 focus-visible:translate-y-0 focus-visible:opacity-100 hover:bg-[#51fec0]"
          >
            <ArrowUpRight className="h-4 w-4" />
          </Link>
        </div>

        {/* 21st.dev Card Body: Title + Price Pill + Structured Icon Spec Strip */}
        <div className="flex flex-1 flex-col justify-between p-5 sm:p-6">
          <div>
            <div className="flex items-center justify-between gap-2 text-[10.5px] font-semibold uppercase tracking-[0.16em] text-[#1b6aa7]">
              <span className="truncate">{listing.community}</span>
              <span className="shrink-0 font-mono text-[10px] text-[#64748b]">{listing.reference}</span>
            </div>

            <div className="mt-2.5 flex flex-col gap-2.5">
              <div className="min-w-0">
                <Link
                  href={`/properties/${listing.slug}`}
                  className="block text-[19px] sm:text-[21px] font-medium leading-[1.2] tracking-[-0.025em] text-[#121212] transition-colors group-hover:text-[#0e9f6e]"
                >
                  {listing.title}
                </Link>
                <p className="mt-1 truncate text-xs text-[#64748b]">
                  {listing.building} · {listing.developer}
                </p>
              </div>

              {/* 21st.dev Signature Price Pill (wraps cleanly across all currency conversions) */}
              <div className="inline-flex w-fit max-w-full flex-wrap items-baseline gap-1.5 rounded-2xl border border-[#0e9f6e]/20 bg-[#0e9f6e]/10 px-3 py-1.5">
                <span className="text-sm font-semibold tracking-[-0.02em] text-[#0b7a55] tabular-nums">
                  {formatPrice(listing.priceAed, { compact: true })}
                </span>
                {listing.purpose === "rent" ? (
                  <span className="text-[9.5px] font-medium uppercase tracking-[0.12em] text-[#0b7a55]/75">
                    / {listing.rentalPeriod === "monthly" ? "mo" : "yr"}
                  </span>
                ) : null}
              </div>
            </div>

            {/* 21st.dev 3-Column Icon Spec Divider Row */}
            <div className="mt-5 grid grid-cols-3 divide-x divide-black/[0.08] rounded-xl border border-black/[0.06] bg-white/70 py-3">
              <div className="flex flex-col items-center gap-1 px-2 text-center">
                <BedDouble className="h-4 w-4 text-[#1b6aa7]" aria-hidden="true" />
                <span className="text-[11.5px] font-medium text-[#121212] tabular-nums">
                  {bedroomLabel}
                </span>
              </div>
              <div className="flex flex-col items-center gap-1 px-2 text-center">
                <Bath className="h-4 w-4 text-[#1b6aa7]" aria-hidden="true" />
                <span className="text-[11.5px] font-medium text-[#121212] tabular-nums">
                  {listing.bathrooms} {listing.bathrooms === 1 ? "Bath" : "Baths"}
                </span>
              </div>
              <div className="flex flex-col items-center gap-1 px-2 text-center">
                <Expand className="h-4 w-4 text-[#1b6aa7]" aria-hidden="true" />
                <span className="text-[11.5px] font-medium text-[#121212] tabular-nums truncate max-w-full">
                  {formatArea(listing.areaSqFt)}
                </span>
              </div>
            </div>

            {/* Permit Honesty & Payment Plan */}
            <div className="mt-3.5 flex flex-wrap items-center justify-between gap-2 text-[11px] text-[#64748b]">
              <span>
                {isPermitVerified(listing)
                  ? permitLabel(listing)
                  : "Permit details on request"}
              </span>
              <span className="font-medium text-[#121212]">
                {listing.paymentPlan ? listing.paymentPlan.split(" (")[0] : listing.handover}
              </span>
            </div>
          </div>

          {/* Footer Actions */}
          <div className="mt-5 flex items-center justify-between gap-3 border-t border-black/[0.06] pt-4">
            <Link
              href={`/properties/${listing.slug}`}
              className="inline-flex items-center gap-1.5 text-xs font-medium uppercase tracking-[0.14em] text-[#121212] hover:text-[#0e9f6e] transition-colors"
            >
              <span>View Residence</span>
              <ArrowUpRight className="h-3.5 w-3.5" />
            </Link>
            <a
              href={`https://wa.me/${SITE.phoneRaw.replace("+", "")}?text=${waMessage}`}
              target="_blank"
              rel="noopener noreferrer"
              onClick={() =>
                trackEvent("whatsapp_click", {
                  location: "property_card",
                  propertyRef: listing.reference,
                })
              }
              className="inline-flex items-center gap-1.5 rounded-full border border-black/10 bg-white/90 px-3.5 py-1.5 text-[11px] font-medium text-[#121212] transition-colors hover:bg-[#121212] hover:text-white"
            >
              <WhatsAppIcon className="h-3.5 w-3.5 text-[#0e9f6e]" />
              <span>WhatsApp</span>
            </a>
          </div>
        </div>
      </article>
    </SpotlightCard>
  );
}
