import { buildMeta, KW, breadcrumbLd, itemListLd } from "@/lib/seo"
import { JsonLd } from "@/components/seo/json-ld"
import { projects } from "@/lib/developers"

export const metadata = buildMeta({
  title: "Off-Plan Projects in Dubai & UAE 2026 — Payment Plans & New Launches",
  description:
    "Compare 108+ off-plan launches from Emaar, DAMAC, Sobha, Nakheel, Aldar, Binghatti and more. Escrow-registered projects, payment plans, handover dates and Oqood guidance from RERA-licensed SWK Properties (ORN 51517).",
  path: "/off-plan",
  keywords: KW.offPlan,
})

export default function OffPlanLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <JsonLd
        data={[
          breadcrumbLd([
            { name: "Home", path: "/" },
            { name: "Off-Plan Projects", path: "/off-plan" },
          ]),
          itemListLd(
            "Off-plan projects in Dubai and the UAE",
            projects.slice(0, 50).map((p) => ({ name: `${p.name} by ${p.devName}`, path: `/off-plan/${p.slug}` }))
          ),
        ]}
      />
      {children}
    </>
  )
}
