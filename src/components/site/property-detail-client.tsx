"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import {
  Check,
  ExternalLink,
  Heart,
  Scale,
  Share2,
  ShieldCheck,
} from "lucide-react";
import { type PropertyListing, isPermitVerified, permitLabel } from "@/lib/listings";
import { communityHref } from "@/lib/communities";
import { EnquiryForm } from "@/components/site/enquiry-form";
import { PropertyCard } from "@/components/site/property-card";
import { usePrefs } from "@/lib/prefs";
import { SITE } from "@/lib/swk";
import { MapEmbed } from "@/components/site/map-embed";
import { AvenloPageHeader } from "@/components/avenlo/page-header";
import { BracketLink } from "@/components/avenlo/bracket-button";
import { SectionEyebrow, SplitHeading, CtaBanner } from "@/components/avenlo/motion";

export function PropertyDetailClient({
  listing,
  similarListings,
}: {
  listing: PropertyListing;
  similarListings: PropertyListing[];
}) {
  const {
    formatPrice,
    formatArea,
    savedSlugs,
    toggleSaved,
    compareSlugs,
    toggleCompare,
    trackEvent,
    notify,
  } = usePrefs();

  const [activeTab, setActiveTab] = useState<"layout" | "specs" | "dld">("layout");
  const [activeImage, setActiveImage] = useState(0);

  useEffect(() => {
    trackEvent("property_view", {
      propertyRef: listing.reference,
      community: listing.community,
      purpose: listing.purpose,
      priceAed: listing.priceAed,
    });
  }, [listing, trackEvent]);

  const isSaved = savedSlugs.includes(listing.slug);
  const isCompared = compareSlugs.includes(listing.slug);
  const verified = isPermitVerified(listing);

  const handleShare = async () => {
    try {
      const url = window.location.href;
      if (navigator.share) {
        await navigator.share({ title: listing.title, url });
      } else {
        await navigator.clipboard.writeText(url);
        notify("Residence link copied");
      }
    } catch {
      // cancelled
    }
  };

  const allAmenities = [...listing.amenities, ...listing.features, ...listing.views].slice(0, 16);

  return (
    <div className="bg-transparent">
      {/* Avenlo Centered Residence Header */}
      <AvenloPageHeader
        eyebrow={`${listing.community}, Dubai`}
        title={listing.title}
        breadcrumb={[
          { label: "Home", href: "/" },
          { label: "Properties", href: "/properties" },
          { label: listing.community, href: communityHref(listing.communitySlug) },
        ]}
        meta={
          <>
            <span>{formatArea(listing.areaSqFt)}</span>
            <span className="text-[#cfcfcf]">·</span>
            <span className="text-[#121212] font-semibold">
              {formatPrice(listing.priceAed)}
              {listing.purpose === "rent"
                ? ` / ${listing.rentalPeriod === "monthly" ? "month" : "year"}`
                : ""}
            </span>
            <span className="text-[#cfcfcf]">·</span>
            <span className="font-mono text-xs text-[#8b8b8b]">{listing.reference}</span>
          </>
        }
        actions={
          <>
            <BracketLink href="#enquire" variant="light" size="md">
              Talk to an Agent
            </BracketLink>
            <BracketLink href="/calculators" variant="light" size="md">
              See Mortgage Details
            </BracketLink>
            <div className="flex items-center gap-2 ml-1">
              <button
                type="button"
                onClick={() => toggleSaved(listing.slug)}
                aria-label="Save property"
                className={`inline-flex h-10 w-10 cursor-pointer items-center justify-center rounded-full border transition-colors ${
                  isSaved
                    ? "border-[#121212] bg-[#121212] text-[#51fec0]"
                    : "border-black/12 bg-white text-[#121212] hover:bg-[#f7f7f7]"
                }`}
              >
                <Heart className="h-4 w-4" fill={isSaved ? "currentColor" : "none"} />
              </button>
              <button
                type="button"
                onClick={() => toggleCompare(listing.slug)}
                aria-label="Compare property"
                className={`inline-flex h-10 w-10 cursor-pointer items-center justify-center rounded-full border transition-colors ${
                  isCompared
                    ? "border-[#121212] bg-[#121212] text-[#51fec0]"
                    : "border-black/12 bg-white text-[#121212] hover:bg-[#f7f7f7]"
                }`}
              >
                <Scale className="h-4 w-4" />
              </button>
              <button
                type="button"
                onClick={handleShare}
                aria-label="Share property"
                className="inline-flex h-10 w-10 cursor-pointer items-center justify-center rounded-full border border-black/12 bg-white text-[#121212] hover:bg-[#f7f7f7]"
              >
                <Share2 className="h-4 w-4" />
              </button>
            </div>
          </>
        }
      />

      {/* Full-Width Hero Residence Image + 4-Stat Architectural Bar */}
      <section className="mx-auto max-w-[1260px] px-4 py-10 sm:px-8 sm:py-14">
        <div className="relative overflow-hidden rounded-2xl bg-[#f5f5f5]">
          <img
            src={listing.images[activeImage] ?? listing.images[0]}
            alt={listing.title}
            className="h-[340px] sm:h-[520px] md:h-[620px] w-full object-cover"
          />
          {listing.isRender ? (
            <span className="absolute bottom-4 left-4 rounded-full bg-[#121212]/80 px-3.5 py-1.5 text-[11px] font-medium text-white backdrop-blur-md">
              Developer Architectural Render
            </span>
          ) : null}
        </div>

        {/* 4-Stat Bar */}
        <div className="mt-6 grid grid-cols-2 gap-4 sm:grid-cols-4">
          {[
            {
              label: "Bedrooms & Baths",
              value: `${listing.bedrooms === 0 ? "Studio" : `${listing.bedrooms} BR`} · ${listing.bathrooms} Bath`,
            },
            { label: "Total Area", value: formatArea(listing.areaSqFt) },
            { label: "Completion", value: listing.handover },
            {
              label: "Est. Service Charge",
              value: `AED ${listing.serviceChargePerSqFt}/sq ft`,
            },
          ].map((stat) => (
            <div
              key={stat.label}
              className="rounded-2xl border border-white/80 bg-white/80 backdrop-blur-xl shadow-[0_14px_40px_rgba(12,56,96,0.08)] p-5"
            >
              <p className="text-[11px] font-medium uppercase tracking-[0.18em] text-[#8b8b8b]">
                {stat.label}
              </p>
              <p className="mt-2 text-lg font-medium tracking-[-0.02em] text-[#121212]">
                {stat.value}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* Editorial Narrative & Key Highlights */}
      <section className="mx-auto max-w-[1260px] px-4 py-12 sm:px-8">
        <div className="grid grid-cols-1 gap-12 lg:grid-cols-12">
          <div className="lg:col-span-7 space-y-5">
            <SectionEyebrow>THE RESIDENCE</SectionEyebrow>
            <h2 className="text-3xl sm:text-4xl font-medium tracking-[-0.035em] text-[#121212]">
              {listing.subtitle}
            </h2>
            <div className="space-y-4 text-[16px] leading-[1.7] text-[#4a4a4a]">
              {listing.description.map((para, idx) => (
                <p key={idx}>{para}</p>
              ))}
            </div>
          </div>

          <div className="lg:col-span-5">
            <div className="rounded-2xl border border-white/80 bg-white/80 backdrop-blur-xl shadow-[0_14px_40px_rgba(12,56,96,0.08)] p-6 sm:p-8 space-y-5">
              <p className="text-[11px] font-medium uppercase tracking-[0.2em] text-[#8b8b8b]">
                KEY PARTICULARS
              </p>
              <dl className="divide-y divide-black/[0.08] text-sm">
                {[
                  ["Developer", listing.developer],
                  ["Building", listing.building],
                  ["Property Type", listing.propertyType],
                  ["Furnishing", listing.furnished],
                  ["Parking", `${listing.parkingSpaces} allocated space(s)`],
                  ["Pet Policy", listing.petPolicy],
                  ["Payment Plan", listing.paymentPlan || "Standard transfer / mortgage"],
                  ["DLD Permit", verified ? permitLabel(listing) || "Verified" : "Available on request"],
                ].map(([k, v]) => (
                  <div key={k} className="flex items-center justify-between gap-4 py-3">
                    <dt className="text-[#737373]">{k}</dt>
                    <dd className="text-right font-medium text-[#121212]">{v}</dd>
                  </div>
                ))}
              </dl>

              <div className="rounded-xl border border-black/[0.08] bg-white p-4 text-xs text-[#525252]">
                <div className="flex items-center gap-2 font-medium text-[#121212]">
                  <ShieldCheck className="h-4 w-4 text-[#0e9f6e]" />
                  <span>RERA ORN {SITE.reraOrn}</span>
                </div>
                <p className="mt-1.5 leading-relaxed">
                  {verified
                    ? `Trakheesi Permit ${listing.dld.permitNumber} · Last verified ${listing.lastChecked}.`
                    : "Official DLD Trakheesi permit & Title Deed / Oqood verification provided prior to viewing or deposit."}{" "}
                  <a
                    href={listing.dld.verificationUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1 font-medium text-[#121212] underline"
                  >
                    DLD Portal <ExternalLink className="h-3 w-3" />
                  </a>
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Multi-Photo Gallery ("A look around, before you visit") */}
      {listing.images.length > 1 ? (
        <section className="bg-white/24 backdrop-blur-[2px] py-16">
          <div className="mx-auto max-w-[1260px] px-4 sm:px-8">
            <SectionEyebrow>GALLERY</SectionEyebrow>
            <SplitHeading
              primary="A look around,"
              muted="before you visit"
              size="md"
              inline
              className="mt-4"
            />
            <div className="mt-8 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
              {listing.images.map((src, i) => (
                <button
                  key={`${src}-${i}`}
                  type="button"
                  onClick={() => {
                    setActiveImage(i);
                    window.scrollTo({ top: 260, behavior: "smooth" });
                  }}
                  className={`group cursor-pointer overflow-hidden rounded-2xl border transition-all ${
                    activeImage === i ? "border-[#121212]" : "border-black/[0.06]"
                  }`}
                >
                  <img
                    src={src}
                    alt={`${listing.title} view ${i + 1}`}
                    loading="lazy"
                    className="aspect-[4/3] w-full object-cover transition-transform duration-500 group-hover:scale-105"
                  />
                </button>
              ))}
            </div>
          </div>
        </section>
      ) : null}

      {/* 16-Item Amenities Grid */}
      <section className="mx-auto max-w-[1260px] px-4 py-16 sm:px-8">
        <SectionEyebrow>AMENITIES &amp; FEATURES</SectionEyebrow>
        <SplitHeading
          primary="Everything included"
          muted="in the building"
          size="md"
          inline
          className="mt-4"
        />
        <div className="mt-8 grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-4">
          {allAmenities.map((item) => (
            <div
              key={item}
              className="flex items-center gap-3 rounded-xl border border-black/[0.06] bg-[#f7f7f7] px-4 py-3.5 text-sm text-[#121212]"
            >
              <Check className="h-4 w-4 shrink-0 text-[#0e9f6e]" />
              <span>{item}</span>
            </div>
          ))}
        </div>
      </section>

      {/* Interactive Tabbed Floor Plan & Dimensions (Avenlo Signature) */}
      <section className="border-y border-white/60 bg-white/24 backdrop-blur-[2px] py-16">
        <div className="mx-auto max-w-[1260px] px-4 sm:px-8">
          <div className="flex flex-wrap items-end justify-between gap-6">
            <div>
              <SectionEyebrow>FLOOR PLAN &amp; DIMENSIONS</SectionEyebrow>
              <SplitHeading
                primary={listing.floorPlan.label}
                muted={`${formatArea(listing.floorPlan.totalAreaSqFt)}`}
                size="md"
                className="mt-4"
              />
            </div>

            <div className="flex flex-wrap gap-2">
              {(
                [
                  ["layout", "Room Dimensions"],
                  ["specs", "Area Split"],
                  ["dld", "Accessibility & Access"],
                ] as const
              ).map(([key, label]) => (
                <button
                  key={key}
                  type="button"
                  onClick={() => setActiveTab(key)}
                  className={`cursor-pointer rounded-full px-5 py-2.5 text-xs font-medium transition-colors ${
                    activeTab === key
                      ? "bg-[#121212] text-white"
                      : "border border-black/10 bg-white text-[#525252] hover:text-[#121212]"
                  }`}
                >
                  {label}
                </button>
              ))}
            </div>
          </div>

          <div className="mt-8 rounded-2xl border border-white/80 bg-white/84 backdrop-blur-xl shadow-[0_14px_40px_rgba(12,56,96,0.08)] p-6 sm:p-8">
            {activeTab === "layout" ? (
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
                {listing.floorPlan.rooms.map((room) => (
                  <div
                    key={room.name}
                    className="flex items-center justify-between rounded-xl border border-black/[0.06] bg-[#f7f7f7] px-5 py-4"
                  >
                    <span className="text-sm font-medium text-[#121212]">{room.name}</span>
                    <span className="font-mono text-xs text-[#737373]">{room.dimensions}</span>
                  </div>
                ))}
              </div>
            ) : activeTab === "specs" ? (
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
                <div className="rounded-xl bg-[#f7f7f7] p-5">
                  <p className="text-xs uppercase tracking-[0.18em] text-[#8b8b8b]">Internal Area</p>
                  <p className="mt-2 text-2xl font-medium text-[#121212]">
                    {formatArea(listing.floorPlan.internalSqFt)}
                  </p>
                </div>
                <div className="rounded-xl bg-[#f7f7f7] p-5">
                  <p className="text-xs uppercase tracking-[0.18em] text-[#8b8b8b]">Balcony / Terrace</p>
                  <p className="mt-2 text-2xl font-medium text-[#121212]">
                    {formatArea(listing.floorPlan.balconySqFt)}
                  </p>
                </div>
                <div className="rounded-xl bg-[#121212] p-5 text-white">
                  <p className="text-xs uppercase tracking-[0.18em] text-[#8b8b8b]">Total Suite Area</p>
                  <p className="mt-2 text-2xl font-medium text-[#51fec0]">
                    {formatArea(listing.floorPlan.totalAreaSqFt)}
                  </p>
                </div>
              </div>
            ) : (
              <div className="space-y-3 text-sm text-[#4a4a4a]">
                {listing.accessibility.map((item) => (
                  <div key={item} className="flex items-center gap-2.5">
                    <Check className="h-4 w-4 text-[#0e9f6e]" />
                    <span>{item}</span>
                  </div>
                ))}
                {listing.metroStation ? (
                  <p className="pt-2 text-xs text-[#737373]">
                    Nearest Metro: <strong className="text-[#121212]">{listing.metroStation}</strong>
                  </p>
                ) : null}
              </div>
            )}

            <div className="mt-8 flex flex-wrap items-center gap-4 border-t border-black/[0.06] pt-6">
              <BracketLink href="#enquire" variant="light" size="sm">
                Book a Viewing
              </BracketLink>
              <BracketLink href={`tel:${SITE.phoneRaw}`} external variant="light" size="sm">
                Call Us Now
              </BracketLink>
            </div>
          </div>
        </div>
      </section>

      {/* Location Map + Advisor Enquiry */}
      <section id="enquire" className="mx-auto max-w-[1260px] px-4 py-16 sm:px-8">
        <div className="grid grid-cols-1 gap-10 lg:grid-cols-12">
          <div className="lg:col-span-5 space-y-6">
            <SectionEyebrow>THE NEIGHBOURHOOD</SectionEyebrow>
            <h2 className="text-3xl font-medium tracking-[-0.03em] text-[#121212]">
              {listing.community}
            </h2>
            <p className="text-sm leading-relaxed text-[#525252]">
              Inspect proximity to Sheikh Zayed Road, Metro access, schools, and dining around {listing.building}.{" "}
              <Link
                href={communityHref(listing.communitySlug)}
                className="font-medium text-[#121212] underline underline-offset-4"
              >
                Read full {listing.community} guide →
              </Link>
            </p>
            <div className="overflow-hidden rounded-2xl">
              <MapEmbed lat={listing.lat} lng={listing.lng} title={listing.building} />
            </div>
            <div className="rounded-2xl border border-white/80 bg-white/80 backdrop-blur-xl shadow-[0_14px_40px_rgba(12,56,96,0.08)] p-5">
              <p className="text-[11px] font-medium uppercase tracking-[0.2em] text-[#8b8b8b]">
                ASSIGNED ADVISOR
              </p>
              <Link
                href={`/agents/${listing.agentSlug}`}
                className="mt-2 block text-lg font-medium text-[#121212] hover:underline"
              >
                {listing.agentName}
              </Link>
              <p className="text-xs text-[#737373]">
                {listing.agentRole} · {listing.agentLanguages.join(", ")}
              </p>
            </div>
          </div>

          <div className="lg:col-span-7">
            <EnquiryForm
              context="property"
              heading={`Enquire about ${listing.title}`}
              subheading="Request verified floor plans, RERA service-charge statements, and a private viewing."
              propertyRef={listing.reference}
              propertyTitle={listing.title}
              community={listing.community}
              developer={listing.developer}
              agentSlug={listing.agentSlug}
              agentName={listing.agentName}
              defaultViewingPicker
            />
          </div>
        </div>
      </section>

      {/* Similar Residences */}
      {similarListings.length > 0 ? (
        <section className="border-t border-white/60 bg-white/24 backdrop-blur-[2px] py-16">
          <div className="mx-auto max-w-[1260px] px-4 sm:px-8">
            <SectionEyebrow>MORE ON OUR BOOKS</SectionEyebrow>
            <SplitHeading
              primary="Similar Dubai"
              muted="residences"
              size="md"
              inline
              className="mt-4"
            />
            <div className="mt-8 grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
              {similarListings.slice(0, 3).map((item) => (
                <PropertyCard key={item.slug} listing={item} />
              ))}
            </div>
          </div>
        </section>
      ) : null}

      <CtaBanner />
    </div>
  );
}
