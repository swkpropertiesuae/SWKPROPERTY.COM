import { buildMeta, KW, breadcrumbLd } from "@/lib/seo"
import { JsonLd } from "@/components/seo/json-ld"

export const metadata = buildMeta({
  title: "Properties for Sale & Rent in Dubai — Map Search",
  description:
    "Search apartments, villas, townhouses and penthouses for sale, rent and off-plan across Dubai on one map. Filter by community, price, bedrooms and handover with SWK Properties (RERA ORN 51517).",
  path: "/properties",
  keywords: [...KW.buy, ...KW.rent].slice(0, 16),
})

export default function PropertiesLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <JsonLd
        data={breadcrumbLd([
          { name: "Home", path: "/" },
          { name: "Properties", path: "/properties" },
        ])}
      />
      {children}
    </>
  )
}
