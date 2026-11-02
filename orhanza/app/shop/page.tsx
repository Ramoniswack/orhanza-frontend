import type { Metadata } from "next";
import { ShopBrowser } from "@/components/shop/ShopBrowser";

export const metadata: Metadata = {
  title: "Shop — Made-to-Measure Suits, Coats & Blazers for Men and Women",
  description: "Browse Orhanza’s made-to-measure suits, overcoats, blazers and pantsuits for men and women. Filter by occasion and type, then book a fitting in Jhamsikhel, Kathmandu.",
  alternates: { canonical: "/shop" },
};

type Props = { searchParams: Promise<{ gender?: string; occasion?: string; type?: string }> };

export default async function ShopPage({ searchParams }: Props) {
  const initial = await searchParams;
  return (
    <section className="container-x pb-24 pt-24 md:pt-28" aria-labelledby="shop-h">
      <h1 id="shop-h" className="sr-only">Shop</h1>
      <ShopBrowser initial={initial} />
    </section>
  );
}
