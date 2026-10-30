import type { Metadata } from "next";
import { CollectionBrowser } from "@/components/CollectionBrowser";
import { Reveal } from "@/components/Reveal";
import { categories, type CategorySlug } from "@/lib/data";

export const metadata: Metadata = {
  title: "Collections — Custom Suits, Shirts & Coat-Pant Sets",
  description: "Browse Orhanza’s made-to-measure business suits, wedding suits, coat-pant sets and custom shirts, tailored in Nepal.",
  alternates: { canonical: "/collections" },
};

export default async function CollectionsPage({ searchParams }: { searchParams: Promise<{ category?: string }> }) {
  const { category } = await searchParams;
  const initial = categories.some((c) => c.slug === category) ? (category as CategorySlug) : "all";

  return (
    <div className="container-x pb-24 pt-32 md:pt-40">
      <Reveal>
        <p className="eyebrow text-gold">Products Collection</p>
        <h1 className="h-display mt-3 text-[clamp(2.8rem,6vw,5.6rem)]">Orhanza Collection</h1>
        <p className="mt-4 max-w-xl text-slate">Every piece is made to measure. Shortlist what you love and bring it to your consultation.</p>
      </Reveal>
      <div className="mt-12">
        <CollectionBrowser initial={initial} />
      </div>
    </div>
  );
}
