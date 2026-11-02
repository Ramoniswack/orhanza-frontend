"use client";

import { motion } from "motion/react";
import type { ReactNode } from "react";

export const EASE = [0.76, 0, 0.24, 1] as const;

export function Reveal({ children, delay = 0, className = "", y = 36 }: { children: ReactNode; delay?: number; className?: string; y?: number }) {
  return (
    <motion.div
      className={className}
      initial={{ opacity: 0, y }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-80px" }}
      transition={{ duration: 0.9, ease: [0.22, 1, 0.36, 1], delay }}
    >
      {children}
    </motion.div>
  );
}

export function SectionHeading({ eyebrow, title, children, align = "left", light = false }: { eyebrow?: string; title: string; children?: ReactNode; align?: "left" | "center"; light?: boolean }) {
  return (
    <Reveal className={align === "center" ? "mx-auto max-w-3xl text-center" : "max-w-3xl"}>
      {eyebrow && <p className={`eyebrow ${light ? "text-gold" : "text-gold"}`}>{eyebrow}</p>}
      <h2 className="h-display mt-3 text-[clamp(2.4rem,4.8vw,4.4rem)]">{title}</h2>
      {children && <div className={`mt-5 text-base leading-relaxed md:text-lg ${light ? "text-ivory/75" : "text-slate"}`}>{children}</div>}
    </Reveal>
  );
}
