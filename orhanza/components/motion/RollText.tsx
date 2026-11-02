"use client";

/**
 * RollText — kinetic text. Each letter is a two-high column; when the nearest `.group` is hovered/focused (or `active` is true)
 * the letters roll up and the duplicate rolls in from below, staggered left → right. Same mechanical feel as KineticNumber.
 */
import { motion } from "motion/react";

const EASE = [0.22, 1, 0.36, 1] as const;

export function RollText({ children, active, className = "", stagger = 0.018 }: { children: string; active?: boolean; className?: string; stagger?: number }) {
  const chars = Array.from(children);
  const controlled = active !== undefined;
  return (
    <span className={`inline-flex whitespace-pre ${className}`} aria-label={children}>
      {chars.map((c, i) => (
        <span key={i} aria-hidden className="relative inline-block overflow-hidden pb-[0.12em] -mb-[0.12em] align-bottom leading-[1.05]">
          <motion.span
            className="block"
            initial={false}
            animate={controlled ? { y: active ? "-100%" : "0%" } : undefined}
            transition={{ duration: 0.55, ease: EASE, delay: i * stagger }}
            style={controlled ? undefined : { transitionDelay: `${i * stagger}s` }}
            {...(controlled ? {} : { className: "block transition-transform duration-[550ms] ease-[cubic-bezier(.22,1,.36,1)] group-hover:-translate-y-full group-focus-visible:-translate-y-full" })}
          >
            {c === " " ? " " : c}
          </motion.span>
          <motion.span
            aria-hidden
            className="absolute inset-x-0 top-full block"
            initial={false}
            animate={controlled ? { y: active ? "-100%" : "0%" } : undefined}
            transition={{ duration: 0.55, ease: EASE, delay: i * stagger }}
            style={controlled ? undefined : { transitionDelay: `${i * stagger}s` }}
            {...(controlled ? {} : { className: "absolute inset-x-0 top-full block transition-transform duration-[550ms] ease-[cubic-bezier(.22,1,.36,1)] group-hover:-translate-y-full group-focus-visible:-translate-y-full" })}
          >
            {c === " " ? " " : c}
          </motion.span>
        </span>
      ))}
    </span>
  );
}
