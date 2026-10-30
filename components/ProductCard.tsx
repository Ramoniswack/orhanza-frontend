"use client";

import Image from "next/image";
import Link from "next/link";
import { productImage, type Product } from "@/lib/data";
import { useShortlist } from "./ShortlistProvider";

export function ProductCard({ product, priority = false }: { product: Product; priority?: boolean }) {
  const { has, toggle } = useShortlist();
  const saved = has(product.slug);

  return (
    <article className="group">
      <div className="relative aspect-[3/4.1] overflow-hidden rounded-card bg-field">
        <Image
          src={productImage(product, "a")}
          alt={`${product.name} — made-to-measure by Orhanza, Nepal`}
          fill
          priority={priority}
          sizes="(min-width:1024px) 25vw, (min-width:640px) 50vw, 100vw"
          className="object-cover object-top transition-opacity duration-700 group-hover:opacity-0"
        />
        <Image
          src={productImage(product, "b")}
          alt=""
          fill
          sizes="(min-width:1024px) 25vw, (min-width:640px) 50vw, 100vw"
          className="scale-[1.03] object-cover object-top opacity-0 transition-all duration-700 group-hover:scale-100 group-hover:opacity-100"
        />
        <Link href={`/collections/${product.slug}`} aria-label={product.name} className="absolute inset-0 z-10" />

        {product.badge && (
          <span className="absolute left-3 top-3 z-20 rounded-full bg-gold px-3 py-1 text-[0.68rem] font-semibold tracking-wide text-charcoal">
            {product.badge}
          </span>
        )}

        <button
          onClick={() => toggle(product.slug)}
          aria-pressed={saved}
          className="absolute inset-x-3 bottom-3 z-20 rounded-[10px] bg-ivory/95 py-3 text-[0.72rem] font-semibold uppercase tracking-[0.14em] text-charcoal backdrop-blur transition-all duration-500 hover:bg-charcoal hover:text-ivory md:translate-y-[130%] md:group-hover:translate-y-0"
        >
          {saved ? "Shortlisted ✓" : "Add to shortlist"}
        </button>
      </div>

      <div className="mt-3 flex items-baseline justify-between gap-3 px-1">
        <Link href={`/collections/${product.slug}`} className="font-medium hover:underline">{product.name}</Link>
        <span className="shrink-0 text-sm text-slate">Made to measure</span>
      </div>
    </article>
  );
}
