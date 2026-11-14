import { buildMeta, KW, breadcrumbLd, webPageLd } from "@/lib/seo"
import { JsonLd } from "@/components/seo/json-ld"

export const metadata = buildMeta({
  title: "Dubai Property Calculators — Mortgage, DLD Fees & Rental Yield",
  description:
    "Free Dubai property calculators: UAE mortgage repayments, DLD 4% transfer fee and total purchase costs, rental yield and off-plan payment plans. Estimates by SWK Properties (RERA ORN 51517).",
  path: "/calculators",
  keywords: ["Dubai mortgage calculator", "DLD fee calculator", "rental yield calculator Dubai", ...KW.invest].slice(0, 16),
})

export default function CalculatorsLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <JsonLd
        data={[
          breadcrumbLd([
            { name: "Home", path: "/" },
            { name: "Calculators", path: "/calculators" },
          ]),
          {
            ...webPageLd({
              name: "Dubai property calculators",
              description: "Mortgage, DLD transfer fee and rental yield calculators for Dubai property.",
              path: "/calculators",
            }),
            mainEntity: {
              "@type": "WebApplication",
              name: "SWK Dubai Property Calculators",
              applicationCategory: "FinanceApplication",
              operatingSystem: "Any",
              offers: { "@type": "Offer", price: "0", priceCurrency: "AED" },
            },
          },
        ]}
      />
      {children}
    </>
  )
}
