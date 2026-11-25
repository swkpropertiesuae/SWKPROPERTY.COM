import Link from "next/link";
import { ShieldCheck } from "lucide-react";
import { SITE } from "@/lib/swk";

export function ListingDisclaimer({
  variant = "off-plan",
  className = "",
}: {
  variant?: "off-plan" | "secondary" | "rent" | "general";
  className?: string;
}) {
  const detail =
    variant === "off-plan"
      ? "All off-plan properties, starting prices, unit availability, floor plans, handover dates, and payment plans depend strictly on the respective master developer and prevailing market conditions and are subject to change or withdrawal without prior notice. Primary off-plan purchases carry no mortgage registration fees and no trustee fees; approximate Developers Admin fees (AED 4,000–5,500) and 4% DLD/Oqood fees apply as per official developer and authority schedules."
      : variant === "rent"
      ? "All rental properties, annual lease rates, cheque terms, security deposits, and availability depend on the landlord and current Dubai market conditions and may change without prior notice. Final tenancy terms are governed exclusively by the RERA Unified Tenancy Contract registered via Ejari."
      : variant === "secondary"
      ? "All ready and secondary properties, asking prices, service charges, and availability depend on the property owner, respective developer NOC requirements, and current market conditions and are subject to change without prior notice. Final purchase terms are governed solely by signed RERA Form F and official Dubai Land Department (DLD) transfer records."
      : "All properties, unit availability, payment schedules, and prices displayed on this website depend strictly on the respective developer, owner, and current market conditions and may change without prior notice.";

  return (
    <div
      role="note"
      aria-label="Developer pricing and Terms and Conditions notice"
      className={`rounded-2xl border border-black/[0.08] bg-white/82 px-5 py-4 text-xs leading-relaxed text-[#475569] shadow-xs backdrop-blur-xl ${className}`}
    >
      <div className="flex items-start gap-3">
        <ShieldCheck className="mt-0.5 h-4 w-4 shrink-0 text-[#0e9f6e]" aria-hidden="true" />
        <p>
          <strong className="font-semibold text-[#121212]">
            Developer Pricing &amp; Current Market Conditions Notice ({SITE.rera}):
          </strong>{" "}
          {detail}{" "}
          <Link
            href="/terms"
            className="font-semibold text-[#121212] underline underline-offset-4 hover:text-[#0e9f6e]"
          >
            Read Full Terms &amp; Conditions
          </Link>
          .
        </p>
      </div>
    </div>
  );
}
