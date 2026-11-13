import type { Metadata } from "next";
import { CustomMade } from "@/components/custom-made/CustomMade";
import { fabrics, parsePieces } from "@/lib/custom-made";

export const metadata: Metadata = {
  title: "Custom Made — Design Your Suit, Cloth by Cloth",
  description: "Choose your cloth and watch your made-to-measure suit change on the model. Add trousers or a waistcoat, then book a fitting with Orhanza in Jhamsikhel, Kathmandu.",
  alternates: { canonical: "/custom-made" },
};

type Props = { searchParams: Promise<{ fabric?: string; pieces?: string }> };

export default async function CustomMadePage({ searchParams }: Props) {
  const sp = await searchParams;
  const slug = fabrics.find((f) => f.slug === sp.fabric)?.slug ?? fabrics[0].slug;
  return (
    <>
      <h1 className="sr-only">Custom Made</h1>
      <CustomMade initialFabric={slug} initialPieces={parsePieces(sp.pieces)} />
    </>
  );
}
