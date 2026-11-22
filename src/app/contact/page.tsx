import type { Metadata } from "next";
import { Clock, Mail, MapPin, Phone, ShieldCheck } from "lucide-react";
import { SITE } from "@/lib/swk";
import { buildMetadata, breadcrumbSchema } from "@/lib/seo";
import { JsonLd } from "@/components/seo/json-ld";
import { EnquiryForm } from "@/components/site/enquiry-form";
import { MapEmbed } from "@/components/site/map-embed";
import { WhatsAppIcon } from "@/components/site/whatsapp-icon";
import { AvenloPageHeader } from "@/components/avenlo/page-header";

export const metadata: Metadata = buildMetadata({
  title: "Contact SWK Properties — Sheikh Zayed Road, Dubai",
  description:
    "Visit or contact SWK Properties at Office No 54, 27th Floor, Al Saqr Business Tower, Sheikh Zayed Road, Dubai. Call +971 56 433 0448 or book a private consultation.",
  path: "/contact",
  keywords: [
    "Contact SWK Properties Dubai",
    "Al Saqr Business Tower real estate office",
    "Sheikh Zayed Road property broker phone",
    "SWK Properties consultation",
  ],
});

const CORRIDOR_TIMES = [
  { destination: "DIFC Gate Village & Financial Centre Metro", time: "4 mins" },
  { destination: "Downtown Dubai & Burj Khalifa", time: "8 mins" },
  { destination: "Dubai International Airport (DXB)", time: "14 mins" },
  { destination: "Dubai Hills Estate & MBR City", time: "16 mins" },
  { destination: "Palm Jumeirah & Dubai Marina", time: "18 mins" },
];

export default function ContactPage() {
  return (
    <div className="bg-white">
      <JsonLd
        id="ld-contact-breadcrumb"
        data={breadcrumbSchema([
          { name: "Home", path: "/" },
          { name: "Contact SWK", path: "/contact" },
        ])}
      />

      <AvenloPageHeader
        eyebrow="GET IN TOUCH · SHEIKH ZAYED ROAD"
        title="Tell us what you"
        italic="are looking for"
        lead="Whether comparing 2026 off-plan launches, buying a ready home, arranging an annual lease, or instructing a sale, speak directly with our 27th-floor Dubai desk."
        breadcrumb={[
          { label: "Home", href: "/" },
          { label: "Contact" },
        ]}
      />

      {/* Avenlo 2-Column Contact Split: Left #F5F5F5 THE OFFICE + Right Crisp Form */}
      <section className="mx-auto max-w-[1260px] px-4 py-16 sm:px-8">
        <div className="grid grid-cols-1 gap-10 lg:grid-cols-12 items-start">
          {/* Left Column: THE OFFICE Card + Office Photo + Map */}
          <div className="lg:col-span-5 space-y-6">
            <div className="rounded-2xl border border-black/[0.06] bg-[#f5f5f5] p-7 sm:p-8 space-y-6">
              <p className="text-[11px] font-medium uppercase tracking-[0.22em] text-[#8b8b8b]">
                THE OFFICE
              </p>

              <div className="space-y-4 text-sm text-[#4a4a4a]">
                <div className="flex items-start gap-3">
                  <MapPin className="mt-0.5 h-4 w-4 shrink-0 text-[#121212]" />
                  <div>
                    <p className="font-medium text-[#121212]">Al Saqr Business Tower</p>
                    <p className="mt-0.5 leading-relaxed">{SITE.address.full}</p>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <Phone className="h-4 w-4 shrink-0 text-[#121212]" />
                  <div className="flex flex-wrap items-center gap-2">
                    <a
                      href={`tel:${SITE.phoneRaw}`}
                      className="font-medium text-[#121212] hover:underline"
                    >
                      {SITE.phone}
                    </a>
                    <span className="text-[#cfcfcf]">·</span>
                    <a
                      href={SITE.whatsappUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1 font-medium text-[#0e9f6e] hover:underline"
                    >
                      <WhatsAppIcon className="h-3.5 w-3.5" />
                      WhatsApp
                    </a>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <Mail className="h-4 w-4 shrink-0 text-[#121212]" />
                  <a
                    href={`mailto:${SITE.email}`}
                    className="font-medium text-[#121212] hover:underline"
                  >
                    {SITE.email}
                  </a>
                </div>

                <div className="flex items-start gap-3">
                  <Clock className="mt-0.5 h-4 w-4 shrink-0 text-[#121212]" />
                  <div>
                    <p>{SITE.hours.weekdays}</p>
                    <p>{SITE.hours.saturday}</p>
                  </div>
                </div>
              </div>

              <div className="border-t border-black/[0.08] pt-5 flex items-center gap-2 text-xs text-[#525252]">
                <ShieldCheck className="h-4 w-4 text-[#0e9f6e]" />
                <span>
                  <strong className="font-medium text-[#121212]">{SITE.legalName}</strong> · RERA ORN {SITE.reraOrn}
                </span>
              </div>
            </div>

            <div className="overflow-hidden rounded-2xl border border-black/[0.07] bg-[#f7f7f7]">
              <img
                src="/img/about/private-consultation-lounge.jpg"
                alt="SWK Properties Private Advisory Suite, 27th Floor, Al Saqr Business Tower"
                loading="lazy"
                className="h-56 w-full object-cover"
              />
              <div className="divide-y divide-black/[0.06] px-5 py-3 text-xs">
                {CORRIDOR_TIMES.map((c) => (
                  <div key={c.destination} className="flex items-center justify-between py-2.5">
                    <span className="text-[#525252]">{c.destination}</span>
                    <span className="font-mono font-medium text-[#121212]">{c.time}</span>
                  </div>
                ))}
              </div>
            </div>

            <MapEmbed
              lat={SITE.geo.lat}
              lng={SITE.geo.lng}
              zoom={15}
              title="SWK Properties — Al Saqr Business Tower, Sheikh Zayed Road"
            />
          </div>

          {/* Right Column: Crisp Avenlo Form */}
          <div className="lg:col-span-7">
            <EnquiryForm
              context="general"
              heading="Send us an enquiry"
              subheading="Share your brief below. A senior advisor from our Sheikh Zayed Road office will reply within one Dubai business day."
              defaultViewingPicker
            />
          </div>
        </div>
      </section>
    </div>
  );
}
