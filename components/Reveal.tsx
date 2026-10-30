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
      <h2 className="h-section mt-3">{title}</h2>
      {children && <div className={`mt-5 text-body leading-relaxed ${light ? "text-[#f4f4f4]/75" : "text-[#6f6f6f]"}`}>{children}</div>}
    </Reveal>
  );
}
