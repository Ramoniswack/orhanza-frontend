import { products } from "@/lib/data";
import { ProductCard } from "./ProductCard";
import { Reveal, SectionHeading } from "./Reveal";
import Link from "next/link";

/** Template's "New Arrival" 4-column grid. */
export function NewArrivals() {
  const picks = [
    "wool-linen-groomsmen-suit", "midnight-double-breasted-suit", "linen-resort-shirt", "noir-coat-pant-set",
    "ivory-grooms-suit", "boardroom-three-piece-suit", "slate-coat-pant-set", "oxford-business-shirt",
  ].map((s) => products.find((p) => p.slug === s)!);

  return (
    <section className="container-x pb-24 md:pb-32" aria-labelledby="new">
      <div className="flex flex-wrap items-end justify-between gap-6">
        <SectionHeading eyebrow="Fresh cloth, new colours" title="New Arrivals" />
        <Reveal><Link href="/collections" className="btn btn-outline">View all collections</Link></Reveal>
      </div>
      <div className="mt-12 grid grid-cols-2 gap-x-4 gap-y-10 lg:grid-cols-4">
        {picks.map((p, i) => (
          <Reveal key={p.slug} delay={(i % 4) * 0.08}><ProductCard product={p} /></Reveal>
        ))}
      </div>
    </section>
  );
}
