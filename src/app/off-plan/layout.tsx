import { buildMeta, KW } from "@/lib/seo";

export const metadata = buildMeta({
  title: "Off-Plan Projects in Dubai & UAE — Payment Plans & New Launches",
  description:
    "Compare premier off-plan launches from Nakheel, Binghatti, Emaar, DAMAC, Azizi, Tarrad, Sobha, Aldar and more. Escrow-registered projects, payment plans, and Oqood guidance from RERA-licensed SWK Properties (ORN 51517).",
  path: "/off-plan",
  keywords: KW.offPlan,
});

export default function OffPlanLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
