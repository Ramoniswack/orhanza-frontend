"use client";

import Image from "next/image";
import Link from "next/link";
import { useShortlist } from "@/components/ShortlistProvider";
import { genderLabel, type ShopProduct } from "@/lib/shop";

/** Shop tile — the whole card opens the product page; the shortlist button saves without leaving the grid. */
export function ShopCard({ product, priority = false }: { product: ShopProduct; priority?: boolean }) {
  const { has, toggle } = useShortlist();
  const saved = has(product.key);
  const href = `/shop/${product.slug}`;

  return (
    <article className="group">
      <div className="relative aspect-[3/4] overflow-hidden rounded-[6px] bg-[#F3F3F3]">
        <Image
          src={product.image}
          alt={`${product.name} — made to measure by Orhanza`}
          fill
          priority={priority}
          sizes="(min-width:1024px) 33vw, 50vw"
          className="object-cover object-top transition-all duration-[900ms] ease-out group-hover:scale-[1.08] group-hover:opacity-0"
        />
        <Image
          src={product.flat}
          alt=""
          fill
          sizes="(min-width:1024px) 33vw, 50vw"
          className="scale-100 object-cover object-top opacity-0 transition-all duration-[900ms] ease-out group-hover:scale-[1.08] group-hover:opacity-100"
        />
        <Link href={href} aria-label={product.name} className="absolute inset-0 z-10" />
        <button
          type="button"
          onClick={() => toggle(product.key)}
          aria-pressed={saved}
          className="absolute inset-x-3 bottom-3 z-20 rounded-[8px] bg-white/95 py-2.5 text-[0.68rem] font-semibold uppercase tracking-[0.14em] text-charcoal backdrop-blur transition-all duration-500 hover:bg-charcoal hover:text-ivory md:translate-y-[130%] md:group-hover:translate-y-0"
        >
          {saved ? "Shortlisted ✓" : "Add to shortlist"}
        </button>
      </div>
      <div className="mt-3 px-0.5">
        <Link href={href} className="block font-semibold leading-snug tracking-[-0.01em] hover:underline">{product.name}</Link>
        <p className="mt-0.5 text-sm text-slate">{genderLabel(product.gender)} · {product.type} · {product.occasion}</p>
      </div>
    </article>
  );
}
