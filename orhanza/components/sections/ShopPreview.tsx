"use client";

/** Home "Shop" strip — Men / Women toggle, four pieces, each tile opens its product page directly. */
import { AnimatePresence, motion } from "motion/react";
import Link from "next/link";
import { useState } from "react";
import { ShopCard } from "@/components/shop/ShopCard";
import { genders, shopProducts, type Gender } from "@/lib/shop";

export function ShopPreview() {
  const [g, setG] = useState<Gender>("men");
  const list = shopProducts.filter((p) => p.gender === g).slice(0, 4);

  return (
    <section id="shop" aria-labelledby="shop-home-h" className="bg-white py-14 md:py-24">
      <div className="container-x">
        <div className="flex flex-wrap items-end justify-between gap-6">
          <div>
            <h2 id="shop-home-h" className="h-display text-[clamp(2.4rem,5vw,4.6rem)]">Shop</h2>
            <div role="tablist" aria-label="Men or women" className="mt-5 flex items-baseline gap-6 text-2xl font-bold tracking-[-0.04em]">
              {genders.map((x) => (
                <button key={x.slug} role="tab" aria-selected={g === x.slug} onClick={() => setG(x.slug)} className="relative pb-1 transition-colors duration-500" style={{ color: g === x.slug ? "#111" : "rgba(0,0,0,.28)" }}>
                  {x.label}
                  <span aria-hidden className="absolute inset-x-0 bottom-0 h-[2px] origin-left bg-black transition-transform duration-500" style={{ transform: `scaleX(${g === x.slug ? 1 : 0})` }} />
                </button>
              ))}
            </div>
          </div>
          <Link href={`/shop?gender=${g}`} className="group flex items-center gap-4 text-sm font-semibold">
            View all
            <span className="block h-px w-12 bg-ink transition-all duration-500 group-hover:w-24" />
          </Link>
        </div>

        <AnimatePresence mode="wait" initial={false}>
          <motion.div key={g} initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }} className="mt-8 grid grid-cols-2 gap-x-4 gap-y-8 lg:grid-cols-4">
            {list.map((p) => <ShopCard key={p.slug} product={p} />)}
          </motion.div>
        </AnimatePresence>
      </div>
    </section>
  );
}
