"use client";

import { motion } from "motion/react";
import Image from "next/image";
import Link from "next/link";
import { categories, getProduct, productImage } from "@/lib/data";
import { Reveal, SectionHeading } from "./Reveal";

const lead: Record<string, string> = {
  "business-suits": "midnight-double-breasted-suit",
  "wedding-suits": "ivory-grooms-suit",
  "coat-pant": "sand-coat-pant-set",
  "custom-shirts": "signature-white-shirt",
};

/** Template's large 2×2 editorial grid → the four core Orhanza commissions. */
export function FeatureGrid() {
  return (
    <section className="container-x py-24 md:py-32" aria-labelledby="commissions">
      <SectionHeading eyebrow="Signature commissions" title="Precision tailored for every room.">
        <span id="commissions" className="sr-only">Signature commissions</span>
        Business, wedding, coat-pant and shirting — each begins with understanding the person who will wear it.
      </SectionHeading>

      <div className="mt-14 grid gap-4 sm:grid-cols-2 md:gap-5">
        {categories.map((c, i) => {
          const p = getProduct(lead[c.slug])!;
          return (
            <Reveal key={c.slug} delay={(i % 2) * 0.1}>
              <Link href={`/collections?category=${c.slug}`} className="group block">
                <div className="relative aspect-[670/810] overflow-hidden rounded-card bg-field">
                  <motion.div className="absolute inset-0" whileHover={{ scale: 1.04 }} transition={{ duration: 1.2, ease: [0.22, 1, 0.36, 1] }}>
                    <Image src={productImage(p)} alt={`${c.label} by Orhanza — ${p.name}`} fill sizes="(min-width:640px) 50vw, 100vw" className="object-cover object-top" />
                  </motion.div>
                  <div className="absolute inset-0 bg-gradient-to-t from-[#111]/55 via-transparent to-transparent" />
                  <p className="absolute bottom-5 left-5 right-5 flex items-end justify-between text-[#f4f4f4]">
                    <span className="h-section text-3xl md:text-4xl">{c.label}</span>
                    <span className="text-nav underline-offset-4 group-hover:underline">Explore →</span>
                  </p>
                </div>
                <p className="mt-3 px-1 text-body text-[#6f6f6f]">{c.blurb}</p>
              </Link>
            </Reveal>
          );
        })}
      </div>
    </section>
  );
}
