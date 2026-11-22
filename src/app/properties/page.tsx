"use client";

import React, { Suspense, useEffect, useMemo, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import {
  Bookmark,
  Grid2x2,
  Map as MapIcon,
  Search,
  Share2,
  SlidersHorizontal,
  X,
} from "lucide-react";
import {
  LISTINGS,
  type FurnishedState,
  type ListingPurpose,
  type PropertyType,
} from "@/lib/listings";
import { communities } from "@/lib/swk";
import { usePrefs } from "@/lib/prefs";
import { PropertyCard } from "@/components/site/property-card";
import { MapEmbed } from "@/components/site/map-embed";
import { AvenloPageHeader } from "@/components/avenlo/page-header";
import { CtaBanner } from "@/components/avenlo/motion";

const QUICK_PILLS = [
  { id: "all", label: "All" },
  { id: "buy", label: "For Sale" },
  { id: "rent", label: "For Rent" },
  { id: "off-plan", label: "Off-Plan" },
  { id: "Apartment", label: "Apartments" },
  { id: "Villa", label: "Villas" },
  { id: "Townhouse", label: "Townhouses" },
  { id: "Penthouse", label: "Penthouses" },
] as const;

type QuickPillId = (typeof QUICK_PILLS)[number]["id"];

const DEVELOPER_NAMES = Array.from(new Set(LISTINGS.map((l) => l.developer))).sort();
const VIEW_OPTIONS = Array.from(new Set(LISTINGS.flatMap((l) => l.views))).sort();
const FEATURE_OPTIONS = Array.from(new Set(LISTINGS.flatMap((l) => l.features))).sort();

function PropertiesExplorer() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const { notify, trackEvent } = usePrefs();

  const [query, setQuery] = useState(searchParams.get("q") || "");
  const [purpose, setPurpose] = useState<"" | ListingPurpose>(
    (searchParams.get("purpose") as ListingPurpose) || ""
  );
  const [propertyType, setPropertyType] = useState<"" | PropertyType>(
    (searchParams.get("type") as PropertyType) || ""
  );
  const [community, setCommunity] = useState(searchParams.get("community") || "");
  const [bedrooms, setBedrooms] = useState(searchParams.get("beds") || "");
  const [maxPrice, setMaxPrice] = useState(searchParams.get("maxPrice") || "");
  const [sortBy, setSortBy] = useState(searchParams.get("sort") || "featured");
  const [viewMode, setViewMode] = useState<"grid" | "map">("grid");
  const [filtersOpen, setFiltersOpen] = useState(false);

  // Advanced drawer filters (preserved from full repo spec)
  const [developer, setDeveloper] = useState("");
  const [minBaths, setMinBaths] = useState("");
  const [furnished, setFurnished] = useState<"" | FurnishedState>("");
  const [nearMetroOnly, setNearMetroOnly] = useState(false);
  const [petFriendlyOnly, setPetFriendlyOnly] = useState(false);
  const [maxServiceCharge, setMaxServiceCharge] = useState("");
  const [selectedView, setSelectedView] = useState("");
  const [selectedFeature, setSelectedFeature] = useState("");
  const [mapZone, setMapZone] = useState<"" | "central" | "coastal" | "green-suburban" | "creek-east">("");

  const activePill: QuickPillId = useMemo(() => {
    if (purpose) return purpose;
    if (
      propertyType === "Apartment" ||
      propertyType === "Villa" ||
      propertyType === "Townhouse" ||
      propertyType === "Penthouse"
    ) {
      return propertyType;
    }
    return "all";
  }, [purpose, propertyType]);

  const applyQuickPill = (id: QuickPillId) => {
    if (id === "all") {
      setPurpose("");
      setPropertyType("");
    } else if (id === "buy" || id === "rent" || id === "off-plan") {
      setPurpose(id);
      setPropertyType("");
    } else {
      setPurpose("");
      setPropertyType(id);
    }
  };

  // Sync key URL params
  useEffect(() => {
    const p = new URLSearchParams();
    if (query.trim()) p.set("q", query.trim());
    if (purpose) p.set("purpose", purpose);
    if (propertyType) p.set("type", propertyType);
    if (community) p.set("community", community);
    if (bedrooms) p.set("beds", bedrooms);
    if (maxPrice) p.set("maxPrice", maxPrice);
    if (sortBy && sortBy !== "featured") p.set("sort", sortBy);
    const qs = p.toString();
    router.replace(qs ? `/properties?${qs}` : "/properties", { scroll: false });
  }, [query, purpose, propertyType, community, bedrooms, maxPrice, sortBy, router]);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    const list = LISTINGS.filter((item) => {
      if (purpose && item.purpose !== purpose) return false;
      if (propertyType && item.propertyType !== propertyType) return false;
      if (community && item.communitySlug !== community) return false;
      if (bedrooms !== "") {
        const b = Number(bedrooms);
        if (b === 4 ? item.bedrooms < 4 : item.bedrooms !== b) return false;
      }
      if (maxPrice && item.priceAed > Number(maxPrice)) return false;
      if (developer && item.developer !== developer) return false;
      if (minBaths && item.bathrooms < Number(minBaths)) return false;
      if (furnished && item.furnished !== furnished) return false;
      if (nearMetroOnly && !item.nearMetro) return false;
      if (petFriendlyOnly && item.petPolicy !== "Pet-friendly") return false;
      if (maxServiceCharge && item.serviceChargePerSqFt > Number(maxServiceCharge)) return false;
      if (selectedView && !item.views.includes(selectedView)) return false;
      if (selectedFeature && !item.features.includes(selectedFeature)) return false;
      if (mapZone && item.mapZone !== mapZone) return false;
      if (q) {
        const hay =
          `${item.title} ${item.community} ${item.building} ${item.developer} ${item.reference} ${item.propertyType}`.toLowerCase();
        if (!hay.includes(q)) return false;
      }
      return true;
    });

    if (sortBy === "price-asc") return [...list].sort((a, b) => a.priceAed - b.priceAed);
    if (sortBy === "price-desc") return [...list].sort((a, b) => b.priceAed - a.priceAed);
    if (sortBy === "area-desc") return [...list].sort((a, b) => b.areaSqFt - a.areaSqFt);
    return list;
  }, [
    query,
    purpose,
    propertyType,
    community,
    bedrooms,
    maxPrice,
    developer,
    minBaths,
    furnished,
    nearMetroOnly,
    petFriendlyOnly,
    maxServiceCharge,
    selectedView,
    selectedFeature,
    mapZone,
    sortBy,
  ]);

  const activeAdvancedCount = [
    developer,
    minBaths,
    furnished,
    nearMetroOnly ? "1" : "",
    petFriendlyOnly ? "1" : "",
    maxServiceCharge,
    selectedView,
    selectedFeature,
    mapZone,
  ].filter(Boolean).length;

  const resetAll = () => {
    setQuery("");
    setPurpose("");
    setPropertyType("");
    setCommunity("");
    setBedrooms("");
    setMaxPrice("");
    setDeveloper("");
    setMinBaths("");
    setFurnished("");
    setNearMetroOnly(false);
    setPetFriendlyOnly(false);
    setMaxServiceCharge("");
    setSelectedView("");
    setSelectedFeature("");
    setMapZone("");
    setSortBy("featured");
  };

  const handleSaveSearch = () => {
    try {
      const existing = JSON.parse(localStorage.getItem("swk_saved_searches") || "[]");
      const entry = {
        id: Date.now(),
        label: query || community || purpose || "All Dubai Properties",
        url: window.location.pathname + window.location.search,
        savedAt: new Date().toISOString(),
      };
      localStorage.setItem("swk_saved_searches", JSON.stringify([entry, ...existing].slice(0, 12)));
      trackEvent("property_search", { results: filtered.length });
      notify("Search saved to browser");
    } catch {
      notify("Could not save search");
    }
  };

  const handleShareSearch = async () => {
    try {
      await navigator.clipboard.writeText(window.location.href);
      notify("Search link copied");
    } catch {
      notify("Copy the URL from your browser bar");
    }
  };

  return (
    <>
      {/* Avenlo Pill Filter Bar + Minimal Controls */}
      <section className="mx-auto max-w-[1260px] px-4 py-10 sm:px-8">
        <div className="flex flex-wrap items-center justify-center gap-2">
          {QUICK_PILLS.map((pill) => {
            const active = activePill === pill.id;
            return (
              <button
                key={pill.id}
                type="button"
                onClick={() => applyQuickPill(pill.id)}
                className={`cursor-pointer rounded-full px-5 py-2.5 text-xs font-medium transition-colors ${
                  active
                    ? "bg-[#121212] text-white"
                    : "border border-black/10 bg-white text-[#525252] hover:border-[#121212] hover:text-[#121212]"
                }`}
              >
                {pill.label}
              </button>
            );
          })}
        </div>

        {/* Crisp Search, Community, Beds, Price & Utility Row */}
        <div className="mt-8 rounded-2xl border border-black/[0.07] bg-[#f7f7f7] p-4 sm:p-5">
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-12">
            <div className="relative lg:col-span-4">
              <Search className="pointer-events-none absolute top-1/2 left-3.5 h-4 w-4 -translate-y-1/2 text-[#8b8b8b]" />
              <input
                type="search"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Search tower, community, developer or ref..."
                aria-label="Search properties"
                className="w-full rounded-lg border border-black/10 bg-white py-2.5 pr-3.5 pl-10 text-sm text-[#121212] placeholder:text-[#a7a7a7] focus:border-[#121212] focus:outline-none"
              />
            </div>

            <select
              aria-label="Filter by community"
              value={community}
              onChange={(e) => setCommunity(e.target.value)}
              className="lg:col-span-2 rounded-lg border border-black/10 bg-white px-3 py-2.5 text-sm text-[#121212] focus:border-[#121212] focus:outline-none"
            >
              <option value="">All Communities</option>
              {communities.map((c) => (
                <option key={c.slug} value={c.slug}>
                  {c.name}
                </option>
              ))}
            </select>

            <select
              aria-label="Filter by bedrooms"
              value={bedrooms}
              onChange={(e) => setBedrooms(e.target.value)}
              className="lg:col-span-2 rounded-lg border border-black/10 bg-white px-3 py-2.5 text-sm text-[#121212] focus:border-[#121212] focus:outline-none"
            >
              <option value="">Any Bedrooms</option>
              <option value="0">Studio</option>
              <option value="1">1 Bedroom</option>
              <option value="2">2 Bedrooms</option>
              <option value="3">3 Bedrooms</option>
              <option value="4">4+ Bedrooms</option>
            </select>

            <select
              aria-label="Maximum AED budget"
              value={maxPrice}
              onChange={(e) => setMaxPrice(e.target.value)}
              className="lg:col-span-2 rounded-lg border border-black/10 bg-white px-3 py-2.5 text-sm text-[#121212] focus:border-[#121212] focus:outline-none"
            >
              <option value="">Any Budget (AED)</option>
              <option value="500000">Up to AED 500K</option>
              <option value="2000000">Up to AED 2M</option>
              <option value="5000000">Up to AED 5M</option>
              <option value="10000000">Up to AED 10M</option>
              <option value="25000000">Up to AED 25M</option>
            </select>

            <button
              type="button"
              onClick={() => setFiltersOpen(true)}
              className="lg:col-span-2 inline-flex cursor-pointer items-center justify-center gap-2 rounded-lg border border-black/12 bg-white px-4 py-2.5 text-xs font-medium uppercase tracking-[0.14em] text-[#121212] hover:bg-[#121212] hover:text-white transition-colors"
            >
              <SlidersHorizontal className="h-3.5 w-3.5" />
              <span>More Filters{activeAdvancedCount > 0 ? ` (${activeAdvancedCount})` : ""}</span>
            </button>
          </div>

          <div className="mt-4 flex flex-wrap items-center justify-between gap-3 border-t border-black/[0.06] pt-3.5 text-xs text-[#525252]">
            <div className="flex items-center gap-3">
              <span className="font-medium text-[#121212]">
                {filtered.length} {filtered.length === 1 ? "residence" : "residences"}
              </span>
              {(query || purpose || propertyType || community || bedrooms || maxPrice || activeAdvancedCount > 0) ? (
                <button
                  type="button"
                  onClick={resetAll}
                  className="cursor-pointer underline underline-offset-4 hover:text-[#121212]"
                >
                  Reset all
                </button>
              ) : null}
            </div>

            <div className="flex flex-wrap items-center gap-2">
              <select
                aria-label="Sort properties"
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="rounded-lg border border-black/10 bg-white px-2.5 py-1.5 text-xs text-[#121212]"
              >
                <option value="featured">Featured order</option>
                <option value="price-asc">Price: Low to High</option>
                <option value="price-desc">Price: High to Low</option>
                <option value="area-desc">Largest Area</option>
              </select>

              <button
                type="button"
                onClick={handleSaveSearch}
                className="inline-flex cursor-pointer items-center gap-1 rounded-lg border border-black/10 bg-white px-2.5 py-1.5 text-xs font-medium text-[#121212] hover:bg-[#ececec]"
              >
                <Bookmark className="h-3.5 w-3.5" />
                <span>Save</span>
              </button>

              <button
                type="button"
                onClick={handleShareSearch}
                className="inline-flex cursor-pointer items-center gap-1 rounded-lg border border-black/10 bg-white px-2.5 py-1.5 text-xs font-medium text-[#121212] hover:bg-[#ececec]"
              >
                <Share2 className="h-3.5 w-3.5" />
                <span>Share</span>
              </button>

              <div className="inline-flex rounded-lg border border-black/10 bg-white p-0.5">
                <button
                  type="button"
                  onClick={() => setViewMode("grid")}
                  className={`inline-flex cursor-pointer items-center gap-1 rounded-md px-2.5 py-1 text-xs font-medium ${
                    viewMode === "grid" ? "bg-[#121212] text-white" : "text-[#525252]"
                  }`}
                >
                  <Grid2x2 className="h-3.5 w-3.5" />
                  <span>Grid</span>
                </button>
                <button
                  type="button"
                  onClick={() => setViewMode("map")}
                  className={`inline-flex cursor-pointer items-center gap-1 rounded-md px-2.5 py-1 text-xs font-medium ${
                    viewMode === "map" ? "bg-[#121212] text-white" : "text-[#525252]"
                  }`}
                >
                  <MapIcon className="h-3.5 w-3.5" />
                  <span>Map</span>
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Map View Mode */}
        {viewMode === "map" ? (
          <div className="mt-8 space-y-6">
            <div className="flex flex-wrap gap-2">
              {(
                [
                  ["", "All Dubai Corridors"],
                  ["central", "Downtown & Business Bay"],
                  ["coastal", "Palm Jumeirah & Marina"],
                  ["green-suburban", "Dubai Hills & JVC"],
                  ["creek-east", "Dubai Creek Harbour"],
                ] as const
              ).map(([z, label]) => (
                <button
                  key={label}
                  type="button"
                  onClick={() => setMapZone(z)}
                  className={`cursor-pointer rounded-full px-4 py-2 text-xs font-medium ${
                    mapZone === z
                      ? "bg-[#121212] text-white"
                      : "border border-black/10 bg-[#f7f7f7] text-[#525252]"
                  }`}
                >
                  {label}
                </button>
              ))}
            </div>
            <MapEmbed
              lat={filtered[0]?.lat ?? 25.1972}
              lng={filtered[0]?.lng ?? 55.2744}
              zoom={12}
              title="Dubai Property Corridors — SWK Properties"
            />
          </div>
        ) : null}

        {/* Results Grid (First 2 Large Featured Cards + 3-Col Grid per Avenlo) */}
        {filtered.length === 0 ? (
          <div className="mt-12 rounded-2xl border border-black/[0.07] bg-[#f7f7f7] p-12 text-center">
            <h2 className="text-2xl font-medium tracking-[-0.03em] text-[#121212]">
              No listings match those exact filters
            </h2>
            <p className="mt-2 text-sm text-[#737373]">
              Clear a filter or ask our Sheikh Zayed Road desk for off-market stock in your target building.
            </p>
            <button
              type="button"
              onClick={resetAll}
              className="mt-6 cursor-pointer rounded-full bg-[#121212] px-6 py-2.5 text-xs font-medium uppercase tracking-[0.14em] text-white"
            >
              Reset Filters
            </button>
          </div>
        ) : (
          <div className="mt-10 space-y-8">
            {filtered.length >= 2 && viewMode === "grid" ? (
              <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                {filtered.slice(0, 2).map((listing) => (
                  <PropertyCard key={listing.slug} listing={listing} featured />
                ))}
              </div>
            ) : null}
            <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
              {(filtered.length >= 2 && viewMode === "grid" ? filtered.slice(2) : filtered).map(
                (listing) => (
                  <PropertyCard key={listing.slug} listing={listing} />
                )
              )}
            </div>
          </div>
        )}
      </section>

      {/* Slide-Over More Filters Drawer */}
      {filtersOpen ? (
        <div
          className="fixed inset-0 z-[95] flex justify-end bg-[#121212]/45 backdrop-blur-xs"
          onClick={() => setFiltersOpen(false)}
        >
          <div
            onClick={(e) => e.stopPropagation()}
            className="flex h-full w-full max-w-md flex-col bg-white text-[#121212] shadow-2xl"
          >
            <div className="flex items-center justify-between border-b border-black/[0.08] px-6 py-5">
              <h2 className="text-lg font-medium tracking-[-0.02em]">Advanced Filters</h2>
              <button
                type="button"
                onClick={() => setFiltersOpen(false)}
                aria-label="Close advanced filters"
                className="cursor-pointer rounded-full border border-black/10 p-2"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            <div className="flex-1 space-y-5 overflow-y-auto p-6 text-sm">
              <div>
                <label className="mb-1.5 block text-xs font-medium text-[#525252]">Developer</label>
                <select
                  value={developer}
                  onChange={(e) => setDeveloper(e.target.value)}
                  className="w-full rounded-lg border border-black/12 bg-white px-3 py-2.5 text-sm"
                >
                  <option value="">All Developers</option>
                  {DEVELOPER_NAMES.map((d) => (
                    <option key={d} value={d}>
                      {d}
                    </option>
                  ))}
                </select>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="mb-1.5 block text-xs font-medium text-[#525252]">
                    Min Bathrooms
                  </label>
                  <select
                    value={minBaths}
                    onChange={(e) => setMinBaths(e.target.value)}
                    className="w-full rounded-lg border border-black/12 bg-white px-3 py-2.5 text-sm"
                  >
                    <option value="">Any</option>
                    <option value="1">1+</option>
                    <option value="2">2+</option>
                    <option value="3">3+</option>
                    <option value="4">4+</option>
                  </select>
                </div>

                <div>
                  <label className="mb-1.5 block text-xs font-medium text-[#525252]">
                    Furnishing
                  </label>
                  <select
                    value={furnished}
                    onChange={(e) => setFurnished(e.target.value as "" | FurnishedState)}
                    className="w-full rounded-lg border border-black/12 bg-white px-3 py-2.5 text-sm"
                  >
                    <option value="">Any</option>
                    <option value="Furnished">Furnished</option>
                    <option value="Partly furnished">Partly furnished</option>
                    <option value="Unfurnished">Unfurnished</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="mb-1.5 block text-xs font-medium text-[#525252]">
                  Primary View
                </label>
                <select
                  value={selectedView}
                  onChange={(e) => setSelectedView(e.target.value)}
                  className="w-full rounded-lg border border-black/12 bg-white px-3 py-2.5 text-sm"
                >
                  <option value="">Any View</option>
                  {VIEW_OPTIONS.map((v) => (
                    <option key={v} value={v}>
                      {v}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="mb-1.5 block text-xs font-medium text-[#525252]">
                  Feature / Amenity
                </label>
                <select
                  value={selectedFeature}
                  onChange={(e) => setSelectedFeature(e.target.value)}
                  className="w-full rounded-lg border border-black/12 bg-white px-3 py-2.5 text-sm"
                >
                  <option value="">Any Feature</option>
                  {FEATURE_OPTIONS.map((f) => (
                    <option key={f} value={f}>
                      {f}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="mb-1.5 block text-xs font-medium text-[#525252]">
                  Max Service Charge (AED / sq ft)
                </label>
                <input
                  type="number"
                  min={0}
                  max={60}
                  value={maxServiceCharge}
                  onChange={(e) => setMaxServiceCharge(e.target.value)}
                  placeholder="e.g. 25"
                  className="w-full rounded-lg border border-black/12 bg-white px-3 py-2.5 text-sm"
                />
              </div>

              <div className="space-y-3 pt-2">
                <label className="flex cursor-pointer items-center gap-2.5 text-sm">
                  <input
                    type="checkbox"
                    checked={nearMetroOnly}
                    onChange={(e) => setNearMetroOnly(e.target.checked)}
                    className="h-4 w-4 accent-[#121212]"
                  />
                  <span>Near Dubai Metro station</span>
                </label>
                <label className="flex cursor-pointer items-center gap-2.5 text-sm">
                  <input
                    type="checkbox"
                    checked={petFriendlyOnly}
                    onChange={(e) => setPetFriendlyOnly(e.target.checked)}
                    className="h-4 w-4 accent-[#121212]"
                  />
                  <span>Pet-friendly building</span>
                </label>
              </div>
            </div>

            <div className="flex items-center justify-between gap-3 border-t border-black/[0.08] px-6 py-4">
              <button
                type="button"
                onClick={resetAll}
                className="cursor-pointer text-xs font-medium text-[#525252] underline underline-offset-4"
              >
                Clear all
              </button>
              <button
                type="button"
                onClick={() => setFiltersOpen(false)}
                className="cursor-pointer rounded-full bg-[#121212] px-6 py-2.5 text-xs font-medium uppercase tracking-[0.14em] text-white"
              >
                Show {filtered.length} Residences
              </button>
            </div>
          </div>
        </div>
      ) : null}

      <CtaBanner />
    </>
  );
}

export default function PropertiesPage() {
  return (
    <div className="bg-white">
      <AvenloPageHeader
        eyebrow="PROPERTIES · DUBAI & UAE"
        title="Residences we are"
        italic="advising on now"
        lead="Ready apartments, beachfront villas, townhouses, annual leases, and off-plan releases across Dubai's premier freehold corridors."
      />
      <Suspense fallback={<div className="min-h-[60vh] bg-white" />}>
        <PropertiesExplorer />
      </Suspense>
    </div>
  );
}
