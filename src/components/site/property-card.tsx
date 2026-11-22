"use client";

import React from "react";
import Link from "next/link";
import { ArrowUpRight, Heart, Scale } from "lucide-react";
import { type PropertyListing, isPermitVerified, permitLabel } from "@/lib/listings";
import { usePrefs } from "@/lib/prefs";
import { SITE } from "@/lib/swk";
import { WhatsAppIcon } from "@/components/site/whatsapp-icon";
import { SpotlightCard } from "@/components/ui/spotlight-card";

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

  return (
    <SpotlightCard>
      <article className="group flex h-full flex-col">
      {/* Architectural Photo Frame */}
      <div
        className={`relative w-full overflow-hidden bg-[#f5f5f5] ${
          featured ? "aspect-[16/10]" : "aspect-[4/3]"
        }`}
      >
        <Link href={`/properties/${listing.slug}`} className="block h-full w-full">
          <img
            src={listing.images[0]}
            alt={listing.title}
            loading="lazy"
            className="h-full w-full object-cover transition-transform duration-700 ease-out group-hover:scale-[1.04]"
          />
        </Link>

        {/* Top Left Status Pill */}
        <div className="pointer-events-none absolute top-3.5 left-3.5 flex flex-wrap items-center gap-1.5">
          <span className="inline-flex items-center gap-2 rounded-full bg-[#121212]/82 px-3 py-1 text-[10px] font-medium uppercase tracking-[0.16em] text-white backdrop-blur-md">
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
            aria-label="Compare property"
            className={`flex h-8 w-8 cursor-pointer items-center justify-center rounded-full backdrop-blur-md transition-colors ${
              isCompared
                ? "bg-[#121212] text-[#51fec0]"
                : "bg-white/90 text-[#121212] hover:bg-[#121212] hover:text-white"
            }`}
          >
            <Scale className="h-3.5 w-3.5" />
          </button>
        </div>
      </div>

      {/* Clean Avenlo Editorial Body */}
      <div className="flex flex-1 flex-col justify-between p-5 sm:p-6">
        <div>
          <div className="flex items-center justify-between gap-2 text-[11px] font-medium uppercase tracking-[0.16em] text-[#8b8b8b]">
            <span className="truncate">{listing.community}</span>
            <span className="shrink-0 font-mono text-[10px]">{listing.reference}</span>
          </div>

          <Link
            href={`/properties/${listing.slug}`}
            className="mt-2 block text-[20px] sm:text-[22px] font-medium leading-[1.2] tracking-[-0.025em] text-[#121212] transition-colors group-hover:text-[#525252]"
          >
            {listing.title}
          </Link>

          <p className="mt-1.5 truncate text-xs text-[#737373]">
            {listing.building} · {listing.developer}
          </p>

          {/* Price + Area Row */}
          <div className="mt-4 flex flex-wrap items-baseline justify-between gap-2 border-t border-black/[0.06] pt-4">
            <div className="text-lg font-medium tracking-[-0.02em] text-[#121212] tabular-nums">
              {formatPrice(listing.priceAed)}
              {listing.purpose === "rent" ? (
                <span className="ml-1 text-xs font-normal text-[#8b8b8b]">
                  / {listing.rentalPeriod === "monthly" ? "mo" : "yr"}
                </span>
              ) : null}
            </div>
            <div className="text-xs font-medium text-[#525252] tabular-nums">
              {listing.propertyType === "Office"
                ? "Commercial Suite"
                : listing.bedrooms === 0
                  ? "Studio"
                  : `${listing.bedrooms} Bed`}{" "}
              · {listing.bathrooms} Bath · {formatArea(listing.areaSqFt)}
            </div>
          </div>

          {/* Permit Honesty & Payment Plan */}
          <div className="mt-3 flex flex-wrap items-center justify-between gap-2 text-[11px] text-[#8b8b8b]">
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
            className="inline-flex items-center gap-1.5 rounded-full border border-black/10 bg-[#f7f7f7] px-3.5 py-1.5 text-[11px] font-medium text-[#121212] transition-colors hover:bg-[#121212] hover:text-white"
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
