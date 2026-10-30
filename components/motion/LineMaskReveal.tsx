"use client";

/** A — LineMaskReveal: each line lives in an overflow:hidden wrapper and rises 100% → 0 with opacity + blur(6px → 0). */
import { motion, useReducedMotion } from "motion/react";
import type { CSSProperties, ReactNode } from "react";

export const EASE_OUT = [0.22, 1, 0.36, 1] as const;

type MaskLineProps = {
  children: ReactNode;
  index?: number;
  stagger?: number;
  delay?: number;
  className?: string;
  style?: CSSProperties;
  /** "inView" plays when scrolled into view; "mount" plays when `play` becomes true (time-based intros). */
  mode?: "inView" | "mount";
  play?: boolean;
  amount?: number;
};

export function MaskLine({ children, index = 0, stagger = 0.12, delay = 0, className = "", style, mode = "inView", play = true, amount = 0.6 }: MaskLineProps) {
  const reduce = useReducedMotion();
  const from = reduce ? { opacity: 0 } : { y: "100%", opacity: 0, filter: "blur(6px)" };
  const to = reduce ? { opacity: 1 } : { y: "0%", opacity: 1, filter: "blur(0px)" };
  const transition = { duration: reduce ? 0.4 : 0.9, ease: EASE_OUT, delay: delay + index * stagger };

  return (
    <span className={`block overflow-hidden pb-[0.08em] -mb-[0.08em] ${className}`} style={style}>
      {mode === "inView" ? (
        <motion.span className="inline-block" initial={from} whileInView={to} viewport={{ once: true, amount }} transition={transition}>
          {children}
        </motion.span>
      ) : (
        <motion.span className="inline-block" initial={from} animate={play ? to : from} transition={transition}>
          {children}
        </motion.span>
      )}
    </span>
  );
}

export function LineMaskReveal({
  lines,
  className = "",
  lineClassName = "",
  stagger = 0.12,
  delay = 0,
  mode = "inView",
  play = true,
  as: Tag = "span",
}: {
  lines: ReactNode[];
  className?: string;
  lineClassName?: string;
  stagger?: number;
  delay?: number;
  mode?: "inView" | "mount";
  play?: boolean;
  as?: "span" | "h1" | "h2" | "h3" | "p" | "div";
}) {
  return (
    <Tag className={`block ${className}`}>
      {lines.map((l, i) => (
        <MaskLine key={i} index={i} stagger={stagger} delay={delay} mode={mode} play={play} className={lineClassName}>
          {l}
        </MaskLine>
      ))}
    </Tag>
  );
}
