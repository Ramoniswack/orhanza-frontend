"use client";

import { motion } from "motion/react";
import { services } from "@/lib/data";
import { SectionHeading } from "./Reveal";

export function Services() {
  return (
    <section className="container-x py-24 md:py-32" aria-labelledby="services">
      <span id="services" className="sr-only">Services</span>
      <SectionHeading eyebrow="Services" title="Everything a considered wardrobe needs." />
      <ul className="mt-14 border-t border-[#111]/15">
        {services.map((s, i) => (
          <motion.li
            key={s.title}
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-60px" }}
            transition={{ duration: 0.8, delay: i * 0.05, ease: [0.22, 1, 0.36, 1] }}
            whileHover="hover"
            className="group grid cursor-default grid-cols-[3rem_1fr] items-baseline gap-4 border-b border-[#111]/15 py-7 md:grid-cols-[4rem_1.1fr_1.4fr]"
          >
            <span className="text-meta text-gold">{String(i + 1).padStart(2, "0")}</span>
            <motion.h3 variants={{ hover: { x: 10 } }} transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }} className="h-section text-3xl md:text-4xl">
              {s.title}
            </motion.h3>
            <p className="col-start-2 text-body text-[#6f6f6f] md:col-start-3">{s.body}</p>
          </motion.li>
        ))}
      </ul>
    </section>
  );
}
