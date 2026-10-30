"use client";

import { AnimatePresence, motion } from "motion/react";
import Image from "next/image";
import { useState } from "react";
import { categories, galleryCaptions, productImage, products, type CategorySlug } from "@/lib/data";
import { SectionHeading } from "./Reveal";

export function Gallery() {
  const [cat, setCat] = useState<CategorySlug | "all">("all");
  const list = products.filter((p) => cat === "all" || p.category === cat);

  return (
    <section className="bg-[#000] py-24 text-[#f4f4f4] md:py-32" aria-labelledby="gallery-h">
      <div className="container-x">
        <span id="gallery-h" className="sr-only">Gallery</span>
        <SectionHeading eyebrow="Gallery" title="Crafted for confidence." light>
          A look that is uniquely yours — browse recent commissions by category.
        </SectionHeading>

        <div className="mt-10 flex flex-wrap gap-2" role="tablist" aria-label="Gallery categories">
          {[{ slug: "all", label: "All" }, ...categories].map((c) => (
            <button
              key={c.slug}
              role="tab"
              aria-selected={cat === c.slug}
              onClick={() => setCat(c.slug as CategorySlug | "all")}
              className={`rounded-full border px-4 py-2 text-body transition-colors ${cat === c.slug ? "border-gold bg-gold text-[#111]" : "border-[#f4f4f4]/25 hover:border-[#f4f4f4]/60"}`}
            >
              {c.label}
            </button>
          ))}
        </div>

        <motion.div layout className="mt-10 columns-2 gap-4 md:columns-3 lg:columns-4">
          <AnimatePresence mode="popLayout">
            {list.map((p, i) => (
              <motion.figure
                layout
                key={p.slug}
                initial={{ opacity: 0, scale: 0.96 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.96 }}
                transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
                className="group relative mb-4 break-inside-avoid overflow-hidden rounded-card"
              >
                <Image
                  src={productImage(p, i % 2 ? "b" : "a")}
                  alt={`${p.name} — custom tailoring in Kathmandu, Nepal`}
                  width={660}
                  height={i % 3 === 0 ? 900 : 800}
                  sizes="(min-width:1024px) 25vw, (min-width:768px) 33vw, 50vw"
                  className="h-auto w-full object-cover transition-transform duration-1000 group-hover:scale-105"
                />
                <figcaption className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-[#111]/85 to-transparent p-4 pt-12 text-sm opacity-0 transition-opacity duration-500 group-hover:opacity-100">
                  {galleryCaptions[i % galleryCaptions.length]}
                </figcaption>
              </motion.figure>
            ))}
          </AnimatePresence>
        </motion.div>
      </div>
    </section>
  );
}
