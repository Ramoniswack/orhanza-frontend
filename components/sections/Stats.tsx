"use client";

/** 5 — Stats: three figures in one row, hairline-divided. Digits roll like an odometer when the row scrolls into view. */
import { motion } from "motion/react";
import { KineticNumber } from "@/components/motion";
import { stats } from "@/lib/content";

export function Stats() {
  return (
    <section className="bg-white pb-14 text-ink md:pb-20" aria-label="Orhanza at a glance">
      <div className="container-x">
        <ul className="grid border-t hairline md:grid-cols-3">
          {stats.map((s, i) => (
            <motion.li
              key={s.title}
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.5 }}
              transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1], delay: 0.08 * i }}
              className="border-b hairline py-8 md:border-b-0 md:py-12 md:[&:not(:first-child)]:border-l md:[&:not(:first-child)]:pl-10 hairline"
            >
              <KineticNumber value={s.value} suffix={s.suffix || undefined} stagger={0.09} duration={1.1} className="text-[clamp(4.5rem,9vw,9rem)] font-extrabold tracking-[-0.04em]" />
              <h3 className="mt-5 text-lg font-semibold tracking-[-0.01em]">{s.title}</h3>
            </motion.li>
          ))}
        </ul>
      </div>
    </section>
  );
}
