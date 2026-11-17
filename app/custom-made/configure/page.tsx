import type { Metadata } from "next";
import { CustomMade } from "@/components/custom-made/CustomMade";
import { fabrics, parseGender, parsePieces } from "@/lib/custom-made";

export const metadata: Metadata = {
  title: "Configure Your Suit",
  description: "Choose a fabric and configure a made-to-measure suit with Orhanza.",
  alternates: { canonical: "/custom-made" },
};

type Props = { searchParams: Promise<{ fabric?: string; pieces?: string; gender?: string }> };

export default async function ConfigureSuitPage({ searchParams }: Props) {
  const sp = await searchParams;
  const slug = fabrics.find((f) => f.slug === sp.fabric)?.slug ?? fabrics[0].slug;

  return (
    <>
      <h1 className="sr-only">Configure Your Suit</h1>
      <CustomMade initialFabric={slug} initialPieces={parsePieces(sp.pieces)} initialGender={parseGender(sp.gender)} />
    </>
  );
}
