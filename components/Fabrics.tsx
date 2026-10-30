"use client";

import { motion } from "motion/react";
import { fabricCategories } from "@/lib/data";
import { Reveal, SectionHeading } from "./Reveal";

export function Fabrics() {
  return (
    <section id="fabrics" className="container-x py-24 md:py-32" aria-labelledby="fabrics-h">
      <span id="fabrics-h" className="sr-only">Fabric spotlight</span>
      <SectionHeading eyebrow="Fabric spotlight" title="Fabrics with character.">
        Orhanza highlights premium fabrics for different seasons and occasions. Our featured Valerio Cassani wool-linen blend combines the elegance of wool with the freshness and lightness of linen — suitable for versatile, all-day wear.
      </SectionHeading>
      <div className="mt-14 grid grid-cols-2 gap-3 md:grid-cols-3 md:gap-5">
        {fabricCategories.map((f, i) => (
          <Reveal key={f.name} delay={(i % 3) * 0.08}>
            <motion.div whileHover={{ y: -6 }} transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }} className="overflow-hidden rounded-card border border-charcoal/10 bg-card">
              <div
                className="h-40 md:h-52"
                style={{
                  background: `repeating-linear-gradient(45deg, rgba(255,255,255,.06) 0 2px, transparent 2px 6px), linear-gradient(135deg, ${f.swatch[0]}, ${f.swatch[1]})`,
                }}
                aria-hidden
              />
              <div className="p-5">
                <h3 className="font-serif text-2xl md:text-3xl">{f.name}</h3>
                <p className="mt-1 text-sm text-slate">{f.note}</p>
              </div>
            </motion.div>
          </Reveal>
        ))}
      </div>
      <Reveal className="mt-10"><p className="text-sm text-slate">Swatch colours are illustrative — your consultation includes the real cloth books.</p></Reveal>
    </section>
  );
}
