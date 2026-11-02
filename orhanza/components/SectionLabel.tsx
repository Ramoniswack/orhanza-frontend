"use client";

import { motion } from "motion/react";

const Star = () => (
  <svg viewBox="0 0 24 24" className="h-3 w-3 fill-gold" aria-hidden>
    <rect x="5" y="5" width="14" height="14" />
    <rect x="5" y="5" width="14" height="14" transform="rotate(45 12 12)" />
  </svg>
);

/** Section label pattern: 8-point star + label at left; toggle pill + caption + tagline at right. Fades up with the section. */
export function SectionLabel({ label, dark = false }: { label: string; dark?: boolean }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 18 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.8 }}
      transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
      className={`flex items-start justify-between gap-6 ${dark ? "text-ivory" : "text-ink"}`}
    >
      <p className="label-micro flex items-center gap-2 font-semibold"><Star />{label}</p>
    </motion.div>
  );
}
