import type { Metadata } from "next";
import { Check } from "lucide-react";
import { SITE } from "@/lib/swk";
import { buildMetadata } from "@/lib/seo";
import { BracketLink } from "@/components/avenlo/bracket-button";
import { SectionEyebrow } from "@/components/avenlo/motion";

export const metadata: Metadata = buildMetadata({
  title: "Enquiry Confirmed — Thank You",
  description:
    "Your enquiry has been logged by SWK Properties (RERA ORN 51517). Review your reference number and next steps.",
  path: "/thank-you",
  noIndex: true,
});

export default async function ThankYouPage({
  searchParams,
}: {
  searchParams: Promise<{ ref?: string; agent?: string; backup?: string }>;
}) {
  const sp = await searchParams;
  const referenceId = sp.ref || "SWK-ENQ-VERIFIED";
  const assignedAgent = sp.agent || "Mohammad Haseeb (Sales & Operations Manager)";
  const backupAgent = sp.backup || "SWK Sheikh Zayed Road Desk";

  return (
    <section className="flex min-h-[75vh] items-center justify-center bg-white bg-arch-grid-fade px-4 py-20 sm:px-8">
      <div className="w-full max-w-2xl rounded-2xl border border-black/[0.08] bg-white p-8 sm:p-12 text-center shadow-[0_24px_60px_rgba(18,18,18,0.06)]">
        <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-[#121212] text-[#51fec0]">
          <Check className="h-6 w-6" />
        </div>

        <div className="mt-6">
          <SectionEyebrow align="center">REFERENCE · {referenceId}</SectionEyebrow>
        </div>

        <h1 className="mt-5 text-[36px] sm:text-[48px] font-medium leading-[1.05] tracking-[-0.04em] text-[#121212]">
          Your request is with our{" "}
          <span className="italic font-light">Dubai desk</span>
        </h1>

        <p className="mx-auto mt-4 max-w-lg text-sm sm:text-base leading-relaxed text-[#525252]">
          Routed to <strong className="font-medium text-[#121212]">{assignedAgent}</strong> (backup coverage: {backupAgent}) at 25th Floor, Al Saqr Building, Sheikh Zayed Road.
        </p>

        <div className="mt-8 grid grid-cols-1 gap-4 sm:grid-cols-2 rounded-2xl bg-[#f7f7f7] p-5 text-left text-xs text-[#525252]">
          <div>
            <p className="font-medium text-[#121212]">Response Window</p>
            <p className="mt-1 leading-relaxed">
              Within 2 hours during Dubai business hours ({SITE.hours.full}), or first thing the next business morning.
            </p>
          </div>
          <div>
            <p className="font-medium text-[#121212]">Direct Desk</p>
            <p className="mt-1 leading-relaxed">
              Call{" "}
              <a href={`tel:${SITE.phoneTel}`} className="font-medium text-[#121212] underline">
                {SITE.phone}
              </a>{" "}
              quoting <span className="font-mono">{referenceId}</span>.
            </p>
          </div>
        </div>

        <div className="mt-9 flex flex-wrap items-center justify-center gap-4">
          <BracketLink
            href={`${SITE.whatsapp}?text=${encodeURIComponent(
              `Hello SWK Properties, I just submitted enquiry ${referenceId} and would like to connect.`
            )}`}
            external
            variant="dark"
            size="md"
          >
            Continue on WhatsApp
          </BracketLink>
          <BracketLink href="/off-plan" variant="light" size="md">
            Explore 2026 Launches
          </BracketLink>
        </div>
      </div>
    </section>
  );
}
