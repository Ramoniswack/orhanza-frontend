"use client";

/** G — BgFlip: hard colour cuts at section boundaries (no gradient). Optionally pushes the outgoing content up and clips it at the boundary. */
import { motion, useReducedMotion, useScroll, useTransform } from "motion/react";
import { useRef, type ReactNode } from "react";

export function BgFlip({ tone, children, className = "", id, pushUp = false }: { tone: "dark" | "light"; children: ReactNode; className?: string; id?: string; pushUp?: boolean }) {
  const ref = useRef<HTMLElement>(null);
  const reduce = useReducedMotion();
  const { scrollYProgress } = useScroll({ target: ref, offset: ["end 100%", "end 0%"] });
  const y = useTransform(scrollYProgress, [0, 1], ["0vh", "-14vh"]);
  const palette = tone === "dark" ? "bg-[#050506] text-[#EDE5D6]" : "bg-white text-[#1B1B1D]";

  return (
    <section ref={ref} id={id} className={`relative overflow-clip ${palette} ${className}`}>
      {pushUp && !reduce ? <motion.div style={{ y }}>{children}</motion.div> : children}
    </section>
  );
}
