import type { Metadata } from "next";
import { BracketLink } from "@/components/avenlo/bracket-button";
import { SectionEyebrow } from "@/components/avenlo/motion";

export const metadata: Metadata = {
  title: "Page Not Found | SWK Properties",
  description: "The requested Dubai property page or listing could not be found.",
  robots: { index: false, follow: true },
};

export default function NotFoundPage() {
  return (
    <section className="flex min-h-[75vh] items-center justify-center bg-white/20 backdrop-blur-[2px] bg-arch-grid-fade px-4 py-24 sm:px-8">
      <div className="mx-auto max-w-3xl text-center">
        <SectionEyebrow align="center">ERROR 404</SectionEyebrow>
        <h1 className="mt-6 text-[44px] sm:text-[68px] md:text-[84px] font-medium leading-[1.0] tracking-[-0.045em] text-[#121212]">
          This address{" "}
          <span className="italic font-light text-[#525252]">does not exist</span>
        </h1>
        <p className="mx-auto mt-5 max-w-md text-sm sm:text-base text-[#525252] leading-relaxed">
          The page or listing you looked for may have moved or sold. Browse our active Dubai portfolio or return home.
        </p>
        <div className="mt-10 flex flex-wrap items-center justify-center gap-5">
          <BracketLink href="/" variant="light" size="md">
            Back to Home
          </BracketLink>
          <BracketLink href="/properties" variant="light" size="md">
            Browse Properties
          </BracketLink>
          <BracketLink href="/off-plan" variant="light" size="md">
            Off-Plan Launches
          </BracketLink>
        </div>
      </div>
    </section>
  );
}
