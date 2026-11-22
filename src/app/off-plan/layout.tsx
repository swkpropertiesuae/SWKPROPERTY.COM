import { buildMeta, KW, breadcrumbLd, itemListLd } from "@/lib/seo"
import { JsonLd } from "@/components/seo/json-ld"
import { projects } from "@/lib/developers"

export const metadata = buildMeta({
  title: "Off-Plan Projects in Dubai & UAE — Payment Plans & New Launches",
  description:
    "Compare premier off-plan launches from Nakheel, Binghatti, Emaar, DAMAC, Azizi, Sobha, Aldar and more. Escrow-registered projects, payment plans, handover dates and Oqood guidance from RERA-licensed SWK Properties (ORN 51517).",
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
