import type { Metadata } from "next";
import Link from "next/link";
import { SITE } from "@/lib/swk";
import { buildMetadata, breadcrumbSchema } from "@/lib/seo";
import { JsonLd } from "@/components/seo/json-ld";
import { AvenloPageHeader } from "@/components/avenlo/page-header";

export const metadata: Metadata = buildMetadata({
  title: "Privacy Policy — UAE PDPL Personal Data Notice",
  description:
    "SWK Properties (RERA ORN 51517) Privacy Policy explaining what personal data we collect, why we process it under UAE Federal Decree-Law No. 45 of 2021 (PDPL), retention, and rights.",
  path: "/privacy",
});

export default function PrivacyPolicyPage() {
  return (
    <div className="bg-white">
      <JsonLd
        id="ld-privacy-breadcrumb"
        data={breadcrumbSchema([
          { name: "Home", path: "/" },
          { name: "Privacy Policy", path: "/privacy" },
        ])}
      />

      <AvenloPageHeader
        eyebrow="ALIGNED WITH UAE PDPL · FEDERAL DECREE-LAW NO. 45 OF 2021"
        title="Privacy Policy"
        italic="& Data Notice"
        compact
        breadcrumb={[
          { label: "Home", href: "/" },
          { label: "Privacy Policy" },
        ]}
        meta={
          <span>
            Last Updated: November 2026 · Controller: {SITE.legalName} (RERA ORN {SITE.orn})
          </span>
        }
      />

      <article className="mx-auto max-w-3xl px-4 py-14 sm:px-8 space-y-10 text-[15px] leading-[1.75] text-[#4a4a4a]">
        <section>
          <h2 className="text-2xl font-medium tracking-[-0.03em] text-[#121212]">
            1. Who We Are &amp; Regulatory Scope
          </h2>
          <p className="mt-3">
            {SITE.legalName} (&ldquo;SWK Properties&rdquo;, &ldquo;we&rdquo;, &ldquo;us&rdquo;) is a real estate brokerage licensed in Dubai under RERA Office Registration Number (ORN) {SITE.orn}, located at {SITE.address.full}. This Privacy Policy explains how we handle personal data in accordance with UAE Federal Decree-Law No. 45 of 2021 regarding the Protection of Personal Data (UAE PDPL) and applicable international privacy principles.
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-medium tracking-[-0.03em] text-[#121212]">
            2. Personal Data We Collect
          </h2>
          <ul className="mt-3 list-disc pl-5 space-y-2">
            <li>
              <strong className="font-medium text-[#121212]">Enquiry &amp; Viewing Data:</strong> Full name, phone/WhatsApp number, email address, property interest, preferred viewing dates/times (GST), and optional budget notes when you submit a form or subscribe to monthly launch notes.
            </li>
            <li>
              <strong className="font-medium text-[#121212]">Regulatory Transaction Documents (Offline / Secure Channels Only):</strong> When you formally instruct SWK to buy, sell, or lease a property, Dubai Land Department (DLD) and UAE Anti-Money Laundering (AML) regulations require identity, passport, Emirates ID, or Title Deed verification through official channels. Never send passport scans or banking details through website forms or chat.
            </li>
            <li>
              <strong className="font-medium text-[#121212]">Technical &amp; Attribution Data:</strong> First-touch and latest-touch referral parameters (UTM tags), display preferences stored in your browser, and—only where you grant consent via{" "}
              <Link href="/cookies" className="text-[#121212] underline underline-offset-4">
                Cookie Settings
              </Link>
              —anonymous page interaction events.
            </li>
          </ul>
        </section>

        <section>
          <h2 className="text-2xl font-medium tracking-[-0.03em] text-[#121212]">
            3. Lawful Basis &amp; Purpose of Processing
          </h2>
          <p className="mt-3">
            We process your contact details based on your explicit consent when submitting an enquiry or newsletter opt-in, or to take pre-contractual steps at your request (preparing a shortlist, scheduling a viewing, or onboarding a mandate via RERA Form A). We do not sell, rent, or trade your personal data to third-party lead brokers.
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-medium tracking-[-0.03em] text-[#121212]">
            4. Data Sharing &amp; Cross-Border Safeguards
          </h2>
          <p className="mt-3">
            Where you request an off-plan project registration, viewing, or mortgage referral, relevant details are shared strictly with the assigned SWK advisor, the developer&apos;s official sales registration desk, or the Dubai Land Department (DLD / Ejari / Trakheesi) as required by UAE law.
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-medium tracking-[-0.03em] text-[#121212]">
            5. Data Retention &amp; Your Rights Under UAE PDPL
          </h2>
          <p className="mt-3">
            Website enquiry records that do not progress to a regulated real estate transaction are retained for up to 24 months unless you request earlier deletion. You may request access to, correction of, or erasure of your personal data, or withdraw marketing consent at any time by emailing{" "}
            <a href={`mailto:${SITE.email}`} className="text-[#121212] underline underline-offset-4">
              {SITE.email}
            </a>{" "}
            or calling{" "}
            <a href={`tel:${SITE.phoneTel}`} className="text-[#121212] underline underline-offset-4">
              {SITE.phone}
            </a>
            .
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-medium tracking-[-0.03em] text-[#121212]">
            6. Service Providers (Processors)
          </h2>
          <ul className="mt-3 list-disc pl-5 space-y-2">
            <li><strong className="font-medium text-[#121212]">Hosting &amp; security:</strong> Cloudflare (website delivery, DDoS protection, encrypted storage of enquiry records).</li>
            <li><strong className="font-medium text-[#121212]">Enquiry handling:</strong> Email and CRM providers used solely to respond to and manage your enquiry.</li>
            <li><strong className="font-medium text-[#121212]">Maps:</strong> Google Maps embeds on contact, community, and property pages. Google may set cookies when a map loads.</li>
            <li><strong className="font-medium text-[#121212]">Analytics (with consent only):</strong> Google Tag Manager and Google Analytics configured in Google Consent Mode v2, remaining disabled until you accept analytics cookies.</li>
            <li><strong className="font-medium text-[#121212]">Messaging:</strong> WhatsApp (Meta) when you choose to message us there; Meta&apos;s own privacy policy applies.</li>
          </ul>
        </section>

        <section>
          <h2 className="text-2xl font-medium tracking-[-0.03em] text-[#121212]">
            7. Anti-Money-Laundering (AML) Records
          </h2>
          <p className="mt-3">
            As a real estate brokerage we are a Designated Non-Financial Business and Profession under UAE Federal Decree-Law No. 20 of 2018 on anti-money laundering and counter-terrorist financing. When a transaction proceeds we must verify identity (KYC), may be required to report to the UAE Financial Intelligence Unit via goAML, and must retain transaction and identification records for at least five years. These statutory obligations override deletion requests for regulated records.
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-medium tracking-[-0.03em] text-[#121212]">
            8. Security, Children &amp; Complaints
          </h2>
          <p className="mt-3">
            Data is transmitted over HTTPS and restricted to authorised SWK personnel. This website is intended for adults aged 18 and over. If you have concerns regarding data handling, contact{" "}
            <a href={`mailto:${SITE.email}`} className="text-[#121212] underline underline-offset-4">
              {SITE.email}
            </a>{" "}
            or the UAE Data Office.
          </p>
        </section>
      </article>
    </div>
  );
}
