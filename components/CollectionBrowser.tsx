"use client";

import { AnimatePresence, motion } from "motion/react";
import { useState } from "react";
import { categories, products, type CategorySlug } from "@/lib/data";
import { ProductCard } from "./ProductCard";

export function CollectionBrowser({ initial }: { initial: CategorySlug | "all" }) {
  const [cat, setCat] = useState<CategorySlug | "all">(initial);
  const list = products.filter((p) => cat === "all" || p.category === cat);

  const select = (c: CategorySlug | "all") => {
    setCat(c);
    const url = c === "all" ? "/collections" : `/collections?category=${c}`;
    window.history.replaceState(null, "", url);
  };

  return (
    <>
      <div className="flex flex-wrap gap-2" role="tablist" aria-label="Filter collection">
        {[{ slug: "all", label: "All Products" }, ...categories].map((c) => (
          <button
            key={c.slug}
            role="tab"
            aria-selected={cat === c.slug}
            onClick={() => select(c.slug as CategorySlug | "all")}
            className={`rounded-full border px-5 py-2.5 text-sm transition-colors ${cat === c.slug ? "border-charcoal bg-charcoal text-ivory" : "border-charcoal/20 hover:border-charcoal"}`}
          >
            {c.label}
          </button>
        ))}
      </div>

      <motion.div layout className="mt-10 grid grid-cols-2 gap-x-4 gap-y-10 lg:grid-cols-4">
        <AnimatePresence mode="popLayout">
          {list.map((p) => (
            <motion.div key={p.slug} layout initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, scale: 0.96 }} transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}>
              <ProductCard product={p} />
            </motion.div>
          ))}
        </AnimatePresence>
      </motion.div>
      {list.length === 0 && <p className="mt-10 text-slate">Nothing here yet.</p>}
    </>
  );
}
