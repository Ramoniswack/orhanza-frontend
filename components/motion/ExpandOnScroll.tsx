"use client";

/** F — ExpandOnScroll: an inset block (≈6vw margin) opens to full-bleed as its centre meets the viewport centre, holds, then eases back. */
import { motion, useReducedMotion, useScroll, useTransform } from "motion/react";
import { useRef, type ReactNode } from "react";

export function ExpandOnScroll({ children, className = "h-[100svh]", inset = 6 }: { children: ReactNode; className?: string; inset?: number }) {
  const ref = useRef<HTMLDivElement>(null);
  const reduce = useReducedMotion();
  const { scrollYProgress: p } = useScroll({ target: ref, offset: ["start end", "end start"] });
  const gap = useTransform(p, [0.12, 0.4, 0.6, 0.88], [inset, 0, 0, inset]);
  const clipPath = useTransform(gap, (g) => `inset(${g}vw ${g}vw ${g}vw ${g}vw)`);
  const scale = useTransform(p, [0.12, 0.4, 0.6, 0.88], [1.12, 1, 1, 1.12]);

  return (
    <div ref={ref} className={`relative ${className}`}>
      <motion.div style={reduce ? undefined : { clipPath }} className="absolute inset-0 overflow-hidden">
        <motion.div style={reduce ? undefined : { scale }} className="h-full w-full">
          {children}
        </motion.div>
      </motion.div>
    </div>
  );
}
