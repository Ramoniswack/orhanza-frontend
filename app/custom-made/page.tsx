import type { Metadata } from "next";
import { CustomMade } from "@/components/custom-made/CustomMade";
import { fabrics, parseGender, parsePieces } from "@/lib/custom-made";

export const metadata: Metadata = {
  title: "Custom Made — Made-to-Measure Suit Configurator",
  description: "Choose your fabric and details to create a made-to-measure Orhanza suit.",
  alternates: { canonical: "/custom-made" },
};

type Props = { searchParams: Promise<{ fabric?: string; pieces?: string; gender?: string }> };

export default async function CustomMadePage({ searchParams }: Props) {
  const sp = await searchParams;
  const slug = fabrics.find((f) => f.slug === sp.fabric)?.slug ?? fabrics[0].slug;

  return (
    <>
      <h1 className="sr-only">Custom Made Suit Configurator</h1>
      <CustomMade initialFabric={slug} initialPieces={parsePieces(sp.pieces)} initialGender={parseGender(sp.gender)} />
    </>
  );
}
