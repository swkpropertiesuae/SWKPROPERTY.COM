import { buildMeta, KW } from "@/lib/seo";

export const metadata = buildMeta({
  title: "Properties for Sale & Rent in Dubai — Map Search",
  description:
    "Search apartments, villas, townhouses and penthouses for sale, rent and off-plan across Dubai on one map. Filter by community, price, bedrooms and handover with SWK Properties (RERA ORN 51517).",
  path: "/properties",
  keywords: [...KW.buy, ...KW.rent].slice(0, 16),
});

export default function PropertiesLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
