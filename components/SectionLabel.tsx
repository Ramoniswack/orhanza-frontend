"use client";

import { motion } from "motion/react";

const Star = () => (
  <svg viewBox="0 0 24 24" className="h-3 w-3 fill-gold" aria-hidden>
    <rect x="5" y="5" width="14" height="14" />
    <rect x="5" y="5" width="14" height="14" transform="rotate(45 12 12)" />
  </svg>
);

/** Section label pattern: 8-point star + label at left; toggle pill + caption + tagline at right. Fades up with the section. */
export function SectionLabel({ label, tagline = "Tailoring made personal.", dark = false }: { label: string; tagline?: string; dark?: boolean }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 18 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.8 }}
      transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
      className={`flex items-start justify-between gap-6 ${dark ? "text-ivory" : "text-ink"}`}
    >
      <p className="label-micro flex items-center gap-2 font-semibold"><Star />{label}</p>
      <div className="flex items-center gap-3 text-right">
        <span className={`relative hidden h-3.5 w-7 rounded-full sm:block ${dark ? "bg-ivory/25" : "bg-black/15"}`} aria-hidden>
          <span className="absolute right-0.5 top-0.5 h-2.5 w-2.5 rounded-full bg-gold" />
        </span>
        <span className="label-micro hidden text-mute sm:block">बेस्पोक टेलरिङ</span>
        <span className="max-w-[10rem] text-[11px] leading-tight text-mute">{tagline}</span>
      </div>
    </motion.div>
  );
}
